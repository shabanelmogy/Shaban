// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:295793-296361
appModule.controller('tenant.views.supplierAgreements.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.supplierAgreement', 'abp.services.app.supplierAgreementSearch', 'abp.services.app.supplierAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, $window, uiGridConstants, agreementService, supplierAgreementSearchService, supplierAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];

            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                agreementCategory: 3,
                plateNo: '',
                locationId: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};
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
                view: abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements'),
                create: abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements.Open'),
                edit: abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements.Edit'),
                print: abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements'),
                close: abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements.Close'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ExternalAgreement.SupplierAgreements.Delete'),
            };

            vm.isSaleOrderEnable = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            //if delivery pending then don't allow certain actions like Replace Vehicle, Close Agreement, Extent etc.
            vm.isDeliveryNotPending = function (row) {
                if (row.isDeliveryRequired && !row.isVehicleDelivered)
                    return false;

                return true;
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };



            vm.searchSupplierContact = function ($select) {
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
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
            vm.statusChanged = function () {
                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;

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
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status == 1 " ng-click="grid.appScope.editAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && row.entity.status == 1" ng-click="grid.appScope.closeAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status == 1 " ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 134,
                        type: 'number',
                        field: 'agreementNo'
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
                        name: app.localize('Supplier'),
                        field: 'customer.firstName',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 70,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        field: 'status'
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

                        vm.getSupplierAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getSupplierAgreements();
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
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                supplierAgreementExportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function isContractClosed(agreement) {

                if (agreement.status == 1) return true;
                else return false;
            }

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            }

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/supplierAgreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openPrintAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }


            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/supplierAgreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.supplierAgreements.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            //function openPrintAgreementModal(agreementId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
            //        controller: 'tenant.views.crs.agreements.viewModal as vm',
            //        backdrop: 'static',
            //        //windowClass: 'app-modal-window',
            //        size: 'lg',
            //        resolve: {
            //            agreementId: function () {
            //                return agreementId;
            //            }
            //        }
            //    });
            //}

            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/supplierAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.supplierAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getSupplierAgreements();
                });
            }

            vm.isFirebaseInitalized = false;

            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/supplierAgreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.supplierAgreements.closeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                    try {
                        firebase.auth().signOut();
                    } catch (e) { //Not loggedIn or firebase app not initialized...
                        //Do nothing...
                    }

                    vm.getSupplierAgreements();
                });
            }

            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.createAgreement = function () {
                openCreateOrEditAgreementModal(null, vm.chargesSettings);
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };

            //vm.printAgreement = function (agreement) {
            //    $window.open('../Agreement/Print/' + agreement.id, '_blank');
            //};

            vm.closeAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseAgreementModal(agreement.id);
            };

            //vm.unCloseAgreement = function (agreement) {
            //    abp.message.confirm(
            //        app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                agreementService.uncloseAgreement({
            //                    id: agreement.id
            //                }).success(function () {
            //                    vm.getSupplierAgreements();
            //                    abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
            //                });
            //            }
            //        }
            //    );
            //};


            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, activeOnly: true }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };



            // extended search using search customer popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };
            vm.getSupplierAgreements = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                supplierAgreementSearchService.getSupplierAgreements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.deleteAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.deleteAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getSupplierAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.openAgreementLogsModal = function (agreement) {
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
            };
            vm.clearSupplier = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function initializeFilters() {
                initDate();
                getStatuses();

                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.getSupplierAgreements();
                getLocations();
            }

            //vm.checkingPressedKey = function (keyEvent) {
            //    
            //    if (keyEvent.which == 13) {
            //        keyPress = false;
            //        vm.getAgreements();
            //    }

            //}

            initializeFilters();
        }
    ]);
