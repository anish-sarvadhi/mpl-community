/** @format */

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import Navigation from "@/components/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import { MobileMenuProvider } from "@/components/mobile-menu-provider";
import { LanguageProvider } from "@/components/language-provider";
import { RewardsProvider } from "@/components/rewards-provider";
import { PageTransition } from "@/components/ui/motion";
import { AuthProvider } from "@/contexts/AuthContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPL Community",
  description: "Connect with the MPL community across various platforms",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/mpl_logo.webp" type="image/webp" />
        <meta name="theme-color" content="#FF1744" />
      </head>
      <body className={inter.className}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <RewardsProvider>
              <MobileMenuProvider>
                <div className="flex min-h-screen bg-background overflow-hidden max-w-full">
                  <Sidebar />
                  <main className="flex-1 min-w-0 overflow-hidden ml-0 md:ml-64">
                    <div className="sticky w-full top-0 z-30 flex items-center justify-between md:justify-end px-4 h-[73px] border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                      <div className="md:hidden">
                        <img
                          src="/mpl_logo.webp"
                          alt="MPL Logo"
                          className="h-8"
                        />
                      </div>
                      <LanguageSwitcher />
                    </div>
                    <div className="p-4 md:p-6 pb-20 md:pb-6 h-[calc(100vh-73px)] overflow-y-auto">
                      <PageTransition>{children}</PageTransition>
                    </div>
                  </main>
                  <Navigation />
                </div>
              </MobileMenuProvider>
            </RewardsProvider>
          </LanguageProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
