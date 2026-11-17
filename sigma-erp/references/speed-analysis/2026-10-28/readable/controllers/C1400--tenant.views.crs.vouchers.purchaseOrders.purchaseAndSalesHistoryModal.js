// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:382006-382251
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.purchaseAndSalesHistoryModal', [
        'abp.services.app.purchaseOrder', '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.item', 'abp.services.app.stockReport', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities', 'options',
        function (purchaseOrdersService, $scope, $uibModal, $uibModalInstance, directoryService, uiGridConstants, appSession, itemAppService, stockReportService, commonLookupService, vehicleService, utilities, options) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.totalSale = 0;
            vm.totalPurchase = 0;
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            //vm.itemId = options.productId;
            vm.suppliers = [];
            vm.filters = {
                itemId: options.productId
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.getPurchaseHistory = function () {

                vm.loading = true;
                stockReportService.getItemsPurchaseHistory(vm.filters).success(function (data) {
                    vm.purchaseGridOptions.totalItems = data.totalCount;
                    vm.purchaseGridOptions.data = data.items;
                    angular.forEach(vm.purchaseGridOptions.data, function (value, key) {
                        vm.totalPurchase += value.qty;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.purchaseGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                enableColumnResizing: true,
                useExternalPagination: false,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RefNo'),
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.description}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Quantity'),
                        field: 'quantity',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.qty}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Rate'),
                        field: 'rate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.rate}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Cost'),
                        field: 'cost',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.cost}}' + '&nbsp' + '</span>' +
                            '</div>'
                    }
                ]
            };

            vm.customFilter = function (row) {
                return row.qty >= 0;
            };

            vm.getSaleHistory = function () {

                vm.loading = true;
                stockReportService.getItemsSaleHistory(vm.filters).success(function (data) {
                    vm.saleGridOptions.totalItems = data.totalCount;
                    vm.saleGridOptions.data = data.items;
                    angular.forEach(vm.saleGridOptions.data, function (value, key) {
                        vm.totalSale += value.qty;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.saleGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                enableColumnResizing: true,
                useExternalPagination: false,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RefNo'),
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Description'),
                        field: 'description',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.description}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Quantity'),
                        field: 'quantity',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.qty}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Rate'),
                        field: 'rate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.rate}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Cost'),
                        field: 'cost',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.cost}}' + '&nbsp' + '</span>' +
                            '</div>'
                    }
                ]
            };

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseOrderId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                initDate();
                vm.getPurchaseHistory();
                vm.getSaleHistory();
            }
            init();
        }]);
