import { ALL_IDS, type RowInfo } from "../../types";
import { rowLabelStyle, sectionHeaderBoxStyle } from "../../styles";

interface CellRowLabelProps {
  row: { original: RowInfo };
}

const CellRowLabel = ({ row }: CellRowLabelProps) => {
  const { isFullWidth, label, resume } = row.original;
  // El preset row funciona como cabecera visual (nombres de los días), así
  // que su celda de etiqueta comparte el mismo estilo que las cabeceras.
  const isHeaderRow = isFullWidth || row.original.getRowId() === ALL_IDS.INPUT_PRESET;

  return (
    <div
      className={
        isHeaderRow
          ? sectionHeaderBoxStyle
          : `${rowLabelStyle} items-start text-left`
      }
    >
      <span className="font-semibold">{label}</span>
      {!!resume && (
        <p className="mt-0.5 text-xs font-bold leading-tight opacity-70">
          {resume}
        </p>
      )}
    </div>
  );
};

export default CellRowLabel;
