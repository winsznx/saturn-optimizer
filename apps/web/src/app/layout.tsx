import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saturn Optimizer | The Management Layer for Stacks BTCFi",
  description: "One vault entrypoint instead of fragmented protocol UX. Earn on Bitcoin or STX safely and securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
