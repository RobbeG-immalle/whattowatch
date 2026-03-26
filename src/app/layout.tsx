import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/providers/SessionProvider';
import ToastProvider from '@/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'WhatToWatch - AI Movie Recommendations',
  description: 'Get personalized movie recommendations powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProvider>
          {children}
          <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
