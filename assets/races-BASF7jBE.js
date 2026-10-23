import{r as k,h as m,g as h,l,E as y,e as w,s as i,J as x,ae as v}from"./index-BT17PqXG.js";import{a as _}from"./mutate-9eXYMefq.js";import{r as I,h as E}from"./nutrition-DlphrOis.js";import{d as K}from"./images-Cp8ESffs.js";const f="race_gpx",g="race_images",p=(a,r)=>`${a}/${r}.png`,D=()=>`
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
  `,q=()=>{const a=m(n=>n.config.selectedDay),r=m(n=>n.config.selectedUserId),e=new x(a),t=e.thisMonday(),s=e.thisSunday();return h({queryKey:l({userId:r}).user.races(t.save(),s.save()),queryFn:async()=>{const{data:n,error:c}=await i.from("nutri_races").select(D()).eq("user_id",r||"").gte("race_date",t.save()).lte("race_date",s.save()).order("race_date");if(c)throw c;return n.map(o=>{const d=I(o.race_ingredients,u=>u.ingredient?.hc_amount);return{id:o.id,nutriId:o.nutri_id,name:o.name,date:o.race_date,distanceKm:o.distance_km,gpxPath:o.gpx_path,totalHc:d,totalKcal:E(d)}})},enabled:!!r})},$=()=>{const a=q();return{totalsByDate:k.useMemo(()=>{const e=new Map;return a.data?.forEach(t=>{const s=e.get(t.date)??{hc:0,kcal:0};e.set(t.date,{hc:s.hc+t.totalHc,kcal:s.kcal+t.totalKcal})}),e},[a.data]),isLoading:a.isLoading}},R=()=>`
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
  `,M=a=>{const r=m(e=>e.config.selectedUserId);return h({queryKey:l({userId:r}).user.racePlan(a??0),queryFn:async()=>{const{data:e,error:t}=await i.from("nutri_races").select(R()).eq("id",a??0).single();if(t)throw t;return{id:e.id,userId:e.user_id,name:e.name,raceDate:e.race_date,distanceKm:e.distance_km,gpxPath:e.gpx_path,steps:e.race_steps.sort((s,n)=>s.km_start-n.km_start),ingredients:e.race_ingredients.sort((s,n)=>s.km-n.km),landmarks:e.race_landmarks}},enabled:a!==null,staleTime:0,gcTime:0})},F=async a=>{const r=[...new Set(a)];if(!r.length)return;const{data:e,error:t}=await i.from("nutri_races").select("gpx_path").in("gpx_path",r);if(t){console.error("Error checking race gpx usage:",t);return}const s=new Set(e.map(o=>o.gpx_path)),n=r.filter(o=>!s.has(o));if(!n.length)return;const{error:c}=await i.storage.from(f).remove(n);c&&console.error("Error removing race gpx:",c)},b=()=>{const{data:a}=w(),r=a?.userId??"";return _({mutationFn:async e=>{const t=e.name.replace(/[^\w.-]+/g,"_"),s=`${r}/${Date.now()}-${t}`,{error:n}=await i.storage.from(f).upload(s,e,{contentType:e.type||"application/gpx+xml"});if(n)throw n;return s}})},S=async(a,r,e)=>{const{error:t}=await i.storage.from(g).upload(p(a,r),e,{contentType:"image/png",upsert:!0,cacheControl:"0"});if(t)throw t},A=()=>{const a=y(),{data:r}=w(),e=r?.userId??"";return _({mutationFn:async({draft:t,renderImage:s})=>{if(t.distanceKm===null)throw new Error("Race distance is required");const n=s().catch(u=>(console.error("Error rendering race image:",u),null)),{data:c,error:o}=await i.rpc("save_race_plan",{p_id:t.id??void 0,p_user_id:t.userId,p_race_date:t.raceDate,p_name:t.name,p_distance_km:t.distanceKm,p_gpx_path:t.gpxPath??void 0,p_steps:t.steps,p_ingredients:t.ingredients,p_landmarks:t.landmarks});if(o)throw o;const d=await n;if(!d)return{raceId:c,imageUploaded:!1};try{return await S(e,c,d),{raceId:c,imageUploaded:!0}}catch(u){return console.error("Error uploading race image:",u),{raceId:c,imageUploaded:!1}}},onSuccess:(t,{draft:s})=>{a.invalidateQueries({queryKey:l({userId:s.userId}).user.racesBase})}})},P=a=>`${a.date}-${a.name.replace(/[^\p{L}\p{N}._-]+/gu,"_")}.png`,G=a=>a instanceof v&&(a.status===404||["404","not_found","NoSuchKey"].includes(a.statusCode)),Q=()=>_({mutationFn:async a=>{const{data:r,error:e}=await i.storage.from(g).download(p(a.nutriId,a.id));if(e)throw e;K(r,P(a))}}),H=()=>{const a=m(e=>e.config.selectedUserId),r=y();return _({mutationFn:async({id:e,nutriId:t,gpxPath:s})=>{const{error:n}=await i.from("nutri_races").delete().eq("id",e);if(n)throw n;const c=async()=>{const{error:o}=await i.storage.from(g).remove([p(t,e)]);o&&console.error("Error removing race image:",o)};return await Promise.all([c(),s?F([s]):void 0]),e},onSuccess:()=>{r.invalidateQueries({queryKey:l({userId:a}).user.racesBase})}})};export{A as a,M as b,F as c,q as d,H as e,Q as f,b as g,G as i,P as r,$ as u};
