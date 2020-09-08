import './object.extensions.js';

Array.prototype.inArray = function (item) {
    return this.indexOf(item) !== -1;
};

Array.prototype.pushIfNotExist = function (item) {
    if (!this.inArray(item)) {
        this.push(item);
    }
};

Array.prototype.getDiff = function (array2) {
    var diffIndexes = [];
    var source = this;
    source.forEach((item, index) => {
        if (!Object.compare(item, array2[index])) {
            diffIndexes.push(index);
        }
    });
    return diffIndexes;
}

Array.prototype.getLast = function () {
    return this[this.length - 1];
}