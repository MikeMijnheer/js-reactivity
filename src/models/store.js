export default class Store {
    static controllers = [];
    static variables = [];
    static loops = [];
    static conditions = [];

    static get elements() {
        return [].concat(Store.variables, Store.loops, Store.conditions);
    }
}