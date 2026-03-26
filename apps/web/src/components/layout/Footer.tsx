import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-12 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Saturn Optimizer</span>
        </div>
        <p className="text-muted-foreground max-w-md mb-8">
          The management layer for Stacks BTCFi. One auditable interface that routes capital with clear risk controls.
        </p>
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Security
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            GitHub
          </Link>
        </div>
        <div className="mt-12 text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Saturn Optimizer. Grant-ready MVP.
        </div>
      </div>
    </footer>
  );
}
