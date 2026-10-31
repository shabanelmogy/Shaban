// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:294424-294883
appModule.controller('tenant.views.staffMovements.index', [
        '$scope', '$state', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.movement', 'abp.services.app.nrm', 'appSession', 'utilities',
        function ($scope, $state, $uibModal, uiGridConstants, directoryService, movementService, nrmService, appSession, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.isWhatsAppSmsNRMManualEnabled = abp.features.isEnabled("Notifications.WhatsAppSmsNRMManual");
            vm.isDeliveryAndCollectionMovements = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isEmailNRMManualEnabled = abp.features.isEnabled("Notifications.EmailNRMManual");
            vm.showDriverMinutesInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverMinutesInMovements"));

            vm.movementSubTypes = utilities.getMovementSubTypesArray();
            vm.getMovementSubType = function (movementSubType) {
                return utilities.getMovementSubType(movementSubType);
            };

            vm.loading = false;
            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.getStaffMovementForDeleteInput = {
                movementTypeId: 2,
            }

            vm.customers = [];

            vm.filters = {
                enableDateRange: true,
                staff: '',
                movementSubType: '',
                plateNo: '',
                skipCount: 0,
                movementTypeId: 2,
                IsCompleted: '',
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format(vm.dateFormat)).utc(),
                endDate: moment(moment().format(vm.dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.StaffMovements'),
                create: abp.auth.hasPermission('Pages.Tenant.StaffMovements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.StaffMovements.Edit'),
                close: abp.auth.hasPermission('Pages.Tenant.StaffMovements.Close'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.StaffMovements.Export'),
                'delete': abp.auth.hasPermission('Pages.Tenant.StaffMovements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.StaffMovements.AllActionsOnOtherBranchStaffMovements'),
            };
            vm.locationPermissionClose = function (row) {
                if (row.inDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.inDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.locationPermissionEditDelete = function (row) {
                if (row.outDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.outDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearStaff = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
                vm.filters.staff = null;
            };
            vm.statusChanged = function () {
                if (vm.filters.IsCompleted == "false") {
                    vm.filters.enableDateRange = false;
                }
                else
                    vm.filters.enableDateRange = true;
                vm.dateRangeCheck();

            };
            // extended search using search customer popup
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
                            return 1;
                        }
                    }
                }).result.then(function (staff) {
                    if (staff != null) {
                        vm.filters.customer = staff;
                        vm.filters.contactId = staff.id;
                    }
                });
            };
            vm.getStaffMovements = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc


                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                nrmService.getNRM(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDriverMinutes = function (row) {
                if (!row ||
                    !row.outDetail ||
                    !row.inDetail ||
                    !row.outDetail.dateTime ||
                    !row.inDetail.dateTime) {
                    return '';
                }

                var outTime = moment(row.outDetail.dateTime);
                var inTime = moment(row.inDetail.dateTime);

                var minutes = inTime.diff(outTime, 'minutes');

                return minutes >= 0 ? minutes : '';
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewStaffMovement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11) && grid.appScope.permissions.edit && !row.entity.isComplete && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editStaffMovement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11)" ng-click="grid.appScope.checkCard(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/checkcard/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '       <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11) && grid.appScope.permissions.close && !row.entity.isComplete && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.closeStaffMovement(row.entity)">' + app.localize('Close') + '</a></li>' +
                            '       <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11) && grid.appScope.permissions.delete && !row.entity.isComplete && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteStaffMovement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '       <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11) && grid.appScope.isWhatsAppSmsNRMManualEnabled" ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '       <li><a ng-if="!(grid.appScope.isDeliveryAndCollectionMovements && row.entity.movementSubType == 11) && grid.appScope.isEmailNRMManualEnabled" ng-click="grid.appScope.sendEmail(row.entity)">' + app.localize('SendEmail') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        type: 'number',
                        field: 'id',

                    },
                    {
                        name: app.localize('Type'),
                        field: 'movementSubType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getMovementSubType(row.entity.movementSubType)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicleId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'makeAndModel',
                        width: 180,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.make + " " + row.entity.vehicle.model.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Staff'),
                        field: 'contact.name',

                    },
                    {
                        name: app.localize('StaffCode'),
                        field: 'contact.code',

                    },
                    {
                        name: app.localize('DateOut'),
                        field: 'outDetail.dateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.outDetail.dateTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('DateIn'),
                        field: 'inDetail.dateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.inDetail.dateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DriverMinutes'),
                        width: 140,
                        enableSorting: false,
                        visible: vm.showDriverMinutesInMovements,
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">' +
                            '<span ng-if="row.entity.isComplete">' +
                            '{{grid.appScope.getDriverMinutes(row.entity)}}' +
                            '</span>' +
                            '</div>' +
                            '</div>'
                    }

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getStaffMovements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getStaffMovements();
                    });
                },
                data: []
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            nrmService.sendNRMWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.sendEmail = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Send Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            nrmService.sendNRMEmailManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
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
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //}
                nrmService.exportToExcelNRM(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function openCreateOrEditStaffMovementModal(staffMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staffMovements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.staffMovement.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        staffMovementId: function () {
                            return staffMovementId;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffMovements();
                });
            }


            // Close Staff Movement Modal 
            function opencloseStaffMovementModal(staffMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staffMovements/closeStaffMovement.cshtml',
                    controller: 'tenant.views.crs.staffMovements.closeStaffMovement as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffMovementId: function () {
                            return staffMovementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffMovements();
                });
            }

            function openViewtaffMovementModal(staffMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staffMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.staffMovements.closeStaffMovement as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffMovementId: function () {
                            return staffMovementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getStaffMovements();
                });
            }

            vm.createStaffMovement = function () {
                openCreateOrEditStaffMovementModal(null);
            };

            vm.editStaffMovement = function (staffMovement) {
                openCreateOrEditStaffMovementModal(staffMovement.id);
            };
            vm.closeStaffMovement = function (satffMovement) {
                opencloseStaffMovementModal(satffMovement.id);
            };
            vm.viewStaffMovement = function (staffMovement) {
                openViewtaffMovementModal(staffMovement.id);
            };
            vm.deleteStaffMovement = function (staffMovement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            nrmService.deleteNRM({
                                id: staffMovement.id,
                                movementTypeId: 2
                            }).success(function () {
                                vm.getStaffMovements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function initializeFilters() {
                vm.getStaffMovements();
            }
            initializeFilters();
        }
    ]);
