import Util from '../util/util.js';
import Store from '../models/store.js';

Element.prototype.setAppData = function (value, property = null) {
    if (!this.appData) {
        this.appData = {};
    }
    if (property) {
        this.appData[property] = value;
    } else {
        this.appData = Util.deepCopy(value);
    }
}, false;

Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;

Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}, false;

Element.prototype.show = function () {
    this.classList.remove('hidden');
}, false;

Element.prototype.hide = function () {
    this.classList.add('hidden');
}, false;

Element.prototype.getController = function (alias) {
    var controller = this.closest(`[as=${alias}`);
    if (controller) {
        return Store.controllers[controller.nodeName];
    } else {
        return null;
    }
}, false;

Element.prototype.getLoop = function (alias) {
    var baseLoop = null;
    Store.loops.forEach(loop => {
        var loopData = loop.appData.loop;
        if (loopData.alias == alias) {
            if (loop.contains(this)) {
                baseLoop = loop;
                return;
            }

            loopData.siblingElements.forEach(element => {
                if (element.contains(this)) {
                    baseLoop = element;
                    return;
                }
            });
        }
    });
    return baseLoop;
}, false;