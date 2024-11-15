// src/app/layout.tsx
'use client';
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            <title>Body Check</title>
            <meta name="description" content="Body Check Application" />
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}
