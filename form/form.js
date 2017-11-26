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

    var rawInput = {};

    this.autoCollect = true;

    this.filter = null;

    this.onSubmit = function (form) {

    };

    this.ajax = new Xhr({
        contentType: 'application/json',
        responseType: 'json'
    });

    this.element = function(selector) {
        if (selector) {
            el = document.querySelector(selector);
        }
        return el;
    }

    (function (options) {
        inputs = Array.prototype.slice.call(el.getElementsByTagName('input'));
        selects = Array.prototype.slice.call(el.getElementsByTagName('select'));
        textAreas = Array.prototype.slice.call(el.getElementsByTagName('textarea'));

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

            if (options.hasOwnProperty('filter')) {
                self.filter = options['filter'];
            }
        }

        if (el.hasAttribute('action')) {
            self.ajax.setAction(el.getAttribute('action'));
        }

        if (el.hasAttribute('method')) {
            self.ajax.setMethod(el.getAttribute('method'));
        }

        if (self.autoCollect) {

            el.addEventListener('submit', function (e) {
                e.preventDefault();

                self.onSubmit(self);
                
                if (self.filter) {
                    self.ajax.send(self.collect().data(self.filter));
                    return false;
                }

                self.ajax.send(self.collect().data());
            });
        }
    }(options))

    this.collect = function() {
        inputs.forEach(function (input) {
            if (input.type == 'checkbox' || input.type == 'radio') {

                if (input.hasAttribute('checked')) {
                    rawInput[input.getAttribute('name')] = input.value;
                }

            } else if (input.type == 'file') {
                var l = input.files.length;

                if (l == 1) {
                    rawInput[input.getAttribute('name')] = input.files[0];
                } else if (l > 1) {
                    rawInput[input.getAttribute('name')] = [];
                    for (var i = 0; i < l; i++) {
                        rawInput.push(input.files[i]);
                    }
                }

            } else {
                rawInput[input.getAttribute('name')] = input.value;
            }
        });

        selects.forEach(function (select) {
            rawInput[select.getAttribute('name')] = select.value
        });

        textAreas.forEach(function (textArea) {
            rawInput[textArea.getAttribute('name')] = textArea.value;
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

        for (var key in data) {
            rawInput[key] = data[key];
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

        for (var key in data) {
            if (!rawInput.hasOwnProperty(key)) {
                rawInput[key] = data[key];
            }
        }

        return this;
    }

     /**
     * @param filter
     * {
     *  only: [],
     *  except: []
     * }
     * @param stringified
     * @returns {{}}
     */
    this.data = function (filter, stringified) {
        if (filter && typeof filter !== 'object') {
            throw new Error("Filters need to be an [object]");
        }

        var data = rawInput;

        if (filter) {
            data = {};
            if (filter.hasOwnProperty('only')) {
                var i = 0;
                var l = filter.only.length;

                while (i < l) {
                    data[filter.only[i]] = rawInput[filter.only[i]];
                    i++;
                }
            }

            if (filter.hasOwnProperty('except')) {
                var i = 0;
                var l = filter.except.length;

                data = rawInput;
                while (i < l) {
                   delete data[filter.except[i]];
                    i++;
                }

            }
        }

        if (typeof stringified !== 'undefined' && (stringified === true || stringified == 'json')) {
            return JSON.stringify(data)
        }

        return data;
    }
}

