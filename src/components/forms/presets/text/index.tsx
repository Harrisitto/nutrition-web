import { useTranslation } from "react-i18next";

export const Title = () => {
    const { t } = useTranslation();
    return <h2 className="text-xl font-semibold">{t("forms:preset.title")}</h2>;
}

export const Description = () => {
    const { t } = useTranslation();
    return <p className="text-sm text-gray-blue-600">{t("forms:preset.description")}</p>;
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