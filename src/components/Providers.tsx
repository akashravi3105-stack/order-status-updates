"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Navigation />
        {children}
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
