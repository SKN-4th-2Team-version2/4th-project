'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth/NextAuthProvider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <AuthProvider>
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </AuthProvider>
      </SessionProvider>
    </ThemeProvider>
  );
} 