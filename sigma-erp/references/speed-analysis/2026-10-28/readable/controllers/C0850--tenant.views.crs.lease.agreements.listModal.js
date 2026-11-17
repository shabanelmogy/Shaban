// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:232600-233252
appModule.controller('tenant.views.crs.lease.agreements.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', '$uibModal', 'abp.services.app.leaseAgreement', 'abp.services.app.leaseAgreementExport', 'abp.services.app.leaseAgreementSearch', 'options',
        function ($scope, $uibModalInstance, uiGridConstants, $uibModal, leaseAgreementService, leaseAgreementExportService, leaseAgreementSearchService, options) {

            var vm = this;
            vm.date = moment();
            vm.isDashboard2Enabled = abp.features.isEnabled("CRS.AgreementsDashboard2");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: options.leaseStatus,
                startDate: null,
                vehicleOwnership: options.vehicleOwnership,
                vehicleType: options.vehicleType,
                endDate: null,
                customerId: null,
                agreementCategory: 2,
                plateNo: '',
                locationId: options.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                vm.DueToCloseCalender();
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                vm.DueToCloseCalender();
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.subTitle = function () {
                var result = "";
                if (options.leaseStatus == 'Due') { result = "DueToClose"; }
                else if (options.leaseStatus == 'OverDue') { result = "OverDueClosing"; }
                else if (options.leaseStatus == 'Opened') { result = "OpenedToday"; }
                else if (options.leaseStatus == 'PreClosed') { result = "PreClosed"; }
                else result = options.leaseStatus;
                return app.localize(result);
            };

            vm.DueToCloseCalender = function () {
                vm.loading = true;

                //vm.filters.startDate = moment(vm.date).startOf('day');
                //vm.filters.endDate = moment(vm.date).endOf('day');
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                leaseAgreementSearchService.getDueAgreements(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {

                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };
            
            vm.viewAgreement = function (agreement) {
                if (vm.isDashboard2Enabled) {
                    openDetailsViewAgreementModal(agreement);

                } else {
                    openViewAgreementModal(agreement.id);
                }

            };

            function openDetailsViewAgreementModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard2/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreementsDashboard2.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {

                        options: function () {
                            return {
                                agreement: agreement,
                                agreementId: null
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });

            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            };
            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.addReceipt = function (agreement) {

                openCreateOrEditReceiptModal(null, agreement);
            };
            function openCreateOrEditReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },
                        quotationId: function () {
                            return null;
                        },
                        customer: function () {
                            return null;
                        },

                        downPayment: function () {
                            return null;
                        },
                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {

                });
            };
            vm.createDeposit = function (agreement) {
                openCreateDepositModal(agreement);
            };
            function openCreateDepositModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/createDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.createDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            };
            vm.replaceVehicle = function (agreement) {
                openReplaceVehicleModal(agreement.id);
            };
            function openReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',

                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            };
            vm.extendAgreement = function (agreementId) {
                openExtendCutShortModal({ agreementId: agreementId, action: 1 });
            };
            // ExtendCutShortModal
            function openExtendCutShortModal(input) {
                //Actions  1.Extend 2.Cutshort
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/extendCutShortAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.extendCutShortAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: input.agreementId,
                                action: input.action,
                                chargesSettings: vm.chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            };
            vm.cutShortAgreement = function (agreementId) {
                openExtendCutShortModal({
                    agreementId: agreementId, action: 2
                });
            };
            // UpGrade Agreement Code
            vm.upgradeAgreement = function (agreemnt) {
                openUpgradeAgreementModal(agreemnt.id, vm.chargesSettings);
            };
            // Upgrade Agreement Modal
            function openUpgradeAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/upgradeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.upgradeAgreementModal as vm',
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
                    vm.getLeaseAgreements();
                });
            };
            vm.viewBillingHistory = function (agreement) {
                openBillingHistoryModal(agreement.id);
            };
            function openBillingHistoryModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/billingHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.billingHistoryModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            };
            vm.closeAgreement = function (agreement) {
                openCloseAgreementModal(agreement.id);
            };
            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/closeLeaseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.closeLeaseAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
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

            vm.getlocalizedString = function (leaseStatus) {
                return app.localize(leaseStatus);
            };
            vm.deleteAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            leaseAgreementService.deleteLeaseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getLeaseAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };
            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                chargesSettings: chargesSettings

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ReplaceVehicle'),
                replaceDriver: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ReplaceDriver'),
                print: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements'),
                close: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Close'),
                unClose: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges'),

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
                        //'    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                        //btn btn-outline btn-circle btn-sm btn-primary blue
                        '<a class="btn btn-xs btn-primary blue fa fa-cog" href="" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> ' +
                        ' <i class="fa fa-angle-down"></i></a>' +
                        '    <ul class="dropdown-menu">' +
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        //'       <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printModalLeaseAgreement/{{row.entity.id}}">' + app.localize('Print') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.view && row.entity.status == 1 && row.entity.deposit == 0"  ng-click="grid.appScope.createDeposit(row.entity)">' + app.localize('CreateDeposit') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.replaceVehicle(row.entity)">' + app.localize('ReplaceVehicle') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.extend && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.extendAgreement(row.entity.id)">' + app.localize('Extend') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.cutShort && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.cutShortAgreement(row.entity.id)">' + app.localize('CutShort') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.upGrade && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.upgradeAgreement(row.entity)">' + app.localize('Upgrade/Downgrade') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBillingHistory(row.entity)">' + app.localize('BillingHistory') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.close && row.entity.status == 1 && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.closeAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        type: 'number',
                        field: 'agreementNo',
                        width: 140
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
                        name: app.localize('PermanentVehicle'),
                        field: 'permanentVehicleId',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.permanentVehicle.plateNo}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.firstName',
                        width: 190,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.name}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        field: 'driver.firstName',
                        width: 170,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        width: 85,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>' +
                        '</div>'

                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        width: 85,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        width: 100,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
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

                        vm.getLeaseAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getLeaseAgreements();
                    });
                },
                data: []
            };


            vm.getLeaseAgreements = function () {
                vm.loading = true;
                vm.filters.startDate = moment().startOf('day');
                vm.filters.endDate = moment().endOf('day');

                if (options.leaseStatus == 'Opened') {
                    leaseAgreementSearchService.getLeaseAgreements(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.leaseStatus == 'Due') {
                    vm.DueToCloseCalender();
                }
                else if (options.leaseStatus == 'OverDue') {
                    leaseAgreementSearchService.getOverDueAgreements(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.leaseStatus == 'ClosedToday') {
                    leaseAgreementSearchService.getClosedTodayAgreements(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else if (options.leaseStatus == 'PreClosed') {
                    leaseAgreementSearchService.getPreClosedAgreements(vm.filters).success(function (data) {

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                    leaseAgreementSearchService.getLeaseAgreements(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    });
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = moment().startOf('day');
                vm.filters.endDate = moment().endOf('day');
                leaseAgreementExportService.exportToExcelForListModel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelOpen = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'Open';
                leaseAgreementExportService.exportToExcelOpen(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelPreClosed = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.status = 'PreClosed';
                leaseAgreementExportService.exportToExcelPreClosed(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.dueExportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                leaseAgreementExportService.dueExportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function init() {
                initDate();
                vm.getLeaseAgreements();
            }

            init();
        }
    ]);
