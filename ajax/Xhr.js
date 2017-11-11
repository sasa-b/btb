/**
 * @param config
 * @constructor
 */
function Xhr(config) {
    var self = this;
    this.xhr = new XMLHttpRequest();
    this.contentType = 'application/json';
    this.responseType = 'json';
    this.headers = null;
    this.tokenFieldName = '_token';

    var action = null;
    var httpMethod = null;

    /**
     *
     * @param string url
     * @returns {Xhr}
     */
    this.setAction = function (url) {
        action = url;
        return this;
    }

    /**
     *
     * @param method
     * @returns {Xhr}
     */
    this.setMethod = function(method) {
        httpMethod = method;
        return this;
    }

    this.getMethod = function () {
        return httpMethod;
    }

    this.getAction = function() {
        return action;
    }

    /**
     * @param bool base
     * @returns {string}
     */
    this.baseUrl = function() {
        var url = window.location.href;
            url = url.split('/');
            url = url[0] + '//' + url[2];
        return url.replace(/\/+$/, '');
    }

    /**
     * Success response handler
     * @param response
     * @param callback
     * @returns {boolean}
     */
    this.successResponse = function(response, callback) {
        console.log(response);
        if (typeof callback !== 'undefined') {
            callback(response, this.xhr.status);
            return true;
        }
    }

    /**
     * Failed response handler
     * @param response
     * @param callback
     * @returns {boolean}
     */
    this.failedResponse = function(response, callback) {
        console.log(response)
        if (typeof callback !== 'undefined') {
            callback(response, this.xhr.status);
            return true;
        }
    }

    this.getCsrfToken = function () {
        return document.querySelector("input[name="+this.tokenFieldName+"]").value
    }

    this.configure = function() {
        this.setHeaders("X-Requested-With", "XMLHttpRequest");
        if (this.contentType != null) {
            this.xhr.setRequestHeader("Content-type", this.contentType);
        }
        this.setHeaders("X-Csrf-Token", this.getCsrfToken());
        this.xhr.responseType = this.responseType;
    }

    /**
     *
     * @param key
     * @param value
     */
    this.setHeaders = function(key, value) {
        self.xhr.setRequestHeader(key, value);
    }

    this.loading = function() {

    }

    this.stopLoading = function () {

    }

    /**
     * @param method string GET, POST, PATCH, PUT, DELETE
     * @param url strig
     * @param data mixed
     * @param callback Object with callback method names coresponding to ajax request states, or a callback function for done state only
     * @param user
     * @param password
     */
    this.sendRequest = function(method, url, data, callback, user, password) {
        if (action === null && url === undefined) {
            throw new Error("No [action/url] defined.");
        }

        if (url.indexOf('http') <= -1) {
            url = this.baseUrl() + url;
        }

        this.xhr.open(method, url, true, user, password);
        this.configure();
        if (this.headers != null) {
            for (var key in this.headers) {
                this.setHeaders(key, this.headers[key]);
            }
        }
        this.xhr.onreadystatechange = function() {
            //startLoadingAnim()
            self.loading();
            switch (self.xhr.readyState) {
                //UNSENT
                case 0:
                    if (typeof callback !== 'undefined' && callback.hasOwnProperty('unsent')) {
                        callback.unsent();
                    }
                    break;
                //OPENED
                case 1:
                    if (typeof callback !== 'undefined' && callback.hasOwnProperty('opened')) {
                        callback.opened();
                    }
                    break;
                //HEADERS_RECEIVED
                case 2:
                    if (typeof callback !== 'undefined' && callback.hasOwnProperty('headersReceived')) {
                        callback.headersReceived();
                    }
                    break;
                //LOADING
                case 3:
                    if (typeof callback !== 'undefined' && callback.hasOwnProperty('loading')) {
                        callback.loading();
                    }
                    break;
                //DONE
                case 4:
                    //stopLoadingAnim()
                    self.stopLoading();

                    if (self.xhr.response) {
                        self.xhr.response.code = self.xhr.status;
                    }

                    if (self.xhr.status == 200) {
                        self.successResponse(self.xhr.response, typeof callback !== 'undefined' &&  callback.hasOwnProperty('done') ? callback.done : (callback !== 'undefined' ? callback : 'undefined'));
                    }

                    if (self.xhr.status == 422) {
                        self.failedResponse(self.xhr.response, typeof callback !== 'undefined' &&  callback.hasOwnProperty('done') ? callback.done : (callback !== 'undefined' ? callback : 'undefined'));
                    }

                    if (self.xhr.status == 500) {
                        self.failedResponse(self.xhr.response, typeof callback !== 'undefined' &&  callback.hasOwnProperty('done') ? callback.done : (callback !== 'undefined' ? callback : 'undefined'));
                    }

                    if (self.xhr.status == 401) {
                        self.failedResponse(self.xhr.response, typeof callback !== 'undefined' &&  callback.hasOwnProperty('done') ? callback.done : (callback !== 'undefined' ? callback : 'undefined'));
                    }

                    if (self.xhr.status == 403) {
                        self.failedResponse(self.xhr.response, typeof callback !== 'undefined' &&  callback.hasOwnProperty('done') ? callback.done : (callback !== 'undefined' ? callback : 'undefined'));
                    }
                    break;
            }

        }

        switch (method) {
            case 'POST':
            case 'PUT':
            case 'PATCH':
                self.xhr.send(data);
                break;
            default:
                self.xhr.send();
                break;
        }
    }

    /**
     * Prepare data - stringify JSON or form a query string
     * @param data
     * @returns {*}
     */
    var serialize = function(data) {
         if (self.contentType) {
            if (self.contentType && self.contentType.indexOf('json') > -1) {
                data = JSON.stringify(data);
            } else if (self.contentType.indexOf('x-www-form-urlencoded') > -1) {
                var keyValue = [];
                for (var key in data) {
                    keyValue.push(key+"="+data[key]);
                }
                keyValue = keyValue.join('&');
                data = keyValue;
            }
        } else {
            var fData = new FormData();
            for (var key in data) {
                fData.append(key, data[key]);
            }
            data = fData;
        }
        return data;
    }

    /**
     *
     * @param data
     * @param callback
     * @returns {Xhr}
     */
    this.send = function(data, callback) {
        this.sendRequest(httpMethod, action, serialize(data), callback);
        return this;
    }

    /**
     * Send a GET request
     * @param url
     * @param callback
     */
    this.get = function(url, callback) {
        this.sendRequest("GET", action ? action : url, null, callback);
    }

    /**
     * Send a POST request
     * @param url
     * @param data
     * @param callback
     */
    this.post = function(url, data, callback) {
        if (arguments.length < 2) {
            data = url;
        }
        this.sendRequest("POST", action ? action : url, serialize(data), callback);
    }

    /**
     * Send a PATCH request
     * @param url
     * @param data
     * @param callback
     */
    this.patch = function(url, data, callback) {
        if (arguments.length < 2) {
            data = url;
        }
        this.sendRequest("PATCH", action ? action : url, serialize(data), callback);
    }

    /**
     * Send a PUT request
     * @param url
     * @param data
     * @param callback
     */
    this.put = function(url, data, callback) {
        if (arguments.length < 2) {
            data = url;
        }
        this.sendRequest("PUT", action ? action : url, serialize(data), callback);
    }

    /**
     * Send a DELETE request
     * @param url
     * @param callback
     */
    this.delete = function(url, callback) {
        this.sendRequest("DELETE", action ? action : url, null, callback);
    }

    /**
     * @param contentType
     * @param responseType
     */
    var _construct = function(config, self) {
        for (var key in config) {
            self[key] = config[key];
        }
    }(config, this);

}


