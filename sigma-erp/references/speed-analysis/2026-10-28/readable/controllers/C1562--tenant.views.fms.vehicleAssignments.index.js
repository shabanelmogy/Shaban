// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:431758-432241
appModule.controller('tenant.views.fms.vehicleAssignments.index', [
        '$scope', '$state', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleAssignment', 'abp.services.app.directory',
        function ($scope, $state, $uibModal, uiGridConstants, vehicleAssignmentService, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.statuses = null;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.FMS.VehicleAssignment'),
                edit: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.EditAssignment'),
                assign: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.AssignVehicle'),
                replace: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.ReplaceVehicle'),
                delete: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.DeleteAssignment'),
                return: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.ReturnVehicle'),
                log: abp.auth.hasPermission('Pages.FMS.VehicleAssignment.AssignmentLog')
            }

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };

            vm.filters = {
                enableDateRange: true,
                startDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.rateTypes = [
                { id: 1, name: '/Day' },
                { id: 2, name: '/Week' },
                { id: 3, name: '/Month' },
                { id: 5, name: '/KM' },
                { id: 7, name: '/Hour' },
                { id: 6, name: '/Trip' }
            ];

            vm.getRateName = function (id) {
                var name = "";
                for (var i = 0; i < vm.rateTypes.length; i++) {
                    if (vm.rateTypes[i].id == id) {
                        name = vm.rateTypes[i].name;
                        break;
                    }
                }
                return name;
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            

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
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (vehicleAssignmentStatus) {
                return app.localize(vehicleAssignmentStatus);
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li ng-if="grid.appScope.permissions.view"><a ng-click="grid.appScope.viewVehicleAssignment(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.edit"><a ng-if="row.entity.status == \'Open\'" ng-click="grid.appScope.editVehicleAssignment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.replace"><a ng-if="row.entity.status == \'Open\'" ng-click="grid.appScope.replaceVehicle(row.entity)">' + app.localize('ReplaceVehicle') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.return"><a ng-if="row.entity.status == \'Open\'" ng-click="grid.appScope.returnVehicle(row.entity)">' + app.localize('ReturnVehicle') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.delete"><a ng-if="row.entity.status == \'Open\'" ng-click="grid.appScope.deleteVehicleAssignment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li ng-if="grid.appScope.permissions.log"><a ng-click="grid.appScope.openVehicleAssignmentLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        width: 80,
                        field: 'agreementNo',

                    },
                    {
                        name: app.localize('Date'),
                        width: 145,
                        field: 'date',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicleId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PermanentVehicle'),
                        field: 'permanentVehicle',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.permanentVehicleId && row.entity.permanentVehicleId == row.entity.vehicleId">' + app.localize('Yes') + '</span>' +
                        '<span ng-if="!row.entity.permanentVehicleId || row.entity.permanentVehicleId != row.entity.vehicleId">' + app.localize('No') + '</span></div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Invoice') + ' ' + app.localize('To'),
                        field: 'customerId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RequestedBy'),
                        field: 'additionalDriverId',
                        width: 170,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.additionalDriver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        field: 'driverId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 70,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.status)}}</div>',
                        //field: 'status'
                    },
                    {
                        name: app.localize('Rate'),
                        field: 'startDate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.charges[0].rate}}{{grid.appScope.getRateName(row.entity.charges[0].rateTypeId)}}</div>' +
                            '</div>'

                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getVehicleAssignments();
                    });
                },
                data: []
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.editVehicleAssignment = function (vehicleAssignment) {
                openCreateOrEditVehicleAssignmentModal(vehicleAssignment.id);
            }

            vm.createVehicleAssignment = function () {
                openCreateOrEditVehicleAssignmentModal(null);
            }

            function openCreateOrEditVehicleAssignmentModal(vehicleAssignmentId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/createOrEditModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleAssignmentId: function () {
                            return vehicleAssignmentId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicleAssignments();
                });
            }

            vm.returnVehicle = function (vehicleAssignment) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/returnVehicleModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.returnVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleAssignmentId: function () {
                            return vehicleAssignment.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getVehicleAssignments();
                });
            }

            vm.viewVehicleAssignment = function (vehicleAssignment) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/viewModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleAssignmentId: function () {
                            return vehicleAssignment.id;
                        }
                    }
                });
            }

            vm.replaceVehicle = function (vehicleAssignment) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: vehicleAssignment.id,
                                isFirebaseInitalized: false,
                                isVehicleAssignment: true
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getVehicleAssignments();
                });
            };

            vm.openVehicleAssignmentLogsModal = function (agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementLogsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        }
                    }
                });
            }

            vm.deleteVehicleAssignment = function (vehicleAssignment) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', vehicleAssignment.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vehicleAssignmentService.deleteVehicleAssignment({
                                id: vehicleAssignment.id
                            }).success(function () {
                                vm.getVehicleAssignments();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
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
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.getVehicleAssignments = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                vehicleAssignmentService.getVehicleAssignments(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    //if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                    //    initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchOrganizationContactPopup = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
                if (id==1) {
                    modalInstance.result.then(function (result) {
                        vm.filters.customerId = result.id;
                        vm.customerName = result.name;
                    });
                }
                else if (id==2) {
                    modalInstance.result.then(function (result) {

                        vm.filters.requestedById = result.id;
                        vm.requestedBy = result.name;
                    });
                }
            }

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.driver = result;
                    vm.filters.driverId = result.id;
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

            //vm.deleteAgreement = function (agreement) {
            //    abp.message.confirm(
            //        app.localize('MovementDeleteWarningMessage', agreement.name),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                agreementService.deleteAgreement({
            //                    id: agreement.id
            //                }).success(function () {
            //                    vm.getAgreements();
            //                    abp.notify.success(app.localize('SuccessfullyDeleted'));
            //                });
            //            }
            //        }
            //    );
            //};

            vm.clearCustomer = function () {
                vm.customerName = null;
                vm.filters.customerId = null;
            };
            vm.clearRequestedBy = function () {
                vm.requestedBy = null;
                vm.filters.requestedById = null;
            };
            vm.clearDriver = function () {
                vm.driver = null;
                vm.filters.driverId = null;
            };
            getStatuses();
        }
    ]);
