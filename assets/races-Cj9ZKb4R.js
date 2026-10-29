import{r as x,h as d,g,l as u,E as y,e as w,s as i,K as v,ah as I}from"./index-DNMpLniO.js";import{q as D,r as K,h as E,k as R}from"./nutrition-i6VBPzKj.js";import{a as l}from"./mutate-D8ZcTcEg.js";import{d as F}from"./images-Cp8ESffs.js";const f="race_gpx",p="race_images",_=(a,r)=>`${a}/${r}.png`,q=()=>`
    id,
    nutri_id,
    name,
    race_date,
    distance_km,
    gpx_path,
    race_ingredients(
      amount,
      ingredient: nutri_race_ingredients(hc_amount)
    )
  `,k=({userId:a,start:r,end:e})=>D({queryKey:u({userId:a}).user.races(r,e),queryFn:async()=>{const{data:t,error:s}=await i.from("nutri_races").select(q()).eq("user_id",a||"").gte("race_date",r).lte("race_date",e).order("race_date");if(s)throw s;return t.map(n=>{const o=K(n.race_ingredients,c=>c.ingredient?.hc_amount);return{id:n.id,nutriId:n.nutri_id,name:n.name,date:n.race_date,distanceKm:n.distance_km,gpxPath:n.gpx_path,totalHc:o,totalKcal:E(o)}})},enabled:!!a}),S=()=>{const a=d(e=>e.config.selectedDay),r=new v(a);return U({startDate:r.thisMonday(),endDate:r.thisSunday()})},U=({startDate:a,endDate:r})=>{const e=d(t=>t.config.selectedUserId);return g(k({userId:e,start:a.save(),end:r.save()}))},G=({startDate:a,endDate:r})=>{const e=d(t=>t.config.selectedUserId);return g({...k({userId:e,start:a.save(),end:r.save()}),select:t=>R(t,s=>s.totalKcal)})},Q=()=>{const a=S();return{totalsByDate:x.useMemo(()=>{const e=new Map;return a.data?.forEach(t=>{const s=e.get(t.date)??{hc:0,kcal:0};e.set(t.date,{hc:s.hc+t.totalHc,kcal:s.kcal+t.totalKcal})}),e},[a.data]),isLoading:a.isLoading}},P=()=>`
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
  `,H=a=>{const r=d(e=>e.config.selectedUserId);return g({queryKey:u({userId:r}).user.racePlan(a??0),queryFn:async()=>{const{data:e,error:t}=await i.from("nutri_races").select(P()).eq("id",a??0).single();if(t)throw t;return{id:e.id,userId:e.user_id,name:e.name,raceDate:e.race_date,distanceKm:e.distance_km,gpxPath:e.gpx_path,steps:e.race_steps.sort((s,n)=>s.km_start-n.km_start),ingredients:e.race_ingredients.sort((s,n)=>s.km-n.km),landmarks:e.race_landmarks}},enabled:a!==null,staleTime:0,gcTime:0})},B=async a=>{const r=[...new Set(a)];if(!r.length)return;const{data:e,error:t}=await i.from("nutri_races").select("gpx_path").in("gpx_path",r);if(t){console.error("Error checking race gpx usage:",t);return}const s=new Set(e.map(c=>c.gpx_path)),n=r.filter(c=>!s.has(c));if(!n.length)return;const{error:o}=await i.storage.from(f).remove(n);o&&console.error("Error removing race gpx:",o)},N=()=>{const{data:a}=w(),r=a?.userId??"";return l({mutationFn:async e=>{const t=e.name.replace(/[^\w.-]+/g,"_"),s=`${r}/${Date.now()}-${t}`,{error:n}=await i.storage.from(f).upload(s,e,{contentType:e.type||"application/gpx+xml"});if(n)throw n;return s}})},C=async(a,r,e)=>{const{error:t}=await i.storage.from(p).upload(_(a,r),e,{contentType:"image/png",upsert:!0,cacheControl:"0"});if(t)throw t},L=()=>{const a=y(),{data:r}=w(),e=r?.userId??"";return l({mutationFn:async({draft:t,renderImage:s})=>{if(t.distanceKm===null)throw new Error("Race distance is required");const n=s().catch(m=>(console.error("Error rendering race image:",m),null)),{data:o,error:c}=await i.rpc("save_race_plan",{p_id:t.id??void 0,p_user_id:t.userId,p_race_date:t.raceDate,p_name:t.name,p_distance_km:t.distanceKm,p_gpx_path:t.gpxPath??void 0,p_steps:t.steps,p_ingredients:t.ingredients,p_landmarks:t.landmarks});if(c)throw c;const h=await n;if(!h)return{raceId:o,imageUploaded:!1};try{return await C(e,o,h),{raceId:o,imageUploaded:!0}}catch(m){return console.error("Error uploading race image:",m),{raceId:o,imageUploaded:!1}}},onSuccess:(t,{draft:s})=>{a.invalidateQueries({queryKey:u({userId:s.userId}).user.racesBase})}})},T=a=>`${a.date}-${a.name.replace(/[^\p{L}\p{N}._-]+/gu,"_")}.png`,O=a=>a instanceof I&&(a.status===404||["404","not_found","NoSuchKey"].includes(a.statusCode)),W=()=>l({mutationFn:async a=>{const{data:r,error:e}=await i.storage.from(p).download(_(a.nutriId,a.id));if(e)throw e;F(r,T(a))}}),X=()=>{const a=d(e=>e.config.selectedUserId),r=y();return l({mutationFn:async({id:e,nutriId:t,gpxPath:s})=>{const{error:n}=await i.from("nutri_races").delete().eq("id",e);if(n)throw n;const o=async()=>{const{error:c}=await i.storage.from(p).remove([_(t,e)]);c&&console.error("Error removing race image:",c)};return await Promise.all([o(),s?B([s]):void 0]),e},onSuccess:()=>{r.invalidateQueries({queryKey:u({userId:a}).user.racesBase})}})};export{L as a,H as b,B as c,S as d,X as e,W as f,N as g,G as h,O as i,T as r,Q as u};
