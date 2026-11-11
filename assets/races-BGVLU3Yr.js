import{r as I,h as d,g as p,l as m,E as y,e as f,s as i,K as x,a2 as D}from"./index-CR6ZhJwY.js";import{q as E}from"./queryOptions-C9woPjwX.js";import{a as u}from"./mutate-BzuHjFxE.js";import{i as w}from"./macros-Cajjc6ni.js";import{r as K,h as R,k as F}from"./nutrition-DcxR0jr7.js";import{d as q}from"./images-Cp8ESffs.js";import{a as P}from"./index-BAvyxZhU.js";const k="race_gpx",g="race_images",_=(a,r)=>`${a}/${r}.png`,S=()=>`
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
  `,v=({userId:a,start:r,end:e})=>E({queryKey:m({userId:a}).user.races(r,e),queryFn:async()=>{const{data:t,error:s}=await i.from("nutri_races").select(S()).eq("user_id",a||"").gte("race_date",r).lte("race_date",e).order("race_date");if(s)throw s;return t.map(n=>{const o=K(n.race_ingredients,c=>c.ingredient?.hc_amount);return{id:n.id,nutriId:n.nutri_id,name:n.name,date:n.race_date,distanceKm:n.distance_km,gpxPath:n.gpx_path,totalHc:o,totalKcal:R(o)}})},enabled:!!a}),U=()=>{const a=d(e=>e.config.selectedDay),r=new x(a);return B({startDate:r.thisMonday(),endDate:r.thisSunday()})},B=({startDate:a,endDate:r})=>{const e=d(t=>t.config.selectedUserId);return p(v({userId:e,start:a.save(),end:r.save()}))},O=({startDate:a,endDate:r})=>{const e=d(t=>t.config.selectedUserId);return p({...v({userId:e,start:a.save(),end:r.save()}),select:t=>F(t,s=>s.totalKcal)})},W=()=>{const a=U();return{totalsByDate:I.useMemo(()=>{const e=new Map;return a.data?.forEach(t=>{const s=e.get(t.date)??{hc:0,kcal:0};e.set(t.date,{hc:s.hc+t.totalHc,kcal:s.kcal+t.totalKcal})}),e},[a.data]),isLoading:a.isLoading}},T=()=>`
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
  `,j=a=>{const r=d(e=>e.config.selectedUserId);return p({queryKey:m({userId:r}).user.racePlan(a??0),queryFn:async()=>{const{data:e,error:t}=await i.from("nutri_races").select(T()).eq("id",a??0).single();if(t)throw t;return{id:e.id,userId:e.user_id,name:e.name,raceDate:e.race_date,distanceKm:e.distance_km,gpxPath:e.gpx_path,steps:e.race_steps.sort((s,n)=>s.km_start-n.km_start),ingredients:e.race_ingredients.sort((s,n)=>s.km-n.km),landmarks:e.race_landmarks}},enabled:a!==null,staleTime:0,gcTime:0})},C=async a=>{const r=[...new Set(a)];if(!r.length)return;const{data:e,error:t}=await i.from("nutri_races").select("gpx_path").in("gpx_path",r);if(t){console.error("Error checking race gpx usage:",t);return}const s=new Set(e.map(c=>c.gpx_path)),n=r.filter(c=>!s.has(c));if(!n.length)return;const{error:o}=await i.storage.from(k).remove(n);o&&console.error("Error removing race gpx:",o)},X=()=>{const{data:a}=f(),r=a?.userId??"";return u({mutationFn:async e=>{const t=e.name.replace(/[^\w.-]+/g,"_"),s=`${r}/${Date.now()}-${t}`,{error:n}=await i.storage.from(k).upload(s,e,{contentType:e.type||"application/gpx+xml"});if(n)throw n;return s}})},z=()=>u({mutationFn:async a=>{const{data:r,error:e}=await i.functions.invoke("race-profile-image",{body:{image:await P(a),mime_type:a.type}});if(e)throw e;if(!r)throw new Error("race-profile-image returned no data");return r}}),M=async(a,r,e)=>{const{error:t}=await i.storage.from(g).upload(_(a,r),e,{contentType:"image/png",upsert:!0,cacheControl:"0"});if(t)throw t},J=()=>{const a=y(),{data:r}=f(),e=r?.userId??"";return u({mutationFn:async({draft:t,renderImage:s})=>{if(t.distanceKm===null)throw new Error("Race distance is required");const n=s().catch(l=>(console.error("Error rendering race image:",l),null)),{data:o,error:c}=await i.rpc("save_race_plan",{p_id:t.id??void 0,p_user_id:t.userId,p_race_date:t.raceDate,p_name:t.name,p_distance_km:t.distanceKm,p_gpx_path:t.gpxPath??void 0,p_steps:t.steps,p_ingredients:t.ingredients,p_landmarks:t.landmarks});if(c)throw c;const h=await n;if(!h)return{raceId:o,imageUploaded:!1};try{return await M(e,o,h),{raceId:o,imageUploaded:!0}}catch(l){return console.error("Error uploading race image:",l),{raceId:o,imageUploaded:!1}}},onSuccess:(t,{draft:s})=>{a.invalidateQueries({queryKey:m({userId:s.userId}).user.racesBase}),w(s.userId)}})},$=a=>`${a.date}-${a.name.replace(/[^\p{L}\p{N}._-]+/gu,"_")}.png`,V=a=>a instanceof D&&(a.status===404||["404","not_found","NoSuchKey"].includes(a.statusCode)),Y=()=>u({mutationFn:async a=>{const{data:r,error:e}=await i.storage.from(g).download(_(a.nutriId,a.id));if(e)throw e;q(r,$(a))}}),Z=()=>{const a=d(e=>e.config.selectedUserId),r=y();return u({mutationFn:async({id:e,nutriId:t,gpxPath:s})=>{const{error:n}=await i.from("nutri_races").delete().eq("id",e);if(n)throw n;const o=async()=>{const{error:c}=await i.storage.from(g).remove([_(t,e)]);c&&console.error("Error removing race image:",c)};return await Promise.all([o(),s?C([s]):void 0]),e},onSuccess:()=>{r.invalidateQueries({queryKey:m({userId:a}).user.racesBase}),w(a)}})};export{J as a,j as b,C as c,U as d,Z as e,Y as f,X as g,z as h,V as i,O as j,$ as r,W as u};
