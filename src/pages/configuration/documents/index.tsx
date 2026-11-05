import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cardStyle } from "@src/components/styles";
import { fileNameWithoutExtension } from "@src/helpers/files";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { DocumentFileInput } from "./@components/fileInput";
import { fieldIds, useNewDocumentForm } from "./form";
import { BtnUploadDocument } from "./insert";
import { DocumentList } from "./list";

const sectionStyle = `${cardStyle} p-4`;

export default function PageConfigurationNutriDocuments() {
  const { t } = useTranslation();
  const documentForm = useNewDocumentForm();
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (selected: File | null) => {
    setFile(selected);
    // Propone el nombre del fichero si el nutricionista aún no ha escrito uno
    const currentName = documentForm.form.getState()[fieldIds.name] as string;
    if (selected && !currentName.trim()) {
      documentForm.form.requestUpdate(
        fieldIds.name,
        fileNameWithoutExtension(selected.name),
      );
    }
  };

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.documents.title")}
      description={t("data:configuration.sections.documents.description")}
    >
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-in md:grid-cols-2">
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.documents.listTitle")}
          </h2>
          <DocumentList />
        </section>
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.documents.addTitle")}
          </h2>
          <form className="flex flex-col">
            <DocumentFileInput file={file} onChange={onFileChange} />
            {documentForm.Fields}
            <BtnUploadDocument
              form={documentForm.form}
              file={file}
              onUploaded={() => setFile(null)}
            />
          </form>
        </section>
      </div>
    </ConfigurationPages>
  );
}
