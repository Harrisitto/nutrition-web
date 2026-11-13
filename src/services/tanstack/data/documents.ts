import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@src/services/supabase/client";
import type { ViewRow } from "@src/services/supabase/database";
import { queryKeys } from "../keys";
import { queryClient } from "../queryClient";
import { useGetAuthSession } from "../auth/get";

/*
 * Documentos del nutricionista: la vista nutri_documents (migración 20261112130000_schema_documents en
 * nutrition-proton), que solo devuelve los del nutricionista autenticado.
 * - Subir: se sube el fichero al bucket en `<nutri_id>/<uuid>` con metadata.name, y un trigger de
 *   storage.objects crea la fila del documento (id = uuid, mime y tamaño del fichero).
 * - Renombrar: UPDATE de `name` (lo único que deja cambiar la vista; pide suscripción activa).
 * - Borrar: se borra el fichero del bucket y otro trigger borra la fila (y sus adjuntos en cascada).
 * - Leer: SELECT de la vista; el fichero con una URL firmada (el bucket es privado). `path` es la
 *   ruta del fichero en el bucket.
 */

export type NutritionistDocument = ViewRow<"nutri_documents">;

export const DOCUMENTS_BUCKET = "nutritionist_documents";
// Mismo límite y tipos que el bucket y el CHECK de public_documents.nutri_documents.mime_type
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
                .from("nutri_documents")
                .select("*")
                .order("created_at", { ascending: false });

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
            // La fila aun no existe, asi que la ruta no puede salir de nutri_documents.path: se
            // construye con el mismo formato, que la policy de subida de storage.objects valida

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
                .from("nutri_documents")
                .update({ name: name.trim() })
                .eq("id", id)
                .select("*")
                .single();

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
