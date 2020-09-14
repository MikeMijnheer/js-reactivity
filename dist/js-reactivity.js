Object.prototype.compare=function(t,e){if(!t||!e)return!1;if(Object.keys(t).length!=Object.keys(e).length)return!1;for(var n in t){if(t.hasOwnProperty(n)!==e.hasOwnProperty(n))return!1;switch(typeof t[n]){case"object":if(!Object.compare(t[n],e[n]))return!1;break;case"function":if(void 0===e[n]||"compare"!=n&&t[n].toString()!=e[n].toString())return!1;break;default:if(t[n]!=e[n])return!1}}for(var n in e)if(void 0===t[n])return!1;return!0},Array.prototype.inArray=function(t){return-1!==this.indexOf(t)},Array.prototype.pushIfNotExist=function(t){this.inArray(t)||this.push(t)},Array.prototype.getDiff=function(t){var e=[];return this.forEach(function(n,o){Object.compare(n,t[o])||e.push(o)}),e},Array.prototype.getLast=function(){return this[this.length-1]};var t=function(){function t(){}return t.deepCopy=function(t){return JSON.parse(JSON.stringify(t))},t.getNested=function(t,e,n,o){return void 0===e&&(e=self),void 0===n&&(n=!1),void 0===o&&(o="."),t=n?"_refs."+t:t,(Array.isArray(t)?t:t.split(o)).reduce(function(t,e){return t&&t[e]},e)},t.flatObject=function(t){return Object.keys(t).reduce(function(e,n){return function t(e,n,o,r){var i;void 0===r&&(r="");var a=[r,n].filter(function(t){return t}).join(".");return"object"==typeof o?Object.keys(o).reduce(function(e,n){return t(e,n,o[n],a)},e):Object.assign(e,((i={})[a]=o,i))}(e,n,t[n])},{})},t.isNumber=function(t){return/^\d+$/.test(t)},t.getNestedFromObj=function(e){for(var n=null==e?void 0:e.scope,o="",r=null==e?void 0:e.name;!t.getNested(o+r,n,!0);){var i,a=null===(i=n)||void 0===i?void 0:i.appData.loop;if(!a)break;if(n=a.scope)o=a.name+"."+a.index+"."+o;else{var c=a.baseElement.appData.loop;n=c.scope,o=c.name+"."+a.index+"."+o}}return{controller:n,path:o+r,value:t.getNested(o+r,n,!0)}},t}();function e(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function n(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}function o(t){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function r(t,e){return(r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function a(t,e,n){return(a=i()?Reflect.construct:function(t,e,n){var o=[null];o.push.apply(o,e);var i=new(Function.bind.apply(t,o));return n&&r(i,n.prototype),i}).apply(null,arguments)}function c(t){var e="function"==typeof Map?new Map:void 0;return(c=function(t){if(null===t||-1===Function.toString.call(t).indexOf("[native code]"))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return a(t,arguments,o(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),r(n,t)})(t)}var u=function(){function t(){}return n(t,null,[{key:"elements",get:function(){return[].concat(t.variables,t.loops,t.conditions)}}]),t}();u.controllers=[],u.variables=[],u.loops=[],u.conditions=[],Element.prototype.setAppData=function(e,n){void 0===n&&(n=null),this.appData||(this.appData={}),n?this.appData[n]=e:this.appData=t.deepCopy(e)},Element.prototype.appendBefore=function(t){t.parentNode.insertBefore(this,t)},Element.prototype.appendAfter=function(t){t.parentNode.insertBefore(this,t.nextSibling)},Element.prototype.show=function(){this.classList.remove("hidden")},Element.prototype.hide=function(){this.classList.add("hidden")},Element.prototype.getController=function(t){var e=this.closest("[as="+t);return e?u.controllers[e.nodeName]:null},Element.prototype.getLoop=function(t){var e=this,n=null;return u.loops.forEach(function(o){var r=o.appData.loop;if(r.alias==t){if(o.contains(e))return void(n=o);r.siblingElements.forEach(function(t){t.contains(e)&&(n=t)})}}),n};var p={initControllers:function(){try{return document.querySelectorAll("[as]").forEach(function(t){var e=t.getAttribute("as");t.setAppData({name:e},"controller");var n=t.nodeName;u.controllers[n]||(u.controllers[n]=t)}),Promise.resolve()}catch(t){return Promise.reject(t)}},initLoops:function(){try{return document.querySelectorAll("[loop]").forEach(function(t){var e=t.getAttribute("loop").split(" "),n=e[2].match(/(.*?)\.(.*)/),o={index:0,scope:t.getController(n[1])||t.getLoop(n[1]),name:n[2],alias:e[0],baseElement:t,siblingElements:[],template:t.innerHTML};t.setAppData(o,"loop"),t.removeAttribute("loop"),u.loops.push(t),p.executeLoop(t).then(p.initLoops)}),Promise.resolve()}catch(t){return Promise.reject(t)}},executeLoop:function(e,n){void 0===n&&(n=[]);try{var o=function(t,n){void 0===n&&(n=1),null==t||t.forEach(function(t,o){if(o>=n){var r=document.createElement(e.nodeName);r.innerHTML=e.appData.loop.template,r.setAppData({index:o,baseElement:e},"loop"),r.appendAfter(i.getLast()||e),i.push(r)}})},r=e.appData.loop,i=r.siblingElements,a=t.getNestedFromObj(r).value;if(n.length){var c=n.length-a.length;c>0?function(t){for(var e=0;e<t;e++)i[i.length-1]&&(i[i.length-1].remove(),i.pop());n.length=a.length}(c):c<0&&o(a,a.length+c),n.getDiff(a).forEach(function(t){!function(t){(0==t?e:i[t-1]).innerHTML=r.template}(t)})}else i.length=0,o(a);return Promise.resolve()}catch(t){return Promise.reject(t)}},initVariables:function(){document.querySelectorAll("[var]").forEach(function(t){var e=t.getAttribute("var"),n=e.match(/(.*?)\.(.*)/),o=n?n[1]:e,r={scope:t.getController(o)||t.getLoop(o),name:n?n[2]:[]};t.setAppData(r,"variable"),t.removeAttribute("var"),u.variables.push(t),p.executeVariable(t)})},executeVariable:function(e){var n=e.appData.variable,o=n.scope,r=n.name;if(o.appData.loop){var i=o.appData.loop,a=t.getNestedFromObj(i.baseElement.appData.loop).value;(null==a?void 0:a.length)&&(e.innerHTML=t.getNested(r,a[i.index]))}else e.innerHTML=t.getNested(r,o,!0)},initConditions:function(){document.querySelectorAll("[if]").forEach(function(t){var e=t.getAttribute("if").match(/(.*?)\.(.*)/),n="!"==e[1].charAt(0);e[1]=e[1].replace("!","");var o={negative:n,scope:t.getController(e[1])||t.getLoop(e[1]),name:e[2]};t.setAppData(o,"condition"),t.removeAttribute("if"),u.conditions.push(t),p.executeCondition(t)})},executeCondition:function(e){var n=e.appData.condition;!!t.getNested(n.name,n.scope,!0)==!n.negative?e.show():e.hide()},initEvents:function(){document.querySelectorAll("[click]").forEach(function(e){if(!e.appData||!e.appData.event){var n=e.getAttribute("click").match(/(.*?)\.(.*)/),o={name:"click",scope:e.getController(n[1]),method:n[2].match(/(.*)(?=\()/)[1],properties:(r=n[2].match(/(\()(.*)(?=\))/)[2].split(","),r=r.map(function(n){if(n){if(/^'.*'$/.test(n))return n.match(/'(.*)'/)[1].replace("'","");var o=n.match(/(.*?)\.(.*)/),r=e.getController(o[1])||e.getLoop(o[1]);return t.getNested(o[2],r,!0)}return null}))};e.setAppData(o,"event"),e.addEventListener(o.name,function(){var t;return(t=o.scope)[o.method].apply(t,o.properties)})}var r})},cleanDom:function(){["as","loop","var","if"].forEach(function(t){document.querySelectorAll("["+t+"]").forEach(function(e){return e.removeAttribute(t)})})}},l=function(e){var o,r;function i(){var t;return(t=e.call(this)||this)._refs=null,t}return r=e,(o=i).prototype=Object.create(r.prototype),o.prototype.constructor=o,o.__proto__=r,i.prototype.observe=function(e,n){void 0===n&&(n=null);var o=this;return new Proxy(e,{get:function(t,e){var n=t[e];return"object"==typeof n?new Proxy(n,this):n},set:function(e,r,i){"function"==typeof n&&n(r,i);var a=t.deepCopy(e);e[r]=i;var c=u.controllers[o.nodeName];if(c){var l=[];u.elements.forEach(function(e){for(var n in e.appData){var o;if((null===(o=e.appData[n].scope)||void 0===o?void 0:o.nodeName)==c.nodeName)l.pushIfNotExist(e);else{var r,i=null===(r=e.appData[n].scope)||void 0===r?void 0:r.appData.loop.baseElement.appData.loop,a=t.getNestedFromObj(i).controller;(null==a?void 0:a.nodeName)==c.nodeName&&l.pushIfNotExist(e)}}});var s=[];l.forEach(function(n){for(var o in n.appData){if(s.inArray(n))break;var a=[];t.isNumber(r)?a.push(e):"length"==r?a.push(e,i):a.push(i),(t.isNumber(r)||"length"==r||r==n.appData[o].name)&&a.forEach(function(e){var r,i;r=e,((i=t.getNestedFromObj(n.appData[o])).value===r||"object"==typeof r&&Object.compare(i.value,r))&&s.pushIfNotExist(n)})}}),s.forEach(function(t){t.appData.loop&&p.executeLoop(t,a).then(function(){p.initVariables(),p.initConditions(),p.initEvents()}),t.appData.variable&&p.executeVariable(t),t.appData.condition&&p.executeCondition(t)})}return!0}})},n(i,[{key:"refs",set:function(t){this._refs=this.observe(t)},get:function(){return this._refs}}]),i}(c(HTMLElement)),s=function(){function t(){}return t.init=function(){try{return p.initControllers().then(function(){p.initLoops().then(function(){p.initVariables(),p.initConditions(),p.initEvents()})}),Promise.resolve()}catch(t){return Promise.reject(t)}},t}();exports.Component=l,exports.JsReactivity=s;
