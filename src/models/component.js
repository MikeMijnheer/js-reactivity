import Store from './store.js';
import Util from '../util/util.js';
import Helper from '../util/helpers.js';

export class Component extends HTMLElement {
    constructor() {
        super();
        var self = this;

        this._refs = new Proxy({}, {
            get(target, key) {
                const v = target[key];
                return typeof v == 'object' ? new Proxy(v, this) : v;
            },
            set(target, key, value) {
                // The goal is to find only the elements that make use of the updated obj
                // On those elements we execute its variable/loop/condition again, so the view is updated
                var targetCopy = Util.deepCopy(target); // targetCopy = the current obj
                target[key] = value; // target = the updated obj

                // Get the controller belonging to the node that has the refs Proxy
                // If there is none, that means that there are no updates triggered yet other than initial initialization
                var controller = Store.controllers[self.nodeName];
                if (controller) {

                    // We only filter the elements that make use of this controller we are in
                    // they are the only ones that are able to make use of the updated obj
                    var elements = [];
                    Store.elements.forEach(element => {
                        for (var prop in element.appData) { // prop = variable/loop/condition

                            if (element.appData[prop].scope?.nodeName == controller.nodeName) {
                                elements.pushIfNotExist(element);
                            } else {
                                var loop = element.appData[prop].scope?.appData.loop.baseElement.appData.loop;
                                var scopeFromLoop = Util.getNestedFromObj(loop).controller;
                                if (scopeFromLoop?.nodeName == controller.nodeName) {
                                    elements.pushIfNotExist(element);
                                }
                            }
                        }
                    });

                    // Try to find the elements that have the updated obj, if found, add it to the elementsToUpdate array
                    // On each element we will try later to execute the variable, loop and condition, so we need to add
                    // it only once (if not exists already)
                    var elementsToUpdate = [];
                    elements.forEach(element => {
                        for (var prop in element.appData) { // prop = variable/loop/condition

                            if (!elementsToUpdate.inArray(element)) {
                                // Key can be numeric (set obj[index] = value),
                                // or length (set obj.length = value (triggered only array methods like push/splice/pop)),
                                // or a property name (set obj.property = value)
                                var matchValues = [];
                                if (Util.isNumber(key)) { matchValues.push(target) } // match with updated obj
                                else if (key == 'length') { matchValues.push(target, value) } // get both elements that are using the array and are referencing length of the array
                                else { matchValues.push(value) } // match with the value that has been set

                                if (Util.isNumber(key) || key == 'length' || key == element.appData[prop].name) {
                                    matchValues.forEach(matchValue => {
                                        if (findElement(element.appData[prop], matchValue)) {
                                            elementsToUpdate.pushIfNotExist(element);
                                        }
                                    });
                                }
                            } else {
                                break;
                            }
                        }
                    });

                    function findElement(input, compare) {
                        // Filter the element who's value is the same as the updated obj value
                        var nested = Util.getNestedFromObj(input);
                        if (nested.value === compare || (typeof compare === 'object' && Object.compare(nested.value, compare))) {
                            return true;
                        }
                        return false;
                    }

                    elementsToUpdate.forEach(element => {
                        if (element.appData.loop) {
                            Helper.executeLoop(element, targetCopy).then(() => {
                                Helper.initVariables();
                                Helper.initConditions();
                                Helper.initEvents();
                            });
                        }

                        if (element.appData.variable) {
                            Helper.executeVariable(element);
                        }

                        if (element.appData.condition) {
                            Helper.executeCondition(element);
                        }
                    });
                }
                return true;
            }
        });
    }

    set refs(value) {
        Object.assign(this._refs, value)
    }

    get refs() {
        return this._refs;
    }
}