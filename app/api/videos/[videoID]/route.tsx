// app/api/videos/[videoId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: { videoID: string } }
) {
    try {
        const { videoID } = await params;
        console.log(videoID)
        // Find the video file in uploads directory
        const uploadsDir = path.join(process.cwd(), 'uploads');
        console.log(uploadsDir)
        const files = await readdir(uploadsDir);
        console.log(files)
        const videoFile = files.find(file => file.startsWith(videoID));

        if (!videoFile) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const filePath = path.join(uploadsDir, videoFile);
        const fileStats = await stat(filePath);
        const fileBuffer = await readFile(filePath);

        console.log(videoFile)
        // Return video with proper headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Length': fileStats.size.toString(),
                'Accept-Ranges': 'bytes', // Enables video seeking
            },
        });

    } catch (error) {
        console.error('Error serving video:', error);
        return NextResponse.json({ error: 'Error serving video' }, { status: 500 });
    }
}