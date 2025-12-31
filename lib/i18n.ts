import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries = { en, fr } as const;

type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getDictionary(locale: string | undefined): Dictionary {
  const key: Locale = isLocale(locale) ? locale : defaultLocale;
  return dictionaries[key];
}

export function filterDictByPrefix<T extends Record<string, string>>(
  dict: T,
  prefix: string
): Partial<T> {
  return Object.keys(dict).reduce((acc, key) => {
    if (key.startsWith(prefix)) {
      acc[key as keyof T] = dict[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}
