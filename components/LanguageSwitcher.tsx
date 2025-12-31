"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Locale, locales } from "@/lib/i18n";

type Props = {
  locale: Locale;
  labels: Record<"lang.en" | "lang.fr", string>;
  onLanguageChange?: () => void;
};

export default function LanguageSwitcher({ locale, labels, onLanguageChange }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLang = () => {
    const newLang: Locale = locale === "en" ? "fr" : "en";
    document.cookie = `lang=${newLang}; path=/`;
    startTransition(() => {
      router.refresh();
      if (onLanguageChange) {
        onLanguageChange();
      }
    });
  };

  const otherLang = locale === "en" ? "fr" : "en";
  const displayLabel = otherLang === "en" ? labels["lang.en"] : labels["lang.fr"];

  return (
    <button
      type="button"
      onClick={toggleLang}
      className="btn btn-circle btn-ghost"
      disabled={isPending}
      title={`Switch to ${otherLang.toUpperCase()}`}
    >
      <span className="text-lg font-semibold">{displayLabel}</span>
    </button>
  );
}
