import{u as l}from"./language-CHtiCFRG.js";import{g as y,l as d,r as m,e as q,q as _,s as u,h as U}from"./index-BPJUqyLn.js";import{u as w}from"./useMutation-6aMh_l85.js";import{u as R}from"./useInfiniteQuery-i50wfUol.js";import{M as S}from"./macros-DbGOqx7Z.js";import{m as $}from"./ingredients-CKpO2N2a.js";const f=20,F=`
    amount,
    unit_id,
    ingredient: catalog_ingredients(kcal, prot: protein, hc: carbs, fat, units: catalog_ingredient_units(unit_id, grams))
`,M=e=>`
    id,
    url,
    name: name->>${e},
    ingredients: catalog_recipe_ingredients(${F}),
    nutri_recipe: nutri_recipe_ratings(rating)
    `,E=e=>`
    id,
    url,
    name: name->>${e},
    description: description->>${e},
    ingredients: catalog_recipe_ingredients(
        amount,
        unit_id,
        ingredient_id,
        comment: comment->>${e},
        ingredient: catalog_ingredients(name: name->>${e}, kcal, prot: protein, hc: carbs, fat, units: catalog_ingredient_units(unit_id, grams))
    ),
    nutri_recipe: nutri_recipe_ratings(rating)
`,h=e=>S.sum(e.flatMap(({amount:i,unit_id:s,ingredient:n})=>n?[$(n,i,s)]:[])),T=({searchStr:e=""})=>{const i=l(),[s,n]=m.useState(e);return m.useEffect(()=>{const t=setTimeout(()=>n(e),500);return()=>clearTimeout(t)},[e]),y({queryKey:d({language:i,searchStr:s}).data.recipes([]),queryFn:async()=>{const{data:t,error:r}=await u.from("catalog_recipes").select(M(i)).ilike("name->>"+i,`%${s}%`);if(r)throw r;const a=t.filter(o=>o.id>0),g=await u.storage.from("recipe_images").createSignedUrls(a.map(o=>`receta_${o.id}.jpg`),3600);return a.map(({ingredients:o,...c},p)=>({...c,macros:h(o),url:g.data?g.data[p]?.signedUrl:c.url}))},placeholderData:[]})},j=({typeId:e,search:i="",enabled:s=!0})=>{const n=l(),t=U(r=>r.config.selectedUserId);return R({queryKey:d({language:n,userId:t,searchStr:i}).data.topRecipesForUser(e),queryFn:async({pageParam:r})=>{const{data:a,error:g}=await u.rpc("scored_search_recipes_for_type",{p_client_id:t,p_type_id:e,p_lang:n,p_search:i||void 0,p_page_size:f,p_after_score:r?.score,p_after_id:r?.id});if(g)throw g;if(!a.length)return a.map(c=>({...c,url:null}));const o=await u.storage.from("recipe_images").createSignedUrls(a.map(c=>`receta_${c.id}.jpg`),3600);return a.map((c,p)=>({...c,url:o.data?.[p]?.signedUrl??null}))},initialPageParam:null,getNextPageParam:r=>{const a=r.at(-1);if(!(!a||r.length<f))return{score:a.score,id:a.id}},enabled:s&&!!t&&e!==void 0})},k=({recipeId:e})=>{const i=l();return y({queryKey:d({language:i}).data.singleRecipe(e),queryFn:async()=>{const{data:s,error:n}=await u.from("catalog_recipes").select(E(i)).eq("id",e).single();if(n)throw n;const t=await u.storage.from("recipe_images").createSignedUrl(`receta_${e}.jpg`,3600);return t.error&&console.error("Error fetching signed URL:",t.error),{...s,macros:h(s.ingredients),url:t.data?t.data?.signedUrl:null}},enabled:!!e})},x=({recipeId:e})=>{const i=l(),{data:s}=q(),n=s?.userId??"";return w({mutationKey:d({language:i}).data.singleRecipe(e),mutationFn:async t=>{const{data:r,error:a}=await u.from("nutri_recipe_ratings").update({rating:t}).eq("recipe_id",e).eq("nutri_id",n).select("*");if(a)throw a;if(r.length)return r[0];const{data:g,error:o}=await u.from("nutri_recipe_ratings").insert({recipe_id:e,rating:t}).select("*").single();if(o)throw o;return g},onMutate:t=>{_.setQueryData(d({language:i}).data.singleRecipe(e),r=>r&&{...r,nutri_recipe:[{rating:t}]}),_.setQueriesData({queryKey:d({language:i}).data.recipesBase},r=>r&&r.map(a=>a.id===e?{...a,nutri_recipe:[{rating:t}]}:a))},onSettled:()=>{_.invalidateQueries({queryKey:d().data.topRecipesBase})}})};export{k as a,j as b,x as c,T as u};
