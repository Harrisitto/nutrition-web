# nutrition-web

Web app para nutricionistas: gestionan sus clientes, planificación semanal de comidas, carreras, citas, recetas, vídeos y documentos. React 19 + TypeScript + Vite (SWC), Tailwind, TanStack Query, Redux Toolkit, Supabase. Deploy en GitHub Pages (`HashRouter`).

## Verificación (no hacer build)

- **Nunca** ejecutar `npm run build` ni `vite build`: cuelga el ordenador.
- Tipos: `npx tsc -p tsconfig.app.json --noEmit` (nunca `tsc -p .`: el `tsconfig.json` raíz solo tiene references y no comprueba nada).
- Lint: `npx eslint <paths>`.
- Tipos de Supabase: `npm run supabase-types` regenera `src/services/supabase/types.ts` (no editar a mano).

## Estructura

```
src/
  App.tsx              rutas públicas + dashboard protegido, <Suspense> global
  components/          componentes compartidos (global/, input/) y styles.ts
  helpers/             funciones puras (fechas, nutrición, imágenes, youtube...)
  hooks/
    form/              sistema de formularios propio (useForm + Field + FormConfig)
    navigation/        APP_ROUTES, metadata de rutas, useAppNavigation
    helpers/
  pages/               una carpeta por página/sección
  services/
    supabase/          client.ts, types.ts (generado), database.ts (correcciones de tipos de las vistas)
    tanstack/          queries y mutations: auth/, user/, data/ + keys.ts + queryClient.ts
    i18n/              config + locales/{es,en}/*.json
  store/               Redux: slices/{config,error,notification}/ (store.ts + hook.ts)
supabase/              SQL de migraciones y funciones (no se ejecuta desde la web)
```

## Convenciones de carpetas

- **`@components/`**: subcomponentes privados de una página o componente. Solo los importa su carpeta padre. Se anidan: `planing/@components/table/@components/cells/...`.
- **`@queries/`**: queries de TanStack exclusivas de una página (p.ej. `pages/dashboard/@queries/hasSuscription.ts`). Las queries compartidas van en `src/services/tanstack/`.
- Cada página o sección tiene su `index.tsx` con export por defecto. Archivos auxiliares al lado: `form.ts` (config de useForm), `insert.tsx`, `list.tsx`, `styles.ts`, `hooks/`, `types/`, `constants.ts`.
- Muchas carpetas tienen un **`README.md`** en español que explica qué hace la sección. Al crear una sección nueva, añade su README. Al cambiar el comportamiento, actualízalo.
- Nombres de carpetas y archivos en camelCase (`raceIngredients/`, `appointmentThemes/`). En código antiguo aún hay alguna carpeta `components/` sin `@`, pero lo nuevo usa `@components/`.

## Páginas y rutas

- **Las páginas se importan siempre con `lazy`** y la constante se llama `PageXyz`:
  ```ts
  const PageMyVideos = lazy(() => import("./myVideos/index"));
  // si el módulo solo tiene export con nombre:
  const PageRecipes = lazy(() =>
    import("./recipes/index").then((m) => ({ default: m.Recipes })),
  );
  ```
  Las pantallas de bloqueo del dashboard siguen el mismo patrón con prefijo `Screen` (`ScreenNoClients`, `ScreenPaymentRequired`).
- El `<Suspense>` está en `App.tsx`, así que las páginas lazy no necesitan uno propio.
- Las rutas están centralizadas en `APP_ROUTES` (`src/hooks/navigation/routes.ts`). Las subrutas usan `getTrailingRoute(APP_ROUTES.X)` dentro de `<Routes>` anidados (ver `pages/dashboard/index.tsx` y `pages/configuration/index.tsx`).
- Para navegar se usa `useAppNavigation().navigateTo(APP_ROUTES.X)`, no `useNavigate` directamente: comprueba la sesión y registra la ruta en el store.
- Para una sección nueva de configuración: añade la ruta a `APP_ROUTES`, una entrada en `sections` del `<Header>`, el `<Route>` y las traducciones `data:configuration.sections.<x>.title`.

## Datos (TanStack Query + Supabase)

- Hooks en `src/services/tanstack/{auth,user,data}/<entidad>.ts`, nombrados `useFetchXxx`, `useInsertXxx`, `useMutateXxx`, `useDeleteXxx`.
  - `user/`: datos de un cliente concreto. `data/`: datos del nutricionista (recetas, vídeos, documentos...). `auth/`: sesión e info del nutricionista.
