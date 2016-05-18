System.register(["../utils", "../svgFactory", "../gridOptionsWrapper", "../context/context"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var utils_1, svgFactory_1, gridOptionsWrapper_1, context_2;
    var svgFactory, HeaderTemplateLoader;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (svgFactory_1_1) {
                svgFactory_1 = svgFactory_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            }],
        execute: function() {
            svgFactory = svgFactory_1.SvgFactory.getInstance();
            let HeaderTemplateLoader_1;
            let HeaderTemplateLoader = HeaderTemplateLoader_1 = class HeaderTemplateLoader {
                createHeaderElement(column) {
                    var params = {
                        column: column,
                        colDef: column.getColDef,
                        context: this.gridOptionsWrapper.getContext(),
                        api: this.gridOptionsWrapper.getApi()
                    };
                    // option 1 - see if user provided a template in colDef
                    var userProvidedTemplate = column.getColDef().headerCellTemplate;
                    if (typeof userProvidedTemplate === 'function') {
                        var colDefFunc = userProvidedTemplate;
                        userProvidedTemplate = colDefFunc(params);
                    }
                    // option 2 - check the gridOptions for cellTemplate
                    if (!userProvidedTemplate && this.gridOptionsWrapper.getHeaderCellTemplate()) {
                        userProvidedTemplate = this.gridOptionsWrapper.getHeaderCellTemplate();
                    }
                    // option 3 - check the gridOptions for templateFunction
                    if (!userProvidedTemplate && this.gridOptionsWrapper.getHeaderCellTemplateFunc()) {
                        var gridOptionsFunc = this.gridOptionsWrapper.getHeaderCellTemplateFunc();
                        userProvidedTemplate = gridOptionsFunc(params);
                    }
                    // finally, if still no template, use the default
                    if (!userProvidedTemplate) {
                        userProvidedTemplate = this.createDefaultHeaderElement(column);
                    }
                    // template can be a string or a dom element, if string we need to convert to a dom element
                    var result;
                    if (typeof userProvidedTemplate === 'string') {
                        result = utils_1.Utils.loadTemplate(userProvidedTemplate);
                    }
                    else if (utils_1.Utils.isNodeOrElement(userProvidedTemplate)) {
                        result = userProvidedTemplate;
                    }
                    else {
                        console.error('ag-Grid: header template must be a string or an HTML element');
                    }
                    return result;
                }
                createDefaultHeaderElement(column) {
                    var eTemplate = utils_1.Utils.loadTemplate(HeaderTemplateLoader_1.HEADER_CELL_TEMPLATE);
                    this.addInIcon(eTemplate, 'sortAscending', '#agSortAsc', column, svgFactory.createArrowUpSvg);
                    this.addInIcon(eTemplate, 'sortDescending', '#agSortDesc', column, svgFactory.createArrowDownSvg);
                    this.addInIcon(eTemplate, 'sortUnSort', '#agNoSort', column, svgFactory.createArrowUpDownSvg);
                    this.addInIcon(eTemplate, 'menu', '#agMenu', column, svgFactory.createMenuSvg);
                    this.addInIcon(eTemplate, 'filter', '#agFilter', column, svgFactory.createFilterSvg);
                    return eTemplate;
                }
                addInIcon(eTemplate, iconName, cssSelector, column, defaultIconFactory) {
                    var eIcon = utils_1.Utils.createIconNoSpan(iconName, this.gridOptionsWrapper, column, defaultIconFactory);
                    eTemplate.querySelector(cssSelector).appendChild(eIcon);
                }
            };
            // used when cell is dragged
            HeaderTemplateLoader.HEADER_CELL_DND_TEMPLATE = '<div class="ag-header-cell ag-header-cell-ghost">' +
                '  <span id="eGhostIcon" class="ag-header-cell-ghost-icon ag-shake-left-to-right"></span>' +
                '  <div id="agHeaderCellLabel" class="ag-header-cell-label">' +
                '    <span id="agText" class="ag-header-cell-text"></span>' +
                '  </div>' +
                '</div>';
            HeaderTemplateLoader.HEADER_CELL_TEMPLATE = '<div class="ag-header-cell">' +
                '  <div id="agResizeBar" class="ag-header-cell-resize"></div>' +
                '  <span id="agMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                '  <div id="agHeaderCellLabel" class="ag-header-cell-label">' +
                '    <span id="agSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
                '    <span id="agSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
                '    <span id="agNoSort" class="ag-header-icon ag-sort-none-icon"></span>' +
                '    <span id="agFilter" class="ag-header-icon ag-filter-icon"></span>' +
                '    <span id="agText" class="ag-header-cell-text"></span>' +
                '  </div>' +
                '</div>';
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], HeaderTemplateLoader.prototype, "gridOptionsWrapper", void 0);
            HeaderTemplateLoader = HeaderTemplateLoader_1 = __decorate([
                context_2.Bean('headerTemplateLoader'), 
                __metadata('design:paramtypes', [])
            ], HeaderTemplateLoader);
            exports_1("HeaderTemplateLoader", HeaderTemplateLoader);
        }
    }
});
//# sourceMappingURL=headerTemplateLoader.js.map