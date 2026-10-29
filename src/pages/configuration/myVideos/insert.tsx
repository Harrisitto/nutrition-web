import { useTranslation } from "react-i18next";
import { primaryButtonStyle } from "@src/components/styles";
import type { Form } from "@src/hooks/form/class";
import { useInsertVideo } from "@src/services/tanstack/data/videos";
import { fieldIds } from "./form";

export const BtnInsertVideo = ({ form }: { form: Form }) => {
  const { t } = useTranslation();
  const insertVideo = useInsertVideo();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Values live in the Form instance, read them at click time
    if (!form.validateForm()) return;
    const state = form.getState();
    insertVideo.mutate(
      {
        name: (state[fieldIds.name] as string).trim(),
        url: (state[fieldIds.url] as string).trim(),
        description: (state[fieldIds.description] as string).trim(),
      },
      { onSuccess: () => form.reset() },
    );
  };

  return (
    <>
      {insertVideo.isError && (
        <p className="text-sm text-red-500">
          {t("data:configuration.sections.myVideos.saveError")}
        </p>
      )}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={insertVideo.isPending}
        className={`${primaryButtonStyle} mt-2 w-full`}
      >
        {t("data:configuration.sections.myVideos.add")}
      </button>
    </>
  );
};
