#!/usr/bin/env node
"use strict";var On=Object.create;var je=Object.defineProperty;var Gn=Object.getOwnPropertyDescriptor;var Rn=Object.getOwnPropertyNames;var kn=Object.getPrototypeOf,$n=Object.prototype.hasOwnProperty;var m=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var jn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Rn(t))!$n.call(e,o)&&o!==n&&je(e,o,{get:()=>t[o],enumerable:!(r=Gn(t,o))||r.enumerable});return e};var y=(e,t,n)=>(n=e!=null?On(kn(e)):{},jn(t||!e||!e.__esModule?je(n,"default",{value:e,enumerable:!0}):n,e));var Fe=m((ho,Ue)=>{Ue.exports=Le;Le.sync=Nn;var Be=require("fs");function Bn(e,t){var n=t.pathExt!==void 0?t.pathExt:process.env.PATHEXT;if(!n||(n=n.split(";"),n.indexOf("")!==-1))return!0;for(var r=0;r<n.length;r++){var o=n[r].toLowerCase();if(o&&e.substr(-o.length).toLowerCase()===o)return!0}return!1}function Ne(e,t,n){return!e.isSymbolicLink()&&!e.isFile()?!1:Bn(t,n)}function Le(e,t,n){Be.stat(e,function(r,o){n(r,r?!1:Ne(o,e,t))})}function Nn(e,t){return Ne(Be.statSync(e),e,t)}});var qe=m((yo,ze)=>{ze.exports=_e;_e.sync=Ln;var Me=require("fs");function _e(e,t,n){Me.stat(e,function(r,o){n(r,r?!1:De(o,t))})}function Ln(e,t){return De(Me.statSync(e),t)}function De(e,t){return e.isFile()&&Un(e,t)}function Un(e,t){var n=e.mode,r=e.uid,o=e.gid,i=t.uid!==void 0?t.uid:process.getuid&&process.getuid(),s=t.gid!==void 0?t.gid:process.getgid&&process.getgid(),a=parseInt("100",8),c=parseInt("010",8),u=parseInt("001",8),l=a|c,d=n&u||n&c&&o===s||n&a&&r===i||n&l&&i===0;return d}});var We=m((bo,He)=>{var go=require("fs"),$;process.platform==="win32"||global.TESTING_WINDOWS?$=Fe():$=qe();He.exports=V;V.sync=Fn;function V(e,t,n){if(typeof t=="function"&&(n=t,t={}),!n){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(r,o){V(e,t||{},function(i,s){i?o(i):r(s)})})}$(e,t||{},function(r,o){r&&(r.code==="EACCES"||t&&t.ignoreErrors)&&(r=null,o=!1),n(r,o)})}function Fn(e,t){try{return $.sync(e,t||{})}catch(n){if(t&&t.ignoreErrors||n.code==="EACCES")return!1;throw n}}});var Je=m((So,Qe)=>{var w=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys",Ke=require("path"),Mn=w?";":":",Xe=We(),Ve=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),Ye=(e,t)=>{let n=t.colon||Mn,r=e.match(/\//)||w&&e.match(/\\/)?[""]:[...w?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(n)],o=w?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",i=w?o.split(n):[""];return w&&e.indexOf(".")!==-1&&i[0]!==""&&i.unshift(""),{pathEnv:r,pathExt:i,pathExtExe:o}},Ze=(e,t,n)=>{typeof t=="function"&&(n=t,t={}),t||(t={});let{pathEnv:r,pathExt:o,pathExtExe:i}=Ye(e,t),s=[],a=u=>new Promise((l,d)=>{if(u===r.length)return t.all&&s.length?l(s):d(Ve(e));let f=r[u],h=/^".*"$/.test(f)?f.slice(1,-1):f,p=Ke.join(h,e),g=!h&&/^\.[\\\/]/.test(e)?e.slice(0,2)+p:p;l(c(g,u,0))}),c=(u,l,d)=>new Promise((f,h)=>{if(d===o.length)return f(a(l+1));let p=o[d];Xe(u+p,{pathExt:i},(g,x)=>{if(!g&&x)if(t.all)s.push(u+p);else return f(u+p);return f(c(u,l,d+1))})});return n?a(0).then(u=>n(null,u),n):a(0)},_n=(e,t)=>{t=t||{};let{pathEnv:n,pathExt:r,pathExtExe:o}=Ye(e,t),i=[];for(let s=0;s<n.length;s++){let a=n[s],c=/^".*"$/.test(a)?a.slice(1,-1):a,u=Ke.join(c,e),l=!c&&/^\.[\\\/]/.test(e)?e.slice(0,2)+u:u;for(let d=0;d<r.length;d++){let f=l+r[d];try{if(Xe.sync(f,{pathExt:o}))if(t.all)i.push(f);else return f}catch{}}}if(t.all&&i.length)return i;if(t.nothrow)return null;throw Ve(e)};Qe.exports=Ze;Ze.sync=_n});var tt=m((xo,Y)=>{"use strict";var et=(e={})=>{let t=e.env||process.env;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(t).reverse().find(r=>r.toUpperCase()==="PATH")||"Path"};Y.exports=et;Y.exports.default=et});var it=m((wo,ot)=>{"use strict";var nt=require("path"),Dn=Je(),zn=tt();function rt(e,t){let n=e.options.env||process.env,r=process.cwd(),o=e.options.cwd!=null,i=o&&process.chdir!==void 0&&!process.chdir.disabled;if(i)try{process.chdir(e.options.cwd)}catch{}let s;try{s=Dn.sync(e.command,{path:n[zn({env:n})],pathExt:t?nt.delimiter:void 0})}catch{}finally{i&&process.chdir(r)}return s&&(s=nt.resolve(o?e.options.cwd:"",s)),s}function qn(e){return rt(e)||rt(e,!0)}ot.exports=qn});var st=m((Eo,Q)=>{"use strict";var Z=/([()\][%!^"`<>&|;, *?])/g;function Hn(e){return e=e.replace(Z,"^$1"),e}function Wn(e,t){return e=`${e}`,e=e.replace(/(\\*)"/g,'$1$1\\"'),e=e.replace(/(\\*)$/,"$1$1"),e=`"${e}"`,e=e.replace(Z,"^$1"),t&&(e=e.replace(Z,"^$1")),e}Q.exports.command=Hn;Q.exports.argument=Wn});var ct=m((To,at)=>{"use strict";at.exports=/^#!(.*)/});var lt=m((Po,ut)=>{"use strict";var Kn=ct();ut.exports=(e="")=>{let t=e.match(Kn);if(!t)return null;let[n,r]=t[0].replace(/#! ?/,"").split(" "),o=n.split("/").pop();return o==="env"?r:r?`${o} ${r}`:o}});var dt=m((Co,ft)=>{"use strict";var J=require("fs"),Xn=lt();function Vn(e){let n=Buffer.alloc(150),r;try{r=J.openSync(e,"r"),J.readSync(r,n,0,150,0),J.closeSync(r)}catch{}return Xn(n.toString())}ft.exports=Vn});var yt=m((Ao,ht)=>{"use strict";var Yn=require("path"),pt=it(),mt=st(),Zn=dt(),Qn=process.platform==="win32",Jn=/\.(?:com|exe)$/i,er=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function tr(e){e.file=pt(e);let t=e.file&&Zn(e.file);return t?(e.args.unshift(e.file),e.command=t,pt(e)):e.file}function nr(e){if(!Qn)return e;let t=tr(e),n=!Jn.test(t);if(e.options.forceShell||n){let r=er.test(t);e.command=Yn.normalize(e.command),e.command=mt.command(e.command),e.args=e.args.map(i=>mt.argument(i,r));let o=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${o}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function rr(e,t,n){t&&!Array.isArray(t)&&(n=t,t=null),t=t?t.slice(0):[],n=Object.assign({},n);let r={command:e,args:t,options:n,file:void 0,original:{command:e,args:t}};return n.shell?r:nr(r)}ht.exports=rr});var St=m((Io,bt)=>{"use strict";var ee=process.platform==="win32";function te(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function or(e,t){if(!ee)return;let n=e.emit;e.emit=function(r,o){if(r==="exit"){let i=gt(o,t,"spawn");if(i)return n.call(e,"error",i)}return n.apply(e,arguments)}}function gt(e,t){return ee&&e===1&&!t.file?te(t.original,"spawn"):null}function ir(e,t){return ee&&e===1&&!t.file?te(t.original,"spawnSync"):null}bt.exports={hookChildProcess:or,verifyENOENT:gt,verifyENOENTSync:ir,notFoundError:te}});var Et=m((vo,E)=>{"use strict";var xt=require("child_process"),ne=yt(),re=St();function wt(e,t,n){let r=ne(e,t,n),o=xt.spawn(r.command,r.args,r.options);return re.hookChildProcess(o,r),o}function sr(e,t,n){let r=ne(e,t,n),o=xt.spawnSync(r.command,r.args,r.options);return o.error=o.error||re.verifyENOENTSync(o.status,r),o}E.exports=wt;E.exports.spawn=wt;E.exports.sync=sr;E.exports._parse=ne;E.exports._enoent=re});var tn=m((Ti,en)=>{"use strict";var{PassThrough:Yr}=require("stream");en.exports=function(){var e=[],t=new Yr({objectMode:!0});return t.setMaxListeners(0),t.add=n,t.isEmpty=r,t.on("unpipe",o),Array.prototype.slice.call(arguments).forEach(n),t;function n(i){return Array.isArray(i)?(i.forEach(n),this):(e.push(i),i.once("end",o.bind(null,i)),i.once("error",t.emit.bind(t,"error")),i.pipe(t,{end:!1}),this)}function r(){return e.length==0}function o(i){e=e.filter(function(s){return s!==i}),!e.length&&t.readable&&t.end()}}});var X=y(require("node:console"),1),P=require("node:fs/promises"),In=require("node:os"),b=require("node:path"),Oe=y(require("node:process"),1),vn=require("node:util");var xn=require("node:buffer"),wn=y(require("node:path"),1),K=y(require("node:child_process"),1),v=y(require("node:process"),1),En=y(Et(),1);function oe(e){let t=typeof e=="string"?`
`:10,n=typeof e=="string"?"\r":13;return e[e.length-1]===t&&(e=e.slice(0,-1)),e[e.length-1]===n&&(e=e.slice(0,-1)),e}var C=y(require("node:process"),1),T=y(require("node:path"),1),ie=y(require("node:url"),1);function j(e={}){let{env:t=process.env,platform:n=process.platform}=e;return n!=="win32"?"PATH":Object.keys(t).reverse().find(r=>r.toUpperCase()==="PATH")||"Path"}function ar(e={}){let{cwd:t=C.default.cwd(),path:n=C.default.env[j()],execPath:r=C.default.execPath}=e,o,i=r instanceof URL?ie.default.fileURLToPath(r):r,s=t instanceof URL?ie.default.fileURLToPath(t):t,a=T.default.resolve(s),c=[];for(;o!==a;)c.push(T.default.join(a,"node_modules/.bin")),o=a,a=T.default.resolve(a,"..");return c.push(T.default.resolve(s,i,"..")),[...c,n].join(T.default.delimiter)}function Tt({env:e=C.default.env,...t}={}){e={...e};let n=j({env:e});return t.path=e[n],e[n]=ar(t),e}var cr=(e,t,n,r)=>{if(n==="length"||n==="prototype"||n==="arguments"||n==="caller")return;let o=Object.getOwnPropertyDescriptor(e,n),i=Object.getOwnPropertyDescriptor(t,n);!ur(o,i)&&r||Object.defineProperty(e,n,i)},ur=function(e,t){return e===void 0||e.configurable||e.writable===t.writable&&e.enumerable===t.enumerable&&e.configurable===t.configurable&&(e.writable||e.value===t.value)},lr=(e,t)=>{let n=Object.getPrototypeOf(t);n!==Object.getPrototypeOf(e)&&Object.setPrototypeOf(e,n)},fr=(e,t)=>`/* Wrapped ${e}*/
${t}`,dr=Object.getOwnPropertyDescriptor(Function.prototype,"toString"),pr=Object.getOwnPropertyDescriptor(Function.prototype.toString,"name"),mr=(e,t,n)=>{let r=n===""?"":`with ${n.trim()}() `,o=fr.bind(null,r,t.toString());Object.defineProperty(o,"name",pr),Object.defineProperty(e,"toString",{...dr,value:o})};function se(e,t,{ignoreNonConfigurable:n=!1}={}){let{name:r}=e;for(let o of Reflect.ownKeys(t))cr(e,t,o,n);return lr(e,t),mr(e,t,r),e}var B=new WeakMap,Pt=(e,t={})=>{if(typeof e!="function")throw new TypeError("Expected a function");let n,r=0,o=e.displayName||e.name||"<anonymous>",i=function(...s){if(B.set(i,++r),r===1)n=e.apply(this,s),e=null;else if(t.throw===!0)throw new Error(`Function \`${o}\` can only be called once`);return n};return se(i,e),B.set(i,r),i};Pt.callCount=e=>{if(!B.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return B.get(e)};var Ct=Pt;var $t=y(require("node:process"),1);var Rt=require("node:os");var At=()=>{let e=vt-It+1;return Array.from({length:e},hr)},hr=(e,t)=>({name:`SIGRT${t+1}`,number:It+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}),It=34,vt=64;var Gt=require("node:os");var Ot=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}];var ae=()=>{let e=At();return[...Ot,...e].map(yr)},yr=({name:e,number:t,description:n,action:r,forced:o=!1,standard:i})=>{let{signals:{[e]:s}}=Gt.constants,a=s!==void 0;return{name:e,number:a?s:t,description:n,supported:a,action:r,forced:o,standard:i}};var gr=()=>{let e=ae();return Object.fromEntries(e.map(br))},br=({name:e,number:t,description:n,supported:r,action:o,forced:i,standard:s})=>[e,{name:e,number:t,description:n,supported:r,action:o,forced:i,standard:s}],kt=gr(),Sr=()=>{let e=ae(),t=65,n=Array.from({length:t},(r,o)=>xr(o,e));return Object.assign({},...n)},xr=(e,t)=>{let n=wr(e,t);if(n===void 0)return{};let{name:r,description:o,supported:i,action:s,forced:a,standard:c}=n;return{[e]:{name:r,number:e,description:o,supported:i,action:s,forced:a,standard:c}}},wr=(e,t)=>{let n=t.find(({name:r})=>Rt.constants.signals[r]===e);return n!==void 0?n:t.find(r=>r.number===e)},Do=Sr();var Er=({timedOut:e,timeout:t,errorCode:n,signal:r,signalDescription:o,exitCode:i,isCanceled:s})=>e?`timed out after ${t} milliseconds`:s?"was canceled":n!==void 0?`failed with ${n}`:r!==void 0?`was killed with ${r} (${o})`:i!==void 0?`failed with exit code ${i}`:"failed",A=({stdout:e,stderr:t,all:n,error:r,signal:o,exitCode:i,command:s,escapedCommand:a,timedOut:c,isCanceled:u,killed:l,parsed:{options:{timeout:d,cwd:f=$t.default.cwd()}}})=>{i=i===null?void 0:i,o=o===null?void 0:o;let h=o===void 0?void 0:kt[o].description,p=r&&r.code,x=`Command ${Er({timedOut:c,timeout:d,errorCode:p,signal:o,signalDescription:h,exitCode:i,isCanceled:u})}: ${s}`,G=Object.prototype.toString.call(r)==="[object Error]",R=G?`${x}
${r.message}`:x,k=[R,t,e].filter(Boolean).join(`
`);return G?(r.originalMessage=r.message,r.message=k):r=new Error(k),r.shortMessage=R,r.command=s,r.escapedCommand=a,r.exitCode=i,r.signal=o,r.signalDescription=h,r.stdout=e,r.stderr=t,r.cwd=f,n!==void 0&&(r.all=n),"bufferedData"in r&&delete r.bufferedData,r.failed=!0,r.timedOut=!!c,r.isCanceled=u,r.killed=l&&!c,r};var N=["stdin","stdout","stderr"],Tr=e=>N.some(t=>e[t]!==void 0),jt=e=>{if(!e)return;let{stdio:t}=e;if(t===void 0)return N.map(r=>e[r]);if(Tr(e))throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${N.map(r=>`\`${r}\``).join(", ")}`);if(typeof t=="string")return t;if(!Array.isArray(t))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);let n=Math.max(t.length,N.length);return Array.from({length:n},(r,o)=>t[o])};var Nt=y(require("node:os"),1);var S=[];S.push("SIGHUP","SIGINT","SIGTERM");process.platform!=="win32"&&S.push("SIGALRM","SIGABRT","SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&S.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT");var L=e=>!!e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function",ce=Symbol.for("signal-exit emitter"),ue=globalThis,Pr=Object.defineProperty.bind(Object),le=class{emitted={afterExit:!1,exit:!1};listeners={afterExit:[],exit:[]};count=0;id=Math.random();constructor(){if(ue[ce])return ue[ce];Pr(ue,ce,{value:this,writable:!1,enumerable:!1,configurable:!1})}on(t,n){this.listeners[t].push(n)}removeListener(t,n){let r=this.listeners[t],o=r.indexOf(n);o!==-1&&(o===0&&r.length===1?r.length=0:r.splice(o,1))}emit(t,n,r){if(this.emitted[t])return!1;this.emitted[t]=!0;let o=!1;for(let i of this.listeners[t])o=i(n,r)===!0||o;return t==="exit"&&(o=this.emit("afterExit",n,r)||o),o}},U=class{},Cr=e=>({onExit(t,n){return e.onExit(t,n)},load(){return e.load()},unload(){return e.unload()}}),fe=class extends U{onExit(){return()=>{}}load(){}unload(){}},de=class extends U{#s=pe.platform==="win32"?"SIGINT":"SIGHUP";#t=new le;#e;#o;#i;#r={};#n=!1;constructor(t){super(),this.#e=t,this.#r={};for(let n of S)this.#r[n]=()=>{let r=this.#e.listeners(n),{count:o}=this.#t,i=t;if(typeof i.__signal_exit_emitter__=="object"&&typeof i.__signal_exit_emitter__.count=="number"&&(o+=i.__signal_exit_emitter__.count),r.length===o){this.unload();let s=this.#t.emit("exit",null,n),a=n==="SIGHUP"?this.#s:n;s||t.kill(t.pid,a)}};this.#i=t.reallyExit,this.#o=t.emit}onExit(t,n){if(!L(this.#e))return()=>{};this.#n===!1&&this.load();let r=n?.alwaysLast?"afterExit":"exit";return this.#t.on(r,t),()=>{this.#t.removeListener(r,t),this.#t.listeners.exit.length===0&&this.#t.listeners.afterExit.length===0&&this.unload()}}load(){if(!this.#n){this.#n=!0,this.#t.count+=1;for(let t of S)try{let n=this.#r[t];n&&this.#e.on(t,n)}catch{}this.#e.emit=(t,...n)=>this.#c(t,...n),this.#e.reallyExit=t=>this.#a(t)}}unload(){this.#n&&(this.#n=!1,S.forEach(t=>{let n=this.#r[t];if(!n)throw new Error("Listener not defined for signal: "+t);try{this.#e.removeListener(t,n)}catch{}}),this.#e.emit=this.#o,this.#e.reallyExit=this.#i,this.#t.count-=1)}#a(t){return L(this.#e)?(this.#e.exitCode=t||0,this.#t.emit("exit",this.#e.exitCode,null),this.#i.call(this.#e,this.#e.exitCode)):0}#c(t,...n){let r=this.#o;if(t==="exit"&&L(this.#e)){typeof n[0]=="number"&&(this.#e.exitCode=n[0]);let o=r.call(this.#e,t,...n);return this.#t.emit("exit",this.#e.exitCode,null),o}else return r.call(this.#e,t,...n)}},pe=globalThis.process,{onExit:Bt,load:Vo,unload:Yo}=Cr(L(pe)?new de(pe):new fe);var Ar=1e3*5,Lt=(e,t="SIGTERM",n={})=>{let r=e(t);return Ir(e,t,n,r),r},Ir=(e,t,n,r)=>{if(!vr(t,n,r))return;let o=Gr(n),i=setTimeout(()=>{e("SIGKILL")},o);i.unref&&i.unref()},vr=(e,{forceKillAfterTimeout:t},n)=>Or(e)&&t!==!1&&n,Or=e=>e===Nt.default.constants.signals.SIGTERM||typeof e=="string"&&e.toUpperCase()==="SIGTERM",Gr=({forceKillAfterTimeout:e=!0})=>{if(e===!0)return Ar;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e},Ut=(e,t)=>{e.kill()&&(t.isCanceled=!0)},Rr=(e,t,n)=>{e.kill(t),n(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))},Ft=(e,{timeout:t,killSignal:n="SIGTERM"},r)=>{if(t===0||t===void 0)return r;let o,i=new Promise((a,c)=>{o=setTimeout(()=>{Rr(e,n,c)},t)}),s=r.finally(()=>{clearTimeout(o)});return Promise.race([i,s])},Mt=({timeout:e})=>{if(e!==void 0&&(!Number.isFinite(e)||e<0))throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`)},_t=async(e,{cleanup:t,detached:n},r)=>{if(!t||n)return r;let o=Bt(()=>{e.kill()});return r.finally(()=>{o()})};var Dt=require("node:fs"),zt=require("node:child_process");function F(e){return e!==null&&typeof e=="object"&&typeof e.pipe=="function"}function me(e){return F(e)&&e.writable!==!1&&typeof e._write=="function"&&typeof e._writableState=="object"}var kr=e=>e instanceof zt.ChildProcess&&typeof e.then=="function",he=(e,t,n)=>{if(typeof n=="string")return e[t].pipe((0,Dt.createWriteStream)(n)),e;if(me(n))return e[t].pipe(n),e;if(!kr(n))throw new TypeError("The second argument must be a string, a stream or an Execa child process.");if(!me(n.stdin))throw new TypeError("The target child process's stdin must be available.");return e[t].pipe(n.stdin),n},qt=e=>{e.stdout!==null&&(e.pipeStdout=he.bind(void 0,e,"stdout")),e.stderr!==null&&(e.pipeStderr=he.bind(void 0,e,"stderr")),e.all!==void 0&&(e.pipeAll=he.bind(void 0,e,"all"))};var H=require("node:fs"),nn=require("node:timers/promises");var I=async(e,{init:t,convertChunk:n,getSize:r,truncateChunk:o,addChunk:i,getFinalChunk:s,finalize:a},{maxBuffer:c=Number.POSITIVE_INFINITY}={})=>{if(!jr(e))throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");let u=t();u.length=0;try{for await(let l of e){let d=Br(l),f=n[d](l,u);Kt({convertedChunk:f,state:u,getSize:r,truncateChunk:o,addChunk:i,maxBuffer:c})}return $r({state:u,convertChunk:n,getSize:r,truncateChunk:o,addChunk:i,getFinalChunk:s,maxBuffer:c}),a(u)}catch(l){throw l.bufferedData=a(u),l}},$r=({state:e,getSize:t,truncateChunk:n,addChunk:r,getFinalChunk:o,maxBuffer:i})=>{let s=o(e);s!==void 0&&Kt({convertedChunk:s,state:e,getSize:t,truncateChunk:n,addChunk:r,maxBuffer:i})},Kt=({convertedChunk:e,state:t,getSize:n,truncateChunk:r,addChunk:o,maxBuffer:i})=>{let s=n(e),a=t.length+s;if(a<=i){Ht(e,t,o,a);return}let c=r(e,i-t.length);throw c!==void 0&&Ht(c,t,o,i),new M},Ht=(e,t,n,r)=>{t.contents=n(e,t,r),t.length=r},jr=e=>typeof e=="object"&&e!==null&&typeof e[Symbol.asyncIterator]=="function",Br=e=>{let t=typeof e;if(t==="string")return"string";if(t!=="object"||e===null)return"others";if(globalThis.Buffer?.isBuffer(e))return"buffer";let n=Wt.call(e);return n==="[object ArrayBuffer]"?"arrayBuffer":n==="[object DataView]"?"dataView":Number.isInteger(e.byteLength)&&Number.isInteger(e.byteOffset)&&Wt.call(e.buffer)==="[object ArrayBuffer]"?"typedArray":"others"},{toString:Wt}=Object.prototype,M=class extends Error{name="MaxBufferError";constructor(){super("maxBuffer exceeded")}};var ye=e=>e,ge=()=>{},be=({contents:e})=>e,_=e=>{throw new Error(`Streams in object mode are not supported: ${String(e)}`)},D=e=>e.length;async function Se(e,t){return I(e,qr,t)}var Nr=()=>({contents:new ArrayBuffer(0)}),Lr=e=>Ur.encode(e),Ur=new TextEncoder,Xt=e=>new Uint8Array(e),Vt=e=>new Uint8Array(e.buffer,e.byteOffset,e.byteLength),Fr=(e,t)=>e.slice(0,t),Mr=(e,{contents:t,length:n},r)=>{let o=Qt()?Dr(t,r):_r(t,r);return new Uint8Array(o).set(e,n),o},_r=(e,t)=>{if(t<=e.byteLength)return e;let n=new ArrayBuffer(Zt(t));return new Uint8Array(n).set(new Uint8Array(e),0),n},Dr=(e,t)=>{if(t<=e.maxByteLength)return e.resize(t),e;let n=new ArrayBuffer(t,{maxByteLength:Zt(t)});return new Uint8Array(n).set(new Uint8Array(e),0),n},Zt=e=>Yt**Math.ceil(Math.log(e)/Math.log(Yt)),Yt=2,zr=({contents:e,length:t})=>Qt()?e:e.slice(0,t),Qt=()=>"resize"in ArrayBuffer.prototype,qr={init:Nr,convertChunk:{string:Lr,buffer:Xt,arrayBuffer:Xt,dataView:Vt,typedArray:Vt,others:_},getSize:D,truncateChunk:Fr,addChunk:Mr,getFinalChunk:ge,finalize:zr};async function z(e,t){if(!("Buffer"in globalThis))throw new Error("getStreamAsBuffer() is only supported in Node.js");try{return Jt(await Se(e,t))}catch(n){throw n.bufferedData!==void 0&&(n.bufferedData=Jt(n.bufferedData)),n}}var Jt=e=>globalThis.Buffer.from(e);async function xe(e,t){return I(e,Vr,t)}var Hr=()=>({contents:"",textDecoder:new TextDecoder}),q=(e,{textDecoder:t})=>t.decode(e,{stream:!0}),Wr=(e,{contents:t})=>t+e,Kr=(e,t)=>e.slice(0,t),Xr=({textDecoder:e})=>{let t=e.decode();return t===""?void 0:t},Vr={init:Hr,convertChunk:{string:ye,buffer:q,arrayBuffer:q,dataView:q,typedArray:q,others:_},getSize:D,truncateChunk:Kr,addChunk:Wr,getFinalChunk:Xr,finalize:be};var rn=y(tn(),1),on=e=>{if(e!==void 0)throw new TypeError("The `input` and `inputFile` options cannot be both set.")},Zr=({input:e,inputFile:t})=>typeof t!="string"?e:(on(e),(0,H.readFileSync)(t)),sn=e=>{let t=Zr(e);if(F(t))throw new TypeError("The `input` option cannot be a stream in sync mode");return t},Qr=({input:e,inputFile:t})=>typeof t!="string"?e:(on(e),(0,H.createReadStream)(t)),an=(e,t)=>{let n=Qr(t);n!==void 0&&(F(n)?n.pipe(e.stdin):e.stdin.end(n))},cn=(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;let n=(0,rn.default)();return e.stdout&&n.add(e.stdout),e.stderr&&n.add(e.stderr),n},we=async(e,t)=>{if(!(!e||t===void 0)){await(0,nn.setTimeout)(0),e.destroy();try{return await t}catch(n){return n.bufferedData}}},Ee=(e,{encoding:t,buffer:n,maxBuffer:r})=>{if(!(!e||!n))return t==="utf8"||t==="utf-8"?xe(e,{maxBuffer:r}):t===null||t==="buffer"?z(e,{maxBuffer:r}):Jr(e,r,t)},Jr=async(e,t,n)=>(await z(e,{maxBuffer:t})).toString(n),un=async({stdout:e,stderr:t,all:n},{encoding:r,buffer:o,maxBuffer:i},s)=>{let a=Ee(e,{encoding:r,buffer:o,maxBuffer:i}),c=Ee(t,{encoding:r,buffer:o,maxBuffer:i}),u=Ee(n,{encoding:r,buffer:o,maxBuffer:i*2});try{return await Promise.all([s,a,c,u])}catch(l){return Promise.all([{error:l,signal:l.signal,timedOut:l.timedOut},we(e,a),we(t,c),we(n,u)])}};var eo=(async()=>{})().constructor.prototype,to=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(eo,e)]),Te=(e,t)=>{for(let[n,r]of to){let o=typeof t=="function"?(...i)=>Reflect.apply(r.value,t(),i):r.value.bind(t);Reflect.defineProperty(e,n,{...r,value:o})}},ln=e=>new Promise((t,n)=>{e.on("exit",(r,o)=>{t({exitCode:r,signal:o})}),e.on("error",r=>{n(r)}),e.stdin&&e.stdin.on("error",r=>{n(r)})});var pn=require("node:buffer"),mn=require("node:child_process"),hn=(e,t=[])=>Array.isArray(t)?[e,...t]:[e],no=/^[\w.-]+$/,ro=e=>typeof e!="string"||no.test(e)?e:`"${e.replaceAll('"','\\"')}"`,Pe=(e,t)=>hn(e,t).join(" "),Ce=(e,t)=>hn(e,t).map(n=>ro(n)).join(" "),oo=/ +/g;var fn=e=>{let t=typeof e;if(t==="string")return e;if(t==="number")return String(e);if(t==="object"&&e!==null&&!(e instanceof mn.ChildProcess)&&"stdout"in e){let n=typeof e.stdout;if(n==="string")return e.stdout;if(pn.Buffer.isBuffer(e.stdout))return e.stdout.toString();throw new TypeError(`Unexpected "${n}" stdout in template expression`)}throw new TypeError(`Unexpected "${t}" in template expression`)},dn=(e,t,n)=>n||e.length===0||t.length===0?[...e,...t]:[...e.slice(0,-1),`${e.at(-1)}${t[0]}`,...t.slice(1)],io=({templates:e,expressions:t,tokens:n,index:r,template:o})=>{let i=o??e.raw[r],s=i.split(oo).filter(Boolean),a=dn(n,s,i.startsWith(" "));if(r===t.length)return a;let c=t[r],u=Array.isArray(c)?c.map(l=>fn(l)):[fn(c)];return dn(a,u,i.endsWith(" "))},Ae=(e,t)=>{let n=[];for(let[r,o]of e.entries())n=io({templates:e,expressions:t,tokens:n,index:r,template:o});return n};var yn=require("node:util"),gn=y(require("node:process"),1),bn=(0,yn.debuglog)("execa").enabled,W=(e,t)=>String(e).padStart(t,"0"),so=()=>{let e=new Date;return`${W(e.getHours(),2)}:${W(e.getMinutes(),2)}:${W(e.getSeconds(),2)}.${W(e.getMilliseconds(),3)}`},Ie=(e,{verbose:t})=>{t&&gn.default.stderr.write(`[${so()}] ${e}
`)};var ao=1e3*1e3*100,co=({env:e,extendEnv:t,preferLocal:n,localDir:r,execPath:o})=>{let i=t?{...v.default.env,...e}:e;return n?Tt({env:i,cwd:r,execPath:o}):i},Tn=(e,t,n={})=>{let r=En.default._parse(e,t,n);return e=r.command,t=r.args,n=r.options,n={maxBuffer:ao,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:n.cwd||v.default.cwd(),execPath:v.default.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0,verbose:bn,...n},n.env=co(n),n.stdio=jt(n),v.default.platform==="win32"&&wn.default.basename(e,".exe")==="cmd"&&t.unshift("/q"),{file:e,args:t,options:n,parsed:r}},O=(e,t,n)=>typeof t!="string"&&!xn.Buffer.isBuffer(t)?n===void 0?void 0:"":e.stripFinalNewline?oe(t):t;function ve(e,t,n){let r=Tn(e,t,n),o=Pe(e,t),i=Ce(e,t);Ie(i,r.options),Mt(r.options);let s;try{s=K.default.spawn(r.file,r.args,r.options)}catch(h){let p=new K.default.ChildProcess,g=Promise.reject(A({error:h,stdout:"",stderr:"",all:"",command:o,escapedCommand:i,parsed:r,timedOut:!1,isCanceled:!1,killed:!1}));return Te(p,g),p}let a=ln(s),c=Ft(s,r.options,a),u=_t(s,r.options,c),l={isCanceled:!1};s.kill=Lt.bind(null,s.kill.bind(s)),s.cancel=Ut.bind(null,s,l);let f=Ct(async()=>{let[{error:h,exitCode:p,signal:g,timedOut:x},G,R,k]=await un(s,r.options,u),Ge=O(r.options,G),Re=O(r.options,R),ke=O(r.options,k);if(h||p!==0||g!==null){let $e=A({error:h,exitCode:p,signal:g,stdout:Ge,stderr:Re,all:ke,command:o,escapedCommand:i,parsed:r,timedOut:x,isCanceled:l.isCanceled||(r.options.signal?r.options.signal.aborted:!1),killed:s.killed});if(!r.options.reject)return $e;throw $e}return{command:o,escapedCommand:i,exitCode:0,stdout:Ge,stderr:Re,all:ke,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return an(s,r.options),s.all=cn(s,r.options),qt(s),Te(s,f),s}function uo(e,t,n){let r=Tn(e,t,n),o=Pe(e,t),i=Ce(e,t);Ie(i,r.options);let s=sn(r.options),a;try{a=K.default.spawnSync(r.file,r.args,{...r.options,input:s})}catch(l){throw A({error:l,stdout:"",stderr:"",all:"",command:o,escapedCommand:i,parsed:r,timedOut:!1,isCanceled:!1,killed:!1})}let c=O(r.options,a.stdout,a.error),u=O(r.options,a.stderr,a.error);if(a.error||a.status!==0||a.signal!==null){let l=A({stdout:c,stderr:u,error:a.error,signal:a.signal,exitCode:a.status,command:o,escapedCommand:i,parsed:r,timedOut:a.error&&a.error.code==="ETIMEDOUT",isCanceled:!1,killed:a.signal!==null});if(!r.options.reject)return l;throw l}return{command:o,escapedCommand:i,exitCode:0,stdout:c,stderr:u,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}}var lo=({input:e,inputFile:t,stdio:n})=>e===void 0&&t===void 0&&n===void 0?{stdin:"inherit"}:{},Sn=(e={})=>({preferLocal:!0,...lo(e),...e});function Pn(e){function t(n,...r){if(!Array.isArray(n))return Pn({...e,...n});let[o,...i]=Ae(n,r);return ve(o,i,Sn(e))}return t.sync=(n,...r)=>{if(!Array.isArray(n))throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");let[o,...i]=Ae(n,r);return uo(o,i,Sn(e))},t}var zi=Pn();var Cn={bugs:"https://github.com/cedx/php-index/issues",description:"A PHP directory index generator.",homepage:"https://github.com/cedx/php-index",license:"MIT",name:"@cedx/php-index",repository:"cedx/php-index",type:"module",version:"2.0.0",author:{email:"cedric@belin.io",name:"C\xE9dric Belin",url:"https://belin.io"},bin:{php_index:"./bin/php_index.cjs"},dependencies:{execa:"^8.0.1"},devDependencies:{"@cedx/php-minifier":"cedx/php-minifier#main","@fontsource-variable/material-symbols-rounded":"^5.0.21","@lit/localize":"^0.12.1","@lit/localize-tools":"^0.7.1","@types/bootstrap":"^5.2.10","@types/browser-sync":"^2.29.0","@types/gulp":"^4.0.17","@types/node":"=20.11.5","@typescript-eslint/eslint-plugin":"^6.19.1","@typescript-eslint/parser":"^6.19.1",bootstrap:"^5.3.2","browser-sync":"^3.0.2",del:"^7.1.0",esbuild:"^0.20.0","esbuild-plugin-minify-html-literals":"^1.0.6",eslint:"^8.56.0",gulp:"^4.0.2",lit:"^3.1.1","sass-embedded":"^1.70.0","source-map-js":"^1.0.2",typescript:"^5.3.3","urlpattern-polyfill":"^10.0.0"},engines:{node:">=20.0.0"},files:["bin/","lib/","www/"],keywords:["cli","directory","generator","index","listing","php","web"],scripts:{postpublish:"gulp publish",prepack:"gulp",start:"gulp watch"}};var An=`
Build the PHP Index redistributable.

Usage:
  php_index [options] <directory>

Arguments:
  directory       The path to the output directory.

Options:
  -c, --compress  Compress the Phar archive.
  -h, --help      Display this help.
  -v, --version   Output the version number.
`;async function po(){let{positionals:e,values:t}=(0,vn.parseArgs)({allowPositionals:!0,options:{compress:{short:"c",type:"boolean",default:!1},help:{short:"h",type:"boolean",default:!1},version:{short:"v",type:"boolean",default:!1}}});if(t.help||t.version)return X.default.log(t.version?Cn.version:An.trim()),0;if(!e.length)return X.default.error("You must provide the path of the output directory."),1;let n=(0,b.join)(__dirname,".."),r=await(0,P.mkdtemp)((0,b.join)((0,In.tmpdir)(),"phpindex-"));for(let i of["src/server","www"])await(0,P.cp)((0,b.join)(n,i),(0,b.join)(r,i),{recursive:!0});await(0,P.rm)((0,b.join)(r,"www/index.php"));let o=(0,b.resolve)(e[0]);return await ve("php",[(0,b.join)(n,"bin/php_index.php"),"--input",r,"--output",o].concat(t.compress?["--compress"]:[])),0}po().then(e=>Oe.default.exitCode=e,e=>{X.default.error(e instanceof Error?e.message:e),Oe.default.exitCode=1});
