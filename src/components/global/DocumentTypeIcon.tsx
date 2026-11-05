import { FileSpreadsheet, FileText, Image, type LucideProps } from "lucide-react";

// nutritionist_documents.document_type es una columna generada: 'pdf' | 'image' | 'spreadsheet'
const icons = {
  pdf: FileText,
  image: Image,
  spreadsheet: FileSpreadsheet,
} as const;

/** Icono según el tipo de documento del nutricionista */
export const DocumentTypeIcon = ({
  documentType,
  ...props
}: { documentType: string } & LucideProps) => {
  const Icon = icons[documentType as keyof typeof icons] ?? FileText;
  return <Icon {...props} />;
};
