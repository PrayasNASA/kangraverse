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
    
    // Remove the initial model greeting to ensure history alternates correctly and starts with user
    let historyMessages = messages.slice(0, -1);
    if (historyMessages.length > 0 && historyMessages[0].role === 'model' && historyMessages[0].content.includes('Hi there!')) {
      historyMessages = historyMessages.slice(1);
    }

    const history = historyMessages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: 'You are an AI assistant for KangraVerse, a 3D GIS explorer application focused on the Kangra region of Himachal Pradesh. Your goal is to help users understand the region, its temples, monasteries, forts, and trekking routes. Be friendly, concise, and highly informative about the local culture and geography. Always respond using markdown if formatting is needed.'
    });

    const chat = model.startChat({
      history: history,
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
