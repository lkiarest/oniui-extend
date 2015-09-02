define([
    ], function() {

    var vm = avalon.define({
        $id: "page1",
        aaa: "aaa",
        bbb: "bbb",
        ccc: "ccc",
        ddd: "ddd",
        selectedRoom: "",
        roomList: [{name: "room1", value:"0"}, {name: "room2", value:"1"}, {name: "room3", value:"2"}]
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            console.log("before unload page1, avalon.$$subscribers: " + avalon.$$subscribers.length);
            console.log(avalon.$$subscribers);
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});
