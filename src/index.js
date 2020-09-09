import './extensions/array.extensions.js';
import './extensions/element.extensions.js';
import './extensions/object.extensions.js';
import Helper from './util/helpers.js';

export { Component } from './models/component.js';

export class JsReactivity {
    static async init() {
        Helper.initControllers().then(() => {
            Helper.initLoops().then(() => {
                Helper.initVariables();
                Helper.initConditions();
                Helper.initEvents();
                return;
            });
            //cleanDom();
        });
    }
}