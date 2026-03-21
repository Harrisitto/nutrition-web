import { Info, Lock } from "lucide-react";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../class";
import useFormInputHandler from "./fieldHook";
import SwitchField from "./main";

const Field = ({ form, id }: { form: Form; id: string }) => {
  const { field } = useFormInputHandler(form, id);
  const { t } = useTranslation();
  const [showExplanation, setShowExplanation] = useState(false);

  if(field?.isHidden) return null;
  return (
    <div
      className={`flex flex-col gap-4 mb-4 ${showExplanation ? "p-4" : ""} ${
        field?.errorMsg
          ? "border-l-4 border-red-500 pl-3"
          : field?.explanation && showExplanation
            ? "border-l-4 border-blue-400 pl-3"
            : ""
      }`}
    >
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SwitchField field={field} form={form} id={id} />
        </div>
        {field?.sharedRowElement ? field.sharedRowElement : null}
      </div>

      <div className="flex flex-row gap-4 items-center">
        {field?.isLocked && (
          <Lock
            size={20}
            className="flex-shrink-0 text-gray-600"
          />
        )}
        {field?.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle explanation"
          >
            <Info
              size={20}
              className="flex-shrink-0 text-blue-500"
            />
          </button>
        )}
      </div>

      {field?.errorMsg ? (
        <p className="text-sm font-medium text-red-500">
          {t(field.errorMsg)}
        </p>
      ) : null}

      {showExplanation && field?.explanation && (
        <p className="text-sm text-gray-700">{t(field.explanation)}</p>
      )}
    </div>
  );
};

export default memo(Field);
