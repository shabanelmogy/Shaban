// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:144506-145439
appModule.controller('tenant.views.crs.agreements.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.agreement', 'abp.services.app.commonAgreement', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.rentalAgreementExport', '$uibModal', 'options',
        function ($scope, $uibModalInstance, uiGridConstants, agreementService, commonAgreementAppService, rentalAgreementSearchService, rentalAgreementExportService, $uibModal, options) {

            var vm = this;
            vm.date = moment();
            vm.isDashboard2Enabled = abp.features.isEnabled("CRS.AgreementsDashboard2");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.skipCount = 0;
            vm.filters = {
                fleetCode: null,
                plateNo: '',
                status: options.agreementStatus,
                vehicleOwnership: options.vehicleOwnership,
                vehicleType: options.vehicleType,
                agreementType: options.agreementType,
                locationId: options.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                enableDateRange: true,
                startDate: null,
                endDate: null,
            };


            vm.dateRangeModelChanged = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                vm.DueToCloseCalender();
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

            vm.subTitle = function () {
                var result = "";
                if (options.agreementStatus == 'Due') { result = "DueToClose"; }
                else if (options.agreementStatus == 'OverDue') { result = "OverDueClosing"; }
                else if (options.agreementStatus == 'Opened') { result = "OpenedToday"; }
                else if (options.agreementStatus == 'PreClosed') { result = "PreClosed"; }
                else result = options.agreementStatus;
                return app.localize(result);
            };

            vm.DueToCloseCalender = function () {
                vm.loading = true;
                vm.disableSaveButton = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                rentalAgreementSearchService.getDueAgreements(vm.filters).success(function (data) {
                    vm.totalDataCount = data.totalCount;
                    vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                    vm.data = data;
                    vm.paginate(1);

                    vm.gridOptions2.totalItems = data.totalCount;
                    vm.gridOptions2.data = data.agreements;
                }).finally(function () {
                    vm.loading = false;
                    vm.disableSaveButton = false;

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
                    templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewModal as vm',
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
                    vm.getAgreements();
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
                    vm.getAgreements();
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
                    vm.getAgreements();
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
                    vm.getAgreements();
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
                    vm.getAgreements();
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
                                vm.getAgreements();
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
                    templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.agreements.createOrEditModal as vm',
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
                    vm.getAgreements();
                });
            };
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.Tenant.Agreements.ReplaceVehicle'),
                print: abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
                close: abp.auth.hasPermission('Pages.Tenant.Agreements.Close'),
                extend: abp.auth.hasPermission('Pages.Tenant.Agreements.Extend'),
                cutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.CutShort'),
                unclose: abp.auth.hasPermission('Pages.Tenant.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Agreements.Delete'),
                upGrade: abp.auth.hasPermission('Pages.Tenant.Agreements.UpGrade'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                extendCutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.ExtendCutShort'),
            };
            vm.usesAgreementGridPaging = options.agreementStatus == 'Opened'
                || (!options.openAgreementDashboardTotal
                    && options.agreementStatus != 'Due'
                    && options.agreementStatus != 'OverDue'
                    && options.agreementStatus != 'ClosedToday'
                    && options.agreementStatus != 'PreClosed');
            vm.gridOptions2 = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                enablePagination: true,
                useExternalPagination: vm.usesAgreementGridPaging,
                enableSorting: true,
                useExternalSorting: true,
                enableColumnResizing: true,
                appScopeProvider: vm,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length === 0) {
                            return;
                        }

                        let sortColumn = sortColumns[0].field;
                        let sortDirection = sortColumns[0].sort.direction;
                        let isNumber = sortColumns[0].colDef.type === 'number';
                        grid.appScope.gridOptions2.data.sort(function (a, b) {
                            if (isNumber) {
                                let aNumber = isNaN(a[sortColumn]) ? parseFloat(a[sortColumn].replace(',', '')) : a[sortColumn];
                                let bNumber = isNaN(b[sortColumn]) ? parseFloat(b[sortColumn].replace(',', '')) : b[sortColumn];

                                if (sortDirection === 'desc') {
                                    return bNumber - aNumber;
                                }
                                else {
                                    return aNumber - bNumber;
                                }
                            } else {
                                let v1 = a[sortColumn];
                                let v2 = b[sortColumn];
                                if (sortDirection === 'desc') {
                                    if (v1 > v2) {
                                        return -1;
                                    } else if (v1 < v2) {
                                        return 1;
                                    }
                                    return 0;
                                }
                                else {
                                    if (v1 > v2) {
                                        return 1;
                                    } else if (v1 < v2) {
                                        return -1;
                                    }
                                    return 0;
                                }
                            }
                        });
                    });

                    if (vm.usesAgreementGridPaging) {
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            if (vm.suppressPagingEvent)
                                return;

                            var newSkip = (pageNumber - 1) * pageSize;
                            if (newSkip === vm.filters.skipCount && pageSize === vm.filters.maxResultCount)
                                return;

                            vm.skipCount = newSkip;
                            vm.filters.skipCount = newSkip;
                            vm.filters.maxResultCount = pageSize;
                            vm.getAgreements(true);
                        });
                    }
                },
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
                            '       <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printModalAgreement/{{row.entity.id}}">' + app.localize('Print') + '</a></li>' +
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
                        name: app.localize('No'),
                        width: 140,
                        type: 'number',
                        field: 'agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        width: 100,
                        field: 'agreementTypeName',
                        cellTemplate: '<div>{{grid.appScope.getlocalizedString(row.entity.agreementTypeName)}}</div>'
                    },
                    {
                        name: app.localize('VehicleNo'),
                        field: 'plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.plateNo}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'makeAndModel',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.makeAndModel}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\" ng-if="grid.appScope.contactCategory== Individual">{{row.entity.mobileNo}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="grid.appScope.contactCategory== Company">{{row.entity.contactNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SalesPerson'),
                        field: 'agreementSalesPerson',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementSalesPerson}}</div>' +
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
                        name: app.localize('ExpectedEndDate'),
                        field: 'endDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('InLocation'),
                        field: 'closingLocation',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.closingLocation}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CollectionLocation'),
                        field: 'dropOffLocation',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.dropOffLocation}}</div>' +
                            '</div>'
                    }
                ],
                data: []
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
                            '       <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printModalAgreement/{{row.entity.id}}">' + app.localize('Print') + '</a></li>' +
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
                        name: app.localize('No'),
                        width: 140,
                        type: 'number',
                        field: 'agreementNo'
                    },
                    {
                        name: app.localize('Type'),
                        width: 100,
                        field: 'agreementTypeText'
                    },
                    {
                        name: app.localize('VehicleNo'),
                        field: 'vehicle.plateNo'

                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'vehicle.modelId',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.model.make}} {{ row.entity.vehicle.model.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.name'
                    },
                    {
                        name: app.localize('SalesPerson'),
                        field: 'salesPerson.name'
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
                        name: app.localize('ExpectedEndDate'),
                        field: 'endDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('InLocation'),
                        field: 'closingLocationId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.closingLocation}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CollectionLocation'),
                        field: 'pickupLocationId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.dropoffLocation.title}}&nbsp;{{row.entity.dropoffLocationAddress}}</div>' +
                            '</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAgreements();
                    });
                },
                data: []
            };
            vm.getMakeModel = function (vehicle) {
                return vehicle.model.make + ' '
                    + vehicle.model.name;
            };
            vm.getAgreements = function (fromPager) {
                vm.loading = true;
                vm.disableSaveButton = true;

                if (!fromPager && vm.usesAgreementGridPaging) {
                    vm.skipCount = 0;
                    vm.filters.skipCount = 0;
                    vm.filters.maxResultCount = vm.gridOptions2.paginationPageSize || app.consts.grid.defaultPageSize;
                }

                if (vm.skipCount == 0)
                    vm.agreements = [];
                if (vm.usesAgreementGridPaging)
                    vm.filters.skipCount = vm.skipCount;
                vm.filters.startDate = moment().startOf('day');
                vm.filters.endDate = moment().endOf('day');

                if (options.agreementStatus == 'Opened') {
                    rentalAgreementSearchService.agreementsGridView(vm.filters).success(function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                        vm.data = data;
                        vm.paginate(1);
                        vm.gridOptions2.totalItems = data.totalCount;
                        vm.gridOptions2.data = data.agreements;
                    }).finally(function () {
                        vm.loading = false;
                        vm.disableSaveButton = false;
                    });
                }
                else if (options.agreementStatus == 'Due') {
                    vm.DueToCloseCalender();
                }
                else if (options.agreementStatus == 'OverDue') {
                    rentalAgreementSearchService.getOverDueAgreements(vm.filters).success(function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                        vm.data = data;
                        vm.paginate(1);

                        vm.gridOptions2.totalItems = data.totalCount;
                        vm.gridOptions2.data = data.agreements;
                    }).finally(function () {
                        vm.loading = false;
                        vm.disableSaveButton = false;

                    });
                }
                else if (options.agreementStatus == 'ClosedToday') {
                    rentalAgreementSearchService.getClosedTodayAgreements(vm.filters).success(function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                        vm.data = data;
                        vm.paginate(1);

                        vm.gridOptions2.totalItems = data.totalCount;
                        vm.gridOptions2.data = data.agreements;
                    }).finally(function () {
                        vm.loading = false;
                        vm.disableSaveButton = false;

                    });
                }
                else if (options.agreementStatus == 'PreClosed') {
                    rentalAgreementSearchService.getPreClosedAgreements(vm.filters).success(function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                        vm.data = data;
                        vm.paginate(1);

                        vm.gridOptions2.totalItems = data.totalCount;
                        vm.gridOptions2.data = data.agreements;
                    }).finally(function () {
                        vm.loading = false;
                        vm.disableSaveButton = false;

                    });

                }

                else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;

                    if ((options.openAgreementDashboardTotal == true)) {
                        commonAgreementAppService.getAgreements(vm.filters).success(function (data) {
                            vm.gridOptions.totalItems = data.totalCount;
                            vm.gridOptions.data = data.items;
                        }).finally(function () {
                            vm.loading = false;
                            if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                                initDate();
                        });
                    } else {
                        rentalAgreementSearchService.agreementsGridView(vm.filters).success(function (data) {
                            vm.totalDataCount = data.totalCount;
                            vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                            vm.data = data;
                            vm.paginate(1);
                            vm.gridOptions2.totalItems = data.totalCount;
                            vm.gridOptions2.data = data.agreements;
                        }).finally(function () {
                            vm.loading = false;
                            vm.disableSaveButton = false;
                            if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                                initDate();
                        });
                    }
                }
            };

            vm.pageSize = 100;
            vm.pageSizes = [10, 20, 50, 100];
            vm.currentPage = 0;
            vm.isNextPage = true;
            vm.isPreviousPage = true;
            vm.isPaging = false;

            vm.onPageSizeChange = () => {
                vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                vm.paginate(1);
            }

            vm.paginate = (currentPage) => {
                vm.currentPage = currentPage;
                vm.isNextPage = vm.currentPage < vm.totalPages;
                vm.isPreviousPage = vm.currentPage > 1;
                vm.isPaging = true;
                vm.paginateAgreements = vm.data.agreements.slice((vm.currentPage - 1) * vm.pageSize, vm.currentPage * vm.pageSize);
                vm.isPaging = false;
            }
            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.maxResultCount = null;
                vm.filters.startDate = moment().startOf('day');
                vm.filters.endDate = moment().endOf('day');
                rentalAgreementExportService.exportToExcelOverdueClosing(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.closedexportToExcel = function () {
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

                rentalAgreementExportService.exportToExcelDue(vm.filters)
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
                rentalAgreementExportService.exportToExcelOpen(vm.filters)
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
                rentalAgreementExportService.exportToExcelPreClosed(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function init() {
                initDate();
                vm.getAgreements();
            }

            init();
        }
    ]);
