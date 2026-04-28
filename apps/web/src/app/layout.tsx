import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Saturn Optimizer", template: "%s | Saturn Optimizer" },
  description: "One vault entrypoint instead of fragmented protocol UX. Earn on Bitcoin or STX safely and securely.",
  openGraph: {
    title: "Saturn Optimizer",
    description: "Bitcoin-aligned BTCFi vault on Stacks.",
    url: "https://saturn-optimizer.vercel.app",
    siteName: "Saturn Optimizer",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#0a0a0a",
  twitter: {
    card: "summary_large_image",
    title: "Saturn Optimizer",
    description: "Bitcoin-aligned BTCFi vault on Stacks.",
  },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
