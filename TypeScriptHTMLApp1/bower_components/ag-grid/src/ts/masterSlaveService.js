System.register(["./gridOptionsWrapper", "./columnController/columnController", "./gridPanel/gridPanel", "./eventService", "./logger", "./events", "./context/context"], function(exports_1, context_1) {
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
    var gridOptionsWrapper_1, columnController_1, gridPanel_1, eventService_1, logger_1, events_1, context_2, context_3, context_4, context_5;
    var MasterSlaveService;
    return {
        setters:[
            function (gridOptionsWrapper_1_1) {
                gridOptionsWrapper_1 = gridOptionsWrapper_1_1;
            },
            function (columnController_1_1) {
                columnController_1 = columnController_1_1;
            },
            function (gridPanel_1_1) {
                gridPanel_1 = gridPanel_1_1;
            },
            function (eventService_1_1) {
                eventService_1 = eventService_1_1;
            },
            function (logger_1_1) {
                logger_1 = logger_1_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
                context_3 = context_2_1;
                context_4 = context_2_1;
                context_5 = context_2_1;
            }],
        execute: function() {
            let MasterSlaveService = class MasterSlaveService {
                constructor() {
                    // flag to mark if we are consuming. to avoid cyclic events (ie slave firing back to master
                    // while processing a master event) we mark this if consuming an event, and if we are, then
                    // we don't fire back any events.
                    this.consuming = false;
                }
                setBeans(loggerFactory) {
                    this.logger = loggerFactory.create('MasterSlaveService');
                }
                init() {
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_MOVED, this.fireColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, this.fireColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_PINNED, this.fireColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, this.fireColumnEvent.bind(this));
                    this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_RESIZED, this.fireColumnEvent.bind(this));
                }
                // common logic across all the fire methods
                fireEvent(callback) {
                    // if we are already consuming, then we are acting on an event from a master,
                    // so we don't cause a cyclic firing of events
                    if (this.consuming) {
                        return;
                    }
                    // iterate through the slave grids, and pass each slave service to the callback
                    var slaveGrids = this.gridOptionsWrapper.getSlaveGrids();
                    if (slaveGrids) {
                        slaveGrids.forEach((slaveGridOptions) => {
                            if (slaveGridOptions.api) {
                                var slaveService = slaveGridOptions.api.__getMasterSlaveService();
                                callback(slaveService);
                            }
                        });
                    }
                }
                // common logic across all consume methods. very little common logic, however extracting
                // guarantees consistency across the methods.
                onEvent(callback) {
                    this.consuming = true;
                    callback();
                    this.consuming = false;
                }
                fireColumnEvent(event) {
                    this.fireEvent((slaveService) => {
                        slaveService.onColumnEvent(event);
                    });
                }
                fireHorizontalScrollEvent(horizontalScroll) {
                    this.fireEvent((slaveService) => {
                        slaveService.onScrollEvent(horizontalScroll);
                    });
                }
                onScrollEvent(horizontalScroll) {
                    this.onEvent(() => {
                        this.gridPanel.setHorizontalScrollPosition(horizontalScroll);
                    });
                }
                getMasterColumns(event) {
                    var result = [];
                    if (event.getColumn()) {
                        result.push(event.getColumn());
                    }
                    if (event.getColumns()) {
                        event.getColumns().forEach((column) => {
                            result.push(column);
                        });
                    }
                    return result;
                }
                getColumnIds(event) {
                    var result = [];
                    if (event.getColumn()) {
                        result.push(event.getColumn().getColId());
                    }
                    if (event.getColumns()) {
                        event.getColumns().forEach((column) => {
                            result.push(column.getColId());
                        });
                    }
                    return result;
                }
                onColumnEvent(event) {
                    this.onEvent(() => {
                        // the column in the event is from the master grid. need to
                        // look up the equivalent from this (slave) grid
                        var masterColumn = event.getColumn();
                        var slaveColumn;
                        if (masterColumn) {
                            slaveColumn = this.columnController.getColumn(masterColumn.getColId());
                        }
                        // if event was with respect to a master column, that is not present in this
                        // grid, then we ignore the event
                        if (masterColumn && !slaveColumn) {
                            return;
                        }
                        // likewise for column group
                        var masterColumnGroup = event.getColumnGroup();
                        var slaveColumnGroup;
                        if (masterColumnGroup) {
                            var colId = masterColumnGroup.getGroupId();
                            var instanceId = masterColumnGroup.getInstanceId();
                            slaveColumnGroup = this.columnController.getColumnGroup(colId, instanceId);
                        }
                        if (masterColumnGroup && !slaveColumnGroup) {
                            return;
                        }
                        // in time, all the methods below should use the column ids, it's a more generic way
                        // of handling columns, and also allows for single or multi column events
                        var columnIds = this.getColumnIds(event);
                        var masterColumns = this.getMasterColumns(event);
                        switch (event.getType()) {
                            case events_1.Events.EVENT_COLUMN_MOVED:
                                this.logger.log('onColumnEvent-> processing ' + event + ' toIndex = ' + event.getToIndex());
                                this.columnController.moveColumns(columnIds, event.getToIndex());
                                break;
                            case events_1.Events.EVENT_COLUMN_VISIBLE:
                                this.logger.log('onColumnEvent-> processing ' + event + ' visible = ' + event.isVisible());
                                this.columnController.setColumnsVisible(columnIds, event.isVisible());
                                break;
                            case events_1.Events.EVENT_COLUMN_PINNED:
                                this.logger.log('onColumnEvent-> processing ' + event + ' pinned = ' + event.getPinned());
                                this.columnController.setColumnsPinned(columnIds, event.getPinned());
                                break;
                            case events_1.Events.EVENT_COLUMN_GROUP_OPENED:
                                this.logger.log('onColumnEvent-> processing ' + event + ' expanded = ' + masterColumnGroup.isExpanded());
                                this.columnController.setColumnGroupOpened(slaveColumnGroup, masterColumnGroup.isExpanded());
                                break;
                            case events_1.Events.EVENT_COLUMN_RESIZED:
                                masterColumns.forEach((masterColumn) => {
                                    this.logger.log('onColumnEvent-> processing ' + event + ' actualWidth = ' + masterColumn.getActualWidth());
                                    this.columnController.setColumnWidth(masterColumn.getColId(), masterColumn.getActualWidth(), event.isFinished());
                                });
                                break;
                        }
                    });
                }
            };
            __decorate([
                context_4.Autowired('gridOptionsWrapper'), 
                __metadata('design:type', gridOptionsWrapper_1.GridOptionsWrapper)
            ], MasterSlaveService.prototype, "gridOptionsWrapper", void 0);
            __decorate([
                context_4.Autowired('columnController'), 
                __metadata('design:type', columnController_1.ColumnController)
            ], MasterSlaveService.prototype, "columnController", void 0);
            __decorate([
                context_4.Autowired('gridPanel'), 
                __metadata('design:type', gridPanel_1.GridPanel)
            ], MasterSlaveService.prototype, "gridPanel", void 0);
            __decorate([
                context_4.Autowired('eventService'), 
                __metadata('design:type', eventService_1.EventService)
            ], MasterSlaveService.prototype, "eventService", void 0);
            __decorate([
                __param(0, context_3.Qualifier('loggerFactory')), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [logger_1.LoggerFactory]), 
                __metadata('design:returntype', void 0)
            ], MasterSlaveService.prototype, "setBeans", null);
            __decorate([
                context_5.PostConstruct, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], MasterSlaveService.prototype, "init", null);
            MasterSlaveService = __decorate([
                context_2.Bean('masterSlaveService'), 
                __metadata('design:paramtypes', [])
            ], MasterSlaveService);
            exports_1("MasterSlaveService", MasterSlaveService);
        }
    }
});
//# sourceMappingURL=masterSlaveService.js.map