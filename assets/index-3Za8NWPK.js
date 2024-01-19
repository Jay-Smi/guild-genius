import{al as L,av as h,aw as _,ax as $,ay as C,az as p,r as b,j as i}from"./index-pLlpl9gL.js";async function q(){const{data:r,error:e}=await L.from("categories").select("*");if(e)throw console.error(e),new Error("Categories could not be loaded.");return r}async function A(){const{data:r,error:e}=await L.from("categories").select(`
    id,
    categories_characters (
      character_id
    )
  `);if(e)throw console.error(e),new Error("Category Characters could not be loaded.");return r}function N(){const{data:r,isLoading:e,error:a}=h({queryKey:["categories_characters"],queryFn:A,staleTime:1/0,select:d=>d.map(o=>({categoryId:o.id,categoryCharacters:o.categories_characters.map(n=>n.character_id)}))}),{data:s,isLoading:t,error:l}=h({queryKey:["categories"],queryFn:q,staleTime:1/0,enabled:!e,select:d=>d.map(n=>{const g=r.find(x=>x.categoryId===n.id);return{...n,data:g.categoryCharacters}})});return{categories:s,isLoading:t||e,error:l||a}}async function S(){const{data:r,error:e}=await L.from("groups").select("*");if(e)throw console.error(e),new Error("Groups could not be loaded.");return r}async function H(){const{data:r,error:e}=await L.from("groups").select(`
    id,
    groups_characters (
      character_id
    )
  `);if(e)throw console.error(e),new Error("Groups Characters could not be loaded.");return r}function B(){const{data:r,isLoading:e,error:a}=h({queryKey:["groups_characters"],queryFn:H,staleTime:1/0,select:d=>d.map(o=>({id:o.id,groupCharacters:o.groups_characters.map(n=>n.character_id)}))}),{data:s,isLoading:t,error:l}=h({queryKey:["groups"],queryFn:S,staleTime:1/0,enabled:!e,select:d=>d.map(o=>{const n=r.find(g=>g.id===o.id);return{...o,data:n.groupCharacters}})});return{groups:s,isLoading:t||e,error:l||a}}function K(){const{data:r,error:e,isLoading:a}=h({queryKey:["raids_groups"],queryFn:O,staleTime:1/0,select:d=>d.map(o=>({id:o.id,raidGroups:o.raids_groups.map(n=>n.group_id)}))}),{data:s,error:t,isLoading:l}=h({queryKey:["raids"],queryFn:F,staleTime:1/0,enabled:!a,select:d=>d.map(o=>{const n=r.find(g=>g.id===o.id);return{...o,data:n.raidGroups}})});return{raids:s,isLoading:l||a,error:t||e}}async function F(){const{data:r,error:e}=await supabase.from("raids").select("*");if(e)throw console.error(e),new Error("Raids could not be loaded.");return r}async function O(){const{data:r,error:e}=await supabase.from("raids").select(`
    id,
    raids_groups (
      group_id
    )
  `);if(e)throw console.error(e),new Error("Raids Groups could not be loaded.");return r}function T(){const{categories:r,isLoading:e,error:a}=N(),{characters:s,isLoading:t,error:l}=_(),{raids:d,isLoading:o,error:n}=K(),{groups:g,isLoading:x,error:f}=B(),{players:c,isLoading:v,error:u}=$();return{categories:r,characters:s,raids:d,groups:g,players:c,isLoading:e||t||o||x||v,error:a||l||n||f||u}}C.Down,C.Right,C.Up,C.Left;function m(...r){const e=[];return r.forEach(a=>{if(typeof a=="string"||typeof a=="number"||typeof a=="boolean")e.push(String(a));else if(a&&typeof a=="object")for(const s in a)a[s]&&e.push(s);else if(Array.isArray(a)){const s=m(...a);s&&e.push(s)}}),e.join(" ")}const D=p.button`
    display: flex;
    width: 12px;
    padding: 15px;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    touch-action: none;

    border-radius: 5px;
    border: none;
    outline: none;
    appearance: none;
    background-color: transparent;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background-color: var(--action-background, rgba(0, 0, 0, 0.05));

        svg {
            fill: #6f7b88;
        }
    }

    & svg {
        flex: 0 0 auto;
        margin: auto;
        height: 100%;
        overflow: visible;
        fill: #919eab;
    }

    &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0),
            0 0px 0px 2px var(--focused-outline-color);
    }

    &:active svg {
        background-color: var(--background, rgba(0, 0, 0, 0.05));
    }

    &.handle {
        cursor: grab;
    }
    &.handle:active {
        cursor: grabbing;
    }
`,j=b.forwardRef(({active:r,className:e,cursor:a,style:s,...t},l)=>i.jsx(D,{ref:l,...t,className:m(e,t.overlay==="overlay"?"overlay":"",t.type==="handle"?"handle":""),tabIndex:0,style:{...s}}));j.displayName="Button";const k=b.forwardRef((r,e)=>i.jsx(j,{ref:e,cursor:"grab","data-cypress":"draggable-handle",...r,type:"handle",children:i.jsx("svg",{viewBox:"0 0 20 20",width:"14",children:i.jsx("path",{d:"M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"})})}));k.displayName="Handle";function R(r){return i.jsx(j,{...r,active:{fill:"rgba(255, 70, 70, 0.95)",background:"rgba(255, 70, 70, 0.1)"},children:i.jsx("svg",{width:"8",viewBox:"0 0 22 22",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z"})})})}p.div`
    display: flex;
    flex-direction: column;
    grid-auto-rows: max-content;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${r=>r.isopen?"100px":0};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

    & ul {
        display: grid;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;const M=p.div`
    display: flex;
    flex-direction: column;

    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: var(--border-radius-sm);
    min-height: ${r=>r.isopen?"100px":0};

    background-color: var(--color-grey-50);

    font-size: 1em;

    & > .containerHeader {
        display: flex;
        padding: 5px 20px;
        padding-right: 8px;
        justify-content: space-between;
        align-items: center;
        background-color: ${r=>r.open?"var(--color-grey-50)":"var(--color-grey-200)"};
        border-top-left-radius: var(--border-radius-sm);
        border-top-right-radius: var(--border-radius-sm);
        & > .handle {
            visibility: hidden;
        }

        & > .buttons {
            visibility: hidden;
        }
    }

    & ul {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        list-style: none;
        gap: 10px 20px;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }

    &:hover {
        background-color: var(--color-grey-200);
    }

    &:hover > .containerHeader {
        background-color: var(--color-grey-100);
    }

    &:hover .handle {
        visibility: visible;
    }

    &:hover .buttons {
        visibility: visible;
    }

    &::after {
        content: "";
        margin: 10px 0;

        height: 2px;
        width: 100%;
        background-color: var(--color-grey-200);
    }
`,P=p.div`
    display: flex;
    flex-direction: column;

    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${r=>r.isopen?"100px":0};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 10px;

        align-items: center;
        background-color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    & .headerInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
    }

    & ul {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`,X=p.div`
    display: flex;
    flex-direction: column;
    grid-auto-rows: max-content;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${r=>r.isopen?"100px":0};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        padding-right: 8px;
        align-items: center;
        background-color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    & .headerInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
    }

    & ul {
        display: grid;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;p.div`
    display: flex;
    padding: 5px 20px;
    padding-right: 8px;
    align-items: center;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;const Y=p.div`
    cursor: grabbing;
`,Q=p.div`
    max-width: 200px;
    text-wrap: nowrap;
    overflow: hidden;
`,U=p.div`
    display: flex;
`,W=b.forwardRef(({children:r,handleProps:e,onClick:a,onRemove:s,label:t,style:l,shadow:d,type:o,overlay:n,...g},x)=>{const f=a?"button":"div",[c,v]=b.useState(!0),u=o==="raid"?M:o==="group"?P:X;function y(){v(w=>!w)}return i.jsxs(u,{...g,ref:x,style:l,className:m(d),onClick:a,tabIndex:a?0:void 0,as:f,open:c,type:o,children:[t?i.jsxs("div",{className:"containerHeader",children:[i.jsx(Y,{className:`handle ${n?"":"overlay"}`,children:i.jsx(k,{...e,overlay:n})}),i.jsx(Q,{children:t}),i.jsx(U,{className:"buttons",children:s?i.jsx(R,{onClick:y}):void 0})]}):null,c&&i.jsx("ul",{children:r})]})});W.displayName="Container";const Z=p.div`
    display: flex;
    box-sizing: border-box;
    transform: translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
        scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1));
    transform-origin: 0 0;
    touch-action: manipulation;

    &.fadeIn {
        animation: fadeIn 500ms ease;
    }
    &.dragOverlay {
        --scale: 1.05;
        --box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
        --box-shadow-picked-up: 0 0 0 calc(1px / var(--scale-x, 1))
                rgba(63, 63, 68, 0.05),
            -1px 0 15px 0 rgba(34, 33, 81, 0.01),
            0px 15px 15px 0 rgba(34, 33, 81, 0.25);
        z-index: 999;
    }
`,J=p.div`
    position: relative;
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding: 8px 10px;
    background-color: #fff;
    box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
        0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    outline: none;
    border-radius: calc(4px / var(--scale-x, 1));
    box-sizing: border-box;
    list-style: none;
    transform-origin: 50% 50%;

    -webkit-tap-highlight-color: transparent;

    color: #333;
    font-weight: 400;
    font-size: 1rem;
    white-space: nowrap;

    transform: scale(var(--scale, 1));
    transition: box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);

    &.activeplayer {
        background-color: green;
    }

    &:focus-visible {
        box-shadow: 0 0px 4px 1px #4c9ffe,
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }
    &.dragging:not(.dragOverlay) {
        opacity: var(--dragging-opacity, 0.5);
        z-index: 0;
    }

    &.dragging:not(.dragOverlay):focus {
        box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }

    &.disabled {
        color: #999;
        background-color: #f1f1f1;
        cursor: not-allowed;
    }
    &.disabled:focus {
        box-shadow: 0 0px 4px 1px rgba(0, 0, 0, 0.1),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }
    &.dragOverlay {
        cursor: inherit;
        /* box-shadow: 0 0px 6px 2px $focused-outline-color; */
        animation: pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);
        transform: scale(var(--scale));
        box-shadow: var(--box-shadow-picked-up);
        opacity: 1;
    }
    &:hover.Remove {
        visibility: visible;
    }
`;p.div`
    visibility: hidden;
`;const V=p.div`
    display: flex;
    margin-top: -12px;
    margin-bottom: -15px;
    margin-left: -12px;
`,rr=p.div`
    display: flex;
    margin-top: -12px;
    margin-left: auto;
    margin-bottom: -15px;
    margin-right: -10px;
`;b.memo(b.forwardRef(({dragOverlay:r,dragging:e,disabled:a,fadeIn:s,handleProps:t,height:l,listeners:d,onRemove:o,renderItem:n,sorting:g,style:x,transition:f,transform:c,value:v,wrapperStyle:u,character:y,activeCharacter:w,player:er,activePlayer:z,...E},I)=>{w&&(w.id,y.id);const G=z?z.name===y.player:"";return b.useEffect(()=>{if(r)return document.body.style.cursor="grabbing",()=>{document.body.style.cursor=""}},[r]),i.jsx(Z,{className:m(s&&"fadeIn",g&&"sorting",r&&"dragOverlay"),style:{...u,transition:[f,u==null?void 0:u.transition].filter(Boolean).join(", "),"--translate-x":c?`${Math.round(c.x)}px`:void 0,"--translate-y":c?`${Math.round(c.y)}px`:void 0,"--scale-x":c!=null&&c.scaleX?`${c.scaleX}`:void 0,"--scale-y":c!=null&&c.scaleY?`${c.scaleY}`:void 0,boxShadow:G?"0 0 0 1px green":""},ref:I,children:i.jsxs(J,{className:m(e&&"dragging",r&&"dragOverlay",a&&"disabled"),style:x,...E,children:[i.jsx(V,{children:i.jsx(k,{...t,...d})}),y.character_name,i.jsx(rr,{children:o?i.jsx(R,{onClick:o}):null})]})})}));function or(){const{categories:r,characters:e,raids:a,groups:s,players:t,isLoading:l}=T();if(l)return i.jsx("div",{children:"Loading..."})}export{or as default};
