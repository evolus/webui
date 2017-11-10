var CommonNet = (function () {
    return {
        get: function (path, params) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.addEventListener("load", function () {
                    if (request.status != 200) {
                        reject(new Error("Response = " + request.status));
                        return;
                    }

                    var json = request.responseText;
                    var object = JSON.parse(json);
                    resolve(object);
                });
                var url = path;
                if (params) {
                    for (var name in params) {
                        url += url.indexOf("?") < 0 ? "?" : "&";
                        url += name + "=";
                        url += encodeURIComponent("" + params[name]);
                    }
                }

                request.open("GET", url);
                request.send();
            });
        }
    }
})();
