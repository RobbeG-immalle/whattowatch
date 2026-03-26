import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

export async function getMovieRecommendations(prompt: string): Promise<string[]> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a movie recommendation expert. When given a description of what kind of movie someone wants to watch, you respond with a JSON array of 6-8 movie titles that best match their request. Only respond with the JSON array, nothing else. Example: ["The Dark Knight", "Inception", "Memento"]`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) return [];

  try {
    const titles = JSON.parse(content);
    return Array.isArray(titles) ? titles : [];
  } catch {
    // Try to extract array from response
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}
