import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'LalBindu — Every Drop Connects a Life | বাংলাদেশ রক্তদান প্ল্যাটফর্ম',
  description: 'Bangladesh nationwide blood donation & donor management ecosystem. Connecting voluntary donors, patients, and hospitals with verified digital ID cards and rapid emergency matching.',
  keywords: 'LalBindu, Blood Donation Bangladesh, Roktodan, Dhaka Blood Bank, Red Crescent BD, Emergency Blood, Blood Donor App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-brand-red selection:text-white" suppressHydrationWarning>
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
