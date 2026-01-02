import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import { Menu, Settings } from 'lucide-react';
import DrawerNav from "@/components/DrawerNav";
import DrawerSettings from "@/components/DrawerSettings";
import SplashScreen from "@/components/SplashScreen";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeaderAuthButton from "@/components/HeaderAuthButton";
import HeaderNav from "@/components/HeaderNav";

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
  const session = await getServerSession(authOptions);

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
                <DrawerNav 
                  labels={{
                    home: dict["nav.home"],
                    dev: dict["nav.dev"],
                    projects: dict["nav.projects"],
                    vert: dict["nav.vert"],
                    dashboard: dict["nav.dashboard"],
                  }}
                  showDashboard={Boolean(session)}
                />
              </div>
            </div>

            <HeaderNav 
              labels={{
                home: dict["nav.home"],
                dev: dict["nav.dev"],
                projects: dict["nav.projects"],
                vert: dict["nav.vert"],
                dashboard: dict["nav.dashboard"],
              }}
              showDashboard={Boolean(session)}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 drawer drawer-end">
              <HeaderAuthButton 
                session={session}
                labels={{
                  login: dict["action.login"],
                  dashboard: dict["nav.dashboard"],
                  logout: dict["action.logout"],
                }}
              />

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

        <SessionProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </SessionProvider>

        <footer className="text-center text-sm bg-base-100 mt-6 rounded-full py-4">
          <p className="mt-2">© Romantcham. {dict["footer.rights"]}</p>
        </footer>
      </body>
    </html>
  );
}