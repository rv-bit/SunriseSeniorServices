import{r as j,j as N,c as V}from"./index-BkQICH-X.js";import{b as k}from"./index-BDpOC3Tw.js";function y(t){var n,e,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t))for(n=0;n<t.length;n++)t[n]&&(e=y(t[n]))&&(r&&(r+=" "),r+=e);else for(n in t)t[n]&&(r&&(r+=" "),r+=n);return r}function C(){for(var t,n,e=0,r="";e<arguments.length;)(t=arguments[e++])&&(n=y(t))&&(r&&(r+=" "),r+=n);return r}const m=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,b=C,w=(t,n)=>e=>{var r;if((n==null?void 0:n.variants)==null)return b(t,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:d,defaultVariants:a}=n,l=Object.keys(d).map(o=>{const i=e==null?void 0:e[o],u=a==null?void 0:a[o];if(i===null)return null;const s=m(i)||m(u);return d[o][s]}),v=e&&Object.entries(e).reduce((o,i)=>{let[u,s]=i;return s===void 0||(o[u]=s),o},{}),g=n==null||(r=n.compoundVariants)===null||r===void 0?void 0:r.reduce((o,i)=>{let{class:u,className:s,...x}=i;return Object.entries(x).every(h=>{let[f,c]=h;return Array.isArray(c)?c.includes({...a,...v}[f]):{...a,...v}[f]===c})?[...o,u,s]:o},[]);return b(t,l,g,e==null?void 0:e.class,e==null?void 0:e.className)},A=w("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),O=j.forwardRef(({className:t,variant:n,size:e,asChild:r=!1,...d},a)=>{const l=r?k:"button";return N.jsx(l,{className:V(A({variant:n,size:e,className:t})),ref:a,...d})});O.displayName="Button";export{O as B,A as b,w as c};
