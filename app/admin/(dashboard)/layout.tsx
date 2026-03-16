"use client"; // Required for usePathname

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-green-800 p-2 rounded-lg">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Quiz Nest
          </h2>
        </div>

        <nav className="space-y-2">
          <SidebarLink 
            href="/admin" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={isActive('/admin')} 
          />
          
          <SidebarLink 
            href="/admin/exam-types" 
            icon={<BookOpen size={20} />} 
            label="Exam Types" 
            active={isActive('/admin/exam-types')} 
          />

          <SidebarLink 
            href="/admin/users" 
            icon={<Users size={20} />} 
            label="Users List" 
            active={isActive('/admin/users')} 
          />
        </nav>

        {/* Logout at bottom */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link 
            href="/login" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto text-gray-900">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Reusable Sidebar Link Component
function SidebarLink({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
        active 
          ? "bg-green-800 text-white shadow-lg shadow-green-900/20" 
          : "text-gray-500 hover:bg-green-50 hover:text-green-800"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}