import{r as s,c as t,o as c,d as e,a,b as l,e as i,u as n,f as o,g as d,p as r,h,i as v,j as u,k as p,l as m,m as f,F as g,n as x,q as z,w as M,M as w,T as y,s as b,t as k,v as H,x as _,y as V,z as C,A as j,B as L,C as B,D as A,E,G as I,H as S,I as q,J as O}from"./vendor.2f8bc040.js";!function(){const s=document.createElement("link").relList;if(!(s&&s.supports&&s.supports("modulepreload"))){for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver((s=>{for(const c of s)if("childList"===c.type)for(const s of c.addedNodes)"LINK"===s.tagName&&"modulepreload"===s.rel&&t(s)})).observe(document,{childList:!0,subtree:!0})}function t(s){if(s.ep)return;s.ep=!0;const t=function(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerpolicy&&(t.referrerPolicy=s.referrerpolicy),"use-credentials"===s.crossorigin?t.credentials="include":"anonymous"===s.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(s);fetch(s.href,t)}}();const P={setup:e=>(e,a)=>{const l=s("router-view");return c(),t(l)}},D={},R=function(s,t){return t&&0!==t.length?Promise.all(t.map((s=>{if((s=`https://cdn.jsdelivr.net/gh/luckyhookin/static@deploy/hookin-fun/hir/${s}`)in D)return;D[s]=!0;const t=s.endsWith(".css"),c=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${c}`))return;const e=document.createElement("link");return e.rel=t?"stylesheet":"modulepreload",t||(e.as="script",e.crossOrigin=""),e.href=s,document.head.appendChild(e),t?new Promise(((s,t)=>{e.addEventListener("load",s),e.addEventListener("error",t)})):void 0}))).then((()=>s())):s()},T=e({name:"SvgIcon",props:{prefix:{type:String,default:"icon"},name:{type:String,required:!0},color:{type:String,default:null}},setup:s=>({symbolId:a((()=>`#${s.prefix}-${s.name}`))})}),$={"aria-hidden":"true"},G=["xlink:href","fill"];T.render=function(s,t,e,a,n,o){return c(),l("svg",$,[i("use",{"xlink:href":s.symbolId,fill:s.color},null,8,G)])};const N=n(),W=o((()=>({isDark:N}))),F=o((()=>d("user-state",{id:"123",name:"Hir."}).value));r("data-v-05af9c5b");const J={class:"max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"},K={class:"relative flex items-center justify-between h-16"},Y={class:"absolute inset-y-0 left-0 flex items-center sm:hidden"},Z=i("span",{class:"sr-only"},"Open main menu",-1),Q={key:0,xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},U=[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 6h16M4 12h16M4 18h16"},null,-1)],X={key:1,xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},ss=[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"},null,-1)],ts={class:"flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"},cs={class:"flex-shrink-0 flex items-center"},es={class:"hidden sm:block sm:ml-6"},as={class:"flex space-x-4"},ls={class:"absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"},is=i("button",{type:"button",class:"bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"},[i("span",{class:"sr-only"},"View notifications"),i("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-6 w-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"})])],-1),ns=i("span",{class:"sr-only"},"Open user menu",-1),os=i("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-8 w-8 rounded-full text-gray-300",viewBox:"0 0 20 20",fill:"currentColor"},[i("path",{"fill-rule":"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z","clip-rule":"evenodd"})],-1),ds=i("div",{class:"absolute h-6 w-6 rounded-full border border-gray-700 bg-gray-100 dark:bg-black -bottom-4 -right-2 ring-1 ring-black ring-opacity-30"},[i("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"})])],-1),rs={class:"!cursor-default menu-item"},hs={class:"w-full"},vs={class:"font-bold text-lg"},us=i("br",null,null,-1),ps={class:"break-words"},ms=i("div",{class:"flex mt-2"},[i("svg",{xmlns:"http://www.w3.org/2000/svg",class:"h-5 w-5 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[i("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 11-18 0 9 9 0 0118 0z"})]),j("0.00 ")],-1),fs=i("hr",{class:"mx-2"},null,-1),gs={xmlns:"http://www.w3.org/2000/svg",class:"h-5 w-5 mr-2",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},xs={key:0,"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"},zs={key:1,"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"},Ms={key:0,class:"px-2 pt-2 pb-3 space-y-1 sm:hidden"};h();const ws={setup(e){const a=F(),n=W().isDark,o=v(n),d=u([{name:"主页",to:"/"},{name:"房间",to:"/room"},{name:"价钱",to:"/login"},{name:"关于",to:"/about"}]),r=p(null),h=p(!1);return m(r,(()=>{h.value=!1})),(e,v)=>{const u=s("router-link");return c(),l("nav",{as:"nav",ref:(s,t)=>{t.nav=s,r.value=s},class:"bg-gray-800 rounded-b-md fixed top-0 w-full z-10"},[i("div",J,[i("div",K,[i("div",Y,[i("button",{onClick:v[0]||(v[0]=s=>h.value=!h.value),class:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"},[Z,h.value?(c(),l("svg",X,ss)):(c(),l("svg",Q,U))])]),i("div",ts,[i("div",cs,[f(T,{name:"logo",class:"block h-8 w-8"})]),i("div",es,[i("div",as,[(c(!0),l(g,null,x(z(d),(s=>(c(),t(u,{key:s.name,to:s.to,"active-class":"bg-gray-900 text-white",class:_(["text-gray-300 hover:bg-gray-700 hover:text-white","px-3 py-2 rounded-md text-sm font-medium active:bg-gray-500"])},{default:M((()=>[j(k(s.name),1)])),_:2},1032,["to"])))),128))])])]),i("div",ls,[is,f(z(V),{as:"div",class:"ml-3 relative"},{default:M((()=>[i("div",null,[f(z(w),{class:"bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"},{default:M((()=>[ns,os])),_:1})]),f(y,{"enter-active-class":"transition ease-out duration-100","enter-from-class":"transform opacity-0 scale-95","enter-to-class":"transform opacity-100 scale-100","leave-active-class":"transition ease-in duration-75","leave-from-class":"transform opacity-100 scale-100","leave-to-class":"transform opacity-0 scale-95"},{default:M((()=>[f(z(b),{class:"origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none main-text"},{default:M((()=>[f(z(w),{class:"absolute w-10 h-10 -top-10 right-0"},{default:M((()=>[ds])),_:1}),i("div",rs,[i("div",hs,[i("span",vs,k(z(a).name),1),us,i("div",ps,k(z(a).id),1),ms])]),fs,f(z(H),null,{default:M((({active:s})=>[i("div",{onClick:v[1]||(v[1]=(...s)=>z(o)&&z(o)(...s)),class:_([s?"active":"","menu-item"])},[(c(),l("svg",gs,[z(n)?(c(),l("path",xs)):(c(),l("path",zs))])),i("span",null,k(z(n)?"启用亮色模式":"启用暗色模式"),1)],2)])),_:1}),f(z(H),null,{default:M((({active:s})=>[i("span",{onClick:v[2]||(v[2]=(...s)=>z(o)&&z(o)(...s)),class:_([s?"active":"","menu-item"])},"Your Profile",2)])),_:1}),f(z(H),null,{default:M((({active:s})=>[i("a",{href:"#",class:_([s?"active":"","menu-item"])},"Settings",2)])),_:1}),f(z(H),null,{default:M((({active:s})=>[i("a",{href:"#",class:_([s?"active":"","menu-item"])},"Sign out",2)])),_:1})])),_:1})])),_:1})])),_:1})])])]),f(y,{"enter-active-class":"transition transform duration-500","enter-from-class":"opacity-0 translate-y-4","enter-to-class":"opacity-100 translate-y-0"},{default:M((()=>[h.value?(c(),l("div",Ms,[(c(!0),l(g,null,x(z(d),(s=>(c(),t(u,{key:s.name,to:s.to,"active-class":"bg-gray-900 text-white",class:_([s.current?"bg-gray-900 text-white":"text-gray-300 hover:bg-gray-700 hover:text-white","block px-3 py-2 rounded-md text-base font-medium"]),"aria-current":s.current?"page":void 0},{default:M((()=>[j(k(s.name),1)])),_:2},1032,["to","class","aria-current"])))),128))])):C("",!0)])),_:1})],512)}},__scopeId:"data-v-05af9c5b"};r("data-v-5c136265");const ys={class:"container relative mx-auto min-h-screen pt-16"},bs={class:"relative h-[22.5rem] lg:h-[calc(100vh-8rem)] min-h-[22.5rem] pt-10 sm:pt-4"},ks={class:"relative main-text"},Hs=i("h1",{class:"title"},"Hir. - 极致协作",-1),_s=i("div",{class:"subtitle"},"使用 Hir 和你的伙伴畅快协作，激发头脑风暴！",-1),Vs={class:"m-auto sm:w-[calc(100vw-4rem)] mt-10 lg:m-16 lg:w-1/2 p-5 rounded-md border dark:border-gray-600 shadow-md hover:shadow-lg transition main-bg flex flex-col sm:flex-row justify-between"},Cs={class:"sm:w-1/3"},js=i("div",{class:"pb-2"},[i("div",{class:"inline-block rounded-full bg-blue-500 text-white px-2"},"1"),j(" 连接模式：")],-1),Ls={class:"sm:w-1/3 pt-6 sm:pt-0"},Bs=i("div",{class:"pb-2"},[i("div",{class:"inline-block rounded-full bg-blue-500 text-white px-2"},"2"),j(" 协作工具：")],-1),As=A("<div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div><div data-v-5c136265>1</div>",25);h();const Es={setup(s){const e=L(),a=u([{name:"免费模式",key:0},{name:"极速模式",key:1}]),n=p(0),o=s=>{n.value=s},d=s=>{e.push({name:"Room",query:{mode:n.value}})};return(s,e)=>(c(),l(g,null,[f(ws),i("div",ys,[i("div",bs,[f(T,{name:"index",class:"index-bg"}),i("div",ks,[Hs,_s,i("div",Vs,[i("div",Cs,[js,f(z(B),{onChange:o},{default:M((()=>[f(z(E),{class:"flex p-1 space-x-1 bg-indigo-500 rounded-lg dark transition"},{default:M((()=>[(c(!0),l(g,null,x(z(a),(s=>(c(),t(z(I),{as:"template",key:s.key},{default:M((({selected:t})=>[i("button",{class:_(["w-full py-1 text-sm leading-5 font-mediumtext-white text-white font-bold rounded-md","focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-300",t?"bg-white shadow text-indigo-700":"hover:bg-white/[0.12]"])},k(s.name),3)])),_:2},1024)))),128))])),_:1})])),_:1})]),i("div",Ls,[Bs,f(z(B),{onChange:o},{default:M((()=>[f(z(E),{class:"flex p-1 space-x-1 bg-indigo-500 rounded-lg dark transition"},{default:M((()=>[(c(!0),l(g,null,x(z(a),(s=>(c(),t(z(I),{as:"template",key:s.key},{default:M((({selected:t})=>[i("button",{class:_(["w-full py-1 text-sm leading-5 font-mediumtext-white text-white font-bold rounded-md","focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-300",t?"bg-white shadow text-indigo-700":"hover:bg-white/[0.12]"])},k(s.name),3)])),_:2},1024)))),128))])),_:1})])),_:1})]),i("div",null,[i("button",{class:"btn w-full mt-20",onClick:d}," Let's GO! ")])])])]),As])],64))},__scopeId:"data-v-5c136265"};r("data-v-4ad28120");const Is={class:"min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 main-text"},Ss={class:"max-w-md w-full space-y-8"},qs=i("h2",{class:"mt-6 text-center text-3xl font-extrabold"}," Hir, 欢迎登录! ",-1),Os=i("form",{class:"mt-8 space-y-6",action:"#",method:"POST"},[i("div",{class:"rounded-md shadow-sm -space-y-px"},[i("div",null,[i("label",{for:"email-address",class:"sr-only"},"Email address"),i("input",{id:"email-address",name:"email",type:"email",autocomplete:"email",required:"required",class:"appearance-none rounded-none relative block w-full px-3 py-2 text-gray-900 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",placeholder:"请输入邮箱地址"})]),i("div",null,[i("label",{for:"password",class:"sr-only"},"Password"),i("input",{id:"password",name:"password",type:"password",autocomplete:"current-password",required:"required",class:"appearance-none rounded-none relative block w-full px-3 py-2 text-gray-900 border border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",placeholder:"请输入登录密码"})])]),i("div",{class:"flex items-center justify-between"},[i("div",{class:"flex items-center"},[i("input",{id:"remember-me",name:"remember-me",type:"checkbox",class:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"}),i("label",{for:"remember-me",class:"ml-2 block text-sm"}," 记住我 ")]),i("div",{class:"text-sm cursor-default"},[i("a",{href:"#",class:"font-medium text-blue-800 dark:text-blue-300 hover:text-indigo-500 dark:hover:text-indigo-400"}," 注册 "),j(" / "),i("a",{href:"#",class:"font-medium text-blue-800 dark:text-blue-300 hover:text-indigo-500 dark:hover:text-indigo-400"}," 忘记密码? ")])]),i("button",{type:"submit",class:"group btn w-full relative"},[i("span",{class:"absolute left-0 inset-y-0 flex items-center pl-3"},[i("svg",{class:"h-5 w-5 text-indigo-500 group-hover:text-indigo-400",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[i("path",{"fill-rule":"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z","clip-rule":"evenodd"})])]),j(" 登 录 ")])],-1),Ps=i("div",{class:"text-sm mb-2"},"其他登录方式：",-1),Ds=[i("svg",{class:"w-8 h-8",role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},[i("title",null,"GitHub"),i("path",{d:"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"})],-1)],Rs=[i("svg",{class:"w-8 h-8",role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},[i("title",null,"Gitee"),i("path",{fill:"#C71D23",d:"M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"})],-1)],Ts=[i("svg",{class:"w-8 h-8",role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},[i("title",null,"WeChat"),i("path",{fill:"#07C160",d:"M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"})],-1)],$s=i("div",{class:"pt-2"},[i("a",{href:"#",class:"font-medium text-blue-800 dark:text-blue-300 hover:text-indigo-500 dark:hover:text-indigo-400"}," 使用临时身份凭证登录 ")],-1);h();const Gs={setup(s){const t=()=>{},e=()=>{},a=()=>{};return(s,n)=>(c(),l("div",null,[i("div",Is,[i("div",Ss,[i("div",null,[f(T,{name:"logo",class:"mx-auto h-12 w-auto"}),qs]),Os,i("div",{class:"text-sm"},[Ps,i("div",{class:"flex justify-between"},[i("div",null,[i("button",{class:"other-login-btn",onClick:t},Ds),i("button",{class:"other-login-btn",onClick:e},Rs),i("button",{class:"other-login-btn",onClick:a},Ts)]),$s])])])])]))},__scopeId:"data-v-4ad28120"},Ns=[{path:"/",name:"Home",component:Es},{path:"/room",name:"Room",component:()=>R((()=>import("./Room.1a5c099d.js").then((function(s){return s.b}))),["assets/Room.1a5c099d.js","assets/Room.3a678ccf.css","assets/vendor.2f8bc040.js"])},{path:"/login",name:"Login",component:Gs},{path:"/about",name:"About",component:()=>R((()=>import("./About.6076b97d.js")),["assets/About.6076b97d.js","assets/vendor.2f8bc040.js"])}],Ws=S({history:q(),routes:Ns});if("undefined"!=typeof window){let s=function(){let s=document.body,t=document.getElementById("__svg__icons__dom__1633910498746__");t||(t=document.createElementNS("http://www.w3.org/2000/svg","svg"),t.style.position="absolute",t.style.width="0",t.style.height="0",t.id="__svg__icons__dom__1633910498746__"),t.innerHTML='<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" id="icon-index"><style>@keyframes ping{75%{opacity:0}to{opacity:1}}#icon-index .st0{fill:#1f3969}#icon-index .st1{fill:#e5f0f9}#icon-index .st3{fill:#cecece}#icon-index .st4{fill:#fff}#icon-index .st6{opacity:.28}#icon-index .st8{fill:#5f5aff}#icon-index .st9{fill:#f6f9fd}#icon-index .st10{fill:#bfcfe2}#icon-index .st11{fill:#2d425e}#icon-index .st13{fill:#2aa1ff}#icon-index .st16,#icon-index .st19,#icon-index .st20,#icon-index .st21,#icon-index .st22,#icon-index .st23{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}#icon-index .st19,#icon-index .st20,#icon-index .st21,#icon-index .st22,#icon-index .st23{stroke-width:4}#icon-index .st20,#icon-index .st21,#icon-index .st22,#icon-index .st23{stroke:#7bffa0}#icon-index .st21,#icon-index .st22,#icon-index .st23{stroke:#9169ff}#icon-index .st22,#icon-index .st23{stroke:#ffc47d}#icon-index .st23{stroke:#ff5757}#icon-index .st26{fill:#6567c3}#icon-index .st28{fill:#444e59}#icon-index .st29{opacity:.56}</style><path class="st0" d="M714.1 248.8h-78.2c-5.6 0-10.1-4.5-10.1-10.1v-37.8c0-5.6 4.5-10.1 10.1-10.1h78.2c5.6 0 10.1 4.5 10.1 10.1v37.8c0 5.6-4.5 10.1-10.1 10.1z" /><path class="st1" d="M635.9 193.7c-3.9 0-7.1 3.2-7.1 7.1v37.8c0 3.9 3.2 7.1 7.1 7.1h78.2c3.9 0 7.1-3.2 7.1-7.1v-37.8c0-3.9-3.2-7.1-7.1-7.1h-78.2z" /><g id="icon-index_Layer_1"><path d="M554.3 324.7h620.3c5 0 9 4 9 9s-4 9-9 9H554.3c-5 0-9-4-9-9s4.1-9 9-9z" style="fill:#c9c9c9" /><path class="st3" d="M671.1 249.7c-9.6-.1-17.3-7.9-17.2-17.5.1-9.5 7.7-17.1 17.2-17.2h98v34.7h-98z" /><path class="st4" d="M671.1 209h103.7v46.7H671.1c-12.9 0-23.3-10.5-23.3-23.3-.1-12.9 10.4-23.4 23.3-23.4z" /><path class="st0" d="M769.1 229H664.7c-1.1 0-2-.9-2-2s.9-2 2-2h104.4c1.1 0 2 .9 2 2s-.9 2-2 2zM769.1 239.6H664.7c-1.1 0-2-.9-2-2s.9-2 2-2h104.4c1.1 0 2 .9 2 2s-.9 2-2 2z" /><path class="st0" d="M769.1 251.7h-98c-10.7-.1-19.3-8.8-19.2-19.5.1-10.6 8.6-19.1 19.2-19.2h98c1.1 0 2 .9 2 2v34.7c0 1.1-.9 2-2 2zm-98-34.7c-8.5.1-15.3 7-15.2 15.5.1 8.4 6.8 15.2 15.2 15.2h96V217h-96z" /><path d="M671.1 249.7c-9.6-.1-17.3-7.9-17.2-17.5.1-9.5 7.7-17.1 17.2-17.2h99.7l4-6H671.1c-12.9 0-23.3 10.5-23.3 23.3 0 12.9 10.4 23.3 23.3 23.3h103.7l-4-6h-99.7z" style="fill:#ff3e3e" /><path class="st0" d="M774.8 257.7H671.1c-14-.1-25.3-11.5-25.2-25.5.1-13.9 11.3-25.1 25.2-25.2h103.7c1.1 0 2 .9 2 2 0 .4-.1.8-.3 1.1l-4 6c-.4.6-1 .9-1.7.9h-99.7c-8.5.1-15.3 7-15.2 15.5.1 8.4 6.8 15.2 15.2 15.2h99.7c.7 0 1.3.3 1.7.9l4 6c.6.9.4 2.2-.6 2.8-.3.2-.7.3-1.1.3zM671.1 211c-11.8.1-21.3 9.7-21.2 21.5.1 11.7 9.5 21.1 21.2 21.2h100l-1.3-2h-98.6c-10.7-.1-19.3-8.8-19.2-19.5.1-10.6 8.6-19.1 19.2-19.2h98.6l1.3-2h-100z" /><g class="st6"><path class="st0" d="M734.1 209h18.4v46.7h-18.4z" /><path class="st0" d="M752.5 257.7h-18.4c-1.1 0-2-.9-2-2V209c0-1.1.9-2 2-2h18.4c1.1 0 2 .9 2 2v46.7c0 1.1-.9 2-2 2zm-16.4-4h14.4V211h-14.4v42.7z" /></g><path d="M574.2 255.7h189.9c3.7 0 6.8 3 6.8 6.8v25c0 3.7-3 6.8-6.8 6.8H574.2c-3.7 0-6.8-3-6.8-6.8v-25c0-3.8 3.1-6.8 6.8-6.8z" style="fill:#50b56f" /><path class="st0" d="M764.1 296.2H574.2c-4.8 0-8.8-3.9-8.8-8.8v-25c0-4.8 3.9-8.8 8.8-8.8h189.9c4.8 0 8.8 3.9 8.8 8.8v25c0 4.9-4 8.8-8.8 8.8zm-189.9-38.5c-2.6 0-4.8 2.1-4.8 4.8v25c0 2.6 2.1 4.8 4.8 4.8h189.9c2.6 0 4.8-2.1 4.8-4.8v-25c0-2.6-2.1-4.8-4.8-4.8H574.2z" /><g class="st6"><path class="st0" d="M764.1 255.7h-30v15c0 9.4 7.6 17.1 17.1 17.1h19.7v-25.3c0-3.8-3.1-6.8-6.8-6.8z" /><path class="st0" d="M770.9 289.7h-19.7c-10.5 0-19-8.5-19.1-19.1v-15c0-1.1.9-2 2-2h30c4.8 0 8.8 3.9 8.8 8.8v25.3c-.1 1.2-1 2-2 2zm-34.8-32v13c0 8.3 6.7 15.1 15.1 15.1h17.7v-23.3c0-2.6-2.1-4.8-4.8-4.8h-28z" /></g><path class="st3" d="M817.6 302h-220c2.7 7.3 2.7 15.4 0 22.7h219.9c-2.6-7.3-2.6-15.4.1-22.7z" /><path class="st8" d="M591.7 295.9h231.9v6H591.7z" /><path class="st0" d="M823.5 304H591.7c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2h231.9c1.1 0 2 .9 2 2v6c-.1 1.1-1 2-2.1 2zm-229.8-4h227.9v-2H593.7v2z" /><path class="st9" d="M591.7 324.7h231.9v6H591.7z" /><path class="st8" d="M591.7 324.7h231.9v6H591.7z" /><path class="st0" d="M823.5 332.7H591.7c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2h231.9c1.1 0 2 .9 2 2v6c-.1 1.2-1 2-2.1 2zm-229.8-4h227.9v-2H593.7v2z" /><path class="st10" d="m938.8 309.4-3-33.7h-49.4l-3 33.7c-.7 7.8-5.4 15.3-12.8 21.3v.1h81v-.1c-7.4-6-12.1-13.5-12.8-21.3z" /><g class="st6"><path class="st0" d="m886.4 275.7-1.8 20.2h53l-1.8-20.2z" /><path class="st0" d="M937.6 297.9h-53c-1.1 0-2-.9-2-2v-.2l1.8-20.2c.1-1 1-1.8 2-1.8h49.4c1 0 1.9.8 2 1.8l1.8 20.2c.1 1.1-.7 2.1-1.8 2.2h-.2zm-50.8-4h48.7l-1.5-16.2h-45.8l-1.4 16.2z" /></g><path class="st0" d="M951.6 332.7h-81c-1.1 0-2-.9-2-2v-.2c.1-.5.3-1 .7-1.4 7.1-5.8 11.4-12.8 12-19.9l3-33.7c.1-1 1-1.8 2-1.8h49.4c1 0 1.9.8 2 1.8l3 33.7c.6 7.1 4.9 14.1 12 19.9.4.3.7.8.7 1.3.1.6-.1 1.2-.5 1.6-.2.5-.7.7-1.3.7zm-75.9-4h70.8c-5.7-5.8-9.1-12.4-9.7-19.2l-2.9-31.8h-45.7l-2.9 31.8c-.5 6.8-3.9 13.5-9.6 19.2z" /><path class="st4" d="M753.1 50.7h316c6.6 0 12 5.4 12 12v206c0 6.6-5.4 12-12 12h-316c-6.6 0-12-5.4-12-12v-206c0-6.6 5.4-12 12-12z" /><path class="st10" d="M753.1 50.7h316c6.6 0 12 5.4 12 12v206c0 6.6-5.4 12-12 12h-316c-6.6 0-12-5.4-12-12v-206c0-6.6 5.4-12 12-12z" /><path class="st0" d="M1069.1 282.7h-316c-7.7 0-14-6.3-14-14v-206c0-7.7 6.3-14 14-14h316c7.7 0 14 6.3 14 14v206c0 7.8-6.3 14-14 14zm-316-230c-5.5 0-10 4.5-10 10v206c0 5.5 4.5 10 10 10h316c5.5 0 10-4.5 10-10v-206c0-5.5-4.5-10-10-10h-316z" /><path class="st9" d="M758.1 67.7h306v174.6h-306z" /><g class="st6"><path class="st0" d="M769.1 50.7v138.6c0 4.4 3.6 8 8 8h189.1c4.4 0 8-3.6 8-8V50.7H769.1z" /><path class="st0" d="M966.2 199.3H777.1c-5.5 0-10-4.5-10-10V50.7c0-1.1.9-2 2-2h205.1c1.1 0 2 .9 2 2v138.6c0 5.6-4.5 10-10 10zM771.1 52.7v136.6c0 3.3 2.7 6 6 6h189.1c3.3 0 6-2.7 6-6V52.7H771.1z" /></g><path class="st0" d="M1064.1 244.3h-306c-1.1 0-2-.9-2-2V67.7c0-1.1.9-2 2-2h306c1.1 0 2 .9 2 2v174.6c0 1.1-.9 2-2 2zm-304-4h302V69.7h-302v170.6zM924.5 263.5h-26.9c-1.1 0-2-.9-2-2s.9-2 2-2h26.9c1.1 0 2 .9 2 2s-.9 2-2 2z" /><path class="st11" d="M786.1 22.1h189.1c4.4 0 8 3.6 8 8v148.3c0 4.4-3.6 8-8 8H786.1c-4.4 0-8-3.6-8-8V30.1c0-4.5 3.6-8 8-8z" /><path class="st0" d="M983.2 43.5H778.1c-1.1 0-2-.9-2-2V30.1c0-5.5 4.5-10 10-10h189.1c5.5 0 10 4.5 10 10v11.5c0 1-.9 1.9-2 1.9zm-203.1-4h201.1V30c0-3.3-2.7-6-6-6H786.1c-3.3 0-6 2.7-6 6v9.5z" /><path d="M786.1 22.1h189.1c4.4 0 8 3.6 8 8v15.3H778.1V30.1c0-4.5 3.6-8 8-8z" style="fill:#d0ddf0" /><path class="st0" d="M983.2 47.3H778.1c-1.1 0-2-.9-2-2V30.1c0-5.5 4.5-10 10-10h189.1c5.5 0 10 4.5 10 10v15.3c0 1-.9 1.9-2 1.9zm-203.1-4h201.1V30.1c0-3.3-2.7-6-6-6H786.1c-3.3 0-6 2.7-6 6v13.2z" /><path class="st0" d="M983.2 47.3H778.1c-1.1 0-2-.9-2-2V30.1c0-5.5 4.5-10 10-10h189.1c5.5 0 10 4.5 10 10v15.3c0 1-.9 1.9-2 1.9zm-203.1-4h201.1V30.1c0-3.3-2.7-6-6-6H786.1c-3.3 0-6 2.7-6 6v13.2z" /><path class="st0" d="M975.2 188.3H786.1c-5.5 0-10-4.5-10-10V30.1c0-5.5 4.5-10 10-10h189.1c5.5 0 10 4.5 10 10v148.3c0 5.5-4.5 9.9-10 9.9zM786.1 24.1c-3.3 0-6 2.7-6 6v148.3c0 3.3 2.7 6 6 6h189.1c3.3 0 6-2.7 6-6V30.1c0-3.3-2.7-6-6-6H786.1z" /><g class="st6"><path class="st0" d="M957.8 82.8h116c4.4 0 8 3.6 8 8v122.9c0 4.4-3.6 8-8 8h-116c-4.4 0-8-3.6-8-8V90.8c0-4.4 3.6-8 8-8z" /><path class="st0" d="M1073.9 223.7h-116c-5.5 0-10-4.5-10-10V90.8c0-5.5 4.5-10 10-10h116c5.5 0 10 4.5 10 10v122.9c0 5.6-4.5 10-10 10zM957.8 84.8c-3.3 0-6 2.7-6 6v122.9c0 3.3 2.7 6 6 6h116c3.3 0 6-2.7 6-6V90.8c0-3.3-2.7-6-6-6h-116z" /></g><path class="st13" d="M965.8 75.8h116c4.4 0 8 3.6 8 8v122.9c0 4.4-3.6 8-8 8h-116c-4.4 0-8-3.6-8-8V83.8c0-4.4 3.6-8 8-8z" /><path class="st0" d="M1081.9 216.7h-116c-5.5 0-10-4.5-10-10V83.8c0-5.5 4.5-10 10-10h116c5.5 0 10 4.5 10 10v122.9c0 5.6-4.5 10-10 10zM965.8 77.8c-3.3 0-6 2.7-6 6v122.9c0 3.3 2.7 6 6 6h116c3.3 0 6-2.7 6-6V83.8c0-3.3-2.7-6-6-6h-116z" /><path d="M983 95.7h81.6c2.9 0 5.2 2.3 5.2 5.2v7.8c0 2.9-2.3 5.2-5.2 5.2H983c-2.9 0-5.2-2.3-5.2-5.2v-7.8c.1-2.8 2.4-5.2 5.2-5.2z" style="opacity:.34;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;enable-background:new" /><g style="opacity:.34"><path class="st16" d="M983.1 125h45.6c2.9 0 5.2 2.3 5.2 5.2v7.8c0 2.9-2.3 5.2-5.2 5.2h-45.6c-2.9 0-5.2-2.3-5.2-5.2v-7.8c0-2.8 2.4-5.2 5.2-5.2zM1047 125h17.7c2.9 0 5.2 2.3 5.2 5.2v7.8c0 2.9-2.3 5.2-5.2 5.2H1047c-2.9 0-5.2-2.3-5.2-5.2v-7.8c.1-2.8 2.4-5.2 5.2-5.2z" /></g><path class="st16" d="M977.9 173.6h91.9M977.9 184.4h91.9M977.9 195.2h55.9" /><circle cx="798.2" cy="33.7" r="4" style="fill:#ef4444" /><circle cx="812.1" cy="33.7" r="4" style="fill:#10b981" /><circle class="st0" cx="825.9" cy="33.7" r="4" /><path class="st19" d="M895.9 63.8h12.9" /><path class="st20" d="M829.9 63.8h56.4" /><path class="st21" d="M802.2 63.8h19.7" /><path class="st21" style="animation:ping 1.5s cubic-bezier(0,0,.2,1) infinite;transition-timing-function:cubic-bezier(.4,0,.2,1)" d="M827.9 162.3H871" /><path class="st20" d="M802.2 162.3h13.9" /><path class="st19" d="M886.3 76.1h8" /><path class="st21" d="M849.4 76.1h27.3" /><path class="st22" d="M812.1 76.1h27.7" /><path class="st19" d="M855 88.4h23.8" /><path class="st23" d="M824.9 88.4h22.5" /><path class="st19" d="M858.2 100.7h4.9" /><path class="st21" d="M838.4 100.7h11" /><path class="st20" d="M812.1 100.7h17.8" /><path class="st22" d="M850.5 113.1h31.9" /><path class="st23" d="M812.1 113.1h28.6" /><path class="st21" d="M887.4 125.4h17.3" /><path class="st23" d="M850.5 125.4h27.7" /><path class="st20" d="M824.9 125.4h15.8" /><path class="st19" d="M863.1 137.7h15.1" /><path class="st21" d="M824.9 137.7h27.8" /><path class="st19" d="M902.4 150h17.3" /><path class="st22" d="M849.4 150H893" /><path class="st19" d="M812.1 150h27.7" /><path class="st0" d="M815.5 310.9H600.1c-1.1 0-2-.9-2-2s.9-2 2-2h215.5c1.1 0 2 .9 2 2s-1 2-2.1 2zM815.5 318.9H600.1c-1.1 0-2-.9-2-2s.9-2 2-2h215.5c1.1 0 2 .9 2 2s-1 2-2.1 2z" /><path class="st0" d="M817.6 326.7h-220c-1.1 0-2-.9-2-2 0-.3 0-.5.1-.7 2.5-6.9 2.5-14.4 0-21.2-.4-1 .1-2.2 1.1-2.6.2-.1.5-.1.7-.1h219.9c1.1 0 2 .9 2 2 0 .3 0 .5-.1.7-2.5 6.9-2.5 14.4 0 21.2.4 1-.1 2.2-1.1 2.6-.1.1-.4.1-.6.1zm-217.2-4h214.4c-1.7-6.1-1.7-12.6 0-18.7H600.4c1.7 6.1 1.7 12.6 0 18.7z" /><path transform="rotate(-6.686 1112.742 256.947)" style="fill:#ffa364" d="M1107.9 220.8h9.8v72.7h-9.8z" /><path transform="rotate(-6.686 1108.932 224.544)" class="st13" d="M1104.1 221.1h9.8v7.4h-9.8z" /><path class="st0" d="M1104.6 231c-1 0-1.9-.8-2-1.8l-.9-7.3c-.1-1.1.7-2.1 1.8-2.2l9.7-1.1c1.1-.1 2.1.7 2.2 1.8l.9 7.3c.1 1.1-.7 2.1-1.8 2.2l-9.7 1.1h-.2zm1.3-7.6.4 3.4 5.8-.7-.4-3.4-5.8.7z" /><path class="st0" d="M1112.2 295.8c-1 0-1.9-.8-2-1.8l-8.5-72.2c-.1-1.1.7-2.1 1.8-2.2l9.7-1.1c1.1-.1 2.1.7 2.2 1.8l8.5 72.2c.1 1.1-.7 2.1-1.8 2.2l-9.7 1.1h-.2zm-6.3-72.4 8 68.2 5.8-.7-8-68.2-5.8.7z" /><path transform="rotate(-83.794 1131.584 270.793)" style="fill:#ff5252" d="M1095.2 265.9h72.7v9.8h-72.7z" /><path class="st0" d="M1132.5 309.4h-.2l-9.8-1.1c-1.1-.1-1.9-1.1-1.8-2.2l7.8-72.2c.1-1.1 1.1-1.9 2.2-1.8l9.8 1.1c1.1.1 1.9 1.1 1.8 2.2l-7.9 72.2c-.1 1.1-.9 1.8-1.9 1.8zm-7.6-4.8 5.8.6 7.4-68.2-5.8-.6-7.4 68.2z" /><path transform="rotate(-83.794 1135.11 238.352)" class="st11" d="M1131.3 233.5h7.4v9.8h-7.4z" /><path class="st0" d="M1139.5 244.6h-.2l-9.8-1.1c-1.1-.1-1.9-1.1-1.8-2.2l.8-7.3c.1-1.1 1.1-1.9 2.2-1.8l9.8 1.1c1.1.1 1.9 1.1 1.8 2.2l-.8 7.3c-.1 1-1 1.8-2 1.8zm-7.5-4.9 5.8.6.4-3.4-5.8-.6-.4 3.4z" /><path class="st26" d="M1146.2 331H1107l-6.4-60.2h52z" /><path class="st26" d="m1100.6 270.8.1 1.1h39.7l-6.3 59.1h12.1l6.4-60.2z" /><path class="st0" d="M1146.2 333H1107c-1 0-1.9-.8-2-1.8l-6.4-60.2c-.1-1.1.7-2.1 1.8-2.2h52.2c1.1 0 2 .9 2 2v.2l-6.4 60.2c-.1 1-.9 1.8-2 1.8zm-37.4-4h35.7l6-56.2h-47.6l5.9 56.2z" /></g><path d="M984.7 88.4h78.2c4.8 0 8.6 3.9 8.6 8.6v37.8c0 4.8-3.9 8.6-8.6 8.6h-78.2c-4.8 0-8.6-3.9-8.6-8.6V97c0-4.7 3.9-8.6 8.6-8.6z" style="fill:#2fa9ed" /><path class="st28" d="M875.8 244.4H954M875.8 244.4H954" /><path class="st0" d="M1062.9 145h-78.2c-5.6 0-10.1-4.5-10.1-10.1V97c0-5.6 4.5-10.1 10.1-10.1h78.2c5.6 0 10.1 4.5 10.1 10.1v37.8c.1 5.7-4.5 10.2-10.1 10.2zm-78.1-55.1c-3.9 0-7.1 3.2-7.1 7.1v37.8c0 3.9 3.2 7.1 7.1 7.1h78.2c3.9 0 7.1-3.2 7.1-7.1V97c0-3.9-3.2-7.1-7.1-7.1h-78.2z" /><g class="st29"><path class="st4" d="M1059 104.2h-33.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h33.8c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z" /></g><g class="st29"><path class="st4" d="M1047.5 113.1h-22.4c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h22.4c.8 0 1.5.7 1.5 1.5s-.6 1.5-1.5 1.5z" /></g><path d="M1027.2 121.9h13.6c1.8 0 3.3 1.5 3.3 3.3 0 1.8-1.5 3.3-3.3 3.3h-13.6c-1.8 0-3.3-1.5-3.3-3.3 0-1.8 1.4-3.3 3.3-3.3z" style="opacity:.56;fill:#fff" /><path class="st4" d="M999.6 115.3c-3.5 0-6.3-2.8-6.3-6.3s2.8-6.3 6.3-6.3 6.3 2.8 6.3 6.3-2.8 6.3-6.3 6.3zm0-9.6c-1.8 0-3.3 1.5-3.3 3.3 0 1.8 1.5 3.3 3.3 3.3 1.8 0 3.3-1.5 3.3-3.3 0-1.8-1.4-3.3-3.3-3.3z" /><path class="st4" d="M1008.8 131.9h-17.9c-3.4 0-6.1-2.7-6.1-6.1v-20.9c0-3.4 2.7-6.1 6.1-6.1h17.9c3.4 0 6.1 2.7 6.1 6.1v20.9c.1 3.4-2.7 6.1-6.1 6.1zm-17.9-30.4c-1.7 0-3.1 1.4-3.1 3.1v20.9c0 1.7 1.4 3.1 3.1 3.1h17.9c1.7 0 3.1-1.4 3.1-3.1v-20.9c0-1.7-1.4-3.1-3.1-3.1h-17.9z" /><path class="st4" d="M1009 128c-.8 0-1.5-.7-1.5-1.5 0-4.2-3.4-7.6-7.6-7.6-4.2 0-7.6 3.4-7.6 7.6 0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-5.8 4.7-10.6 10.6-10.6 5.8 0 10.6 4.7 10.6 10.6 0 .8-.7 1.5-1.5 1.5z" /><path class="st0" d="M714.1 110.8h-78.2c-5.6 0-10.1-4.5-10.1-10.1V62.9c0-5.6 4.5-10.1 10.1-10.1h78.2c5.6 0 10.1 4.5 10.1 10.1v37.8c0 5.6-4.5 10.1-10.1 10.1z" /><path class="st1" d="M635.9 55.7c-3.9 0-7.1 3.2-7.1 7.1v37.8c0 3.9 3.2 7.1 7.1 7.1h78.2c3.9 0 7.1-3.2 7.1-7.1V62.9c0-3.9-3.2-7.1-7.1-7.1h-78.2z" /><path class="st0" d="M659 179.1h-78.2c-5.6 0-10.1-4.5-10.1-10.1v-37.8c0-5.6 4.5-10.1 10.1-10.1H659c5.6 0 10.1 4.5 10.1 10.1V169c0 5.5-4.5 10.1-10.1 10.1z" /><path class="st1" d="M580.9 124c-3.9 0-7.1 3.2-7.1 7.1v37.8c0 3.9 3.2 7.1 7.1 7.1H659c3.9 0 7.1-3.2 7.1-7.1v-37.8c0-3.9-3.2-7.1-7.1-7.1h-78.1z" /><path class="st28" d="M678.6 82.2h-26.8c-1.1 0-2-.9-2-2s.9-2 2-2h26.8c1.1 0 2 .9 2 2s-.9 2-2 2zM644.7 82.2h-7.1c-1.1 0-2-.9-2-2s.9-2 2-2h7.1c1.1 0 2 .9 2 2s-.9 2-2 2zM678.6 69.8h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2h13.4c1.1 0 2 .9 2 2s-.9 2-2 2zM658.5 69.8h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2zM712 82.2h-26.8c-1.1 0-2-.9-2-2s.9-2 2-2H712c1.1 0 2 .9 2 2s-.9 2-2 2zM689.8 69.8H686c-1 0-2-.7-2.1-1.7-.2-1.2.8-2.3 2-2.3h3.8c1 0 2 .7 2.1 1.7.2 1.2-.8 2.3-2 2.3zM712 69.8h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2H712c1.1 0 2 .9 2 2s-.9 2-2 2zM692.3 94.6h-54.8c-1.1 0-2-.9-2-2s.9-2 2-2h54.8c1.1 0 2 .9 2 2s-.9 2-2 2zM623.8 152H597c-1.1 0-2-.9-2-2s.9-2 2-2h26.8c1.1 0 2 .9 2 2s-.9 2-2 2zM589.8 152h-7.1c-1.1 0-2-.9-2-2s.9-2 2-2h7.1c1.1 0 2 .9 2 2s-.9 2-2 2zM623.8 139.6h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2h13.4c1.1 0 2 .9 2 2s-.9 2-2 2zM603.6 139.6h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2s-.9 2-2 2zM657.2 152h-26.8c-1.1 0-2-.9-2-2s.9-2 2-2h26.8c1.1 0 2 .9 2 2s-.9 2-2 2zM635 139.6h-3.8c-1 0-2-.7-2.1-1.7-.2-1.2.8-2.3 2-2.3h3.8c1 0 2 .7 2.1 1.7.1 1.2-.8 2.3-2 2.3zM657.2 139.6h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2h13.4c1.1 0 2 .9 2 2s-.9 2-2 2zM637.5 164.4h-54.8c-1.1 0-2-.9-2-2s.9-2 2-2h54.8c1.1 0 2 .9 2 2s-.9 2-2 2zM712 203.3h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2H712c1.1 0 2 .9 2 2s-.9 2-2 2zM651.3 213h-13.4c-1.1 0-2-.9-2-2s.9-2 2-2h13.4c1.1 0 2 .9 2 2s-.9 2-2 2zM642.2 231h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2s-.8 2-2 2zM645.3 221.7h-7.1c-1.1 0-2-.9-2-2s.9-2 2-2h7.1c1.1 0 2 .9 2 2s-.9 2-2 2zM689.3 203.3h-26.8c-1.1 0-2-.9-2-2s.9-2 2-2h26.8c1.1 0 2 .9 2 2s-.9 2-2 2zM652.5 203.3h-3.8c-1 0-2-.7-2.1-1.7-.2-1.2.8-2.3 2-2.3h3.8c1 0 2 .7 2.1 1.7.1 1.3-.8 2.3-2 2.3z" /><path class="st4" d="M1093.5 306.6h-46c-.5 0-1.1.2-1.5.5l-11.1 9.7c-.9.8-1 2.2-.2 3.2l.2.2 11.1 9.9c.4.4.9.6 1.5.7h46c2.6 0 4.8-2.4 4.8-5v-14.5c-.1-2.6-2.2-4.7-4.8-4.7zm-47.2 14.8c-1.6 0-2.8-1.3-2.8-2.8s1.3-2.8 2.8-2.8 2.8 1.3 2.8 2.8c0 1.5-1.3 2.8-2.8 2.8z" /><path style="fill:#f09f54" d="M1058.1 306.6h13.4v24.2h-13.4z" /><path style="fill:#ed8b3b" d="M1071.4 306.6h13.4v24.2h-13.4z" /><path d="M1084.8 306.6h7.6c3.2 0 5.7 2.6 5.7 5.7v12.5c0 3.3-2.7 6-6 6h-7.4v-24.2h.1z" style="fill:#ff6c37" /><path d="M1094.7 307.8H1048c-.5 0-1.1.2-1.5.5l-11.1 9.7c-.9.8-1 2.2-.2 3.2l.2.2 6.9 6.1 7.5 1.9c1.1.3 2.2.1 3.2-.4l40.9-20.9c.4-.1.6-.2.8-.3zm-47.8 14.7c-1.6 0-2.8-1.3-2.8-2.8s1.3-2.8 2.8-2.8 2.8 1.3 2.8 2.8c0 1.6-1.3 2.8-2.8 2.8z" style="opacity:.4;fill:#848484;enable-background:new" /><path class="st0" d="M1093.5 332h-46c-.8 0-1.6-.4-2.2-1l-11.1-9.9c-1.4-1.2-1.5-3.4-.3-4.8l.3-.3 11.1-9.7c.6-.5 1.4-.8 2.2-.8h46c3.2 0 5.9 2.6 5.9 5.8v14.5c0 3.3-2.8 6.2-5.9 6.2zm-46-24.3c-.3 0-.5.1-.7.3l-11.1 9.7c-.5.4-.5 1.1-.1 1.6l.1.1 11.1 9.9c.2.2.5.4.7.4h46c1.9 0 3.6-1.8 3.6-3.9v-14.5c0-2-1.6-3.6-3.6-3.5l-46-.1zm-1.2 14.8c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-5.6c-.9 0-1.7.8-1.7 1.7 0 .9.8 1.7 1.7 1.7s1.7-.8 1.7-1.7c0-1-.8-1.7-1.7-1.7z" /><path class="st0" d="M1071.4 332H1058c-.6 0-1.1-.5-1.1-1.1v-24.2c0-.6.5-1.1 1.1-1.1h13.4c.6 0 1.1.5 1.1 1.1v24.2c.1.6-.4 1.1-1.1 1.1zm-12.2-2.3h11.1v-22h-11.1v22z" /><path class="st0" d="M1084.8 332h-13.4c-.6 0-1.1-.5-1.1-1.1v-24.2c0-.6.5-1.1 1.1-1.1h13.4c.6 0 1.1.5 1.1 1.1v24.2c.1.6-.4 1.1-1.1 1.1zm-12.2-2.3h11.1v-22h-11.1v22z" /><path class="st0" d="M1092.3 332h-7.4c-.6 0-1.1-.5-1.1-1.1v-24.2c0-.6.5-1.1 1.1-1.1h7.6c3.8 0 6.9 3.1 6.9 6.9V325c0 3.8-3.2 7-7.1 7zm-6.3-2.3h6.3c2.7 0 4.8-2.2 4.8-4.8v-12.5c0-2.5-2.1-4.6-4.6-4.6h-6.5v21.9z" /><path class="st4" d="m1081.6 283.5-41 20.9c-.5.2-.9.7-1.1 1.2l-5.5 13.7c-.5 1.2.1 2.5 1.3 2.9.1 0 .2.1.3.1l14.3 3.6c.5.1 1.1.1 1.6-.2l41-20.9c2.3-1.2 3.2-4 2.1-6.3l-6.6-12.9c-1.3-2.3-4.1-3.3-6.4-2.1z" /><path transform="rotate(-27.031 1073.274 301.178)" style="fill:#8d91db" d="M1066.6 289.2h13.4v24h-13.4z" /><path class="st0" d="M1050.5 327.2c-.3 0-.6 0-.8-.1l-14.3-3.6c-1.8-.5-2.9-2.3-2.5-4.1 0-.1.1-.3.1-.4l5.5-13.7c.3-.8.9-1.4 1.6-1.8l41-20.9c2.9-1.5 6.4-.3 7.9 2.6l6.6 13c1.5 2.9.3 6.4-2.6 7.9l-41 20.9c-.4 0-1 .2-1.5.2zm31.6-42.7-41 20.9c-.2.1-.4.3-.5.6l-5.5 13.7c-.2.6.1 1.2.6 1.5h.1l14.3 3.6c.3.1.5 0 .8-.1l41-20.9c1.8-.9 2.5-3 1.6-4.8l-6.6-13c-.9-1.7-3-2.3-4.8-1.5z" /><circle class="st0" cx="1045" cy="315.6" r="3.3" /><path transform="rotate(-27.031 1061.348 307.263)" style="fill:#beccd5;stroke:#1f3969;stroke-width:4;stroke-linecap:round;stroke-linejoin:round" d="M1054.7 295.3h13.4v24h-13.4z" /><path class="st0" d="M1060.9 322.1c-.4 0-.8-.2-1-.6l-10.9-21.3c-.3-.6-.1-1.2.5-1.5l11.9-6.1c.6-.3 1.2-.1 1.5.5l10.9 21.4c.3.6.1 1.2-.5 1.5l-11.9 6.1h-.5zm-9.4-22 9.9 19.3 9.9-5-9.9-19.3-9.9 5z" /><path class="st0" d="M1072.8 316.1c-.1 0-.2 0-.4-.1-.3-.1-.5-.3-.7-.6l-10.9-21.4c-.3-.6-.1-1.2.5-1.5l11.9-6.1c.6-.3 1.2-.1 1.5.5l10.9 21.3c.3.6.1 1.2-.5 1.5l-11.9 6.1c0 .2-.2.3-.4.3zm-9.3-22 9.9 19.3 9.9-5-9.9-19.3-9.9 5z" /><path class="st26" d="m1073.9 287.5 6.8-3.5c2.8-1.4 6.2-.3 7.7 2.5l5.7 11.2c1.4 2.8.3 6.2-2.5 7.7l-6.8 3.5-10.9-21.4z" /><path class="st0" d="M1084.8 310c-.4 0-.8-.2-1-.6l-10.9-21.3c-.3-.6-.1-1.2.5-1.5l6.8-3.5c3.4-1.7 7.5-.4 9.2 3l5.7 11.2c1.7 3.4.4 7.5-3 9.2l-6.8 3.5c-.2-.1-.4 0-.5 0zm-9.4-22 9.9 19.3 5.8-3c2.2-1.1 3.1-3.9 2-6.1l-5.7-11.2c-1.1-2.2-3.9-3.1-6.1-2l-5.9 3zm16.2 17.3" /></symbol><symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" id="icon-logo"><style>#icon-logo .st1{fill:none;stroke:#fff;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}</style><g id="icon-logo_Layer_00000015325204808624835620000000159894358156766379_"><path id="icon-logo_Layer" d="M0 9.1c0-5 4-9 9-9h42c5 0 9 4 9 9v42c0 5-4 9-9 9H9c-5 0-9-4-9-9v-42z" style="fill:#10b981" /><path class="st1" d="m10.4 49.6 39.2-39.2" /></g><path class="st1" d="M21.9 43.7 8.1 30l13.7-13.7M38.1 16.3 51.8 30 38.1 43.7" /></symbol>',s.insertBefore(t,s.firstChild)};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",s):s()}O(P).use(Ws).mount("#app");export{ws as _,F as a,W as u};
