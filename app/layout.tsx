import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoleMetro — Open-Source Mailmeteor for Startup Job Outreach',
  description: 'Upload your resume, find high-signal startup engineering roles, generate minimal anti-cliché cold emails, and launch founder outreach campaigns with 1-click Gmail drafts.',
  keywords: ['Mailmeteor for jobs', 'cold email startups', 'startup jobs', 'cover letter generator', 'open source', 'founder outreach'],
  authors: [{ name: 'Bhavuk Arora', url: 'https://bhavuk.website' }],
  openGraph: {
    title: 'RoleMetro — Mailmeteor for Startup Roles',
    description: 'High-conversion cold pitch generator & batch founder outreach engine for startup builders.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
