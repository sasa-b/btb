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
    this.csrfFieldName = 'csrf';

    var action = null;
    var httpMethod = null;

    this.setAction = function (url) {
        action = url;
        return this;
    }

    this.setMethod = function(method) {
        httpMethod = method;
        return this;
    }

    /**
     * @param base
     * @returns {string}
     */
    this.url = function(base) {
        if (typeof base !== 'undefined') {
            var url = window.location.href;
            url = url.split('/');
            url = url[2];
            console.log(url);
            return url[0] + '/' + url.replace(/\/+$/, '');
        }
        return window.location.href.replace(/\/+$/, '');
    }

    /**
     * @param response
     */
    this.successMessage = function (response) {
        console.log(response)
    }

    /**
     * @param response
     */
    this.failedMessage = function (response) {
        console.log(response)
    }

    /**
     * Success response handler
     * @param response
     * @param callback
     * @returns {boolean}
     */
    this.successResponse = function(response, callback) {
        this.successMessage(response)
        if (typeof callback !== 'undefined') {
            callback(response)
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
        this.failedMessage(response)
        if (typeof callback !== 'undefined') {
            callback(response)
            return true;
        }
    }

    this.getCsrfToken = function () {
        return document.querySelector("input[name="+this.csrfFieldName+"]").value
    }

    this.configure = function() {
        this.setHeaders("X-Requested-With", "XMLHttpRequest");
        if (this.contentType != null) {
            this.xhr.setRequestHeader("Content-type", this.contentType);
        }
        this.setHeaders("X-Csrf-Token", this.getCsrfToken());
        this.xhr.responseType = this.responseType;
    }

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
    var prepare = function(data) {
        if (self.contentType.indexOf('json') > -1) {
            data = JSON.stringify(data);
        } else if (self.contentType.indexOf('x-www-form-urlencoded') > -1) {
            var keyValue = [];
            for (var key in data) {
                keyValue.push(key+"="+data[key]);
            }
            keyValue = keyValue.join('&');
            data = keyValue;
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
        this.sendRequest(httpMethod, action, prepareData(data), callback);
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
        this.sendRequest("POST", action ? action : url, prepareData(data), callback);
    }

    /**
     * Send a PATCH request
     * @param url
     * @param data
     * @param callback
     */
    this.patch = function(url, data, callback) {
        this.sendRequest("PATCH", action ? action : url, prepareData(data), callback);
    }

    /**
     * Send a PUT request
     * @param url
     * @param data
     * @param callback
     */
    this.put = function(url, data, callback) {
        this.sendRequest("PUT", action ? action : url, prepareData(data), callback);
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
     * private constructor (zbog var)
     * mora biti na dnu da bi se mogle overwrite sve metode
     *
     * @param contentType
     * @param responseType
     */
    var _construct = function(config, self) {
        for (var key in config) {
            self[key] = config[key];
        }
    }(config, this);

}


