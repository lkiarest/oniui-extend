// avalon 1.4.6
/**
 *
 * @cnName 对话框
 * @enName hydialog
 * @introduce
 *    <p></p>
 */
define(["avalon",
    "text!./hydialog.html",
    "css!../chameleon/oniui-common.css",
    "css!./hydialog.css",
    "../draggable/avalon.draggable"
], function(avalon, template) {

    var M_TOP = 140,
        H_HEAD = 40,
        H_FOOT = 44;

    var dialogNumber = 0;
    var maskId = "hy-dialog-mask-layer"; //id 长一点不会被覆盖

    var widget = avalon.ui.hydialog = function (element, data, vmodels) {

        var _innerHtml = element.innerHTML,
            options = data.hydialogOptions;

        var _scan = function() {
            avalon.scan(element, [vmodel].concat(vmodels));
        };

        var vmodel = avalon.define({
            $id: data.hydialogId,
            widgetElement: element,
            rootElement: null,
            content: _innerHtml,
            title: "",
            toggle: false,
            width: 500,
            showFooter: true,
            confirmName: "确定",
            cancelName: "取消",
            modal: true,
            type: "confirm", // alert | confirm
            onConfirm: avalon.noop,
            onCancel: avalon.noop,
            onOpen: avalon.noop,
            onClose: avalon.noop,
            $init: function() {
                avalon.ready(function() {
                    element.innerHTML = template;
                    vmodel.rootElement = element.getElementsByTagName("div")[0];
                    _scan();

                    if (typeof options.onInit === "function") {
                        options.onInit.call(element, vmodel, options, vmodels);
                    }

                    adjustDlgLayout(vmodel.rootElement);
                });
            },
            $remove: function() {
                vmodel.title = "";
                vmodel.content = "";
                vmodel.onConfirm = avalon.noop;
                vmodel.onCancel = avalon.noop;
                vmodel.onOpen = avalon.noop;
                vmodel.onClose = avalon.noop;
                vmodel.widgetElement.innerHTML = "";
            },
            draggable: {
                handle: function(e) {
                    var el = e.target;
                    do {
                        if(el.className === "header handle"){
                            return el;
                        }
                    } while(el = el.parentNode);
                }
            },
            confirm: function(e) {
                if (vmodel.onConfirm && (typeof vmodel.onConfirm === "function")) {
                    if (vmodel.onConfirm.call(e.target, e, vmodel) === false) {
                        return;
                    }
                }

                vmodel.hide();
            },
            cancel: function(e) {
                if (vmodel.onCancel && (typeof vmodel.onCancel === "function")) {
                    if (vmodel.onCancel.call(e.target, e, vmodel) === false) {
                        return;
                    }
                }

                vmodel.hide();
            },
            show: function() {
                if (vmodel.onOpen &&  (typeof vmodel.onOpen === "function")) {
                    vmodel.onOpen.call(element, vmodel);
                }

                vmodel.toggle = true;
                adjustDlgLayout(vmodel.rootElement);

                dialogNumber ++;

                var maxZ = getMaxZIndex();
                if (vmodel.modal) {
                    showMask(maxZ + 1);
                }

                vmodel.rootElement.style.zIndex = maxZ + 2;
            },
            hide: function() {
                if (vmodel.toggle === false) {
                    return;
                }

                if (vmodel.onClose &&  (typeof vmodel.onClose === "function")) {
                    vmodel.onClose.call(element, vmodel);
                }

                dialogNumber --;

                if (dialogNumber < 0) {
                    dialogNumber = 0;
                }

                if (dialogNumber === 0) {
                    hideMask();
                } else {
                    var maxZ = getMaxZIndex();
                    showMask(maxZ - 2);
                }

                vmodel.rootElement.style.zIndex = 0;
                vmodel.toggle = false;
            },
            setContent: function(content) {
                vmodel.content = content;
            },
            setTitle: function(title) {
                vmodel.title = title;
            },
            showConfirm: {
                get: function() {
                    return this.type === "confirm";
                }
            }
        });

        avalon.mix(vmodel, options);
        vmodel.$skipArray = ["widgetElement", "rootElement", "draggable"];

        return vmodel;
    };

    var adjustDlgLayout = function(elem) {
        var width = parseInt(elem.style.width),
            height = elem.offsetHeight,
            fullWidth = window.screen.availWidth, //document.body.clientWidth,
            fullHeight = window.screen.availHeight;
        var offsetWidth = fullWidth - width > 0 ? fullWidth - width : 0;
        // var offsetHeight = fullHeight - height > 0 ? fullHeight - height : 0;

        elem.style.left = offsetWidth / 2 + "px";
        if (height > fullHeight - M_TOP) {
            // set content height
            // 兼容IE8/IE8-
            var els = elem.getElementsByTagName("div");
            for (var i in els) {
                if (els[i].className === "content") {
                    els[i].style.height = (fullHeight - M_TOP - H_HEAD - H_FOOT) + "px";
                    break;
                }
            }
        }

        elem.style.top = M_TOP + "px";
    };

    var showMask = function(zindex) {
        hideMask(); // remove if exist
        var maskElem = document.createElement("div");
        maskElem.id = maskId;
        document.body.appendChild(maskElem);

        avalon(maskElem).css("z-index", zindex);
    };

    var hideMask = function() {
        var maskElem = document.getElementById(maskId);
        if (maskElem) {
            document.body.removeChild(maskElem);
        }
    };

    // 获取body子元素最大的z-index
    var getMaxZIndex = function() {
        var children = document.body.children,
            maxIndex = 10, //当body子元素都未设置zIndex时，默认取10
            zIndex;
        for (var i = 0, el; el = children[i++];) {
            if (el.nodeType === 1) {
                if (el.id === maskId) {
                    continue;
                }

                zIndex = ~~avalon(el).css("z-index");
                if (zIndex) {
                    maxIndex = Math.max(maxIndex, zIndex);
                }
            }
        }

        return maxIndex + 1;
    };

    return avalon;
});
