import type FromDate from "@src/helpers/dates";
import { useLanguageCode } from "@src/hooks/helpers/language";

export const useFormatDate = () => {
  const language = useLanguageCode();
  return (date: FromDate, withYear = false) =>
    date.toLocaleDateString(language, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: withYear ? "numeric" : undefined,
    });
};

export const useFormatNumber = () => {
  const language = useLanguageCode();
  return (value: number) =>
    value.toLocaleString(language, { maximumFractionDigits: 1 });
};
