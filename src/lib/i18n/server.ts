import { cookies } from "next/headers";
import { localeCookieName, resolveLocale } from "./messages";
import { createTranslator } from "./translate";

export async function getServerLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  return resolveLocale(cookieLocale);
}

export async function getServerI18n() {
  const locale = await getServerLocale();
  const t = createTranslator(locale);
  return { locale, t };
}
