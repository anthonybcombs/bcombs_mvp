(function(){var P=document&&document.currentScript&&document.currentScript.src;(window.webpackJsonpruntime=window.webpackJsonpruntime||[]).push([[13],{"/I6Q":function(m,e){var o=/var\(--([^)]*)\)/g;m.exports=function(d){var p=window.CSS&&window.CSS.supports&&window.CSS.supports("--fake-var",0);return!p&&window.brandingColors&&(d=d.replace(o,function(c,y){return window.brandingColors[y]||c})),d||""}},V45n:function(m,e,o){"use strict";o.r(e),o.d(e,"init",function(){return B}),o.d(e,"initCountdown",function(){return S}),o.d(e,"updateDate",function(){return A}),o.d(e,"updateTime",function(){return z}),o.d(e,"updateTimeZone",function(){return U});var d=o("EOkx"),p=o("d2Kx"),c=o.n(p);const y=1e3*60,C=y*60,h=C*24,g={DAYS:".days",HOURS:".hours",MINUTES:".minutes",SECONDS:".seconds"},f={DAYS:".circle-days",HOURS:".circle-hours",MINUTES:".circle-minutes",SECONDS:".circle-seconds"},x="stroke-dasharray",l={};let v;function B(){S()}function S(){Array.from(document.querySelectorAll(".dmCountdown")).forEach(t=>{const{dueDate:i,dueTime:r,timeZone:a,created:s}=R({element:t});l[t.id]={element:t,dueTime:Object(d.a)(i,a).time(`${r}:00`),initialDays:Object(d.a)(s).diff(i)}}),clearTimeout(v),M()}function M(){const n=d.a.now();Object.keys(l).forEach(t=>{document.getElementById(t)?D({countdownId:t,timeNow:n}):delete l[t]}),Object.keys(l).length&&(v=setTimeout(M,1e3))}function D({countdownId:n,timeNow:t}){const{element:i,dueTime:r,initialDays:a}=l[n],s=t.diff(r).milliseconds;if(s>0){const u=L({time:s});T(Object.assign({element:i},u)),i.dataset.layoutCircle==="true"&&E(Object.assign({element:i,initialDays:a},u))}else O({countdownId:n})}function O({countdownId:n}){const{element:t}=l[n];t.querySelector(".countdown-message").style.display="block",T({element:t,days:0,hours:0,minutes:0,seconds:0}),t.dataset.displayCounter==="false"&&(t.querySelector(".countdown-clock").style.display="none"),t.dataset.layoutCircle==="true"&&E({element:t,initialDays:0,days:0,hours:0,minutes:0,seconds:0})}function A({date:n,countdownId:t}){b({countdownId:t,date:n})}function z({time:n,countdownId:t}){b({countdownId:t,time:n})}function U({timeZone:n,countdownId:t}){b({countdownId:t,timeZone:n})}function b({countdownId:n,date:t,time:i,timeZone:r}){const{element:a,dueTime:s}=l[n],u=t||a.dataset.date,N=i||a.dataset.time,I=r||a.dataset.timeZone;l[n]=Object.assign({},l[n],{dueTime:Object(d.a)(u,I).time(`${N}:00`),initialDays:d.a.now().diff(Object(d.a)(s)).days})}function R({element:n}){return{dueDate:n.dataset.date,dueTime:n.dataset.time,timeZone:n.dataset.timeZone,created:n.dataset.created}}function T({element:n,days:t,hours:i,minutes:r,seconds:a}){n.querySelector(g.DAYS).innerHTML=t.toString().padStart(2,"0"),n.querySelector(g.HOURS).innerHTML=i.toString().padStart(2,"0"),n.querySelector(g.MINUTES).innerHTML=r.toString().padStart(2,"0"),n.querySelector(g.SECONDS).innerHTML=a.toString().padStart(2,"0")}function E({element:n,initialDays:t,days:i,hours:r,minutes:a,seconds:s}){const u=j({initialDays:t,days:i,hours:r,minutes:a,seconds:s});n.querySelector(f.DAYS).setAttribute(x,`${u.days}, 100`),n.querySelector(f.HOURS).setAttribute(x,`${u.hours}, 100`),n.querySelector(f.MINUTES).setAttribute(x,`${u.minutes}, 100`),n.querySelector(f.SECONDS).setAttribute(x,`${u.seconds}, 100`)}function j({initialDays:n,days:t,hours:i,minutes:r,seconds:a}){return{days:n?w(t,n):0,hours:w(i,24),minutes:w(r,60),seconds:w(a,60)}}function L({time:n}){return{days:Math.floor(n/h),hours:Math.floor(n%h/C),minutes:Math.floor(n%C/y),seconds:Math.floor(n%y/1e3)}}function w(n,t){return Math.floor(n/t*100)}},d2Kx:function(m,e,o){var d=o("pUaY");typeof d=="string"&&(d=[[m.i,d,""]]);var p;p=o("/I6Q");var c={transform:"modules/common/cssVariablesPolyfill"};c.transform=p;var y=o("aET+")(d,c);d.locals&&(m.exports=d.locals)},pUaY:function(m,e,o){e=m.exports=o("I1BE")(!1),e.push([m.i,`.dmCountdown:dir(ltr) {
  margin-right: auto; }
  .dmCountdown:dir(rtl) {
  margin-left: auto; }
  .dmCountdown:dir(ltr) {
  margin-left: auto; }
  .dmCountdown:dir(rtl) {
  margin-right: auto; }
  .dmCountdown {
  -ms-flex-pack: center;
      justify-content: center;
  text-align: center;
  height: auto;
  margin-top: 0;
  margin-inline-end: auto;
  margin-bottom: 0;
  margin-inline-start: auto; }
  .dmCountdown .countdown:dir(ltr) {
    padding-right: 2px; }
  .dmCountdown .countdown:dir(rtl) {
    padding-left: 2px; }
  .dmCountdown .countdown:dir(ltr) {
    padding-left: 2px; }
  .dmCountdown .countdown:dir(rtl) {
    padding-right: 2px; }
  .dmCountdown .countdown {
    padding-top: 2px;
    padding-inline-end: 2px;
    padding-bottom: 2px;
    padding-inline-start: 2px; }
  .dmCountdown .container {
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: auto; }
  .dmCountdown .tile {
    position: relative;
    line-height: normal;
    -ms-flex: 1 1 auto;
        flex: 1 1 auto; }
  .dmCountdown .label-tile {
    position: relative;
    -ms-flex: 1 0 0%;
        flex: 1 0 0%;
    height: 100%; }
  .dmCountdown .tile:after {
    content: '';
    display: block;
    padding-top: 100%; }
  .dmCountdown .divider:dir(ltr) {
    margin-right: 12px; }
  .dmCountdown .divider:dir(rtl) {
    margin-left: 12px; }
  .dmCountdown .divider:dir(ltr) {
    margin-left: 12px; }
  .dmCountdown .divider:dir(rtl) {
    margin-right: 12px; }
  .dmCountdown .divider {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
        align-items: center;
    -ms-flex-pack: center;
        justify-content: center;
    -ms-flex: 0 1 auto;
        flex: 0 1 auto;
    margin-top: 12px;
    margin-inline-end: 12px;
    margin-bottom: 12px;
    margin-inline-start: 12px;
    color: #313131; }
  .dmCountdown .number {
    position: absolute;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -ms-flex-align: center;
        align-items: center;
    -ms-flex-pack: center;
        justify-content: center;
    top: 0;
    left: 0; }
  .dmCountdown .label {
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -ms-flex-align: center;
        align-items: center;
    -ms-flex-pack: center;
        justify-content: center; }
  .dmCountdown .title {
    text-align: center !important;
    margin-top: 0; }
  .dmCountdown .countdown-message {
    display: none; }
    .dmCountdown .countdown-message p {
      text-align: center !important; }
  .dmCountdown .message-spacing {
    margin-top: 20px; }
  .dmCountdown .divider.hidden {
    visibility: hidden !important;
    text-decoration: none !important;
    line-height: 0; }
  .dmCountdown[data-layout='layout-1'] {
    width: 600px; }
    .dmCountdown[data-layout='layout-1'] .number {
      background-color: transparent;
      box-shadow: none;
      font-weight: normal;
      font-size: 42px;
      color: #101010; }
    .dmCountdown[data-layout='layout-1'] .label {
      font-size: 16px;
      padding-top: 5px; }
    .dmCountdown[data-layout='layout-1'] .divider:dir(ltr) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-1'] .divider:dir(rtl) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-1'] .divider:dir(ltr) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-1'] .divider:dir(rtl) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-1'] .divider {
      visibility: hidden;
      margin-top: 0;
      margin-inline-end: 12px;
      margin-bottom: 0;
      margin-inline-start: 12px; }
    .dmCountdown[data-layout='layout-1'] .tile-circle {
      stroke-dashoffset: 0; }
  .dmCountdown[data-layout='layout-2'] {
    width: 586px; }
    .dmCountdown[data-layout='layout-2'] .number {
      font-size: 42px;
      color: #fff;
      background-color: #000;
      font-weight: normal;
      border-radius: 5%;
      box-shadow: none; }
    .dmCountdown[data-layout='layout-2'] .label {
      font-size: 16px;
      padding-top: 10px;
      color: #b9b9b9; }
    .dmCountdown[data-layout='layout-2'] .divider:dir(ltr) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-2'] .divider:dir(rtl) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-2'] .divider:dir(ltr) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-2'] .divider:dir(rtl) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-2'] .divider {
      font-size: 42px;
      margin-top: 0;
      margin-inline-end: 12px;
      margin-bottom: 0;
      margin-inline-start: 12px; }
  .dmCountdown[data-layout='layout-3'] {
    width: 586px; }
    .dmCountdown[data-layout='layout-3'] .number {
      font-size: 42px;
      color: #000000;
      background-color: #ffffff;
      border-radius: 5%;
      box-shadow: 0 8px 20px 0 rgba(73, 73, 73, 0.25);
      font-weight: normal; }
    .dmCountdown[data-layout='layout-3'] .label {
      font-size: 16px;
      padding-top: 10px;
      color: #b9b9b9; }
    .dmCountdown[data-layout='layout-3'] .divider:dir(ltr) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-3'] .divider:dir(rtl) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-3'] .divider:dir(ltr) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-3'] .divider:dir(rtl) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-3'] .divider {
      font-size: 42px;
      margin-top: 0;
      margin-inline-end: 12px;
      margin-bottom: 0;
      margin-inline-start: 12px;
      visibility: hidden; }
  .dmCountdown[data-layout='layout-4'] {
    width: 586px; }
    .dmCountdown[data-layout='layout-4'] .number {
      font-size: 60px;
      color: #313131;
      background-color: transparent;
      box-shadow: none;
      height: 100%;
      width: 100%; }
    .dmCountdown[data-layout='layout-4'] .label {
      font-size: 16px;
      color: #b9b9b9; }
    .dmCountdown[data-layout='layout-4'] .divider:dir(ltr) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-4'] .divider:dir(rtl) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-4'] .divider:dir(ltr) {
      margin-left: 12px; }
    .dmCountdown[data-layout='layout-4'] .divider:dir(rtl) {
      margin-right: 12px; }
    .dmCountdown[data-layout='layout-4'] .divider {
      font-size: 60px;
      margin-top: 0;
      margin-inline-end: 12px;
      margin-bottom: 0;
      margin-inline-start: 12px; }
    .dmCountdown[data-layout='layout-4'] .tile:after {
      padding-top: 0; }

.dmMobileBody .dmCountdown .number {
  font-size: 22.5px; }

.dmMobileBody .dmCountdown .label {
  padding-top: 3px;
  font-size: 12px; }

.dmMobileBody .dmCountdown .divider:dir(ltr) {
  margin-right: 4px; }

.dmMobileBody .dmCountdown .divider:dir(rtl) {
  margin-left: 4px; }

.dmMobileBody .dmCountdown .divider:dir(ltr) {
  margin-left: 4px; }

.dmMobileBody .dmCountdown .divider:dir(rtl) {
  margin-right: 4px; }

.dmMobileBody .dmCountdown .divider {
  margin-top: 0;
  margin-inline-end: 4px;
  margin-bottom: 0;
  margin-inline-start: 4px;
  font-size: 22px; }

.dmMobileBody .dmCountdown[data-layout='layout-1'] .divider:dir(ltr) {
  margin-right: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-1'] .divider:dir(rtl) {
  margin-left: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-1'] .divider:dir(ltr) {
  margin-left: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-1'] .divider:dir(rtl) {
  margin-right: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-1'] .divider {
  margin-top: 0;
  margin-inline-end: 2px;
  margin-bottom: 0;
  margin-inline-start: 2px;
  font-size: 19px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .divider:dir(ltr) {
  margin-right: 5px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .divider:dir(rtl) {
  margin-left: 5px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .divider:dir(ltr) {
  margin-left: 5px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .divider:dir(rtl) {
  margin-right: 5px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .divider {
  margin-top: 0;
  margin-inline-end: 5px;
  margin-bottom: 0;
  margin-inline-start: 5px;
  font-size: 22px; }

.dmMobileBody .dmCountdown[data-layout='layout-2'] .label {
  padding-top: 6px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .divider:dir(ltr) {
  margin-right: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .divider:dir(rtl) {
  margin-left: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .divider:dir(ltr) {
  margin-left: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .divider:dir(rtl) {
  margin-right: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .divider {
  margin-top: 0;
  margin-inline-end: 2px;
  margin-bottom: 0;
  margin-inline-start: 2px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .label {
  padding-top: 6px; }

.dmMobileBody .dmCountdown[data-layout='layout-3'] .number {
  font-size: 28px; }
`,""])}}])})();
