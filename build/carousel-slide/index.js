(()=>{"use strict";const e=window.wp.blocks,r=window.React,t=(window.wp.i18n,window.wp.blockEditor),i=[["core/image"],["core/heading",{placeholder:"Catchy Slide Title"}],["core/paragraph",{placeholder:"Add an engaging description for your slide here..."}]],l=JSON.parse('{"UU":"prolific/carousel-slide"}');(0,e.registerBlockType)(l.UU,{edit:function({attributes:e,setAttributes:l,clientId:n}){return l({blockId:(0,t.useBlockProps)({className:"swiper-slide"}).id}),(0,r.createElement)("swiper-slide",null,(0,r.createElement)(t.InnerBlocks,{template:i}))},save:function(){return(0,r.createElement)(t.InnerBlocks.Content,null)}})})();