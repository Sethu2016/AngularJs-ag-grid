System.register(["../utils", "../entities/column", "../entities/rowNode", "../gridOptionsWrapper", "../expressionService", "../selectionRendererFactory", "./rowRenderer", "../templateService", "../columnController/columnController", "../valueService", "../eventService", "../constants", "../events", "../context/context", "../gridApi", "../focusedCellController", "../entities/gridCell", "../misc/focusService", "./cellEditorFactory", "../widgets/component", "../widgets/popupService", "./cellRendererFactory", "./cellRendererService", "./valueFormatterService"], function(exports_1, context_1) {
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
    var utils_1, column_1, rowNode_1, gridOptionsWrapper_1, expressionService_1, selectionRendererFactory_1, rowRenderer_1, templateService_1, columnController_1, valueService_1, eventService_1, constants_1, events_1, context_2, gridApi_1, focusedCellController_1, gridCell_1, focusService_1, cellEditorFactory_1, component_1, popupService_1, cellRendererFactory_1, cellRendererService_1, valueFormatterService_1;
    var RenderedCell;
    return {
        setters:[
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (column_1_1) {
                column_1 = column_1_1;
            },
            function (rowNode_1_1) {
                rowNode_1 = rowNode_1_1;
            },
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (expressionService_1_1) {
                expressionService_1 = expressionService_1_1;
            },
            function (selectionRendererFactory_1_1) {
                selectionRendererFactory_1 = selectionRendererFactory_1_1;
            },
            function (rowRenderer_1_1) {
                rowRenderer_1 = rowRenderer_1_1;
            },
            function (templateService_1_1) {
                templateService_1 = templateService_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (valueService_1_1) {
                valueService_1 = valueService_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (gridApi_1_1) {
                gridApi_1 = gridApi_1_1;
            },
            function (focusedCellController_1_1) {
                focusedCellController_1 = focusedCellController_1_1;
            },
            function (gridCell_1_1) {
                gridCell_1 = gridCell_1_1;
            },
            function (focusService_1_1) {
                focusService_1 = focusService_1_1;
            },
            function (cellEditorFactory_1_1) {
                cellEditorFactory_1 = cellEditorFactory_1_1;
            },
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (cellRendererFactory_1_1) {
                cellRendererFactory_1 = cellRendererFactory_1_1;
            },
            function (cellRendererService_1_1) {
                cellRendererService_1 = cellRendererService_1_1;
            },
            function (valueFormatterService_1_1) {
                valueFormatterService_1 = valueFormatterService_1_1;
            }],
        execute: function() {
            class RenderedCell extends component_1.Component {
                constructor(column, node, rowIndex, scope, renderedRow) {
                    super('<div/>');
                    this.firstRightPinned = false;
                    this.lastLeftPinned = false;
                    // because we reference eGridCell everywhere in this class,
                    // we keep a local reference
                    this.eGridCell = this.getGui();
                    this.column = column;
                    this.node = node;
                    this.rowIndex = rowIndex;
                    this.scope = scope;
                    this.renderedRow = renderedRow;
                    this.gridCell = new gridCell_1.GridCell(rowIndex, node.floating, column);
                }
                destroy() {
                    super.destroy();
                    if (this.cellEditor && this.cellEditor.destroy) {
                        this.cellEditor.destroy();
                    }
                    if (this.cellRenderer && this.cellRenderer.destroy) {
                        this.cellRenderer.destroy();
                    }
                }
                setPinnedClasses() {
                    var firstPinnedChangedListener = () => {
                        if (this.firstRightPinned !== this.column.isFirstRightPinned()) {
                            this.firstRightPinned = this.column.isFirstRightPinned();
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-first-right-pinned', this.firstRightPinned);
                        }
                        if (this.lastLeftPinned !== this.column.isLastLeftPinned()) {
                            this.lastLeftPinned = this.column.isLastLeftPinned();
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-last-left-pinned', this.lastLeftPinned);
                        }
                    };
                    this.column.addEventListener(column_1.Column.EVENT_FIRST_RIGHT_PINNED_CHANGED, firstPinnedChangedListener);
                    this.column.addEventListener(column_1.Column.EVENT_LAST_LEFT_PINNED_CHANGED, firstPinnedChangedListener);
                    this.addDestroyFunc(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_FIRST_RIGHT_PINNED_CHANGED, firstPinnedChangedListener);
                        this.column.removeEventListener(column_1.Column.EVENT_LAST_LEFT_PINNED_CHANGED, firstPinnedChangedListener);
                    });
                    firstPinnedChangedListener();
                }
                getParentRow() {
                    return this.eParentRow;
                }
                setParentRow(eParentRow) {
                    this.eParentRow = eParentRow;
                }
                calculateCheckboxSelection() {
                    // never allow selection on floating rows
                    if (this.node.floating) {
                        return false;
                    }
                    // if boolean set, then just use it
                    var colDef = this.column.getColDef();
                    if (typeof colDef.checkboxSelection === 'boolean') {
                        return colDef.checkboxSelection;
                    }
                    // if function, then call the function to find out. we first check colDef for
                    // a function, and if missing then check gridOptions, so colDef has precedence
                    var selectionFunc;
                    if (typeof colDef.checkboxSelection === 'function') {
                        selectionFunc = colDef.checkboxSelection;
                    }
                    if (!selectionFunc && this.gridOptionsWrapper.getCheckboxSelection()) {
                        selectionFunc = this.gridOptionsWrapper.getCheckboxSelection();
                    }
                    if (selectionFunc) {
                        var params = this.createParams();
                        return selectionFunc(params);
                    }
                    return false;
                }
                getColumn() {
                    return this.column;
                }
                getValue() {
                    var data = this.getDataForRow();
                    return this.valueService.getValueUsingSpecificData(this.column, data, this.node);
                }
                getDataForRow() {
                    if (this.node.footer) {
                        // if footer, we always show the data
                        return this.node.data;
                    }
                    else if (this.node.group) {
                        // if header and header is expanded, we show data in footer only
                        var footersEnabled = this.gridOptionsWrapper.isGroupIncludeFooter();
                        var suppressHideHeader = this.gridOptionsWrapper.isGroupSuppressBlankHeader();
                        if (this.node.expanded && footersEnabled && !suppressHideHeader) {
                            return undefined;
                        }
                        else {
                            return this.node.data;
                        }
                    }
                    else {
                        // otherwise it's a normal node, just return data as normal
                        return this.node.data;
                    }
                }
                setLeftOnCell() {
                    var leftChangedListener = () => {
                        var newLeft = this.column.getLeft();
                        if (utils_1.Utils.exists(newLeft)) {
                            this.eGridCell.style.left = this.column.getLeft() + 'px';
                        }
                        else {
                            this.eGridCell.style.left = '';
                        }
                    };
                    this.column.addEventListener(column_1.Column.EVENT_LEFT_CHANGED, leftChangedListener);
                    this.addDestroyFunc(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_LEFT_CHANGED, leftChangedListener);
                    });
                    leftChangedListener();
                }
                addRangeSelectedListener() {
                    if (!this.rangeController) {
                        return;
                    }
                    var rangeCountLastTime = 0;
                    var rangeSelectedListener = () => {
                        var rangeCount = this.rangeController.getCellRangeCount(this.gridCell);
                        if (rangeCountLastTime !== rangeCount) {
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-range-selected', rangeCount !== 0);
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-range-selected-1', rangeCount === 1);
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-range-selected-2', rangeCount === 2);
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-range-selected-3', rangeCount === 3);
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-range-selected-4', rangeCount >= 4);
                            rangeCountLastTime = rangeCount;
                        }
                    };
                    this.eventService.addEventListener(events_1.Events.EVENT_RANGE_SELECTION_CHANGED, rangeSelectedListener);
                    this.addDestroyFunc(() => {
                        this.eventService.removeEventListener(events_1.Events.EVENT_RANGE_SELECTION_CHANGED, rangeSelectedListener);
                    });
                    rangeSelectedListener();
                }
                addHighlightListener() {
                    if (!this.rangeController) {
                        return;
                    }
                    var clipboardListener = (event) => {
                        var cellId = this.gridCell.createId();
                        var shouldFlash = event.cells[cellId];
                        if (shouldFlash) {
                            this.animateCellWithHighlight();
                        }
                    };
                    this.eventService.addEventListener(events_1.Events.EVENT_FLASH_CELLS, clipboardListener);
                    this.addDestroyFunc(() => {
                        this.eventService.removeEventListener(events_1.Events.EVENT_FLASH_CELLS, clipboardListener);
                    });
                }
                addChangeListener() {
                    var cellChangeListener = (event) => {
                        if (event.column === this.column) {
                            this.refreshCell();
                            this.animateCellWithDataChanged();
                        }
                    };
                    this.addDestroyableEventListener(this.node, rowNode_1.RowNode.EVENT_CELL_CHANGED, cellChangeListener);
                }
                animateCellWithDataChanged() {
                    if (this.gridOptionsWrapper.isEnableCellChangeFlash() || this.column.getColDef().enableCellChangeFlash) {
                        this.animateCell('data-changed');
                    }
                }
                animateCellWithHighlight() {
                    this.animateCell('highlight');
                }
                animateCell(cssName) {
                    var fullName = 'ag-cell-' + cssName;
                    var animationFullName = 'ag-cell-' + cssName + '-animation';
                    // we want to highlight the cells, without any animation
                    utils_1.Utils.addCssClass(this.eGridCell, fullName);
                    utils_1.Utils.removeCssClass(this.eGridCell, animationFullName);
                    // then once that is applied, we remove the highlight with animation
                    setTimeout(() => {
                        utils_1.Utils.removeCssClass(this.eGridCell, fullName);
                        utils_1.Utils.addCssClass(this.eGridCell, animationFullName);
                        setTimeout(() => {
                            // and then to leave things as we got them, we remove the animation
                            utils_1.Utils.removeCssClass(this.eGridCell, animationFullName);
                        }, 1000);
                    }, 500);
                }
                addCellFocusedListener() {
                    // set to null, not false, as we need to set 'ag-cell-no-focus' first time around
                    var cellFocusedLastTime = null;
                    var cellFocusedListener = (event) => {
                        var cellFocused = this.focusedCellController.isCellFocused(this.gridCell);
                        // see if we need to change the classes on this cell
                        if (cellFocused !== cellFocusedLastTime) {
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-focus', cellFocused);
                            utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-no-focus', !cellFocused);
                            cellFocusedLastTime = cellFocused;
                        }
                        // if this cell was just focused, see if we need to force browser focus, his can
                        // happen if focus is programmatically set.
                        if (cellFocused && event && event.forceBrowserFocus) {
                            this.eGridCell.focus();
                        }
                        // if another cell was focused, and we are editing, then stop editing
                        if (this.editingCell && !cellFocused) {
                            this.stopEditing();
                        }
                    };
                    this.eventService.addEventListener(events_1.Events.EVENT_CELL_FOCUSED, cellFocusedListener);
                    this.addDestroyFunc(() => {
                        this.eventService.removeEventListener(events_1.Events.EVENT_CELL_FOCUSED, cellFocusedListener);
                    });
                    cellFocusedListener();
                }
                setWidthOnCell() {
                    var widthChangedListener = () => {
                        this.eGridCell.style.width = this.column.getActualWidth() + "px";
                    };
                    this.column.addEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                    this.addDestroyFunc(() => {
                        this.column.removeEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
                    });
                    widthChangedListener();
                }
                init() {
                    this.value = this.getValue();
                    this.checkboxSelection = this.calculateCheckboxSelection();
                    this.setLeftOnCell();
                    this.setWidthOnCell();
                    this.setPinnedClasses();
                    this.addRangeSelectedListener();
                    this.addHighlightListener();
                    this.addChangeListener();
                    this.addCellFocusedListener();
                    this.addKeyDownListener();
                    this.addKeyPressListener();
                    // this.addFocusListener();
                    // only set tab index if cell selection is enabled
                    if (!this.gridOptionsWrapper.isSuppressCellSelection()) {
                        this.eGridCell.setAttribute("tabindex", "-1");
                    }
                    // these are the grid styles, don't change between soft refreshes
                    this.addClasses();
                    this.setInlineEditingClass();
                    this.createParentOfValue();
                    this.populateCell();
                }
                onEnterKeyDown() {
                    if (this.editingCell) {
                        this.stopEditing();
                        this.focusCell(true);
                    }
                    else {
                        this.startEditingIfEnabled(constants_1.Constants.KEY_ENTER);
                    }
                }
                onF2KeyDown() {
                    if (!this.editingCell) {
                        this.startEditingIfEnabled(constants_1.Constants.KEY_F2);
                    }
                }
                onEscapeKeyDown() {
                    if (this.editingCell) {
                        this.stopEditing(true);
                        this.focusCell(true);
                    }
                }
                onPopupEditorClosed() {
                    if (this.editingCell) {
                        this.stopEditing(true);
                        // we only focus cell again if this cell is still focused. it is possible
                        // it is not focused if the user cancelled the edit by clicking on another
                        // cell outside of this one
                        if (this.focusedCellController.isCellFocused(this.gridCell)) {
                            this.focusCell(true);
                        }
                    }
                }
                onTabKeyDown(event) {
                    var editNextCell;
                    if (this.editingCell) {
                        // if editing, we stop editing, then start editing next cell
                        this.stopEditing();
                        editNextCell = true;
                    }
                    else {
                        // otherwise we just move to the next cell
                        editNextCell = false;
                    }
                    this.rowRenderer.moveFocusToNextCell(this.rowIndex, this.column, this.node.floating, event.shiftKey, editNextCell);
                    event.preventDefault();
                }
                onBackspaceOrDeleteKeyPressed(key) {
                    if (!this.editingCell) {
                        this.startEditingIfEnabled(key);
                    }
                }
                onSpaceKeyPressed() {
                    if (!this.editingCell && this.gridOptionsWrapper.isRowSelection()) {
                        var selected = this.node.isSelected();
                        this.node.setSelected(!selected);
                    }
                    // prevent default as space key, by default, moves browser scroll down
                    event.preventDefault();
                }
                onNavigationKeyPressed(event, key) {
                    if (this.editingCell) {
                        this.stopEditing();
                    }
                    this.rowRenderer.navigateToNextCell(key, this.rowIndex, this.column, this.node.floating);
                    // if we don't prevent default, the grid will scroll with the navigation keys
                    event.preventDefault();
                }
                /*
                    private addFocusListener(): void {
                        var that = this;
                        var focusListener = (event: any) => {
                
                            // if the focus went into another cell, then we stop editing this cell
                            // if (that.editingCell &&!that.cellEditorInPopup && !that.gridCell.eq hasFocusLeftCell(event)) {
                            //     that.stopEditing();
                            // }
                        };
                        // this.eventService.
                        // this.focusService.addListener(focusListener);
                        // this.addDestroyFunc( () => {
                        //     this.focusService.removeListener(focusListener);
                        // });
                    }
                */
                addKeyPressListener() {
                    var that = this;
                    var keyPressListener = function (event) {
                        if (!that.editingCell) {
                            var pressedChar = String.fromCharCode(event.charCode);
                            if (pressedChar === ' ') {
                                that.onSpaceKeyPressed();
                            }
                            else {
                                if (RenderedCell.PRINTABLE_CHARACTERS.indexOf(pressedChar) >= 0) {
                                    that.startEditingIfEnabled(null, pressedChar);
                                    // if we don't prevent default, then the keypress also gets applied to the text field
                                    // (at least when doing the default editor), but we need to allow the editor to decide
                                    // what it wants to do.
                                    event.preventDefault();
                                }
                            }
                        }
                    };
                    this.eGridCell.addEventListener('keypress', keyPressListener);
                    this.addDestroyFunc(() => {
                        this.eGridCell.removeEventListener('keypress', keyPressListener);
                    });
                }
                onKeyDown(event) {
                    var key = event.which || event.keyCode;
                    switch (key) {
                        case constants_1.Constants.KEY_ENTER:
                            this.onEnterKeyDown();
                            break;
                        case constants_1.Constants.KEY_F2:
                            this.onF2KeyDown();
                            break;
                        case constants_1.Constants.KEY_ESCAPE:
                            this.onEscapeKeyDown();
                            break;
                        case constants_1.Constants.KEY_TAB:
                            this.onTabKeyDown(event);
                            break;
                        case constants_1.Constants.KEY_BACKSPACE:
                        case constants_1.Constants.KEY_DELETE:
                            this.onBackspaceOrDeleteKeyPressed(key);
                            break;
                        case constants_1.Constants.KEY_DOWN:
                        case constants_1.Constants.KEY_UP:
                        case constants_1.Constants.KEY_RIGHT:
                        case constants_1.Constants.KEY_LEFT:
                            this.onNavigationKeyPressed(event, key);
                            break;
                    }
                }
                addKeyDownListener() {
                    var editingKeyListener = this.onKeyDown.bind(this);
                    this.eGridCell.addEventListener('keydown', editingKeyListener);
                    this.addDestroyFunc(() => {
                        this.eGridCell.removeEventListener('keydown', editingKeyListener);
                    });
                }
                createCellEditor(keyPress, charPress) {
                    var colDef = this.column.getColDef();
                    var cellEditor = this.cellEditorFactory.createCellEditor(colDef.cellEditor);
                    if (cellEditor.init) {
                        var params = {
                            value: this.getValue(),
                            keyPress: keyPress,
                            charPress: charPress,
                            column: this.column,
                            node: this.node,
                            api: this.gridOptionsWrapper.getApi(),
                            columnApi: this.gridOptionsWrapper.getColumnApi(),
                            context: this.gridOptionsWrapper.getContext(),
                            onKeyDown: this.onKeyDown.bind(this),
                            stopEditing: this.stopEditingAndFocus.bind(this)
                        };
                        if (colDef.cellEditorParams) {
                            utils_1.Utils.assign(params, colDef.cellEditorParams);
                        }
                        if (cellEditor.init) {
                            cellEditor.init(params);
                        }
                    }
                    return cellEditor;
                }
                // cell editors call this, when they want to stop for reasons other
                // than what we pick up on. eg selecting from a dropdown ends editing.
                stopEditingAndFocus() {
                    this.stopEditing();
                    this.focusCell(true);
                }
                // called by rowRenderer when user navigates via tab key
                startEditingIfEnabled(keyPress, charPress) {
                    if (!this.isCellEditable()) {
                        return;
                    }
                    this.cellEditor = this.createCellEditor(keyPress, charPress);
                    if (!this.cellEditor.getGui) {
                        console.warn(`ag-Grid: cellEditor for column ${this.column.getId()} is missing getGui() method`);
                        return;
                    }
                    this.editingCell = true;
                    this.cellEditorInPopup = this.cellEditor.isPopup && this.cellEditor.isPopup();
                    this.setInlineEditingClass();
                    if (this.cellEditorInPopup) {
                        this.addPopupCellEditor();
                    }
                    else {
                        this.addInCellEditor();
                    }
                    if (this.cellEditor.afterGuiAttached) {
                        this.cellEditor.afterGuiAttached();
                    }
                }
                addInCellEditor() {
                    utils_1.Utils.removeAllChildren(this.eGridCell);
                    this.eGridCell.appendChild(this.cellEditor.getGui());
                    if (this.gridOptionsWrapper.isAngularCompileRows()) {
                        this.$compile(this.eGridCell)(this.scope);
                    }
                }
                addPopupCellEditor() {
                    var ePopupGui = this.cellEditor.getGui();
                    this.hideEditorPopup = this.popupService.addAsModalPopup(ePopupGui, true, 
                    // callback for when popup disappears
                        () => {
                        // we only call stopEditing if we are editing, as
                        // it's possible the popup called 'stop editing'
                        // before this, eg if 'enter key' was pressed on
                        // the editor
                        if (this.editingCell) {
                            this.onPopupEditorClosed();
                        }
                    });
                    this.popupService.positionPopupOverComponent({
                        eventSource: this.eGridCell,
                        ePopup: ePopupGui,
                        keepWithinBounds: true
                    });
                    if (this.gridOptionsWrapper.isAngularCompileRows()) {
                        this.$compile(ePopupGui)(this.scope);
                    }
                }
                focusCell(forceBrowserFocus) {
                    this.focusedCellController.setFocusedCell(this.rowIndex, this.column, this.node.floating, forceBrowserFocus);
                }
                stopEditing(reset = false) {
                    this.editingCell = false;
                    if (!reset) {
                        var newValue = this.cellEditor.getValue();
                        this.valueService.setValue(this.node, this.column, newValue);
                        this.value = this.getValue();
                    }
                    if (this.cellEditor.destroy) {
                        this.cellEditor.destroy();
                    }
                    if (this.cellEditorInPopup) {
                        this.hideEditorPopup();
                        this.hideEditorPopup = null;
                    }
                    else {
                        utils_1.Utils.removeAllChildren(this.eGridCell);
                        // put the cell back the way it was before editing
                        if (this.checkboxSelection) {
                            // if wrapper, then put the wrapper back
                            this.eGridCell.appendChild(this.eCellWrapper);
                        }
                        else {
                            // if cellRenderer, then put the gui back in. if the renderer has
                            // a refresh, it will be called. however if it doesn't, then later
                            // the renderer will be destroyed and a new one will be created.
                            if (this.cellRenderer) {
                                this.eGridCell.appendChild(this.cellRenderer.getGui());
                            }
                        }
                    }
                    this.setInlineEditingClass();
                    this.refreshCell();
                }
                createParams() {
                    var params = {
                        node: this.node,
                        data: this.node.data,
                        value: this.value,
                        rowIndex: this.rowIndex,
                        colDef: this.column.getColDef(),
                        $scope: this.scope,
                        context: this.gridOptionsWrapper.getContext(),
                        api: this.gridApi,
                        columnApi: this.columnApi
                    };
                    return params;
                }
                createEvent(event, eventSource) {
                    var agEvent = this.createParams();
                    agEvent.event = event;
                    //agEvent.eventSource = eventSource;
                    return agEvent;
                }
                isCellEditable() {
                    if (this.editingCell) {
                        return false;
                    }
                    // never allow editing of groups
                    if (this.node.group) {
                        return false;
                    }
                    return this.column.isCellEditable(this.node);
                }
                onMouseEvent(eventName, mouseEvent, eventSource) {
                    switch (eventName) {
                        case 'click':
                            this.onCellClicked(mouseEvent);
                            break;
                        case 'mousedown':
                            this.onMouseDown();
                            break;
                        case 'dblclick':
                            this.onCellDoubleClicked(mouseEvent, eventSource);
                            break;
                        case 'contextmenu':
                            this.onContextMenu(mouseEvent);
                            break;
                    }
                }
                onContextMenu(mouseEvent) {
                    // to allow us to debug in chrome, we ignore the event if ctrl is pressed,
                    // thus the normal menu is displayed
                    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
                        return;
                    }
                    var colDef = this.column.getColDef();
                    var agEvent = this.createEvent(mouseEvent);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_CELL_CONTEXT_MENU, agEvent);
                    if (colDef.onCellContextMenu) {
                        colDef.onCellContextMenu(agEvent);
                    }
                    if (this.contextMenuFactory && !this.gridOptionsWrapper.isSuppressContextMenu()) {
                        this.contextMenuFactory.showMenu(this.node, this.column, this.value, mouseEvent);
                        mouseEvent.preventDefault();
                    }
                }
                onCellDoubleClicked(mouseEvent, eventSource) {
                    var colDef = this.column.getColDef();
                    // always dispatch event to eventService
                    var agEvent = this.createEvent(mouseEvent, eventSource);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_CELL_DOUBLE_CLICKED, agEvent);
                    // check if colDef also wants to handle event
                    if (typeof colDef.onCellDoubleClicked === 'function') {
                        colDef.onCellDoubleClicked(agEvent);
                    }
                    if (!this.gridOptionsWrapper.isSingleClickEdit()) {
                        this.startEditingIfEnabled();
                    }
                }
                onMouseDown() {
                    // we pass false to focusCell, as we don't want the cell to focus
                    // also get the browser focus. if we did, then the cellRenderer could
                    // have a text field in it, for example, and as the user clicks on the
                    // text field, the text field, the focus doesn't get to the text
                    // field, instead to goes to the div behind, making it impossible to
                    // select the text field.
                    this.focusCell(false);
                    // if it's a right click, then if the cell is already in range,
                    // don't change the range, however if the cell is not in a range,
                    // we set a new range
                    if (this.rangeController) {
                        var thisCell = this.gridCell;
                        var cellAlreadyInRange = this.rangeController.isCellInAnyRange(thisCell);
                        if (!cellAlreadyInRange) {
                            this.rangeController.setRangeToCell(thisCell);
                        }
                    }
                }
                onCellClicked(mouseEvent) {
                    var agEvent = this.createEvent(mouseEvent, this);
                    this.eventService.dispatchEvent(events_1.Events.EVENT_CELL_CLICKED, agEvent);
                    var colDef = this.column.getColDef();
                    if (colDef.onCellClicked) {
                        colDef.onCellClicked(agEvent);
                    }
                    if (this.gridOptionsWrapper.isSingleClickEdit()) {
                        this.startEditingIfEnabled();
                    }
                }
                // if we are editing inline, then we don't have the padding in the cell (set in the themes)
                // to allow the text editor full access to the entire cell
                setInlineEditingClass() {
                    var editingInline = this.editingCell && !this.cellEditorInPopup;
                    utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-inline-editing', editingInline);
                    utils_1.Utils.addOrRemoveCssClass(this.eGridCell, 'ag-cell-not-inline-editing', !editingInline);
                }
                populateCell() {
                    // populate
                    this.putDataIntoCell();
                    // style
                    this.addStylesFromColDef();
                    this.addClassesFromColDef();
                    this.addClassesFromRules();
                }
                addStylesFromColDef() {
                    var colDef = this.column.getColDef();
                    if (colDef.cellStyle) {
                        var cssToUse;
                        if (typeof colDef.cellStyle === 'function') {
                            var cellStyleParams = {
                                value: this.value,
                                data: this.node.data,
                                node: this.node,
                                colDef: colDef,
                                column: this.column,
                                $scope: this.scope,
                                context: this.gridOptionsWrapper.getContext(),
                                api: this.gridOptionsWrapper.getApi()
                            };
                            var cellStyleFunc = colDef.cellStyle;
                            cssToUse = cellStyleFunc(cellStyleParams);
                        }
                        else {
                            cssToUse = colDef.cellStyle;
                        }
                        if (cssToUse) {
                            utils_1.Utils.addStylesToElement(this.eGridCell, cssToUse);
                        }
                    }
                }
                addClassesFromColDef() {
                    var colDef = this.column.getColDef();
                    if (colDef.cellClass) {
                        var classToUse;
                        if (typeof colDef.cellClass === 'function') {
                            var cellClassParams = {
                                value: this.value,
                                data: this.node.data,
                                node: this.node,
                                colDef: colDef,
                                $scope: this.scope,
                                context: this.gridOptionsWrapper.getContext(),
                                api: this.gridOptionsWrapper.getApi()
                            };
                            var cellClassFunc = colDef.cellClass;
                            classToUse = cellClassFunc(cellClassParams);
                        }
                        else {
                            classToUse = colDef.cellClass;
                        }
                        if (typeof classToUse === 'string') {
                            utils_1.Utils.addCssClass(this.eGridCell, classToUse);
                        }
                        else if (Array.isArray(classToUse)) {
                            classToUse.forEach((cssClassItem) => {
                                utils_1.Utils.addCssClass(this.eGridCell, cssClassItem);
                            });
                        }
                    }
                }
                addClassesFromRules() {
                    var colDef = this.column.getColDef();
                    var classRules = colDef.cellClassRules;
                    if (typeof classRules === 'object' && classRules !== null) {
                        var params = {
                            value: this.value,
                            data: this.node.data,
                            node: this.node,
                            colDef: colDef,
                            rowIndex: this.rowIndex,
                            api: this.gridOptionsWrapper.getApi(),
                            context: this.gridOptionsWrapper.getContext()
                        };
                        var classNames = Object.keys(classRules);
                        for (var i = 0; i < classNames.length; i++) {
                            var className = classNames[i];
                            var rule = classRules[className];
                            var resultOfRule;
                            if (typeof rule === 'string') {
                                resultOfRule = this.expressionService.evaluate(rule, params);
                            }
                            else if (typeof rule === 'function') {
                                resultOfRule = rule(params);
                            }
                            if (resultOfRule) {
                                utils_1.Utils.addCssClass(this.eGridCell, className);
                            }
                            else {
                                utils_1.Utils.removeCssClass(this.eGridCell, className);
                            }
                        }
                    }
                }
                createParentOfValue() {
                    if (this.checkboxSelection) {
                        this.eCellWrapper = document.createElement('span');
                        utils_1.Utils.addCssClass(this.eCellWrapper, 'ag-cell-wrapper');
                        this.eGridCell.appendChild(this.eCellWrapper);
                        //this.createSelectionCheckbox();
                        this.eCheckbox = this.selectionRendererFactory.createSelectionCheckbox(this.node, this.renderedRow.addEventListener.bind(this.renderedRow));
                        this.eCellWrapper.appendChild(this.eCheckbox);
                        // eventually we call eSpanWithValue.innerHTML = xxx, so cannot include the checkbox (above) in this span
                        this.eSpanWithValue = document.createElement('span');
                        utils_1.Utils.addCssClass(this.eSpanWithValue, 'ag-cell-value');
                        this.eCellWrapper.appendChild(this.eSpanWithValue);
                        this.eParentOfValue = this.eSpanWithValue;
                    }
                    else {
                        utils_1.Utils.addCssClass(this.eGridCell, 'ag-cell-value');
                        this.eParentOfValue = this.eGridCell;
                    }
                }
                isVolatile() {
                    return this.column.getColDef().volatile;
                }
                refreshCell(animate = false, newData = false) {
                    this.value = this.getValue();
                    // if it's 'new data', then we don't refresh the cellRenderer, even if refresh method is available.
                    // this is because if the whole data is new (ie we are showing stock price 'BBA' now and not 'SSD')
                    // then we are not showing a movement in the stock price, rather we are showing different stock.
                    if (!newData && this.cellRenderer && this.cellRenderer.refresh) {
                        // if the cell renderer has a refresh method, we call this instead of doing a refresh
                        // note: should pass in params here instead of value?? so that client has formattedValue
                        var valueFormatted = this.formatValue(this.value);
                        var cellRendererParams = this.column.getColDef().cellRendererParams;
                        var params = this.createRendererAndRefreshParams(valueFormatted, cellRendererParams);
                        this.cellRenderer.refresh(params);
                        // need to check rules. note, we ignore colDef classes and styles, these are assumed to be static
                        this.addClassesFromRules();
                    }
                    else {
                        // otherwise we rip out the cell and replace it
                        utils_1.Utils.removeAllChildren(this.eParentOfValue);
                        // remove old renderer component if it exists
                        if (this.cellRenderer && this.cellRenderer.destroy) {
                            this.cellRenderer.destroy();
                        }
                        this.cellRenderer = null;
                        this.populateCell();
                        // if angular compiling, then need to also compile the cell again (angular compiling sucks, please wait...)
                        if (this.gridOptionsWrapper.isAngularCompileRows()) {
                            this.$compile(this.eGridCell)(this.scope);
                        }
                    }
                    if (animate) {
                        this.animateCellWithDataChanged();
                    }
                }
                putDataIntoCell() {
                    // template gets preference, then cellRenderer, then do it ourselves
                    var colDef = this.column.getColDef();
                    var valueFormatted = this.valueFormatterService.formatValue(this.column, this.node, this.scope, this.rowIndex, this.value);
                    if (colDef.template) {
                        this.eParentOfValue.innerHTML = colDef.template;
                    }
                    else if (colDef.templateUrl) {
                        var template = this.templateService.getTemplate(colDef.templateUrl, this.refreshCell.bind(this, true));
                        if (template) {
                            this.eParentOfValue.innerHTML = template;
                        }
                    }
                    else if (colDef.floatingCellRenderer && this.node.floating) {
                        this.useCellRenderer(colDef.floatingCellRenderer, colDef.floatingCellRendererParams, valueFormatted);
                    }
                    else if (colDef.cellRenderer) {
                        this.useCellRenderer(colDef.cellRenderer, colDef.cellRendererParams, valueFormatted);
                    }
                    else {
                        // if we insert undefined, then it displays as the string 'undefined', ugly!
                        var valueToRender = utils_1.Utils.exists(valueFormatted) ? valueFormatted : this.value;
                        if (utils_1.Utils.exists(valueToRender) && valueToRender !== '') {
                            this.eParentOfValue.innerHTML = valueToRender.toString();
                        }
                    }
                }
                formatValue(value) {
                    return this.valueFormatterService.formatValue(this.column, this.node, this.scope, this.rowIndex, value);
                }
                createRendererAndRefreshParams(valueFormatted, cellRendererParams) {
                    var params = {
                        value: this.value,
                        valueFormatted: valueFormatted,
                        valueGetter: this.getValue,
                        formatValue: this.formatValue.bind(this),
                        data: this.node.data,
                        node: this.node,
                        colDef: this.column.getColDef(),
                        column: this.column,
                        $scope: this.scope,
                        rowIndex: this.rowIndex,
                        api: this.gridOptionsWrapper.getApi(),
                        columnApi: this.gridOptionsWrapper.getColumnApi(),
                        context: this.gridOptionsWrapper.getContext(),
                        refreshCell: this.refreshCell.bind(this),
                        eGridCell: this.eGridCell,
                        eParentOfValue: this.eParentOfValue,
                        addRenderedRowListener: this.renderedRow.addEventListener.bind(this.renderedRow)
                    };
                    if (cellRendererParams) {
                        utils_1.Utils.assign(params, cellRendererParams);
                    }
                    return params;
                }
                useCellRenderer(cellRendererKey, cellRendererParams, valueFormatted) {
                    var params = this.createRendererAndRefreshParams(valueFormatted, cellRendererParams);
                    this.cellRenderer = this.cellRendererService.useCellRenderer(cellRendererKey, this.eParentOfValue, params);
                }
                addClasses() {
                    utils_1.Utils.addCssClass(this.eGridCell, 'ag-cell');
                    this.eGridCell.setAttribute("colId", this.column.getColId());
                    if (this.node.group && this.node.footer) {
                        utils_1.Utils.addCssClass(this.eGridCell, 'ag-footer-cell');
                    }
                    if (this.node.group && !this.node.footer) {
                        utils_1.Utils.addCssClass(this.eGridCell, 'ag-group-cell');
                    }
                }
            }
            RenderedCell.PRINTABLE_CHARACTERS = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!"£$%^&*()_+-=[];\'#,./\|<>?:@~{}';
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], RenderedCell.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('columnApi'), 
                __metadata('design:type', columnController_1.ColumnApi)
            ], RenderedCell.prototype, "columnApi", void 0);
            __decorate([
                context_2.Autowired('gridApi'), 
                __metadata('design:type', gridApi_1.GridApi)
            ], RenderedCell.prototype, "gridApi", void 0);
            __decorate([
                context_2.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], RenderedCell.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_2.Autowired('expressionService'), 
                __metadata('design:type', expressionService_1.ExpressionService)
            ], RenderedCell.prototype, "expressionService", void 0);
            __decorate([
                context_2.Autowired('selectionRendererFactory'), 
                __metadata('design:type', selectionRendererFactory_1.SelectionRendererFactory)
            ], RenderedCell.prototype, "selectionRendererFactory", void 0);
            __decorate([
                context_2.Autowired('rowRenderer'), 
                __metadata('design:type', rowRenderer_1.RowRenderer)
            ], RenderedCell.prototype, "rowRenderer", void 0);
            __decorate([
                context_2.Autowired('$compile'), 
                __metadata('design:type', Object)
            ], RenderedCell.prototype, "$compile", void 0);
            __decorate([
                context_2.Autowired('templateService'), 
                __metadata('design:type', templateService_1.TemplateService)
            ], RenderedCell.prototype, "templateService", void 0);
            __decorate([
                context_2.Autowired('valueService'), 
                __metadata('design:type', valueService_1.ValueService)
            ], RenderedCell.prototype, "valueService", void 0);
            __decorate([
                context_2.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], RenderedCell.prototype, "eventService", void 0);
            __decorate([
                context_2.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], RenderedCell.prototype, "columnController", void 0);
            __decorate([
                context_2.Optional('rangeController'), 
                __metadata('design:type', Object)
            ], RenderedCell.prototype, "rangeController", void 0);
            __decorate([
                context_2.Autowired('focusedCellController'), 
                __metadata('design:type', focusedCellController_1.FocusedCellController)
            ], RenderedCell.prototype, "focusedCellController", void 0);
            __decorate([
                context_2.Optional('contextMenuFactory'), 
                __metadata('design:type', Object)
            ], RenderedCell.prototype, "contextMenuFactory", void 0);
            __decorate([
                context_2.Autowired('focusService'), 
                __metadata('design:type', focusService_1.FocusService)
            ], RenderedCell.prototype, "focusService", void 0);
            __decorate([
                context_2.Autowired('cellEditorFactory'), 
                __metadata('design:type', cellEditorFactory_1.CellEditorFactory)
            ], RenderedCell.prototype, "cellEditorFactory", void 0);
            __decorate([
                context_2.Autowired('cellRendererFactory'), 
                __metadata('design:type', cellRendererFactory_1.CellRendererFactory)
            ], RenderedCell.prototype, "cellRendererFactory", void 0);
            __decorate([
                context_2.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], RenderedCell.prototype, "popupService", void 0);
            __decorate([
                context_2.Autowired('cellRendererService'), 
                __metadata('design:type', cellRendererService_1.CellRendererService)
            ], RenderedCell.prototype, "cellRendererService", void 0);
            __decorate([
                context_2.Autowired('valueFormatterService'), 
                __metadata('design:type', valueFormatterService_1.ValueFormatterService)
            ], RenderedCell.prototype, "valueFormatterService", void 0);
            __decorate([
                context_2.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], RenderedCell.prototype, "init", null);
            exports_1("RenderedCell", RenderedCell);
        }
    }
});
//# sourceMappingURL=renderedCell.js.map