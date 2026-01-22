import { defaultLocale, Locale, messages } from "./messages";

type MessageDictionary = typeof messages[typeof defaultLocale];

interface MessageDictionaryNode {
  [key: string]: MessageValue;
}

type MessageValue = string | MessageDictionaryNode;

function getDictionary(locale: Locale): MessageDictionary {
  return messages[locale] ?? messages[defaultLocale];
}

function getMessageValue(dictionary: MessageDictionary, key: string): string {
  const segments = key.split(".");
  let current: MessageValue = dictionary;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      return key;
    }
    const next: MessageValue | undefined = (current as Record<string, MessageValue>)[segment];
    if (next === undefined) {
      return key;
    }
    current = next;
  }

  return typeof current === "string" ? current : key;
}

export function createTranslator(locale: Locale) {
  const dictionary = getDictionary(locale);
  return (key: string) => getMessageValue(dictionary, key);
}
