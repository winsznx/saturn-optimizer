"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import * as motion from "framer-motion/client";
import { SidebarContent } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden container mx-auto px-4">
        <aside className="hidden md:flex flex-col w-64 border-r border-white/10 pr-6 py-8 shrink-0">
          <SidebarContent pathname={pathname} />
        </aside>

        <main className="flex-1 overflow-y-auto py-8 md:pl-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="md:hidden mb-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white border border-white/10 rounded-md px-3 py-2 transition-colors"
            >
              <Menu className="h-4 w-4" />
              Navigation
            </button>
          </div>

          {children}
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={useCallback(() => setMobileOpen(false), [])}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-72 h-full bg-background border-r border-white/10 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={useCallback(() => setMobileOpen(false), [])} className="text-muted-foreground hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
