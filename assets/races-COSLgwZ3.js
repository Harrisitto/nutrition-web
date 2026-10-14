import{d as w,r as k,h as u,g as p,l,E as _,s as i,J as x,e as f,aa as v}from"./index-Bwwifyn8.js";import{a as m}from"./mutate-CdV0ahbr.js";import{r as q,h as E}from"./nutrition-DlphrOis.js";import{u as R}from"./language-BanT3pEj.js";const D=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],S=w("chevron-right",D),g="race_gpx",I=()=>`
    id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_ingredients(
      amount,
      ingredient: nutri_race_ingredients(hc_amount)
    )
  `,K=()=>{const s=u(n=>n.config.selectedDay),t=u(n=>n.config.selectedUserId),e=new x(s),a=e.thisMonday(),r=e.thisSunday();return p({queryKey:l({userId:t}).user.races(a.save(),r.save()),queryFn:async()=>{const{data:n,error:c}=await i.from("nutri_races").select(I()).eq("user_id",t||"").gte("race_date",a.save()).lte("race_date",r.save()).order("race_date");if(c)throw c;return n.map(o=>{const d=q(o.race_ingredients,y=>y.ingredient?.hc_amount);return{id:o.id,name:o.name,date:o.race_date,distanceKm:o.distance_km,gpxPath:o.gpx_path,totalHc:d,totalKcal:E(d)}})},enabled:!!t})},B=()=>{const s=K();return{totalsByDate:k.useMemo(()=>{const e=new Map;return s.data?.forEach(a=>{const r=e.get(a.date)??{hc:0,kcal:0};e.set(a.date,{hc:r.hc+a.totalHc,kcal:r.kcal+a.totalKcal})}),e},[s.data]),isLoading:s.isLoading}},F=()=>`
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
  `,C=s=>{const t=u(e=>e.config.selectedUserId);return p({queryKey:l({userId:t}).user.racePlan(s??0),queryFn:async()=>{const{data:e,error:a}=await i.from("nutri_races").select(F()).eq("id",s??0).single();if(a)throw a;return{id:e.id,userId:e.user_id,name:e.name,raceDate:e.race_date,distanceKm:e.distance_km,gpxPath:e.gpx_path,steps:e.race_steps.sort((r,n)=>r.km_start-n.km_start),ingredients:e.race_ingredients.sort((r,n)=>r.km-n.km),landmarks:e.race_landmarks}},enabled:s!==null,staleTime:0,gcTime:0})},h=async s=>{const t=[...new Set(s)];if(!t.length)return;const{data:e,error:a}=await i.from("nutri_races").select("gpx_path").in("gpx_path",t);if(a){console.error("Error checking race gpx usage:",a);return}const r=new Set(e.map(o=>o.gpx_path)),n=t.filter(o=>!r.has(o));if(!n.length)return;const{error:c}=await i.storage.from(g).remove(n);c&&console.error("Error removing race gpx:",c)},T=()=>{const{data:s}=f(),t=s?.userId??"";return m({mutationFn:async e=>{const a=e.name.replace(/[^\w.-]+/g,"_"),r=`${t}/${Date.now()}-${a}`,{error:n}=await i.storage.from(g).upload(r,e,{contentType:e.type||"application/gpx+xml"});if(n)throw n;const{data:c,error:o}=await i.functions.invoke("parse-gpx",{body:{gpx_path:r}});if((o||!c)&&await h([r]),o){if(o instanceof v){const d=await o.context.json().catch(()=>null);throw new Error(d?.error??o.message)}throw o}if(!c)throw new Error("parse-gpx returned no data");return c}})},H=()=>{const s=_();return m({mutationFn:async t=>{if(t.distanceKm===null)throw new Error("Race distance is required");const{data:e,error:a}=await i.rpc("save_race_plan",{p_id:t.id??void 0,p_user_id:t.userId,p_race_date:t.raceDate,p_name:t.name,p_distance_km:t.distanceKm,p_gpx_path:t.gpxPath??void 0,p_steps:t.steps,p_ingredients:t.ingredients,p_landmarks:t.landmarks});if(a)throw a;return e},onSuccess:(t,e)=>{s.invalidateQueries({queryKey:l({userId:e.userId}).user.racesBase})}})},Q=()=>{const s=R();return m({mutationFn:async t=>{const{data:e,error:a}=await i.functions.invoke("display-gpx",{body:{race_id:t.id,lang:s}});if(a)throw a;if(!e)throw new Error("display-gpx returned no data");const r=URL.createObjectURL(new Blob([e],{type:"image/svg+xml"})),n=document.createElement("a");n.href=r,n.download=`${t.date}-${t.name.replace(/[^\p{L}\p{N}._-]+/gu,"_")}.svg`,n.click(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}})},$=()=>{const s=u(e=>e.config.selectedUserId),t=_();return m({mutationFn:async({id:e,gpxPath:a})=>{const{error:r}=await i.from("nutri_races").delete().eq("id",e);if(r)throw r;return a&&await h([a]),e},onSuccess:()=>{t.invalidateQueries({queryKey:l({userId:s}).user.racesBase})}})};export{S as C,H as a,C as b,K as c,$ as d,Q as e,T as f,h as r,B as u};
