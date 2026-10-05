import { NextResponse } from 'next/server';

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

function detectMimeType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.gif')) return 'image/gif';
  if (name.endsWith('.pdf')) return 'application/pdf';
  return 'image/jpeg';
}

function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present (e.g. ```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Find boundaries of the JSON object or array
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleaned.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please configure GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;

    if (!file && (!text || !text.trim())) {
      return NextResponse.json(
        { error: 'Please upload an image/PDF or provide question text.' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert exam paper analyzer and mock test generator.
Analyze the provided material (image/document/text) and extract all questions, exercises, or study items.
Convert each question into a high-quality Multiple Choice Question (MCQ) with exactly 4 options.

Guidelines:
1. If the item is already an MCQ, preserve its question text and options, and mark the correct option.
2. If it is a descriptive question, problem, definition, or fill-in-the-blank, formulate a clear MCQ based on it.
3. Every question must have exactly 4 options.
4. "correct" MUST strictly match the exact string of one of the 4 options.
5. Provide a clear, educational "explanation" for why the answer is correct.
6. Provide at least 1 and up to 25 questions depending on what is visible in the material.

Return strictly a JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": "Option A text",
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}
`;

    const parts: any[] = [{ text: prompt }];

    if (file && file.size > 0) {
      const mimeType = detectMimeType(file);
      const bytes = await file.arrayBuffer();
      const base64Data = Buffer.from(bytes).toString('base64');

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    if (text && text.trim()) {
      parts.push({
        text: `Here is the question text to process:\n\n${text.trim()}`,
      });
    }

    const requestBody = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    };

    let responseText: string | null = null;
    let lastError: string | null = null;

    // Try available models in order of performance and availability
    for (const model of CANDIDATE_MODELS) {
      try {
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const result = await response.json();
          const textCandidate = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textCandidate) {
            responseText = textCandidate;
            break;
          }
        } else {
          const errorBody = await response.text();
          console.warn(`Model ${model} returned ${response.status}: ${errorBody}`);
          lastError = `Model ${model} error (${response.status}): ${errorBody}`;
        }
      } catch (err: any) {
        console.warn(`Fetch to model ${model} failed:`, err);
        lastError = err.message || 'Network request failed';
      }
    }

    if (!responseText) {
      throw new Error(lastError || 'Could not generate questions from AI models.');
    }

    const parsed = cleanAndParseJson(responseText);
    const rawQuestions = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
      ? parsed.questions
      : [];

    if (rawQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions could be extracted from the uploaded image. Please ensure questions are clearly visible and try again.' },
        { status: 422 }
      );
    }

    // Sanitize and format each question
    const questions = rawQuestions.map((q: any, index: number) => {
      let options: string[] = Array.isArray(q.options)
        ? q.options.map((opt: any) => String(opt).trim())
        : [];

      // Ensure 4 options
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }
      if (options.length > 4) {
        options = options.slice(0, 4);
      }

      let correct = String(q.correct || '').trim();

      // If correct answer is a letter like "A" or "Option A"
      if (/^[A-D]$/i.test(correct)) {
        const idx = correct.toUpperCase().charCodeAt(0) - 65;
        if (options[idx]) correct = options[idx];
      } else if (!options.includes(correct)) {
        const found = options.find((opt) =>
          opt.toLowerCase().includes(correct.toLowerCase()) ||
          correct.toLowerCase().includes(opt.toLowerCase())
        );
        correct = found || options[0];
      }

      const qText = String(q.question || q.text || `Question ${index + 1}`).trim();
      const explanation = String(
        q.explanation || `The correct answer is "${correct}".`
      ).trim();

      return {
        id: index + 1,
        question: qText,
        text: qText, // ensure compatibility across review and test interfaces
        options,
        correct,
        explanation,
      };
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Question extraction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract questions.' },
      { status: 500 }
    );
  }
}
