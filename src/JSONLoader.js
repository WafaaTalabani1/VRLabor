var JSONLoader = ( function () {

    function JSONLoader() {

    }
    
    JSONLoader.prototype = {
        constructor: JSONLoader,

        loadJSON: function (path, success, error)
        {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function()
            {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        if (success)
                            success(JSON.parse(xhr.responseText));
                    } else {
                        if (error)
                            error(xhr);
                    }
                }
            };
            xhr.open("GET", path, true);
            xhr.send();
        }
    }
    return JSONLoader

})()
    
export { JSONLoader }
