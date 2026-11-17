// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:336429-337191
appModule.controller('tenant.views.crs.vouchers.debitNotes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.debitNote', 'appSession', 'abp.services.app.commonLookup', '$stateParams', 'utilities', '$rootScope',
        function ($scope, $uibModal, uiGridConstants, directoryService, debitNoteService, appSession, commonLookupService, $stateParams, utilities, $rootScope) {
            var vm = this;
            vm.loading = false;
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");

            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.DebitNotes");
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }, { id: 4, name: 'Rejected' }];
            vm.approveAllEnableBotton = false;
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.DebitNotes");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));

            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
            };
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("WORKSHOP"))
                vm.modules.push({ name: 'Workshop', id: 6 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories Rental', id: 8 });
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });

            vm.filters = {
                enableDateRange: true,
                name: "",
                agreementNo: null,
                refNo2: null,
                voucherNo: null,
                customerId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                jobNo: null,
                skipCount: 0,
                printingWithoutLogo: false,
                maxResultCount: app.consts.grid.defaultPageSize,
                module: null
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.permissions = {
                createOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.OnAccount.CreateOnAccount'),
                createCounterPayable: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.CounterPayable.CreateCounterPayable'),
                editOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.OnAccount.EditOnAccount'),
                editCounterPayable: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.CounterPayable.EditCounterPayable'),
                viewOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.OnAccount.ViewOnAccount'),
                viewCounterPayable: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.CounterPayable.ViewCounterPayable'),
                deleteOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.OnAccount.DeleteOnAccount'),
                deleteCounterPayable: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.CounterPayable.DeleteCounterPayable'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.CanApproveBranchDebitNotes'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.UnApprove'),
                reject: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Reject'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.ExportToExcel'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Void') : false,
                'view': abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.View'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Print'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.ViewOtherBranchDebitNotes'),
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
            vm.isAgreementEnabled = abp.features.isEnabled("CRS.Rental")
                || abp.features.isEnabled("FMS")
                || abp.features.isEnabled("CRS.Transportation")
                || abp.features.isEnabled("CRS.Lease");

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.allBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && !vm.permissions.canApprovedOther && row.locationId === appSession.user.locationId) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther) {
                        return true;
                    }

                }
                return false;
            };

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
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
                            return null;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            vm.debitNoteTypes = [{ name: app.localize("CounterPayable"), id: 31 },
            { name: app.localize("OnAccount"), id: 32 },
            { name: app.localize("AssetSale"), id: 45 },
            ];

            vm.getDebitNoteTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 31) return app.localize("CounterPayable");
                else if (voucherSubTypeId == 32) return app.localize("OnAccount");
                else if (voucherSubTypeId == 45) return app.localize("AssetSale");
            };

            // Opening  View DebitNote Modal 

            function openViewDebitNoteModal(debitNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });

            }

            vm.report = function () {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/debitNotes/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.report2 = function () {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/debitNotes/report2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.taxReport = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/debitNotes/taxReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.taxReport2 = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/debitNotes/taxReport2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openViewDebitNoteOnAccountModal(debitNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/viewOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });

            }

            // Opening CreateOrEdit DebitNote Modal
            function openCreateOrEditDebitNoteModal(debitNoteId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDebitNotes();
                });
            }

            function openCreateOrEditDebitNoteOnAccountModal(debitNoteId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDebitNotes();
                });
            }

            vm.createDebitNote = function () {
                openCreateOrEditDebitNoteModal(null, null);
            };

            vm.createDebitNoteOnAccount = function () {
                openCreateOrEditDebitNoteOnAccountModal(null, null);
            };

            vm.editDebitNote = function (debitNote) {
                if (debitNote.voucherSubTypeId == 31) {
                    openCreateOrEditDebitNoteModal(debitNote.id, null);
                }
                else if (debitNote.voucherSubTypeId == 32) {
                    openCreateOrEditDebitNoteOnAccountModal(debitNote.id, null);
                }
            };

            vm.viewDebitNote = function (debitNote) {
                if (debitNote.voucherSubTypeId == 31) {
                    openViewDebitNoteModal(debitNote.id, null);
                }
                else if (debitNote.voucherSubTypeId == 32 || debitNote.voucherSubTypeId == 45) {
                    openViewDebitNoteOnAccountModal(debitNote.id, null);
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                debitNoteService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcel2 = function () {
                vm.loading = true;
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                debitNoteService.exportToExcel2(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (debitNote) {
                    if (!debitNote.isAuthorized) {
                        vm.ids.push(debitNote.id);
                    }
                });
                debitNoteService.approveDebitNotes(vm.ids).success(function () {
                    vm.getDebitNotes();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeDebitNote'));
                });
            };

            vm.deleteDebitNote = function (debitNote) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', debitNote.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            debitNoteService.deleteDebitNote({
                                id: debitNote.id
                            }).success(function () {
                                vm.getDebitNotes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            // Opening Create Allocation Modal
            function openCreateAllocationModal(voucherId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucherId
                            };
                        }
                    }
                });
            }

            vm.createAllocation = function (voucher) {
                openCreateAllocationModal(voucher.id);
            };
            vm.voidDebitNote = function (debitNote) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', debitNote.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            debitNoteService.voidDebitNote({
                                id: debitNote.id
                            }).success(function () {
                                vm.getDebitNotes();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            }).finally(function () { vm.loading = false; });
                        }
                    }
                );
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getDebitNotes = function () {
                vm.loading = true;


                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                debitNoteService.getDebitNotes(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            printHeader: vm.filters.printingWithoutLogo
                        };
                    });
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getDebitNotes();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view"ng-click="grid.appScope.viewDebitNote(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" ng-if="((grid.appScope.permissions.editCounterPayable && row.entity.voucherSubTypeId==31) || (grid.appScope.permissions.editOnAccount && row.entity.voucherSubTypeId==32)) && grid.appScope.locationPermission(row.entity) && row.entity.onAccountSupEditDelDisable==false && row.entity.status != 5" ng-click="grid.appScope.editDebitNote(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="((grid.appScope.permissions.editCounterPayable && row.entity.voucherSubTypeId==31) || (grid.appScope.permissions.editOnAccount && row.entity.voucherSubTypeId==32)) && grid.appScope.locationPermission(row.entity) && row.entity.onAccountSupEditDelDisable==false  && row.entity.status != 5" ng-click="grid.appScope.editDebitNote(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && row.entity.status != 5" ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalDebitNote/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.approveDebitNote(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapproveDebitNote(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.allocation && grid.appScope.locationPermission(row.entity) && (row.entity.voucherSubTypeId==32 || row.entity.voucherSubTypeId==45) && row.entity.status != 5 && row.entity.isAuthorized" ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.reject && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.rejectDebitNote(row.entity)">' + app.localize('Reject') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" ng-if="((grid.appScope.permissions.deleteCounterPayable && row.entity.voucherSubTypeId==31) || (grid.appScope.permissions.deleteOnAccount && row.entity.voucherSubTypeId==32)) && grid.appScope.locationPermission(row.entity) && row.entity.onAccountSupEditDelDisable==false && row.entity.status != 5 " ng-click="grid.appScope.deleteDebitNote(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="((grid.appScope.permissions.deleteCounterPayable && row.entity.voucherSubTypeId==31) || (grid.appScope.permissions.deleteOnAccount && row.entity.voucherSubTypeId==32)) && grid.appScope.locationPermission(row.entity) && row.entity.onAccountSupEditDelDisable==false && row.entity.status != 5" ng-click="grid.appScope.deleteDebitNote(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.status != 5 && grid.appScope.isAccountsEnabled" ng-click="grid.appScope.voidDebitNote(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('DebitNoteNo'),
                        type: 'number',
                        field: 'voucherNo',
                        width: 250,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        width: 150,
                        type: 'text',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDebitNoteTypeById(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactCode'),
                        field: 'contact.code',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Detail'),
                        field: 'notes'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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

                        vm.getDebitNotes();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getDebitNotes();
                    });
                },
                data: []
            };

            vm.openprintModal = function (dn) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNote: function () {
                            return dn;
                        }
                    }
                });
            };

            vm.approveDebitNote = function (debitNote) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToApproveDebitNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            debitNoteService.approveDebitNote({
                                id: debitNote.id,
                            }).success(function () {
                                vm.getDebitNotes();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedDebitNote'));
                            });
                        }
                    }
                );
            };
            vm.unapproveDebitNote = function (debitNote) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToUnApproveDebitNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            debitNoteService.unApproveDebitNote({
                                id: debitNote.id,
                            }).success(function () {
                                vm.getDebitNotes();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedDebitNote'));
                            });
                        }
                    }
                );
            };

            vm.rejectDebitNote = function (debitNote) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Debit Note?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    debitNote.rejectionReason = result;
                    rejectDebitNotesRequest(debitNote);
                });

                //abp.message.confirm(
                //    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                //    app.localize(''), app.localize('Press Ok To Reject DebitNote'),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            debitNoteService.rejectDebitNote({
                //                id: debitNote.id,
                //            }).success(function () {
                //                vm.getDebitNotes();
                //                abp.notify.success(app.localize('SuccessfullyRejectDebitNote'));
                //            });
                //        }
                //    }
                //);
            };

            function rejectDebitNotesRequest(debitNote) {
                var input = {};
                input.id = debitNote.id;
                input.rejectionReason = debitNote.rejectionReason;
                debitNoteService.rejectDebitNote(input)
                    .success(function () {
                        vm.getDebitNotes();
                        abp.notify.success(app.localize('SuccessfullyRejectDebitNote'));
                    });
            }

            vm.openJournalViewModal = function (debitNote) {
                openJournalViewModal(debitNote);
            }

            openJournalViewModal = function (debitNote) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return debitNote.id;
                        },
                        voucherNo: function () {
                            return debitNote.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDebitNotes();
                });
            }

            function init() {
                initDate();

                if (vm.agreementDashboardFilters) {
                    vm.filters.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.filters.refNo2 = vm.agreementDashboardFilters.refNo2;
                    vm.filters.customer = vm.agreementDashboardFilters.customer;
                    vm.filters.customer.id = vm.agreementDashboardFilters.customerId;
                    vm.filters.enableDateRange = false;
                }

                getLocationsActiveAndInActive();
                vm.getDebitNotes();
            }
            init();
        }]);
