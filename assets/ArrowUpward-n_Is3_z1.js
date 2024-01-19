import{g as S,a as U,aG as k,s as H,_ as d,n as A,aH as v,r as V,u as E,b as q,j as a,e as I,f as P,H as X,a5 as z,K as n}from"./index-8peLLp4J.js";import{r as j,i as _}from"./createSvgIcon-8s11LM0g.js";function B(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function D(t){return parseFloat(t)}function F(t){return S("MuiSkeleton",t)}U("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const K=["animation","className","component","height","style","variant","width"];let h=t=>t,C,x,w,b;const L=t=>{const{classes:e,variant:r,animation:i,hasChildren:s,width:u,height:o}=t;return P({root:["root",r,i,s&&"withChildren",s&&!u&&"fitContent",s&&!o&&"heightAuto"]},F,e)},N=k(C||(C=h`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),O=k(x||(x=h`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),G=H("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:r}=t;return[e.root,e[r.variant],r.animation!==!1&&e[r.animation],r.hasChildren&&e.withChildren,r.hasChildren&&!r.width&&e.fitContent,r.hasChildren&&!r.height&&e.heightAuto]}})(({theme:t,ownerState:e})=>{const r=B(t.shape.borderRadius)||"px",i=D(t.shape.borderRadius);return d({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:A(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em"},e.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${r}/${Math.round(i/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},e.variant==="circular"&&{borderRadius:"50%"},e.variant==="rounded"&&{borderRadius:(t.vars||t).shape.borderRadius},e.hasChildren&&{"& > *":{visibility:"hidden"}},e.hasChildren&&!e.width&&{maxWidth:"fit-content"},e.hasChildren&&!e.height&&{height:"auto"})},({ownerState:t})=>t.animation==="pulse"&&v(w||(w=h`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),N),({ownerState:t,theme:e})=>t.animation==="wave"&&v(b||(b=h`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),O,(e.vars||e).palette.action.hover)),T=V.forwardRef(function(e,r){const i=E({props:e,name:"MuiSkeleton"}),{animation:s="pulse",className:u,component:o="span",height:g,style:y,variant:R="text",width:M}=i,m=q(i,K),f=d({},i,{animation:s,component:o,variant:R,hasChildren:!!m.children}),$=L(f);return a.jsx(G,d({as:o,ref:r,className:I($.root,u),ownerState:f},m,{style:d({width:M,height:g},y)}))}),l=T,nt=()=>a.jsx(X,{children:a.jsx(z,{children:a.jsxs(n,{container:!0,direction:"column",children:[a.jsx(n,{item:!0,children:a.jsxs(n,{container:!0,justifyContent:"space-between",children:[a.jsx(n,{item:!0,children:a.jsx(l,{variant:"rectangular",width:44,height:44})}),a.jsx(n,{item:!0,children:a.jsx(l,{variant:"rectangular",width:34,height:34})})]})}),a.jsx(n,{item:!0,children:a.jsx(l,{variant:"rectangular",sx:{my:2},height:40})}),a.jsx(n,{item:!0,children:a.jsx(l,{variant:"rectangular",height:30})})]})})}),st="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M19%209H9C7.89543%209%207%209.89543%207%2011V17C7%2018.1046%207.89543%2019%209%2019H19C20.1046%2019%2021%2018.1046%2021%2017V11C21%209.89543%2020.1046%209%2019%209Z'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M14%2016C15.1046%2016%2016%2015.1046%2016%2014C16%2012.8954%2015.1046%2012%2014%2012C12.8954%2012%2012%2012.8954%2012%2014C12%2015.1046%2012.8954%2016%2014%2016Z'%20fill='%2390CAF9'/%3e%3cpath%20d='M17%209V7C17%206.46957%2016.7893%205.96086%2016.4142%205.58579C16.0391%205.21071%2015.5304%205%2015%205H5C4.46957%205%203.96086%205.21071%203.58579%205.58579C3.21071%205.96086%203%206.46957%203%207V13C3%2013.5304%203.21071%2014.0391%203.58579%2014.4142C3.96086%2014.7893%204.46957%2015%205%2015H7'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e";var c={},W=_;Object.defineProperty(c,"__esModule",{value:!0});var Z=c.default=void 0,J=W(j()),Q=a;Z=c.default=(0,J.default)((0,Q.jsx)("path",{d:"M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"}),"MoreHoriz");var p={},Y=_;Object.defineProperty(p,"__esModule",{value:!0});var tt=p.default=void 0,et=Y(j()),at=a;tt=p.default=(0,et.default)((0,at.jsx)("path",{d:"m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"}),"ArrowUpward");export{nt as E,l as S,st as a,tt as b,Z as d};
