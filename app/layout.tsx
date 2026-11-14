import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PROOFCHAIN.AI — The AI That Detects Fake Progress & Helps Fix It',
  description:
    'Autonomous AI software auditing, verification, diagnosis, and recovery platform powered by Google Gemini.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070B14] text-slate-100 min-h-screen antialiased bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}

