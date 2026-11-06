import { useTranslation } from "react-i18next";
import { cardStyle } from "@src/components/styles";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { useNewDocumentForm } from "./form";
import { BtnUploadDocument } from "./insert";
import { DocumentList } from "./list";

const sectionStyle = `${cardStyle} p-4`;

export default function PageConfigurationNutriDocuments() {
  const { t } = useTranslation();
  const documentForm = useNewDocumentForm();

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
            {documentForm.Fields}
            <BtnUploadDocument form={documentForm.form} />
          </form>
        </section>
      </div>
    </ConfigurationPages>
  );
}
