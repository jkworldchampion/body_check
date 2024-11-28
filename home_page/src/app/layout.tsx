// src/app/layout.tsx
'use client';
import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";

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
        <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
        </body>
        </html>
    );
}

