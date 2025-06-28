// components/VideoChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface chatOpen{
    isOn: boolean;
    videoURL: string;
}

export function VideoChat({isOn, videoURL}: chatOpen) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'How can I help edit your video?',
        },

    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setIsOpen(isOn)
    }, [isOn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages([...messages, newMessage]);
        setInput('');

        console.log(messages);
        console.log(videoURL)

        const response = await fetch('http://localhost:5000/api/process-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 'Find moments with people talking',
            }),
        });

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();

        console.log(data);





        // Simulate assistant response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'I understand. Let me help you with that...',
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
    };

    return (
        <>
            {/* Chat Panel - Enhanced Dark Theme */}
            <div
                className={cn(
                    "fixed right-0 top-0 h-screen bg-gray-900/95 backdrop-blur-2xl border-l border-gray-700/30 flex flex-col transition-all duration-300 ease-out shadow-2xl",
                    isOpen ? 'w-[420px]' : 'w-0'
                )}
            >
                <div className={cn(
                    "flex flex-col h-full",
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
                    "transition-opacity duration-200"
                )}>
                    {/* Header - Dark Theme */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/40 bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                                <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                            </div>
                            <span className="text-gray-300 text-sm font-medium tracking-tight">Online</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-gray-700/50 rounded-lg"
                        >
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Messages - Dark Theme */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-900/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                                    message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                                )}
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-3 shadow-lg",
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white shadow-blue-600/20'
                                            : 'bg-gray-800/90 text-gray-100 ring-1 ring-gray-600/30 shadow-gray-900/30'
                                    )}
                                >
                                    <p className={cn(
                                        "text-sm leading-relaxed tracking-normal",
                                        message.role === 'user' ? 'font-medium' : ''
                                    )}>
                                        {message.content}
                                    </p>
                                </div>
                            </div>


                            ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input - Dark Theme */}
                    <form onSubmit={handleSubmit} className="p-6 border-t border-gray-700/40 bg-gray-800/30">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Tell me what to edit..."
                                className={cn(
                                    "w-full bg-gray-800/70 text-gray-100 text-base rounded-xl px-4 py-3.5 pr-12",
                                    "border border-gray-600/40 focus:border-gray-500 focus:outline-none",
                                    "placeholder-gray-400 transition-all duration-200",
                                    "focus:shadow-[0_0_0_3px_rgba(55,65,81,0.4)] focus:bg-gray-800/90"
                                )}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2",
                                    "text-gray-400 hover:text-gray-200 disabled:opacity-0",
                                    "transition-all duration-200 p-2 rounded-lg",
                                    "hover:bg-gray-700/50 disabled:hover:bg-transparent",
                                    input.trim() ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                                )}
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toggle Button - Dark Theme */}
            {!isOpen && isOn && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "fixed right-6 top-6 z-50",
                        "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100",
                        "p-3.5 rounded-xl transition-all duration-200",
                        "shadow-lg hover:shadow-xl border border-gray-600/50",
                        "animate-in fade-in-0 slide-in-from-right-4 duration-300"
                    )}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12H16M8 8H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
            )}
        </>
    );
}