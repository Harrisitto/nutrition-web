import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import type { Database } from "@src/services/supabase/types";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";

/*
 * Documentos del nutricionista (migración 20261105150000_nutritionist_documents en nutrition-proton).
 * - Subir: se sube el fichero al bucket en `<nutri_id>/<uuid>` con metadata.name, y un trigger de
 *   storage.objects crea la fila de nutritionist_documents (id = uuid, mime y tamaño del fichero).
 * - Renombrar: UPDATE de `name` (el único campo con GRANT).
 * - Borrar: se borra el fichero del bucket y otro trigger borra la fila (y sus adjuntos en cascada).
 * - Leer: SELECT de la tabla; el fichero con una URL firmada (el bucket es privado).
 * La ruta del fichero en el bucket sale de la columna calculada public.nutritionist_document_path.
 */

export type NutritionistDocument = Database["public"]["Tables"]["nutritionist_documents"]["Row"] & {
    path: string;
};

// `path` es la columna calculada nutritionist_document_path(nutritionist_documents). Los tipos
// generados no la conocen, por eso las consultas usan overrideTypes<NutritionistDocument>
const DOCUMENT_SELECT = "*, path:nutritionist_document_path";

export const DOCUMENTS_BUCKET = "nutritionist_documents";
// Mismo límite y tipos que el bucket y el CHECK de nutritionist_documents.mime_type
export const DOCUMENT_MAX_SIZE_BYTES = 20 * 1024 * 1024;
export const DOCUMENT_ALLOWED_MIME_TYPES = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.spreadsheet",
] as const;

/**
 * URL firmada para ver o descargar un documento. `download`: true descarga con su nombre
 * original, un string descarga con ese nombre
 */
export const getDocumentSignedUrl = async (
    document: Pick<NutritionistDocument, "path">,
    { expiresIn = 60, download }: { expiresIn?: number; download?: string | boolean } = {},
) => {
    const { data, error } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .createSignedUrl(document.path, expiresIn, { download });

    if (error) {
        throw error;
    }
    return data.signedUrl;
};

/**
 * Abre un documento en una pestaña nueva. La ventana se abre antes del await: si se abre después,
 * el navegador la bloquea como popup. Si falla la URL firmada, cierra la pestaña y lanza el error
 */
export const openDocumentInNewTab = async (document: Pick<NutritionistDocument, "path">) => {
    const win = window.open("", "_blank");
    try {
        const url = await getDocumentSignedUrl(document);
        if (win) {
            win.opener = null;
            win.location.href = url;
        } else {
            window.location.href = url;
        }
    } catch (error) {
        win?.close();
        throw error;
    }
};

/** Documentos del nutricionista autenticado, los más recientes primero */
export const useFetchMyDocuments = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useQuery({
        queryKey: queryKeys({ userId: nutriId }).data.documents,
        queryFn: async () => {
            const { data, error } = await supabase
                .from("nutritionist_documents")
                .select(DOCUMENT_SELECT)
                .eq("nutri_id", nutriId)
                .order("created_at", { ascending: false })
                .overrideTypes<NutritionistDocument[], { merge: false }>();

            if (error) {
                throw error;
            }
            return data;
        },
        enabled: !!nutriId,
    });
};

/**
 * Sube un documento. La fila la crea el trigger nutritionist_documents_on_upload: si el nombre ya
 * existe (único por nutricionista, sin distinguir mayúsculas) o el tipo no está permitido, la
 * subida falla. Devuelve el id del documento
 */
export const useUploadDocument = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async ({ file, name }: { file: File; name: string }) => {
            const id = crypto.randomUUID();
            // La fila aun no existe, asi que la ruta no puede salir de nutritionist_document_path:
            // se construye con el mismo formato, que la policy de subida de storage.objects valida

            const { error } = await supabase.storage
                .from(DOCUMENTS_BUCKET)
                .upload(`${nutriId}/${id}`, file, {
                    contentType: file.type,
                    upsert: false,
                    metadata: { name: name.trim() },
                });

            if (error) {
                throw error;
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys({ userId: nutriId }).data.documents });
        },
    });
};

export const useRenameDocument = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async ({ id, name }: { id: string; name: string }) => {
            const { data, error } = await supabase
                .from("nutritionist_documents")
                .update({ name: name.trim() })
                .eq("id", id)
                .select(DOCUMENT_SELECT)
                .single()
                .overrideTypes<NutritionistDocument, { merge: false }>();

            if (error) {
                throw error;
            }
            return data;
        },
        onSuccess: (updated) => {
            queryClient.setQueriesData<NutritionistDocument[]>(
                { queryKey: queryKeys({ userId: nutriId }).data.documents },
                (old) => old?.map((document) => (document.id === updated.id ? updated : document)),
            );
        },
    });
};

/**
 * Borra el fichero del bucket; el trigger nutritionist_documents_on_delete borra la fila, sus
 * adjuntos en consultas y deja a null user_planing.document_id
 */
export const useDeleteDocument = () => {
    const { data: sessionData } = useGetAuthSession();
    const nutriId = sessionData?.userId ?? "";

    return useMutation({
        mutationFn: async (document: Pick<NutritionistDocument, "path">) => {
            const { data, error } = await supabase.storage
                .from(DOCUMENTS_BUCKET)
                .remove([document.path]);

            if (error) {
                throw error;
            }
            // remove no falla si el fichero no existe (o la RLS no deja borrarlo): devuelve []
            if (data.length === 0) {
                throw new Error("Document not found");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys({ userId: nutriId }).data.documents });
            // Los días de la planificación que lo tenían adjunto pasan a document_id null
            queryClient.invalidateQueries({ queryKey: queryKeys().user.planingAllUsers });
            // Y los puntos de las temáticas (appointment_theme_points.document_id on delete set null)
            queryClient.invalidateQueries({ queryKey: queryKeys().data.appointmentThemes });
        },
    });
};
