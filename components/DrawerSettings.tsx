"use client"

import ThemeSwitcher from "./ThemeSwitcher"
import LanguageSwitcher from "./LanguageSwitcher"
import { Locale } from "@/lib/i18n"

type Props = {
  locale: Locale;
  labels: Record<"lang.en" | "lang.fr", string>;
}

export default function DrawerSettings({ locale, labels }: Props) {
  const closeDrawer = () => {
    const checkbox = document.getElementById("settings-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  return (
    <ul className="menu m-6 ml-auto p-3 grid gap-2 w-fit bg-base-200 text-base-content text-2xl rounded-4xl">
      <li onClick={closeDrawer}>
        <ThemeSwitcher/>
      </li>
      <li onClick={closeDrawer}>
        <LanguageSwitcher locale={locale} labels={labels} onLanguageChange={closeDrawer} />
      </li>
    </ul>
  )
}
