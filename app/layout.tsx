import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ati US AR Dashboard',
  description: 'Accounts Receivable Dashboard - Ati Motors Inc (US)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{backgroundColor: '#0b0f14', color: '#e2e8f0'}}>
        {children}
      </body>
    </html>
  );
}
