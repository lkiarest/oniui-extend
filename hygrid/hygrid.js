// avalon 1.3.6
/**
 *
 * @cnName 表格
 * @enName hygrid
 * @introduce
 *    <p></p>
 */
define(["avalon",
    "text!./hygrid.html",
    "css!../chameleon/oniui-common.css",
    "css!./hygrid.css"
], function(avalon, template) {

    var widget = avalon.ui.hygrid = function (element, data, vmodels) {

        var vmodel = avalon.define(data.hygridId, function(vm) {

            var $element = avalon(element),
                options = data.hygridOptions,
                _columns = options.columns;
                // _rawdata = options.data;

            var defaultPager = avalon.mix(
                {
                    perPages: 10,
                    currentPage: 1,
                    totalPages: 1,
                    totalItems:0
                }, options.pager);

            avalon.mix(vm, options);
            vm.columns = _columns;
            vm.pager = defaultPager;
            // vm.rawData = _rawdata;

            vm.widgetElement = element;
            vm.rootElement = element;
            vm.$skipArray = ["widgetElement", "rootElement"]

            vm.data = createRowData(_columns, options.data, options.htmlHelper, data.hygridId);

            if (vm.pageable) {
                vm.currentPage = vm.pager.currentPage;
            }

            vm.$init = function() {
                avalon.ready(function() {
                    element.innerHTML = template;
                    avalon.scan(element, [vmodel].concat(vmodels));
                    if (typeof options.onInit === "function") {
                        options.onInit.call(element, vmodel, options, vmodels);
                    }
                });
            };

            vm.$remove = function() {
                vmodel.data.clear();
                vmodel.data = null;
                vmodel.columns = null;
                vmodel.pager = null;
                vmodel.htmlHelper = null;
                vmodel.widgetElement.innerHTML = "";
                vmodel.widgetElement = null;
                vm.rootElement = null;
            };

            vm.render = function(newData) {
                // vmodel.rawData.clear();
                vmodel.data.clear();
                if (newData && newData.length > 0) {
                    // vmodel.rawData = newData;
                    vmodel.data = createRowData(_columns, newData, vmodel.htmlHelper, data.hygridId);
                }
            };

            vm.setCurrentPage = function(current) {
                vmodel.currentPage = vmodel.pager.currentPage = current ? current : 0;
            };

            vm.setTotal = function(total) {
                vmodel.pager.totalPages = Math.ceil(total / vmodel.pager.perPages);
            };

            vm.prevPage = function() {
                var current = vmodel.pager.currentPage;

                if (current > 1) {
                    current = current - 1;
                    vmodel.jump(current);
                }
            };

            vm.nextPage = function() {
                var current = vmodel.pager.currentPage;

                if (current < vmodel.pager.totalPages) {
                    current = current + 1;
                    vmodel.jump(current);
                }
            };

            vm.lastPage = function() {
                vmodel.jump(vmodel.pager.totalPages);
            };

            vm.jumpTo = function() {
                vmodel.jump(vmodel.currentPage);
            };

            vm.jump = function(toPage) {
                // console.log("current:" + vmodel.pager.currentPage + ", to:" + toPage);
                if (vmodel.pager.currentPage == toPage) {
                    return;
                }

                if (toPage < 1 || toPage > vmodel.pager.totalPages) {
                    return;
                }

                vmodel.setCurrentPage(toPage);

                if (isFunction(options.pager.onJump)) {
                    options.pager.onJump(toPage);
                }
            };

            vm.checkAll = function() {
                var bool = this.checked;
                vmodel.data.forEach(function(el) {
                    el.selected = bool;
                });
            };

            vm.checkOne = function() {
                if (! this.checked) {
                    vmodel.allchecked = false;
                } else {
                    vmodel.allchecked = vmodel.data.every(function(el) {
                        return el.selected;
                    });
                }
            };

            vm.getSelected = function() {
                var datas = [];
                var modelData = vmodel.data.$model;
                vmodel.data.every(function(el, i) {
                    if (el.selected) {
                        datas.push(modelData[i]);
                    }

                    return true;
                });

                return datas;
            };
        });

        return vmodel;
    };

    var createRowData = function(columns, rawData, htmlHelper, widgetId) {
        if (!columns || ! rawData) {
            return null;
        }

        var ret = [];
        for (var i = 0, len = rawData.length; i < len; i ++) {
            var row = {
                selected: false,
                data: []
            };

            var rowItem = rawData[i];
            for (var j = 0, clen = columns.length; j < clen; j++) {
                var citem = columns[j];
                var key = citem.key;
                var formater = citem.format;
                var align = citem.align ? citem.align : "center";

                if (formater && htmlHelper[formater]) {
                    var formated = htmlHelper[formater](widgetId, key, j, rowItem[key], rowItem);
                    row.data.push({"value": formated, "align": align});
                } else {
                    if (rowItem[key] !== undefined) {
                        row.data.push({"value": rowItem[key], "align": align});
                    } else {
                        row.data.push({"value": "", "align": "center"});
                    }
                }
            }

            ret.push(row);
        }

        return ret;
    };

    widget.defaults = {
        selectable: false,
        allchecked: false,
        pageable: true,
        checkedRows: [],
        currentPage: 1,
        htmlHelper: {},
        pager: {},
        data: []
    };

    return avalon;
});
