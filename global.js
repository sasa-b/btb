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
        var placeholder = document.createElement('div');
        placeholder.innerHTML = element;
        var el = placeholder.children[0];
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

//< FORMAT DATE
function formatDate(date, time) {
    if (typeof date === 'string') {

        var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && !navigator.userAgent.match('CriOS');
        if (isSafari) {
            date = date.replace(/-/g, '/');
        }

        date = new Date(date);
    }
    var dateMonth = date.getMonth() + 1;

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    if (time == true) {
        var h = addZero(date.getHours());
        var m = addZero(date.getMinutes());
        //var s = addZero(date.getSeconds());
        return date.getDate()+'.'+addZero(dateMonth)+'.' +date.getFullYear()+'. '+h+':'+m;
    }
    return date.getDate()+'.'+addZero(dateMonth)+'.'+date.getFullYear()+'.';
}
//>

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

function onClick(el, context, handler) {
    if (typeof handler === 'undefined') {
        handler = context;
        on('click', el, el, function (e) {
            handler(e, this);
        });
    } else {
        on('click', el, context, el, function (e) {
            handler(e, this);
        });
    }
}

function onChange(el, context, handler) {
    if (typeof handler === 'undefined') {
        handler = context;
        on('change', el, function (e) {
            handler(e, this);
        });
    } else {
        on('change', el, context, el, function (e) {
            handler(e, this);
        });
    }
}

function onCheck(el, context, handler) {

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

    if (typeof handler === 'undefined') {
        handler = context;
        on('click', el, check);
    } else {
        on('click', el, context, check);
    }
}

function on() {
    var argLen = arguments.length;

    var event = arguments[0];

    if (argLen > 3) {
        var el = arguments[1];
        var context = arguments[2];
        var handler = arguments[3];
    } else {
        var el = arguments[1];
        var handler = arguments[2];
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
            el.addEventListener(event, handler);
        });
    } else {
        el.addEventListener(event, handler);
    }
}