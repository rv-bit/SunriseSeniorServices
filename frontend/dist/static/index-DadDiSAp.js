import{_ as h}from"./extends-CCbyfPlC.js";import{R as b,r as o}from"./index-BkQICH-X.js";import{a as y,b as Y,$ as G,e as C}from"./index-CTZesL8v.js";import{$ as A,b as N}from"./index-BDpOC3Tw.js";import{$ as q}from"./index-Bo7cNx1T.js";import{$ as z}from"./index-BBjFYfzN.js";import{$ as H}from"./index-Nm5ibAgm.js";function j(e){const n=e+"CollectionProvider",[a,s]=y(n),[F,m]=a(n,{collectionRef:{current:null},itemMap:new Map}),g=i=>{const{scope:t,children:f}=i,l=b.useRef(null),r=b.useRef(new Map).current;return b.createElement(F,{scope:t,itemMap:r,collectionRef:l},f)},T=e+"CollectionSlot",$=b.forwardRef((i,t)=>{const{scope:f,children:l}=i,r=m(T,f),c=A(t,r.collectionRef);return b.createElement(N,{ref:c},l)}),d=e+"CollectionItemSlot",v="data-radix-collection-item",E=b.forwardRef((i,t)=>{const{scope:f,children:l,...r}=i,c=b.useRef(null),x=A(t,c),p=m(d,f);return b.useEffect(()=>(p.itemMap.set(c,{ref:c,...r}),()=>void p.itemMap.delete(c))),b.createElement(N,{[v]:"",ref:x},l)});function R(i){const t=m(e+"CollectionConsumer",i);return b.useCallback(()=>{const l=t.collectionRef.current;if(!l)return[];const r=Array.from(l.querySelectorAll(`[${v}]`));return Array.from(t.itemMap.values()).sort((p,S)=>r.indexOf(p.ref.current)-r.indexOf(S.ref.current))},[t.collectionRef,t.itemMap])}return[{Provider:g,Slot:$,ItemSlot:E},R,s]}const w="rovingFocusGroup.onEntryFocus",J={bubbles:!1,cancelable:!0},O="RovingFocusGroup",[M,L,Q]=j(O),[W,me]=y(O,[Q]),[X,Z]=W(O),ee=o.forwardRef((e,n)=>o.createElement(M.Provider,{scope:e.__scopeRovingFocusGroup},o.createElement(M.Slot,{scope:e.__scopeRovingFocusGroup},o.createElement(te,h({},e,{ref:n}))))),te=o.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:a,orientation:s,loop:F=!1,dir:m,currentTabStopId:g,defaultCurrentTabStopId:T,onCurrentTabStopIdChange:$,onEntryFocus:d,...v}=e,E=o.useRef(null),R=A(n,E),i=H(m),[t=null,f]=z({prop:g,defaultProp:T,onChange:$}),[l,r]=o.useState(!1),c=Y(d),x=L(a),p=o.useRef(!1),[S,P]=o.useState(0);return o.useEffect(()=>{const u=E.current;if(u)return u.addEventListener(w,c),()=>u.removeEventListener(w,c)},[c]),o.createElement(X,{scope:a,orientation:s,dir:i,loop:F,currentTabStopId:t,onItemFocus:o.useCallback(u=>f(u),[f]),onItemShiftTab:o.useCallback(()=>r(!0),[]),onFocusableItemAdd:o.useCallback(()=>P(u=>u+1),[]),onFocusableItemRemove:o.useCallback(()=>P(u=>u-1),[])},o.createElement(G.div,h({tabIndex:l||S===0?-1:0,"data-orientation":s},v,{ref:R,style:{outline:"none",...e.style},onMouseDown:C(e.onMouseDown,()=>{p.current=!0}),onFocus:C(e.onFocus,u=>{const U=!p.current;if(u.target===u.currentTarget&&U&&!l){const D=new CustomEvent(w,J);if(u.currentTarget.dispatchEvent(D),!D.defaultPrevented){const _=x().filter(I=>I.focusable),K=_.find(I=>I.active),B=_.find(I=>I.id===t),V=[K,B,..._].filter(Boolean).map(I=>I.ref.current);k(V)}}p.current=!1}),onBlur:C(e.onBlur,()=>r(!1))})))}),oe="RovingFocusGroupItem",re=o.forwardRef((e,n)=>{const{__scopeRovingFocusGroup:a,focusable:s=!0,active:F=!1,tabStopId:m,...g}=e,T=q(),$=m||T,d=Z(oe,a),v=d.currentTabStopId===$,E=L(a),{onFocusableItemAdd:R,onFocusableItemRemove:i}=d;return o.useEffect(()=>{if(s)return R(),()=>i()},[s,R,i]),o.createElement(M.ItemSlot,{scope:a,id:$,focusable:s,active:F},o.createElement(G.span,h({tabIndex:v?0:-1,"data-orientation":d.orientation},g,{ref:n,onMouseDown:C(e.onMouseDown,t=>{s?d.onItemFocus($):t.preventDefault()}),onFocus:C(e.onFocus,()=>d.onItemFocus($)),onKeyDown:C(e.onKeyDown,t=>{if(t.key==="Tab"&&t.shiftKey){d.onItemShiftTab();return}if(t.target!==t.currentTarget)return;const f=se(t,d.orientation,d.dir);if(f!==void 0){t.preventDefault();let r=E().filter(c=>c.focusable).map(c=>c.ref.current);if(f==="last")r.reverse();else if(f==="prev"||f==="next"){f==="prev"&&r.reverse();const c=r.indexOf(t.currentTarget);r=d.loop?fe(r,c+1):r.slice(c+1)}setTimeout(()=>k(r))}})})))}),ne={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function ce(e,n){return n!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function se(e,n,a){const s=ce(e.key,a);if(!(n==="vertical"&&["ArrowLeft","ArrowRight"].includes(s))&&!(n==="horizontal"&&["ArrowUp","ArrowDown"].includes(s)))return ne[s]}function k(e){const n=document.activeElement;for(const a of e)if(a===n||(a.focus(),document.activeElement!==n))return}function fe(e,n){return e.map((a,s)=>e[(n+s)%e.length])}const Ie=ee,ve=re;export{j as $,me as a,Ie as b,ve as c};
