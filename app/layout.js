'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import AppProvider from '@/context/AppContext';
import { Toaster } from 'react-hot-toast'; 

export default function RootLayout({ children }) { //
  return (
    <ClerkProvider>
      <AppProvider>
        <html lang="en">
          <body>
            <Toaster position="top-center" /> 
            {children}
          </body>
        </html>
      </AppProvider>
    </ClerkProvider>
  );
}
