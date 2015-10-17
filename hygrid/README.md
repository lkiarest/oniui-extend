### 表格组件

使用table的简单实现

接口跟官方组件差不多， 有可能会少一些，目前项目够用~~

分页部分的设置简化了一点

示例代码：
```
<!DOCTYPE html>
<html>
    <head>
        <title>简单的表格组件</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
    </head>
    <body ms-controller="demo">
        <button ms-click="reRenderData">重新渲染数据</button>
        <button ms-click="clearData">清空数据</button>
        <button ms-click="getSelected">获取选择</button>
        <div ms-widget="hygrid, $, $opts" style='margin-bottom:20px;'></div>

        <script src="../vendor/requirejs/require.js"></script>
        <script src="../vendor/avalon/dist/avalon.shim.js"></script>
        <script src="../oniui.min.js"></script>
        <script>
            require(["hygrid/hygrid"], function() {
                var _vmlist = null;

                function getDatas(number) {
                    var data = [];
                    for (var i = 0; i < number; i++) {
                        data.push({name: "item-" + i, age: parseInt(10 + Math.random() * 20), selected: i%3 ? false: true,
                            salary: parseInt(Math.random() * 100), operate : i % 5 ? 0 : 1, busy : !i%3 && !i%5 ? 0 : 1
                        });
                    }

                    return data;
                }

                var vm = avalon.define({
                    $id: "demo",
                    reRenderData: function() {
                        _vmlist.render(getDatas(10));
                        _vmlist.setTotal(100);
                    },
                    clearData: function() {
                        _vmlist.render(null);
                    },
                    getSelected: function() {
                        console.log(_vmlist.getSelected());
                    },
                    showEdit: function(name) {
                        alert("edit " + name);
                    },
                    delById: function(name) {
                        alert("delete " + name);
                    },
                    $opts: {
                        selectable: true,
                        pager: {
                            perPages: 10,
                            onJump: function(toPage) {
                                // jump to next page
                                vm.reRenderData();
                            }
                        },
                        onInit: function(vmList) {
                            _vmlist = vmList;
                            vm.reRenderData();
                        },
                        htmlHelper: {
                            optDel: function(vmId, field, index, cellValue, rowData) {
                                return '<a class="" href="javascript:void(0)" ms-click="showEdit(\'' + rowData.name + '\');">修改</a><a class="" href="javascript:void(0)" ms-click="delById(\'' + rowData.name  + '\');">删除</a>';
                            },
                            unit: function(vmId, field, index, cellValue, rowData) {
                                return "$" + cellValue
                            }
                        },
                        columns: [{key: "name", name: "姓名", align: "center"}, 
                                  {key : "age", name : "年龄", align: "center"},
                                  {key : "salary", name : "薪水", align: "center", format: "unit"},
                                  {key : "operate", name : "操作", align: "center", format: "optDel", width: ""}]
                    }
                });

                avalon.scan();
            });
        </script>
    </body>
</html>

```

