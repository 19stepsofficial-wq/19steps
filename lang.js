(function(){var k='19steps-lang';var l=null;try{l=localStorage.getItem(k)}catch(e){}
if(!l){l=(navigator.language||'en').toLowerCase().indexOf('th')===0?'th':'en'}
document.documentElement.lang=l;
window.toggleLang=function(){var n=document.documentElement.lang==='th'?'en':'th';document.documentElement.lang=n;try{localStorage.setItem(k,n)}catch(e){}};})();
