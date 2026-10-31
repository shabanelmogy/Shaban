// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:289130-289383
appModule.controller('tenant.views.crs.reports.vehiclesMaintenanceReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.models = null;
            vm.isVehicleProfitLossWithDisposalDetailReport = abp.features.isEnabled("CRS.Reports.VehicleProfitLossWithDisposalDetailReport");
            vm.viewVehicleProfitLossWithDisposalDetailReport = abp.auth.hasPermission('Pages.Tenant.Reports.ViewVehicleProfitLossWithDisposalDetailReport');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.selectedVehicle = null;

            vm.profitLoss = {
                vehicleId: null,
                ownership: 1,
                chassisNo: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: true, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.profitLoss.vehicle = null;
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
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehiclesProfitAndLoss.Detail'),
            };

            vm.getVehiclesMaintenanceReport = function () {
                vm.loading = true;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.profitLoss.model)
                    vm.profitLoss.modelId = vm.profitLoss.model.id;

                vehiclesProfitAndLoss.getVehiclesMaintenanceReport(vm.profitLoss).success(function (data) {
                    vm.gridOptions.data = data.items;
                    angular.forEach(vm.gridOptions.data, function (row) {
                        row.getMakeAndModel = function () {
                            if (this.vehicle != null)
                                return this.vehicle.model.make.name + ' ' + this.vehicle.model.name;
                        };
                        row.getProfitLoss = function () {
                            return this.credit - this.debit;
                        };
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
                enableColumnResizing: true,
                //useExternalPagination: true,
                enableSorting: true,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        enableSorting: false,

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
                        name: app.localize('Expense'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.debit)}}</div>',

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

                        vm.getVehiclesMaintenanceReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.profitLoss.skipCount = (pageNumber - 1) * pageSize;
                        vm.profitLoss.maxResultCount = pageSize;

                        vm.getVehiclesMaintenanceReport();
                    });
                },
                data: []
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vehiclesProfitAndLoss.exportToExcelVehiclesMaintenance(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
/*
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
            };*/


            vm.viewDetail = function (profitLoss) {
                openProfitLossDetailModal(profitLoss.vehicle);
            }
            openProfitLossDetailModal = function (vehicle) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/vehiclesMaintenanceReport/vehiclesMaintenanceDetails.cshtml',
                    controller: 'tenant.views.crs.reports.vehiclesMaintenanceReport.vehiclesMaintenanceDetails as vm',
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
            vm.getVehiclesMaintenanceReport();
        }
    ]);
