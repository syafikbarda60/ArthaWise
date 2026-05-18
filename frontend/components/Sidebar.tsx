"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "home" },
  { label: "Tables", href: "/transactions", icon: "bar_chart" },
  { label: "Billing", href: "/vault", icon: "credit_card" },
  { label: "RTL", href: "/rtl", icon: "build" },
];

const ACCOUNT_PAGES = [
  { label: "Profile", href: "/settings", icon: "person" },
  { label: "Sign In", href: "/signin", icon: "insert_drive_file" },
  { label: "Sign Up", href: "/signup", icon: "rocket_launch" },
];

interface SidebarProps {
  activeHref?: string;
}

export default function Sidebar({ activeHref = "/" }: SidebarProps) {
  const pathname = usePathname();

  const renderLink = (item: { label: string; href: string; icon: string }) => {
    const isActive = activeHref === item.href || pathname === item.href;
    return (
      <Link key={item.href} href={item.href}>
        <div
          className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-300 cursor-pointer ${
            isActive ? "bg-[#1A2456] text-white" : "text-[#A0AEC0] hover:bg-white/5"
          }`}
        >
          <div
            className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center ${
              isActive ? "bg-[#0075FF] text-white" : "bg-[#1A2456] text-[#0075FF]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
          </div>
          <span className="font-semibold text-sm">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50 flex justify-between items-center w-full px-4 py-4 bg-[#0F123B] border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight text-xl">
          <span className="material-symbols-outlined">hexagon</span>
          <span>ARTHAWISE</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 py-8 px-4 z-40 overflow-y-auto" style={{ background: "transparent" }}>
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="material-symbols-outlined text-white text-2xl">hexagon</span>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">
            ArthaWise
          </h1>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.1)] mb-6 mx-2"></div>

        {/* Nav Items */}
        <div className="flex flex-col">
          {NAV_ITEMS.map(renderLink)}
        </div>

        <div className="mt-4 mb-4 ml-4">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Account Pages</span>
        </div>
        
        <div className="flex flex-col">
          {ACCOUNT_PAGES.map(renderLink)}
        </div>

        {/* Upgrade CTA */}
        <div className="mt-auto pt-6 px-2">
          <div className="vui-card p-4 flex flex-col items-start relative overflow-hidden">
             <div className="w-[30px] h-[30px] rounded-lg bg-white flex items-center justify-center mb-4 z-10">
                <span className="material-symbols-outlined text-[#0075FF] text-[18px]">star</span>
             </div>
             <h6 className="text-white text-sm font-bold mb-1 z-10">Need help?</h6>
             <p className="text-white/80 text-xs mb-4 z-10">Please check our docs</p>
             <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition-colors z-10">
                DOCUMENTATION
             </button>
             {/* Abstract shape */}
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-[#0075FF]/30 blur-2xl rounded-full z-0"></div>
          </div>
          <button className="w-full bg-gradient-to-r from-[#0075FF] to-[#0BC5EA] text-white text-xs font-bold py-3 mt-4 rounded-xl hover:opacity-90 transition-opacity">
            Upgrade to PRO
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#0F123B] border-t border-white/10">
        {NAV_ITEMS.map(({ label, icon, href }) => {
          const isActive = activeHref === href || pathname === href;
          return (
            <Link key={href} href={href}>
              <div className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${isActive ? "text-[#0075FF]" : "text-[#A0AEC0]"}`}>
                <span className="material-symbols-outlined">{icon}</span>
                <span className="text-[10px]">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
