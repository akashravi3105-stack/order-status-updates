"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Home, Package, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();

  if (!user || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={user.role === 'customer' ? '/customer/menu' : '/staff/orders'} className="flex items-center gap-2">
            <span className="text-xl font-bold">🍽️ Canteen</span>
          </Link>
          
          {user.role === 'customer' && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/customer/menu">
                <Button variant={pathname === '/customer/menu' ? 'default' : 'ghost'} size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Menu
                </Button>
              </Link>
              <Link href="/customer/orders">
                <Button variant={pathname === '/customer/orders' ? 'default' : 'ghost'} size="sm">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
            </div>
          )}

          {user.role === 'staff' && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/staff/orders">
                <Button variant={pathname === '/staff/orders' ? 'default' : 'ghost'} size="sm">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Orders
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user.role === 'customer' && (
            <Link href="/customer/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">{user.role}</Badge>
          </div>
          
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
