// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:486346-486763
appModule.controller('tenant.views.vmiWorkshop.movements.index', [
        '$scope', '$state', '$stateParams', '$uibModal', 'uiGridConstants', 'abp.services.app.garage', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $state, $stateParams, $uibModal, uiGridConstants, garageService, commonLookupService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            var todayAsString = moment().format(abp.setting.get("App.General.DateFormat"));

            vm.checklist = null;
            vm.movementTypes = null;
            vm.refNoLabel = app.localize('RefNo');
            vm.filters = {
                enableDateRange: true,
                movementId: null,
                movementTypeId: null,
                movementSubType: null,
                refNo: '',
                fleetCode: null,
                plateNo: '',
                fromDate: null,
                toDate: null,
                driverId: null,
                marksChanged: null,
                dateTimeType: 1,
                IsCompleted: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: '', // todayAsString,
                endDate: ''
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                'delete': abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Movements.Delete'),
                view: true,
                checkCard: abp.auth.hasPermission('Pages.Tenant.VMIWorkshop.Movements.CheckCard')
            };

            vm.statusChanged = function () {

                if (vm.filters.IsCompleted == "false") {
                    vm.filters.enableDateRange = false;
                    vm.filters.dateTimeType = 1;
                }
                else {
                    vm.filters.enableDateRange = true;
                    vm.filters.dateTimeType = 1;
                    if (vm.filters.IsCompleted == "true")
                        vm.filters.dateTimeType = 2;
                }
                vm.dateRangeCheck();
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.marksChangedTooltip = function (movement) {
                if (movement != null) {
                    var toolTip = "";

                    if (movement.outDetail_NewMarks > 0) {
                        toolTip = app.localize('CheckoutNewMarks') + ": " + movement.outDetail_NewMarks;
                    }
                    if (movement.outDetail_RepairedMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckoutRepairedMarks') + ": " + movement.outDetail_RepairedMarks;
                    }
                    if (movement.inDetail_NewMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckinNewMarks') + ": " + movement.inDetail_NewMarks;
                    }
                    if (movement.inDetail_RepairedMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckinRepairedMarks') + ": " + movement.inDetail_RepairedMarks;
                    }

                    return toolTip;
                }
                else {
                    return "";
                }
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
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewMovement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteMovement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.checkCard" ng-click="grid.appScope.checkCard(row.entity)">' + app.localize('CheckCard') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ID'),
                        width: 80,
                        field: 'id'
                    },
                    {
                        name: app.localize('Vehicle'),
                        width: 150,
                        field: 'vehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle}} <span class=\"label label-warning\" style=\"font-size: 8px;\" ng-if=\"row.entity.permanentVehicleId == row.entity.vehicleId\">Permanent</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        width: 150,
                        field: 'makeAndModel'
                    },
                    {
                        name: app.localize('Contact'),
                        width: 200,
                        field: 'contact'
                    },
                    {
                        name: app.localize('DateTimeIn'),
                        width: 200,
                        field: 'inDetail_DateTime',
                        //cellFilter: 'momentFormat: \'YYYY-MM-DD HH:mm:ssZ\'',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.inDetail_DateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateTimeOut'),
                        width: 200,
                        field: 'outDetail_DateTime',
                        //cellFilter: 'momentFormat: \'YYYY-MM-DD HH:mm:ssZ\'',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.outDetail_DateTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('KmIn'),
                        width: 80,
                        field: 'km_In'
                    },
                    {
                        name: app.localize('KmOut'),
                        width: 80,
                        field: 'km_Out'
                    },
                    {
                        name: app.localize('FuelLevelIn'),
                        width: 120,
                        //field: 'fuelLevel_In'
                        cellTemplate: '<span>{{grid.appScope.getFuelLevel(row.entity.fuelLevel_In)}}</span>'
                    },
                    {
                        name: app.localize('FuelLevelOut'),
                        width: 120,
                        //field: 'fuelLevel_Out'
                        cellTemplate: '<span>{{grid.appScope.getFuelLevel(row.entity.fuelLevel_Out)}}</span>'
                    },
                    {
                        name: app.localize('BranchIn'),
                        width: 130,
                        field: 'branchIn'
                    },
                    {
                        name: app.localize('BranchOut'),
                        width: 130,
                        field: 'branchOut'
                    },
                    {
                        name: app.localize('NotesIn'),
                        width: 180,
                        field: 'notesIn'
                    },
                    {
                        name: app.localize('IsComplete'),
                        minWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isComplete" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isComplete" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MarksChanged'),
                        minWidth: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.marksChanged" class="label label-danger" uib-popover="{{grid.appScope.marksChangedTooltip(row.entity)}}" popover-placement="bottom" popover-trigger="mouseenter click">' + app.localize('Yes') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CreatedBy'),
                        minWidth: 120,
                        field: 'createdBy'

                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "id desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getMovements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getMovements();
                    });
                },
                data: []
            };
            
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }


                garageService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/vmiWorkshop/movements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
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
            vm.getMovements = function () {
                vm.loading = true;

                if (vm.filters.movementType) {
                    vm.filters.movementTypeId = vm.filters.movementType.id;
                    vm.filters.movementSubType = vm.filters.movementType.movementSubType;
                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                garageService.getMovements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openViewMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/vmiWorkshop/movements/viewModal.cshtml',
                    controller: 'tenant.views.vmiWorkshop.movements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movementId;
                        },
                        checklist: function () {
                            return checklist;
                        }
                    }
                });
            }

            vm.viewMovement = function (movement) {
                openViewMovementModal(movement.id, vm.checklist);
            };

            vm.checkCard = function (movement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/vmiWorkshop/movements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.vmiWorkshop.movements.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movement.id;
                        }
                    }
                });
            };

            vm.deleteMovement = function (movement) {

                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', movement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            garageService.deleteMovement({
                                id: movement.id
                            }).success(function () {
                                vm.getMovements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function openCheckCardPrintPreview(movementId, movementType, plateNo, checklist) {
                abp.ajax({
                    url: abp.appPath + 'Application/PrintCheckCard',
                    data: JSON.stringify({
                        movementId: movementId,
                        movementType: movementType,
                        plateNo: plateNo,
                        checklist: checklist
                    })
                });
            }

            function getChecklist() {
                commonLookupService.getCheckList({}).success(function (data) {
                    vm.checklist = data.items;
                });
            };

            getChecklist();

            if ($stateParams.plateNo) {
                vm.filters.enableDateRange = false;
                vm.filters.plateNo = $stateParams.plateNo;
                vm.getMovements();
            }

        }
    ]);
