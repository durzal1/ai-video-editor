// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Semantic Video Editor',
    description: 'Edit videos using natural language',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
        <body className="bg-zinc-950 text-zinc-100">
        {children}
        </body>
        </html>
    )
}