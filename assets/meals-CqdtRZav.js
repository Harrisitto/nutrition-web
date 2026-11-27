import{h as d,r as m,g as c,l,s as u}from"./index-D9Pu4tPp.js";import{u as i}from"./language-C2I3Fk56.js";const g=async e=>{const{data:t,error:a}=await u.from("recipe_type").select(`fat, hc, id, kcal, prot, name: name->>${e}, comment: comment->>${e}`);if(a)throw a;return t},f=async e=>{const{data:t,error:a}=await u.from("catalog_meals").select(`
      id,
      position,
      name: name->>${e}
    `).order("position");if(a)throw a;return t},w=({onlyVisible:e=!0}={})=>{const t=i(),a=d(r=>r.config.showMealsInTable),p=m.useCallback(r=>{const o=new Map(a),n=s=>o.get(s.id)?.order??s.position??0;return r.filter(s=>!e||(o.get(s.id)?.isVisible??!0)).sort((s,y)=>n(s)-n(y))},[a,e]);return c({queryKey:l({language:t}).data.meals,queryFn:()=>f(t),select:p})},q=()=>{const e=i();return c({queryKey:l({language:e}).data.allTypes,queryFn:async()=>await g(e)})};export{w as a,q as u};