- Las query keys salen **siempre** de `queryKeys({ userId, language, searchStr })` en `services/tanstack/keys.ts`. Usa claves `xxxBase` como prefijo para invalidar todas las variantes.
- Patrón: `const { data, error } = await supabase.from(...)...; if (error) throw error; return data;`, con `enabled: !!id` cuando depende de la sesión.
- En `onSuccess`, `queryClient.invalidateQueries` (o `setQueriesData` para updates optimistas) sobre las keys afectadas.
- Tipos de fila: `Database["public"]["Tables"]["tabla"]["Row" | "Insert" | "Update"]` desde `@src/services/supabase/types`.
- El id del nutricionista sale de `useGetAuthSession().data?.userId`. `nutri_id` lo pone la base de datos (`default auth.uid()`), no se envía al insertar.
- Los nombres de tablas, vistas y columnas se escriben como literales (`.from("nutri_videos")`): el cliente tipado de Supabase los comprueba. Las vistas ya filtran por `auth.uid()`, así que no hace falta `.eq("nutri_id", ...)`.

## Supabase / seguridad

- Sin triggers. Se usan RLS, GRANTs por columna y RPC `security definer`.
- Las tablas de usuarios están en el esquema `public_users` y se usan por vistas (ver `../nutrition-proton/MIGRATION.md`). Los clientes del nutricionista salen de la vista `nutri_clients` (no de `all_users`, que es una vista de compatibilidad que se borrará). El nutricionista puede editar el perfil de sus clientes por esa vista, solo con suscripción activa (error 55000 si no).
- Las vistas generan tipos con columnas nullable y sin `Update` cuando se escriben con INSTEAD OF: `src/services/supabase/database.ts` los corrige. Usa `ViewRow` / `ViewInsert` de ahí, y el cliente se tipa con ese `Database`.
- Tipos desde la base local: `npx supabase gen types typescript --db-url postgresql://postgres:postgres@127.0.0.1:54322/postgres --schema public > src/services/supabase/types.ts`.
- Los cambios de `nutri_id` (invitar, quitar o abandonar cliente) van por RPC (`invite_client`, `accept_invitation`, `remove_client`, `leave_nutritionist`), nunca por update directo.
- El SQL nuevo va en `supabase/migrations/` con prefijo de timestamp `YYYYMMDDHHMMSS_nombre.sql`.

## UI y estilos

- Tailwind con la **paleta propia** de `tailwind.config.js` (`nutrition-green`, `dark-green`, `white-green`, `fade-green`, `text-title`, `text-body`, `text-muted`, `gray-blue-*`...). Evita `gray-*` y `white` genéricos en código nuevo.
- Las clases repetidas se guardan como constantes de string en un `styles.ts`: compartidas en `src/components/styles.ts` (`cardStyle`, `primaryButtonStyle`, `iconButtonStyle`...) y locales junto a la página (`planing/@components/table/styles.ts`).
- Iconos de `lucide-react`.
- Formularios con `useForm` de `@src/hooks/form` y la config en un `form.ts` junto al componente.
- Notificaciones con `useNotification()` (`store/slices/notification/hook.ts`): `addFormSubmitSucess`, `addFormSubmitError`, `addMutationError`... Úsalo en el `onError` de las mutations.

## i18n

- Todo texto visible pasa por `t("namespace:ruta.clave")`. Namespaces: `system`, `auth`, `data`, `forms`, `home`.
- Añade cada clave en **`locales/es` y `locales/en`**.

## Estado global (Redux)

- `useAppDispatch` / `useAppSelector` de `@src/store/store`.
- Cada slice vive en `store/slices/<nombre>/store.ts` y sus hooks en `hook.ts`.
- `redux-persist` solo persiste las preferencias de `config` de la whitelist (`keyboardCommands`, `showMealsInTable`, `autoAdjustMeals`). El estado de sesión (cliente seleccionado, día...) no sobrevive a un reload.

## Estilo de código

- Imports con el alias `@src/...` en vez de rutas relativas largas (`../../../../`).
- TS estricto con `noUnusedLocals` y `noUnusedParameters`: no dejes imports ni variables sin usar.
- Los comentarios explican el porqué, en español o inglés.
- Commits: `feature: ...`, `fix: ...`, `chore: ...`, en minúscula y en inglés.

## graphify

`graphify-out/` es local (no se commitea). Antes de explorar el código usa `graphify query "<pregunta>"`. Después de modificar código, ejecuta `graphify update .`.
