# Mis documentos

Sección de configuración donde el nutricionista sube, renombra, abre y borra sus documentos (PDF, imágenes y hojas de cálculo) para compartirlos después con sus clientes en consultas y planificaciones.

- `index.tsx`: página con dos tarjetas, la lista y el formulario de subida.
- `form.ts`: `useForm` con el fichero (campo `file`) y el nombre. El fichero se valida en el cliente con el tipo y el tamaño (20 MB) del bucket. Un controller del campo `file` propone el nombre del fichero sin extensión si el nombre está vacío.
- `insert.tsx`: botón que valida el formulario y sube el fichero con `useUploadDocument`.
- `list.tsx`: lista de documentos (`useFetchMyDocuments`).
- `@components/documentItem.tsx`: fila de la lista. Abre el documento con una URL firmada, lo renombra en línea y lo borra.

El tipo, el tamaño y el mime los rellena la base de datos a partir del fichero subido: al subirlo al bucket `nutritionist_documents`, un trigger crea la fila; al borrar el fichero, otro trigger borra la fila y sus adjuntos. Ver `src/services/tanstack/data/documents.ts`.
