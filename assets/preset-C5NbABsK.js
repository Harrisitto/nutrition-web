import{f as c,D as I,E as M,F as L,G as a,T as t,H as n,y as _,z as E}from"./index-C-5CwLRV.js";const O=({carbs:e,protein:s,fat:r})=>{const o=e?e*4:0,u=s?s*4:0,i=r?r*9:0;return o+u+i},C=e=>`*,
        ${n.NAME}(
        preset_id,
        meal_id(
            id,
            name: name->>${e}
        ),
        type_id(
            *,
            name: name->>${e}
        ))`,w=e=>{_.setQueryData(E({userId:e.user_id}).user.presets,s=>{if(!s)return[e];const r=new Map(s.map(o=>[o.id,o]));return r.set(e.id,e),Array.from(r.values())})},A=(e,s)=>{_.setQueryData(E({userId:s}).user.presets,r=>r?r.filter(o=>o.id!==e):[])},h=()=>{const e=c(),s=I();return M({queryKey:E({userId:e}).user.presets,queryFn:async()=>{if(!e)throw new Error("User ID is required to fetch presets");const{data:r,error:o}=await a.from(t.NAME).select(C(s)).eq(t.COLS.USER_ID,e);if(o)throw o;return r}})},q=()=>{const e=c(),s=I();return L({mutationFn:async({name:r,comment:o,meals:u,training_hc:i=[]})=>{if(!e)throw new Error("User ID is required to insert preset");const{data:p,error:d}=await a.from(t.NAME).upsert({[t.COLS.USER_ID]:e,[t.COLS.NAME]:r,[t.COLS.COMMENT]:o,[t.COLS.TRAINING_HC]:i}).select().single();if(d)throw d;const f=p.id,{error:l}=await a.from(n.NAME).insert(u.map(S=>({[n.COLS.PRESET_ID]:f,[n.COLS.MEAL_ID]:S.meal_id,[n.COLS.TYPE_ID]:S.type_id})));if(l)throw l;const{data:y,error:m}=await a.from(t.NAME).select(C(s)).eq(t.COLS.ID,f).single();if(m)throw m;return y},onSuccess:r=>{r&&w(r)}})},N=()=>{const e=c();return L({mutationFn:async s=>{if(!e)throw new Error("User ID is required to delete preset");const{error:r}=await a.from(t.NAME).delete().eq(t.COLS.ID,s).eq(t.COLS.USER_ID,e);if(r)throw r;return s},onSuccess:s=>{e&&A(s,e)}})};export{q as a,N as b,O as c,h as u};
