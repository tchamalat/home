import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "Home page of romantcham.fr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex p-4">
          <ThemeScript />
          <nav className="py-1 w-fit bg-background_2 rounded-full text-3xl font-semibold text-foreground">
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-background_3" href="/">Home</Link>
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-background_3" href="/dev">dev</Link>
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-background_3" href="/projects">Projects</Link>
          </nav>
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
