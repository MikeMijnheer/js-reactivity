Object.prototype.compare=function(e,t){if(!e||!t)return!1;if(Object.keys(e).length!=Object.keys(t).length)return!1;for(var a in e){if(e.hasOwnProperty(a)!==t.hasOwnProperty(a))return!1;switch(typeof e[a]){case"object":if(!Object.compare(e[a],t[a]))return!1;break;case"function":if(void 0===t[a]||"compare"!=a&&e[a].toString()!=t[a].toString())return!1;break;default:if(e[a]!=t[a])return!1}}for(var a in t)if(void 0===e[a])return!1;return!0},Array.prototype.inArray=function(e){return-1!==this.indexOf(e)},Array.prototype.pushIfNotExist=function(e){this.inArray(e)||this.push(e)},Array.prototype.getDiff=function(e){var t=[];return this.forEach((a,r)=>{Object.compare(a,e[r])||t.push(r)}),t},Array.prototype.getLast=function(){return this[this.length-1]};class e{static deepCopy(e){return JSON.parse(JSON.stringify(e))}static getNested(e,t=self,a=!1,r="."){return e=a?"_refs."+e:e,(Array.isArray(e)?e:e.split(r)).reduce((e,t)=>e&&e[t],t)}static flatObject(e){return Object.keys(e).reduce((t,a)=>function e(t,a,r,o=""){const n=[o,a].filter(e=>e).join(".");return"object"==typeof r?Object.keys(r).reduce((t,a)=>e(t,a,r[a],n),t):Object.assign(t,{[n]:r})}(t,a,e[a]),{})}static isNumber(e){return/^\d+$/.test(e)}static getNestedFromObj(t){for(var a=t.scope,r="",o=t.name;!e.getNested(r+o,a,!0);){var n=a.appData.loop;if(!n)break;if(a=n.scope)r=`${n.name}.${n.index}.${r}`;else{var i=n.baseElement.appData.loop;a=i.scope,r=`${i.name}.${n.index}.${r}`}}return{controller:a,path:r+o,value:e.getNested(r+o,a,!0)}}}Element.prototype.setAppData=function(t,a=null){this.appData||(this.appData={}),a?this.appData[a]=t:this.appData=e.deepCopy(t)},Element.prototype.appendBefore=function(e){e.parentNode.insertBefore(this,e)},Element.prototype.appendAfter=function(e){e.parentNode.insertBefore(this,e.nextSibling)},Element.prototype.show=function(){this.classList.remove("hidden")},Element.prototype.hide=function(){this.classList.add("hidden")},Element.prototype.getController=function(e){var t=this.closest("[as="+e);return t?Store.controllers[t.nodeName]:null},Element.prototype.getLoop=function(e){var t=null;return Store.loops.forEach(a=>{var r=a.appData.loop;if(r.alias==e){if(a.contains(this))return void(t=a);r.siblingElements.forEach(e=>{e.contains(this)&&(t=e)})}}),t};class t{static get elements(){return[].concat(t.variables,t.loops,t.conditions)}}t.controllers=[],t.variables=[],t.loops=[],t.conditions=[];class a extends HTMLElement{constructor(){super();var e=this;this._refs=new Proxy({},{get(e,t){const a=e[t];return"object"==typeof a?new Proxy(a,this):a},set(a,r,o){var n=Util.deepCopy(a);a[r]=o;var i=t.controllers[e.nodeName];if(i){var p=[];t.elements.forEach(e=>{for(var t in e.appData)(e.appData[t].scope.nodeName==i.nodeName||Util.getNestedFromObj(e.appData[t].scope.appData.loop.baseElement.appData.loop).controller.nodeName==i.nodeName)&&p.pushIfNotExist(e)});var s=[];p.forEach(e=>{for(var t in e.appData){if(s.inArray(e))break;var n=[];Util.isNumber(r)?n.push(a):"length"==r?n.push(a,o):n.push(o),(Util.isNumber(r)||"length"==r||r==e.appData[t].name)&&n.forEach(a=>{var r,o;r=a,((o=Util.getNestedFromObj(e.appData[t])).value===r||"object"==typeof r&&Object.compare(o.value,r))&&s.pushIfNotExist(e)})}}),s.forEach(e=>{e.appData.loop&&executeLoop(e,n).then(()=>{initVariables(),initConditions(),initEvents()}),e.appData.variable&&executeVariable(e),e.appData.condition&&executeCondition(e)})}return!0}})}set refs(e){Object.assign(this._refs,e)}get refs(){return this._refs}}class r{static init(){window.addEventListener("DOMContentLoaded",()=>{(async function(){document.querySelectorAll("[as]").forEach(e=>{var a=e.getAttribute("as");e.setAppData({name:a},"controller");var r=e.nodeName;t.controllers[r]||(t.controllers[r]=e)})})().then(()=>{o().then(()=>{document.querySelectorAll("[var]").forEach(a=>{var r=a.getAttribute("var"),o=r.match(/(.*?)\.(.*)/),n=o?o[1]:r,i={scope:a.getController(n)||a.getLoop(n),name:o?o[2]:[]};a.setAppData(i,"variable"),a.removeAttribute("var"),t.variables.push(a),function(t){var a=t.appData.variable,r=a.scope,o=a.name;if(r.appData.loop){var n=r.appData.loop,i=e.getNestedFromObj(n.baseElement.appData.loop).value;t.innerHTML=e.getNested(o,i[n.index])}else t.innerHTML=e.getNested(o,r,!0)}(a)}),document.querySelectorAll("[if]").forEach(a=>{var r=a.getAttribute("if").match(/(.*?)\.(.*)/),o="!"==r[1].charAt(0);r[1]=r[1].replace("!","");var n={negative:o,scope:a.getController(r[1])||a.getLoop(r[1]),name:r[2]};a.setAppData(n,"condition"),a.removeAttribute("if"),t.conditions.push(a),function(t){var a=t.appData.condition;!!e.getNested(a.name,a.scope,!0)==!a.negative?t.show():t.hide()}(a)}),document.querySelectorAll("[click]").forEach(t=>{if(!t.appData||!t.appData.event){var a=t.getAttribute("click").match(/(.*?)\.(.*)/),r={name:"click",scope:t.getController(a[1]),method:a[2].match(/(.*)(?=\()/)[1],properties:(o=a[2].match(/(?<=\()(.*)(?=\))/)[1].split(","),o=o.map(a=>{if(a){if(/^'.*'$/.test(a))return a.match(/(?<=')(.*)(?=')/)[1];var r=a.match(/(.*?)\.(.*)/),o=t.getController(r[1])||t.getLoop(r[1]);return e.getNested(r[2],o,!0)}return null}))};t.setAppData(r,"event"),t.addEventListener(r.name,()=>r.scope[r.method](...r.properties))}var o})})})})}}async function o(){document.querySelectorAll("[loop]").forEach(a=>{var r=a.getAttribute("loop").split(" "),n=r[2].match(/(.*?)\.(.*)/),i={index:0,scope:a.getController(n[1])||a.getLoop(n[1]),name:n[2],alias:r[0],baseElement:a,siblingElements:[],template:a.innerHTML};a.setAppData(i,"loop"),a.removeAttribute("loop"),t.loops.push(a),async function(t,a=[],r=null,o=0){var n=t.appData.loop,i=n.siblingElements,p=e.getNestedFromObj(n).value;if(a.length){var s=a.length-p.length;s>0?function(e){for(var t=0;t<e;t++)i[i.length-1]&&(i[i.length-1].remove(),i.pop());a.length=p.length}(s):s<0&&l(p,p.length+s),a.getDiff(p).forEach(e=>{!function(e){(0==e?t:i[e-1]).innerHTML=n.template}(e)})}else i.length=0,l(p);function l(e,a=1){e.forEach((e,r)=>{if(r>=a){var o=document.createElement(t.nodeName);o.innerHTML=t.appData.loop.template,o.setAppData({index:r,baseElement:t},"loop"),o.appendAfter(i.getLast()||t),i.push(o)}})}}(a).then(o)})}export{a as Component,r as JsReactivity};