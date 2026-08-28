import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaplePath | Find scholarships, internships & competitions',
  description:
    'A curated directory of scholarships, internships, and competitions for Canadian high school students in Grades 9–12.',
  keywords: ['Canadian scholarships', 'high school internships', 'student competitions', 'MaplePath'],
  openGraph: {
    title: 'MaplePath | Find scholarships, internships & competitions',
    description: 'A clearer way for Canadian high-school students to find their next opportunity.',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'MaplePath opportunity directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaplePath | Find scholarships, internships & competitions',
    description: 'A clearer way for Canadian high-school students to find their next opportunity.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
