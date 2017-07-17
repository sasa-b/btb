/**
 * Created by BlackCat on 17-Sep-16.
 */

window.nodeToArray = function(node) {
    return Array.prototype.slice.call(node);
}
window.getParent = function(el, type) {
    while(el.nodeName !== type) {
        el = el.parentNode;
    }
    return el;
}

window.getChild = function (el, type) {
    while (el.nodeName !== type) {
        el = el.firstElementChild;
    }
    return el;
}

window.createNode = function (element, attributes) {

    if (element.indexOf('<') > -1) {
        if (element.indexOf('tr') > -1) {
            var placeholder = document.createElement('table');
                placeholder.innerHTML = element;
            var el = placeholder.rows[0];
        } else {
            var placeholder = document.createElement('div');
                placeholder.innerHTML = element;
            var el = placeholder.children[0];
        }
    } else {
        var el = document.createElement(element);
    }

    if (attributes) {
        for (var key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
    }
    return el;
}

window.round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}


function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fadeIn(element, time, display) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    element.style.opacity = 0;
    element.style.visibility = 'hidden';
    element.style.display = typeof display !== 'undefined' ? display : 'block';

    element.style.transition = ('opacity '+(time/1000).toFixed(1)+'s ease 0.0s, visibility '+(time/1000).toFixed(1)+'s ease 0.0s');

    setTimeout(function () {
        element.style.visibility = 'visible';
        element.style.opacity = 1;
    }, 10)
}

function fadeOut(element, time) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    element.style.transition = ('opacity '+(time/1000).toFixed(1)+'s ease 0.0s, visibility '+(time/1000).toFixed(1)+'s ease 0.0s');

    setTimeout(function () {
        element.style.visibility = 'hidden';
        element.style.opacity = 0;
    }, 10)

    setTimeout(function () {
        element.style.display = 'none';
    }, time + 1);

}

function slideIn(element, direction, time, offset) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    const initialPosition = element.style[direction] !== '' ? element.style[direction] : '0px';

    if (typeof offset != 'undefined') {
        element.style[direction] = offset;
    } else {
        if (direction === 'top' || direction === 'bottom') {
            offset = '-'+(element['offset'+ucfirst(direction)] + element.clientHeight + 50) + 'px';
        } else {
            offset = '-'+(element['offset'+ucfirst(direction)] + element.clientWidth + 50) + 'px';
        }
        element.style[direction] = offset;
    }

    element.style.transition = direction + ' ' + (time/1000).toFixed(1) + 's ease 0.0s';

    element.style.display = element.style.display.indexOf('inline-block') > -1 ? 'inline-block' : 'block';
    element.style.position = element.style.position.indexOf('absolute') > -1 ? 'absolute' : 'relative';

    setTimeout(function () {
        element.style[direction] = '0px';
    }, 10);
}

function slideOut(element, direction, time, offset) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    element.style.transition = direction + ' ' + (time/1000).toFixed(1) + 's ease 0.0s';

    element.style.position = element.style.position.indexOf('absolute') > -1 ? 'absolute' : 'relative';

    element.style[direction] = '0px';

    setTimeout(function () {
        if (typeof offset != 'undefined') {
            element.style[direction] = offset;
        } else {
            if (direction === 'top' || direction === 'bottom') {
                offset = '-'+(element['offset'+ucfirst(direction)] + element.clientHeight + 50) + 'px';
            } else {
                offset = '-'+(element['offset'+ucfirst(direction)] + element.clientWidth + 50) + 'px';
            }
            element.style[direction] = offset;
        }
    }, 10);

    setTimeout(function () {
        element.style.display = 'none';
    }, time + 10);
}

/**
 *
 * @param el
 * @param context
 * @param handler
 */
function onClick(el, context, handler) {
    if (typeof handler === 'undefined') {
        handler = context;
        on('click', el, function (e) {
            handler(e, this);
        });
    } else {
        on('click', el, context, function (e) {
            handler(e, this);
        });
    }
}

/**
 *
 * @param el
 * @param context
 * @param handler
 */
function onChange(el, context, handler) {
    if (typeof handler === 'undefined') {
        handler = context;
        on('change', el, function (e) {
            handler(e, this);
        });
    } else {
        on('change', el, context, function (e) {
            handler(e, this);
        });
    }
}

/**
 *
 * @param el
 * @param context
 * @param handler
 */
function onCheck(el, context, handler) {
    var hasContext = typeof handler === 'undefined';

    if (hasContext) {
        handler = context;
    }

    var check = function (e) {
        if (this.hasAttribute('checked')) {
            this.removeAttribute('checked');
            this.isChecked = false;
        } else {
            this.setAttribute('checked', 'checked');
            this.isChecked = true;
        }
        handler(e, this);
    }

    if (hasContext) {
        on('click', el, check);
    } else {
        on('click', el, context, check);
    }
}

/**
 * @param string event
 * @param el
 * @param context
 * @param handler
 * @param options
 */
function on() {
    var argLen = arguments.length;

    var event = arguments[0];

    if (argLen > 3 && typeof arguments[4] !== 'object' && typeof arguments[4] !== 'boolean') {
        var el = arguments[1];
        var context = arguments[2];
        var handler = arguments[3];
        var options = arguments[4];
    } else {
        var el = arguments[1];
        var handler = arguments[2];
        var options = arguments[3];
    }

    if (typeof el === 'string') {
        if (typeof context !== 'undefined' && el.indexOf('#') <= -1) {
            el = context.querySelector(el);
        } else {
            el = document.querySelector(el);
        }
    }

    if (el === null || el === undefined) {
        throw new Error("Element not found in the DOM");
    }

    if ((event && event.constructor === Array) || (Array.isArray && Array.isArray(event))) {
        event.forEach(function (event) {
            el.addEventListener(event, handler, options !== undefined ? options : false);
        });
    } else {
        el.addEventListener(event, handler, options !== undefined ? options : false);
    }
}

/**
 *
 * @param id
 * @returns {Element}
 */
function getById(id) {
    return document.getElementById(id);
}

/**
 *
 * @param name
 * @param context
 * @returns {*}
 */
function getByClass(name, context) {
    var els = context ? context.getElementsByClassName(name) : document.getElementsByClassName(name);
    return Array.prototype.slice.call(els);
}

/**
 *
 * @param name
 * @param context
 * @returns {*}
 */
function getByTag(name, context) {
    var els = context ? context.getElementsByTagName(name) : document.getElementsByTagName(name);
    return Array.prototype.slice.call(els);
}

/**
 *
 * @param name
 * @param context
 * @returns {*}
 */
function getByName(name, context) {
    var els = context ? context.getElementsByName(name) : document.getElementsByName(name);
    return Array.prototype.slice.call(els);
}

/**
 *
 * @param selector
 * @param context
 * @returns {*}
 */
function query(selector, context) {
    return context ? context.querySelector(selector) : document.querySelector(selector);
}

/**
 *
 * @param selector
 * @param context
 * @returns {*}
 */
function queryAll(selector, context) {
    var els = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
    return Array.prototype.slice.call(els);
}

/**
 *
 * @param el
 * @param className
 * @returns {boolean}
 */
function hasClass(el, className) {
    if (el.className.indexOf(className) > -1) {
        return true;
    }
    return false;
}