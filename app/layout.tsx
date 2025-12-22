import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Menu } from 'lucide-react';
import DrawerNav from "@/components/DrawerNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roman's home",
  description: "Home page of romantcham.fr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen p-6 bg-base-300">
        <header className="bg-base-100 mb-6 rounded-full">
          <div className="drawer">
            <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
              <nav className="navbar px-3 bg-base-100 shadow-sm rounded-full font-semibold">

                <div className="sm:hidden">
                  <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle">
                    <Menu size={24} />
                  </label>
                  <Link className="btn btn-ghost rounded-full text-xl" href="/">Home</Link>
                </div>

                <div className="hidden sm:flex flex-1 gap-2">
                  <Link className="btn btn-ghost rounded-full text-xl" href="/">Home</Link>
                  <Link className="btn btn-ghost rounded-full text-xl" href="/dev">dev</Link>
                  <Link className="btn btn-ghost rounded-full text-xl" href="/projects">Projects</Link>
                  <a className="btn btn-ghost rounded-full text-xl" href="https://vert.romantcham.fr">Vert</a>
                </div>

                <ThemeSwitcher className="ml-auto" />
              </nav>
            </div>

            <div className="drawer-side z-50">
              <label htmlFor="nav-drawer" className="drawer-overlay"></label>
              <DrawerNav />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}