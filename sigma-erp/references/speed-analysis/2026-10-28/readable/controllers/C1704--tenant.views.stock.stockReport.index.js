// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:469394-469672
appModule.controller('tenant.views.stock.stockReport.index', ['$scope', 'uiGridConstants', 'abp.services.app.stockReport', 'abp.services.app.item', 'utilities', 'abp.services.app.itemType', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.user',
        function ($scope, uiGridConstants, stockReportService, itemAppService, utilities, itemTypeAppService, commonLookupService, appSession, userService) {

            var vm = this;
            vm.loading = false;
            vm.utilities = utilities;
            vm.isAllBranchUser = appSession.user.branchAccess == 3;
            vm.totalStockValue = 0;
            vm.isMultiBranchEnabled = abp.features.isEnabled("Stock_MultiBranch");
            vm.filters = {
                doNotShowItemWithZeroQuantity: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                locationId: appSession.user.locationId,
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.getItemTypes = function () {
                
                    vm.loading = true;
                    itemTypeAppService.getItemTypes()
                        .success(function (result) {
                            vm.itemTypes = result.items;
                        }).finally(function () {
                            vm.loading = false;
                        });
                
            };

            vm.filterItemType = function (itemTypeId) {
                var keepGoing = true;
                angular.forEach(vm.itemTypes, function (itemType) {
                    if (itemTypeId === itemType.id) {
                        vm.itemType = itemType;
                        keepGoing = false;
                    }
                    vm.itemType = keepGoing ? null : vm.itemType;
                });
            };
            vm.searchItemsType = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return stockReportService.getItemTypes({ name: name }).then(function (response) {
                    vm.itemsType = response.data;
                });
            };

            vm.clearItem = function () {
                vm.filters.item = null;
                vm.filters.itemId = null;
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

            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    vm.filters.LocationId = vm.locations[0].id;
                });
            };


            vm.getStockReport = function () {
                vm.loading = true;
                stockReportService.getItemStockReport(vm.filters).success(function (data) {
                    vm.reportData = data;
                    vm.totalStockValue = 0;
                    angular.forEach(vm.reportData, function (value) {
                        vm.totalStockValue += value.stockValue;
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
                        width:350,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.name}}' +
                        '<span ng-if="row.entity.modelId" > ({{row.entity.model.make.name}} {{row.entity.model.name}} {{row.entity.modelYear}}, {{row.entity.itemType.name}})</span>' +
                        '<span ng-if="row.entity.unitOfMeasure" > ({{row.entity.unitOfMeasure.name}}, {{row.entity.itemType.name}})</span>' +
                        '<span ng-if="row.entity.supplierItemCode" >, {{row.entity.supplierItemCode}}</span>' +
                        '</div>'+'</div>'
                    },
                    {
                        name: app.localize('SupplierItemCode'),
                        type: 'string',
                        field:'supplierItemCode'
                    },    
                    {
                        name: app.localize('Quantity'),
                        type: 'number',
                        field:'quantity'
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

            vm.exportToExcel = function () {
                vm.loading = true;
                stockReportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };



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

                var blob = b64toBlob(btoa(unescape(encodeURIComponent("\uFEFF" + tab_text))), "application/vnd.ms-excel;charset=utf-8");

                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'StockReport.xls';
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
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {

                    vm.locations = data.items;
                   
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }
            function init() {
                getAllLocations();
                vm.getItemTypes();
                vm.getStockReport();
            }
            init();
        }]);
