import{d as y,h as i,g as h,l as u,s as a,U as t,V as n,q as I}from"./index-q67ZwtTv.js";import{a as S}from"./mutate-D29b3NhX.js";import{u as l}from"./language-DOizKvUB.js";const A=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],N=y("chevron-down",A),p=e=>`*,
        ${n.NAME}(
        preset_id,
        meal_id(
            id,
            name: name->>${e}
        ),
        type_id(
            *,
            name: name->>${e}
        ))`,M=e=>{I.setQueryData(u({userId:e.user_id}).user.presets,s=>{if(!s)return[e];const r=new Map(s.map(o=>[o.id,o]));return r.set(e.id,e),Array.from(r.values())})},q=(e,s)=>{I.setQueryData(u({userId:s}).user.presets,r=>r?r.filter(o=>o.id!==e):[])},g=()=>{const e=i(r=>r.config.selectedUserId),s=l();return h({queryKey:u({userId:e}).user.presets,queryFn:async()=>{if(!e)throw new Error("User ID is required to fetch presets");const{data:r,error:o}=await a.from(t.NAME).select(p(s)).eq(t.COLS.USER_ID,e);if(o)throw o;return r}})},R=()=>{const e=i(r=>r.config.selectedUserId),s=l();return S({mutationFn:async({name:r,comment:o,meals:_,training_hc:L=[]})=>{if(!e)throw new Error("User ID is required to insert preset");const{data:C,error:c}=await a.from(t.NAME).upsert({[t.COLS.USER_ID]:e,[t.COLS.NAME]:r,[t.COLS.COMMENT]:o,[t.COLS.TRAINING_HC]:L}).select().single();if(c)throw c;const d=C.id,{error:E}=await a.from(n.NAME).insert(_.map(m=>({[n.COLS.PRESET_ID]:d,[n.COLS.MEAL_ID]:m.meal_id,[n.COLS.TYPE_ID]:m.type_id})));if(E)throw E;const{data:w,error:f}=await a.from(t.NAME).select(p(s)).eq(t.COLS.ID,d).single();if(f)throw f;return w},onSuccess:r=>{r&&M(r)}})},T=()=>{const e=i(s=>s.config.selectedUserId);return S({mutationFn:async s=>{if(!e)throw new Error("User ID is required to delete preset");const{error:r}=await a.from(t.NAME).delete().eq(t.COLS.ID,s).eq(t.COLS.USER_ID,e);if(r)throw r;return s},onSuccess:s=>{e&&q(s,e)}})};export{N as C,g as a,T as b,R as u};
