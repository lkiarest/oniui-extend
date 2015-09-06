define([
    ], function() {

    var vm = avalon.define({
        $id: "page1",
        o: {},
        ccc: "",
        ddd: "",
        selectedRoom: "",
        roomList: []
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
        };
        // 进入视图
        $ctrl.$onEnter = function() {
            vm.roomList = [{name: "room1", value:"0"}, {name: "room2", value:"1"}, {name: "room3", value:"2"}];
            vm.o = {
                aaa: "aaa",
                bbb: "bbb"
            };
            vm.ccc = "ccc";
            vm.ddd = "ddd";
            vm.selectedRoom = "";
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            vm.roomList.clear();
            vm.o = {};
            console.log("before unload page1, avalon.$$subscribers: " + avalon.$$subscribers.length);
            console.log(avalon.$$subscribers);
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});
