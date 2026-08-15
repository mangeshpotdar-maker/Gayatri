'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Tag,
  Boxes,
  MessageSquare,
  Home,
  QrCode,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Customer Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Homepage CMS', href: '/admin/homepage', icon: Home },
    { name: 'QR Code Center', href: '/admin/qr', icon: QrCode },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-stone-900 border-r border-amber-900/30 text-stone-300 flex flex-col h-screen sticky top-0 shrink-0 font-sans">
      {/* Brand */}
      <div className="p-6 border-b border-stone-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-amber-200 font-serif font-bold text-base">
            K
          </span>
          <div>
            <h2 className="font-serif font-bold text-amber-100 text-sm">KalaKriti Admin</h2>
            <span className="text-[10px] text-amber-400/80 uppercase font-mono">Store Owner Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition ${
                isActive
                  ? 'bg-amber-800 text-amber-100 shadow-md font-bold'
                  : 'text-stone-400 hover:bg-stone-800/80 hover:text-amber-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-stone-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition"
        >
          <ExternalLink className="w-4 h-4" /> View Live Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition"
        >
          <LogOut className="w-4 h-4" /> Logout Admin
        </button>
      </div>
    </aside>
  );
}
