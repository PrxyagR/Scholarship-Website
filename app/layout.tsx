import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14433b',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://maplepath.site'),
  title: 'MaplePath | High School Scholarships, Internships & Competitions in Canada',
  description:
    'A free, hand-verified directory of scholarships, academic competitions, and internships curated for Canadian high school students in Grades 9–12.',
  keywords: [
    'Canadian scholarships',
    'high school internships Canada',
    'student competitions Canada',
    'math contests high school',
    'MaplePath',
  ],
  openGraph: {
    title: 'MaplePath | High School Scholarships, Internships & Competitions in Canada',
    description: 'A free, curated directory of opportunities for Canadian high school students in Grades 9–12.',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'MaplePath opportunity directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaplePath | High School Scholarships, Internships & Competitions in Canada',
    description: 'A free, curated directory of opportunities for Canadian high school students in Grades 9–12.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: '/',
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
