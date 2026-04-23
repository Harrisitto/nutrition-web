import{I as c,g as d,q as u,s as n,J as M,K as w,h as l,i as _,L as s,M as o,k as C}from"./index-CzBo9fwa.js";const h=async e=>{const{data:t,error:r}=await n.from(w.NAME).select(`fat, hc, id, kcal, prot, name: name->>${e}`);if(r)throw r;return t},T=()=>{const e=c();return d({queryKey:u({language:e}).data.meals,queryFn:async()=>{const{data:t,error:r}=await n.from(M.NAME).select(`
          id,
          order,
          name: name->>${e}
        `).order(M.COLS.ORDER);if(r)throw r;return t}})},D=()=>{const e=c();return d({queryKey:u({language:e}).data.allTypes,queryFn:async()=>await h(e)})},F=({carbs:e,protein:t,fat:r})=>{const a=e?e*4:0,i=t?t*4:0,E=r?r*9:0;return a+i+E},I=e=>`*,
        ${o.NAME}(
        preset_id,
        meal_id(
            id,
            name: name->>${e}
        ),
        type_id(
            *,
            name: name->>${e}
        ))`,q=e=>{C.setQueryData(u({userId:e.user_id}).user.presets,t=>{if(!t)return[e];const r=new Map(t.map(a=>[a.id,a]));return r.set(e.id,e),Array.from(r.values())})},g=(e,t)=>{C.setQueryData(u({userId:t}).user.presets,r=>r?r.filter(a=>a.id!==e):[])},N=()=>{const e=l(),t=c();return d({queryKey:u({userId:e}).user.presets,queryFn:async()=>{if(!e)throw new Error("User ID is required to fetch presets");const{data:r,error:a}=await n.from(s.NAME).select(I(t)).eq(s.COLS.USER_ID,e);if(a)throw a;return r}})},R=()=>{const e=l(),t=c();return _({mutationFn:async({name:r,comment:a,meals:i,training_hc:E=[]})=>{if(!e)throw new Error("User ID is required to insert preset");const{data:p,error:f}=await n.from(s.NAME).upsert({[s.COLS.USER_ID]:e,[s.COLS.NAME]:r,[s.COLS.COMMENT]:a,[s.COLS.TRAINING_HC]:E}).select().single();if(f)throw f;const m=p.id,{error:y}=await n.from(o.NAME).insert(i.map(S=>({[o.COLS.PRESET_ID]:m,[o.COLS.MEAL_ID]:S.meal_id,[o.COLS.TYPE_ID]:S.type_id})));if(y)throw y;const{data:A,error:L}=await n.from(s.NAME).select(I(t)).eq(s.COLS.ID,m).single();if(L)throw L;return A},onSuccess:r=>{r&&q(r)}})},K=()=>{const e=l();return _({mutationFn:async t=>{if(!e)throw new Error("User ID is required to delete preset");const{error:r}=await n.from(s.NAME).delete().eq(s.COLS.ID,t).eq(s.COLS.USER_ID,e);if(r)throw r;return t},onSuccess:t=>{e&&g(t,e)}})};export{N as a,D as b,F as c,R as d,K as e,T as u};
