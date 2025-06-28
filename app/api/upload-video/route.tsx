// app/api/upload-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const video = formData.get('file') as File;

        if (!video) {
            return NextResponse.json({ error: 'No video provided' }, { status: 400 });
        }

        // Generate unique ID
        const videoId = uuidv4();
        const fileName = `${videoId}-${video.name}`;
        const filePath = path.join(process.cwd(), 'uploads', fileName);



        // Save video to disk (may change this to cloud service eventually)
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);


        // Save metadata to database ( don't see the purpose of this right now)
        // await saveVideoMetadata({
        //     id: videoId,
        //     originalName: video.name,
        //     fileName: fileName,
        //     size: video.size,
        //     uploadedAt: new Date(),
        // });
        console.log(videoId)

        return NextResponse.json({URL: fileName, ID: videoId, fileName: video.name, size: video.size});
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}