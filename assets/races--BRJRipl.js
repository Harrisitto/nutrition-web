import{d as k,r as f,h as u,g as _,l as p,E as g,s as i,J as x,aa as v,ab as m,e as b,ac as q}from"./index-BUGAjsA4.js";import{a as l}from"./mutate-X_j6dWQ1.js";import{r as D,h as E}from"./nutrition-DlphrOis.js";import{u as K}from"./language-CfrZfUTc.js";const R=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],$=k("chevron-right",R),h="race_gpx",I=()=>`
    id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_ingredients(
      amount,
      ingredient: nutri_race_ingredients(hc_amount)
    )
  `,F=()=>{const r=u(n=>n.config.selectedDay),a=u(n=>n.config.selectedUserId),e=new x(r),t=e.thisMonday(),s=e.thisSunday();return _({queryKey:p({userId:a}).user.races(t.save(),s.save()),queryFn:async()=>{const{data:n,error:c}=await i.from("nutri_races").select(I()).eq("user_id",a||"").gte("race_date",t.save()).lte("race_date",s.save()).order("race_date");if(c)throw c;return n.map(o=>{const d=D(o.race_ingredients,w=>w.ingredient?.hc_amount);return{id:o.id,name:o.name,date:o.race_date,distanceKm:o.distance_km,gpxPath:o.gpx_path,totalHc:d,totalKcal:E(d)}})},enabled:!!a})},C=()=>{const r=F();return{totalsByDate:f.useMemo(()=>{const e=new Map;return r.data?.forEach(t=>{const s=e.get(t.date)??{hc:0,kcal:0};e.set(t.date,{hc:s.hc+t.totalHc,kcal:s.kcal+t.totalKcal})}),e},[r.data]),isLoading:r.isLoading}},S=()=>`
    id,
    user_id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_steps(
      km_start,
      min_altitude,
      min_altitude_at,
      max_altitude,
      max_altitude_at,
      elevation_gain,
      elevation_loss,
      aprox_time_start
    ),
    race_ingredients(ingredient_id, km, amount, km_span),
    race_landmarks(landmark_id, km, name)
  `,B=r=>{const a=u(e=>e.config.selectedUserId);return _({queryKey:p({userId:a}).user.racePlan(r??0),queryFn:async()=>{const{data:e,error:t}=await i.from("nutri_races").select(S()).eq("id",r??0).single();if(t)throw t;return{id:e.id,userId:e.user_id,name:e.name,raceDate:e.race_date,distanceKm:e.distance_km,gpxPath:e.gpx_path,steps:e.race_steps.sort((s,n)=>s.km_start-n.km_start),ingredients:e.race_ingredients.sort((s,n)=>s.km-n.km),landmarks:e.race_landmarks}},enabled:r!==null,staleTime:0,gcTime:0})},y=async r=>{const a=[...new Set(r)];if(!a.length)return;const{data:e,error:t}=await i.from("nutri_races").select("gpx_path").in("gpx_path",a);if(t){console.error("Error checking race gpx usage:",t);return}const s=new Set(e.map(o=>o.gpx_path)),n=a.filter(o=>!s.has(o));if(!n.length)return;const{error:c}=await i.storage.from(h).remove(n);c&&console.error("Error removing race gpx:",c)},H=()=>{const{data:r}=b(),a=r?.userId??"";return l({mutationFn:async e=>{const t=e.name.replace(/[^\w.-]+/g,"_"),s=`${a}/${Date.now()}-${t}`,{error:n}=await i.storage.from(h).upload(s,e,{contentType:e.type||"application/gpx+xml"});if(n)throw n;const{data:c,error:o}=await i.functions.invoke("parse-gpx",{body:{gpx_path:s}});if((o||!c)&&await y([s]),o){if(o instanceof q){const d=await o.context.json().catch(()=>null);throw new Error(d?.error??o.message)}throw o}if(!c)throw new Error("parse-gpx returned no data");return c}})},Q=()=>{const r=g();return l({mutationFn:async a=>{if(a.distanceKm===null)throw new Error("Race distance is required");const{data:e,error:t}=await i.rpc("save_race_plan",{p_id:a.id??void 0,p_user_id:a.userId,p_race_date:a.raceDate,p_name:a.name,p_distance_km:a.distanceKm,p_gpx_path:a.gpxPath??void 0,p_steps:a.steps,p_ingredients:a.ingredients,p_landmarks:a.landmarks});if(t)throw t;return e},onSuccess:(a,e)=>{r.invalidateQueries({queryKey:p({userId:e.userId}).user.racesBase})}})},j=()=>{const r=K();return l({mutationFn:async a=>{const{data:e}=await i.auth.getSession(),t=await fetch(`${v}/functions/v1/display-gpx`,{method:"POST",headers:{"Content-Type":"application/json",apikey:m,Authorization:`Bearer ${e.session?.access_token??m}`},body:JSON.stringify({race_id:a.id,lang:r,format:"png"})});if(!t.ok)throw new Error(`display-gpx failed: ${t.status} ${await t.text()}`);const s=URL.createObjectURL(await t.blob()),n=document.createElement("a");n.href=s,n.download=`${a.date}-${a.name.replace(/[^\p{L}\p{N}._-]+/gu,"_")}.png`,n.click(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}})},A=()=>{const r=u(e=>e.config.selectedUserId),a=g();return l({mutationFn:async({id:e,gpxPath:t})=>{const{error:s}=await i.from("nutri_races").delete().eq("id",e);if(s)throw s;return t&&await y([t]),e},onSuccess:()=>{a.invalidateQueries({queryKey:p({userId:r}).user.racesBase})}})};export{$ as C,Q as a,B as b,F as c,A as d,j as e,H as f,y as r,C as u};
