require.config({
    baseUrl: "./lib/",
    paths: {
　　    "avalon": "avalon/avalon.shim",
  // 　　  "oniui": "vendor/avalon.oniui",
        "domReady": "domReady/domReady",
        "text": "requirejs-text/text",
        "css": "require-css/css.min",
        "mmPromise": "mmRouter/mmPromise",
        // "mmHistory": "vendor/avalon.oniui/mmRouter/mmHistory",
        // "mmRouter": "vendor/avalon.oniui/mmRouter/mmRouter",
        "vm": "../vm"
　　},
    shim: {
        "avalon": {
            exports: "avalon"
        }
    }
});

require([
    'avalon'
    ], function(avalon) {

    require([
        "vm/router"
    ], function(router) {
        avalon.ready(function() {
            avalon.define({
                $id: "root",
                clickme: function() {
                    alert("clicked");
                }
            });

            router.start();
        });
    });
    
});
