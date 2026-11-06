-- Nombre del grupo de los puntos de una temática que caen el mismo día (mismo theme_id e in_days).
-- Se guarda repetido en cada punto del día: la web lo escribe en todos a la vez y, al añadir un
-- punto a un día que ya tiene grupo, lo copia. Al llevar el punto a una consulta se copia a
-- appointment_points.group_name.
alter table public.appointment_theme_points
  add column if not exists group_name text
  constraint appointment_theme_points_group_name_check
    check (group_name is null or char_length(group_name) between 1 and 100);

-- Por si la tabla usa GRANTs por columna (con GRANT de tabla no cambia nada)
grant insert (group_name), update (group_name) on public.appointment_theme_points to authenticated;
