### dialog 控件

样式基于bootstrap，所以在项目中需要引入bs的样式文件

接口与oniui默认的差不多，不过显示和隐藏的时候最好调用show、hide方法

使用示例：
```
<!DOCTYPE html>
<html>
    <head>
        <title>对话框</title>
        <meta http-equiv="content-type" content="text/html;charset=utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <link type="text/css" rel="stylesheet" href="../vendor/bootstrap/dist/css/bootstrap.min.css"/>
    </head>
    <body>
        <div class="demo" ms-controller="demo">
            <button ms-click="showAlert()">打开alert对话框</button>
            <button ms-click="showConfirm()">打开confirm对话框</button>
            <button ms-click="showNoButton()">不包含按钮的对话框</button>
            <div ms-widget="hydialog, $, $opts">
                呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵
                <p>{{message}} - {{name}}</p>
            </div>
        </div>
        <script src="../vendor/requirejs/require.js"></script>
        <script src="../vendor/avalon/dist/avalon.shim.js"></script>
        <script src="../vendor/avalon.oniui-dev/oniui.min.js"></script> <!--官方打包压缩的oniui库-->
        <script>
            require(["hydialog/hydialog"], function() {
                var _dlgVm = null;

                avalon.define({
                    $id: "demo",
                    width: 600, // 指定宽度
                    message: "这是一个测试对话框",
                    showAlert: function(){
                        _dlgVm.type="alert";
                        _dlgVm.showFooter = true; // 是否显示底部的按钮区域，默认值为true
                        _dlgVm.show();
                    },
                    showNoButton: function() {
                        _dlgVm.showFooter = false;
                        _dlgVm.title = "不包含默认按钮"; // 对话框标题
                        _dlgVm.show();
                    },
                    showConfirm: function() {
                        _dlgVm.type="confirm";
                        _dlgVm.showFooter = true; // 默认值为true
                        _dlgVm.onConfirm = function() {
                            alert("confirmed");
                        };
                        _dlgVm.show();
                    },
                    $opts: {
                        title: "测试对话框",
                        cancelName: "关掉",
                        onInit: function(dlgVm) {
                            _dlgVm = dlgVm;
                        }
                    }
                });

                avalon.scan();
            });
        </script>
    </body>
</html>

```

