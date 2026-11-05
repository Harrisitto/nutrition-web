import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DocumentTypeIcon } from "@src/components/global/DocumentTypeIcon";
import type FromDate from "@src/helpers/dates";
import { useFetchMyDocuments } from "@src/services/tanstack/data/documents";
import { useMutatePlaning } from "@src/services/tanstack/user/planing";
import { useNotification } from "@src/store/slices/notification/hook";
import SelectEditor from "./default/selectInput";

const CLEAR_DOCUMENT_OPTION = "__clear_document__";

type DocumentOption = { id: string; name: string; document_type?: string };

interface Props {
  date: FromDate;
  currentDocumentId: string | null;
  onClose: () => void;
}

/** Elige uno de los documentos del nutricionista y lo adjunta al día (user_planing.document_id) */
const DocumentSelectEditor = ({ date, currentDocumentId, onClose }: Props) => {
  const { t } = useTranslation();
  const documentsQuery = useFetchMyDocuments();
  const upsertPlaning = useMutatePlaning();
  const { addMutationError } = useNotification();

  const clearOption = useMemo<DocumentOption>(
    () => ({ id: CLEAR_DOCUMENT_OPTION, name: t("system:messages.clear") }),
    [t],
  );

  const options = useMemo<DocumentOption[]>(
    () => [clearOption, ...(documentsQuery.data ?? [])],
    [clearOption, documentsQuery.data],
  );

  const initialValue =
    options.find((option) => option.id === currentDocumentId) ?? clearOption;

  const handleSave = (selected: DocumentOption) => {
    const documentId = selected.id === CLEAR_DOCUMENT_OPTION ? null : selected.id;
    if (documentId !== currentDocumentId) {
      upsertPlaning.mutate(
        { date, document_id: documentId },
        { onError: () => addMutationError() },
      );
    }
    onClose();
  };

  return (
    <SelectEditor<DocumentOption>
      title={t("data:dashboardTable.documentRow.select")}
      options={options}
      initialValue={initialValue}
      getOptionId={(option) => option.id}
      getOptionLabel={(option) => option.name}
      onSave={handleSave}
      onClose={onClose}
      searchable
      listFooter={
        documentsQuery.data?.length === 0 ? (
          <p className="p-2 text-center text-xs text-text-muted">
            {t("data:dashboardTable.documentRow.empty")}
          </p>
        ) : undefined
      }
      renderOption={(option) => (
        <div className="flex w-full items-center gap-2">
          {option.document_type && (
            <DocumentTypeIcon
              documentType={option.document_type}
              size={16}
              className="shrink-0 text-nutrition-green"
            />
          )}
          <p className="truncate text-sm font-semibold text-dark-green">{option.name}</p>
        </div>
      )}
    />
  );
};

export default DocumentSelectEditor;
