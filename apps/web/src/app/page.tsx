import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Layers, Bitcoin, Activity } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden selection:bg-primary/30">
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="container relative mx-auto px-4 pt-32 pb-24 md:pt-48 md:pb-32 lg:pt-52 lg:pb-40">
          <div className="mx-auto max-w-[800px] text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                The Management Layer for Stacks BTCFi
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm mb-6 pb-2"
            >
              One Vault. <br />
              Infinite Yield.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto leading-relaxed"
            >
              Stop monitoring separate protocol positions. Deposit sBTC or STX into a single,
              auditable vault that automatically routes capital with absolute risk controls.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-base group h-14 px-8">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button id="btn-how-it-works" variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 border-white/20 hover:bg-white/5">
                  How it works
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Institutional Grade Security</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Saturn leverages Nakamoto-era Stacks finality and Clarity&apos;s exact-principal traits to enforce
              strict boundaries around your assets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
              title="One Security Model"
              description="No unsupported router contracts. Deny-mode post conditions and exact-principal allowlists ensure only approved integrations can touch funds."
              delay={0.1}
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-blue-400" />}
              title="Unified Balances"
              description="Users receive one share token per accounting domain, dramatically simplifying portfolio tracking and implied claim calculation."
              delay={0.2}
            />
            <FeatureCard
              icon={<Bitcoin className="h-8 w-8 text-orange-400" />}
              title="Native Bitcoin Yield"
              description="Integrated directly with sBTC to offer trust-minimized exposure to Stacks DeFi yield without central wrapping risks."
              delay={0.3}
            />
          </div>

          {/* Safe Mode Highlight */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 lg:mt-32 max-w-4xl mx-auto"
          >
            <Card glass className="overflow-hidden border-primary/20 bg-background/50 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative z-10">
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive mb-4 w-max">
                    <Activity className="h-3 w-3 mr-1" /> Built-in Fallbacks
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Guaranteed Escape Hatches</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Users can always redeem idle liquidity via <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">safe-withdraw</code> without triggering complex strategy code. If a protocol fails, withdrawals revert locally instead of leaving users entirely stuck.
                  </p>
                </div>
                <div className="flex items-center justify-center relative min-h-[250px]">
                  {/* Decorative abstract UI */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-[80%] h-[80%] border border-white/10 rounded-xl bg-black/50 backdrop-blur-sm shadow-2xl flex flex-col p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs font-mono text-muted-foreground">Protocol.Status</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        </div>
                        <div className="h-6 w-full bg-white/5 rounded"></div>
                        <div className="h-6 w-3/4 bg-white/5 rounded"></div>
                        <div className="h-10 mt-auto w-full border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium rounded flex items-center justify-center">
                          Emergency Withdraw Available
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card glass className="h-full border-white/5 hover:border-primary/30 transition-colors duration-500 overflow-hidden group">
        <CardContent className="p-8">
          <div className="mb-6 p-4 rounded-2xl bg-white/5 w-max group-hover:scale-110 transition-transform duration-500 ease-out">{icon}</div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
