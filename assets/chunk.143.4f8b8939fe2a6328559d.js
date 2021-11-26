var __ember_auto_import__;(()=>{var e,r,t,n,o,a={6939:(e,r,t)=>{var n,o
e.exports=(n=_eai_d,o=_eai_r,window.emberAutoImportDynamic=function(e){return 1===arguments.length?o("_eai_dyn_"+e):o("_eai_dynt_"+e)(Array.prototype.slice.call(arguments,1))},window.emberAutoImportSync=function(e){return o("_eai_sync_"+e)(Array.prototype.slice.call(arguments,1))},n("@babylonjs/core/Engines/engine",[],(function(){return t(8663)})),n("@babylonjs/core/Loading/sceneLoader",[],(function(){return t(5954)})),n("@babylonjs/core/Materials/Textures/cubeTexture",[],(function(){return t(5770)})),n("@babylonjs/core/Materials/Textures/hdrCubeTexture",[],(function(){return t(4351)})),n("@babylonjs/core/Materials/Textures/Loaders/envTextureLoader",[],(function(){return t(5212)})),n("@babylonjs/core/Materials/Textures/texture",[],(function(){return t(7738)})),n("@babylonjs/core/Maths/math.color",[],(function(){return t(7341)})),n("@babylonjs/core/Maths/math.vector",[],(function(){return t(7266)})),n("@babylonjs/loaders/glTF/2.0/glTFLoader",[],(function(){return t(1749)})),n("@babylonjs/loaders/glTF/glTFFileLoader",[],(function(){return t(3236)})),n("@glimmer/env",[],(function(){return t(7180)})),n("ecsy-babylon",[],(function(){return t(5382)})),n("ecsy-babylon/components",[],(function(){return t(918)})),n("ecsy-babylon/components/babylon-core",[],(function(){return t(1677)})),n("ecsy-babylon/components/parent",[],(function(){return t(4751)})),n("ecsy-babylon/world",[],(function(){return t(7245)})),n("_eai_dyn_@babylonjs/core/Debug/debugLayer",[],(function(){return t.e(935).then(t.bind(t,5935))})),void n("_eai_dyn_@babylonjs/inspector",[],(function(){return t.e(610).then(t.t.bind(t,7610,23))})))},4649:function(e,r){window._eai_r=require,window._eai_d=define}},i={}
function u(e){var r=i[e]
if(void 0!==r)return r.exports
var t=i[e]={exports:{}}
return a[e].call(t.exports,t,t.exports,u),t.exports}u.m=a,e=[],u.O=(r,t,n,o)=>{if(!t){var a=1/0
for(b=0;b<e.length;b++){for(var[t,n,o]=e[b],i=!0,c=0;c<t.length;c++)(!1&o||a>=o)&&Object.keys(u.O).every((e=>u.O[e](t[c])))?t.splice(c--,1):(i=!1,o<a&&(a=o))
if(i){e.splice(b--,1)
var l=n()
void 0!==l&&(r=l)}}return r}o=o||0
for(var b=e.length;b>0&&e[b-1][2]>o;b--)e[b]=e[b-1]
e[b]=[t,n,o]},t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,u.t=function(e,n){if(1&n&&(e=this(e)),8&n)return e
if("object"==typeof e&&e){if(4&n&&e.__esModule)return e
if(16&n&&"function"==typeof e.then)return e}var o=Object.create(null)
u.r(o)
var a={}
r=r||[null,t({}),t([]),t(t)]
for(var i=2&n&&e;"object"==typeof i&&!~r.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach((r=>a[r]=()=>e[r]))
return a.default=()=>e,u.d(o,a),o},u.d=(e,r)=>{for(var t in r)u.o(r,t)&&!u.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},u.f={},u.e=e=>Promise.all(Object.keys(u.f).reduce(((r,t)=>(u.f[t](e,r),r)),[])),u.u=e=>"chunk."+e+"."+{610:"311d62327eda74c90b0b",935:"10d4fa5ae2dd147af535"}[e]+".js",u.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),n={},o="__ember_auto_import__:",u.l=(e,r,t,a)=>{if(n[e])n[e].push(r)
else{var i,c
if(void 0!==t)for(var l=document.getElementsByTagName("script"),b=0;b<l.length;b++){var s=l[b]
if(s.getAttribute("src")==e||s.getAttribute("data-webpack")==o+t){i=s
break}}i||(c=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.setAttribute("data-webpack",o+t),i.src=e),n[e]=[r]
var d=(r,t)=>{i.onerror=i.onload=null,clearTimeout(f)
var o=n[e]
if(delete n[e],i.parentNode&&i.parentNode.removeChild(i),o&&o.forEach((e=>e(t))),r)return r(t)},f=setTimeout(d.bind(null,void 0,{type:"timeout",target:i}),12e4)
i.onerror=d.bind(null,i.onerror),i.onload=d.bind(null,i.onload),c&&document.head.appendChild(i)}},u.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.p="/ember-ecsy-babylon/assets/",(()=>{var e={143:0}
u.f.j=(r,t)=>{var n=u.o(e,r)?e[r]:void 0
if(0!==n)if(n)t.push(n[2])
else{var o=new Promise(((t,o)=>n=e[r]=[t,o]))
t.push(n[2]=o)
var a=u.p+u.u(r),i=new Error
u.l(a,(t=>{if(u.o(e,r)&&(0!==(n=e[r])&&(e[r]=void 0),n)){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src
i.message="Loading chunk "+r+" failed.\n("+o+": "+a+")",i.name="ChunkLoadError",i.type=o,i.request=a,n[1](i)}}),"chunk-"+r,r)}},u.O.j=r=>0===e[r]
var r=(r,t)=>{var n,o,[a,i,c]=t,l=0
if(a.some((r=>0!==e[r]))){for(n in i)u.o(i,n)&&(u.m[n]=i[n])
if(c)var b=c(u)}for(r&&r(t);l<a.length;l++)o=a[l],u.o(e,o)&&e[o]&&e[o][0](),e[a[l]]=0
return u.O(b)},t=globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]
t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),u.O(void 0,[606],(()=>u(4649)))
var c=u.O(void 0,[606],(()=>u(6939)))
c=u.O(c),__ember_auto_import__=c})()
