import { useTranslation } from "react-i18next";
import { DocumentTypeIcon } from "@src/components/global/DocumentTypeIcon";
import type FromDate from "@src/helpers/dates";
import { useFetchMyDocuments } from "@src/services/tanstack/data/documents";
import DocumentSelectEditor from "../inputs/documentSelectInput";
import {
  cellChipStyle,
  expandedRevealStyle,
  highlightRingStyle,
  overflowRevealStyle,
} from "../../styles";
import ExpandableCell from "./expandableCell";

interface CellDocumentProps {
  date: FromDate;
  // user_planing.document_id del día, "" si no tiene
  cellValue: string | number;
  isEditing: boolean;
  isHighlighted: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}

const CellDocument = ({
  date,
  cellValue,
  isEditing,
  isHighlighted,
  openEditor,
  closeEditor,
}: CellDocumentProps) => {
  const { t } = useTranslation();
  const documentId = String(cellValue ?? "") || null;
  // Misma query que el selector: la caché la comparten todas las celdas de la fila
  const { data: documents } = useFetchMyDocuments();
  const document = documentId
    ? documents?.find((doc) => doc.id === documentId)
    : undefined;
  // Un documento de un nutricionista anterior (copiado con clone_week_planing) no está en la lista
  const label = document?.name ?? (documentId ? t("data:dashboardTable.documentRow.other") : "-");

  return (
    <>
      <ExpandableCell isExpanded={isHighlighted}>
        <button
          type="button"
          onClick={openEditor}
          className={`${cellChipStyle} ${overflowRevealStyle} flex items-center justify-center gap-1 text-dark-green ${
            isHighlighted ? `${highlightRingStyle} ${expandedRevealStyle}` : ""
          }`}
        >
          {document && (
            <DocumentTypeIcon
              documentType={document.document_type}
              size={14}
              className="shrink-0 text-nutrition-green"
            />
          )}
          <span className="truncate">{label}</span>
        </button>
      </ExpandableCell>

      {isEditing && (
        <DocumentSelectEditor
          date={date}
          currentDocumentId={documentId}
          onClose={closeEditor}
        />
      )}
    </>
  );
};

export default CellDocument;
