/**
 * Created by sasablagojevic on 3/14/17.
 */
function Form(selector, options) {
    var self = this;
    var form = typeof selector !== 'string' ? selector : document.querySelector(selector);

    var inputs = [];
    var selects = [];
    var textAreas = [];

    var inputData = {};

    this.autoCollect = false;

    this.ajax = new Xhr({
        contentType: 'application/json',
        responseType: 'json'
    });

    var _construct = function (options) {
        inputs = Array.prototype.slice.call(form.getElementsByTagName('input'));
        selects = Array.prototype.slice.call(form.getElementsByTagName('select'));
        textAreas = Array.prototype.slice.call(form.getElementsByTagName('textarea'));

        if (options) {
            if (options.hasOwnProperty('ajax')) {
                self.ajax = options['ajax'];
            }

            if (options.hasOwnProperty('autoCollect')) {
                self.autoCollect = options['autoCollect'];
                form.addEventListener('submit', function () {
                    ajax.setAction(options['url'])
                        .setMethod(options['method'])
                        .send(self.collect(), options.hasOwnProperty('callback') ? options['callback'] : undefined)
                });
            }
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

    this.data = function (stringified) {

        if (typeof stringified !== 'undefined' && (stringified === true || stringified == 'json')) {
            return JSON.stringify(inputData)
        }
        return inputData;
    }

}

