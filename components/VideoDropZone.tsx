// app/components/VideoDropzone.tsx
'use client';

import {useState, useCallback, useEffect} from 'react';
import { Upload, Film, X, Play, Pause, Volume2, Maximize, Download, Clock, FileVideo } from 'lucide-react';


interface VideoDropzoneProps {
    onVideoUploaded: (isUploaded: boolean) => void; // Change to accept boolean
    onVideoURLChange: (url: string) => void;

}

export function VideoDropzone({ onVideoUploaded, onVideoURLChange }: VideoDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [videoName, setVideoName] = useState<string | null>(null);
    const [videoSize, setVideoSize] = useState<number>(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setError(null);

        const files = Array.from(e.dataTransfer.files);
        console.log(files)
        console.log(e.dataTransfer.files)
        handleFiles(files);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(files);
    };

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!file.type.startsWith('video/')) {
            setError('Please upload a video file');
            return;
        }

        // Validate file size (e.g., 500MB limit)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            setError('Video file too large. Maximum size is 500MB');
            return;
        }
        setIsUploading(true)

        const videoInfo = await uploadVideo(file, setUploadProgress)

        setIsUploading(false);
        setVideoUrl(videoInfo.URL);
        setVideoName(videoInfo.fileName);
        setVideoSize(videoInfo.size)
    };

    const uploadVideo = async (file: File, progress: (progress: number) => void) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('api/upload-video', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error(response.statusText);

        const results = await response.json();
        console.log(results)
        return results;
    }

    const removeVideo = () => {
        if (videoUrl) {
            URL.revokeObjectURL(videoName);
        }
        setVideoSize(0);
        setVideoName(null)
        setVideoUrl(null);
        setError(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        console.log(videoUrl);
        if (videoUrl) console.log("there")

        const hasVideo = videoUrl !== null && videoUrl !== undefined && videoUrl.length > 0;
        console.log(hasVideo);
        onVideoUploaded(hasVideo);
        onVideoURLChange(videoUrl!)

    }, [videoUrl]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {!videoName ? (
                // Enhanced Dropzone UI
                <div className="relative">
                    {/* Upload Progress Overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto">
                                    <svg className="w-16 h-16 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-900">Uploading video...</p>
                                    <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-2xl p-16 transition-all duration-300 cursor-pointer
                            group hover:shadow-lg
                            ${isDragging
                            ? 'border-blue-400 bg-blue-50 shadow-blue-100 shadow-xl scale-[1.01]'
                            : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50'
                        }
                        `}
                    >
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploading}
                        />

                        <div className="flex flex-col items-center justify-center space-y-6">
                            {/* Icon */}
                            <div className={`
                                p-6 rounded-full transition-all duration-300
                                ${isDragging
                                ? 'bg-blue-100 scale-110 shadow-lg'
                                : 'bg-white shadow-md group-hover:shadow-lg group-hover:scale-105'
                            }
                            `}>
                                {isDragging ? (
                                    <Film className="w-12 h-12 text-blue-600"/>
                                ) : (
                                    <Upload className="w-12 h-12 text-gray-600 group-hover:text-blue-600 transition-colors"/>
                                )}
                            </div>

                            {/* Text */}
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {isDragging ? 'Drop your video here' : 'Upload your video'}
                                </h3>
                                <p className="text-gray-600">
                                    Drag and drop your video file here, or{' '}
                                    <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                                        browse
                                    </span>{' '}
                                    to select
                                </p>

                                {/* Supported formats */}
                                <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <FileVideo className="w-4 h-4" />
                                        <span>MP4, MOV, AVI, WebM</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>Max 500MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                                    <X className="w-3 h-3 text-red-600" />
                                </div>
                                <p className="text-red-800 font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Enhanced Video Preview UI
                <div className="space-y-6">
                    {/* Video Info Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Film className="w-6 h-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{videoName}</h3>
                                        <p className="text-gray-600">{formatFileSize(videoSize)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={removeVideo}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                                    title="Remove video"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-500"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="aspect-video bg-black relative">
                            <video
                                src={`/api/videos/${videoUrl}`}
                                controls
                                className="w-full h-full object-contain"
                                style={{ maxHeight: '600px' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center space-x-2"
                            onClick={() => console.log('Process video:', videoName)}
                        >
                            <Play className="w-5 h-5" />
                            <span>Start Editing</span>
                        </button>

                        <button
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center space-x-2"
                            onClick={() => console.log('Download video:', videoName)}
                        >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                        </button>
                    </div>

                    {/* Upload New Video */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <button
                            onClick={removeVideo}
                            className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Upload a different video
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}