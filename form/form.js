/**
 * Created by sasablagojevic on 3/14/17.
 */
function Form(selector) {
    var self = this;
    var form = typeof selector !== 'string' ? selector : document.querySelector(selector);

    var inputs = [];
    var selects = [];
    var textAreas = [];

    var inputData = {};

    var __construct = function () {
        inputs = Array.prototype.slice.call(form.getElementsByTagName('input'));
        selects = Array.prototype.slice.call(form.getElementsByTagName('select'));
        textAreas = Array.prototype.slice.call(form.getElementsByTagName('textarea'));
    }();

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

