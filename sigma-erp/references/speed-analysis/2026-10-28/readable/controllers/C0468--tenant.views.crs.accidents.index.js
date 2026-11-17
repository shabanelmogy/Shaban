// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:119833-120308
appModule.controller('tenant.views.crs.accidents.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.accident', 'abp.services.app.vehicle', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, accidentService, vehicleService, appSession, lookupService, utilities, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.allowEnterExcessInsuranceDamageChargesManually = utilities.parseBoolean(abp.setting.get("App.General.AllowEnterExcessInsuranceDamageChargesManually"));


            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            }
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.filters = {
                enableDateRange: true,
                driverId: '',
                vehicleId: '',
                refNo: null,
                driverAgeRange: null,
                repeatedAccidents: '',
                excessChargesInvoiceStatus: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };


            vm.getFaultValue = function (value) {
                if (value === 1)
                    return "Driver At Fault";
                else if (value === 2)
                    return "Driver Not At Fault";
                else if (value === 3)
                    return "Unknown";
                else
                    return null;
            };

            vm.getMovementType = function (mov) {

                if (!mov)
                    return '';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 2)
                    return 'Agreement Replacement';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 4)
                    return 'Agreement Custody';
                if (mov.movementTypeId == 1)
                    return app.localize("Agreement");
                else if (mov.movementTypeId == 2)
                    return app.localize("NRM");
                else if (mov.movementTypeId == 3)
                    return app.localize("Garage");
                else if (mov.movementTypeId == 4)
                    return app.localize("Delivery");
                else if (mov.movementTypeId == 5)
                    return app.localize("Collection");
                else
                    return app.localize("N/A");
            };
            vm.insuranceInvoicesOptions = [
                { name: app.localize("NA"), id: 0 },
                { name: app.localize("Invoiced"), id: 1 },
                { name: app.localize("DueToInvoice"), id: 2 }
            ];

            vm.filterMovementTypes = [
                { name: app.localize("Agreement"), id: 1 },
                { name: app.localize("NRM"), id: 2 }
            ];
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Accident.AddNew'),
                view: abp.auth.hasPermission('Pages.Tenant.Accident.View'),
                edit: abp.auth.hasPermission('Pages.Tenant.Accident.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Accident.Delete')
            };

            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search === "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.clearDriver = function () {
                vm.filters.driver = null;
                vm.filters.driverId = null;
            };

            vm.getInvoiceStatus = (accident) => {
                if (accident.invoiceId || (vm.allowEnterExcessInsuranceDamageChargesManually && accident.isInvoiceable))
                    return 'Invoiced';
                else if (!accident.invoiceId && accident.excessAmount)
                    return 'Due To Invoice';
                else if (!accident.excessAmount)
                    return 'N/A';
                else
                    return "";
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
                        name: ' ',
                        width: "4%",
                        enableSorting: false,
                        cellTemplate:
                            //grid.appScope.permissions.onfleet &&
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAccidentRecord(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.invoiceId" ng-click="grid.appScope.editAccidentRecord(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.invoiceId" ng-click="grid.appScope.deleteAccidentRecord(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.invoiceId && row.entity.excessAmount>0" ng-click="grid.appScope.createCDWInvoice(row.entity)">' + app.localize('CreateInvoice') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        //width: "10%",
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AccidentDate'),
                        field: 'accidentDate',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.accidentDateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MovementType'),
                        field: 'movement.type',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMovementType(row.entity.movement)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RefNo'),
                        //width: "10%",
                        field: 'movementId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.movement.movementTypeId == 1">{{row.entity.movement.refNo}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.movement.movementTypeId != 1">{{row.entity.movementId}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('WhoseFault'),
                        field: 'status.name',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getFaultValue(row.entity.whosFault)}}' +
                            '</div>'
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                        //width: "10%",
                        //cellTemplate:
                        //    '<div class=\"ui-grid-cell\">' +
                        //    '<div class=\"ui-grid-cell-contents\">{{row.entity.notes}}' +
                        //    '</div>'
                    },
                    {
                        name: app.localize('ExcessCharges'),
                        //width: "10%",
                        field: 'excessAmount'
                    },
                    {
                        name: app.localize('Invoiced'),
                        field: 'status.name',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getInvoiceStatus(row.entity)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CreatedBy'),
                        field: 'createrUser',
                        width: "15%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.createrUser}}' +
                            '</div>'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getAccidents();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAccidents();
                    });
                },
                data: []
            };

            vm.report = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.driverAgeRange) {
                    vm.filters.fromAgeRange = null;
                    vm.filters.toAgeRange = null;
                }
                if (!vm.filters.movementType)
                    vm.filters.refNo = null;

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/accidents/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getAccidents = function () {
                vm.loading = true;


                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.driverAgeRange) {
                    vm.filters.fromAgeRange = null;
                    vm.filters.toAgeRange = null;
                }
                if (!vm.filters.movementType)
                    vm.filters.refNo = null;


                accidentService.getAccidents(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.viewAccidentRecord = function (accident) {
                openViewAccidentRecordModal(accident.id);
            };

            function openViewAccidentRecordModal(accidentId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/viewModal.cshtml',
                    controller: 'tenant.views.crs.accidents.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        accidentId: function () {
                            return accidentId;
                        }
                    }
                });
            }

            function openAddAccidentRecordModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/createModal.cshtml',
                    controller: 'tenant.views.crs.accidents.createModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        //accidentId: function () {
                        //    return accidentId;
                        //}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAccidents();
                });
            }

            function openEditAccidentRecordModal(accidentId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/editModal.cshtml',
                    controller: 'tenant.views.crs.accidents.editModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        accidentId: function () {
                            return accidentId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAccidents();
                });
            }


            vm.createCDWInvoice = function (accident) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accidents/createCDWInvoiceModal.cshtml',
                    controller: 'tenant.views.crs.accidents.createCDWInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movement: function () {
                            return accident.movement;
                        },
                        accident: function () {
                            return accident;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAccidents();
                });
            };

            vm.driverAgeRangeChanged = function () {
                vm.filters.fromAgeRange = null;
                vm.filters.toAgeRange = null;
                if (vm.filters.driverAgeRange) {
                    vm.filters.fromAgeRange = 23;
                    vm.filters.toAgeRange = 25;
                }


            };
            // Export To Excel Functionality
            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    if (vm.filters.ownership === 2 || vm.filters.ownership === 3) {
            //        dateRangeCheck();
            //    } else {
            //        vm.filters.startDate = null;
            //        vm.filters.endDate = null;
            //    }
            //    accessoriesService.exportToExcel(vm.filters).success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            vm.addAccidentRecord = function () {
                openAddAccidentRecordModal(null);
            };

            vm.editAccidentRecord = function (accident) {
                openEditAccidentRecordModal(accident);
            };

            vm.deleteAccidentRecord = function (accident) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', accident.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            accidentService.deleteAccident({
                                id: accident.id
                            }).success(function () {
                                vm.getAccidents();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            function init() {
                initDate();
                vm.getAccidents();
            }

            init();
        }
    ]);
