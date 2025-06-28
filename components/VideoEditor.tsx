// components/VideoEditorClient.tsx
'use client';

import { useState } from 'react';
import { VideoDropzone } from './VideoDropZone';
import { VideoChat } from './VideoChat';

export function VideoEditor() {
    const [isVideo, setIsVideo] = useState(false);
    const [videoURL, setVideoURL] = useState('');

    return (
        <>
            <div className="flex gap-6 px-4">
                <div className="flex-1">
                    <VideoDropzone
                        onVideoUploaded={(hasVideo) => setIsVideo(hasVideo)}
                        onVideoURLChange={(videoURL) => setVideoURL(videoURL)}
                    />
                </div>
            </div>

            <VideoChat
                isOn={isVideo}
                videoURL = {videoURL}
            />
        </>
    );
}