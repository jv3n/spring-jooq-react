import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <body>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/countries">Countries</Link>
      </nav>
      <main style={{ padding: '1rem' }}>{children}</main>
      </body>
      </html>
  );
}
