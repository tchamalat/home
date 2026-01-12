"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import ThemeSwitcher from "./ThemeSwitcher"
import LanguageSwitcher from "./LanguageSwitcher"
import { X } from "lucide-react"
import { Locale } from "@/lib/i18n"

type Props = {
  locale: Locale;
  labels: Record<"lang.en" | "lang.fr", string>;
}

export default function DrawerSettings({ locale, labels }: Props) {
  const drawerRef = useRef(null);
  const closeDrawer = () => {
    const checkbox = document.getElementById("settings-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
      const progress = clamp(scrollY / 80, 0, 1);

      gsap.to(drawerRef.current, {
        marginTop: `${16 - 8 * progress}px`,
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ul ref={drawerRef} className="menu mt-4 ml-auto p-2 pr-1! flex& flex-row-reverse w-fit bg-base-200/90 text-base-content text-2xl rounded-l-4xl shadow border border-primary/10">
      <li onClick={closeDrawer}>
        <X className="btn btn-circle btn-ghost p-1"/>
      </li>
      <li onClick={closeDrawer}>
        <ThemeSwitcher/>
      </li>
      <li onClick={closeDrawer}>
        <LanguageSwitcher locale={locale} labels={labels} onLanguageChange={closeDrawer} />
      </li>
    </ul>
  )
}
