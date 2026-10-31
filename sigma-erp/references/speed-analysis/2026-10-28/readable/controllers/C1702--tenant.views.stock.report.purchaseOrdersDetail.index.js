// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:468952-469230
appModule.controller('tenant.views.stock.report.purchaseOrdersDetail.index', ['$scope', 'uiGridConstants', 'abp.services.app.stockReport', 'abp.services.app.item', 'utilities', '$uibModal', 'abp.services.app.directory',
        function ($scope, uiGridConstants, stockReportService, itemAppService, utilities, $uibModal, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.utilities = utilities;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.totalAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.filters = {
                enableDateRange: true,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.searchSuppliers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers

                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };
            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contactId = null;
            };
            // extended search using search customer popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;

                    }
                });
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



            //vm.getStockReport = function () {
            //    vm.loading = true;
            //    stockReportService.getItemStockReport(vm.filters).success(function (data) {
            //        vm.gridOptions.totalItems = data.totalCount;
            //        vm.gridOptions.data = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};


            vm.getStockReport = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                stockReportService.getStockReportPurchaseOrdersReport(vm.filters).success(function (data) {
                    vm.reportData = data.items;
                    vm.totalAmount = 0;
                    angular.forEach(vm.reportData, function (value) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };



            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Item'),
                        field: 'name',
                        width: 350,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}' +
                        '<span ng-if="row.entity.modelId" > ({{row.entity.model.make.name}} {{row.entity.model.name}} {{row.entity.modelYear}}, {{row.entity.itemType.name}})</span>' +
                        '<span ng-if="row.entity.unitOfMeasure" > ({{row.entity.unitOfMeasure.name}}, {{row.entity.itemType.name}})</span>' +
                        '<span ng-if="row.entity.supplierItemCode" >, {{row.entity.supplierItemCode}}</span>' +
                        '</div>' + '</div>'
                    },
                    {
                        name: app.localize('SupplierItemCode'),
                        type: 'string',
                        field: 'supplierItemCode'
                    },
                    {
                        name: app.localize('Quantity'),
                        type: 'number',
                        field: 'quantity'
                    },
                    {
                        name: app.localize('ReorderQuantity'),
                        type: 'number',
                        field: 'reorderQuantity'
                    },
                    {
                        name: app.localize('AverageCost'),
                        type: 'number',
                        field: 'cost',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.utilities.round(row.entity.cost,2)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('StockValue'),
                        field: 'cost',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.utilities.round(row.entity.stockValue,2)}}</div>' +
                        '</div>'
                    }
                ],

                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getStockReport();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStockReport();
                    });
                },
                data: []
            };

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    if (vm.filters.enableDateRange) {
            //        vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //        vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //    }
            //    stockReportService.exportToExcel(vm.filters)
            //        .success(function (result) {
            //            app.downloadTempFile(result);
            //        }).finally(function () {
            //            vm.loading = false;
            //        });
            //};




            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('stockTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'PurchaseOrdersDetailReport.xls';
                a.click();

            };
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }


            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
            }

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getGrns();
                    eventOnKeyPress.preventDefault();
                }
            }

            function init() {
                vm.getStockReport();
            }
            init();
        }]);
