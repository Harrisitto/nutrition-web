import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ExternalLink, Pencil, Trash2, X } from "lucide-react";
import { DocumentTypeIcon } from "@src/components/global/DocumentTypeIcon";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";
import { formatFileSize } from "@src/helpers/files";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  type NutritionistDocument,
  getDocumentSignedUrl,
  useDeleteDocument,
  useRenameDocument,
} from "@src/services/tanstack/data/documents";
import { DOCUMENT_NAME_MAX_LENGTH } from "../form";

const renameInputStyle =
  "min-w-0 flex-1 rounded-md border border-nutrition-green/30 bg-white px-2 py-1 text-sm text-text-body focus:outline-none focus:ring-1 focus:ring-nutrition-green";

export const DocumentItem = ({ document }: { document: NutritionistDocument }) => {
  const { t, i18n } = useTranslation();
  const { addFormSubmitError, addMutationError } = useNotification();
  const renameDocument = useRenameDocument();
  const deleteDocument = useDeleteDocument();
  const [editName, setEditName] = useState<string | null>(null);

  const trimmedName = editName?.trim() ?? "";
  const canSave =
    trimmedName.length > 0 &&
    trimmedName.length <= DOCUMENT_NAME_MAX_LENGTH &&
    trimmedName !== document.name;

  const onOpen = async () => {
    // La ventana se abre antes del await: si se abre después, el navegador la bloquea como popup
    const win = window.open("", "_blank");
    try {
      const url = await getDocumentSignedUrl(document);
      if (win) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch {
      win?.close();
      addFormSubmitError();
    }
  };

  const onSaveName = () => {
    if (!canSave) return;
    renameDocument.mutate(
      { id: document.id, name: trimmedName },
      {
        onSuccess: () => setEditName(null),
        onError: () => addMutationError(),
      },
    );
  };

  const onDelete = () => {
    const message = t("data:configuration.sections.documents.confirmDelete", {
      name: document.name,
    });
    if (!window.confirm(message)) return;
    deleteDocument.mutate(document, { onError: () => addMutationError() });
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border border-nutrition-green/20 bg-white p-2">
      <DocumentTypeIcon
        documentType={document.document_type}
        size={28}
        className="shrink-0 text-nutrition-green"
      />
      <div className="min-w-0 flex-1">
        {editName === null ? (
          <p className="truncate font-semibold text-text-title" title={document.name}>
            {document.name}
          </p>
        ) : (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={editName}
              maxLength={DOCUMENT_NAME_MAX_LENGTH}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveName();
                if (e.key === "Escape") setEditName(null);
              }}
              className={renameInputStyle}
            />
            <button
              type="button"
              title={t("data:configuration.sections.documents.save")}
              aria-label={t("data:configuration.sections.documents.save")}
              disabled={!canSave || renameDocument.isPending}
              onClick={onSaveName}
              className={iconButtonStyle}
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              title={t("data:configuration.sections.documents.cancel")}
              aria-label={t("data:configuration.sections.documents.cancel")}
              onClick={() => setEditName(null)}
              className={iconButtonStyle}
            >
              <X size={18} />
            </button>
          </div>
        )}
        <p className="text-xs text-text-muted">
          {t(`data:configuration.sections.documents.types.${document.document_type}`)}
          {" · "}
          {formatFileSize(document.size_bytes)}
          {" · "}
          {new Date(document.created_at).toLocaleDateString(i18n.language)}
        </p>
      </div>
      {editName === null && (
        <>
          <button
            type="button"
            title={t("data:configuration.sections.documents.open")}
            aria-label={t("data:configuration.sections.documents.open")}
            onClick={onOpen}
            className={iconButtonStyle}
          >
            <ExternalLink size={18} />
          </button>
          <button
            type="button"
            title={t("data:configuration.sections.documents.rename")}
            aria-label={t("data:configuration.sections.documents.rename")}
            onClick={() => setEditName(document.name)}
            className={iconButtonStyle}
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            title={t("data:configuration.sections.documents.delete")}
            aria-label={t("data:configuration.sections.documents.delete")}
            disabled={deleteDocument.isPending}
            onClick={onDelete}
            className={deleteButtonStyle}
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
    </li>
  );
};
