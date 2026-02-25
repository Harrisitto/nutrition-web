import { useTranslation } from "react-i18next";
import { useFetchTxt } from "@src/hooks/helpers/text";
import { useLanguageCode } from "@src/hooks/helpers/language";

export const Title = () => {
    const { t } = useTranslation();

    return (
        <h1 className="text-2xl font-bold mb-4">{t("data:references.recipes.ingredients.title")}</h1>
    )
}

export const Description = () => {
    const { t } = useTranslation();
    return (
        <p className="text-gray-700 mb-6">{t("data:references.recipes.ingredients.description")}</p>
    )
}

const Disclaimer = ({
    fileName,
}: {
    fileName: string;
}) => {
    const text = useFetchTxt({
        relativePath: `references/${fileName}`,
        extension: "txt",
    });

    return (
        <pre className="disclaimer-text whitespace-pre-wrap break-words overflow-x-auto max-w-full bg-gray-50 p-4 rounded">
            {text}
        </pre>
    )
}

export const DisclaimerEn = () => <Disclaimer fileName="recipeIngredientsEn" />;
export const DisclaimerEs = () => <Disclaimer fileName="recipeIngredientsEs" />;

export const DisclaimerDefault = () => {
    const language = useLanguageCode();

    //if (language === "es") return <DisclaimerEs />;
    if (language === "en") return <DisclaimerEn />;
    return <DisclaimerEn />;
}


