import { AnimationLoading } from "@src/components/global/Animations";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FILE_PATH = `${import.meta.env.BASE_URL}privacyPolicy/`;
const EXTENSION = ".txt";

const FetchText = ({ fileName }: { fileName: string }) => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    fetch(FILE_PATH + fileName + EXTENSION)
      .then((r) => r.text())
      .then(setText);
  }, [fileName]);

    if (!text) return <AnimationLoading />;
    return (
      <pre className="privacy-text whitespace-pre-wrap break-words overflow-x-auto max-w-full">{text}</pre>
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
