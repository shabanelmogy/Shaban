// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:390940-391968
appModule.controller('tenant.views.crs.vouchers.receipts.index', [
        '$scope', '$uibModal', 'utilities', 'uiGridConstants', 'abp.services.app.receipt', 'abp.services.app.receiptSearch', 'abp.services.app.directory',
        'abp.services.app.billingMethod', 'appSession', 'abp.services.app.commonLookup', '$stateParams', '$rootScope',
        function ($scope, $uibModal, utilities, uiGridConstants, receiptService, receiptSearchService, directoryService, billingMethodService, appSession, commonLookupService, $stateParams, $rootScope) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.agreementDashboardFilters = null;
            if ($stateParams.filters) {
                vm.agreementDashboardFilters = $stateParams.filters;
            }
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.receiptPostAllocation = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithReceivables"));
            vm.receiptChargesTypeAllocation = utilities.parseBoolean(abp.setting.get("App.General.ReceiptOnScreenAllocationWithTypesOfCharges"));
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            var doNotAllowReceiptCreationWithoutAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotAllowReceiptCreationWithoutAgreement"));
            var receiptChargesTypeAllocationAgreementWise = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ChargesTypeWiseAllocationBasedOnDueAmounts"));
            vm.staffFineReceipt = utilities.parseBoolean(abp.setting.get("App.Speed.Common.StaffFineReceipt"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.salesModule = abp.features.isEnabled('CRS.SalesModule');
            vm.reportWithAllocatedInvoicesEnabled = abp.features.isEnabled('CRS.Vouchers.Receipts.ReceiptAllocationWithInvoicesReport');
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.allowPrintingOfVoidedVouchers = abp.setting.getBoolean("App.General.AllowPrintingOfVoidedVouchers");
            vm.isImportAllocations = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ImportAllocations');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Receipts");
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.approveAllEnableBotton = false;
            vm.customers = [];
            vm.receiptTypes = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.Receipts");
            vm.isEnabledDda = abp.features.isEnabled("CRS.Vouchers.Receipts.DdaProcessAutomation");
            vm.isEnabledCcReceipts = abp.features.isEnabled("CRS.Vouchers.Receipts.CcReceipts");
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isWhatsAppSmsReceiptManualEnabled = abp.features.isEnabled("Notifications.WhatsAppSmsReceiptManual");
            vm.isCustomEmailOrWhatsAppSMSEnabled = abp.features.isEnabled("Notifications.CustomEmailOrWhatsAppSMS");
            vm.emailOrWhatsappSMSInReceiptAmountGreaterThanX = parseFloat(abp.setting.get("App.Speed.Notifications.EmailOrWhatsappSMSInReceiptAmountGreaterThanX"));
            vm.isCustomEmailOrWhatsAppSMSManualSettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Notifications.CustomEmailOrWhatsAppSMSManual"));
            vm.allowToEditRVAfterChequeMature = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowToEditRVAfterChequeMature"));
            vm.moduleWiseReceivables = abp.features.isEnabled("CRS.ModuleWiseReceivables");
            vm.isHRMDeductionEnabled = abp.features.isEnabled("HRM.Deductions");

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
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

            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.allocatedTypes = [{ id: 1, name: 'Allocated' }, { id: 2, name: 'Unallocated' }];
            function getReceiptTypes() {
                vm.receiptTypes.push({ voucherSubTypeId: 25, name: app.localize('ContactReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 26, name: app.localize('GeneralReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 69, name: app.localize('StaffReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 10, name: app.localize('AdvanceReceipt') });
                vm.receiptTypes.push({ voucherSubTypeId: 72, name: app.localize('AdvanceTaxReceipt') });
                if (vm.isAssetsModuleEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 35, name: app.localize('AssetSaleReceipt') });
                }
                if (vm.staffFineReceipt) {
                    vm.receiptTypes.push({ voucherSubTypeId: 117, name: app.localize('StaffFineReceipt') });
                }
                if (vm.isHRMDeductionEnabled) {
                    vm.receiptTypes.push({ voucherSubTypeId: 1003, name: app.localize('StaffAdvanceReceipt') });
                    vm.receiptTypes.push({ voucherSubTypeId: 1004, name: app.localize('StaffLoanReceipt') });
                }
            }

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
            };
            vm.filters = {
                enableDateRange: true,
                name: "",
                agreementNo: null,
                voucherNo: null,
                customerId: null,
                fromDate: null,
                toDate: null,
                unAllocatedReceipts: false,
                amount: null,
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
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Delete'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ExportToExcel'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Void') : false,
                'view': abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.View'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Print'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Allocations'),
                receiptChargesAllocation: abp.features.isEnabled('CRS.Vouchers.Receipts.ReceiptChargesAllocation'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllActionsOnOtherBranchReceipts'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
                allowReAllocationOfAllocated: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.AllowReAllocationOfAllocated'),
                allocatedToInvoice: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ReceiptAllocationWithInvoicesReport'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.CanApproveOtherBranchReceipts'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Approve'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.UnApprove'),
                noonPayments: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.NoonPayments'),

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
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
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
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
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
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view"  ng-click="grid.appScope.viewReceipt(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isApprovedEnabled && grid.appScope.permissions.edit && !row.entity.isAuthorized && grid.appScope.locationPermission(row.entity) && !row.entity.parentVoucherId && row.entity.status != 5 && !row.entity.billingDetail.creditCard.transactionId && (grid.appScope.allowToEditRVAfterChequeMature || row.entity.cheque.status != 3)" ng-click="grid.appScope.editReceipt(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.isApprovedEnabled && grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && !row.entity.parentVoucherId && row.entity.status != 5 && !row.entity.billingDetail.creditCard.transactionId && (grid.appScope.allowToEditRVAfterChequeMature || row.entity.cheque.status != 3)" ng-click="grid.appScope.editReceipt(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="!grid.appScope.permissions.allowReAllocationOfAllocated"><a ng-if="grid.appScope.permissions.allocation && row.entity.voucherSubTypeId != 26 && !row.entity.isClosed && row.entity.status != 5 " ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('AllocationReceivables') + '</a></li> <li ng-if="grid.appScope.permissions.allowReAllocationOfAllocated"><a ng-if="grid.appScope.permissions.allocation && row.entity.voucherSubTypeId != 26 && row.entity.voucherSubTypeId != 72 && row.entity.status != 5 " ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('AllocationReceivables') + '</a></li>' +
                            '      <li ng-if="!grid.appScope.permissions.allowReAllocationOfAllocated"><a ng-if="grid.appScope.permissions.receiptChargesAllocation && row.entity.voucherSubTypeId != 26 && row.entity.voucherSubTypeId != 35 && !row.entity.isClosed && row.entity.status != 5 " ng-click="grid.appScope.createReceiptChargesAllocation(row.entity)">' + app.localize('AllocationChargesTypes') + '</a></li><li ng-if="grid.appScope.permissions.allowReAllocationOfAllocated"><a ng-if="grid.appScope.permissions.receiptChargesAllocation && row.entity.voucherSubTypeId != 26 && row.entity.voucherSubTypeId != 35 && row.entity.voucherSubTypeId != 72 && row.entity.status != 5 " ng-click="grid.appScope.createReceiptChargesAllocation(row.entity)">' + app.localize('AllocationChargesTypes') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isApprovedEnabled&&grid.appScope.permissions.delete && !row.entity.isAuthorized && grid.appScope.locationPermission(row.entity) && row.entity.status != 5  && !row.entity.billingDetail.creditCard.transactionId" ng-click="grid.appScope.deleteReceipt(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.isApprovedEnabled&&grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.status != 5  && !row.entity.billingDetail.creditCard.transactionId" ng-click="grid.appScope.deleteReceipt(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && (row.entity.status != 5 || grid.appScope.allowPrintingOfVoidedVouchers && row.entity.status == 5) " ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printReceipt/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized  && row.entity.status!=4" ng-click="grid.appScope.approveReceipts(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '    <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapproveReceipt(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.status != 5 && grid.appScope.isAccountsEnabled && row.entity.voucherSubTypeId != 35 && !row.entity.billingDetail.creditCard.transactionId" ng-click="grid.appScope.voidReceipt(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isJournalEnabled && row.entity.isAuthorized" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isWhatsAppSmsReceiptManualEnabled" ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isCustomEmailOrWhatsAppSMSEnabled && grid.appScope.isCustomEmailOrWhatsAppSMSManualSettingEnabled && (row.entity.amount > grid.appScope.emailOrWhatsappSMSInReceiptAmountGreaterThanX)" ng-click="grid.appScope.whatsAppSMSPaymentIsMoreThanXAmount(row.entity)">' + app.localize('WhatsAppSMSWhenReceiptIsMoreThanXAmount') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isCustomEmailOrWhatsAppSMSEnabled && grid.appScope.isCustomEmailOrWhatsAppSMSManualSettingEnabled && (row.entity.amount > grid.appScope.emailOrWhatsappSMSInReceiptAmountGreaterThanX)" ng-click="grid.appScope.emailPaymentIsMoreThanXAmount(row.entity)">' + app.localize('EmailWhenReceiptIsMoreThanXAmount') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('ReceiptNo'),
                        type: 'number',
                        field: 'voucherNo',
                        width: 220,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.isClosed " class="label label-success">' + app.localize('Allocated') + '</span>' +
                            ' <span  ng-show="row.entity.cheque.status==4" class="label label-warning">' + app.localize('Bounced') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized  && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
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
                        name: app.localize('Date'),
                        field: 'date',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.contact.hasCard" class="label label-warning">CC</span><span>{{row.entity.contact.name}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactCode'),
                        field: 'contact',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.contact.hasCard" class="label label-warning">CC</span><span>{{row.entity.contact.code}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CreatorUser'),
                        field: 'createdBy',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.createdBy}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Booking') + '/' + app.localize('AgreementNo'),
                        field: 'agreement.agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreement.agreementNo}} <span ng-show="row.entity.agreement.isBooking" class="label label-info">Booking</span></div>' +
                            '</div>',
                        width: 190,
                    },
                    {
                        name: app.localize('QuotationNo'),
                        field: 'quotation.quotationNo',
                        visible: vm.salesModule,
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.quotation.quotationNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell pull-right\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RrnNo'),
                        field: 'externalCode',
                        visible: vm.permissions.noonPayments,
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.externalCode}}</div>' +
                            '</div>'
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

                        vm.getReceipts();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getReceipts();
                    });
                },
                data: []
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.sendReceiptWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.whatsAppSMSPaymentIsMoreThanXAmount = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.sendReceiptWhatsAppSMSManualAmountGreateThanXAmount({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.emailPaymentIsMoreThanXAmount = function (email) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Send Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.sendReceiptEmailManualAmountGreateThanXAmount({
                                id: email.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                receiptService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (receipts) {
                    if (!receipts.isAuthorized) {
                        vm.ids.push(receipts.id);
                    }
                });
                receiptService.approvereceipt(vm.ids).success(function () {
                    vm.getReceipts();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeReceipt'));
                });
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.openprintModal = function (r) {
                commonLookupService.validateCheque(r.id).success(function (data) {
                    if (data)
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    else {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/receipts/printtemplates/printPreview.cshtml',
                            controller: 'tenant.views.crs.vouchers.receipts.printTemplates.printPreview as vmMain',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                receipt: function () {
                                    return r;
                                }
                            }
                        });
                    }
                });
            };

            vm.getReportUrl = function () {

                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/receiptsReport/" + vm.encodedFilters;
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

            function openCreateOrEditReceiptModal(receiptId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
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
                    vm.getReceipts();
                });
            }

            function openCreateOrEditReceiptImportAllocationsModal(receiptId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditImportAllocationsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditImportAllocationsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },
                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });
            }
            vm.noonPaymentsModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/noonPaymentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.noonPaymentsModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                agreement: null
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                });
            }
            function openCreateOrEditReceiptModal2(receiptId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal2.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal2 as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },
                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });
            }

            function openImportDdaModal() {
                //var modalInstance = $uibModal.open({
                //    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/importDdaModal.cshtml',
                //    controller: 'tenant.views.crs.vouchers.receipts.importDdaModal as vm',
                //    backdrop: 'static',
                //    size: 'xl',
                //    resolve: {

                //    }
                //});

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/importDdaOneModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.importDdaOneModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {

                    }
                });
            }
            function openimportCcReceiptsModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/importCcReceiptsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.importCcReceiptsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {

                    }
                });
            }

            // Opening  ViewRecieptModal 
            function openViewReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
            }

            // Opening Create Allocation Modal
            function openCreateAllocationModal(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    voucherId: function () {
                    //        return voucherId;
                    //    },

                    //}
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.id,
                                agreementId: voucher.agreementId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds
                            };
                        }
                    }
                });
            }
            function openCreateAllocationModal2(voucher) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/allocations/createAllocation2.cshtml',
                    controller: 'tenant.views.crs.vouchers.allocations.createAllocation2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    voucherId: function () {
                    //        return voucherId;
                    //    },

                    //}
                    resolve: {
                        options: function () {
                            return {
                                voucherId: voucher.id,
                                agreementId: voucher.agreementId,
                                contactId: voucher.contactId,
                                voucherSubTypeId: voucher.voucherSubTypeId,
                                tds: voucher.tds
                            };
                        }
                    }
                });
            }

            // Opening Charges Types Allocation Modal
            function openReceiptChargesAllocationModal(voucherId, amount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/receiptChargesAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.receiptChargesAllocation as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        receiptId: function () {
                            return voucherId;
                        },
                        receiptAmount: function () {
                            return amount;
                        }

                    }
                });
            }
            // Opening Charges Types Allocation Modal for agreement receipt
            function openAgreementReceiptChargesAllocationModal(voucherId, amount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/agreementReceiptChargesAllocation.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.agreementReceiptChargesAllocation as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return voucherId;
                        },
                        receiptAmount: function () {
                            return amount;
                        },
                        //agreementNo: function () {
                        //    return agreement.agreementNo;
                        //},

                    }
                });
            }

            vm.reportWithAllocatedInvoices = function () {
                vm.dateRangeCheck();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/receipts/reportWithAllocatedInvoices.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.report = function () {
                vm.dateRangeCheck();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/receipts/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.createReceipt = function () {
                if (vm.isAllocationWithChargesTypeEnabled)
                    openCreateOrEditReceiptModal2(null, null);
                else {
                    if (vm.isImportAllocations) {
                        openCreateOrEditReceiptImportAllocationsModal(null, null);
                    } else {
                        openCreateOrEditReceiptModal(null, null);
                    }
                }
            };
            vm.importDda = function () {
                openImportDdaModal();
            };
            vm.importCcReceipts = function () {
                openimportCcReceiptsModal();
            };

            vm.editReceipt = function (receipt) {
                commonLookupService.validateCheque(receipt.id).success(function (data) {
                    if (data)
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    else {
                        if (vm.isAllocationWithChargesTypeEnabled)
                            openCreateOrEditReceiptModal2(receipt.id, null);
                        else {
                            if (vm.isImportAllocations) {
                                openCreateOrEditReceiptImportAllocationsModal(receipt.id, null);
                            } else {
                                openCreateOrEditReceiptModal(receipt.id, null);
                            }
                        }

                    }
                });
            };

            vm.createAllocation = function (voucher) {
                commonLookupService.validateCheque(voucher.id).success(function (data) {
                    if (data)
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    else {
                        if (vm.isAllocationWithChargesTypeEnabled)
                            openCreateAllocationModal2(voucher);
                        else
                            openCreateAllocationModal(voucher);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.createReceiptChargesAllocation = function (voucher) {
                commonLookupService.validateCheque(voucher.id).success(function (data) {
                    if (data)
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    else {
                        if (doNotAllowReceiptCreationWithoutAgreement && receiptChargesTypeAllocationAgreementWise)
                            openAgreementReceiptChargesAllocationModal(voucher.id, voucher.amount);
                        else
                            openReceiptChargesAllocationModal(voucher.id, voucher.amount);
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            };

            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getReceipts = function () {
                vm.loading = true;
                vm.dateRangeCheck();
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }

                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                receiptSearchService.getReceipts(vm.filters).success(function (data) {
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

            vm.deleteReceipt = function (receipt) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', receipt.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.deleteReceipt({
                                id: receipt.id
                            }).success(function () {
                                vm.getReceipts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            vm.voidReceipt = function (receipt) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', receipt.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            receiptService.voidReceipt({
                                id: receipt.id
                            }).success(function () {
                                vm.getReceipts();
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

            // View Reciept
            vm.viewReceipt = function (receipt) {
                openViewReceiptModal(receipt.id, null);
            };

            // Print Reciept
            //vm.printReceipt = function (receipt) {
            //    openReceiptPrintPreview(receipt.id);
            //};

            //function openReceiptPrintPreview(receiptId) {
            //    abp.ajax({
            //        url: abp.appPath + 'Application/PrintReceipt',
            //        data: JSON.stringify({
            //            receiptId: receiptId,
            //        })
            //    });
            //}

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getReceipts();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            vm.openJournalViewModal = function (receipt) {
                openJournalViewModal(receipt);
            }

            openJournalViewModal = function (receipt) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return receipt.id;
                        },
                        voucherNo: function () {
                            return receipt.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getReceipts();
                });
            }

            vm.approveReceipts = function (receipts) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToApproveReceipt'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.approveReceipt({
                                id: receipts.id,
                            }).success(function () {
                                vm.getReceipts();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedReceipt'));
                            });
                        }
                    }
                );
            };

            vm.unapproveReceipt = function (receipts) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToUnApproveReceipt'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.unApproveReceipt({
                                id: receipts.id,
                            }).success(function () {
                                vm.getReceipts();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedReceipt'));
                            });
                        }
                    }
                );
            };
            function init() {
                initDate();

                if (vm.agreementDashboardFilters) {
                    vm.filters.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.filters.customer = vm.agreementDashboardFilters.customer;
                    vm.filters.customer.id = vm.agreementDashboardFilters.customerId;
                    vm.filters.enableDateRange = false;
                }

                getBillingMethods();
                getLocations();
                vm.getReceipts();
            }
            init();
            getReceiptTypes();
        }
    ]);
