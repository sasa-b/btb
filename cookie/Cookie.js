/**
 * Created by sasablagojevic on 6/22/17.
 */
function Cookie() {

    this.get = function(name) {
        var cookieString = document.cookie;
        var regex = new RegExp("(" + name + "=([^;])*)",'g');
        var match =	cookieString.match(regex);
        return match ? match[0].split('=')[1] : null;
    }

    this.set = function(name, value, expire, path, domain, secure) {
        var cookie = name+'='+value+'; max-age='+expire+'; path='+path + (typeof domain !== 'undefined' ? '; domain='+domain : '') + (typeof secure !== 'undefined' ? '; secure' : '');
        console.log(cookie);
        document.cookie = cookie;
    }

    this.has = function(pttrn) {
        var pattern = pttrn;
        if (pattern.test(document.cookie)) {
            return true;
        } else {
            return false;
        }
    }

}