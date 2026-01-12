import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import SplashScreen from "@/components/SplashScreen";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Header from "@/components/header/Header";

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

  // Vérification admin côté serveur
  const isAdmin = session?.user?.email && process.env.ADMIN_GMAIL
    ? session.user.email.toLowerCase() === process.env.ADMIN_GMAIL.toLowerCase()
    : false;

  return (
    <html lang={locale} data-theme="night" className="bg-fixed bg-gradient-to-br from-base-100/80 via-primary/10 to-base-300/60">
      <body className="min-h-screen p-6 flex flex-col bg-base-100/80 text-base-content transition-colors duration-300">
        <SplashScreen
          welcomeText={
            session?.user?.name
              ? `${dict["splash.welcome"]}, ${session.user.name}`
              : dict["splash.welcome"]
          }
        />
        {/*<header className="flex justify-between bg-base-100 mb-6 rounded-full px-3 py-3 shadow-sm w-full">
          <div className="flex items-center gap-2">
            <div className="drawer sm:hidden">
              <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex">
                <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle active:animate-ping">
                  <Menu size={24} />
                </label>
                <NavLink href="/" className="text-2xl px-3 pt-1 rounded-full w-fit">{dict["nav.home"]}</NavLink>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="nav-drawer" className="drawer-overlay"></label>
                <DrawerNav 
                  labels={{
                    home: dict["nav.home"],
                    projects: dict["nav.projects"],
                    vert: dict["nav.vert"],
                    dashboard: dict["nav.dashboard"],
                    admin: dict["nav.admin"],
                  }}
                  showDashboard={Boolean(session)}
                  showAdmin={isAdmin}
                />
              </div>
            </div>

            <HeaderNav 
              labels={{
                home: dict["nav.home"],
                projects: dict["nav.projects"],
                vert: dict["nav.vert"],
                dashboard: dict["nav.dashboard"],
                admin: dict["nav.admin"],
              }}
              showDashboard={Boolean(session)}
              showAdmin={isAdmin}
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
          
        </header>*/}
        <Header
          labels={{
            home: dict["nav.home"],
            projects: dict["nav.projects"],
            vert: dict["nav.vert"],
            dashboard: dict["nav.dashboard"],
            admin: dict["nav.admin"],
          }}
          showDashboard={Boolean(session)}
          showAdmin={isAdmin}
          session={session}
          authLabels={{
            login: dict["action.login"],
            dashboard: dict["nav.dashboard"],
            logout: dict["action.logout"],
          }}
          locale={locale}
          langlabels={{ "lang.en": dict["lang.en"], "lang.fr": dict["lang.fr"] }}
        />

        <SessionProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </SessionProvider>

        <footer className="text-center text-sm bg-base-200/80 mt-6 rounded-full py-4 shadow-lg border border-primary/20">
          <p className="mt-2 text-base-content/70">© Romantcham. {dict["footer.rights"]}</p>
        </footer>
      </body>
    </html>
  );
}