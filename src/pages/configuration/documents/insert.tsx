import { useTranslation } from "react-i18next";
import { primaryButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { useUploadDocument } from "@src/services/tanstack/data/documents";
import { fieldIds } from "./form";

interface Props {
  form: Form;
  file: File | null;
  onUploaded: () => void;
}

export const BtnUploadDocument = ({ form, file, onUploaded }: Props) => {
  const { t } = useTranslation();
  const uploadDocument = useUploadDocument();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Values live in the Form instance, read them at click time
    if (!file || !form.validateForm()) return;
    const state = form.getState();
    uploadDocument.mutate(
      { file, name: state[fieldIds.name] as string },
      {
        onSuccess: () => {
          form.reset();
          onUploaded();
        },
      },
    );
  };

  return (
    <>
      {uploadDocument.isError && (
        <p className="text-sm text-red-500">
          {t("data:configuration.sections.documents.saveError")}
        </p>
      )}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!file || uploadDocument.isPending}
        className={`${primaryButtonStyle} mt-2 w-full`}
      >
        {uploadDocument.isPending
          ? t("data:configuration.sections.documents.uploading")
          : t("data:configuration.sections.documents.add")}
      </button>
    </>
  );
};
