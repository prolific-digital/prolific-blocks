(()=>{var e,l={343:(e,l,o)=>{"use strict";var t=o(609);const r=window.wp.blocks;o(942);const n=window.wp.i18n;var i,a=new Uint8Array(16);function c(){if(!i&&!(i="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return i(a)}const s=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var p=[],u=0;u<256;++u)p.push((u+256).toString(16).substr(1));const d=function(e){var l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,o=(p[e[l+0]]+p[e[l+1]]+p[e[l+2]]+p[e[l+3]]+"-"+p[e[l+4]]+p[e[l+5]]+"-"+p[e[l+6]]+p[e[l+7]]+"-"+p[e[l+8]]+p[e[l+9]]+"-"+p[e[l+10]]+p[e[l+11]]+p[e[l+12]]+p[e[l+13]]+p[e[l+14]]+p[e[l+15]]).toLowerCase();if(!function(e){return"string"==typeof e&&s.test(e)}(o))throw TypeError("Stringified UUID is invalid");return o},b=function(e,l,o){var t=(e=e||{}).random||(e.rng||c)();if(t[6]=15&t[6]|64,t[8]=63&t[8]|128,l){o=o||0;for(var r=0;r<16;++r)l[o+r]=t[r];return l}return d(t)},f=window.wp.element,m=window.wp.blockEditor,g=window.wp.components,v=window.wp.data;window.lodash;const h=JSON.parse('{"UU":"prolific/carousel"}'),k=(0,f.forwardRef)((function({icon:e,size:l=24,...o},t){return(0,f.cloneElement)(e,{width:l,height:l,...o,ref:t})})),w=window.wp.primitives;var y=o(848);const C=(0,y.jsx)(w.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,y.jsx)(w.Path,{d:"M16.375 4.5H4.625a.125.125 0 0 0-.125.125v8.254l2.859-1.54a.75.75 0 0 1 .68-.016l2.384 1.142 2.89-2.074a.75.75 0 0 1 .874 0l2.313 1.66V4.625a.125.125 0 0 0-.125-.125Zm.125 9.398-2.75-1.975-2.813 2.02a.75.75 0 0 1-.76.067l-2.444-1.17L4.5 14.583v1.792c0 .069.056.125.125.125h11.75a.125.125 0 0 0 .125-.125v-2.477ZM4.625 3C3.728 3 3 3.728 3 4.625v11.75C3 17.273 3.728 18 4.625 18h11.75c.898 0 1.625-.727 1.625-1.625V4.625C18 3.728 17.273 3 16.375 3H4.625ZM20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z",fillRule:"evenodd",clipRule:"evenodd"})});(0,r.registerBlockType)(h.UU,{icon:(0,t.createElement)(k,{icon:C}),edit:function({attributes:e,setAttributes:l,clientId:o}){const{spaceBetween:r,slidesPerView:i,spaceBetweenTablet:a,slidesPerViewTablet:c,spaceBetweenMobile:s,slidesPerViewMobile:p,navigation:u,pagination:d,scrollbar:h,allowTouchMove:k,keyboard:w,grabCursor:y,autoplay:C,delay:E,loop:S,draggable:x,pauseOnHover:P,transitionSpeed:T,a11yEnabled:N,autoHeight:B,centeredSlides:O,direction:R,freeMode:V,blockId:A,className:M,anchor:H,align:$,effect:I,customNav:U,customNavPrev:j,customNavNext:D,customNavPrevSvg:F,customNavNextSvg:L,navigationNextEl:G,navigationPrevEl:z}=e,Z=(0,m.useBlockProps)(),W=(0,f.useRef)(null),q=b(),[J,K]=(0,f.useState)(0),[X,Y]=(0,f.useState)(!0);l({blockId:Z.id});const Q=(0,f.useCallback)(_.debounce((()=>{Y(!1),setTimeout((()=>{Y(!0)}),300)}),300),[]),{innerBlocks:ee}=(0,v.useSelect)((e=>({innerBlocks:e("core/block-editor").getBlocks(o)})),[o]);(0,f.useEffect)((()=>{K(ee.length)}),[ee]),(0,f.useEffect)((()=>{W.current&&W.current.swiper&&W.current.swiper.update()}),[J]),(0,f.useEffect)((()=>{W.current&&Q()}),[Q,I,p,s,c,a,O,C,E,S,R,P,U,j,D]);const le=async e=>{const l=await fetch(e);return l.ok?(e=>{e=e.replace(/<!--[\s\S]*?-->/g,"");const l=(new DOMParser).parseFromString(e,"image/svg+xml");return l.querySelectorAll("*").forEach((e=>{e.removeAttribute("style"),"svg"===e.tagName.toLowerCase()&&(e.removeAttribute("width"),e.removeAttribute("height"))})),(new XMLSerializer).serializeToString(l)})(await l.text()):""};(0,f.useEffect)((()=>{l({navigationNextEl:`.custom-next-${q}`}),l({navigationPrevEl:`.custom-prev-${q}`})}),[]);const oe=(0,m.useInnerBlocksProps)({},{template:[["prolific/carousel-slide"],["prolific/carousel-slide"],["prolific/carousel-slide"],["prolific/carousel-slide"]]});return(0,t.createElement)(t.Fragment,null,(0,t.createElement)("div",{...Z},X&&(0,t.createElement)("swiper-container",{...oe,ref:W,"slides-per-view":i,direction:R,"space-between":r,navigation:u,...U&&{"navigation-next-el":G,"navigation-prev-el":z},pagination:d,scrollbar:h,"allow-touch-move":"false",keyboard:"false","grab-cursor":y,autoplay:C,"centered-slides":O,speed:T,loop:S,draggable:x,"pause-on-hover":P,...C&&{"autoplay-delay":E},..."none"!==I&&{effect:I},..."fade"===I&&{"fade-effect-cross-fade":"true"},breakpoints:`{\n              "1024": {\n                "slidesPerView": ${i},\n                "spaceBetween": ${r}\n              },\n              "768": {\n                "slidesPerView": ${c},\n                "spaceBetween": ${a}\n              },\n              "0": {\n                "slidesPerView": ${p},\n                "spaceBetween": ${s}\n              }\n            }`}),U&&(0,t.createElement)(t.Fragment,null,(0,t.createElement)("button",{className:`custom-prev custom-prev-${q}`},(0,t.createElement)("span",{dangerouslySetInnerHTML:{__html:F}}),(0,t.createElement)("span",{className:"screen-reader-text"},"Previous")),(0,t.createElement)("button",{className:`custom-next custom-next-${q}`},(0,t.createElement)("span",{dangerouslySetInnerHTML:{__html:L}}),(0,t.createElement)("span",{className:"screen-reader-text"},"Next")))),(0,t.createElement)(m.InspectorControls,null,(0,t.createElement)(g.PanelBody,{title:(0,n.__)("Slider Settings","prolific-blocks"),initialOpen:!0},(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Custom Navigation","prolific-blocks"),checked:U,onChange:e=>l({customNav:e}),help:(0,n.__)("Enable custom navigation arrows on the sides of the slider.","prolific-blocks")}),U&&(0,t.createElement)("div",{style:{display:"block",marginBottom:"20px"}},!j&&(0,t.createElement)(m.MediaUpload,{onSelect:async e=>{if(e&&e.url){const o=await le(e.url);l({customNavPrev:e.url,customNavPrevSvg:o})}},allowedTypes:["image/svg+xml"],render:({open:e})=>(0,t.createElement)(g.Button,{onClick:e,isPrimary:!0,style:{marginRight:"5px",marginBottom:"10px"}},(0,n.__)("Add Previous SVG","prolific-blocks"))}),j&&(0,t.createElement)(t.Fragment,null,(0,t.createElement)(g.Button,{onClick:()=>{l({customNavPrev:"",customNavPrevSvg:""})},isSecondary:!0,style:{display:"block",marginTop:"10px"}},(0,n.__)("Remove Previous SVG","prolific-blocks")),(0,t.createElement)("img",{src:j,alt:(0,n.__)("Custom Previous Button","prolific-blocks"),style:{display:"block",marginTop:"10px",maxWidth:"50px",maxHeight:"50px"}})),!D&&(0,t.createElement)(m.MediaUpload,{onSelect:async e=>{if(e&&e.url){const o=await le(e.url);l({customNavNext:e.url,customNavNextSvg:o})}},allowedTypes:["image/svg+xml"],render:({open:e})=>(0,t.createElement)(g.Button,{onClick:e,isPrimary:!0},(0,n.__)("Add Next SVG","prolific-blocks"))}),D&&(0,t.createElement)(t.Fragment,null,(0,t.createElement)(g.Button,{onClick:()=>{l({customNavNext:"",customNavNextSvg:""})},isSecondary:!0,style:{display:"block",marginTop:"10px"}},(0,n.__)("Remove Next SVG","prolific-blocks")),(0,t.createElement)("img",{src:D,alt:(0,n.__)("Custom Next Button","prolific-blocks"),style:{display:"block",marginTop:"10px",maxWidth:"50px",maxHeight:"50px"}}))),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Space Between Slides","prolific-blocks"),value:r,onChange:e=>l({spaceBetween:e}),min:0,max:100,help:(0,n.__)("Set the space between slides in pixels.","prolific-blocks")}),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Slides Per View","prolific-blocks"),value:i,onChange:e=>l({slidesPerView:e}),min:1,max:5,help:(0,n.__)("Define the number of slides visible at once.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Navigation","prolific-blocks"),checked:u,onChange:e=>l({navigation:e}),help:(0,n.__)("Enable navigation arrows on the sides of the slider.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Pagination","prolific-blocks"),checked:d,onChange:e=>l({pagination:e}),help:(0,n.__)("Show pagination dots below the slider.","prolific-blocks")})),(0,t.createElement)(g.PanelBody,{title:(0,n.__)("Advanced Settings","prolific-blocks"),initialOpen:!1},(0,t.createElement)(g.SelectControl,{label:(0,n.__)("Direction","prolific-blocks"),value:R,options:[{label:(0,n.__)("Horizontal","prolific-blocks"),value:"horizontal"},{label:(0,n.__)("Vertical","prolific-blocks"),value:"vertical"}],onChange:e=>l({direction:e}),help:(0,n.__)("Choose the direction of the slider.","prolific-blocks")}),(0,t.createElement)(g.SelectControl,{label:(0,n.__)("Effect","prolific-blocks"),value:I,options:[{label:(0,n.__)("Slide","prolific-blocks"),value:"slide"},{label:(0,n.__)("Fade","prolific-blocks"),value:"fade"},{label:(0,n.__)("Cube","prolific-blocks"),value:"cube"},{label:(0,n.__)("Cover Flow","prolific-blocks"),value:"coverflow"},{label:(0,n.__)("Flip","prolific-blocks"),value:"flip"},{label:(0,n.__)("Cards","prolific-blocks"),value:"cards"}],onChange:e=>l({effect:e}),help:(0,n.__)("Choose the effect for your slider.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Free Mode","prolific-blocks"),checked:V,onChange:e=>l({freeMode:e}),help:(0,n.__)("Enable free mode to allow slides to move freely.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Centered Slides","prolific-blocks"),checked:O,onChange:e=>l({centeredSlides:e}),help:(0,n.__)("Center the active slide in the carousel.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Auto Height","prolific-blocks"),checked:B,onChange:e=>l({autoHeight:e}),help:(0,n.__)("Allow heigh of each slide to determine height of carousel.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Scrollbar","prolific-blocks"),checked:h,onChange:e=>l({scrollbar:e}),help:(0,n.__)("Display a draggable scrollbar below the slider.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Allow Touch Move","prolific-blocks"),checked:k,onChange:e=>l({allowTouchMove:e}),help:(0,n.__)("Enable slide navigation by touch on mobile devices.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Keyboard Control","prolific-blocks"),checked:w,onChange:e=>l({keyboard:e}),help:(0,n.__)("Allow navigation using keyboard arrow keys.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Grab Cursor","prolific-blocks"),checked:y,onChange:e=>l({grabCursor:e}),help:(0,n.__)("Change cursor to 'grab' style when hovering over the slider.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Autoplay","prolific-blocks"),checked:C,onChange:e=>l({autoplay:e}),help:(0,n.__)("Automatically transition between slides.","prolific-blocks")}),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Autoplay Delay (ms)","prolific-blocks"),value:E,onChange:e=>l({delay:e}),min:1e3,max:1e4,help:(0,n.__)("Set the delay between autoplay transitions in milliseconds.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Loop","prolific-blocks"),checked:S,onChange:e=>l({loop:e}),help:(0,n.__)("Enable continuous loop mode for the slider.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Pause on Hover","prolific-blocks"),checked:P,onChange:e=>l({pauseOnHover:e}),help:(0,n.__)("Pause autoplay when the mouse hovers over the slider.","prolific-blocks")}),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Transition Speed (ms)","prolific-blocks"),value:T,onChange:e=>l({transitionSpeed:e}),min:100,max:2e3,help:(0,n.__)("Set the speed of slide transitions in milliseconds.","prolific-blocks")}),(0,t.createElement)(g.ToggleControl,{label:(0,n.__)("Accessibility","prolific-blocks"),checked:N,onChange:e=>l({a11yEnabled:e}),help:(0,n.__)("Enable accessibility features for screen readers.","prolific-blocks")})),(0,t.createElement)(g.PanelBody,{title:(0,n.__)("Tablet Settings","prolific-blocks"),initialOpen:!1},(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Space Between Slides","prolific-blocks"),value:a,onChange:e=>l({spaceBetweenTablet:e}),min:0,max:100,help:(0,n.__)("Set the space between slides in pixels for tablet devices.","prolific-blocks")}),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Slides Per View","prolific-blocks"),value:c,onChange:e=>l({slidesPerViewTablet:e}),min:1,max:5,help:(0,n.__)("Define the number of slides visible at once on tablet screens.","prolific-blocks")})),(0,t.createElement)(g.PanelBody,{title:(0,n.__)("Mobile Settings","prolific-blocks"),initialOpen:!1},(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Space Between Slides","prolific-blocks"),value:s,onChange:e=>l({spaceBetweenMobile:e}),min:0,max:100,help:(0,n.__)("Set the space between slides in pixels for mobile devices.","prolific-blocks")}),(0,t.createElement)(g.RangeControl,{label:(0,n.__)("Slides Per View","prolific-blocks"),value:p,onChange:e=>l({slidesPerViewMobile:e}),min:1,max:5,help:(0,n.__)("Define the number of slides visible at once on mobile screens.","prolific-blocks")}))))},save:function(){return(0,t.createElement)(m.InnerBlocks.Content,null)}})},20:(e,l,o)=>{"use strict";var t=o(609),r=Symbol.for("react.element"),n=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),i=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};l.jsx=function(e,l,o){var t,c={},s=null,p=null;for(t in void 0!==o&&(s=""+o),void 0!==l.key&&(s=""+l.key),void 0!==l.ref&&(p=l.ref),l)n.call(l,t)&&!a.hasOwnProperty(t)&&(c[t]=l[t]);if(e&&e.defaultProps)for(t in l=e.defaultProps)void 0===c[t]&&(c[t]=l[t]);return{$$typeof:r,type:e,key:s,ref:p,props:c,_owner:i.current}}},848:(e,l,o)=>{"use strict";e.exports=o(20)},609:e=>{"use strict";e.exports=window.React},942:(e,l)=>{var o;!function(){"use strict";var t={}.hasOwnProperty;function r(){for(var e="",l=0;l<arguments.length;l++){var o=arguments[l];o&&(e=i(e,n(o)))}return e}function n(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return r.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var l="";for(var o in e)t.call(e,o)&&e[o]&&(l=i(l,o));return l}function i(e,l){return l?e?e+" "+l:e+l:e}e.exports?(r.default=r,e.exports=r):void 0===(o=function(){return r}.apply(l,[]))||(e.exports=o)}()}},o={};function t(e){var r=o[e];if(void 0!==r)return r.exports;var n=o[e]={exports:{}};return l[e](n,n.exports,t),n.exports}t.m=l,e=[],t.O=(l,o,r,n)=>{if(!o){var i=1/0;for(p=0;p<e.length;p++){for(var[o,r,n]=e[p],a=!0,c=0;c<o.length;c++)(!1&n||i>=n)&&Object.keys(t.O).every((e=>t.O[e](o[c])))?o.splice(c--,1):(a=!1,n<i&&(i=n));if(a){e.splice(p--,1);var s=r();void 0!==s&&(l=s)}}return l}n=n||0;for(var p=e.length;p>0&&e[p-1][2]>n;p--)e[p]=e[p-1];e[p]=[o,r,n]},t.o=(e,l)=>Object.prototype.hasOwnProperty.call(e,l),(()=>{var e={704:0,200:0};t.O.j=l=>0===e[l];var l=(l,o)=>{var r,n,[i,a,c]=o,s=0;if(i.some((l=>0!==e[l]))){for(r in a)t.o(a,r)&&(t.m[r]=a[r]);if(c)var p=c(t)}for(l&&l(o);s<i.length;s++)n=i[s],t.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return t.O(p)},o=globalThis.webpackChunkprolific_blocks=globalThis.webpackChunkprolific_blocks||[];o.forEach(l.bind(null,0)),o.push=l.bind(null,o.push.bind(o))})();var r=t.O(void 0,[200],(()=>t(343)));r=t.O(r)})();