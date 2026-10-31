// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:429276-430057
appModule.controller('tenant.views.externalVehiclesControlPanel.reports.movements.index', [
        '$scope', '$state', '$stateParams', '$uibModal', 'uiGridConstants', 'abp.services.app.externalMovement', 'abp.services.app.checkList', 'abp.services.app.movementType', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'utilities',
        function ($scope, $state, $stateParams, $uibModal, uiGridConstants, externalMovementService, checkListService, movementTypeService, commonLookupService, directoryService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //testing branch 
            vm.loading = false;
            //vm.isCrsEnabled = abp.features.isEnabled("CRS");
            //vm.isVmiRentalEnabled = abp.features.isEnabled("MCC");
            vm.editCloseMovement = abp.features.isEnabled("MCC.EditCloseMovement");
            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            var todayAsString = moment().format(abp.setting.get("App.General.DateFormat"));
            vm.isWhatsAppSMSCheckCardManualEnable = abp.features.isEnabled("Notifications.WhatsAppSMSCheckCardManual");

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

            //vm.crsEnabled = (abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("CRS.Limo")
            //    || abp.features.isEnabled("CRS.Transportation") || abp.features.isEnabled("CRS.Lease") ||
            //    abp.features.isEnabled("FMS.VehicleAssignment"));

            vm.dateRangeModel = {
                startDate: '', // todayAsString,
                endDate: ''
            };
            vm.editMovement = function (movementId) {
                openEditMovementModal(movementId, null);
            };
            function openEditMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/editModal.cshtml',
                    controller: 'tenant.views.movements.editModal as vm',
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
            vm.openMovementLogsModal = function (movement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/reports/movements/movementLogsModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.reports.movements.movementLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movement.id;
                        }
                    }
                });
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                //create: true, //abp.auth.hasPermission('Pages.Models.Create'),
                //edit: true, //abp.auth.hasPermission('Pages.Models.Edit'),
                //'delete': (abp.auth.hasPermission('Pages.Tenant.Movements.Delete') && !abp.features.isEnabled('CRS')),
                //'edit': (abp.auth.hasPermission('Pages.Tenant.Movements.EnableMovementEditing') && abp.features.isEnabled('CRS.CustomFeatures.EnableMovementEditing')),
                'log': (abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.Reports.MovementsLog')),
                view: true,
                //checkCard: abp.auth.hasPermission('Pages.Tenant.Movements.CheckCard')
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

            vm.getMovementType = function (row) {
                if (row.movementTypeId == 2 && row.movementSubType == 4)
                    return app.localize("NRM_General");
                else if (row.movementTypeId == 2 && row.movementSubType == 5)
                    return app.localize("NRM_StaffCar");
                else if (row.movementTypeId == 2 && row.movementSubType == 6)
                    return app.localize("NRM_SoldCarCustomerMovement");
                else if (row.movementTypeId == 2 && row.movementSubType == 7)
                    return app.localize("NRM_NRT");
                else if (row.movementTypeId == 2 && row.movementSubType == 8)
                    return app.localize("AgreementDelivery");
                else if (row.movementTypeId == 2 && row.movementSubType == 9)
                    return app.localize("ReplacementDelivery");
                else if (row.movementTypeId == 2 && row.movementSubType == 13)
                    return app.localize("NRM_CustomerMovement");
                else if (row.movementTypeId == 2 && row.movementSubType == 11)
                    return app.localize("NRM_AgreementCollection");
                else
                    return app.localize(row.movementType);
            }

            vm.getMovementSubType = function (id) {
                if (id == 1)
                    return app.localize("Workshop_Maintenance");
                else if (id == 2)
                    return app.localize("Workshop_Repair");
                else if (id == 3)
                    return app.localize("Workshop_AccidentRepair");
                else if (id == 4)
                    return "NRM_General";
                else if (id == 5)
                    return "NRM_StaffCar";
                else if (id == 6)
                    return "NRM_SoldCarCustomerMovement";
                else if (id == 7)
                    return "NRM_NRT";
                else if (id == 8)
                    return "NRM_AgreementDelivery";
                else if (id == 9)
                    return "NRM_ReplacementDelivery";
                else if (id == 10)
                    return app.localize("Workshop_Inspection");
                else if (id == 13)
                    return app.localize("NRM_CustomerMovement");
            }
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
                            //'      <li><a ng-if="grid.appScope.permissions.view && row.entity.movementTypeId === 1 && !grid.appScope.isVmiRentalEnabled" ng-click="grid.appScope.openViewAgreementModal(row.entity.agreementId)">' + app.localize('ViewAgreement') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view && row.entity.movementTypeId === 3" ng-click="grid.appScope.openViewWorkshopMovementModal(row.entity.id)">' + app.localize('ViewWorkshopMovement') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteMovement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.checkCard" ng-click="grid.appScope.checkCard(row.entity)">' + app.localize('CheckCard') + '</a></li>' +
                            //'      <li><a ng-if="row.entity.marksChanged && row.entity.invoiceId == null && grid.appScope.isCrsEnabled" ng-click="grid.appScope.createDamageInvoice(row.entity)" >' + app.localize('CreateDamageInvoice') + '</a></li>' +
                            //'      <li><a ng-if="(grid.appScope.permissions.edit && (!row.entity.isComplete || (row.entity.isComplete && grid.appScope.editCloseMovement)))" ng-click="grid.appScope.editMovement(row.entity.id)" >' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.log" ng-click="grid.appScope.openMovementLogsModal(row.entity)" >' + app.localize('Log') + '</a></li>' +
                            //'      <li ng-if="grid.appScope.isWhatsAppSMSCheckCardManualEnable"><a ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMSForCheckCard') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ID'),
                        width: 80,
                        field: 'id'
                    },
                    //{
                    //    name: app.localize('Type'),
                    //    width: 120,
                    //    field: 'movementType'
                    //},
                    {
                        name: app.localize('Type'),
                        width: 140,
                        field: 'movementType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div ng-if="!row.entity.variantCheckCardTypeId" class=\"ui-grid-cell-contents\">{{grid.appScope.getMovementType(row.entity)}} <span ng-if="row.entity.movementSubType">({{grid.appScope.getMovementSubType(row.entity.movementSubType)}})</span></div>' +
                            '<div ng-if="row.entity.variantCheckCardTypeId" class=\"ui-grid-cell-contents\">{{row.entity.variantCheckCardTypeName}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('RefNo'),
                        width: 140,
                        field: 'refNo'
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
                        name: app.localize('ContactCode'),
                        width: 200,
                        field: 'contactCode'
                    },
                    //{
                    //    name: app.localize('DriverOut'),
                    //    width: 200,
                    //    field: 'outDetail_Driver'
                    //},
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
                        name: app.localize('KmOut'),
                        width: 80,
                        field: 'km_Out'
                    },
                    {
                        name: app.localize('KmIn'),
                        width: 80,
                        field: 'km_In'
                    },
                    {
                        name: app.localize('KmDifference'),
                        width: 80,
                        field: 'km_Difference'
                    },
                    {
                        name: app.localize('FuelLevelOut'),
                        width: 120,
                        //field: 'fuelLevel_Out'
                        cellTemplate: '<span>{{grid.appScope.getFuelLevel(row.entity.fuelLevel_Out)}}</span>'
                    },
                    {
                        name: app.localize('FuelLevelIn'),
                        width: 120,
                        //field: 'fuelLevel_In'
                        cellTemplate: '<span>{{grid.appScope.getFuelLevel(row.entity.fuelLevel_In)}}</span>'
                    },
                    {
                        name: app.localize('BranchOut'),
                        width: 130,
                        field: 'branchOut'
                    },
                    {
                        name: app.localize('BranchIn'),
                        width: 130,
                        field: 'branchIn'
                    },
                    {
                        name: app.localize('NotesOut'),
                        width: 180,
                        field: 'notesOut'
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
                        name: app.localize('CreationDateTime'),
                        width: 200,
                        field: 'creationTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>' +
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

            ////if only mcc then remove type column from grid
            //if (!vm.isCrsEnabled) {
            //    

            //    var indexOfTypeCol = 2;
            //    vm.gridOptions.columnDefs.splice(indexOfTypeCol, 1);
            //}
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            externalMovementService.sendCheckCardWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.openViewAgreementModal = function (agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            };

            vm.openViewWorkshopMovementModal = function (workshopMovementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workshopMovementId: function () {
                            return workshopMovementId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getWorkshopMovements();
                });
            };

            vm.createDamageInvoice = function (movement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/createDamageInvoiceModal.cshtml',
                    controller: 'tenant.views.mcc.movements.createDamageInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movement: function () {
                            return movement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    initializeFilters();
                    vm.getMovements();
                });
            };

            //driver filter 

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, null);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.filters.driver = result;
                        vm.filters.driverId = vm.filters.driver.id;
                    }
                });
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            vm.clearDriver = function () {
                vm.filters.driver = null;
                vm.filters.driverId = null;
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.movementType) {
                    vm.filters.movementTypeId = vm.filters.movementType.id;
                    vm.filters.movementSubType = vm.filters.movementType.movementSubType;
                } else {
                    vm.filters.movementTypeId = null;
                    vm.filters.movementSubType = null;

                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }



                externalMovementService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function getChecklist() {

                commonLookupService.getCheckList({}).success(function (data) {
                    vm.checklist = data.items;
                });
            };

            function getMovementTypes() {
                movementTypeService.getMovementTypes({}).success(function (data) {

                    vm.movementTypes = [];

                    data.items.forEach(function (movemenType) {
                        if (!(movemenType.id == 4 || movemenType.id == 5)) {
                            movemenType.name = app.localize(movemenType.name);
                            vm.movementTypes.push(movemenType);
                        }
                    });
                    vm.movementTypes.push(
                        { id: 2, name: app.localize("NRM_General"), movementSubType: 4 },
                        { id: 2, name: app.localize("NRM_StaffCar"), movementSubType: 5 },
                        { id: 2, name: app.localize("NRM_SoldCarCustomerMovement"), movementSubType: 6 },
                        { id: 2, name: app.localize("NRM_NRT"), movementSubType: 7 },
                        { id: 2, name: app.localize("AgreementDelivery"), movementSubType: 8 },
                        { id: 2, name: app.localize("ReplacementDelivery"), movementSubType: 9 },
                        { id: 2, name: app.localize("NRM_CustomerMovement"), movementSubType: 13 },
                        { id: 2, name: app.localize("NRM_AgreementCollection"), movementSubType: 11 }
                    );
                    if (!vm.crsEnabled)
                        vm.movementTypes = vm.movementTypes.filter(row => row.id < 4);
                });
            }

            vm.report = function () {
                if (vm.filters.movementType) {
                    vm.filters.movementTypeId = vm.filters.movementType.id;
                    vm.filters.movementSubType = vm.filters.movementType.movementSubType;
                } else {
                    vm.filters.movementTypeId = null;
                    vm.filters.movementSubType = null;

                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
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
                            return '~/App/tenant/views/externalVehiclesControlPanel/reports/movements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };


            vm.movementTypeChanged = function () {

                if (vm.filters.movementTypeId == null)
                    vm.refNoLabel = app.localize('RefNo');
                else if (vm.filters.movementTypeId == 1)
                    vm.refNoLabel = app.localize('RefNo') + ' (' + app.localize('AgreementNo') + ')';
                else if (vm.filters.movementTypeId == 3)
                    vm.refNoLabel = app.localize('RefNo') + ' (' + app.localize('PONo') + ')';
                else
                    vm.refNoLabel = app.localize('RefNo');

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
                } else {
                    vm.filters.movementTypeId = null;
                    vm.filters.movementSubType = null;

                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                externalMovementService.getMovements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openViewMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/reports/movements/viewModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.reports.movements.viewModal as vm',
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

            //vm.checkCard = function (movement) {
            //    $uibModal.open({
            //        templateUrl: '~/App/common/views/common/reportViewer.cshtml',
            //        controller: 'common.views.common.reportViewer as vmMain',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            templateUrl: function () {
            //                return '~/App/tenant/views/mcc/movements/checkcard.cshtml';
            //            },
            //            filters: function () {
            //                return { movementId: movement.id };
            //            }
            //        }
            //    });
            //};

            vm.checkCard = function (movement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.movements.printTemplates.printPreview as vmMain',
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
                            externalMovementService.deleteMovement({
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

            //vm.deleteMovement = function (movement) {
            //    abp.message.confirm(
            //        app.localize('MovementDeleteWarningMessage', movement.name),
            //        function(isConfirmed) {
            //            if (isConfirmed) {
            //                externalMovementService.deleteMovement({
            //                    id: movement.id
            //                }).success(function() {
            //                    vm.getMovements();
            //                    abp.notify.success(app.localize('SuccessfullyDeleted'));
            //                });
            //            }
            //        }
            //    );
            //};

            function initializeFilters() {
                getMovementTypes();
                getChecklist();
            }

            initializeFilters();
            if ($stateParams.plateNo) {
                vm.filters.enableDateRange = false;
                vm.filters.plateNo = $stateParams.plateNo;
                vm.getMovements();
            }

        }
    ]);
