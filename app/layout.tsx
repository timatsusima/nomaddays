import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NomadDays - Digital Nomad Travel Tracker',
  description:
    'Отслеживайте дни по странам и планируйте поездки с учётом правил резиденции',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
        {/* Принудительное обновление CSS */}
        <link rel="stylesheet" href="/globals.css?v=2" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
