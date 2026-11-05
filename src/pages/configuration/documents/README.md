# Mis documentos

Sección de configuración donde el nutricionista sube, renombra, abre y borra sus documentos (PDF, imágenes y hojas de cálculo) para compartirlos después con sus clientes en consultas y planificaciones.

- `index.tsx`: página con dos tarjetas, la lista y el formulario de subida.
- `form.ts`: `useForm` con solo el nombre. Al elegir un fichero se propone su nombre sin extensión si el campo está vacío.
- `insert.tsx`: botón que sube el fichero con `useUploadDocument`.
- `list.tsx`: lista de documentos (`useFetchMyDocuments`).
- `@components/fileInput.tsx`: selector de fichero. Comprueba en el cliente el tipo y el tamaño (20 MB), con los mismos límites que el bucket.
- `@components/documentItem.tsx`: fila de la lista. Abre el documento con una URL firmada, lo renombra en línea y lo borra.

El tipo, el tamaño y el mime los rellena la base de datos a partir del fichero subido: al subirlo al bucket `nutritionist_documents`, un trigger crea la fila; al borrar el fichero, otro trigger borra la fila y sus adjuntos. Ver `src/services/tanstack/data/documents.ts`.
