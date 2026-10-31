// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:332220-333209
appModule.controller('tenant.views.crs.vouchers.creditNotes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.invoice', 'abp.services.app.directory', 'abp.services.app.creditNote', 'appSession', 'abp.services.app.commonLookup', 'utilities', '$rootScope',
        function ($scope, $uibModal, uiGridConstants, invoiceService, directoryService, creditNoteService, appSession, commonLookupService, utilities, $rootScope) {
            var vm = this;
            vm.loading = false;
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.isAccountsEnable = abp.features.isEnabled("CRS.Accounts");
            vm.isErsEnabled = abp.features.isEnabled("ERS.Rental");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isAllocationInCreditNoteSettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowAllocationsInCreditNote"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.CreditNotes");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }, { id: 4, name: 'Rejected' }];
            vm.approveAllEnableBotton = false;
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.isWhatsAppSmsCreditNoteManualEnabled = abp.features.isEnabled('Notifications.WhatsAppSmsCreditNoteManual');
            vm.isEmailCreditNoteManualEnabled = abp.features.isEnabled('Notifications.EmailCreditNoteManual');
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.isDashboard2Enabled = abp.features.isEnabled("CRS.AgreementsDashboard2");
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.isEInvoicingUAEEnabled = abp.features.isEnabled("Core.Integration.EInvoicingUAE");
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
                voucherNo: null,
                creditNoteType: null,
                customerId: null,
                fromDate: null,
                salesPerson: null,
                toDate: null,
                amount: null,
                skipCount: 0,
                printingWithoutLogo: false,
                maxResultCount: app.consts.grid.defaultPageSize,
                module:null
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
           
            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            //for searching sales person users
            vm.searchUser = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.user = response.data.items;
                });
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.creditNoteTypes = [{ name: app.localize("CounterReceiveable"), id: 22 },
            { name: app.localize("OnAccount"), id: 23 }
            ];

            vm.getCreditNoteTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 22) return app.localize("CounterReceiveable");
                else if (voucherSubTypeId == 23) return app.localize("OnAccount");
                else if (voucherSubTypeId == 56) return app.localize("CreditNoteDelivery");
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
                createOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnAccount.CreateOnAccount'),
                createCounterReceivable: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.CreateCounterReceivable'),
                createOnDeliveryNote: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.CreateOnDeliveryNote'),
                createBulkAllocations: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.BulkAllocation'),
                editOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnAccount.EditOnAccount'),
                editCounterReceivable: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.EditCounterReceivable'),
                editOnDeliveryNote: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.EditOnDeliveryNote'),
                viewOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnAccount.ViewOnAccount'),
                viewCounterReceivable: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnAccount.ViewCounterReceivable'),
                viewOnDeliveryNote: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.ViewOnDeliveryNote'),
                deleteOnAccount: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnAccount.DeleteOnAccount'),
                deleteCounterReceivable: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.CounterReceivable.DeleteCounterReceivable'),
                deleteOnDeliveryNote: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.OnDeliveryNote.DeleteOnDeliveryNote'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.CanApproveBranchCreditNotes'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.UnApprove'),
                reject: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Reject'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.ExportToExcel'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Void') : false,
                'view': abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.View'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Print'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.ViewOtherBranchCreditNotes'),
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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
            // Opening  View CreditNote Modal 

            function openViewCreditNoteModal(creditNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: null
                    }
                });

            };

            function openViewCreditNoteModalDeliveryNote(creditNoteId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/viewModalOnDeliveryNote.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });

            };

            function openViewCreditNoteOnAccountModal(creditNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/OnAccountviewModal.cshtml',
                    //  controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: null
                    }
                });

            }
            // Opening CreateOrEdit CreditNote Modal
            function openCreateOrEditCreditNoteModal(creditNoteId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCreditNotes();
                });
            };

            function openCreateOrEditCreditNoteBulkModal(creditNoteId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditBulkModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditBulkModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCreditNotes();
                });
            };

            vm.createCreditNote = function () {
                openCreateOrEditCreditNoteModal(null, null);
            };

            vm.createCreditNoteBulk = function () {
                openCreateOrEditCreditNoteBulkModal(null, null);
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            vm.createCreditOnAccountNote = function () {
                openCreateOrEditCreditNoteOnAccountModal(null, null);
            };

            vm.createCreditNoteOnDelivery = function () {
                openCreateOrEditCreditNoteOnDeliveryNoteModal(null);
            };

            function openCreateOrEditCreditNoteOnAccountModal(creditNoteId, agreement) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModalOnAccount.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCreditNotes();
                });
            };

            function openCreateOrEditCreditNoteOnDeliveryNoteModal(creditNoteId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModalOnDeliveryNote.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCreditNotes();
                });
            };

            vm.editCreditNote = function (creditNote) {
                if (creditNote.voucherSubTypeId == 22)
                    openCreateOrEditCreditNoteModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 23)
                    openCreateOrEditCreditNoteOnAccountModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 56)
                    openCreateOrEditCreditNoteOnDeliveryNoteModal(creditNote.id, null);

            };

            //vm.editCreditNoteOnAccount = function (creditNote) {
            //    // openViewCreditNoteOnAccountModal(creditNote.id, null);
            //    openCreateOrEditCreditNoteOnAccountModal(creditNote.id, null);
            //};
            vm.viewCreditNote = function (creditNote) {
                if (creditNote.voucherSubTypeId == 56) // deliveryCreditNote
                    openViewCreditNoteModalDeliveryNote(creditNote.id)
                else
                    openViewCreditNoteModal(creditNote.id, null);
            };

            vm.viewCreditNoteOnAccount = function (creditNote) {
                openViewCreditNoteOnAccountModal(creditNote.id, null);
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.dateRangeCheck();

                /*     if (vm.filters.salesPerson != null) {
                         vm.filters.salesPersonId = vm.filters.salesPerson.id;
                     }*/

                creditNoteService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcel2 = function () {
                vm.loading = true;

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.dateRangeCheck();

                /*     if (vm.filters.salesPerson != null) {
                         vm.filters.salesPersonId = vm.filters.salesPerson.id;
                     }*/

                creditNoteService.exportToExcel2(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (creditNote) {
                    if (!creditNote.isAuthorized) {
                        vm.ids.push(creditNote.id);
                    }
                });
                creditNoteService.approveCreditNotes(vm.ids).success(function () {
                    vm.getCreditNotes();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeCreditNote'));
                });
            };

            vm.report = function () {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/creditNotes/report.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/creditNotes/report2.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/creditNotes/taxReport.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/creditNotes/taxReport2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.deleteCreditNote = function (creditNote) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', creditNote.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            creditNoteService.deleteCreditNote({
                                id: creditNote.id
                            }).success(function () {
                                vm.getCreditNotes();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            vm.voidCreditNote = function (creditNote) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', creditNote.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            creditNoteService.voidCreditNote({
                                id: creditNote.id
                            }).success(function () {
                                vm.getCreditNotes();
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

            vm.getCreditNotes = function () {

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
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                vm.dateRangeCheck();
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                vm.clearSalesPerson = function () {
                    vm.filters.salesPerson = null;
                    vm.filters.salesPersonId = null;
                };
                creditNoteService.getCreditNotes(vm.filters).success(function (data) {
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
                    vm.getCreditNotes();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: 1,
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
                            '      <li><a ng-if="grid.appScope.permissions.view && (row.entity.voucherSubTypeId==22 ||row.entity.voucherSubTypeId==56  || !row.entity.voucherSubTypeId)" ng-click="grid.appScope.viewCreditNote(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && row.entity.voucherSubTypeId==23" ng-click="grid.appScope.viewCreditNoteOnAccount(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && ( row.entity.status != 5 || grid.appScope.allowPrintingOfVoidedVouchers && row.entity.status == 5) && (!grid.appScope.isEInvoicingUAEEnabled || row.entity.isPostedToASP)" ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && !row.entity.isShared && row.entity.status!=4" ng-if="((grid.appScope.permissions.editCounterReceivable && row.entity.voucherSubTypeId==22) || (grid.appScope.permissions.editOnAccount && row.entity.voucherSubTypeId==23)|| ( grid.appScope.permissions.editOnDeliveryNote && row.entity.voucherSubTypeId==56)) && grid.appScope.locationPermission(row.entity) && row.entity.status != 5 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.editCreditNote(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && !row.entity.isShared" ng-if=" ((grid.appScope.permissions.editCounterReceivable && row.entity.voucherSubTypeId==22) || (grid.appScope.permissions.editOnAccount && row.entity.voucherSubTypeId==23) || ( grid.appScope.permissions.editOnDeliveryNote && row.entity.voucherSubTypeId==56)) && grid.appScope.locationPermission(row.entity) && row.entity.status != 5 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.editCreditNote(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.allocation && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId==23 && row.entity.voucherSubTypeId!=56 && row.entity.status!=4 && row.entity.status != 5" ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.approveCreditNote(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.unapproveCreditNote(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.reject && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.rejectCreditNote(row.entity) ">' + app.localize('Reject') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4 && !row.entity.isShared " ng-if="((grid.appScope.permissions.deleteCounterReceivable && row.entity.voucherSubTypeId==22) || (grid.appScope.permissions.deleteOnAccount && row.entity.voucherSubTypeId==23) || ( grid.appScope.permissions.deleteOnDeliveryNote && row.entity.voucherSubTypeId==56)) && grid.appScope.locationPermission(row.entity)  && row.entity.status != 5 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.deleteCreditNote(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && !row.entity.isShared" ng-if="((grid.appScope.permissions.deleteCounterReceivable && row.entity.voucherSubTypeId==22) || (grid.appScope.permissions.deleteOnAccount && row.entity.voucherSubTypeId==23) || ( grid.appScope.permissions.deleteOnDeliveryNote && row.entity.voucherSubTypeId==56)) && grid.appScope.locationPermission(row.entity) && row.entity.status != 5 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.deleteCreditNote(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.status != 5 && grid.appScope.isAccountsEnabled && row.entity.voucherSubTypeId != 56 && !grid.appScope.isEInvoicingUAEEnabled" ng-click="grid.appScope.voidCreditNote(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isWhatsAppSmsCreditNoteManualEnabled" ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isEmailCreditNoteManualEnabled" ng-click="grid.appScope.sendEmail(row.entity)">' + app.localize('SendEmail') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('CreditNoteNo'),
                        width: 250,
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SageX3No'),
                        width: 170,
                        visible: vm.isSageX3Enabled,
                        field: 'externalCode'
                    },
                    {
                        name: app.localize('Type'),
                        width: 150,
                        type: 'text',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getCreditNoteTypeById(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        width: 150,
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        width: 160,
                        field: 'location.name'
                    },
                    {
                        name: app.localize('Description'),
                        width: 250,
                        field: 'notes',

                    },

                    {
                        name: app.localize('CreatedBy'),
                        field: 'creatorUser.name',
                        width: 150,
                        visible: vm.isApprovedEnabled
                    },
                    {
                        name: app.localize('CreationDate'),
                        field: 'creationTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}</div>' +
                            '</div>',
                        width: 150,
                        visible: vm.isApprovedEnabled
                    },
                    {
                        name: app.localize('ApprovedBy'),
                        field: 'authorizedByUser.name',
                        width: 150,
                        visible: vm.isApprovedEnabled
                    },
                    {
                        name: app.localize('ApprovedDate'),
                        field: 'authorizationDateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.authorizationDateTime)}}</div>' +
                            '</div>',
                        width: 150,
                        visible: vm.isApprovedEnabled
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.CurrencyFormate(grid.appScope.roundingforView(row.entity.amount))}}</div>' +
                            '</div>',
                        width: 150,
                    },
                    {
                        name: app.localize('Allocations'),
                        field: 'allocations',
                        visible: vm.isAllocationInCreditNoteSettingEnabled,
                        width: 150,
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

                        vm.getCreditNotes();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCreditNotes();
                    });
                },
                data: []
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            creditNoteService.sendCreditNoteWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.sendEmail = function (email) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Send Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            creditNoteService.sendCreditNoteEmailManual({
                                id: email.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.openprintModal = function (cn) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        creditNote: function () {
                            return cn;
                        }
                    }
                });
            };

            vm.approveCreditNote = function (creditNote) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToApproveCreditNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            creditNoteService.approveCreditNote({
                                id: creditNote.id,
                            }).success(function () {
                                vm.getCreditNotes();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedCreditNote'));
                            });
                        }
                    }
                );
            };
            vm.unapproveCreditNote = function (creditNote) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToUnApproveCreditNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            creditNoteService.unApproveCreditNote({
                                id: creditNote.id,
                            }).success(function () {
                                vm.getCreditNotes();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedCreditNote'));
                            });
                        }
                    }
                );
            };

            vm.rejectCreditNote = function (creditNote) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Credit Note?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    creditNote.rejectionReason = result;
                    rejectCreditNotesRequest(creditNote);
                });

                //abp.message.confirm(
                //    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                //    app.localize(''), app.localize('Press Ok To Reject CreditNote'),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            creditNoteService.rejectCreditNote({
                //                id: creditNote.id,
                //            }).success(function () {
                //                vm.getCreditNotes();
                //                abp.notify.success(app.localize('SuccessfullyRejectCreditNote'));
                //            });
                //        }
                //    }
                //);
            };

            function rejectCreditNotesRequest(creditNote) {
                var input = {};
                input.id = creditNote.id;
                input.rejectionReason = creditNote.rejectionReason;
                creditNoteService.rejectCreditNote(input)
                    .success(function () {
                        vm.getCreditNotes();
                        abp.notify.success(app.localize('SuccessfullyRejectCreditNote'));
                    });
            }


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

            //salesperson
            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.createAllocation = function (voucher) {
                openCreateAllocationModal(voucher.id);
            };

            vm.openJournalViewModal = function (voucher) {
                openJournalViewModal(voucher);
            }

            openJournalViewModal = function (voucher) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return voucher.id;
                        },
                        voucherNo: function () {
                            return voucher.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCreditNotes();
                });
            }

            function init() {
                initDate();
                getLocationsActiveAndInActive();
                vm.getCreditNotes();
                vm.searchUsersWithDesignation();
                //getcreditNoteTypes();

            }
            init();
        }]);
