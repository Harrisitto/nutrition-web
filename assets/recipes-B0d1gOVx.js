import{u as d}from"./language-DCMnGSy5.js";import{g as y,l as c,e as q,q as m,s as l,r as _,h as U}from"./index-9QBukF6R.js";import{a as R}from"./mutate-DQ5u7H_a.js";import{u as $}from"./useInfiniteQuery-Bw7AUHC_.js";const f=20,w=e=>`
    id,
    url,
    name: name->>${e},
    type_id!inner(
        id,
        kcal,
        prot,
        fat,
        hc,
        name: name->>${e}
    ),
    nutri_recipe(*)
    `,S=e=>`
    id,
    url,
    name: name->>${e},
    description: description->>${e},
    type_id!inner(
        id,
        kcal,
        prot,
        fat,
        hc,
        name: name->>${e}
    ),
    all_ingredients!inner(
        id,
        recipe_id,
        url,
        name: name->>${e},
        amount: amount->>${e},
        comment: comment->>${e}
    ),
    nutri_recipe(*)
`,P=({searchStr:e="",typeIds:n=[]})=>{const s=d(),[i,a]=_.useState(e);return _.useEffect(()=>{const r=setTimeout(()=>a(e),500);return()=>clearTimeout(r)},[e]),y({queryKey:c({language:s,searchStr:i}).data.recipes(n),queryFn:async()=>{let r=l.from("all_recipes").select(w(s)).ilike("name->>"+s,`%${i}%`);n.length>0&&(r=r.in("type_id",n));const{data:t,error:p}=await r;if(p)throw p;const g=t?.map(u=>u.id)||[],o=await l.storage.from("recipe_images").createSignedUrls(g.map(u=>`receta_${u}.jpg`),3600);return t?.map((u,h)=>({...u,url:o.data?o.data[h]?.signedUrl:u.url}))||[]},placeholderData:[]})},Q=({typeId:e,search:n="",enabled:s=!0})=>{const i=d(),a=U(r=>r.config.selectedUserId);return $({queryKey:c({language:i,userId:a,searchStr:n}).data.topRecipesForUser(e),queryFn:async({pageParam:r})=>{const{data:t,error:p}=await l.rpc("get_top_recipes_for_type",{p_user_id:a,p_type_id:e,p_lang:i,p_search:n||void 0,p_page_size:f,p_after_score:r?.score,p_after_id:r?.id});if(p)throw p;if(!t.length)return t.map(o=>({...o,url:null}));const g=await l.storage.from("recipe_images").createSignedUrls(t.map(o=>`receta_${o.id}.jpg`),3600);return t.map((o,u)=>({...o,url:g.data?.[u]?.signedUrl??null}))},initialPageParam:null,getNextPageParam:r=>{const t=r.at(-1);if(!(!t||r.length<f))return{score:t.score,id:t.id}},enabled:s&&!!a&&e!==void 0})},b=({recipeId:e})=>{const n=d();return y({queryKey:c({language:n}).data.singleRecipe(e),queryFn:async()=>{const{data:s,error:i}=await l.from("all_recipes").select(S(n)).eq("id",e).single();if(i)throw i;const a=await l.storage.from("recipe_images").createSignedUrl(`receta_${e}.jpg`,3600);return a.error&&console.error("Error fetching signed URL:",a.error),{...s,url:a.data?a.data?.signedUrl:null}},enabled:!!e})},v=({recipeId:e})=>{const n=d(),{data:s}=q(),i=s?.userId??"";return R({mutationKey:c({language:n}).data.singleRecipe(e),mutationFn:async a=>{console.log("Updating rating to:",a);const{data:r,error:t}=await l.from("nutri_recipe").upsert({recipe_id:e,nutri_id:i,rating:a}).eq("recipe_id",e).eq("nutri_id",i).select("*").single();if(t)throw t;return r||null},onMutate:a=>{m.setQueryData(c({language:n}).data.singleRecipe(e),r=>r&&{...r,nutri_recipe:[{...r.nutri_recipe,rating:a}]}),m.setQueriesData({queryKey:c({language:n}).data.recipesBase},r=>r&&r.map(t=>t.id===e?{...t,nutri_recipe:[{...t.nutri_recipe,rating:a}]}:t))},onSettled:()=>{m.invalidateQueries({queryKey:c().data.topRecipesBase})}})};export{P as a,b,v as c,Q as u};
