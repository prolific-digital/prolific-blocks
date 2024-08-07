(()=>{"use strict";var e,r={618:()=>{const e=window.wp.blocks,r=window.React,a=window.wp.i18n,l=window.wp.blockEditor,u=window.wp.components,t=window.wp.element,b=JSON.parse('{"UU":"prolific/hamburger"}');(0,e.registerBlockType)(b.UU,{edit:function({attributes:e,setAttributes:b}){const{hamburgerClass:n}=e,o=(0,l.useBlockProps)(),[s,i]=(0,t.useState)(!1);return(0,r.createElement)(r.Fragment,null,(0,r.createElement)(l.InspectorControls,null,(0,r.createElement)(u.PanelBody,{title:(0,a.__)("Hamburger Settings","text-domain")},(0,r.createElement)(u.SelectControl,{label:(0,a.__)("Select Hamburger Style","text-domain"),value:n,options:[{value:"hamburger--3dx",label:"3D X"},{value:"hamburger--3dx-r",label:"3D X Reverse"},{value:"hamburger--3dy",label:"3D Y"},{value:"hamburger--3dy-r",label:"3D Y Reverse"},{value:"hamburger--3dxy",label:"3D XY"},{value:"hamburger--3dxy-r",label:"3D XY Reverse"},{value:"hamburger--arrow",label:"Arrow"},{value:"hamburger--arrow-r",label:"Arrow Reverse"},{value:"hamburger--arrowalt",label:"Arrow Alt"},{value:"hamburger--arrowalt-r",label:"Arrow Alt Reverse"},{value:"hamburger--arrowturn",label:"Arrow Turn"},{value:"hamburger--arrowturn-r",label:"Arrow Turn Reverse"},{value:"hamburger--boring",label:"Boring"},{value:"hamburger--collapse",label:"Collapse"},{value:"hamburger--collapse-r",label:"Collapse Reverse"},{value:"hamburger--elastic",label:"Elastic"},{value:"hamburger--elastic-r",label:"Elastic Reverse"},{value:"hamburger--emphatic",label:"Emphatic"},{value:"hamburger--emphatic-r",label:"Emphatic Reverse"},{value:"hamburger--minus",label:"Minus"},{value:"hamburger--slider",label:"Slider"},{value:"hamburger--slider-r",label:"Slider Reverse"},{value:"hamburger--spin",label:"Spin"},{value:"hamburger--spin-r",label:"Spin Reverse"},{value:"hamburger--spring",label:"Spring"},{value:"hamburger--spring-r",label:"Spring Reverse"},{value:"hamburger--stand",label:"Stand"},{value:"hamburger--stand-r",label:"Stand Reverse"},{value:"hamburger--squeeze",label:"Squeeze"},{value:"hamburger--vortex",label:"Vortex"},{value:"hamburger--vortex-r",label:"Vortex Reverse"}],onChange:e=>b({hamburgerClass:e})}))),(0,r.createElement)("div",{...o},(0,r.createElement)("button",{className:`hamburger ${n} ${s?"is-active":""}`,type:"button",onClick:()=>{i(!s)}},(0,r.createElement)("span",{className:"hamburger-box"},(0,r.createElement)("span",{className:"hamburger-inner"})))))},save:function(){return null}})}},a={};function l(e){var u=a[e];if(void 0!==u)return u.exports;var t=a[e]={exports:{}};return r[e](t,t.exports,l),t.exports}l.m=r,e=[],l.O=(r,a,u,t)=>{if(!a){var b=1/0;for(i=0;i<e.length;i++){for(var[a,u,t]=e[i],n=!0,o=0;o<a.length;o++)(!1&t||b>=t)&&Object.keys(l.O).every((e=>l.O[e](a[o])))?a.splice(o--,1):(n=!1,t<b&&(b=t));if(n){e.splice(i--,1);var s=u();void 0!==s&&(r=s)}}return r}t=t||0;for(var i=e.length;i>0&&e[i-1][2]>t;i--)e[i]=e[i-1];e[i]=[a,u,t]},l.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{var e={657:0,877:0};l.O.j=r=>0===e[r];var r=(r,a)=>{var u,t,[b,n,o]=a,s=0;if(b.some((r=>0!==e[r]))){for(u in n)l.o(n,u)&&(l.m[u]=n[u]);if(o)var i=o(l)}for(r&&r(a);s<b.length;s++)t=b[s],l.o(e,t)&&e[t]&&e[t][0](),e[t]=0;return l.O(i)},a=globalThis.webpackChunkprolific_blocks=globalThis.webpackChunkprolific_blocks||[];a.forEach(r.bind(null,0)),a.push=r.bind(null,a.push.bind(a))})();var u=l.O(void 0,[877],(()=>l(618)));u=l.O(u)})();