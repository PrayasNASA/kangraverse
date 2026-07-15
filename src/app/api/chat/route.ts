import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'Groq API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required.' },
        { status: 400 }
      );
    }

    // Convert messages to standard format
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    }));

    const systemMessage = {
      role: 'system',
      content: 'You are an AI assistant for KangraVerse, a 3D GIS explorer application focused on the Kangra region of Himachal Pradesh. Your goal is to help users understand the region, its temples, monasteries, forts, and trekking routes. Be friendly, concise, and highly informative about the local culture and geography. Always respond using markdown if formatting is needed.'
    };

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [systemMessage, ...formattedMessages],
    });

    const text = response.choices[0]?.message?.content || '';

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during chat' },
      { status: 500 }
    );
  }
}
