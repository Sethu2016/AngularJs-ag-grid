System.register(["./component", "../context/context", "../utils", "./popupService", "./menuItemComponent"], function(exports_1, context_1) {
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
    var component_1, context_2, utils_1, popupService_1, menuItemComponent_1;
    var MenuList;
    return {
        setters:[
            function (component_1_1) {
                component_1 = component_1_1;
            },
            function (context_2_1) {
                context_2 = context_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (popupService_1_1) {
                popupService_1 = popupService_1_1;
            },
            function (menuItemComponent_1_1) {
                menuItemComponent_1 = menuItemComponent_1_1;
            }],
        execute: function() {
            class MenuList extends component_1.Component {
                constructor() {
                    super(MenuList.TEMPLATE);
                    this.timerCount = 0;
                }
                clearActiveItem() {
                    this.removeActiveItem();
                    this.removeOldChildPopup();
                }
                addMenuItems(menuItems, defaultMenuItems) {
                    if (utils_1.Utils.missing(menuItems)) {
                        return;
                    }
                    menuItems.forEach((listItem) => {
                        if (listItem === 'separator') {
                            this.addSeparator();
                        }
                        else {
                            var menuItem;
                            if (typeof listItem === 'string') {
                                menuItem = defaultMenuItems[listItem];
                            }
                            else {
                                menuItem = listItem;
                            }
                            this.addItem(menuItem);
                        }
                    });
                }
                addItem(params) {
                    var cMenuItem = new menuItemComponent_1.MenuItemComponent(params);
                    this.context.wireBean(cMenuItem);
                    this.getGui().appendChild(cMenuItem.getGui());
                    cMenuItem.addEventListener(menuItemComponent_1.MenuItemComponent.EVENT_ITEM_SELECTED, (event) => {
                        if (params.childMenu) {
                            this.showChildMenu(params, cMenuItem);
                        }
                        else {
                            this.dispatchEvent(menuItemComponent_1.MenuItemComponent.EVENT_ITEM_SELECTED, event);
                        }
                    });
                    cMenuItem.addGuiEventListener('mouseenter', this.mouseEnterItem.bind(this, params, cMenuItem));
                    cMenuItem.addGuiEventListener('mouseleave', () => this.timerCount++);
                    if (params.childMenu) {
                        this.addDestroyFunc(() => params.childMenu.destroy());
                    }
                }
                mouseEnterItem(menuItemParams, menuItem) {
                    if (menuItemParams.disabled) {
                        return;
                    }
                    if (this.activeMenuItemParams !== menuItemParams) {
                        this.removeOldChildPopup();
                    }
                    this.removeActiveItem();
                    this.activeMenuItemParams = menuItemParams;
                    this.activeMenuItem = menuItem;
                    utils_1.Utils.addCssClass(this.activeMenuItem.getGui(), 'ag-menu-option-active');
                    if (menuItemParams.childMenu) {
                        this.addHoverForChildPopup(menuItemParams, menuItem);
                    }
                }
                removeActiveItem() {
                    if (this.activeMenuItem) {
                        utils_1.Utils.removeCssClass(this.activeMenuItem.getGui(), 'ag-menu-option-active');
                        this.activeMenuItem = null;
                        this.activeMenuItemParams = null;
                    }
                }
                addHoverForChildPopup(menuItemParams, menuItem) {
                    var timerCountCopy = this.timerCount;
                    setTimeout(() => {
                        var shouldShow = timerCountCopy === this.timerCount;
                        var showingThisMenu = this.showingChildMenu === menuItemParams.childMenu;
                        if (shouldShow && !showingThisMenu) {
                            this.showChildMenu(menuItemParams, menuItem);
                        }
                    }, 500);
                }
                showChildMenu(menuItemParams, menuItem) {
                    this.removeOldChildPopup();
                    var ePopup = utils_1.Utils.loadTemplate('<div class="ag-menu"></div>');
                    ePopup.appendChild(menuItemParams.childMenu.getGui());
                    this.childPopupRemoveFunc = this.popupService.addAsModalPopup(ePopup, true);
                    this.popupService.positionPopupForMenu({
                        eventSource: menuItem.getGui(),
                        ePopup: ePopup
                    });
                    this.showingChildMenu = menuItemParams.childMenu;
                }
                addSeparator() {
                    this.getGui().appendChild(utils_1.Utils.loadTemplate(MenuList.SEPARATOR_TEMPLATE));
                }
                removeOldChildPopup() {
                    if (this.childPopupRemoveFunc) {
                        this.showingChildMenu.clearActiveItem();
                        this.childPopupRemoveFunc();
                        this.childPopupRemoveFunc = null;
                        this.showingChildMenu = null;
                    }
                }
                destroy() {
                    this.removeOldChildPopup();
                    super.destroy();
                }
            }
            MenuList.TEMPLATE = '<div class="ag-menu-list"></div>';
            MenuList.SEPARATOR_TEMPLATE = '<div class="ag-menu-separator">' +
                '  <span class="ag-menu-separator-cell"></span>' +
                '  <span class="ag-menu-separator-cell"></span>' +
                '  <span class="ag-menu-separator-cell"></span>' +
                '  <span class="ag-menu-separator-cell"></span>' +
                '</div>';
            __decorate([
                context_2.Autowired('context'), 
                __metadata('design:type', context_2.Context)
            ], MenuList.prototype, "context", void 0);
            __decorate([
                context_2.Autowired('popupService'), 
                __metadata('design:type', popupService_1.PopupService)
            ], MenuList.prototype, "popupService", void 0);
            exports_1("MenuList", MenuList);
        }
    }
});
//# sourceMappingURL=menuList.js.map