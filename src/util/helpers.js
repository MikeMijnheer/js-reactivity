import Util from './util.js';
import Store from '../models/store';

const helpers =  {
    async initControllers() {
        var controllers = document.querySelectorAll('[as]');
        controllers.forEach(element => {
            var value = element.getAttribute('as');
            var controller = {
                name: value
            }
            element.setAppData(controller, 'controller');
    
            var node = element.nodeName;
            if (!Store.controllers[node]) {
                Store.controllers[node] = element;
            }
        });
        return;
    },    

    async initLoops() {
        var loops = document.querySelectorAll('[loop]');
        loops.forEach(element => {
            var value = element.getAttribute('loop');
            var statement = value.split(' ');
            var array = statement[2].match(/(.*?)\.(.*)/); // group before first dot, group after first dot
    
            var loop = {
                index: 0,
                scope: element.getController(array[1]) || element.getLoop(array[1]),
                name: array[2],
                alias: statement[0],
                baseElement: element,
                siblingElements: [],
                template: element.innerHTML
            }
    
            element.setAppData(loop, 'loop');
            element.removeAttribute('loop');
            Store.loops.push(element);
    
            // Now execute the loop
            // Then init again, because loops can create loops in the execution
            helpers.executeLoop(element).then(helpers.initLoops);
        });
    
        if (!loops.length) {
            return;
        }
    },  

    async executeLoop(loopElement, currArray = []) {
        var loopData = loopElement.appData.loop;
        var currElements = loopData.siblingElements;
        var newArray = Util.getNestedFromObj(loopData).value;
    
        if (!currArray.length) {
            // There are no current items, so it's the first time, create all new
            currElements.length = 0;
            createElements(newArray);
        } else {
            var lengthDiff = currArray.length - newArray.length;
    
            if (lengthDiff > 0) {
                // New array has less items, get rid of them
                removeElements(lengthDiff);
            } else if (lengthDiff < 0) {
                // New array has more items, create them
                createElements(newArray, newArray.length + lengthDiff);
            }
    
            var diffIndexes = currArray.getDiff(newArray);
            diffIndexes.forEach(index => {
                // This element has changed since last time, so update it
                updateElement(index);
            });
        }
    
        function removeElements(amount) {
            for (var i = 0; i < amount; i++) {
                if (currElements[currElements.length - 1]) {
                    currElements[currElements.length - 1].remove();
                    currElements.pop();
                }
            }
            currArray.length = newArray.length;
        }
    
        function updateElement(index) {
            var element = index == 0 ? loopElement : currElements[index - 1];
            element.innerHTML = loopData.template;
        }
    
        function createElements(array, fromIndex = 1) {
            array?.forEach((value, index) => {
                if (index >= fromIndex) {
                    var element = document.createElement(loopElement.nodeName);
                    element.innerHTML = loopElement.appData.loop.template;
                    var loop = {
                        index: index,
                        baseElement: loopElement
                    }
                    element.setAppData(loop, 'loop');
                    element.appendAfter(currElements.getLast() || loopElement);
                    currElements.push(element);
                }
            });
        }
    
        return;
    },
    
    initVariables() {
        var variables = document.querySelectorAll('[var]');
        variables.forEach(element => {
            var attribute = element.getAttribute('var');
            var value = attribute.match(/(.*?)\.(.*)/); // group before first dot, group after first dot
            var controllerName = value ? value[1] : attribute;
    
            var variable = {
                scope: element.getController(controllerName) || element.getLoop(controllerName),
                name: value ? value[2] : []
            };
            element.setAppData(variable, 'variable');
            element.removeAttribute('var');
            Store.variables.push(element);
    
            // Exectute variable
            helpers.executeVariable(element);
        });
    },
    
    executeVariable(variableElement) {
        var variable = variableElement.appData.variable;
        var scope = variable.scope;
        var name = variable.name;
    
        if (scope.appData.loop) {
            var loopData = scope.appData.loop;
            var baseLoop = loopData.baseElement.appData.loop;
            var actualArray = Util.getNestedFromObj(baseLoop).value;
            if(actualArray?.length) variableElement.innerHTML = Util.getNested(name, actualArray[loopData.index]);
        } else {
            variableElement.innerHTML = Util.getNested(name, scope, true);
        }
    },
    
    initConditions() {
        var conditions = document.querySelectorAll('[if]');
        conditions.forEach(element => {
            var value = element.getAttribute('if').match(/(.*?)\.(.*)/); // group before first dot, group after first dot
            var negative = value[1].charAt(0) == '!';
            value[1] = value[1].replace('!', '');
    
            var condition = {
                negative: negative,
                scope: element.getController(value[1]) || element.getLoop(value[1]),
                name: value[2]
            }
    
            element.setAppData(condition, 'condition');
            element.removeAttribute('if');
            Store.conditions.push(element);
    
            // Exectute condition
            helpers.executeCondition(element);
        });
    },
    
    executeCondition(conditionElement) {
        var condition = conditionElement.appData.condition;
        var scope = condition.scope;
        var name = condition.name;
    
        if ((Util.getNested(name, scope, true) ? true : false) == !condition.negative) {
            conditionElement.show();
        } else {
            conditionElement.hide();
        }
    },
    
    initEvents() {
        var clickEvents = document.querySelectorAll('[click]');
        clickEvents.forEach(element => {
            if (!element.appData || !element.appData.event) {
                var value = element.getAttribute('click').match(/(.*?)\.(.*)/); // group before first dot, group after first dot
                var event = {
                    name: 'click',
                    scope: element.getController(value[1]),
                    method: value[2].match(/(.*)(?=\()/)[1],
                    properties: convertProperties(value[2].match(/(\()(.*)(?=\))/)[2].split(','))
                };
                element.setAppData(event, 'event');
                element.addEventListener(event.name, () => event.scope[event.method](...event.properties));
            }
    
            function convertProperties(propertiesArray) {
                propertiesArray = propertiesArray.map(property => {
                    if (property) {
                        if (/^'.*'$/.test(property)) {
                            return property.match(/'(.*)'/)[1].replace('\'', ''); // surrounded by single quotes
                        } else {
                            var value = property.match(/(.*?)\.(.*)/); // group before first dot, group after first dot
                            var scope = element.getController(value[1]) || element.getLoop(value[1]);
                            var name = value[2];
                            return Util.getNested(name, scope, true);
                        }
                    } else {
                        return null;
                    }
                });
    
                return propertiesArray;
            }
        });
    },
    
    cleanDom() {
        var selectors = ['as', 'loop', 'var', 'if'];
        selectors.forEach(selector => {
            document.querySelectorAll(`[${selector}]`).forEach(elem => elem.removeAttribute(selector))
        });
    }
}

export default helpers;