import{h as i,r as m,g as c,l,s as u}from"./index-DE8-d4V2.js";import{u as p}from"./language-ChPdeT0-.js";const g=async e=>{const{data:r,error:a}=await u.from("recipe_type").select(`fat, hc, id, kcal, prot, name: name->>${e}, comment: comment->>${e}`);if(a)throw a;return r},f=async e=>{const{data:r,error:a}=await u.from("all_meals").select(`
      id,
      order,
      name: name->>${e}
    `).order("order");if(a)throw a;return r},w=({onlyVisible:e=!0}={})=>{const r=p(),a=i(t=>t.config.showMealsInTable),y=m.useCallback(t=>{const o=new Map(a),n=s=>o.get(s.id)?.order??s.order??0;return t.filter(s=>!e||(o.get(s.id)?.isVisible??!0)).sort((s,d)=>n(s)-n(d))},[a,e]);return c({queryKey:l({language:r}).data.meals,queryFn:()=>f(r),select:y})},q=()=>{const e=p();return c({queryKey:l({language:e}).data.allTypes,queryFn:async()=>await g(e)})};export{w as a,q as u};
