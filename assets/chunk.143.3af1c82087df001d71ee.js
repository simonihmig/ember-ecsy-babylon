var __ember_auto_import__;(()=>{var e,r,t,o,n,i={4209:(e,r,t)=>{var o,n
e.exports=(o=_eai_d,n=_eai_r,window.emberAutoImportDynamic=function(e){return 1===arguments.length?n("_eai_dyn_"+e):n("_eai_dynt_"+e)(Array.prototype.slice.call(arguments,1))},window.emberAutoImportSync=function(e){return n("_eai_sync_"+e)(Array.prototype.slice.call(arguments,1))},o("@babylonjs/core/Engines/engine",[],(function(){return t(6754)})),o("@babylonjs/core/Loading/sceneLoader",[],(function(){return t(9445)})),o("@babylonjs/core/Materials/Textures/cubeTexture",[],(function(){return t(4407)})),o("@babylonjs/core/Materials/Textures/hdrCubeTexture",[],(function(){return t(9087)})),o("@babylonjs/core/Materials/Textures/Loaders/envTextureLoader",[],(function(){return t(8551)})),o("@babylonjs/core/Materials/Textures/texture",[],(function(){return t(2443)})),o("@babylonjs/core/Maths/math.color",[],(function(){return t(5572)})),o("@babylonjs/core/Maths/math.vector",[],(function(){return t(443)})),o("@babylonjs/loaders/glTF/2.0/glTFLoader",[],(function(){return t(5648)})),o("@babylonjs/loaders/glTF/glTFFileLoader",[],(function(){return t(574)})),o("@glimmer/env",[],(function(){return t(7180)})),o("ecsy-babylon",[],(function(){return t(5382)})),o("ecsy-babylon/components",[],(function(){return t(918)})),o("ecsy-babylon/components/babylon-core",[],(function(){return t(1677)})),o("ecsy-babylon/components/parent",[],(function(){return t(2551)})),o("ecsy-babylon/world",[],(function(){return t(7245)})),o("ember-resources",[],(function(){return t(3432)})),o("_eai_dyn_@babylonjs/core/Debug/debugLayer",[],(function(){return t.e(693).then(t.bind(t,5693))})),void o("_eai_dyn_@babylonjs/inspector",[],(function(){return t.e(678).then(t.t.bind(t,4637,23))})))},7533:function(e,r){window._eai_r=require,window._eai_d=define},1292:e=>{"use strict"
e.exports=require("@ember/application")},3353:e=>{"use strict"
e.exports=require("@ember/debug")},9341:e=>{"use strict"
e.exports=require("@ember/destroyable")},6283:e=>{"use strict"
e.exports=require("@ember/helper")},7219:e=>{"use strict"
e.exports=require("@ember/object")},8773:e=>{"use strict"
e.exports=require("@ember/runloop")},7456:e=>{"use strict"
e.exports=require("@ember/test-waiters")},6173:e=>{"use strict"
e.exports=require("@glimmer/tracking/primitives/cache")}},a={}
function u(e){var r=a[e]
if(void 0!==r)return r.exports
var t=a[e]={exports:{}}
return i[e].call(t.exports,t,t.exports,u),t.exports}u.m=i,e=[],u.O=(r,t,o,n)=>{if(!t){var i=1/0
for(l=0;l<e.length;l++){for(var[t,o,n]=e[l],a=!0,s=0;s<t.length;s++)(!1&n||i>=n)&&Object.keys(u.O).every((e=>u.O[e](t[s])))?t.splice(s--,1):(a=!1,n<i&&(i=n))
if(a){e.splice(l--,1)
var c=o()
void 0!==c&&(r=c)}}return r}n=n||0
for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1]
e[l]=[t,o,n]},t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,u.t=function(e,o){if(1&o&&(e=this(e)),8&o)return e
if("object"==typeof e&&e){if(4&o&&e.__esModule)return e
if(16&o&&"function"==typeof e.then)return e}var n=Object.create(null)
u.r(n)
var i={}
r=r||[null,t({}),t([]),t(t)]
for(var a=2&o&&e;"object"==typeof a&&!~r.indexOf(a);a=t(a))Object.getOwnPropertyNames(a).forEach((r=>i[r]=()=>e[r]))
return i.default=()=>e,u.d(n,i),n},u.d=(e,r)=>{for(var t in r)u.o(r,t)&&!u.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:r[t]})},u.f={},u.e=e=>Promise.all(Object.keys(u.f).reduce(((r,t)=>(u.f[t](e,r),r)),[])),u.u=e=>"chunk."+e+"."+{678:"5bc8ef06d6f1a3b7681c",693:"77e54a850a1ec05bdb05"}[e]+".js",u.miniCssF=e=>{},u.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),o={},n="__ember_auto_import__:",u.l=(e,r,t,i)=>{if(o[e])o[e].push(r)
else{var a,s
if(void 0!==t)for(var c=document.getElementsByTagName("script"),l=0;l<c.length;l++){var b=c[l]
if(b.getAttribute("src")==e||b.getAttribute("data-webpack")==n+t){a=b
break}}a||(s=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,u.nc&&a.setAttribute("nonce",u.nc),a.setAttribute("data-webpack",n+t),a.src=e),o[e]=[r]
var d=(r,t)=>{a.onerror=a.onload=null,clearTimeout(f)
var n=o[e]
if(delete o[e],a.parentNode&&a.parentNode.removeChild(a),n&&n.forEach((e=>e(t))),r)return r(t)},f=setTimeout(d.bind(null,void 0,{type:"timeout",target:a}),12e4)
a.onerror=d.bind(null,a.onerror),a.onload=d.bind(null,a.onload),s&&document.head.appendChild(a)}},u.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.p="/ember-ecsy-babylon/assets/",(()=>{var e={143:0}
u.f.j=(r,t)=>{var o=u.o(e,r)?e[r]:void 0
if(0!==o)if(o)t.push(o[2])
else{var n=new Promise(((t,n)=>o=e[r]=[t,n]))
t.push(o[2]=n)
var i=u.p+u.u(r),a=new Error
u.l(i,(t=>{if(u.o(e,r)&&(0!==(o=e[r])&&(e[r]=void 0),o)){var n=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src
a.message="Loading chunk "+r+" failed.\n("+n+": "+i+")",a.name="ChunkLoadError",a.type=n,a.request=i,o[1](a)}}),"chunk-"+r,r)}},u.O.j=r=>0===e[r]
var r=(r,t)=>{var o,n,[i,a,s]=t,c=0
if(i.some((r=>0!==e[r]))){for(o in a)u.o(a,o)&&(u.m[o]=a[o])
if(s)var l=s(u)}for(r&&r(t);c<i.length;c++)n=i[c],u.o(e,n)&&e[n]&&e[n][0](),e[n]=0
return u.O(l)},t=globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]
t.forEach(r.bind(null,0)),t.push=r.bind(null,t.push.bind(t))})(),u.O(void 0,[407],(()=>u(7533)))
var s=u.O(void 0,[407],(()=>u(4209)))
s=u.O(s),__ember_auto_import__=s})()
