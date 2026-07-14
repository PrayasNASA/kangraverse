import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KangraVerse",
  description: "A 3D Digital Heritage Explorer of Kangra District",
};

import { Viewport } from 'next';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://unpkg.com/cesium@1.143.0/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Script src="https://unpkg.com/cesium@1.143.0/Build/Cesium/Cesium.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
