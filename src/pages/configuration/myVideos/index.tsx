import { useTranslation } from "react-i18next";
import { cardStyle } from "@src/components/styles";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { useNewVideoForm } from "./form";
import { BtnInsertVideo } from "./insert";
import { VideoList } from "./list";
import { VideoThumbnail } from "./thumbnail";

const sectionStyle = `${cardStyle} p-4`;

export default function PageMyVideos() {
  const { t } = useTranslation();
  const videoForm = useNewVideoForm();

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.myVideos.title")}
      description={t("data:configuration.sections.myVideos.description")}
    >
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-in md:grid-cols-2">
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.myVideos.listTitle")}
          </h2>
          <VideoList />
        </section>
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.myVideos.addTitle")}
          </h2>
          <p className="mb-3 text-sm text-text-muted">
            {t("data:configuration.sections.myVideos.onlyYoutube")}
          </p>
          <form className="flex flex-col">
            {videoForm.Fields}
            {videoForm.derivedState?.thumbnail && (
              <VideoThumbnail
                src={videoForm.derivedState.thumbnail}
                alt={t("data:configuration.sections.myVideos.preview")}
                className="mb-2 w-full max-w-xs self-center animate-fade-in"
              />
            )}
            <BtnInsertVideo form={videoForm.form} />
          </form>
        </section>
      </div>
    </ConfigurationPages>
  );
}
