const i=r=>r.description?r.description:r.scheduled_on?[...new Set(r.nutri_points.map(e=>e.theme_name).filter(e=>!!e))].sort((e,t)=>e.localeCompare(t)).join(", "):"";export{i as a};
