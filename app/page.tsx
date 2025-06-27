// app/page.tsx
import { VideoDropzone } from '../components/VideoDropZone';
import { VideoChat } from '../components/VideoChat';

export default async function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="container mx-auto py-12 pr-0 lg:pr-[420px] transition-all duration-300">
                <div className="text-center mb-12 px-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Semantic Video Editor
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload a video and use natural language to edit it.
                        Just tell me what parts to remove or keep!
                    </p>
                </div>

                {/* Main content area with flex layout */}
                <div className="flex gap-6 px-4">
                    {/* Video dropzone takes remaining space */}
                    <div className="flex-1">
                        <VideoDropzone />
                    </div>
                </div>
            </div>

            {/* Chat component */}
            <VideoChat />
        </main>
    );
}