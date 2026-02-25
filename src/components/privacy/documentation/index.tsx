import { useFetchTxt } from "@src/hooks/helpers/text";
import { useTranslation } from "react-i18next";

const FetchText = ({ fileName }: { fileName: string }) => {
  const text = useFetchTxt({
    relativePath: `privacyPolicy/${fileName}`,
    extension: "txt",
  });

  return (
    <pre className="privacy-text whitespace-pre-wrap break-words overflow-x-auto max-w-full">
      {text}
    </pre>
  );
};

export const LangES = () => <FetchText fileName="langEs" />;
export const LangEN = () => <FetchText fileName="langEn" />;

export const LangDefault = () => {
  const { i18n } = useTranslation();

  if (i18n.language === "es") return <LangES />;
  if (i18n.language === "en") return <LangEN />;
  return <LangEN />;
};
