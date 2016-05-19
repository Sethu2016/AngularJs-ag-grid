(function(angular) {
    "use strict";
    agGrid.initialiseAgGridWithAngular1(angular);
 
    angular.module("commonGrid", ["agGrid", "ui.bootstrap"])
        .directive("commonGrid", ["$compile", "$window", "$timeout", "$log", function($compile, $window, $timeout, $log) {
            return {
                restrict: 'EA',
                controllerAs: "gridCtrl",
                replace: true,
                scope: {
                    config: "="
                },
                controller: ["$scope", "$q", "$location", "$uibModal",
                            function(scope, $q, location, $uibModal ) {
                                var me = this;
                                me.gridStyle = {};
                             
                                me.formView = function() {
                                    if(me.grid.api.getSelectedNodes().length>0) {
                                        var nodes = me.grid.api.getSelectedNodes();
                                        var formViewData = [];
                                        var node = nodes[0];
                                        var columns = me.grid.columnApi.getAllColumns();
                                        for(var i=0; i<columns.length; i++) {
                                            var column = columns[i];
                                            var value = me.grid.api.getValue(column, node);
                                            if(value!=null && value!=undefined) {
                                                formViewData.push({
                                                    header: column.colDef.headerName,
                                                    data: value
                                                });
                                            }
                                        }
                                        var columnDefs = [
                                            { headerName: "header", field: "header",    editable: true, width: 100 },
                                            { headerName: "data",   field: "data",      editable: true, width: 100 }
                                        ];
                                        var gridOptions = {
                                            columnDefs: columnDefs,
                                            rowData: formViewData,
                                            dontUseScrolls : false
                                        };
                                        var parentEl = angular.element(document.body);
                                     
                                        // use uibootstrap uibModal
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            template: 
                                                '<div class="modal-header">'+
                                                    '<h3 class="modal-title">Row Info</h3>'+
                                                '</div>'+
                                                '<div class="modal-body">'+
                                                    '<div style="width:100%;height:400px;">'+
                                                        '<div ag-grid="grid" class="ag-fresh" style="width:100%;height:100%;"></div>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="modal-footer">'+
                                                    '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>'+
                                                '</div>', 
                                            controller: ["$scope","$uibModalInstance","grid",function(scope, $uibModalInstance, grid){
                                                scope.grid = grid;
                                                scope.ok = function () {
                                                    $uibModalInstance.close();
                                                };
                                            }],
                                            size: 'sm',
                                            resolve: {
                                                grid: gridOptions
                                            }
                                        }).rendered.then(
                                            function(){
                                                $timeout(function(){
                                                    gridOptions.api.sizeColumnsToFit();
                                                }, 500);
                                            }
                                        );
                                    }
                                };
                             
                                me.showFilter = false;
                                me.doSearch = function() {
                                    me.showFilter = !me.showFilter;
                                };
                                me.replaceObj = {
                                    column: null,
                                    searchVal: "",
                                    replaceVal: ""
                                };
                                me.showReplace = false;
                                me.doReplace = function() {
                                    me.showReplace = !me.showReplace;
                                };
                                me.replace = function() {
                                    // only replace row filter
                                    var replaceAll = !(me.grid.api.getSelectedNodes().length>0);
                                    me.grid.api.forEachNodeAfterFilter(function(node, index) {
                                        var nodeValue = me.grid.api.getValue(me.replaceObj.column, node);
                                        var isReplace = (node.data[me.replaceObj.column.colDef.field]+""===me.replaceObj.searchVal);
                                        if((replaceAll && isReplace) || (!replaceAll && node.isSelected() && isReplace)) {
                                            node.data[me.replaceObj.column.colDef.field] = me.replaceObj.replaceVal;
                                        }
                                    });
                                    me.grid.api.refreshView();
                                };
                             
                                me.exportFile = function(type) {
                                    var header = [];
                                    var exportDataList = [];
                                    var model = me.grid.api.getModel();
                                    var i=0;
                                    var columns = me.grid.columnApi.getAllColumns();
                                    for(i=0; i<columns.length; i++) {
                                        var colDef = columns[i].colDef;
                                        if(colDef.headerName) {
                                            header.push(colDef.headerName);
                                        }
                                     
                                    }
                                    if(model.getRowCount()>0) {
                                        for(var i=0; i<model.getRowCount(); i++) {
                                            var node = model.allRows[i];
                                            var exportData = {};
                                            for(var j=0; j<columns.length; j++) {
                                                var colDef = columns[j].colDef;
                                                if(colDef.headerName) {
                                                    var value = me.grid.api.getValue(columns[j], node);
                                                    if(value==null || value==undefined) {
                                                        value="";
                                                    }
                                                    exportData[colDef.headerName] = value;
                                                }
                                            }
                                            exportDataList.push(exportData);
                                        }
                                    }
                                    var handleData = {
                                        sheetName: scope.config.titleName ? scope.config.titleName : "sheet1",
                                        header: header,
                                        data: exportDataList
                                    };
                                    // create a form to post data
                                    var actionUrl="";
                                    if(scope.config.exportExcelURL!=null && scope.config.exportExcelURL!="") {
                                        actionUrl = scope.config.exportExcelURL;
                                    } else {
                                        actionUrl = "../exportExcel";
                                    }
                                    if(type=="csv") {
                                        if(scope.config.exportCsvURL!=null && scope.config.exportCsvURL!="") {
                                            actionUrl = scope.config.exportCsvURL; 
                                        } else {
                                            actionUrl = "../exportCSV";
                                        }
                                    }
                                    var form = document.createElement("form");
                                    form.setAttribute("method", "POST");
                                    form.setAttribute("action", actionUrl);
                                    var input = document.createElement("input");
                                    input.setAttribute("type", "hidden");
                                    input.setAttribute("name", "data");
                                    input.setAttribute("value", JSON.stringify(handleData));
                                    form.appendChild(input);
                                    var body = document.getElementsByTagName("BODY")[0];
                                    body.appendChild(form);
                                    form.submit();
                                    body.removeChild(form);
                                };
                             
                                me.copy = function() {
                                    var copyContent = "None data selected\n";
                                    if(me.grid.api.getSelectedNodes().length>0) {
                                        copyContent = "";
                                        for(var i=0; i<me.grid.api.getSelectedNodes().length; i++) {
                                            var node = me.grid.api.getSelectedNodes()[i];
                                            var columns = me.grid.columnApi.getAllColumns()
                                            for(var j=0; j<columns.length; j++) {
                                                var value = me.grid.api.getValue(columns[j], node);
                                                if(value!=null && value!=undefined) {
                                                    copyContent += value + " ";
                                                }
                                            }
                                            copyContent += "\n";
                                        }
                                    }
                                    document.addEventListener('copy', function (e) {
                                        e.preventDefault();
                                        if (e.clipboardData) {
                                            e.clipboardData.setData('text/plain', copyContent);
                                        } else if (window.clipboardData) {
                                            window.clipboardData.setData('Text', copyContent);
                                        }
                                    });
                                    document.execCommand('copy');
                                 
                                };
                                var configCheck = function() {
                                    var returnMsg = {
                                        success: true,
                                        msg: ""
                                    };
                                    if(scope.config==null || scope.config==undefined) {
                                        returnMsg.msg = "CGrid_ERR - config is not found.";
                                        returnMsg.success=false;
                                        return returnMsg;
                                    }
                                 
                                    if(scope.config.columns==null || scope.config.columns==undefined) {
                                        returnMsg.msg = "CGrid_ERR - column definition is not found.";
                                        returnMsg.success=false;
                                        return returnMsg;
                                    }
                                    if(scope.config.autoload==null) {
                                        scope.config.autoload=false;
                                    }
                                    if(scope.config.autoload && (scope.config.loader==null || scope.config.loader==undefined)) {
                                        returnMsg.msg = "CGrid_ERR - data loader not found.";
                                        returnMsg.success=false;
                                        return returnMsg;
                                    }
                                    return returnMsg;
                                };
                                me.init = function() {
                                    var setGridJob = $q.defer();
                                 
                                    var checkResult = configCheck();
                                    if(!checkResult.success) {
                                        setGridJob.reject(checkResult.msg);
                                        return setGridJob.promise;
                                    }
                                 
                                    var columns=scope.config.columns;
                                    if(scope.config.addSelectAllCheckbox){
                                        if(!(columns[0].id=="cgCheckBoxHeader" && columns[0].checkboxSelection)) {
                                            columns.unshift({   
                                                id: "cgCheckBoxHeader",
                                                width:25, suppressMenu : true, suppressSorting : true, checkboxSelection : true,
                                                suppressResize: true, suppressSizeToFit:false,
                                                headerClass: "cg-check-box-header",
                                                headerName:null,
                                                headerCellRenderer: function(){
                                                    var eInput = document.createElement('input');
                                                    eInput.className='ag-selection-checkbox';
                                                    eInput.setAttribute("type", "checkbox");
                                                    eInput.addEventListener('change', function() {
                                                        var checked=this.checked;
                                                        var model = me.grid.api.getModel(); 
                                                        if(model.getRowCount()>0) {
                                                            if (checked) {
                                                                //Only select filter Rows
                                                                for (var i = 0; i < model.getRowCount(); i++) {
                                                                    var node = model.rowsToDisplay[i];                      
                                                                    node.setSelected(true);         
                                                                } 
                                                            } else {               
                                                                for (var i = 0; i < model.getRowCount(); i++) {
                                                                    var node = model.rowsToDisplay[i];                      
                                                                    node.setSelected(false);        
                                                                }
                                                            }
                                                        }
                                                    });    
                                                    return eInput;
                                                }
                                            });
                                        }
                                    }
                                 
                                    // 4.0.4 pinned by column definition
                                    if(scope.config.pinned!=null && scope.config.pinned>0) {
                                        if(scope.config.pinned >= columns.length) {
                                            setGridJob.reject("CGrid_ERR - there are to many columns pinned");
                                            return setGridJob.promise;
                                        }
                                     
                                        for(var i=0; i<scope.config.pinned; i++) {
                                            if(!columns[i].children) {
                                                columns[i].pinned = "left";
                                            }
                                        }
                                    }
                                    scope.config.api = {
                                        getAllData: function() {
                                            return me.grid.rowData;
                                        },
                                        setAllData: function(data) {
                                            me.grid.api.setRowData(data);
                                        },
                                        loadData: function() {
                                            if(scope.config.loader) {
                                                var loadJob = $q.defer();
                                                scope.config.loader.apply(scope, arguments).then(
                                                    function(data) {
                                                        me.grid.api.setRowData(data);
                                                        loadJob.resolve(true);
                                                    },
                                                    function() {
                                                        loadJob.reject(false);
                                                    }
                                                );
                                                return loadJob.promise;
                                            }
                                        },
                                        getSelected:function(){
                                            var list = me.grid.api.getSelectedNodes();
                                            var returnList = [];
                                            if(list!=null && list.length>0) {
                                                for(var i=0; i<list.length;i++) {
                                                    returnList.push(list[i].data);
                                                }
                                            }
                                            return returnList;
                                        },
                                        refreshData: function() {
                                            var list = me.grid.api.getSelectedNodes();
                                            me.grid.api.refreshRows(list); 
                                        },
                                        setHeight: null
                                    };
                                 
                                    scope.config.grid = me.grid = {
                                        columnDefs: scope.config.columns,
                                        rowData: scope.config.autoload ? null : [],
                                        rowSelection: 'multiple',
                                        suppressRowClickSelection: scope.config.suppressRowClickSelection,
                                        enableFilter: true,
                                        enableSorting: true,
                                        enableColResize: true,
                                        suppressMenuHide: true,
                                        dontUseScrolls : false,
                                        groupHeaders: scope.config.isColumnGrouping,
                                        //pinnedColumnCount: scope.config.pinned ? scope.config.pinned: 0, //none such parameter in 4.0.4
                                        angularCompileRows: true,
                                        icons: {
                                            columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                                            columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
                                        },
                                        onModelUpdated: function() {
                                            if(me.grid.rowData) {
                                                var model = me.grid.api.getModel();
                                                var totalRows = me.grid.rowData==null? 0 : me.grid.rowData.length;
                                                var processedRows = model.getRowCount()==null? 0 : model.getRowCount();
                                                me.rowCount = processedRows + " / " + totalRows;
                                            }
                                        },
                                        columnResized: function(col) {
                                            if(scope.config.autoResizeColumn) {
                                                me.grid.api.sizeColumnsToFit();
                                            }
                                        },
                                        onGridReady: function(event) {
                                            if(scope.config.autoResizeColumn) {
                                                event.api.sizeColumnsToFit();
                                            }
                                            if(scope.config.autoload && scope.config.loader) {
                                                scope.config.loader.apply(scope, scope.config.autoloadArgs).then(
                                                    function(data) {
                                                        me.grid.api.setRowData(data);
                                                        if(scope.config.autoResizeColumn) {
                                                            event.api.sizeColumnsToFit();
                                                        }
                                                    }
                                                );
                                            }
                                            var columns = event.columnApi.getAllColumns();
                                            if(scope.config.addSelectAllCheckbox) {
                                                me.replaceObj.column = columns[1];
                                            }else {
                                                me.replaceObj.column = columns[0];
                                            }
                                         
                                            scope.config.api.setHeight(null);
                                        },
                                        onRowSelected: function(event) {
                                            if(scope.config.afterSelected) {
                                                scope.config.afterSelected(event.node.data);
                                            }
                                        }
                                    };
                                    if(scope.config.debug) {
                                        window.cgScope = scope;
                                    }
                                    setGridJob.resolve(me.grid);
                                    return setGridJob.promise;
                                };
                            }
                ],
                link: function(scope, element, attr) {
                    scope.gridCtrl.init().then(
                        function(grid) {
                            var showTitle = scope.config.showTitle&&scope.config.titleName!="" ? "inline" : "none";
                         
                            var showFormView = scope.config.showFormView!=null ? scope.config.showFormView : true;                      
                            var showExpExcel = scope.config.showExpExcel!=null ? scope.config.showExpExcel : true;                      
                            var showExpCsv = scope.config.showExpCsv!=null ? scope.config.showExpCSV : true;                        
                            var showCopy = scope.config.showCopy!=null ? scope.config.showCopy : true;                          
                            var showSearch = scope.config.showSearch!=null ? scope.config.showSearch : true;
                            var showReplaceTool = scope.config.showReplaceTool!=null ? scope.config.showReplaceTool : true;
                         
                            var toolbar = document.createElement("div");
                            toolbar.className='btn-toolbar cg-toolbar-div';
                            var btnClass = "btn btn-primary";
                            var btnStyle = "display:inline;margin-left:5px;margin-bottom:3px;";
                            if(showFormView) {
                                var formViewBtn = document.createElement("button");
                                formViewBtn.setAttribute("type", "button");
                                formViewBtn.setAttribute("class", btnClass);
                                formViewBtn.setAttribute("title", "Form View");
                                formViewBtn.setAttribute("style", btnStyle);
                                formViewBtn.setAttribute("ng-click","gridCtrl.formView()");
                                formViewBtn.innerHTML="<i class='fa fa-list-alt'></i> Form View";
                                toolbar.appendChild(formViewBtn);
                            }
                            if(showExpExcel) {
                                var expExcelBtn = document.createElement("button");
                                expExcelBtn.setAttribute("type", "button");
                                expExcelBtn.setAttribute("class", btnClass);
                                expExcelBtn.setAttribute("title", "Export Excel");
                                expExcelBtn.setAttribute("style", btnStyle);
                                expExcelBtn.setAttribute("ng-click","gridCtrl.exportFile('excel')");
                                expExcelBtn.innerHTML="<i class='fa fa-file-excel-o'></i> Export Excel";
                                toolbar.appendChild(expExcelBtn);
                            }
                            if(showExpCsv) {
                                var expCsvBtn = document.createElement("button");
                                expCsvBtn.setAttribute("type", "button");
                                expCsvBtn.setAttribute("class", btnClass);
                                expCsvBtn.setAttribute("title", "Export CSV");
                                expCsvBtn.setAttribute("style", btnStyle);
                                expCsvBtn.setAttribute("ng-click","gridCtrl.exportFile('csv')");
                                expCsvBtn.innerHTML="<i class='fa fa-file-o'></i> Export CSV";
                                toolbar.appendChild(expCsvBtn);
                            }
                            if(showCopy) {
                                var copyBtn = document.createElement("button");
                                copyBtn.setAttribute("type", "button");
                                copyBtn.setAttribute("class", btnClass);
                                copyBtn.setAttribute("title", "Clipboard");
                                copyBtn.setAttribute("style", btnStyle);
                                copyBtn.setAttribute("ng-click","gridCtrl.copy()");
                                copyBtn.innerHTML="<i class='fa fa-copy'></i> Clipboard";
                                toolbar.appendChild(copyBtn);
                            }
                            if(showSearch) {
                                var searchBtn = document.createElement("button");
                                searchBtn.setAttribute("type", "button");
                                searchBtn.setAttribute("class", btnClass);
                                searchBtn.setAttribute("title", "Search");
                                searchBtn.setAttribute("style", btnStyle);
                                searchBtn.setAttribute("ng-click","gridCtrl.doSearch()");
                                searchBtn.innerHTML="<i class='fa fa-search'></i> Search";
                                var searchInput = document.createElement("input");
                                searchInput.setAttribute("placeholder", "Filter...");
                                searchInput.setAttribute("ng-model", "gridCtrl.grid.quickFilterText");
                                searchInput.setAttribute("ng-show", "gridCtrl.showFilter");
                                searchInput.setAttribute("style", "height: 33px;margin-left: 1px;");
                                toolbar.appendChild(searchBtn);
                                toolbar.appendChild(searchInput);
                            }
 
                            if(showReplaceTool) {
                                var replaceBtn = document.createElement("button");
                                replaceBtn.setAttribute("type", "button");
                                replaceBtn.setAttribute("class", btnClass);
                                replaceBtn.setAttribute("title", "Replace");
                                replaceBtn.setAttribute("style", btnStyle);
                                replaceBtn.setAttribute("ng-click","gridCtrl.doReplace()");
                                replaceBtn.innerHTML="<i class='fa fa-retweet'></i> Replace";
                                var replaceColumnCombo = document.createElement("select");
                                replaceColumnCombo.setAttribute("style", "height:34px;width:150px");
                                replaceColumnCombo.setAttribute("ng-model", "gridCtrl.replaceObj.column");
                                replaceColumnCombo.setAttribute("ng-options", "c.colDef.headerName for c in gridCtrl.grid.columnApi.getAllColumns() | filter:{colId:'!0'}");
                                replaceColumnCombo.setAttribute("ng-show", "gridCtrl.showReplace");
                                var searchVal = document.createElement("input");
                                searchVal.setAttribute("placeholder", "search value...");
                                searchVal.setAttribute("ng-model", "gridCtrl.replaceObj.searchVal");
                                searchVal.setAttribute("ng-show", "gridCtrl.showReplace");
                                searchVal.setAttribute("style", "height: 33px;margin-left: 1px;");
                                var spanTo = document.createElement("span");
                                spanTo.setAttribute("ng-show", "gridCtrl.showReplace");
                                spanTo.innerHTML = "<i class='fa fa-arrow-circle-right'></i>";
                                var replaceVal = document.createElement("input");
                                replaceVal.setAttribute("placeholder", "replace value...");
                                replaceVal.setAttribute("ng-model", "gridCtrl.replaceObj.replaceVal");
                                replaceVal.setAttribute("ng-show", "gridCtrl.showReplace");
                                replaceVal.setAttribute("style", "height: 33px;margin-left: 0;");
                                var doReplaceBtn = document.createElement("button");
                                doReplaceBtn.setAttribute("type", "button");
                                doReplaceBtn.setAttribute("class", btnClass);
                                doReplaceBtn.setAttribute("title", "GO");
                                doReplaceBtn.setAttribute("style", "display:inline;margin-left: 0;margin-bottom:3px;");
                                doReplaceBtn.setAttribute("ng-click","gridCtrl.replace()");
                                doReplaceBtn.setAttribute("ng-show", "gridCtrl.showReplace");
                                doReplaceBtn.innerHTML="<i class='fa fa-play'></i> GO";
                                toolbar.appendChild(replaceBtn);
                                toolbar.appendChild(replaceColumnCombo);
                                toolbar.appendChild(searchVal);
                                toolbar.appendChild(spanTo);
                                toolbar.appendChild(replaceVal);
                                toolbar.appendChild(doReplaceBtn);
                            }
 
                            var showCustom = scope.config.customBtns!=null && scope.config.customBtns.length>0;
                            if(showCustom) {
                                for(var i=0;i<scope.config.customBtns.length;i++){
                                    var customBtn = scope.config.customBtns[i];
                                    var btnId = customBtn.id;
                                    var btnHint = customBtn.hint;
                                    var btn = document.createElement("button");
                                    btn.setAttribute("id", btnId);
                                    btn.setAttribute("class", btnClass);
                                    btn.setAttribute("title", btnHint);
                                    btn.setAttribute("style", btnStyle);
 
                                    var btnHtml = "";
                                    if(customBtn.iconCls) {
                                        btnHtml+="<i class='" + customBtn.iconCls + "'></i>";
                                    };
                                    if(customBtn.text) {
                                        btnHtml+=" " + customBtn.text;
                                    };
                                    btn.innerHTML=btnHtml;
                                    btn.addEventListener("click", scope.config.customBtns[i].handler);
                                    toolbar.appendChild(btn);
                                }
                            }
                            element.append(toolbar);
                         
                            var parentEl = (element.parent())[0];
                            if(scope.config.parentElId!=null && scope.config.parentElId!="") {
                                parentEl = angular.element("#"+parentElId)[0];
                            }
                            var toolbarHeight = (showFormView||showExpExcel||showExpCsv||showCopy||showSearch||showCustom) ? 60 : 24;
                            var fixedHeight = 24;
                            var parentHeight = parentEl.offsetHeight;
                            var gridHeight =  parentHeight - toolbarHeight - fixedHeight;
                            scope.gridCtrl.gridStyle = {
                                'margin': '0',
                                'height': gridHeight + 'px'
                            };
                            scope.config.api.setHeight = function(parentHeight) {
                                $timeout(function() {
                                    toolbarHeight = element.children()[0].offsetHeight;
                                    if(parentHeight!=null && parentHeight!=0) {
                                        gridHeight = parentHeight - toolbarHeight - fixedHeight;
                                    } else {
                                        gridHeight = parentEl.offsetHeight - toolbarHeight - fixedHeight;
                                    }
                                    scope.gridCtrl.gridStyle = {
                                        'margin': '0',
                                        'height': gridHeight + 'px'
                                    }
                                    if(scope.config!=null && scope.config.autoResizeColumn) {
                                        grid.api.sizeColumnsToFit();
                                    }
                                }, 350);
                            };
                         
                            var gridTitleDiv = document.createElement("div");
                            gridTitleDiv.setAttribute("class", "cg-title-div");
                            gridTitleDiv.innerHTML= "<span>" +
                                                        "<b><span style='display:"+ showTitle +";'>" + 
                                                            scope.config.titleName + 
                                                        "</span> (visible / total): </b>" +
                                                    "</span>{{gridCtrl.rowCount}}";
                            element.append(gridTitleDiv);
                         
                            var gridDiv = document.createElement("div");
                            gridDiv.setAttribute("ag-grid", "gridCtrl.grid");
                            gridDiv.setAttribute("class", "ag-fresh");
                            gridDiv.setAttribute("ng-style", "gridCtrl.gridStyle");
                            element.append(gridDiv);
 
                            $compile(element.contents())(scope);
                        },
                        function(reason) {
                            $log.log(reason);
                        }
                    );
                }
            };
        }]);     
})(window.angular);
