#!/usr/bin/env node
(function(We){"use strict";var F=function(){return O.__string_rec(this,"")},V=V||{},d;class _e{constructor(e,t){this.r=new RegExp(e,t.split("u").join(""))}match(e){return this.r.global&&(this.r.lastIndex=0),this.r.m=this.r.exec(e),this.r.s=e,this.r.m!=null}matched(e){if(this.r.m!=null&&e>=0&&e<this.r.m.length)return this.r.m[e];throw v.thrown("EReg::matched")}}_e.__name__=!0;class x{static cca(e,t){let n=e.charCodeAt(t);if(n==n)return n}static substr(e,t,n){if(n==null)n=e.length;else if(n<0)if(t==0)n=e.length+n;else return"";return e.substr(t,n)}static now(){return Date.now()}}x.__name__=!0;class T{static iter(e,t){let n=oe(e);for(;n.hasNext();)t(n.next())}static fold(e,t,n){let l=oe(e);for(;l.hasNext();)n=t(l.next(),n);return n}static find(e,t){let n=oe(e);for(;n.hasNext();){let l=n.next();if(t(l))return l}return null}}T.__name__=!0,Math.__name__=!0;class j{static string(e){return O.__string_rec(e,"")}static random(e){return e<=0?0:Math.floor(Math.random()*e)}}j.__name__=!0;class R{static isSpace(e,t){let n=x.cca(e,t);return n>8&&n<14?!0:n==32}static ltrim(e){let t=e.length,n=0;for(;n<t&&R.isSpace(e,n);)++n;return n>0?x.substr(e,n,t-n):e}static rtrim(e){let t=e.length,n=0;for(;n<t&&R.isSpace(e,t-n-1);)++n;return n>0?x.substr(e,0,t-n):e}static trim(e){return R.ltrim(R.rtrim(e))}static lpad(e,t,n){if(t.length<=0)return e;let l="";for(n-=e.length;l.length<n;)l+=t==null?"null":""+t;return l+=e==null?"null":""+e,l}static replace(e,t,n){return e.split(t).join(n)}}R.__name__=!0;var G=V["haxe.StackItem"]={__ename__:!0,__constructs__:null,CFunction:{_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:F},Module:(d=function(a){return{_hx_index:1,m:a,__enum__:"haxe.StackItem",toString:F}},d._hx_name="Module",d.__params__=["m"],d),FilePos:(d=function(a,e,t,n){return{_hx_index:2,s:a,file:e,line:t,column:n,__enum__:"haxe.StackItem",toString:F}},d._hx_name="FilePos",d.__params__=["s","file","line","column"],d),Method:(d=function(a,e){return{_hx_index:3,classname:a,method:e,__enum__:"haxe.StackItem",toString:F}},d._hx_name="Method",d.__params__=["classname","method"],d),LocalFunction:(d=function(a){return{_hx_index:4,v:a,__enum__:"haxe.StackItem",toString:F}},d._hx_name="LocalFunction",d.__params__=["v"],d)};G.__constructs__=[G.CFunction,G.Module,G.FilePos,G.Method,G.LocalFunction];class v extends Error{constructor(e,t,n){super(e),this.message=e,this.__previousException=t,this.__nativeException=n??this}unwrap(){return this.__nativeException}get_native(){return this.__nativeException}static caught(e){return e instanceof v?e:e instanceof Error?new v(e.message,null,e):new ce(e,null,e)}static thrown(e){return e instanceof v?e.get_native():e instanceof Error?e:new ce(e)}}v.__name__=!0;class p{static ucompare(e,t){return e<0?t<0?~t-~e|0:1:t<0?-1:e-t|0}}class Me{static divMod(e,t){if(t.high==0)switch(t.low){case 0:throw v.thrown("divide by zero");case 1:return{quotient:new m(e.high,e.low),modulus:new m(0,0)}}let n=e.high<0!=t.high<0,l;if(e.high<0){let s=~e.high,u=~e.low+1|0;u==0&&(++s,s=s|0),l=new m(s,u)}else l=new m(e.high,e.low);if(t.high<0){let s=~t.high,u=~t.low+1|0;u==0&&(++s,s=s|0),t=new m(s,u)}let r=new m(0,0),i=new m(0,1);for(;!(t.high<0);){let s=p.ucompare(t.high,l.high),u=s!=0?s:p.ucompare(t.low,l.low);if(t=new m(t.high<<1|t.low>>>31,t.low<<1),i=new m(i.high<<1|i.low>>>31,i.low<<1),u>=0)break}for(;i.high!=0||i.low!=0;){let s=p.ucompare(l.high,t.high);if((s!=0?s:p.ucompare(l.low,t.low))>=0){r=new m(r.high|i.high,r.low|i.low);let u=l.high-t.high|0;p.ucompare(l.low,t.low)<0&&(--u,u=u|0),l=new m(u,l.low-t.low|0)}i=new m(i.high>>>1,i.high<<31|i.low>>>1),t=new m(t.high>>>1,t.high<<31|t.low>>>1)}if(n){let s=~r.high,u=~r.low+1|0;u==0&&(++s,s=s|0),r=new m(s,u)}if(e.high<0){let s=~l.high,u=~l.low+1|0;u==0&&(++s,s=s|0),l=new m(s,u)}return{quotient:r,modulus:l}}}class m{constructor(e,t){this.high=e,this.low=t}}m.__name__=!0;class fe{static fromFloat(e){if(isNaN(e)||!isFinite(e))throw v.thrown("Number is NaN or Infinite");let t=e-e%1;if(t>9007199254740991)throw v.thrown("Conversion overflow");if(t<-9007199254740991)throw v.thrown("Conversion underflow");let n=new m(0,0),l=t<0,r=l?-t:t,i=0;for(;r>=1;){let s=r%2;if(r/=2,s>=1){let u=0,c=1,o=i;o&=63;let _=o==0?new m(u,c):o<32?new m(u<<o|c>>>32-o,c<<o):new m(c<<o-32,0),f=n.high+_.high|0,g=n.low+_.low|0;p.ucompare(g,n.low)<0&&(++f,f=f|0),n=new m(f,g)}++i}if(l){let s=~n.high,u=~n.low+1|0;u==0&&(++s,s=s|0),n=new m(s,u)}return n}}fe.__name__=!0;class ce extends v{constructor(e,t,n){super(String(e),t,n),this.value=e}unwrap(){return this.value}}ce.__name__=!0;class ge{constructor(e){this.length=e.byteLength,this.b=new Uint8Array(e),this.b.bufferValue=e,e.hxBytes=this,e.bytes=this.b}toHex(){let e="",t=[],n="0123456789abcdef",l=0,r=n.length;for(;l<r;)t.push(x.cca(n,l++));let i=0,s=this.length;for(;i<s;){let u=this.b[i++];e+=String.fromCodePoint(t[u>>4]),e+=String.fromCodePoint(t[u&15])}return e}}ge.__name__=!0;class N{constructor(e){switch(e){case".":case"..":this.dir=e,this.file="";return}let t=e.lastIndexOf("/"),n=e.lastIndexOf("\\");t<n?(this.dir=x.substr(e,0,n),e=x.substr(e,n+1,null),this.backslash=!0):n<t?(this.dir=x.substr(e,0,t),e=x.substr(e,t+1,null)):this.dir=null;let l=e.lastIndexOf(".");l!=-1?(this.ext=x.substr(e,l+1,null),this.file=x.substr(e,0,l)):(this.ext=null,this.file=e)}static directory(e){let t=new N(e);return t.dir==null?"":t.dir}static join(e){let t=[],n=0;for(;n<e.length;){let s=e[n];++n,s!=null&&s!=""&&t.push(s)}if(t.length==0)return"";let l=t[0],r=1,i=t.length;for(;r<i;)l=N.addTrailingSlash(l),l+=t[r++];return N.normalize(l)}static normalize(e){let t="/";if(e=e.split("\\").join(t),e==t)return t;let n=[],l=0,r=e.split(t);for(;l<r.length;){let _=r[l];++l,_==".."&&n.length>0&&n[n.length-1]!=".."?n.pop():_==""?(n.length>0||x.cca(e,0)==47)&&n.push(_):_!="."&&n.push(_)}let i="",s=!1,u=!1,c=0,o=n.join(t);for(;c<o.length;){let _=o,f=c++,g=_.charCodeAt(f);g>=55296&&g<=56319&&(g=g-55232<<10|_.charCodeAt(f+1)&1023);let h=g;h>=65536&&++c;let w=h;switch(w){case 47:if(!s)u=!0;else{let E=w;s=!1,u&&(i+="/",u=!1),i+=String.fromCodePoint(E)}break;case 58:i+=":",s=!0;break;default:let y=w;s=!1,u&&(i+="/",u=!1),i+=String.fromCodePoint(y)}}return i}static addTrailingSlash(e){if(e.length==0)return"/";let t=e.lastIndexOf("/"),n=e.lastIndexOf("\\");return t<n?n!=e.length-1?e+"\\":e:t!=e.length-1?e+"/":e}static isAbsolute(e){return!!(e.startsWith("/")||e.charAt(1)==":"||e.startsWith("\\\\"))}}N.__name__=!0;class me{constructor(e){this.current=0,this.array=e}hasNext(){return this.current<this.array.length}next(){return this.array[this.current++]}}me.__name__=!0;class O{static __string_rec(e,t){if(e==null)return"null";if(t.length>=5)return"<...>";let n=typeof e;switch(n=="function"&&(e.__name__||e.__ename__)&&(n="object"),n){case"function":return"<function>";case"object":if(e.__enum__){let c=V[e.__enum__].__constructs__[e._hx_index],o=c._hx_name;return c.__params__?(t=t+"	",o+"("+function(_){var f;let g=[];{let h=0,w=c.__params__;for(;h<w.length;){let y=w[h];h=h+1,g.push(O.__string_rec(e[y],t))}}return f=g,f}(this).join(",")+")"):o}if(e instanceof Array){let u="[";t+="	";let c=0,o=e.length;for(;c<o;){let _=c++;u+=(_>0?",":"")+O.__string_rec(e[_],t)}return u+="]",u}let l;try{l=e.toString}catch{return"???"}if(l!=null&&l!=Object.toString&&typeof l=="function"){let u=e.toString();if(u!="[object Object]")return u}let r=`{
`;t+="	";let i=e.hasOwnProperty!=null,s=null;for(s in e)i&&!e.hasOwnProperty(s)||s=="prototype"||s=="__class__"||s=="__super__"||s=="__interfaces__"||s=="__properties__"||(r.length!=2&&(r+=`, 
`),r+=t+s+" : "+O.__string_rec(e[s],t));return t=t.substring(1),r+=`
`+t+"}",r;case"string":return e;default:return String(e)}}}O.__name__=!0;var de=require("child_process"),C=require("fs"),He=require("os"),Be=require("path"),we=require("buffer").Buffer;class X{static get_packageVersion(){return X.packageVersion==null&&(X.packageVersion="0.5.0"),X.packageVersion}}X.__name__=!0;class Y{constructor(){this.version=!1,this.help=!1,this.compress=!1}run(e){if(this.help||this.version){let h=this.version?X.get_packageVersion():new ke().format(K.get());return process.stdout.write(j.string(h)),process.stdout.write(`
`),new B(new L(k.Success(null)))}let t=process.env.HAXELIB_RUN=="1";if(e.length<(t?2:1))return new B(new L(k.Failure(new I(400,"You must provide the path of the output directory.",{fileName:"src/php_index/cli/Program.hx",lineNumber:52,className:"php_index.cli.Program",methodName:"run"}))));let n=N.join([N.directory(__filename),".."]),l=N.join([He.tmpdir(),S.v4()]);T.iter(["lib","www"],function(h){Y.copyDirectory(N.join([n,h]),N.join([l,h]))});let r=["index.phar","index.php"],i=new Array(r.length),s=0,u=r.length;for(;s<u;){let h=s++;i[h]="www/"+r[h]}let c=M.exists,o=[],_=0;for(;_<i.length;){let h=i[_];++_,c(h)&&o.push(h)}T.iter(o,M.deleteFile);let f=N.isAbsolute(e[0])?e.shift():N.join([t?e.pop():N.addTrailingSlash(process.cwd()),e.shift()]);M.createDirectory(f);let g=[N.join([n,"bin/php_index.php"]),"--input",l,"--output",f].concat(this.compress?["--compress"]:[]);return g==null?de.spawnSync("php",{shell:!0,stdio:"inherit"}):de.spawnSync("php",g,{stdio:"inherit"}),new B(new L(k.Success(null)))}static main(){new be(new Y,new ve(5)).process(process.argv.slice(2)).handle(pe.exit)}static copyDirectory(e,t){let n=0,l=C.readdirSync(e);for(;n<l.length;){let r=l[n];++n;let i=N.join([e,r]),s=N.join([t,r]);M.isDirectory(i)?Y.copyDirectory(i,s):(M.createDirectory(N.directory(s)),J.copy(i,s))}}}Y.__name__=!0;class M{static exists(e){try{return C.accessSync(e),!0}catch{return!1}}static isDirectory(e){try{return C.statSync(e).isDirectory()}catch{return!1}}static createDirectory(e){try{C.mkdirSync(e)}catch(t){let n=v.caught(t).unwrap();if(n.code=="ENOENT")M.createDirectory(Be.dirname(e)),C.mkdirSync(e);else{let l;try{l=C.statSync(e)}catch{throw n}if(!l.isDirectory())throw n}}}static deleteFile(e){C.unlinkSync(e)}}M.__name__=!0;class J{static copy(e,t){let n=C.openSync(e,"r"),l=C.fstatSync(n),r=C.openSync(t,"w",l.mode),i,s=0;for(;i=C.readSync(n,J.copyBuf,0,65536,s),i>0;)C.writeSync(r,J.copyBuf,0,i),s+=i;C.closeSync(n),C.closeSync(r)}}J.__name__=!0;class pe{static exit(e){switch(e._hx_index){case 0:process.exit(0);break;case 1:let t=e.failure,n=t.message;t.data!=null&&(n+=", "+(t.data==null?"null":j.string(t.data))),process.stdout.write(j.string(n)),process.stdout.write(`
`);let l=t.code;process.exit(l);break}}}pe.__name__=!0;class xe{constructor(e){this.buffer=e}}xe.__name__=!0;class K{static get(){return K.doc==null&&(K.doc={doc:`\r
	Build the PHP Index redistributable.\r
\r
	> php_index [flags] <directory>\r
`,commands:[{isDefault:!0,isSub:!1,names:[],doc:" directory : The path to the output directory. "}],flags:[{names:["--compress"],aliases:["c"],doc:" Compress the PHAR archive. "},{names:["--help"],aliases:["h"],doc:" Display this help. "},{names:["--version"],aliases:["v"],doc:" Output the version number. "}]}),K.doc}}K.__name__=!0;class ne{constructor(e,t,n){this.command=e,this.prompt=t,this.hasFlags=n}processArgs(e){let t=this;return this.hasFlags?I.catchExceptions(function(){let n=ne.expandAssignments(e),l=[],r=0,i=!1;for(;r<n.length;){let s=n[r];if(s=="--")i=!0,++r;else if(!i&&x.cca(s,0)==45){let u=t.processFlag(n,r);if(u==-1)if(x.cca(s,1)!=45){let c=t.processAlias(n,r);if(c==-1)throw v.thrown('Unrecognized alias "'+s+'"');r+=c+1}else throw v.thrown('Unrecognized flag "'+s+'"');else r+=u+1}else l.push(s),++r}return l},null,{fileName:"tink/cli/Router.hx",lineNumber:25,className:"tink.cli.Router",methodName:"processArgs"}):k.Success(e)}processFlag(e,t){return-1}processAlias(e,t){return-1}static expandAssignments(e){let t=[],n=!0,l=0;for(;l<e.length;){let r=e[l];if(++l,r=="--"&&(n=!1),!n)t.push(r);else{let i=x.cca(r,0),s=x.cca(r,1),u=r.indexOf("=");i==null?t.push(r):i==45?s==null?t.push(r):s==45&&u!=-1?(t.push(x.substr(r,0,u)),t.push(x.substr(r,u+1,null))):t.push(r):t.push(r)}}return t}}ne.__name__=!0;class be extends ne{constructor(e,t){super(e,t,!0)}process(e){let t=this;if(e[0]==null){let n,l=this.processArgs(e);switch(l._hx_index){case 0:n=l.data;break;case 1:return new B(new L(k.Failure(l.failure)))}return Fe.next(this.promptRequired(),function(r){return t.run_run(n)})}else{let n,l=this.processArgs(e);switch(l._hx_index){case 0:n=l.data;break;case 1:return new B(new L(k.Failure(l.failure)))}return Fe.next(this.promptRequired(),function(r){return t.run_run(n)})}}processFlag(e,t){switch(e[t]){case"--compress":this.command.compress=!0;break;case"--help":this.command.help=!0;break;case"--version":this.command.version=!0;break;default:return-1}return t-t}processAlias(e,t){let n=e[t],l=1,r=n.length;for(;l<r;){let i=l++,s=x.cca(n,i);if(s==null)throw v.thrown("Invalid alias '-"+n.charAt(i)+"'");switch(s){case 99:this.command.compress=!0;break;case 104:this.command.help=!0;break;case 118:this.command.version=!0;break;default:throw v.thrown("Invalid alias '-"+n.charAt(i)+"'")}}return t-t}promptRequired(){return D.async(function(e){e(k.Success(null))})}run_run(e){return e.length<0?new B(new L(k.Failure(new I(null,"Insufficient arguments. Expected: 0, Got: "+e.length,{fileName:"src/php_index/cli/Program.hx",lineNumber:43,className:"tink.cli.Router0",methodName:"run_run"})))):this.command.run(e.slice(0,e.length))}}be.__name__=!0;class ke{constructor(e){this.re=new _e("^\\s*\\*?\\s{0,2}(.*)$",""),this.root=e}format(e){let t="";t+=`
`;let n=this.formatDoc(e.doc);n!=null&&(t+=j.string(""+n+`

`));let l=e.commands,r=[],i=0;for(;i<l.length;){let c=l[i];++i,c.isDefault||r.push(c)}this.root!=null&&(t+=j.string("  Usage: "+this.root+`
`));let s=T.find(e.commands,function(c){return c.isDefault});if(s!=null){let c=this.formatDoc(s.doc);c!=null&&(t+=j.string(this.indent(c,4)+`

`))}let u=this;if(r.length>0){let c=T.fold(r,function(f,g){let h=0,w=f.names;for(;h<w.length;){let y=w[h];++h,y.length>g&&(g=y.length)}return g},0);this.root!=null&&(t+=j.string("  Usage: "+this.root+` <subcommand>
`)),t+=j.string(`    Subcommands:
`);let o=function(f,g){g==null&&(g="(doc missing)"),t+=j.string(u.indent(R.lpad(f," ",c)+" : "+R.trim(u.indent(g,c+3)),6)+`
`)},_=0;for(;_<r.length;){let f=r[_];++_;let g=f.names[0];if(o(g,this.formatDoc(f.doc)),f.names.length>1){let h=1,w=f.names.length;for(;h<w;)o(f.names[h++],"Alias of "+g)}}}if(e.flags.length>0){let c=function(h){let w=h.names.join(", ");if(h.aliases.length>0){let y=h.aliases,E=new Array(y.length),z=0,ee=y.length;for(;z<ee;){let W=z++;E[W]="-"+y[W]}w+=", "+E.join(", ")}return w},o=T.fold(e.flags,function(h,w){let y=c(h);return y.length>w&&(w=y.length),w},0),_=function(h,w){w==null&&(w=""),t+=j.string(u.indent(R.lpad(h," ",o)+" : "+R.trim(u.indent(w,o+3)),6)+`
`)};t=(t+=`
`)+j.string(`  Flags:
`);let f=0,g=e.flags;for(;f<g.length;){let h=g[f];++f,_(c(h),this.formatDoc(h.doc))}}return t}indent(e,t){let n=e.split(`
`),l=new Array(n.length),r=0,i=n.length;for(;r<i;){let s=r++;l[s]=R.lpad(""," ",t)+n[s]}return l.join(`
`)}formatDoc(e){if(e==null)return null;let t=e.split(`
`),n=R.trim,l=new Array(t.length),r=0,i=t.length;for(;r<i;){let _=r++;l[_]=n(t[_])}let s=l;for(;s[0]=="";)s=s.slice(1);for(;s[s.length-1]=="";)s.pop();let u=new Array(s.length),c=0,o=s.length;for(;c<o;){let _=c++,f=s[_];u[_]=this.re.match(f)?this.re.matched(1):f}return u.join(`
`)}}ke.__name__=!0;class ye{constructor(e,t){this.source=e,this.sink=t}}ye.__name__=!0;class Se extends ye{constructor(){let e=process.stdin,t=null;t={},super(U.wrap("stdin",e,t.chunkSize,t.onEnd),re.wrap("stdout",process.stdout))}}Se.__name__=!0;class ve{constructor(e,t){this.trials=e,this.proxy=t??new Se}}ve.__name__=!0;class b{static invoke(e,t){b.depth<500?(b.depth++,e(t),b.depth--):b.defer(function(){e(t)})}static defer(e){global.setImmediate(e)}}class Ne{constructor(){}cancel(){let e=this.link;e?.cancel()}}Ne.__name__=!0;class he{constructor(e,t){this.dissolved=!1,this.a=e,this.b=t}cancel(){if(!this.dissolved){this.dissolved=!0;let e=this.a;e?.cancel();let t=this.b;t?.cancel(),this.a=null,this.b=null}}}he.__name__=!0;class Ae{constructor(e,t){if(e==null)throw v.thrown("callback expected but null received");this.cb=e,this.list=t}cancel(){if(this.list!=null){let e=this.list;this.cb=null,this.list=null,--e.used<=e.cells.length>>1&&e.compact()}}}Ae.__name__=!0;class H{constructor(e){H._hx_skip_constructor||this._hx_constructor(e)}_hx_constructor(e){this.disposeHandlers=[],this.f=e}dispose(){let e=this.disposeHandlers;if(e!=null){this.disposeHandlers=null;let t=this.f;this.f=H.noop,t();let n=0;for(;n<e.length;)e[n++]()}}static noop(){}}H.__name__=!0;class Ee extends H{constructor(e){H._hx_skip_constructor=!0,super(),H._hx_skip_constructor=!1,this._hx_constructor(e)}_hx_constructor(e){e==null&&(e=!1),this.onfill=function(){},this.ondrain=function(){},this.busy=!1,this.queue=[],this.used=0;let t=this;super._hx_constructor(function(){t.busy||t.destroy()}),this.destructive=e,this.cells=[]}destroy(){let e=0,t=this.cells;for(;e<t.length;){let n=t[e];++e,n.cb=null,n.list=null}if(this.queue=null,this.cells=null,this.used>0){this.used=0;let n=this.ondrain;b.depth<500?(b.depth++,n(),b.depth--):b.defer(n)}}invoke(e){let t=this;if(b.depth<500){if(b.depth++,t.disposeHandlers!=null)if(t.busy){if(t.destructive!=!0){let n=t,l=e,r=function(){n.invoke(l)};t.queue.push(r)}}else{t.busy=!0,t.destructive&&t.dispose();let n=t.cells.length,l=0;for(;l<n;){let r=t.cells[l++];r.list!=null&&r.cb(e)}t.busy=!1,t.disposeHandlers==null?t.destroy():(t.used<t.cells.length&&t.compact(),t.queue.length>0&&t.queue.shift()())}b.depth--}else b.defer(function(){if(t.disposeHandlers!=null)if(t.busy){if(t.destructive!=!0){let n=t,l=e,r=function(){n.invoke(l)};t.queue.push(r)}}else{t.busy=!0,t.destructive&&t.dispose();let n=t.cells.length,l=0;for(;l<n;){let r=t.cells[l++];r.list!=null&&r.cb(e)}t.busy=!1,t.disposeHandlers==null?t.destroy():(t.used<t.cells.length&&t.compact(),t.queue.length>0&&t.queue.shift()())}})}compact(){if(!this.busy)if(this.used==0){this.resize(0);let e=this.ondrain;b.depth<500?(b.depth++,e(),b.depth--):b.defer(e)}else{let e=0,t=0,n=this.cells.length;for(;t<n;){let l=t++,r=this.cells[l];if(r.cb!=null&&(e!=l&&(this.cells[e]=r),++e==this.used))break}this.resize(this.used)}}resize(e){this.cells.length=e}}Ee.__name__=!0;class I{constructor(e,t,n){e==null&&(e=500),this.isTinkError=!0,this.code=e,this.message=t,this.pos=n,this.exceptionStack=[],this.callStack=[]}static withData(e,t,n,l){return I.typed(e,t,n,l)}static typed(e,t,n,l){let r=new I(e,t,l);return r.data=n,r}static asError(e){return e!=null&&e.isTinkError?e:null}static catchExceptions(e,t,n){try{return k.Success(e())}catch(l){let r=v.caught(l).unwrap(),i=I.asError(r);return k.Failure(i??(t==null?I.withData(null,"Unexpected Error",r,n):t(r)))}}}I.__name__=!0;class P{constructor(){P._hx_skip_constructor||this._hx_constructor()}_hx_constructor(){}getStatus(){return A.NeverEver}handle(e){return null}eager(){}}P.__name__=!0;class L{constructor(e){this.value=e}isComputed(){return!0}get(){return this.value}compute(){}}L.__name__=!0;class B extends P{constructor(e){super(),this.value=e}getStatus(){return A.Ready(this.value)}handle(e){return b.invoke(e,le.get(this.value)),null}eager(){this.value.isComputed()||le.get(this.value)}}B.__name__=!0;class D{static never(){return D.NEVER_INST}static first(e,t){let n=e;switch(n.getStatus()._hx_index){case 3:switch(t.getStatus()._hx_index){case 3:return n;case 4:return n;default:return n}break;case 4:return t;default:switch(t.getStatus()._hx_index){case 3:return t;case 4:return n;default:return new Z(function(l){return new he(e.handle(l),t.handle(l))})}}}static flatMap(e,t,n){let l=e.getStatus();switch(l._hx_index){case 3:let r=l.result;return new Z(function(i){return t(le.get(r)).handle(function(s){i(s)})});case 4:return D.never();default:return new Z(function(i){let s=new Ne;return new he(e.handle(function(u){let c=t(u).handle(i),o=s.link;o?.cancel(),s.link=c}),s)})}}static async(e,t){t==null&&(t=!1);let n=D.irreversible(e);return t||n.eager(),n}static irreversible(e){return new Z(function(t){return e(t),null})}}var A=V["tink.core.FutureStatus"]={__ename__:!0,__constructs__:null,Suspended:{_hx_name:"Suspended",_hx_index:0,__enum__:"tink.core.FutureStatus",toString:F},Awaited:{_hx_name:"Awaited",_hx_index:1,__enum__:"tink.core.FutureStatus",toString:F},EagerlyAwaited:{_hx_name:"EagerlyAwaited",_hx_index:2,__enum__:"tink.core.FutureStatus",toString:F},Ready:(d=function(a){return{_hx_index:3,result:a,__enum__:"tink.core.FutureStatus",toString:F}},d._hx_name="Ready",d.__params__=["result"],d),NeverEver:{_hx_name:"NeverEver",_hx_index:4,__enum__:"tink.core.FutureStatus",toString:F}};A.__constructs__=[A.Suspended,A.Awaited,A.EagerlyAwaited,A.Ready,A.NeverEver];class Z extends P{constructor(e){P._hx_skip_constructor=!0,super(),P._hx_skip_constructor=!1,this._hx_constructor(e)}_hx_constructor(e){this.status=A.Suspended,super._hx_constructor(),this.wakeup=e,this.callbacks=new Ee(!0);let t=this;this.callbacks.ondrain=function(){if(t.status==A.Awaited){t.status=A.Suspended;let n=t.link;n?.cancel(),t.link=null}},this.callbacks.onfill=function(){t.status==A.Suspended&&(t.status=A.Awaited,t.arm())}}getStatus(){return this.status}trigger(e){if(this.status._hx_index!=3){this.status=A.Ready(new L(e));let t=this.link;this.link=null,this.wakeup=null,this.callbacks.invoke(e),t?.cancel()}}handle(e){let t=this.status;if(t._hx_index==3)return b.invoke(e,le.get(t.result)),null;{let n=this.callbacks;if(n.disposeHandlers==null)return null;{let l=new Ae(e,n);if(n.cells.push(l),n.used++==0){let r=n.onfill;b.depth<500?(b.depth++,r(),b.depth--):b.defer(r)}return l}}}arm(){let e=this;this.link=this.wakeup(function(t){e.trigger(t)})}eager(){switch(this.status._hx_index){case 0:this.status=A.EagerlyAwaited,this.arm();break;case 1:this.status=A.EagerlyAwaited;break;default:}}}Z.__name__=!0;class le{static get(e){return e.compute(),e.get()}}var k=V["tink.core.Outcome"]={__ename__:!0,__constructs__:null,Success:(d=function(a){return{_hx_index:0,data:a,__enum__:"tink.core.Outcome",toString:F}},d._hx_name="Success",d.__params__=["data"],d),Failure:(d=function(a){return{_hx_index:1,failure:a,__enum__:"tink.core.Outcome",toString:F}},d._hx_name="Failure",d.__params__=["failure"],d)};k.__constructs__=[k.Success,k.Failure];class Fe{static next(e,t,n){return D.flatMap(e,function(l){switch(l._hx_index){case 0:return t(l.data);case 1:return new B(new L(k.Failure(l.failure)))}})}}class Ce{}Ce.__name__=!0;class je{constructor(){}}je.__name__=!0;class Re extends je{constructor(e){super(),this.upcoming=e}}Re.__name__=!0;class re extends Ce{constructor(e){super(),this.target=e}static wrap(e,t){return new re(new De(e,t))}}re.__name__=!0;class U extends Re{constructor(e){super(D.async(function(t){e.read().handle(function(n){let l=t,r;switch(n._hx_index){case 0:let i=n.data;r=i==null?$.End:$.Link(i,new U(e));break;case 1:r=$.Fail(n.failure);break}l(r)})},!0))}static wrap(e,t,n,l){return new U(new Ie(e,t,n,l))}}U.__name__=!0;class Ie{constructor(e,t,n,l){this.name=e,this.native=t,this.chunkSize=n;let r=D.async(function(i){t.once("end",function(){i(k.Success(null))}),t.once("error",function(s){i(k.Failure(new I(null,""+s.code+" - Failed reading from "+e+" because "+s.message,{fileName:"tink/io/nodejs/WrappedReadable.hx",lineNumber:22,className:"tink.io.nodejs.WrappedReadable",methodName:"new"})))})});r.eager(),this.end=r,l!=null&&this.end.handle(function(){process.nextTick(l)})}read(){let e=this;return D.first(D.async(function(t){let n=null;n=function(){try{let l=e.native.read(e.chunkSize);if(l==null)e.native.once("readable",n);else{let r=typeof l=="string"?new we(l):l;t(k.Success(new xe(r)))}}catch(l){let r=v.caught(l).unwrap();t(k.Failure(I.withData(null,"Error while reading from "+e.name,r,{fileName:"tink/io/nodejs/WrappedReadable.hx",lineNumber:48,className:"tink.io.nodejs.WrappedReadable",methodName:"read"})))}},n()}),this.end)}}Ie.__name__=!0;class De{constructor(e,t){this.name=e,this.native=t,this.ended=D.async(function(n){t.once("end",function(){n(k.Success(!1))}),t.once("finish",function(){n(k.Success(!1))}),t.once("close",function(){n(k.Success(!1))}),t.on("error",function(l){n(k.Failure(new I(null,""+l.code+": "+l.message,{fileName:"tink/io/nodejs/WrappedWritable.hx",lineNumber:24,className:"tink.io.nodejs.WrappedWritable",methodName:"new"})))})})}}De.__name__=!0;var $=V["tink.streams.Step"]={__ename__:!0,__constructs__:null,Link:(d=function(a,e){return{_hx_index:0,value:a,next:e,__enum__:"tink.streams.Step",toString:F}},d._hx_name="Link",d.__params__=["value","next"],d),Fail:(d=function(a){return{_hx_index:1,e:a,__enum__:"tink.streams.Step",toString:F}},d._hx_name="Fail",d.__params__=["e"],d),End:{_hx_name:"End",_hx_index:2,__enum__:"tink.streams.Step",toString:F}};$.__constructs__=[$.Link,$.Fail,$.End];class S{static splitmix64_seed(e){let t=e.high+-1640531527|0,n=e.low+2135587861|0;p.ucompare(n,e.low)<0&&(++t,t=t|0);let l=new m(t,n),r=new m(l.high>>30,l.high<<2|l.low>>>30),i=l.high^r.high,s=l.low^r.low,u=484763065,c=s&65535,o=s>>>16,_=u&65535,f=u>>>16,g=p._mul(c,_),h=p._mul(o,_),w=p._mul(c,f),y=g,E=(p._mul(o,f)+(w>>>16)|0)+(h>>>16)|0;w<<=16,y=g+w|0,p.ucompare(y,w)<0&&(++E,E=E|0),h<<=16,y=y+h|0,p.ucompare(y,h)<0&&(++E,E=E|0),E=E+(p._mul(s,-1084733587)+p._mul(i,u)|0)|0,l=new m(E,y);let z=new m(l.high>>27,l.high<<5|l.low>>>27),ee=l.high^z.high,W=l.low^z.low,te=321982955,se=W&65535,ie=W>>>16,Pe=te&65535,Le=te>>>16,qe=p._mul(se,Pe),ue=p._mul(ie,Pe),ae=p._mul(se,Le),Q=qe,q=(p._mul(ie,Le)+(ae>>>16)|0)+(ue>>>16)|0;ae<<=16,Q=qe+ae|0,p.ucompare(Q,ae)<0&&(++q,q=q|0),ue<<=16,Q=Q+ue|0,p.ucompare(Q,ue)<0&&(++q,q=q|0),q=q+(p._mul(W,-1798288965)+p._mul(ee,te)|0)|0,l=new m(q,Q);let Oe=new m(l.high>>31,l.high<<1|l.low>>>31);return new m(l.high^Oe.high,l.low^Oe.low)}static randomFromRange(e,t){let n=S.state0,l=S.state1;S.state0=l;let r=new m(n.high<<23|n.low>>>9,n.low<<23);n=new m(n.high^r.high,n.low^r.low);let i=new m(n.high>>>18,n.high<<14|n.low>>>18),s=new m(l.high>>>5,l.high<<27|l.low>>>5);S.state1=new m(n.high^l.high^i.high^s.high,n.low^l.low^i.low^s.low);let u=S.state1,c=u.high+l.high|0,o=u.low+l.low|0;p.ucompare(o,u.low)<0&&(++c,c=c|0);let _=t-e+1,f=Me.divMod(new m(c,o),new m(_>>31,_)).modulus.low;return f<0&&(f=-f),f+e}static randomByte(){return S.randomFromRange(0,255)}static toShort(e,t,n){return n==null&&(n="123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),t==null&&(t="-"),e=R.replace(e,t,"").toLowerCase(),S.convert(e,"0123456789abcdef",n)}static v4(e,t,n,l,r){r==null&&(r="123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"),l==null&&(l=!1),n==null&&(n="-"),t==null&&(t=S.randomByte);let i=e;if(e==null){i=new ge(new ArrayBuffer(16));let u=t();i.b[0]=u;let c=t();i.b[1]=c;let o=t();i.b[2]=o;let _=t();i.b[3]=_;let f=t();i.b[4]=f;let g=t();i.b[5]=g;let h=t();i.b[6]=h;let w=t();i.b[7]=w;let y=t();i.b[8]=y;let E=t();i.b[9]=E;let z=t();i.b[10]=z;let ee=t();i.b[11]=ee;let W=t();i.b[12]=W;let te=t();i.b[13]=te;let se=t();i.b[14]=se;let ie=t();i.b[15]=ie}else if(e.length<16)throw v.thrown("Random bytes should be at least 16 bytes");i.b[6]=i.b[6]&15|64,i.b[8]=i.b[8]&63|128;let s=S.stringify(i,n);return l&&(s=S.toShort(s,n,r)),s}static stringify(e,t){return t==null&&(t="-"),S.hexToUuid(e.toHex(),t)}static hexToUuid(e,t){return x.substr(e,0,8)+t+x.substr(e,8,4)+t+x.substr(e,12,4)+t+x.substr(e,16,4)+t+x.substr(e,20,12)}static convert(e,t,n){let l=t.length,r=n.length,i=e.length,s="",u=new Array(i),c=0,o=0,_=0,f=i;for(;_<f;){let g=_++;u[g]=t.indexOf(e.charAt(g))}do{c=0,o=0;let g=0,h=i;for(;g<h;)c=c*l+u[g++],c>=r?(u[o++]=Math.floor(c/r),c%=r):o>0&&(u[o++]=0);i=o,s=n.charAt(c)+s}while(o!=0);return s}}S.__name__=!0;function oe(a){return a instanceof Array?new me(a):a.iterator()}typeof performance<"u"&&typeof performance.now=="function"&&(x.now=performance.now.bind(performance)),String.fromCodePoint==null&&(String.fromCodePoint=function(a){return a<65536?String.fromCharCode(a):String.fromCharCode((a>>10)+55232)+String.fromCharCode((a&1023)+56320)}),String.__name__=!0,Array.__name__=!0,O.__toStr={}.toString,p._mul=Math.imul??function(a,e){return a*(e&65535)+(a*(e>>>16)<<16|0)|0},J.copyBuf=we.alloc(65536),b.depth=0,H._hx_skip_constructor=!1,P._hx_skip_constructor=!1,D.NEVER_INST=new P,S.rndSeed=fe.fromFloat(Date.now()),S.state0=S.splitmix64_seed(S.rndSeed),S.state1=function(a){var e;let t=S.rndSeed,n=j.random(1e4),l=t.high+(n>>31)|0,r=t.low+n|0;p.ucompare(r,t.low)<0&&(++l,l=l|0);let i=l+0|0,s=r+1|0;return p.ucompare(s,r)<0&&(++i,i=i|0),e=S.splitmix64_seed(new m(i,s)),e}(this),Y.main()})(global);
