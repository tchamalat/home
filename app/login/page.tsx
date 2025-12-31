import { Suspense } from "react";
import { cookies } from "next/headers";
import { defaultLocale, getDictionary, isLocale, Locale } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const cookieStore = cookies();
  const langCookie = (await cookieStore).get("lang")?.value;
  const locale: Locale = isLocale(langCookie) ? langCookie : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <main className="flex items-center justify-center flex-1">
      <Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
        <LoginForm 
          dict={{
            "login.title": dict["login.title"],
            "login.button": dict["login.button"],
            "login.description": dict["login.description"]
          }}
        />
      </Suspense>
    </main>
  );
}
