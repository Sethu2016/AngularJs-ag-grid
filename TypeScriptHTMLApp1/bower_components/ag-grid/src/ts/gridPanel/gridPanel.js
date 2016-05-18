System.register(["../utils", "../masterSlaveService", "../gridOptionsWrapper", "../columnController/columnController", "../rendering/rowRenderer", "../rowControllers/floatingRowModel", "../layout/borderLayout", "../logger", "../context/context", "../eventService", "../events", "../dragAndDrop/dragService", "../constants", "../selectionController", "../csvCreator", "./mouseEventService", "../focusedCellController"], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var utils_1, masterSlaveService_1, gridOptionsWrapper_1, columnController_1, rowRenderer_1, floatingRowModel_1, borderLayout_1, logger_1, context_2, eventService_1, events_1, dragService_1, constants_1, selectionController_1, csvCreator_1, mouseEventService_1, focusedCellController_1;
    var gridHtml, gridForPrintHtml, mainOverlayTemplate, defaultLoadingOverlayTemplate, defaultNoRowsOverlayTemplate, GridPanel;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (masterSlaveService_1_1) {
                masterSlaveService_1 = masterSlaveService_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (rowRenderer_1_1) {
                rowRenderer_1 = rowRenderer_1_1;
            },
            function (floatingRowModel_1_1) {
                floatingRowModel_1 = floatingRowModel_1_1;
            },
            function (borderLayout_1_1) {
                borderLayout_1 = borderLayout_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (dragService_1_1) {
                dragService_1 = dragService_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (selectionController_1_1) {
                selectionController_1 = selectionController_1_1;
            },
            function (csvCreator_1_1) {
                csvCreator_1 = csvCreator_1_1;
            },
            function (mouseEventService_1_1) {
                mouseEventService_1 = mouseEventService_1_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            }],
        execute: function() {
            // in the html below, it is important that there are no white space between some of the divs, as if there is white space,
            // it won't render correctly in safari, as safari renders white space as a gap
            gridHtml = '<div>' +
                // header
                '<div class="ag-header">' +
                '<div class="ag-pinned-left-header"></div>' +
                '<div class="ag-pinned-right-header"></div>' +
                '<div class="ag-header-viewport">' +
                '<div class="ag-header-container"></div>' +
                '</div>' +
                '<div class="ag-header-overlay"></div>' +
                '</div>' +
                // floating top
                '<div class="ag-floating-top">' +
                '<div class="ag-pinned-left-floating-top"></div>' +
                '<div class="ag-pinned-right-floating-top"></div>' +
                '<div class="ag-floating-top-viewport">' +
                '<div class="ag-floating-top-container"></div>' +
                '</div>' +
                '</div>' +
                // floating bottom
                '<div class="ag-floating-bottom">' +
                '<div class="ag-pinned-left-floating-bottom"></div>' +
                '<div class="ag-pinned-right-floating-bottom"></div>' +
                '<div class="ag-floating-bottom-viewport">' +
                '<div class="ag-floating-bottom-container"></div>' +
                '</div>' +
                '</div>' +
                // body
                '<div class="ag-body">' +
                '<div class="ag-pinned-left-cols-viewport">' +
                '<div class="ag-pinned-left-cols-container"></div>' +
                '</div>' +
                '<div class="ag-pinned-right-cols-viewport">' +
                '<div class="ag-pinned-right-cols-container"></div>' +
                '</div>' +
                '<div class="ag-body-viewport-wrapper">' +
                '<div class="ag-body-viewport">' +
                '<div class="ag-body-container"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            gridForPrintHtml = '<div>' +
                // header
                '<div class="ag-header-container"></div>' +
                // floating
                '<div class="ag-floating-top-container"></div>' +
                // body
                '<div class="ag-body-container"></div>' +
                // floating bottom
                '<div class="ag-floating-bottom-container"></div>' +
                '</div>';
            // wrapping in outer div, and wrapper, is needed to center the loading icon
            // The idea for centering came from here: http://www.vanseodesign.com/css/vertical-centering/
            mainOverlayTemplate = '<div class="ag-overlay-panel">' +
                '<div class="ag-overlay-wrapper ag-overlay-[OVERLAY_NAME]-wrapper">[OVERLAY_TEMPLATE]</div>' +
                '</div>';
            defaultLoadingOverlayTemplate = '<span class="ag-overlay-loading-center">[LOADING...]</span>';
            defaultNoRowsOverlayTemplate = '<span class="ag-overlay-no-rows-center">[NO_ROWS_TO_SHOW]</span>';
            let GridPanel = class GridPanel {
                constructor() {
                    this.scrollLagCounter = 0;
                    this.lastLeftPosition = -1;
                    this.lastTopPosition = -1;
                    this.animationThreadCount = 0;
                }
                agWire(loggerFactory) {
                    // makes code below more readable if we pull 'forPrint' out
                    this.forPrint = this.gridOptionsWrapper.isForPrint();
                    this.scrollWidth = utils_1.Utils.getScrollbarWidth();
                    this.logger = loggerFactory.create('GridPanel');
                    this.findElements();
                }
                onRowDataChanged() {
                    if (this.rowModel.isEmpty() && !this.gridOptionsWrapper.isSuppressNoRowsOverlay()) {
                        this.showNoRowsOverlay();
                    }
                    else {
                        this.hideOverlay();
                    }
                }
                getLayout() {
                    return this.layout;
                }
                init() {
                    this.addEventListeners();
                    this.addDragListeners();
                    this.layout = new borderLayout_1.BorderLayout({
                        overlays: {
                            loading: utils_1.Utils.loadTemplate(this.createLoadingOverlayTemplate()),
                            noRows: utils_1.Utils.loadTemplate(this.createNoRowsOverlayTemplate())
                        },
                        center: this.eRoot,
                        dontFill: this.forPrint,
                        name: 'eGridPanel'
                    });
                    this.layout.addSizeChangeListener(this.sizeHeaderAndBody.bind(this));
                    this.addScrollListener();
                    if (this.gridOptionsWrapper.isSuppressHorizontalScroll()) {
                        this.eBodyViewport.style.overflowX = 'hidden';
                    }
                    if (this.gridOptionsWrapper.isRowModelDefault() && !this.gridOptionsWrapper.getRowData()) {
                        this.showLoadingOverlay();
                    }
                    this.setWidthsOfContainers();
                    this.showPinnedColContainersIfNeeded();
                    this.sizeHeaderAndBody();
                    this.disableBrowserDragging();
                    this.addShortcutKeyListeners();
                    this.addCellListeners();
                }
                // if we do not do this, then the user can select a pic in the grid (eg an image in a custom cell renderer)
                // and then that will start the browser native drag n' drop, which messes up with our own drag and drop.
                disableBrowserDragging() {
                    this.eRoot.addEventListener('dragstart', (event) => {
                        if (event.target instanceof HTMLImageElement) {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
                addEventListeners() {
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_MOVED, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGE, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_RESIZED, this.onColumnsChanged.bind(this));
                    //this.eventService.addEventListener(Events.EVENT_COLUMN_VALUE_CHANGE, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_PINNED, this.onColumnsChanged.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_FLOATING_ROW_DATA_CHANGED, this.sizeHeaderAndBody.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_HEADER_HEIGHT_CHANGED, this.sizeHeaderAndBody.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_ROW_DATA_CHANGED, this.onRowDataChanged.bind(this));
                }
                addDragListeners() {
                    if (this.forPrint // no range select when doing 'for print'
                        || !this.gridOptionsWrapper.isEnableRangeSelection() // no range selection if no property
                        || utils_1.Utils.missing(this.rangeController)) {
                        return;
                    }
                    var containers = [this.ePinnedLeftColsContainer, this.ePinnedRightColsContainer, this.eBodyContainer,
                        this.eFloatingTop, this.eFloatingBottom];
                    containers.forEach(container => {
                        this.dragService.addDragSource({
                            dragStartPixels: 0,
                            eElement: container,
                            onDragStart: this.rangeController.onDragStart.bind(this.rangeController),
                            onDragStop: this.rangeController.onDragStop.bind(this.rangeController),
                            onDragging: this.rangeController.onDragging.bind(this.rangeController)
                        });
                    });
                }
                addCellListeners() {
                    var eventNames = ['click', 'mousedown', 'dblclick', 'contextmenu'];
                    var that = this;
                    eventNames.forEach(eventName => {
                        this.eAllCellContainers.forEach(container => container.addEventListener(eventName, function (mouseEvent) {
                            var eventSource = this;
                            that.processMouseEvent(eventName, mouseEvent, eventSource);
                        }));
                    });
                }
                processMouseEvent(eventName, mouseEvent, eventSource) {
                    var cell = this.mouseEventService.getCellForMouseEvent(mouseEvent);
                    if (utils_1.Utils.exists(cell)) {
                        //console.log(`row = ${cell.rowIndex}, floating = ${floating}`);
                        this.rowRenderer.onMouseEvent(eventName, mouseEvent, eventSource, cell);
                    }
                }
                addShortcutKeyListeners() {
                    this.eAllCellContainers.forEach((container) => {
                        container.addEventListener('keydown', (event) => {
                            if (event.ctrlKey || event.metaKey) {
                                switch (event.which) {
                                    case constants_1.Constants.KEY_A: return this.onCtrlAndA(event);
                                    case constants_1.Constants.KEY_C: return this.onCtrlAndC(event);
                                    case constants_1.Constants.KEY_V: return this.onCtrlAndV(event);
                                    case constants_1.Constants.KEY_D: return this.onCtrlAndD(event);
                                }
                            }
                        });
                    });
                }
                onCtrlAndA(event) {
                    if (this.rangeController && this.rowModel.isRowsToRender()) {
                        var rowEnd;
                        var floatingStart;
                        var floatingEnd;
                        if (this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_TOP)) {
                            floatingStart = null;
                        }
                        else {
                            floatingStart = constants_1.Constants.FLOATING_TOP;
                        }
                        if (this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_BOTTOM)) {
                            floatingEnd = null;
                            rowEnd = this.rowModel.getRowCount() - 1;
                        }
                        else {
                            floatingEnd = constants_1.Constants.FLOATING_BOTTOM;
                            rowEnd = this.floatingRowModel.getFloatingBottomRowData().length = 1;
                        }
                        var allDisplayedColumns = this.columnController.getAllDisplayedColumns();
                        if (utils_1.Utils.missingOrEmpty(allDisplayedColumns)) {
                            return;
                        }
                        this.rangeController.setRange({
                            rowStart: 0,
                            floatingStart: floatingStart,
                            rowEnd: rowEnd,
                            floatingEnd: floatingEnd,
                            columnStart: allDisplayedColumns[0],
                            columnEnd: allDisplayedColumns[allDisplayedColumns.length - 1]
                        });
                    }
                    event.preventDefault();
                    return false;
                }
                onCtrlAndC(event) {
                    if (!this.clipboardService) {
                        return;
                    }
                    var focusedCell = this.focusedCellController.getFocusedCell();
                    this.clipboardService.copyToClipboard();
                    event.preventDefault();
                    // the copy operation results in loosing focus on the cell,
                    // because of the trickery the copy logic uses with a temporary
                    // widget. so we set it back again.
                    if (focusedCell) {
                        this.focusedCellController.setFocusedCell(focusedCell.rowIndex, focusedCell.column, focusedCell.floating, true);
                    }
                    return false;
                }
                onCtrlAndV(event) {
                    if (!this.rangeController) {
                        return;
                    }
                    this.clipboardService.pasteFromClipboard();
                    return false;
                }
                onCtrlAndD(event) {
                    if (!this.clipboardService) {
                        return;
                    }
                    this.clipboardService.copyRangeDown();
                    event.preventDefault();
                    return false;
                }
                getPinnedLeftFloatingTop() {
                    return this.ePinnedLeftFloatingTop;
                }
                getPinnedRightFloatingTop() {
                    return this.ePinnedRightFloatingTop;
                }
                getFloatingTopContainer() {
                    return this.eFloatingTopContainer;
                }
                getPinnedLeftFloatingBottom() {
                    return this.ePinnedLeftFloatingBottom;
                }
                getPinnedRightFloatingBottom() {
                    return this.ePinnedRightFloatingBottom;
                }
                getFloatingBottomContainer() {
                    return this.eFloatingBottomContainer;
                }
                createOverlayTemplate(name, defaultTemplate, userProvidedTemplate) {
                    var template = mainOverlayTemplate
                        .replace('[OVERLAY_NAME]', name);
                    if (userProvidedTemplate) {
                        template = template.replace('[OVERLAY_TEMPLATE]', userProvidedTemplate);
                    }
                    else {
                        template = template.replace('[OVERLAY_TEMPLATE]', defaultTemplate);
                    }
                    return template;
                }
                createLoadingOverlayTemplate() {
                    var userProvidedTemplate = this.gridOptionsWrapper.getOverlayLoadingTemplate();
                    var templateNotLocalised = this.createOverlayTemplate('loading', defaultLoadingOverlayTemplate, userProvidedTemplate);
                    var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
                    var templateLocalised = templateNotLocalised.replace('[LOADING...]', localeTextFunc('loadingOoo', 'Loading...'));
                    return templateLocalised;
                }
                createNoRowsOverlayTemplate() {
                    var userProvidedTemplate = this.gridOptionsWrapper.getOverlayNoRowsTemplate();
                    var templateNotLocalised = this.createOverlayTemplate('no-rows', defaultNoRowsOverlayTemplate, userProvidedTemplate);
                    var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
                    var templateLocalised = templateNotLocalised.replace('[NO_ROWS_TO_SHOW]', localeTextFunc('noRowsToShow', 'No Rows To Show'));
                    return templateLocalised;
                }
                ensureIndexVisible(index) {
                    this.logger.log('ensureIndexVisible: ' + index);
                    var lastRow = this.rowModel.getRowCount();
                    if (typeof index !== 'number' || index < 0 || index >= lastRow) {
                        console.warn('invalid row index for ensureIndexVisible: ' + index);
                        return;
                    }
                    var nodeAtIndex = this.rowModel.getRow(index);
                    var rowTopPixel = nodeAtIndex.rowTop;
                    var rowBottomPixel = rowTopPixel + nodeAtIndex.rowHeight;
                    var viewportTopPixel = this.eBodyViewport.scrollTop;
                    var viewportHeight = this.eBodyViewport.offsetHeight;
                    var scrollShowing = this.isHorizontalScrollShowing();
                    if (scrollShowing) {
                        viewportHeight -= this.scrollWidth;
                    }
                    var viewportBottomPixel = viewportTopPixel + viewportHeight;
                    var viewportScrolledPastRow = viewportTopPixel > rowTopPixel;
                    var viewportScrolledBeforeRow = viewportBottomPixel < rowBottomPixel;
                    var eViewportToScroll = this.columnController.isPinningRight() ? this.ePinnedRightColsViewport : this.eBodyViewport;
                    if (viewportScrolledPastRow) {
                        // if row is before, scroll up with row at top
                        eViewportToScroll.scrollTop = rowTopPixel;
                    }
                    else if (viewportScrolledBeforeRow) {
                        // if row is below, scroll down with row at bottom
                        var newScrollPosition = rowBottomPixel - viewportHeight;
                        eViewportToScroll.scrollTop = newScrollPosition;
                    }
                    // otherwise, row is already in view, so do nothing
                }
                // + moveColumnController
                getCenterWidth() {
                    return this.eBodyViewport.clientWidth;
                }
                isHorizontalScrollShowing() {
                    var result = this.eBodyViewport.clientWidth < this.eBodyViewport.scrollWidth;
                    return result;
                }
                isVerticalScrollShowing() {
                    if (this.columnController.isPinningRight()) {
                        // if pinning right, then the scroll bar can show, however for some reason
                        // it overlays the grid and doesn't take space.
                        return false;
                    }
                    else {
                        return this.eBodyViewport.clientHeight < this.eBodyViewport.scrollHeight;
                    }
                }
                // gets called every 500 ms. we use this to set padding on right pinned column
                periodicallyCheck() {
                    if (this.columnController.isPinningRight()) {
                        var bodyHorizontalScrollShowing = this.eBodyViewport.clientWidth < this.eBodyViewport.scrollWidth;
                        if (bodyHorizontalScrollShowing) {
                            this.ePinnedRightColsContainer.style.marginBottom = this.scrollWidth + 'px';
                        }
                        else {
                            this.ePinnedRightColsContainer.style.marginBottom = '';
                        }
                    }
                }
                ensureColumnVisible(key) {
                    var column = this.columnController.getColumn(key);
                    if (column.isPinned()) {
                        console.warn('calling ensureIndexVisible on a ' + column.getPinned() + ' pinned column doesn\'t make sense for column ' + column.getColId());
                        return;
                    }
                    if (!this.columnController.isColumnDisplayed(column)) {
                        console.warn('column is not currently visible');
                        return;
                    }
                    var colLeftPixel = column.getLeft();
                    var colRightPixel = colLeftPixel + column.getActualWidth();
                    var viewportLeftPixel = this.eBodyViewport.scrollLeft;
                    var viewportWidth = this.eBodyViewport.offsetWidth;
                    var scrollShowing = this.eBodyViewport.clientHeight < this.eBodyViewport.scrollHeight;
                    if (scrollShowing) {
                        viewportWidth -= this.scrollWidth;
                    }
                    var viewportRightPixel = viewportLeftPixel + viewportWidth;
                    var viewportScrolledPastCol = viewportLeftPixel > colLeftPixel;
                    var viewportScrolledBeforeCol = viewportRightPixel < colRightPixel;
                    if (viewportScrolledPastCol) {
                        // if viewport's left side is after col's left side, scroll right to pull col into viewport at left
                        this.eBodyViewport.scrollLeft = colLeftPixel;
                    }
                    else if (viewportScrolledBeforeCol) {
                        // if viewport's right side is before col's right side, scroll left to pull col into viewport at right
                        var newScrollPosition = colRightPixel - viewportWidth;
                        this.eBodyViewport.scrollLeft = newScrollPosition;
                    }
                    // otherwise, col is already in view, so do nothing
                }
                showLoadingOverlay() {
                    if (!this.gridOptionsWrapper.isSuppressLoadingOverlay()) {
                        this.layout.showOverlay('loading');
                    }
                }
                showNoRowsOverlay() {
                    if (!this.gridOptionsWrapper.isSuppressNoRowsOverlay()) {
                        this.layout.showOverlay('noRows');
                    }
                }
                hideOverlay() {
                    this.layout.hideOverlay();
                }
                getWidthForSizeColsToFit() {
                    var availableWidth = this.eBody.clientWidth;
                    var scrollShowing = this.isVerticalScrollShowing();
                    if (scrollShowing) {
                        availableWidth -= this.scrollWidth;
                    }
                    return availableWidth;
                }
                // method will call itself if no available width. this covers if the grid
                // isn't visible, but is just about to be visible.
                sizeColumnsToFit(nextTimeout) {
                    var availableWidth = this.getWidthForSizeColsToFit();
                    if (availableWidth > 0) {
                        this.columnController.sizeColumnsToFit(availableWidth);
                    }
                    else {
                        if (nextTimeout === undefined) {
                            setTimeout(() => {
                                this.sizeColumnsToFit(100);
                            }, 0);
                        }
                        else if (nextTimeout === 100) {
                            setTimeout(() => {
                                this.sizeColumnsToFit(-1);
                            }, 100);
                        }
                        else {
                            console.log('ag-Grid: tried to call sizeColumnsToFit() but the grid is coming back with ' +
                                'zero width, maybe the grid is not visible yet on the screen?');
                        }
                    }
                }
                getBodyContainer() {
                    return this.eBodyContainer;
                }
                getDropTargetBodyContainers() {
                    if (this.forPrint) {
                        return [this.eBodyContainer, this.eFloatingTopContainer, this.eFloatingBottomContainer];
                    }
                    else {
                        return [this.eBodyViewport, this.eFloatingTopViewport, this.eFloatingBottomViewport];
                    }
                }
                getBodyViewport() {
                    return this.eBodyViewport;
                }
                getPinnedLeftColsContainer() {
                    return this.ePinnedLeftColsContainer;
                }
                getDropTargetLeftContainers() {
                    if (this.forPrint) {
                        return [];
                    }
                    else {
                        return [this.ePinnedLeftColsViewport, this.ePinnedLeftFloatingBottom, this.ePinnedLeftFloatingTop];
                    }
                }
                getPinnedRightColsContainer() {
                    return this.ePinnedRightColsContainer;
                }
                getDropTargetPinnedRightContainers() {
                    if (this.forPrint) {
                        return [];
                    }
                    else {
                        return [this.ePinnedRightColsViewport, this.ePinnedRightFloatingBottom, this.ePinnedRightFloatingTop];
                    }
                }
                getHeaderContainer() {
                    return this.eHeaderContainer;
                }
                getHeaderOverlay() {
                    return this.eHeaderOverlay;
                }
                getRoot() {
                    return this.eRoot;
                }
                getPinnedLeftHeader() {
                    return this.ePinnedLeftHeader;
                }
                getPinnedRightHeader() {
                    return this.ePinnedRightHeader;
                }
                queryHtmlElement(selector) {
                    return this.eRoot.querySelector(selector);
                }
                findElements() {
                    if (this.forPrint) {
                        this.eRoot = utils_1.Utils.loadTemplate(gridForPrintHtml);
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-root');
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-font-style');
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-no-scrolls');
                    }
                    else {
                        this.eRoot = utils_1.Utils.loadTemplate(gridHtml);
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-root');
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-font-style');
                        utils_1.Utils.addCssClass(this.eRoot, 'ag-scrolls');
                    }
                    if (this.forPrint) {
                        this.eHeaderContainer = this.queryHtmlElement('.ag-header-container');
                        this.eBodyContainer = this.queryHtmlElement('.ag-body-container');
                        this.eFloatingTopContainer = this.queryHtmlElement('.ag-floating-top-container');
                        this.eFloatingBottomContainer = this.queryHtmlElement('.ag-floating-bottom-container');
                        this.eAllCellContainers = [this.eBodyContainer, this.eFloatingTopContainer, this.eFloatingBottomContainer];
                    }
                    else {
                        this.eBody = this.queryHtmlElement('.ag-body');
                        this.eBodyContainer = this.queryHtmlElement('.ag-body-container');
                        this.eBodyViewport = this.queryHtmlElement('.ag-body-viewport');
                        this.eBodyViewportWrapper = this.queryHtmlElement('.ag-body-viewport-wrapper');
                        this.ePinnedLeftColsContainer = this.queryHtmlElement('.ag-pinned-left-cols-container');
                        this.ePinnedRightColsContainer = this.queryHtmlElement('.ag-pinned-right-cols-container');
                        this.ePinnedLeftColsViewport = this.queryHtmlElement('.ag-pinned-left-cols-viewport');
                        this.ePinnedRightColsViewport = this.queryHtmlElement('.ag-pinned-right-cols-viewport');
                        this.ePinnedLeftHeader = this.queryHtmlElement('.ag-pinned-left-header');
                        this.ePinnedRightHeader = this.queryHtmlElement('.ag-pinned-right-header');
                        this.eHeader = this.queryHtmlElement('.ag-header');
                        this.eHeaderContainer = this.queryHtmlElement('.ag-header-container');
                        this.eHeaderOverlay = this.queryHtmlElement('.ag-header-overlay');
                        this.eHeaderViewport = this.queryHtmlElement('.ag-header-viewport');
                        this.eFloatingTop = this.queryHtmlElement('.ag-floating-top');
                        this.ePinnedLeftFloatingTop = this.queryHtmlElement('.ag-pinned-left-floating-top');
                        this.ePinnedRightFloatingTop = this.queryHtmlElement('.ag-pinned-right-floating-top');
                        this.eFloatingTopContainer = this.queryHtmlElement('.ag-floating-top-container');
                        this.eFloatingTopViewport = this.queryHtmlElement('.ag-floating-top-viewport');
                        this.eFloatingBottom = this.queryHtmlElement('.ag-floating-bottom');
                        this.ePinnedLeftFloatingBottom = this.queryHtmlElement('.ag-pinned-left-floating-bottom');
                        this.ePinnedRightFloatingBottom = this.queryHtmlElement('.ag-pinned-right-floating-bottom');
                        this.eFloatingBottomContainer = this.queryHtmlElement('.ag-floating-bottom-container');
                        this.eFloatingBottomViewport = this.queryHtmlElement('.ag-floating-bottom-viewport');
                        this.eAllCellContainers = [this.ePinnedLeftColsContainer, this.ePinnedRightColsContainer, this.eBodyContainer,
                            this.eFloatingTop, this.eFloatingBottom];
                        // IE9, Chrome, Safari, Opera
                        this.ePinnedLeftColsViewport.addEventListener('mousewheel', this.pinnedLeftMouseWheelListener.bind(this));
                        this.eBodyViewport.addEventListener('mousewheel', this.centerMouseWheelListener.bind(this));
                        // Firefox
                        this.ePinnedLeftColsViewport.addEventListener('DOMMouseScroll', this.pinnedLeftMouseWheelListener.bind(this));
                        this.eBodyViewport.addEventListener('DOMMouseScroll', this.centerMouseWheelListener.bind(this));
                    }
                }
                getHeaderViewport() {
                    return this.eHeaderViewport;
                }
                centerMouseWheelListener(event) {
                    // we are only interested in mimicking the mouse wheel if we are pinning on the right,
                    // as if we are not pinning on the right, then we have scrollbars in the center body, and
                    // as such we just use the default browser wheel behaviour.
                    if (this.columnController.isPinningRight()) {
                        return this.generalMouseWheelListener(event, this.ePinnedRightColsViewport);
                    }
                }
                pinnedLeftMouseWheelListener(event) {
                    var targetPanel;
                    if (this.columnController.isPinningRight()) {
                        targetPanel = this.ePinnedRightColsViewport;
                    }
                    else {
                        targetPanel = this.eBodyViewport;
                    }
                    return this.generalMouseWheelListener(event, targetPanel);
                }
                generalMouseWheelListener(event, targetPanel) {
                    var wheelEvent = utils_1.Utils.normalizeWheel(event);
                    // we need to detect in which direction scroll is happening to allow trackpads scroll horizontally
                    // horizontal scroll
                    if (Math.abs(wheelEvent.pixelX) > Math.abs(wheelEvent.pixelY)) {
                        var newLeftPosition = this.eBodyViewport.scrollLeft + wheelEvent.pixelX;
                        this.eBodyViewport.scrollLeft = newLeftPosition;
                    }
                    else {
                        var newTopPosition = this.eBodyViewport.scrollTop + wheelEvent.pixelY;
                        targetPanel.scrollTop = newTopPosition;
                    }
                    // if we don't prevent default, then the whole browser will scroll also as well as the grid
                    event.preventDefault();
                    return false;
                }
                onColumnsChanged(event) {
                    if (event.isContainerWidthImpacted()) {
                        this.setWidthsOfContainers();
                    }
                    if (event.isPinnedPanelVisibilityImpacted()) {
                        this.showPinnedColContainersIfNeeded();
                    }
                    if (event.getType() === events_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED) {
                        this.sizeHeaderAndBody();
                    }
                }
                setWidthsOfContainers() {
                    this.logger.log('setWidthsOfContainers()');
                    this.showPinnedColContainersIfNeeded();
                    var mainRowWidth = this.columnController.getBodyContainerWidth() + 'px';
                    this.eBodyContainer.style.width = mainRowWidth;
                    if (this.forPrint) {
                        // pinned col doesn't exist when doing forPrint
                        return;
                    }
                    this.eFloatingBottomContainer.style.width = mainRowWidth;
                    this.eFloatingTopContainer.style.width = mainRowWidth;
                    var pinnedLeftWidth = this.columnController.getPinnedLeftContainerWidth() + 'px';
                    this.ePinnedLeftColsContainer.style.width = pinnedLeftWidth;
                    this.ePinnedLeftFloatingBottom.style.width = pinnedLeftWidth;
                    this.ePinnedLeftFloatingTop.style.width = pinnedLeftWidth;
                    this.eBodyViewportWrapper.style.marginLeft = pinnedLeftWidth;
                    var pinnedRightWidth = this.columnController.getPinnedRightContainerWidth() + 'px';
                    this.ePinnedRightColsContainer.style.width = pinnedRightWidth;
                    this.ePinnedRightFloatingBottom.style.width = pinnedRightWidth;
                    this.ePinnedRightFloatingTop.style.width = pinnedRightWidth;
                    this.eBodyViewportWrapper.style.marginRight = pinnedRightWidth;
                }
                showPinnedColContainersIfNeeded() {
                    // no need to do this if not using scrolls
                    if (this.forPrint) {
                        return;
                    }
                    //some browsers had layout issues with the blank divs, so if blank,
                    //we don't display them
                    if (this.columnController.isPinningLeft()) {
                        this.ePinnedLeftHeader.style.display = 'inline-block';
                        this.ePinnedLeftColsViewport.style.display = 'inline';
                    }
                    else {
                        this.ePinnedLeftHeader.style.display = 'none';
                        this.ePinnedLeftColsViewport.style.display = 'none';
                    }
                    if (this.columnController.isPinningRight()) {
                        this.ePinnedRightHeader.style.display = 'inline-block';
                        this.ePinnedRightColsViewport.style.display = 'inline';
                        this.eBodyViewport.style.overflowY = 'hidden';
                    }
                    else {
                        this.ePinnedRightHeader.style.display = 'none';
                        this.ePinnedRightColsViewport.style.display = 'none';
                        this.eBodyViewport.style.overflowY = 'auto';
                    }
                }
                sizeHeaderAndBody() {
                    if (this.forPrint) {
                        // if doing 'for print', then the header and footers are laid
                        // out naturally by the browser. it whatever size that's needed to fit.
                        return;
                    }
                    var heightOfContainer = this.layout.getCentreHeight();
                    if (!heightOfContainer) {
                        return;
                    }
                    var headerHeight = this.gridOptionsWrapper.getHeaderHeight();
                    var numberOfRowsInHeader = this.columnController.getHeaderRowCount();
                    var totalHeaderHeight = headerHeight * numberOfRowsInHeader;
                    this.eHeader.style['height'] = totalHeaderHeight + 'px';
                    // padding top covers the header and the floating rows on top
                    var floatingTopHeight = this.floatingRowModel.getFloatingTopTotalHeight();
                    var paddingTop = totalHeaderHeight + floatingTopHeight;
                    // bottom is just the bottom floating rows
                    var floatingBottomHeight = this.floatingRowModel.getFloatingBottomTotalHeight();
                    var floatingBottomTop = heightOfContainer - floatingBottomHeight;
                    var heightOfCentreRows = heightOfContainer - totalHeaderHeight - floatingBottomHeight - floatingTopHeight;
                    this.eBody.style.paddingTop = paddingTop + 'px';
                    this.eBody.style.paddingBottom = floatingBottomHeight + 'px';
                    this.eFloatingTop.style.top = totalHeaderHeight + 'px';
                    this.eFloatingTop.style.height = floatingTopHeight + 'px';
                    this.eFloatingBottom.style.height = floatingBottomHeight + 'px';
                    this.eFloatingBottom.style.top = floatingBottomTop + 'px';
                    this.ePinnedLeftColsViewport.style.height = heightOfCentreRows + 'px';
                    this.ePinnedRightColsViewport.style.height = heightOfCentreRows + 'px';
                }
                setHorizontalScrollPosition(hScrollPosition) {
                    this.eBodyViewport.scrollLeft = hScrollPosition;
                }
                // tries to scroll by pixels, but returns what the result actually was
                scrollHorizontally(pixels) {
                    var oldScrollPosition = this.eBodyViewport.scrollLeft;
                    this.setHorizontalScrollPosition(oldScrollPosition + pixels);
                    var newScrollPosition = this.eBodyViewport.scrollLeft;
                    return newScrollPosition - oldScrollPosition;
                }
                getHorizontalScrollPosition() {
                    if (this.forPrint) {
                        return 0;
                    }
                    else {
                        return this.eBodyViewport.scrollLeft;
                    }
                }
                turnOnAnimationForABit() {
                    if (this.gridOptionsWrapper.isSuppressColumnMoveAnimation()) {
                        return;
                    }
                    this.animationThreadCount++;
                    var animationThreadCountCopy = this.animationThreadCount;
                    utils_1.Utils.addCssClass(this.eRoot, 'ag-column-moving');
                    setTimeout(() => {
                        if (this.animationThreadCount === animationThreadCountCopy) {
                            utils_1.Utils.removeCssClass(this.eRoot, 'ag-column-moving');
                        }
                    }, 300);
                }
                addScrollListener() {
                    // if printing, then no scrolling, so no point in listening for scroll events
                    if (this.forPrint) {
                        return;
                    }
                    this.eBodyViewport.addEventListener('scroll', () => {
                        // we are always interested in horizontal scrolls of the body
                        var newLeftPosition = this.eBodyViewport.scrollLeft;
                        if (newLeftPosition !== this.lastLeftPosition) {
                            this.lastLeftPosition = newLeftPosition;
                            this.horizontallyScrollHeaderCenterAndFloatingCenter();
                            this.masterSlaveService.fireHorizontalScrollEvent(newLeftPosition);
                        }
                        // if we are pinning to the right, then it's the right pinned container
                        // that has the scroll.
                        if (!this.columnController.isPinningRight()) {
                            var newTopPosition = this.eBodyViewport.scrollTop;
                            if (newTopPosition !== this.lastTopPosition) {
                                this.lastTopPosition = newTopPosition;
                                this.verticallyScrollLeftPinned(newTopPosition);
                                this.requestDrawVirtualRows();
                            }
                        }
                    });
                    this.ePinnedRightColsViewport.addEventListener('scroll', () => {
                        var newTopPosition = this.ePinnedRightColsViewport.scrollTop;
                        if (newTopPosition !== this.lastTopPosition) {
                            this.lastTopPosition = newTopPosition;
                            this.verticallyScrollLeftPinned(newTopPosition);
                            this.verticallyScrollBody(newTopPosition);
                            this.requestDrawVirtualRows();
                        }
                    });
                    // this means the pinned panel was moved, which can only
                    // happen when the user is navigating in the pinned container
                    // as the pinned col should never scroll. so we rollback
                    // the scroll on the pinned.
                    this.ePinnedLeftColsViewport.addEventListener('scroll', () => {
                        this.ePinnedLeftColsViewport.scrollTop = 0;
                    });
                }
                requestDrawVirtualRows() {
                    // if we are in IE or Safari, then we only redraw if there was no scroll event
                    // in the 50ms following this scroll event. without this, these browsers have
                    // a bad scrolling feel, where the redraws clog the scroll experience
                    // (makes the scroll clunky and sticky). this method is like throttling
                    // the scroll events.
                    var useScrollLag;
                    // let the user override scroll lag option
                    if (this.gridOptionsWrapper.isSuppressScrollLag()) {
                        useScrollLag = false;
                    }
                    else if (this.gridOptionsWrapper.getIsScrollLag()) {
                        useScrollLag = this.gridOptionsWrapper.getIsScrollLag()();
                    }
                    else {
                        useScrollLag = utils_1.Utils.isBrowserIE() || utils_1.Utils.isBrowserSafari();
                    }
                    if (useScrollLag) {
                        this.scrollLagCounter++;
                        var scrollLagCounterCopy = this.scrollLagCounter;
                        setTimeout(() => {
                            if (this.scrollLagCounter === scrollLagCounterCopy) {
                                this.rowRenderer.drawVirtualRows();
                            }
                        }, 50);
                    }
                    else {
                        this.rowRenderer.drawVirtualRows();
                    }
                }
                horizontallyScrollHeaderCenterAndFloatingCenter() {
                    var bodyLeftPosition = this.eBodyViewport.scrollLeft;
                    this.eHeaderContainer.style.left = -bodyLeftPosition + 'px';
                    this.eFloatingBottomContainer.style.left = -bodyLeftPosition + 'px';
                    this.eFloatingTopContainer.style.left = -bodyLeftPosition + 'px';
                }
                verticallyScrollLeftPinned(bodyTopPosition) {
                    this.ePinnedLeftColsContainer.style.top = -bodyTopPosition + 'px';
                }
                verticallyScrollBody(position) {
                    this.eBodyViewport.scrollTop = position;
                }
                getVerticalScrollPosition() {
                    if (this.forPrint) {
                        return 0;
                    }
                    else {
                        return this.eBodyViewport.scrollTop;
                    }
                }
                getBodyViewportClientRect() {
                    if (this.forPrint) {
                        return this.eBodyContainer.getBoundingClientRect();
                    }
                    else {
                        return this.eBodyViewport.getBoundingClientRect();
                    }
                }
                getFloatingTopClientRect() {
                    if (this.forPrint) {
                        return this.eFloatingTopContainer.getBoundingClientRect();
                    }
                    else {
                        return this.eFloatingTop.getBoundingClientRect();
                    }
                }
                getFloatingBottomClientRect() {
                    if (this.forPrint) {
                        return this.eFloatingBottomContainer.getBoundingClientRect();
                    }
                    else {
                        return this.eFloatingBottom.getBoundingClientRect();
                    }
                }
                getPinnedLeftColsViewportClientRect() {
                    return this.ePinnedLeftColsViewport.getBoundingClientRect();
                }
                getPinnedRightColsViewportClientRect() {
                    return this.ePinnedRightColsViewport.getBoundingClientRect();
                }
                addScrollEventListener(listener) {
                    this.eBodyViewport.addEventListener('scroll', listener);
                }
                removeScrollEventListener(listener) {
                    this.eBodyViewport.removeEventListener('scroll', listener);
                }
            };
            __decorate([
                context_2.Autowired('masterSlaveService'), 
                __metadata('design:type', masterSlaveService_1.MasterSlaveService)
            ], GridPanel.prototype, "masterSlaveService", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], GridPanel.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], GridPanel.prototype, "columnController", void 0);
            __decorate([
                context_2.Autowired('rowRenderer'), 
                __metadata('design:type', rowRenderer_1.RowRenderer)
            ], GridPanel.prototype, "rowRenderer", void 0);
            __decorate([
                context_2.Autowired('floatingRowModel'), 
                __metadata('design:type', floatingRowModel_1.FloatingRowModel)
            ], GridPanel.prototype, "floatingRowModel", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], GridPanel.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('rowModel'), 
                __metadata('design:type', Object)
            ], GridPanel.prototype, "rowModel", void 0);
            __decorate([
                context_2.Optional('rangeController'), 
                __metadata('design:type', Object)
            ], GridPanel.prototype, "rangeController", void 0);
            __decorate([
                context_2.Autowired('dragService'), 
                __metadata('design:type', dragService_1.DragService)
            ], GridPanel.prototype, "dragService", void 0);
            __decorate([
                context_2.Autowired('selectionController'), 
                __metadata('design:type', selectionController_1.SelectionController)
            ], GridPanel.prototype, "selectionController", void 0);
            __decorate([
                context_2.Optional('clipboardService'), 
                __metadata('design:type', Object)
            ], GridPanel.prototype, "clipboardService", void 0);
            __decorate([
                context_2.Autowired('csvCreator'), 
                __metadata('design:type', csvCreator_1.CsvCreator)
            ], GridPanel.prototype, "csvCreator", void 0);
            __decorate([
                context_2.Autowired('mouseEventService'), 
                __metadata('design:type', mouseEventService_1.MouseEventService)
            ], GridPanel.prototype, "mouseEventService", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], GridPanel.prototype, "focusedCellController", void 0);
            __decorate([
                __param(0, context_2.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], GridPanel.prototype, "agWire", null);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], GridPanel.prototype, "init", null);
            GridPanel = __decorate([
                context_2.Bean('gridPanel'), 
                __metadata('design:paramtypes', [])
            ], GridPanel);
            exports_1("GridPanel", GridPanel);
        }
    }
});
//# sourceMappingURL=gridPanel.js.map