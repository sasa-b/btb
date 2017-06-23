/**
 * Created by sasablagojevic on 3/14/17.
 */
function Form(selector, options) {
    var self = this;
    var el = typeof selector !== 'string' ? selector : document.querySelector(selector);

    if (el == null || el == undefined) {
        throw Error("Form [element] is undefined");
    }

    var inputs = [];
    var selects = [];
    var textAreas = [];

    var inputData = {};

    this.autoCollect = true;

    this.ajax = new Xhr({
        contentType: 'application/json',
        responseType: 'json'
    });

    this.element = function() {
        return el;
    }

    var _construct = function (options) {
        inputs = Array.prototype.slice.call(el.getElementsByTagName('input'));
        selects = Array.prototype.slice.call(el.getElementsByTagName('select'));
        textAreas = Array.prototype.slice.call(el.getElementsByTagName('textarea'));

        if (el.hasAttribute('action')) {
            self.ajax.setAction(el.getAttribute('action'));
        }

        if (el.hasAttribute('method')) {
            self.ajax.setMethod(el.getAttribute('method'));
        }

        if (options) {
            if (options.hasOwnProperty('ajax')) {
                self.ajax = options['ajax'];
            }

            if (options.hasOwnProperty('method')) {
                self.ajax.setMethod(options['method']);
            }

            if (options.hasOwnProperty('action')) {
                self.ajax.setAction(options['action']);
            }

            if (options.hasOwnProperty('autoCollect')) {
                self.autoCollect = options['autoCollect'];
            }
        }

        if (self.autoCollect) {
            el.addEventListener('submit', function (e) {
                e.preventDefault();
                self.ajax.send(self.collect().data());
            });
        }
    }(options);

    this.collect = function() {
        inputs.forEach(function (input) {
            if (input.type == 'checkbox' || input.type == 'radio') {

                if (input.hasAttribute('checked')) {
                    inputData[input.getAttribute('name')] = input.value;
                }

            } else if (input.type == 'file') {
                var l = input.files.length;

                if (l == 1) {
                    inputData[input.getAttribute('name')] = input.files[0];
                } else if (l > 1) {
                    inputData[input.getAttribute('name')] = [];
                    for (var i = 0; i < l; i++) {
                        inputData.push(input.files[i]);
                    }
                }

            } else {
                inputData[input.getAttribute('name')] = input.value;
            }
        });

        selects.forEach(function (select) {
            inputData[select.getAttribute('name')] = select.value
        });

        textAreas.forEach(function (textArea) {
            inputData[textArea.getAttribute('name')] = textArea.value;
        });

        return this;
    }

    /**
     *
     * @param object data
     * @returns {Form}
     */
    this.merge = function (data) {
        if (typeof data !== 'object') {
            throw new Error('Param [data] needs to be an [object]');
        }

        if (data.length > 0) {
            for (var key in data) {
                inputData[key] = data[key];
            }
        }

        return this;
    }

    /**
     *
     * @param object data
     * @returns {Form}
     */
    this.append = function (data) {
        if (typeof data !== 'object') {
            throw new Error('Param [data] needs to be an [object]');
        }

        if (data.length > 0) {
            for (var key in data) {
                if (!inputData.hasOwnProperty(key)) {
                    inputData[key] = data[key];
                }
            }
        }

        return this;
    }

    /**
     *
     * @param stringified
     * @returns {{}}
     */
    this.data = function (stringified) {
        if (typeof stringified !== 'undefined' && (stringified === true || stringified == 'json')) {
            return JSON.stringify(inputData)
        }
        return inputData;
    }

}

