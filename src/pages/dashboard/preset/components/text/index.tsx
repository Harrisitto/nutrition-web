import { useTranslation } from "react-i18next";
import { useIsGlobalPreset } from "../form/hook";

export const Title = () => {
    const { t } = useTranslation();
    const isGlobal = useIsGlobalPreset();
    return <h2 className="text-xl font-semibold">{t(isGlobal ? "forms:preset.globalTitle" : "forms:preset.title")}</h2>;
}

export const Description = () => {
    const { t } = useTranslation();
    const isGlobal = useIsGlobalPreset();
    return <p className="text-sm text-gray-blue-600">{t(isGlobal ? "forms:preset.globalDescription" : "forms:preset.description")}</p>;
}

export const NewPreset = () => {
    const { t } = useTranslation();
    return <h3 className="py-2 text-dark-green text-xl font-bold">{t("forms:preset.fields.newPreset")}</h3>;
}

export const Meals = () => {
    const { t } = useTranslation();
    return <h4 className="text-lg font-semibold">{t("forms:preset.fields.meals")}</h4>;
}

export const TrainingHc = () => {
    const { t } = useTranslation();
    return <h4 className="text-lg font-semibold">{t("forms:preset.fields.trainingHc")}</h4>;
}

export const FormResume = () => {
    const { t } = useTranslation();
    return <h4 className="text-lg font-semibold">{t("forms:preset.fields.formResume")}</h4>;
}