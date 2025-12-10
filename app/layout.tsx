import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <h1 className="pl-3 py-1 w-fit bg-neutral-500 rounded-full text-3xl font-semibold text-black dark:text-zinc-50">Welcome
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-[#383838]" href="/">Home</Link>
          </h1>
          <br />
          <nav>
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-[#383838]" href="/dev">dev</Link>
            <Link className="px-3 py-1.5 transition-colors rounded-full hover:bg-[#383838]" href="/projects">Projects</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

// className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]