import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Mission Control - Emergency Medical Logistics',
  description: 'High-fidelity emergency medical logistics dashboard with real-time weather, traffic, and AI-powered routing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a0a] font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
