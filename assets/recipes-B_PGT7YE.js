import{u as d}from"./language-Jgaw5uzx.js";import{g as y,l as c,e as q,q as m,s as l,r as _,h as U}from"./index-GgsMNw2T.js";import{a as R}from"./mutate-e1TsZE9D.js";import{u as $}from"./useInfiniteQuery-DSGLokjt.js";const f=20,w=e=>`
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
`,P=({searchStr:e="",typeIds:n=[]})=>{const i=d(),[s,a]=_.useState(e);return _.useEffect(()=>{const r=setTimeout(()=>a(e),500);return()=>clearTimeout(r)},[e]),y({queryKey:c({language:i,searchStr:s}).data.recipes(n),queryFn:async()=>{let r=l.from("all_recipes").select(w(i)).ilike("name->>"+i,`%${s}%`);n.length>0&&(r=r.in("type_id",n));const{data:t,error:p}=await r;if(p)throw p;const g=t?.map(u=>u.id)||[],o=await l.storage.from("recipe_images").createSignedUrls(g.map(u=>`receta_${u}.jpg`),3600);return t?.map((u,h)=>({...u,url:o.data?o.data[h]?.signedUrl:u.url}))||[]},placeholderData:[]})},Q=({typeId:e,search:n="",isCustom:i=!1})=>{const s=d(),a=U(r=>r.config.selectedUserId);return $({queryKey:c({language:s,userId:a,searchStr:n}).data.topRecipesForUser(e,i),queryFn:async({pageParam:r})=>{const{data:t,error:p}=await l.rpc("get_top_recipes_for_type",{p_user_id:a,p_type_id:e,p_lang:s,p_search:n||void 0,p_page_size:f,p_after_score:r?.score,p_after_id:r?.id,p_is_custom:i});if(p)throw p;if(!t.length||i)return t.map(o=>({...o,url:null}));const g=await l.storage.from("recipe_images").createSignedUrls(t.map(o=>`receta_${o.id}.jpg`),3600);return t.map((o,u)=>({...o,url:g.data?.[u]?.signedUrl??null}))},initialPageParam:null,getNextPageParam:r=>{const t=r.at(-1);if(!(!t||r.length<f))return{score:t.score,id:t.id}},enabled:!!a&&e!==void 0})},b=({recipeId:e})=>{const n=d();return y({queryKey:c({language:n}).data.singleRecipe(e),queryFn:async()=>{const{data:i,error:s}=await l.from("all_recipes").select(S(n)).eq("id",e).single();if(s)throw s;const a=await l.storage.from("recipe_images").createSignedUrl(`receta_${e}.jpg`,3600);return a.error&&console.error("Error fetching signed URL:",a.error),{...i,url:a.data?a.data?.signedUrl:null}},enabled:!!e})},v=({recipeId:e})=>{const n=d(),{data:i}=q(),s=i?.userId??"";return R({mutationKey:c({language:n}).data.singleRecipe(e),mutationFn:async a=>{console.log("Updating rating to:",a);const{data:r,error:t}=await l.from("nutri_recipe").upsert({recipe_id:e,nutri_id:s,rating:a}).eq("recipe_id",e).eq("nutri_id",s).select("*").single();if(t)throw t;return r||null},onMutate:a=>{m.setQueryData(c({language:n}).data.singleRecipe(e),r=>r&&{...r,nutri_recipe:[{...r.nutri_recipe,rating:a}]}),m.setQueriesData({queryKey:c({language:n}).data.recipesBase},r=>r&&r.map(t=>t.id===e?{...t,nutri_recipe:[{...t.nutri_recipe,rating:a}]}:t))},onSettled:()=>{m.invalidateQueries({queryKey:c().data.topRecipesBase})}})};export{P as a,b,v as c,Q as u};
