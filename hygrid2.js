// avalon 1.4.7.1
/**
 *
 * @cnName 表格
 * @enName hygrid
 * @introduce
 *    <p></p>
 */
define(["avalon",
    "text!./hygrid.html",
    "./hygrid.css"
], function(avalon, template) {

    var isFunction = typeof alert === "object" ? function (fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "");
        } catch (e) {
            return false;
        }
    } : function (fn) {
        return Object.prototype.toString.call(fn) === "[object Function]";
    };

    var widget = avalon.ui.hygrid = function (element, data, vmodels) {

        var vmodel = avalon.define(data.hygridId, function(vm) {

            var $element = avalon(element),
                options = data.hygridOptions,
                _columns = options.columns,
                _rawdata = options.data;

            var defaultPager = avalon.mix({
                inputPage: 1,
                perPages: 10,
                currentPage: 1,
                totalPages: 1,
                totalItems:0
            }, options.pager);

            avalon.mix(vm, options);
            vm.columns = _columns;
            vm.pager = defaultPager;
            // vm.rawData = options.data;

            vm.widgetElement = element;
            vm.rootElement = element;
            vm.$skipArray = ["widgetElement", "rootElement"];

            if (_rawdata) {
                vm.tableBody = createRowData(_columns, _rawdata, options.htmlHelper, data.hygridId);
                //设置表头宽度和表内容对应
                setHeadWidth(vm.widgetElement);
            }

            if (vm.pageable) {
                vm.currentPage = parseInt(vm.pager.currentPage);
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
                releaseVMEvents(vmodel);
                _rawdata = [];
                // vmodel.tableBody = "";
                vmodel.columns = null;
                vmodel.pager = null;
                vmodel.htmlHelper = null;
                vmodel.checkedRows = null;
                vmodel.widgetElement.innerHTML = "";
                vmodel.widgetElement = null;
                vmodel.rootElement = null;
                vmodel.onExportClicked = avalon.noop;
            };

            vm.render = function(newData) {
                // vmodel.rawData.clear();
                // vmodel.tableBody = "";
                vm.allchecked = false;
                vm.checkAll();
                _rawdata = null;
                // vmodel.widgetElement.innerHTML = "";

                //if (newData && newData.length > 0) {
                    //vmodel.rawData = newData;
                    _rawdata = newData;
                    vmodel.tableBody = createRowData(_columns, newData, vmodel.htmlHelper, data.hygridId);
                    setHeadWidth(vm.widgetElement);
                //}
            };

            vm.setCurrentPage = function(current) {
                vmodel.currentPage = vmodel.pager.inputPage = (vmodel.pager.currentPage = current ? current : 0);
            };

            vm.pageScope = function() {
                var curPage = vmodel.currentPage;
                var perPages = vmodel.pager.perPages;
                var total = vmodel.pager.totalItems;
                var start = (curPage - 1) * perPages + 1;
                var end = Math.min(curPage*perPages, total);
                return " 第 " + start + " - " + end + " 条";
            };

            vm.setTotal = function(total) {
                vmodel.pager.totalItems = total;
                vmodel.pager.totalPages = Math.ceil(total / vmodel.pager.perPages);
            };

            vm.prevPage = function() {
                var current = parseInt(vmodel.pager.currentPage);

                if (current > 1) {
                    current = current - 1;
                    vmodel.jump(current);
                }
            };

            vm.nextPage = function() {
                var current = parseInt(vmodel.pager.currentPage);

                if (current < vmodel.pager.totalPages) {
                    current = current + 1;
                    vmodel.jump(current);
                }
            };

            vm.lastPage = function() {
                vmodel.jump(vmodel.pager.totalPages);
            };

            vm.jumpTo = function() {
                vmodel.jump(parseInt(vmodel.pager.inputPage));
            };

            vm.jump = function(toPage) {
                if (toPage == NaN) {
                    return;
                }
                // console.log("current:" + vmodel.pager.currentPage + ", to:" + toPage);
                if (vmodel.pager.currentPage == toPage) {
                    return;
                }

                if (toPage < 1 || toPage > vmodel.pager.totalPages) {
                    return;
                }

                vmodel.setCurrentPage(toPage);
                // vmodel.pager.inputPage = toPage;

                if (isFunction(options.pager.onJump)) {
                    options.pager.onJump(toPage);
                }
            };

            vm.checkAll = function() {
                if (this.checked) {
                    $(vmodel.widgetElement).find("tbody tr").data("selected", true);
                    $(vmodel.widgetElement).find("tbody tr").addClass("hl");
                    $(vmodel.widgetElement).find(".ckb-cell input").attr("checked", "checked");
                } else {
                    $(vmodel.widgetElement).find("tbody tr").removeData("selected");
                    $(vmodel.widgetElement).find("tbody tr").removeClass("hl");
                    $(vmodel.widgetElement).find(".ckb-cell input").removeAttr("checked");
                }

                vmodel.onCheckChanged && vmodel.onCheckChanged();
            };

            vm.checkOne = function() {
                var jqAllCheck = $(vmodel.widgetElement).find("th.ckb-cell input");

                if ($(this).data("selected")) {
                    jqAllCheck.removeAttr("checked");
                    $(this).removeClass("hl");
                    $(this).find(".ckb-cell input").removeAttr("checked");
                    $(this).removeData("selected");
                } else {
                    $(this).addClass("hl");
                    $(this).find(".ckb-cell input").attr("checked", "chcked");
                    $(this).data("selected", true);
                    var tdchks = $(vmodel.widgetElement).find("td.ckb-cell input");
                    var bAllCheck = true;
                    tdchks.each(function(i, val) {
                        if (typeof($(this).attr("checked")) == "undefined") {
                            bAllCheck = false;
                            return false;
                        }
                    });

                    if (bAllCheck) {
                        jqAllCheck.attr("checked", "checked");
                    } else {
                        jqAllCheck.removeAttr("checked");
                    }
                }
                vmodel.onCheckChanged && vmodel.onCheckChanged();
                return false;
            };

            vm.getSelected = function() {
                var datas = [];
                var modelData = _rawdata;
                $(vmodel.widgetElement).find("tbody tr").each(function(i, val) {
                    if ($(this).data("selected")) {
                        datas.push(modelData[i]);
                    }
                });

                return datas;
            };
        });

        return vmodel;
    };

    /**
     * [setHeadWidth description]
     * @param {[type]} ele [description]
     * @author [chencheng 2016/2/16]
     */
    var setHeadWidth = function(ele) {
        if($(ele).find(".body_table table tr").length > 0) {
            var tdWidth = [];
            var sum = 0;
            $(ele).find(".body_table table tr").eq(0).find("td").each(function(i, val) {
                tdWidth.push($(this).outerWidth());
                sum += $(this).outerWidth();
            });
            $(ele).find(".head_table tr").eq(0).find("th").each(function(i, val) {
                $(this).css("width", (tdWidth[i]/sum) * 100 + "%");
            });
        }
    };

    var createRowData = function(columns, rawData, htmlHelper, widgetId) {
        if (!columns || ! rawData) {
            return null;
        }

        var html = "";
        var len = rawData.length;
        var colen = columns.length;

        // column header
        html += '<table class="head_table"><thead><tr><th class="ckb-cell" ms-visible="selectable">';
        html += '<input type="checkbox" ms-duplex-checked="allchecked" ms-on-click="checkAll"></input></th>';
        for (var i = 0; i < colen; i++) {
            var width = columns[i].width ? (parseInt(columns[i].width) + "px") : "auto";
            var align = columns[i].align ? columns[i].align : "center";
            html += '<th style="text-align:' + align + ';width:' + width + '">' + columns[i].name + '</th>';
        }
        html += '</tr></thead></table>';
        html += '<div class="body_table" ><table>'
        // data rows
        for (var i = 0; i < len; i++) {
            rawData[i].selected = false;
            var rowData = rawData[i];
            var rowCls = "";
            if (i % 2 === 1) {
                rowCls += "odd";
            }
            if (rowData.selected) {
                rowCls += " hl";
            }

            if (rowData.selected) {
                html += '<tr class="' + rowCls + '" ms-on-click="checkOne" data-selected=true>';
                html += '<td class="ckb-cell" ms-visible="selectable"><input type="checkbox" checked="checked"></input></td>';
            } else {
                html += '<tr class="' + rowCls + '" ms-on-click="checkOne" data-selected=false>';
                html += '<td class="ckb-cell" ms-visible="selectable"><input type="checkbox"></input></td>';
            }

            for (var j = 0; j < colen; j ++) {
                var col = columns[j];
                var colval = rowData[col.key];
                var displayVal = colval;
                var align = col.align ? col.align : "center";
                var width = (col.width && parseInt(col.width) !== NaN) ? (parseInt(col.width) + "px") : "auto";

                if (col.format && isFunction(htmlHelper[col.format])) {
                    displayVal = htmlHelper[col.format](col.key, i, colval, rowData);
                }
                var title = col.__title ? col.__title : displayVal;
                if (title && (("" + title).indexOf("\"") > -1)) {
                    title = col.name;
                }

                html += '<td style="text-align:' + align + ';width:' + width + '">';
                html += '<div class="td-value" style="width:' + width + '" title=\'' + title + '\'>';
                html += displayVal + "</div></td>";
            }
            html += "</tr>";
        }
        html += "</table></div>";
        return html;
    };

    widget.defaults = {
        selectable: false,
        allchecked: false,
        showExport: false,
        pageable: true,
        checkedRows: [],
        currentPage: 1,
        htmlHelper: {},
        pager: {},
        data: [],
        onExportClicked: avalon.noop,
        onCheckChanged: avalon.noop
    };

    return avalon;
});
