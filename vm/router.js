define(["mmRouter/mmState"], function() {

    // 重写模板加载器，改为用text插件加载
    avalon.require = require;

    avalon.state.templateLoader = function(url, resolve, reject, reason) {
        avalon.require(["text!" + url], function(tpl) {
            resolve(avalon.templateCache[url] = tpl)
        })
    }

    avalon.state("home", {
        url: "/",
        views: {
            "": {
                templateUrl:"vm/demo.html"
            }
        }
    }).state("home.duplexDemo", {
        url:"duplexDemo",
        views: {
            "": {
                templateUrl: "vm/duplex-demo/duplexDemo.html",
                controllerUrl: "vm/duplex-demo/duplexDemo"
            }
        }
    }).state("home.duplexDemo.page1", {
        url:"/page1",
        views: {
            "": {
                templateUrl: "vm/duplex-demo/page1/page1.html",
                controllerUrl: "vm/duplex-demo/page1/page1"
            }
        }
    }).state("home.duplexDemo.page2", {
        url:"/page2",
        views: {
            "": {
                templateUrl: "vm/duplex-demo/page2/page2.html",
                controllerUrl: "vm/duplex-demo/page2/page2"
            }
        }
    });

    avalon.state.config({
        onError: function() {
            console.log(arguments)
        }, // 强烈打开错误配置
        onLoad: function() {
            //root.page = mmState.currentState.stateName.split(".")[1];
        },
        onViewEnter: function(newNode, oldNode) {
            oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
        } // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide

    });

    var start = function() {
        avalon.history.start({
            basepath: "/"
        });

        avalon.scan();
    };

    return {
        start: start
    }
});