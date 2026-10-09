import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoleMetro — Startup Outreach & Bulk Application Engine',
  description: 'Upload your resume, analyze skills, match curated startup engineering roles, and bulk send minimal cold emails with Google Sign-In and Mailmeteor dispatch.',
  keywords: ['startup outreach', 'cold email startups', 'startup jobs', 'minimal cover letter', 'open source', 'founder outreach'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-white text-zinc-950 antialiased selection:bg-zinc-200">
        {children}
      </body>
    </html>
  );
}
