// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mikando Chicken & Take Away — Mwani, Masaka',
  description:
    'Fast, fresh chicken in the heart of Masaka. Dine in or takeaway. Crispy chips, juicy chicken. Open 24 hours.',
  keywords: 'chicken, takeaway, Masaka, Uganda, Mwani, chips, fast food',
  openGraph: {
    title: 'Mikando Chicken & Take Away',
    description: 'Crispy Chips. Juicy Chicken. Masaka's favourite spot.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#D32F2F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
