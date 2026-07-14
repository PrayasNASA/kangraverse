import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Gemini API key is not configured.' },
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

    const latestMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'System Instruction: You are an AI assistant for KangraVerse, a 3D GIS explorer application focused on the Kangra region of Himachal Pradesh. Your goal is to help users understand the region, its temples, monasteries, forts, and trekking routes. Be friendly, concise, and highly informative about the local culture and geography. Always respond using markdown if formatting is needed.' }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am the KangraVerse AI Assistant, ready to help users explore the Kangra region!' }]
        },
        ...history
      ],
    });

    const result = await chat.sendMessage(latestMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during chat' },
      { status: 500 }
    );
  }
}
