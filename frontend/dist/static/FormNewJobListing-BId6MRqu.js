import{r as o,_ as I,u as U,A as B,j as _,P as K}from"./index-BkQICH-X.js";import{z as t,u as z}from"./index.esm-CiJxkhb3.js";import{N as R}from"./Notifications-KuRf63x_.js";import"./iconBase-r11lJbk7.js";import"./extends-CCbyfPlC.js";const l=[{name:"General Information",fields:[{name:"title",label:"Title",placeholder:"Enter the title of the job",description:"This is the title of the job listing. Max 100 characters.",type:"text",step:1},{name:"description",label:"Description",placeholder:"Enter the description of the job",description:"This is the description of the job listing. Max 250 characters.",type:"textarea",step:2}],validationSchema:t.object({title:t.string().nonempty("Title is required").min(5,"Title is too short").max(100,"Title is too long"),description:t.string().nonempty("Description is required").min(25,"Description is too little").max(250,"Description is too long")})},{name:"Job Details",fields:[{name:"option_childcare",label:"Child Care",step:1,type:"button"},{name:"option_seniorcare",label:"Elderly Care",step:1,type:"button"},{name:"option_petcare",label:"Pet Care",step:1,type:"button"}],validationSchema:t.object({option_childcare:t.string(),option_seniorcare:t.string(),option_petcare:t.string()}),stepsNames:{1:"category"}},{name:"Payment & Work Days",fields:[{name:"payment",label:"Payment",placeholder:"Enter the payment for the job",description:"This is the payment for the job listing",type:"number",currency:!0,step:1},{name:"option_once",label:"Once",type:"button",step:2},{name:"option_hourly",label:"Hourly",type:"button",step:2},{name:"option_daily",label:"Daily",type:"button",step:2},{name:"option_weekly",label:"Weekly",type:"button",step:2},{name:"option_monthly",label:"Monthly",type:"button",step:2},{name:"work_hours",label:"Work Hours",placeholder:"Enter the hours of the job",description:"This is how many hours work a hourly, weekly, etc. Max 250 characters.",type:"text",step:3},{name:"days",label:"Work Days",description:"This is the days of the week the job listing is available. Max 250 characters.",type:"checkbox",options:[{id:"Monday"},{id:"Tuesday"},{id:"Wednesday"},{id:"Thursday"},{id:"Friday"},{id:"Saturday"},{id:"Sunday"}],step:4}],validationSchema:t.object({payment:t.string().nonempty("Payment is required"),work_hours:t.string().nonempty("Work hours is required"),days:t.union([t.array(t.string()),t.string()]),option_once:t.string(),option_hourly:t.string(),option_daily:t.string(),option_weekly:t.string(),option_monthly:t.string()}),refineData:[{key:"payment",func:n=>n.payment>0,message:"Payment must be greater than 0.",path:["payment"]},{key:"work_hours",func:n=>n.work_hours.length>0,message:"Work hours must be at least an hour.",path:["work_hours"]},{key:"days",func:n=>n.days.length>0,message:"Days must be selected.",path:["days"]}],stepsNames:{1:"payment",2:"payment_type",3:"work_days"}},{name:"Additional Information",fields:[{name:"start_date",label:"Start Date",placeholder:"mm/dd/yyyy",description:"This is the start date of the job listing.",type:"date",step:1},{name:"additional_information",label:"Extra Information",placeholder:"Enter any extra information",description:"This is the extra information of the job listing. Max 250 characters.",type:"textarea",optional:!0,step:2}],validationSchema:t.object({start_date:t.string().nonempty("Date of birth must be in the format mm/dd/yyyy.,"),additional_information:t.optional(t.string().max(250,"Additional information is too long."))}),refineData:[{key:"start_date",func:n=>{const m=new Date(n.start_date);m.setHours(0,0,0,0);const b=new Date;return b.setHours(0,0,0,0),m>=b},message:"Start date must be in the future.",path:["start_date"]}]}],G=o.lazy(()=>I(()=>import("./MultiForm-CU6d7JVi.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),import.meta.url)),$=l.reduce((n,m)=>(m.fields.forEach(b=>{n[b.name]=""}),n),{});async function Q(n,m,b){if(!n)return;const a=await K("/createJobListing",{formData:n});if(!a.ok){const x=await a.json();return b({...m,open:!0,message:x.Error}),!1}return await a.json(),!0}const ne=()=>{const n=U(),{userAuthData:m,setUserAuth:b}=o.useContext(B),[a,x]=o.useState(0),[p,D]=o.useState(1),[S,O]=o.useState({}),[W,F]=o.useState([]),[X,C]=o.useState([]),[Y,P]=o.useState(!1),[A,M]=o.useState(null),w=z({defaultValues:$});o.useEffect(()=>{if(m==null||m&&m.account_type[0]!=="option_requester"){n("/");return}return()=>{}},[]);const[L,E]=o.useState(!1),[k,v]=o.useState({open:!1,message:""});o.useEffect(()=>{(async()=>{var h;if(a===l.length){E(!0);const s=await Q(S,k,v);setTimeout(()=>{s?(E(!1),n("/job-listings")):(E(!1),n("/"))},2e3)}else(a>0||p>1)&&((h=l[a])==null?void 0:h.fields.filter(c=>c.step?c.step===p:!0).map(c=>c.name)).forEach(c=>{w.setValue(c,"")})})()},[S]);const V=r=>{F(h=>{var j;const c=l.filter(i=>i.fields.some(e=>e.step===a)).flatMap(i=>i.fields).filter(i=>i.step===p).map(i=>i.name),g=l[a],u=(j=g==null?void 0:g.stepsNames)==null?void 0:j[p];if(!u)return h;const d={...h};return d[u]||(d[u]=[]),d[u].length===0?(d[u].push(r),d):(d[u]=d[u].filter(i=>i!==r),c.forEach(i=>{d[u].splice(i,1)}),d[u].push(r),d)})},J=r=>{C(h=>{const s=[...h];return s.includes(r)?s.splice(s.indexOf(r),1):s.push(r),s})},q=r=>{var i;const s={...Object.keys(r).filter(e=>!e.includes("option_")).reduce((e,f)=>(e[f]=r[f],e),{}),options:W},c=l[a].fields.filter(e=>e.step?e.step===p:!0);let g=t.object(c.reduce((e,f)=>{var y;return e[f.name]=(y=l[a])==null?void 0:y.validationSchema.shape[f.name],e},{}));(i=l[a])!=null&&i.refineData&&c.forEach(e=>{const f=l[a].refineData.find(y=>y.key===e.name);if(f){const y=f.func(r);let T,N;typeof y=="object"&&y!==null?(T=y.valid,N=y.message):(T=y,N=f.message),g=g.refine(()=>T,{message:N,path:f.path})}});const u=g.safeParse(r);if(!u.success){const e=u.error.formErrors.fieldErrors;M(e);return}const d=l[a].fields.filter(e=>e.step?e.step===p:!0).every(e=>e.optional||r[e.name]),j=l[a].fields.filter(e=>e.step?e.step===p:!0).some(e=>e.type==="button");(d||j)&&(O(e=>({...e,...s})),l[a].fields.some(e=>e.step===p+1)?D(p+1):(x(a+1),D(1)))};o.useEffect(()=>{H()},[a,p]);const H=()=>{var h;const r=(h=l[a])==null?void 0:h.fields.filter(s=>s.step?s.step===p:!0).map(s=>s.name).filter(s=>!s.startsWith("option_"));r&&r.forEach(s=>{const c=S[s];w.setValue(s,c)})};return _.jsxs(o.Suspense,{fallback:_.jsx("div",{className:"flex items-center justify-center h-screen",children:_.jsxs("div",{className:"relative",children:[_.jsx("div",{className:"h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"}),_.jsx("div",{className:"absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"})]})}),children:[k.open&&_.jsx(R,{alertState:k,setAlertState:v}),_.jsx(G,{onSubmit:q,handleSetOptionClick:V,setCurrentStep:x,setCurrentSubStep:D,setHasUserNavigatedBack:P,alertState:k,setAlertState:v,userIsLoading:L,currentStep:a,currentSubStep:p,formSteps:l,form:w,formData:S,errors:A,handleSetCheckboxValues:J})]})};export{ne as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./MultiForm-CU6d7JVi.js","./index-BkQICH-X.js","./index-BjR-M_RL.css","./Notifications-KuRf63x_.js","./iconBase-r11lJbk7.js","./extends-CCbyfPlC.js","./index-BDpOC3Tw.js","./index.esm-CiJxkhb3.js","./label-HHLXxaTW.js","./createLucideIcon-CFD14ua0.js","./index-CTZesL8v.js","./button-DZFmWa-B.js","./card-DD6vI8e8.js","./input-DfNpMjP5.js","./index-BBjFYfzN.js","./check-CvClZA8D.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
