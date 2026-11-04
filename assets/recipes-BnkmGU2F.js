import{u as p}from"./language-C8ABqAO8.js";import{Y as v,Z as _,$ as w,a0 as b,a1 as q,g as R,l as d,e as F,q as f,s as g,r as P,h as U}from"./index-DNcR1TF0.js";import{a as x}from"./mutate-fPnJv6Xt.js";var $=class extends v{constructor(e,s){super(e,s)}bindMethods(){super.bindMethods(),this.fetchNextPage=this.fetchNextPage.bind(this),this.fetchPreviousPage=this.fetchPreviousPage.bind(this)}setOptions(e){super.setOptions({...e,behavior:_()})}getOptimisticResult(e){return e.behavior=_(),super.getOptimisticResult(e)}fetchNextPage(e){return this.fetch({...e,meta:{fetchMore:{direction:"forward"}}})}fetchPreviousPage(e){return this.fetch({...e,meta:{fetchMore:{direction:"backward"}}})}createResult(e,s){const{state:n}=e,i=super.createResult(e,s),{isFetching:r,isRefetching:t,isError:a,isRefetchError:l}=i,c=n.fetchMeta?.fetchMore?.direction,u=a&&c==="forward",o=r&&c==="forward",h=a&&c==="backward",m=r&&c==="backward";return{...i,fetchNextPage:this.fetchNextPage,fetchPreviousPage:this.fetchPreviousPage,hasNextPage:b(s,n.data),hasPreviousPage:w(s,n.data),isFetchNextPageError:u,isFetchingNextPage:o,isFetchPreviousPageError:h,isFetchingPreviousPage:m,isRefetchError:l&&!u&&!h,isRefetching:t&&!o&&!m}}};function E(e,s){return q(e,$)}const y=20,N=e=>`
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
`,O=({searchStr:e="",typeIds:s=[]})=>{const n=p(),[i,r]=P.useState(e);return P.useEffect(()=>{const t=setTimeout(()=>r(e),500);return()=>clearTimeout(t)},[e]),R({queryKey:d({language:n,searchStr:i}).data.recipes(s),queryFn:async()=>{let t=g.from("all_recipes").select(N(n)).ilike("name->>"+n,`%${i}%`);s.length>0&&(t=t.in("type_id",s));const{data:a,error:l}=await t;if(l)throw l;const c=a?.map(o=>o.id)||[],u=await g.storage.from("recipe_images").createSignedUrls(c.map(o=>`receta_${o}.jpg`),3600);return a?.map((o,h)=>({...o,url:u.data?u.data[h]?.signedUrl:o.url}))||[]},placeholderData:[]})},k=({typeId:e,search:s=""})=>{const n=p(),i=U(r=>r.config.selectedUserId);return E({queryKey:d({language:n,userId:i,searchStr:s}).data.topRecipesForUser(e),queryFn:async({pageParam:r})=>{const{data:t,error:a}=await g.rpc("get_top_recipes_for_type",{p_user_id:i,p_type_id:e,p_lang:n,p_search:s||void 0,p_page_size:y,p_after_score:r?.score,p_after_id:r?.id});if(a)throw a;if(!t.length)return[];const l=await g.storage.from("recipe_images").createSignedUrls(t.map(c=>`receta_${c.id}.jpg`),3600);return t.map((c,u)=>({...c,url:l.data?.[u]?.signedUrl??null}))},initialPageParam:null,getNextPageParam:r=>{const t=r.at(-1);if(!(!t||r.length<y))return{score:t.score,id:t.id}},enabled:!!i&&e!==void 0})},B=({recipeId:e})=>{const s=p();return R({queryKey:d({language:s}).data.singleRecipe(e),queryFn:async()=>{const{data:n,error:i}=await g.from("all_recipes").select(S(s)).eq("id",e).single();if(i)throw i;const r=await g.storage.from("recipe_images").createSignedUrl(`receta_${e}.jpg`,3600);return r.error&&console.error("Error fetching signed URL:",r.error),{...n,url:r.data?r.data?.signedUrl:null}},enabled:!!e})},T=({recipeId:e})=>{const s=p(),{data:n}=F(),i=n?.userId??"";return x({mutationKey:d({language:s}).data.singleRecipe(e),mutationFn:async r=>{console.log("Updating rating to:",r);const{data:t,error:a}=await g.from("nutri_recipe").upsert({recipe_id:e,nutri_id:i,rating:r}).eq("recipe_id",e).eq("nutri_id",i).select("*").single();if(a)throw a;return t||null},onMutate:r=>{f.setQueryData(d({language:s}).data.singleRecipe(e),t=>t&&{...t,nutri_recipe:[{...t.nutri_recipe,rating:r}]}),f.setQueriesData({queryKey:d({language:s}).data.recipesBase},t=>t&&t.map(a=>a.id===e?{...a,nutri_recipe:[{...a.nutri_recipe,rating:r}]}:a))},onSettled:()=>{f.invalidateQueries({queryKey:d().data.topRecipesBase})}})};export{B as a,T as b,k as c,O as u};
