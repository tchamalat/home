import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import { Menu, Settings } from 'lucide-react';
import DrawerNav from "@/components/DrawerNav";
import DrawerSettings from "@/components/DrawerSettings";
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return {
    title: dict["meta.home.title"],
    description: dict["meta.home.description"],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <html lang={locale} data-theme="night" className="bg-fixed bg-[radial-gradient(circle_at_20%_25%,rgba(70,20,80,0.45),transparent_38%),radial-gradient(circle_at_80%_12%,rgba(255,190,120,0.2),transparent_26%),radial-gradient(circle_at_40%_70%,rgba(40,40,100,0.3),transparent_30%)] bg-base-300">
      <body className="min-h-screen p-6 flex flex-col bg-transparent">
        <SplashScreen welcomeText={dict["splash.welcome"]} />
        <header className="flex justify-between bg-base-100 mb-6 rounded-full px-3 py-3 shadow-sm w-full">
          <div className="flex items-center gap-2">
            <div className="drawer sm:hidden">
              <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex">
                <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle active:animate-ping">
                  <Menu size={24} />
                </label>
                <Link className="btn btn-ghost rounded-full text-lg xs:text-2xl" href="/">{dict["nav.home"]}</Link>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="nav-drawer" className="drawer-overlay"></label>
                <DrawerNav />
              </div>
            </div>

            <nav className="hidden sm:flex gap-2 font-semibold">
              <Link className="btn btn-ghost rounded-full text-xl" href="/">{dict["nav.home"]}</Link>
              <Link className="btn btn-ghost rounded-full text-xl" href="/dev">{dict["nav.dev"]}</Link>
              <Link className="btn btn-ghost rounded-full text-xl" href="/projects">{dict["nav.projects"]}</Link>
              <a className="btn btn-ghost rounded-full text-xl" href="https://vert.romantcham.fr">{dict["nav.vert"]}</a>
            </nav>
          </div>

          <div>
            <div className="flex items-center gap-2 drawer drawer-end">
              <Link className="btn btn-ghost rounded-full text-lg xs:text-2xl" href="/login">
                {dict["action.login"]}
              </Link>

              <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex items-center">
                <label htmlFor="settings-drawer" className="btn btn-ghost btn-circle active:animate-spin">
                  <Settings size={24} />
                </label>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="settings-drawer" className="drawer-overlay"></label>
                <DrawerSettings 
                  locale={locale}
                  labels={{ "lang.en": dict["lang.en"], "lang.fr": dict["lang.fr"] }}
                />
              </div>
            </div>
          </div>
          
        </header>

        {children}
      </body>
    </html>
  );
}