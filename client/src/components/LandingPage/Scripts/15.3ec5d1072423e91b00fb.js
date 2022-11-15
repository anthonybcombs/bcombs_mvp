(function(){var _=document&&document.currentScript&&document.currentScript.src;(window.webpackJsonpruntime=window.webpackJsonpruntime||[]).push([[15],{"3Csl":function(Q,O,i){"use strict";i.r(O),i.d(O,"overThresholdInpSelectors",function(){return B}),i.d(O,"collectExtraDataByMetric",function(){return W});var g=i("8OQS"),y=i.n(g);const R=.05,b=["name","delta"];var E;const L=o=>{const c=(o==null?void 0:o.closest("[data-widget-type]"))||(o==null?void 0:o.closest("[data-element-type]"));return(c==null?void 0:c.id)||"unknown"},p=o=>{var c,e,n,r;if(!o)return"unknownElement";if(!o.closest)return(o==null?void 0:o.nodeName)==="#text"?p(o.parentElement):o.nodeName;const d=o==null||(c=o.closest("[data-widget-type]"))===null||c===void 0||(e=c.dataset)===null||e===void 0?void 0:e.widgetType;if(d)return d;const s=o==null||(n=o.closest("[data-element-type]"))===null||n===void 0||(r=n.dataset)===null||r===void 0?void 0:r.elementType;if(s)return s;const l={dmRespCol:"column",dmRespRow:"row",dmFooterContainer:"footer",dmHeaderContainer:"header",dmInner:"page background",bgGallerySlide:"row image slider",videobgframe:"video bg"};for(const[t,a]of Object.entries(l)){var m;if(o!=null&&(m=o.classList)!==null&&m!==void 0&&m.contains(t))return a}return"unknown"},N=({entries:o=[]})=>{const c=[];for(const d of o){var e,n;const{name:s,target:l,duration:m}=d,t=(l==null?void 0:l.className)||(l==null?void 0:l.id)||"unknown",a=(l==null||(e=l.tagName)===null||e===void 0?void 0:e.toLowerCase())||"",f=p(l),w=L(l),C=(l==null||(n=l.dataset)===null||n===void 0?void 0:n.title)||"";let P;if(a==="svg"){var r;P=(l==null||(r=l.dataset)===null||r===void 0?void 0:r.iconName)||""}c.push({inpSelector:t,inpElementType:a,inpCustomType:f,inpGraphicName:P,inpElementId:w,inpTitle:C,name:s,duration:m})}return{inpSelectors:c}},I=((E=window.rtCommonProps)===null||E===void 0?void 0:E["feature.flag.runtime.inp.threshold"])||150;function B(o=[]){return o.filter(c=>c.duration>I)}const j=({entries:o=[]})=>{const c=[],e=[];return o.forEach(({sources:n,value:r})=>{if(r>R){const d=n.map(({node:s}={})=>{var l,m;e.push(p(s));const t=(s==null||(l=s.nodeName)===null||l===void 0?void 0:l.toLowerCase())||(s==null?void 0:s.nodeType)||"unknownNode",a=s!=null&&(m=s.className)!==null&&m!==void 0&&m.length?"."+Array.from(s.classList.values()).join("."):"";return`${t}${a}`});d!=null&&d.length&&c.push(d.join(","))}}),{clsSelectors:c,clsCustomType:e}},M=o=>{const e=/(-)(\d{1,4})(w.*)$/gm.exec(o);return e?Number(e[2]):null},A=(o,c,e)=>{const n=M(c);return n?{isBackgroundImg:e,lcpImgIntrinsicWidth:n,lcpImgRenderedWidth:o,lcpImgWidthDelta:n?n>o?n-o:0:-1,lcpImgSrc:c}:{}},T=o=>{const c=o==null?void 0:o.naturalHeight;let e=o==null?void 0:o.clientHeight;return e===0&&(e=o.parentElement.clientHeight),{lcpImgIntrinsicHeight:c,lcpImgRenderedHeight:e,lcpImgHeightDelta:c?c>e?c-e:0:-1}},v=({lcpImgWidthDelta:o=0,lcpImgHeightDelta:c=0})=>o+c,h=({entries:o=[]},c)=>{var e;const{url:n,element:r}=(o==null?void 0:o.pop())||{},d=(r==null?void 0:r.className)||"unknown",s=(r==null||(e=r.tagName)===null||e===void 0?void 0:e.toLowerCase())||"",l=p(r),m=s==="img";let t={lcpSelector:d,lcpElementType:s,lcpCustomType:l};const a=(r==null?void 0:r.clientWidth)||c,f=!m&&s!=="video";return a&&n&&(t=Object.assign({},t,A(a,n,f))),!f&&n&&m&&(t=Object.assign({},t,T(r))),Object.assign({},t,{lcpTotalImageDelta:v(t)})},W=(o,{viewportWidth:c})=>{let{name:e}=o,n=y()(o,b);return e==="LCP"?h(n,c):e==="CLS"?j(n):e==="INP"?N(n):{}}},"6TzK":function(Q,O,i){"use strict";i.r(O),i.d(O,"shouldPrintPerfLogs",function(){return j}),i.d(O,"printPerfLogs",function(){return M}),i.d(O,"sendPerformanceMetrics",function(){return c}),i.d(O,"sendMetrics",function(){return n});var g=i("8OQS"),y=i.n(g),R=i("yXPU"),b=i.n(R),E=i("e0ae"),L=i("ddYX"),p=i("3Csl"),I=()=>{let t;return b()(function*(){return t||(t=Object.assign({webVitals:yield i.e(5).then(i.bind(null,"ONNR"))},yield Promise.resolve().then(i.bind(null,"3Csl")))),t||{}})};const B=["bot"];function j(){var t;return!!((t=window)!==null&&t!==void 0&&t.location&&new URL(window.location.href).searchParams.get("logperf"))}function M(){return A.apply(this,arguments)}function A(){return A=b()(function*(){const t=(yield i.e(22).then(i.bind(null,"94Vr"))).default,a=new t({analyticsTracker:f=>{const{metricName:w,data:C}=f,P=v(w,C);P&&console.log(`(perf) ${P}:`,C)}});window.perfume=a}),A.apply(this,arguments)}const T={navigationTiming:t=>t&&t.timeToFirstByte?"navigationTiming":"",fp:"firstPaint",fcp:"firstContentfulPaint",fid:"firstInputDelay",lcp:"largestContentfulPaint",lcpFinal:"largestContentfulPaintFinal",cls:"cumulativeLayoutShift",clsFinal:"cumulativeLayoutShiftFinal",tbt:"totalBlockingTime",tbt5S:"totalBlockingTime5S",tbt10S:"totalBlockingTime10S",tbtFinal:"totalBlockingTimeFinal"};function v(t,a){const f=T[t];return typeof f=="string"?f:typeof f=="function"?f(a):""}const h=I(),W=()=>{const t={apps:[]},a=document.getElementById("dm-outer-wrapper");a&&(t.templateId=(a==null?void 0:a.getAttribute("dmtemplateid"))||"unknown"),document.getElementById("d-notification-bar")&&t.apps.push("notificationBar");const w=document.getElementById("usercentrics-cmp");if(w){t.apps.push("usercentrics");try{t.isUserCentricOpen=!!w.shadowRoot.querySelector("[data-testid=uc-accept-all-button]")}catch(C){}}return t.apps.length||t.apps.push("noApps"),t},o={onINP:{durationThreshold:0,reportAllChanges:!0}};function c(){return e.apply(this,arguments)}function e(){return e=b()(function*({sendLog:t}={}){try{var a;const x=Object(E.a)(),{bot:F}=x,V=y()(x,B);F&&console.debug("Skipping sending vitals metrics for Bot browser");const{webVitals:U,collectExtraDataByMetric:X}=yield h();let $,D=yield Promise.all(Object.entries(U).map(function(){var K=b()(function*([k,z]){$||($=yield l(V));const J=yield new Promise(H=>z(H,o[k])),{name:S,delta:u}=J,Y=Object.assign({},$,{[S.toLowerCase()]:u||1e-6},X(J,$));return S.match(/CLS|LCP|FID|INP/)&&(console.debug(`sending { ${S.toLowerCase()}: ${u} } measurement`),n(Y)),Y});return function(k){return K.apply(this,arguments)}}()));D=D.reduce((K,k)=>Object.assign({},K,k),{});const G={logLevel:L.a.INFO,dataString:Object.assign({message:"collecting webvitals data",tags:["webvitals"]},D,{inpSelectors:Object(p.overThresholdInpSelectors)((a=D)===null||a===void 0?void 0:a.inpSelectors)},W())};if(t){var f;(f=G.dataString.inpSelectors)!==null&&f!==void 0&&f.length&&Object(L.b)(G)}return console.debug("sending web vitals",G),D}catch(x){if(t){var w,C,P;Object(L.b)({logLevel:L.a.ERROR,dataString:{message:"error sending webvitals analytics",error:JSON.stringify(x),siteAlias:(w=window)===null||w===void 0||(C=w.Parameters)===null||C===void 0?void 0:C.SiteAlias,pageUrl:(P=window)===null||P===void 0?void 0:P._currentPage.pageUrl}})}return Promise.reject(x)}}),e.apply(this,arguments)}function n(t){return r.apply(this,arguments)}function r(){return r=b()(function*(t){try{var a;const f=(a=window.rtCommonProps)===null||a===void 0?void 0:a["runtimecollector.url"];if(!f){console.log("Missing endpoint for runtimecollector");return}yield fetch(`${f}/performance/metrics`,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify(t)})}catch(f){console.log("Failed send metrics for web vitals",f)}}),r.apply(this,arguments)}const d=()=>{var t,a,f;if(!Intl)return[];const w=(t=Intl)===null||t===void 0||(a=t.DateTimeFormat())===null||a===void 0||(f=a.resolvedOptions())===null||f===void 0?void 0:f.timeZone;return w?w.split("/"):[]},s=()=>{try{const{rtt:t,downlink:a}=navigator.connection||navigator.mozConnection||navigator.webkitConnection;return t&&a?{downlink:a,rtt:t}:{}}catch(t){}return{}};function l(){return m.apply(this,arguments)}function m(){return m=b()(function*({name:t="unknown",version:a="unknown",os:f="unknown"}={}){var w,C,P,x,F,V,U,X,$,D;const{type:G="unknown",effectiveType:K="unknown"}=((w=navigator)===null||w===void 0?void 0:w.connection)||{},{innerWidth:k,innerHeight:z,_currentDevice:J,_currentPage:S,Parameters:u}=window,H=yield(navigator.serviceWorker||{getRegistration(){return Promise.resolve(null)}}).getRegistration("/"),Z=!!document.getElementById("criticalCss"),q=!!document.querySelector('[data-element-type="custom_extension"]');return Object.assign({userAgent:(C=navigator)===null||C===void 0?void 0:C.userAgent,device:J,connectionType:G,connectionSpeed:K,viewportWidth:k,viewportHeight:z,hasCriticalCss:Z,hasCustomWidgets:q,hasCustomCode:u==null?void 0:u.hasCustomCode,themeName:(u==null?void 0:u.CurrentThemeName)||"unknown",pageType:(u==null?void 0:u.pageType)||"unknown",browserName:t,browserVersion:a,os:f,firstVisit:!(H!=null&&H.active),pageUuid:(S==null||(P=S.pageContent)===null||P===void 0?void 0:P.uuid)||(u==null?void 0:u.InitialPageUuid)||`${S==null?void 0:S.pageID}`,serviceWorkerRunning:!!H,siteAlias:u==null?void 0:u.SiteAlias,pageUrl:S.pageUrl,pageAlias:S.pageAlias,isHomePage:S==null||(x=S.pageContent)===null||x===void 0?void 0:x.isHomePage,host:((F=window)===null||F===void 0||(V=F.location)===null||V===void 0?void 0:V.host)||"unknown",path:location.pathname,queryParams:(U=window)===null||U===void 0||(X=U.location)===null||X===void 0||($=X.search)===null||$===void 0||(D=$.replace("?",""))===null||D===void 0?void 0:D.split("&"),planId:(u==null?void 0:u.planID)||"unknown",timeZone:d(),customTemplateId:(u==null?void 0:u.customTemplateId)||"unknown",siteTemplateId:(u==null?void 0:u.siteTemplateId)||"unknown",productId:(u==null?void 0:u.productId)||"unknown"},u!=null&&u.PublicationDate?{lastPublishDate:u==null?void 0:u.PublicationDate}:{},s())}),m.apply(this,arguments)}},"8oxB":function(Q,O){var i=Q.exports={},g,y;function R(){throw new Error("setTimeout has not been defined")}function b(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?g=setTimeout:g=R}catch(v){g=R}try{typeof clearTimeout=="function"?y=clearTimeout:y=b}catch(v){y=b}})();function E(v){if(g===setTimeout)return setTimeout(v,0);if((g===R||!g)&&setTimeout)return g=setTimeout,setTimeout(v,0);try{return g(v,0)}catch(h){try{return g.call(null,v,0)}catch(W){return g.call(this,v,0)}}}function L(v){if(y===clearTimeout)return clearTimeout(v);if((y===b||!y)&&clearTimeout)return y=clearTimeout,clearTimeout(v);try{return y(v)}catch(h){try{return y.call(null,v)}catch(W){return y.call(this,v)}}}var p=[],N=!1,I,B=-1;function j(){!N||!I||(N=!1,I.length?p=I.concat(p):B=-1,p.length&&M())}function M(){if(!N){var v=E(j);N=!0;for(var h=p.length;h;){for(I=p,p=[];++B<h;)I&&I[B].run();B=-1,h=p.length}I=null,N=!1,L(v)}}i.nextTick=function(v){var h=new Array(arguments.length-1);if(arguments.length>1)for(var W=1;W<arguments.length;W++)h[W-1]=arguments[W];p.push(new A(v,h)),p.length===1&&!N&&E(M)};function A(v,h){this.fun=v,this.array=h}A.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={};function T(){}i.on=T,i.addListener=T,i.once=T,i.off=T,i.removeListener=T,i.removeAllListeners=T,i.emit=T,i.prependListener=T,i.prependOnceListener=T,i.listeners=function(v){return[]},i.binding=function(v){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(v){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},e0ae:function(Q,O,i){"use strict";(function(g){i.d(O,"a",function(){return A});var y=function(){for(var e=0,n=0,r=arguments.length;n<r;n++)e+=arguments[n].length;for(var d=Array(e),s=0,n=0;n<r;n++)for(var l=arguments[n],m=0,t=l.length;m<t;m++,s++)d[s]=l[m];return d},R=function(){function e(n,r,d){this.name=n,this.version=r,this.os=d,this.type="browser"}return e}(),b=function(){function e(n){this.version=n,this.type="node",this.name="node",this.os=g.platform}return e}(),E=function(){function e(n,r,d,s){this.name=n,this.version=r,this.os=d,this.bot=s,this.type="bot-device"}return e}(),L=function(){function e(){this.type="bot",this.bot=!0,this.name="bot",this.version=null,this.os=null}return e}(),p=function(){function e(){this.type="react-native",this.name="react-native",this.version=null,this.os=null}return e}(),N=/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/,I=/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/,B=3,j=[["aol",/AOLShield\/([0-9\._]+)/],["edge",/Edge\/([0-9\._]+)/],["edge-ios",/EdgiOS\/([0-9\._]+)/],["yandexbrowser",/YaBrowser\/([0-9\._]+)/],["kakaotalk",/KAKAOTALK\s([0-9\.]+)/],["samsung",/SamsungBrowser\/([0-9\.]+)/],["silk",/\bSilk\/([0-9._-]+)\b/],["miui",/MiuiBrowser\/([0-9\.]+)$/],["beaker",/BeakerBrowser\/([0-9\.]+)/],["edge-chromium",/EdgA?\/([0-9\.]+)/],["chromium-webview",/(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["phantomjs",/PhantomJS\/([0-9\.]+)(:?\s|$)/],["crios",/CriOS\/([0-9\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\.]+)(?:\s|$)/],["fxios",/FxiOS\/([0-9\.]+)/],["opera-mini",/Opera Mini.*Version\/([0-9\.]+)/],["opera",/Opera\/([0-9\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\.]+)(:?\s|$)/],["ie",/Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],["ie",/MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],["ie",/MSIE\s(7\.0)/],["bb10",/BB10;\sTouch.*Version\/([0-9\.]+)/],["android",/Android\s([0-9\.]+)/],["ios",/Version\/([0-9\._]+).*Mobile.*Safari.*/],["safari",/Version\/([0-9\._]+).*Safari/],["facebook",/FBAV\/([0-9\.]+)/],["instagram",/Instagram\s([0-9\.]+)/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Mobile/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Gecko\)$/],["searchbot",N]],M=[["iOS",/iP(hone|od|ad)/],["Android OS",/Android/],["BlackBerry OS",/BlackBerry|BB10/],["Windows Mobile",/IEMobile/],["Amazon OS",/Kindle/],["Windows 3.11",/Win16/],["Windows 95",/(Windows 95)|(Win95)|(Windows_95)/],["Windows 98",/(Windows 98)|(Win98)/],["Windows 2000",/(Windows NT 5.0)|(Windows 2000)/],["Windows XP",/(Windows NT 5.1)|(Windows XP)/],["Windows Server 2003",/(Windows NT 5.2)/],["Windows Vista",/(Windows NT 6.0)/],["Windows 7",/(Windows NT 6.1)/],["Windows 8",/(Windows NT 6.2)/],["Windows 8.1",/(Windows NT 6.3)/],["Windows 10",/(Windows NT 10.0)/],["Windows ME",/Windows ME/],["Open BSD",/OpenBSD/],["Sun OS",/SunOS/],["Chrome OS",/CrOS/],["Linux",/(Linux)|(X11)/],["Mac OS",/(Mac_PowerPC)|(Macintosh)/],["QNX",/QNX/],["BeOS",/BeOS/],["OS/2",/OS\/2/]];function A(e){return e?h(e):typeof document=="undefined"&&typeof navigator!="undefined"&&navigator.product==="ReactNative"?new p:typeof navigator!="undefined"?h(navigator.userAgent):o()}function T(e){return e!==""&&j.reduce(function(n,r){var d=r[0],s=r[1];if(n)return n;var l=s.exec(e);return!!l&&[d,l]},!1)}function v(e){var n=T(e);return n?n[0]:null}function h(e){var n=T(e);if(!n)return null;var r=n[0],d=n[1];if(r==="searchbot")return new L;var s=d[1]&&d[1].split(/[._]/).slice(0,3);s?s.length<B&&(s=y(s,c(B-s.length))):s=[];var l=s.join("."),m=W(e),t=I.exec(e);return t&&t[1]?new E(r,l,m,t[1]):new R(r,l,m)}function W(e){for(var n=0,r=M.length;n<r;n++){var d=M[n],s=d[0],l=d[1],m=l.exec(e);if(m)return s}return null}function o(){var e=typeof g!="undefined"&&g.version;return e?new b(g.version.slice(1)):null}function c(e){for(var n=[],r=0;r<e;r++)n.push("0");return n}}).call(this,i("8oxB"))}}])})();
