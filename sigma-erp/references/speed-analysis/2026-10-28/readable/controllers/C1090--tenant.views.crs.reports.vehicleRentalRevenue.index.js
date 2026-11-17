// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:288281-288599
appModule.controller('tenant.views.crs.reports.vehicleRentalRevenue.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, lookupService, utilities) {
                var vm = this;

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });

                vm.loading = false;
                vm.models = null;
                vm.vehicleTypes = [];
                vm.isVehicleRentalRevenueWithDisposalDetailReport = abp.features.isEnabled("CRS.Reports.VehicleRentalRevenueWithDisposalDetailReport");
                vm.viewVehicleRentalRevenueWithDisposalDetailReport = abp.auth.hasPermission('Pages.Tenant.Reports.ViewVehicleRentalRevenueWithDisposalDetailReport');
                vm.dateRangeOptions = app.createDateRangePickerOptions();
                vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));



                vm.selectedVehicle = null;
            
                    vm.vehicleRentalRevenue = {
                    vehicleId: null,
                    ownership: 1,
                    chassisNo: null,
                    skipCount: 0,
                    enableDateRange: true,
                    fromDate: null,
                    toDate: null,
                    vehicleType: null,
                    maxResultCount: app.consts.grid.defaultPageSize,
                };
                function initDate() {
                    vm.dateRangeModel = {
                        startDate: moment().add(-29, 'days').startOf('day'),
                        endDate: moment().endOf('day')
                    };
                }
                vm.dateRangeCheck = function () {
                    if (vm.vehicleRentalRevenue.enableDateRange) {
                        vm.vehicleRentalRevenue.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                        vm.vehicleRentalRevenue.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                    }
                    if (!vm.vehicleRentalRevenue.enableDateRange) {
                        vm.vehicleRentalRevenue.fromDate = null;
                        vm.vehicleRentalRevenue.toDate = null;
                    }
                };
                vm.searchVehicles = function ($select) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    return vehicleService.searchVehicles({ includeDefleeted:true, plateNo: $select.search }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                };
 
                 function getTariffGroups() {
                       lookupService.getTariffGroups({}).success(function (data) {
                       vm.tariffGroups = data.items;
                    });
                  };

            vm.clearVehicle = function () {
                vm.vehicleRentalRevenue.vehicle = null;
            };
            vm.searchModel = function ($select) {
                vm.vehicleRentalRevenue.name = $select.search;
                if (vm.vehicleRentalRevenue.name == '')
                    vm.vehicleRentalRevenue.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.vehicleRentalRevenue).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            //Make/Model
            vm.clearModel = function () {
                vm.vehicleRentalRevenue.model = null;
                vm.vehicleRentalRevenue.modelId = null;
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
            function PopulateVehicleTypes() {
                isRentalEnabled = abp.features.isEnabled("CRS.Rental");
                isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
                isLimoEnabled = abp.features.isEnabled("CRS.Limo");

                //---------------------------------------------------------------------
                //---------------------------------------------------------------------
                if (isRentalEnabled) vm.vehicleTypes.push({ key: 'Rental', value: 1 });
                if (isLeaseEnabled) vm.vehicleTypes.push({ key: 'Lease', value: 2 });
                if (isRentalEnabled || isLeaseEnabled)
                    vm.vehicleTypes.push({ key: 'Replacement', value: 3 });
                if (isLimoEnabled) vm.vehicleTypes.push({ key: 'Limousine', value: 4 });
                vm.vehicleTypes.push({ key: 'Staff', value: 6 });
                if (vm.showTransportVehiclesOnlyInTransportAgreements) vm.vehicleTypes.push({ key: 'Transportation', value: 7 });
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
                            return { fromDateTime: null, toDateTime:null, selectable:true }
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.vehicleRentalRevenue.vehicle = result;
                        //   vm.vehicleSelected();
                    }
                });
            }

            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehiclesProfitAndLoss.Detail'),
            };

            vm.getVehicleRentalRevenue = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                if (vm.vehicleRentalRevenue.model)
                    vm.vehicleRentalRevenue.modelId = vm.vehicleRentalRevenue.model.id;

                vehiclesProfitAndLoss.getVehicleRentalRevenue(vm.vehicleRentalRevenue).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.data = data.items;
                    angular.forEach(vm.gridOptions.data, function (row) {
                        row.getMakeAndModel = function () {
                            if (this.vehicle != null)
                                return this.vehicle.model.make.name + ' ' + this.vehicle.model.name;
                        };
                        row.getvehicleRentalRevenue = function () {
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
                            '</div>'                        },
                    {
                        name: app.localize('MakeAndModel'),
                        width: 200,
                        field: 'getMakeAndModel()'
                    },
                    {
                        name: app.localize('Revenue'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.credit)}}</div>',

                    }
                    //{
                    //    name: app.localize('Expense'),
                    //    cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.debit)}}</div>',

                    //},
                    //{
                    //    name: app.localize('ProfitAndLoss'),
                    //    cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.getvehicleRentalRevenue())}}</div>',
                    //}
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.vehicleRentalRevenue.sorting = null;
                        } else {
                            vm.vehicleRentalRevenue.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getVehicleRentalRevenue();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.vehicleRentalRevenue.skipCount = (pageNumber - 1) * pageSize;
                        vm.vehicleRentalRevenue.maxResultCount = pageSize;

                        vm.getVehicleRentalRevenue();
                    });
                },
                data: []
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                vm.dateRangeCheck();
                vehiclesProfitAndLoss.vehicleRentalRevenueExportToExcel(vm.vehicleRentalRevenue)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.dateRangeModelChanged = function () {
                vm.vehicleRentalRevenue.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.vehicleRentalRevenue.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
               
            vm.exportToExcelDetailed = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                vehiclesProfitAndLoss.vehicleRentalRevenueExportToExcelDetail(vm.vehicleRentalRevenue)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcelWithSellingDetail = function () {
                vm.loading = true;

                vm.dateRangeCheck();
                vehiclesProfitAndLoss.vehicleRentalRevenueExportToExcelWithSellingDetail(vm.vehicleRentalRevenue)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            vm.viewDetail = function (vehicleRentalRevenue) {
                openVehicleRentalRevenueDetailModal(vehicleRentalRevenue.vehicle);
            }
            openVehicleRentalRevenueDetailModal = function (vehicle) {
                    
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/vehicleRentalRevenue/vehicleRentalRevenueDetail.cshtml',
                    controller: 'tenant.views.crs.reports.vehicleRentalRevenue.vehicleRentalRevenueDetail as vm',
                    backdrop: 'static',
                        
                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        },
                        fromDate: function () {
                            return vm.vehicleRentalRevenue.fromDate;
                        },
                        toDate: function () {
                            return vm.vehicleRentalRevenue.toDate;
                        },
                            
                    }
                });

            }
            initDate();
            vm.getVehicleRentalRevenue();
            getTariffGroups();
            PopulateVehicleTypes();
            }
    ]);
