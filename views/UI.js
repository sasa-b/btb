/**
 * Created by sasablagojevic on 3/12/17.
 */
function UI() {

    this.templates = {
        set : function (key, tmpl) {
            this[key] = tmpl;
        },
        get : function (key) {
            return this[key];
        }
    }

    /**
     * @param name
     * @param callable
     * @returns {*}
     */
    this.view = function(name, callable) {

        /**
         * If View object exists return it
         */
        if (this.hasOwnProperty(name)) {
            return this[name];
        }

        /**
         * If View object callback is provided
         */
        if (typeof callable !== 'undefined') {
            this[name] = callable;
            return this[name];
        }

        /**
         * Otherwise return View object with view component definer method
         * @type {{component: component}}
         */
        this[name] = {
            component : function (name, callable) {
                this[name] = callable
            }
        };
        return this[name];

    }

}