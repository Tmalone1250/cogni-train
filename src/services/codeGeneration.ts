import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

interface BugLocation {
  line: number;
  type: 'syntax' | 'logic' | 'security' | 'performance';
}

interface CodeSnippet {
  id: string;
  language: string;
  original_code: string;
  flawed_code: string;
  bug_locations: BugLocation[];
  difficulty: number;
}

const DIFFICULTY_TEMPLATES = {
  1: {
    prompt: "Generate a simple 10-20 line Python code snippet with basic syntax errors (missing semicolons, wrong indentation). Include the correct version and list the bug locations with their types.",
    languages: ['python', 'javascript'],
    bugs: ['syntax']
  },
  2: {
    prompt: "Generate a 30-50 line code snippet with basic logic flaws (off-by-one errors, unused variables). Include the correct version and list the bug locations with their types.",
    languages: ['python', 'javascript', 'typescript'],
    bugs: ['logic', 'syntax']
  },
  3: {
    prompt: "Generate a 50-80 line code snippet with security issues (SQL injection, hardcoded secrets). Include the correct version and list the bug locations with their types.",
    languages: ['python', 'javascript', 'typescript', 'java'],
    bugs: ['security', 'logic']
  },
  4: {
    prompt: "Generate a 100+ line code snippet with concurrency issues (race conditions, deadlocks). Include the correct version and list the bug locations with their types.",
    languages: ['python', 'javascript', 'typescript', 'java', 'go'],
    bugs: ['performance', 'security']
  },
  5: {
    prompt: "Generate a 200+ line mini-project with architectural issues (circular dependencies, interface violations). Include the correct version and list the bug locations with their types.",
    languages: ['python', 'javascript', 'typescript', 'java', 'go'],
    bugs: ['performance', 'security', 'logic']
  }
};

export async function generateCodeSnippet(
  difficulty: number,
  language: string
): Promise<CodeSnippet> {
  try {
    const template = DIFFICULTY_TEMPLATES[difficulty as keyof typeof DIFFICULTY_TEMPLATES];
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
Generate a code snippet in ${language} with intentional bugs based on this difficulty level:
${template.prompt}

IMPORTANT: Your response must be valid JSON in exactly this format:
{
  "original_code": "code without bugs",
  "flawed_code": "code with intentional bugs",
  "bug_locations": [
    {
      "line": number,
      "type": "syntax" | "logic" | "security" | "performance"
    }
  ]
}

Make sure to:
1. Escape all special characters in the code strings
2. Use double quotes for JSON properties
3. Format the response as a single, valid JSON object
4. Include line numbers starting from 1
5. Only use the bug types listed above`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean up the response text to ensure valid JSON
      const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
      const data = JSON.parse(jsonStr);

      // Validate the response structure
      if (!data.original_code || !data.flawed_code || !Array.isArray(data.bug_locations)) {
        throw new Error('Invalid response structure');
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        language,
        original_code: data.original_code,
        flawed_code: data.flawed_code,
        bug_locations: data.bug_locations,
        difficulty
      };
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw response:', text);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error generating code snippet:', error);
    throw error;
  }
}

export async function generateMultipleSnippets(
  difficulty: number,
  language: string,
  count: number = 3
): Promise<CodeSnippet[]> {
  const snippets = [];
  for (let i = 0; i < count; i++) {
    try {
      const snippet = await generateCodeSnippet(difficulty, language);
      snippets.push(snippet);
    } catch (error) {
      console.error(`Error generating snippet ${i + 1}:`, error);
    }
  }
  return snippets;
}

export function getDifficultyLevels() {
  return [
    { value: 1, label: 'Junior (Basic Syntax)' },
    { value: 2, label: 'Mid-Level (Logic Flaws)' },
    { value: 3, label: 'Senior (Security Issues)' },
    { value: 4, label: 'Staff (Concurrency)' },
    { value: 5, label: 'Principal (Architecture)' }
  ];
}

export function getLanguages(difficulty: number): string[] {
  return DIFFICULTY_TEMPLATES[difficulty as keyof typeof DIFFICULTY_TEMPLATES]?.languages || ['python'];
}
