import { useTranslation } from "react-i18next";
import { SectionLoading } from "@src/components/global/Animations";
import { useFetchMyDocuments } from "@src/services/tanstack/data/documents";
import { DocumentItem } from "./@components/documentItem";

export const DocumentList = () => {
  const { t } = useTranslation();
  const { data: documents, isLoading, isError } = useFetchMyDocuments();

  if (isLoading) {
    return <SectionLoading />;
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-red-500">
        {t("data:configuration.sections.documents.loadError")}
      </p>
    );
  }

  if (!documents?.length) {
    return (
      <p className="p-4 text-sm text-text-muted">
        {t("data:configuration.sections.documents.empty")}
      </p>
    );
  }

  return (
    <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} />
      ))}
    </ul>
  );
};
