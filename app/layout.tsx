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
    <html lang={locale} data-theme="night" className="bg-fixed bg-linear-to-br from-base-100/80 via-primary/10 to-base-300/60">
      <body className="min-h-screen p-6 flex flex-col bg-base-100/80 text-base-content transition-colors duration-300">
        <SplashScreen
          welcomeText={
            session?.user?.name
              ? `${dict["splash.welcome"]}, ${session.user.name}`
              : dict["splash.welcome"]
          }
        />
        <Header
          labels={{
            home: dict["nav.home"],
            projects: dict["nav.projects"],
            vert: dict["nav.vert"],
            picture_app: dict["nav.picture_app"],
            admin: dict["nav.admin"],
          }}
          showPictureApp={Boolean(session)}
          showAdmin={isAdmin}
          session={session}
          authLabels={{
            login: dict["action.login"],
            picture_app: dict["nav.picture_app"],
            logout: dict["action.logout"],
            account: dict["action.account"],
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