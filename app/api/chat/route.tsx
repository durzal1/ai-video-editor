// app/api/chat/route.ts (for Next.js 13+ App Router)
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {message} = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'No user message found' },
                { status: 400 }
            );
        }

        const response = await fetch('/api/videos/', {



            //
        // // Return the response
        // return NextResponse.json({
        //     response: extractedInfo.response,
        //     metadata: extractedInfo.metadata, // Any extracted entities, intents, etc.
        // });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
