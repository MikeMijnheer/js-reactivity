export default class Util {
    static deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static getNested(path, obj = self, fromRefs = false, separator = '.') {
        path = fromRefs ? '_refs.' + path : path;
        var properties = Array.isArray(path) ? path : path.split(separator)
        return properties.reduce((prev, curr) => prev && prev[curr], obj)
    }

    static flatObject(input) {
        function flat(res, key, val, pre = '') {
            const prefix = [pre, key].filter(v => v).join('.');
            return typeof val === 'object'
                ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
                : Object.assign(res, { [prefix]: val });
        }
        return Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {});
    }

    static isNumber(val) {
        return /^\d+$/.test(val);
    }

    static getNestedFromObj(obj) {
        var controller = obj?.scope;
        var path = '';
        var name = obj?.name;

        while (!Util.getNested(path + name, controller, true)) {
            var nestedLoop = controller?.appData.loop;
            if (nestedLoop) {
                controller = nestedLoop.scope;

                if (controller) {
                    path = `${nestedLoop.name}.${nestedLoop.index}.${path}`;
                } else {
                    var nestedLoop2 = nestedLoop.baseElement.appData.loop;
                    controller = nestedLoop2.scope;
                    path = `${nestedLoop2.name}.${nestedLoop.index}.${path}`;
                }
            } else {
                break;
            }
        }

        var nested = {
            controller: controller,
            path: path + name,
            value: Util.getNested(path + name, controller, true)
        }
        return nested;
    }
}