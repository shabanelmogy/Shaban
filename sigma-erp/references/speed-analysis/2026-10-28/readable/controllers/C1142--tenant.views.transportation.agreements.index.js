// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:299256-299792
appModule.controller('tenant.views.transportation.agreements.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.transAgreement',
        function ($scope, $state, $uibModal, $window, uiGridConstants, directoryService, utilities, appSession, commonLookupService, transAgreementService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            //vm.agreementTypes = null;
            vm.statuses = null;
            vm.customers = [];
            vm.locations = [];

            vm.filters = {
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                driverId: null,
                vehicleId: null,
                plateNo: '',
                locationId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

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

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Transportation.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Transportation.Agreements.Open'),
                edit: abp.auth.hasPermission('Pages.Tenant.Transportation.Agreements.Edit'),
                close: abp.auth.hasPermission('Pages.Tenant.Transportation.Agreements.Close'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Transportation.Agreements.Delete'),
            };

            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.locationPermissionClose = function (row) {
                if (row.closingLocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.closingLocationId != appSession.user.locationId)
                        return false;
                }
                else if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;
                return true;
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/transportation/agreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
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

            vm.getTransAgreementStatus = function (status) {
                if (!status) return '';
                if (status == 1) return 'Open';
                else if (status == 2) return 'Close';

            }
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
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

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, null);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.filters.driver = result;
                    vm.filters.driverId = vm.filters.driver.id;
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

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.transAgreement.dateTime ? vm.transAgreement.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.transAgreement.endDate ? vm.transAgreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.transAgreement.vehicle = result;
                        vm.transAgreement.vehicleId = vm.transAgreement.vehicle.id;
                    }
                });
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearDriver = function () {
                vm.filters.driver = null;
                vm.filters.driverId = null;
            };

            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus); viewAgreement
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getTransAgreements = function () {

                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                transAgreementService.getTransAgreements(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableColumnResizing: true,
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTransAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.transAgreementPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'       <li><a target="_blank" ng-href="/Report#/tenant/printModalTransAgreement/{{row.entity.id}}">' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status!=2" ng-click="grid.appScope.editTransAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && row.entity.status!=2" ng-click="grid.appScope.closeTransAgreement(row.entity)">' + app.localize('Close') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status!=2" ng-click="grid.appScope.deleteTransAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        type: 'number',
                        field: 'agreementNo',

                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.firstName',
                        width: 230,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.firstName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.code',
                        width: 150,
                        
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
                        name: app.localize('Driver'),
                        field: 'driver.name',
                        width: 230,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.driver}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('RatePerMonth'),
                        field: 'ratePerMonth',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.formatNumber(row.entity.ratePerMonth)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RatePerTrip'),
                        field: 'ratePerTrip',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.formatNumber(row.entity.ratePerTrip)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getTransAgreementStatus(row.entity.status)}}</div>',
                        //field: 'status'
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

                        vm.getTransAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTransAgreements();
                    });
                },
                data: []
            };

            vm.transAgreementPrintModal = function (agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/transportation/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.transportation.agreements.printtemplates.printPreview as vmMain',
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

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                transAgreementService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };





            function openViewTransAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/transportation/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.transportation.agreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            function openCreateOrEditTransAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/transportation/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.transportation.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },

                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTransAgreements();
                });
            }

            function openCloseTransAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/transportation/agreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.transportation.agreements.closeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTransAgreements();
                });
            }

            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.closeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getTransAgreements();
                });
            }

            vm.viewTransAgreement = function (agreement) {
                openViewTransAgreementModal(agreement.id);
            };

            vm.createAgreement = function () {
                openCreateOrEditTransAgreementModal(null);
            };

            vm.editTransAgreement = function (agreement) {
                openCreateOrEditTransAgreementModal(agreement.id);
            };

            vm.closeTransAgreement = function (agreement) {
                openCloseTransAgreementModal(agreement.id);
            };

            vm.deleteTransAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('AgreementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            transAgreementService.deleteTransAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getTransAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function initializeFilters() {
                initDate();
                getStatuses();
                vm.getTransAgreements();
                getLocations();
            }

            initializeFilters();
        }
    ]);
