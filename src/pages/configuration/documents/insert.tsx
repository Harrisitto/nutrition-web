import { useTranslation } from "react-i18next";
import { primaryButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { useUploadDocument } from "@src/services/tanstack/data/documents";
import { fieldIds } from "./form";

export const BtnUploadDocument = ({ form }: { form: Form }) => {
  const { t } = useTranslation();
  const uploadDocument = useUploadDocument();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Values live in the Form instance, read them at click time.
    // validateForm already marks the file as required
    if (!form.validateForm()) return;
    const state = form.getState();
    uploadDocument.mutate(
      { file: state[fieldIds.file] as File, name: state[fieldIds.name] as string },
      // reset also clears the native file <input>
      { onSuccess: () => form.reset() },
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
        disabled={uploadDocument.isPending}
        className={`${primaryButtonStyle} mt-2 w-full`}
      >
        {uploadDocument.isPending
          ? t("data:configuration.sections.documents.uploading")
          : t("data:configuration.sections.documents.add")}
      </button>
    </>
  );
};
