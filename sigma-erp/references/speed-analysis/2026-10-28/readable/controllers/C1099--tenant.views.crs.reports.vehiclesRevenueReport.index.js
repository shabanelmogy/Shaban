// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:290550-290933
appModule.controller('tenant.views.crs.reports.vehiclesRevenueReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters =
            {
                enableDateRange: true
            }
            vm.loading = false;
            vm.models = null;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.selectedVehicle = null;

            vm.profitLoss = {
                vehicleId: null,
                ownership: 1,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.localizeArabicUsingKey = function (input) {
                if (input == null)
                    return "";
                
                return app.localize(input + 'Lang');
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: true, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.profitLoss.vehicle = null;
                vm.profitLoss.vehicleId = null;
                vm.makeAndModel = null;

                vm.getVehiclesRevenueReport();
            };
            vm.searchModel = function ($select) {
                vm.profitLoss.name = $select.search;
                if (vm.profitLoss.name == '')
                    vm.profitLoss.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.profitLoss).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            //Make/Model
            vm.clearModel = function () {
                vm.profitLoss.model = null;
                vm.filters.modelId = null;
            };

            vm.getMakeAndModel = function () {
                vm.getVehiclesRevenueReport();

                debugger;
                if (vm.profitLoss.vehicle)
                    vm.makeAndModel= vm.profitLoss.vehicle.make + " " + vm.profitLoss.vehicle.model;
            };
            vm.vehicleOwnerships = [
                { name: "Own", id: 1 },
                { name: "External", id: 2 },
                // { name: "BuyBack", id: 3 },
                { name: "TempExternal", id: 4 }
            ];

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        },
                        options: function () {
                            return { fromDateTime: null, toDateTime: null, selectable: true }
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.profitLoss.vehicle = result;
                        //   vm.vehicleSelected();
                    }
                });
            }

            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehiclesRevenueReport.Detail'),
            };
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };

            vm.getVehiclesRevenueReport = function () {
                vm.loading = true;
                debugger;
                if (vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = null;
                    vm.profitLoss.toDate = null;
                }
                
                if (vm.profitLoss.model)

                    vm.profitLoss.modelId = vm.profitLoss.model.id;

                if (vm.profitLoss.vehicle)
                    vm.profitLoss.vehicleId = vm.profitLoss.vehicle.id;
                
                vehiclesProfitAndLoss.getVehiclesRevenueReport(vm.profitLoss).success(function (data) {
                    vm.gridOptions.data = data.items;
                    vm.dataList = data.items;
                    angular.forEach(vm.gridOptions.data, function (row) {
                        row.getMakeAndModel = function () {
                            if (this.vehicle != null)
                                return this.vehicle.model.make.name + ' ' + this.vehicle.model.name;
                        };
                        row.getProfitLoss = function () {
                            return this.credit - this.debit;
                        };


                        //row.currencyFormateRev = function () {
                        //    if (this.credit == null) return null;
                        //    return this.credit.toLocaleString('en');
                        //}
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
                appScopeProvider: vm,
                //useExternalPagination: true,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,

                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewDetail(row.entity)">' + app.localize('Details') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChargesType'),
                        field: app.localize('chargesType.name'),
                        cellTemplate: '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + app.localize('{{row.entity.chargesType.name}}') + '&nbsp' + '</span>'
                           
                    },
                    {
                        name: app.localize('PlateNo'),
                        field: 'vehicle.plateNo',
                        cellTemplate: '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.vehicle.statusId == \'DFL\' " class="label label-danger">' + app.localize('Defleeted') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        width: 200,
                        field: 'getMakeAndModel()'
                    },
                    {
                        name: app.localize('Revenue'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.credit)}}</div>',

                    },
                    {
                        name: app.localize('Expense'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.debit)}}</div>',

                    },
                    {
                        name: app.localize('ProfitAndLoss'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.CurrencyFormate(row.entity.getProfitLoss())}}</div>',
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.profitLoss.sorting = null;
                        } else {
                            vm.profitLoss.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getVehiclesRevenueReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.profitLoss.skipCount = (pageNumber - 1) * pageSize;
                        vm.profitLoss.maxResultCount = pageSize;

                        vm.getVehiclesRevenueReport();
                    });
                },
                data: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.exportToExcelOnSreen = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'vehicleRevenueReport.xls';
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
                } 0

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            vm.vehiclesRevenueReportExportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = null;
                    vm.profitLoss.toDate = null;
                }

                if (vm.profitLoss.model)

                    vm.profitLoss.modelId = vm.profitLoss.model.id;

                if (vm.profitLoss.vehicle)
                    vm.profitLoss.vehicleId = vm.profitLoss.vehicle.id;


                vehiclesProfitAndLoss.vehiclesRevenueReportExportToExcel(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };



            vm.exportToExcelWithSellingDetail = function () {
                vm.loading = true;

                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                debugger;
                vehiclesProfitAndLoss.exportToExcelWithSellingDetail(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            vm.viewDetail = function (profitLoss) {
                openProfitLossDetailModal(profitLoss.vehicle);
            }
            openProfitLossDetailModal = function (vehicle) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/vehiclesProfitAndLoss/profitLossDetail.cshtml',
                    controller: 'tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail as vm',
                    backdrop: 'static',

                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        },
                        fromDate: function () {
                            return vm.profitLoss.fromDate;
                        },
                        toDate: function () {
                            return vm.profitLoss.toDate;
                        },

                    }
                });

            }
            vm.getVehiclesRevenueReport();
        }
    ]);
