// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:452002-452367
appModule.controller('tenant.views.pos.order.index', [
        '$scope', '$window', '$uibModal', '$timeout', 'hotkeys', 'uiGridConstants', 'abp.services.app.product',
        'abp.services.app.unitOfMeasure', 'abp.services.app.directory',
        'abp.services.app.tariffCard', 'abp.services.app.posInvoice', 'utilities', 'abp.services.app.staff',
        function ($scope, $window, $uibModal, $timeout, hotkeys, uiGridConstants, productService,
            unitOfMeasureService, directoryService, tariffCardService, posInvoiceService, utilities, staffService) {

            var vm = this;
            vm.saving = false;
            vm.loading = false;
            vm.total = 0;
            var productPrices = [];
            vm.arr = [];
            vm.order = {
                voucherLines: []
            };
            vm.permissions = {
                create: true
                //create: abp.auth.hasPermission('Pages.Tenant.Locations.Addnew'),
                //edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                //'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };
            vm.orders = [];
            vm.isposEnabled = abp.features.isEnabled("POS");
            vm.loading = false;
            vm.counter = 1;
            vm.activeInd = 0;
            vm.TabInd = 0;
            vm.lengthCount = 1;

            vm.save = function (order) {
                vm.saving = true;
                angular.forEach(order.voucherLines, function (obj) {
                    obj.unitOfMeasureId = obj.unitOfMeasure.unitOfMeasureId;
                });
                posInvoiceService.createOrUpdatePosInvoice({
                    posInvoice: order
                }).success(function (result) {
                    order.id = result;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.searchCustomers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            // get Product List
            vm.getProducts = function (callback) {
                vm.loading = true;
                productService.getProducts().success(function (data) {
                    vm.productListServerSide = data.items;
                }).finally(function () {
                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                    else
                        vm.loading = false;
                });

            };

            vm.getProductPrices = function (callback) {
                vm.loading = true;
                productService.getProductPrices().success(function (data) {
                    vm.productPriceServerSide = data.items;
                }).finally(function () {
                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                    else
                        vm.loading = false;
                });
            };
            vm.getStaff = function () {
                vm.getStaffFilters = {};
                vm.getStaffFilters.inActive = true;
                staffService.getStaff(vm.getStaffFilters).success(function (data) {
                    vm.staffListServerSide = data.items;
                }).finally(function () {
                });

            };


            //product Search
            vm.searchProducts = function ($select) {
                if ($select.search) {
                    var productsList = vm.productListServerSide.filter(e => e.name.toLowerCase().includes($select.search.toLowerCase()));
                    vm.products = productsList.slice(0, 5);
                }
            };

            vm.productSelected = function (row) {
                if (!(row.product === null || row.product === undefined)) {
                    row.unitOfMeasureIdItems = row.product.productUnitOfMeasures;
                    angular.forEach(row.unitOfMeasureIdItems, function (value) {
                        value.unitOfMeasure.title = value.unitOfMeasure.name + " (" + value.unitOfMeasure.nameLang + ")";
                        if (value.isDefault) {
                            row.unitOfMeasure = value;
                            vm.unitOfMeasureChange(row);
                        }

                    });
                }
            };

            vm.defaultRatecardsItemSelected = function (callback) {
                tariffCardService.getTariffCards().success(function (result) {
                    vm.ratecardsItems = result.items;
                    vm.ratecardId = vm.ratecardsItems[0].id;

                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                });
            };

            unitOfMeasureIdItems = function () {
                unitOfMeasureService.getUnitOfMeasures().success(function (result) {
                    vm.unitOfMeasureIdItems = result.items;

                    angular.forEach(vm.unitOfMeasureIdItems, function (value) {
                        value.title = value.name + " (" + value.nameLang + ")";
                    });
                });

            };

            vm.changeratecards = function (order) {
                order.voucherLines.forEach(row => {
                    row.ratecardId = order.ratecardId;

                    if (row.unitOfMeasure === null || row.unitOfMeasure === undefined) return;

                    var productprice = vm.productPriceServerSide.filter(
                        e => e.rateCardId === row.ratecardId
                            && e.unitOfMeasureId === row.unitOfMeasure.unitOfMeasureId
                            && row.product.id === e.productId);

                    row.unitPrice = productprice[0].price;

                });

            };

            vm.changeratecardsRow = function (row) {
                if (row.unitOfMeasure === null || row.unitOfMeasure === undefined) return;

                var productprice = vm.productPriceServerSide.filter(
                    e => e.rateCardId === row.ratecardId
                        && e.unitOfMeasureId === row.unitOfMeasure.unitOfMeasureId
                        && row.product.id === e.productId);

                row.unitPrice = productprice[0].price;
            };

            vm.unitOfMeasureChange = function (row) {

                var productprice = vm.productPriceServerSide.filter(e => e.rateCardId === row.ratecardId
                    && e.unitOfMeasureId === row.unitOfMeasure.unitOfMeasureId
                    && row.product.id === e.productId);
                row.unitPrice = productprice[0].price;

            };

            vm.clearCustomer = function () {
                vm.order.customer = null;
                vm.order.customerId = null;
                vm.order.contactId = null;
            };

            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer !== null) {
                        vm.order.customer = customer;
                        vm.order.contactId = customer.id;
                    }
                });
            };

            function unitOfMeasuresLineObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = 1;
                line.unitPrice = null;
                line.unitOfMeasureId = null;
                line.contactId = null;
                line.isDefault = false;
                line.ratecardId = vm.ratecardId;
                line.productPrices = angular.copy(productPrices);
                return line;

            }
            vm.addOrders = function (callback) {
                $timeout(function () {
                    vm.activeTab = vm.counter - 2;
                }, 2);
                vm.loading = true;
                vm.orders.push({
                    title: 'Order',
                    orderNo: vm.counter,
                    ratecardId: vm.ratecardId,
                    contact: [],
                    voucherLines: []
                });
                vm.counter++;
                vm.loading = false;
                if (!(callback === null || !angular.isFunction(callback)))
                    callback();
            };

            vm.deleteTab = function (order, ngRepeatLastIndex) {
                event.preventDefault();
                event.stopPropagation();
                var indexofDeletingTab = vm.orders.indexOf(order);
                if (indexofDeletingTab > -1 && vm.orders.length > 1) {
                    if (ngRepeatLastIndex || ngRepeatLastIndex === undefined) {
                        vm.counter--;
                    }
                    vm.orders.splice(indexofDeletingTab, 1);
                }
            };

            vm.getTotal = function (order) {
                order.amount = 0;
                angular.forEach(order.voucherLines, function (value) {
                    order.amount += value.unitPrice * value.quantity;

                }
                );
            };

            vm.formatNumber = function (netAmount) {
                if (netAmount === null) return null;
                return netAmount.toLocaleString('en');
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            //Add Row
            vm.addRow = function (order) {
                var line = unitOfMeasuresLineObject();
                order.voucherLines.push(line);
            };

            //Remove row
            vm.removeRow = function (order, row) {
                var index = order.voucherLines.indexOf(row);
                if (order.voucherLines.length > 1) {
                    order.voucherLines.splice(index, 1);
                    vm.getTotal(order);
                }
            };

            vm.print = function () {
                vm.assignPrint = true;
                $timeout(function () {
                    printIt();
                }, 50);
            };

            var printIt = function () {
                window.print();
                vm.assignPrint = false;
            };

            vm.onKeyUp = function (order) {
                vm.addRow(order);
            };
            vm.getDefualtCustomr = function (order, callback) {
                if (order === null || order === '' || order === undefined) {
                    vm.addOrders(function () {
                        order = vm.orders[0];
                    });
                }

                var data = abp.setting.values["App.General.posDefaultCustomer"];
                return directoryService.getContactInfo({ id: data }).then(function (response) {
                    order.contact = response.data;
                    order.contactId = order.contact.id;

                    if (!(callback === null || !angular.isFunction(callback)))
                        callback();
                });

            };
            hotkeys.bindTo($scope).add({

                combo: ['alt+t'],
                description: 'Tasks',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (event, hotkey) {
                    vm.addOrders();
                }
            });
            hotkeys.bindTo($scope).add({

                combo: ['alt+r'],
                description: 'Tasks',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (event, hotkey) {
                    var activeTabAdd = vm.orders.find(o => o.orderNo === vm.activeTab + 1);
                    vm.deleteTab(activeTabAdd);
                }
            });

            hotkeys.bindTo($scope).add({

                combo: ['ctrl+p'],
                description: 'Tasks',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (event, hotkey) {
                    var activesave = vm.orders.find(o => o.orderNo === vm.activeTab + 1);
                    vm.save(activesave);
                }
            });
            hotkeys.bindTo($scope).add({

                combo: ['alt+p'],
                description: 'Tasks',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function (event, hotkey) {
                    vm.print();
                }
            });

            function init() {
                vm.loading = true;

                vm.defaultRatecardsItemSelected(
                    function () {

                        vm.getProducts(
                            function () {

                                vm.getProductPrices(
                                    function () {
                                        vm.getDefualtCustomr();
                                    }
                                );

                            }
                        );

                    }
                );
                vm.loading = false;

            }
            init();
        }
    ]);
