# oniui-extend
###使用avalon开发的SPA项目中使用到的一些组件###

1. hygrid

    自定义列表组件，避免官方组件的内存泄漏问题

1. hydialog

    自定义对话框组件，避免官方组件的内存泄漏问题 - 部分样式基于bootstrap，比如button

1. datepicker

    fork国外的一个控件[jquery-simple-datetimepicker](https://github.com/mugifly/jquery-simple-datetimepicker)，然后修复内存泄漏问题并增加了一些中文字符串翻译，放在[https://github.com/lkiarest/jquery-simple-datetimepicker](https://github.com/lkiarest/jquery-simple-datetimepicker)，暂未改成avalon的widget规范，还是jquery插件的使用方法

1. tree

    官方的tree控件也存在内存泄漏问题，而且比较严重，所以引入了第三方的ztree作为jquery插件使用，不过最新版的ztree也存在内存泄漏问题，调试发现是646行绑定了一个selectstart事件，在destroy的时候没有解除绑定造成的。
    暂时在unbindTree方法里加了一句“.unbind('selectstart');”解决。
