import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saturn Optimizer | The Management Layer for Stacks BTCFi",
  description: "One vault entrypoint instead of fragmented protocol UX. Earn on Bitcoin or STX safely and securely.",
  other: {
    "talentapp:project_verification": "9e1247b3ab67562a4f3d8035ca5440edb7c02744bd770c7d67a54f0a2a7d873c6b8ba15dbb2e3259503a4f2db8d77d03ed15fef051fc313d6cffd93f558364d5",
  },
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
