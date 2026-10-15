import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PT. Putra Saijaan Mandiri — Surat Jalan & Margin Calculator',
  description:
    'Sistem Manajemen Surat Jalan BBM dan Kalkulator Margin Operasional Truk PT. Putra Saijaan Mandiri Kotabaru, Kalimantan Selatan',
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
    <html lang="id" className="h-full bg-slate-950 text-slate-100 antialiased">
      <body className="min-h-full flex flex-col font-sans selection:bg-rose-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
