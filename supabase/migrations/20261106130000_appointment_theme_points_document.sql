-- Documento (opcional) de un punto de la plantilla de una temática. Al llevar el punto a una
-- consulta se copia a appointment_points.document_id, que es por donde el cliente lo puede leer.
-- Al borrar el documento, el punto se queda sin él.
alter table public.appointment_theme_points
  add column if not exists document_id uuid
  references public.nutritionist_documents (id) on delete set null;

create index if not exists appointment_theme_points_document_id_idx
  on public.appointment_theme_points (document_id);

-- Por si la tabla usa GRANTs por columna (con GRANT de tabla no cambia nada)
grant insert (document_id), update (document_id) on public.appointment_theme_points to authenticated;

-- Solo documentos del propio nutricionista. Restrictivas: se suman a las políticas que ya haya
drop policy if exists appointment_theme_points_own_document_insert on public.appointment_theme_points;
create policy appointment_theme_points_own_document_insert
  on public.appointment_theme_points
  as restrictive
  for insert
  to authenticated
  with check (
    document_id is null
    or exists (
      select 1 from public.nutritionist_documents d
      where d.id = document_id and d.nutri_id = (select auth.uid())
    )
  );

drop policy if exists appointment_theme_points_own_document_update on public.appointment_theme_points;
create policy appointment_theme_points_own_document_update
  on public.appointment_theme_points
  as restrictive
  for update
  to authenticated
  with check (
    document_id is null
    or exists (
      select 1 from public.nutritionist_documents d
      where d.id = document_id and d.nutri_id = (select auth.uid())
    )
  );
