// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:374811-375809
appModule.controller('tenant.views.crs.vouchers.payments.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.billingMethod','uiGridConstants', 'abp.services.app.payment', 'appSession', 'abp.services.app.commonLookup', 'utilities', '$rootScope',
        function ($scope, $uibModal, vehicleService, directoryService, billingMethodService, uiGridConstants, paymentService, appSession, commonLookupService, utilities, $rootScope) {

            var vm = this;
            vm.loading = false;
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isAccountFeatureEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isBillFeatureEnabled = abp.features.isEnabled("CRS.Vouchers.Bills");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Payments");
            vm.isEditPaymentChequeDetails = abp.features.isEnabled("CRS.Vouchers.Payments.EditPaymentChequeDetails");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.paymentTypes = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.JVs");
            vm.isHRMEnabled = abp.features.isEnabled("HRM");
            vm.isHRMDeductionEnabled = abp.features.isEnabled("HRM.Deductions");
            vm.isWhatsAppSmsPaymentManualEnabled = abp.features.isEnabled("Notifications.WhatsAppSmsPaymentManual");
            vm.isCustomEmailOrWhatsAppSMSManualSettingEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Notifications.CustomEmailOrWhatsAppSMSManual"));
            vm.isCustomEmailOrWhatsAppSMSEnabled = abp.features.isEnabled("Notifications.CustomEmailOrWhatsAppSMS");
            vm.emailOrWhatsappSMSInPaymentAmountGreaterThanX = parseFloat(abp.setting.get("App.Speed.Notifications.EmailOrWhatsappSMSInPaymentAmountGreaterThanX"));
            vm.isAllowGeneralBillOnCustomerEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowGeneralBillOnCustomer"));
            vm.showCustomerPaymentAllocation = false;
            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
            };
            vm.vehicles = [];
            vm.customers = [];
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.approveAllEnableBotton = false;
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                paymentType: null,
                toDate: null,
                skipCount: 0,
                printingWithoutLogo: false,
                maxResultCount: app.consts.grid.defaultPageSize,
                unAllocatedPayments: false,
            };
            vm.allocatedTypes = [{ id: 1, name: 'Allocated' }, { id: 2, name: 'Unallocated' }];
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
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.View'),
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Edit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.CanApproveBranchPayments'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.UnApprove'),
                allocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Allocation'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Delete'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Void') : false,
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Print'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.AllActionsOnOtherBranchPayments'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.ViewOtherBranchPayments'),
                isJournalEnabled: abp.auth.hasPermission('Pages.Tenant.Accounts.Journal'),
                bulkPdcPayment: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.BulkPdcPayment')
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
            function getPaymentTypes() {
                vm.paymentTypes.push({ voucherSubTypeId: 3, name: app.localize('CustomerPayment') });
                vm.paymentTypes.push({ voucherSubTypeId: 71, name: app.localize('AdvancePayment') });
                if (vm.isAccountFeatureEnabled) {
                    if (vm.isBillFeatureEnabled) {
                        vm.paymentTypes.push({ voucherSubTypeId: 4, name: app.localize('SupplierPayment') });
                    }
                    vm.paymentTypes.push({ voucherSubTypeId: 5, name: app.localize('StaffPayment') });
                    vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('PettyCashExpensePayment') });
                    vm.paymentTypes.push({ voucherSubTypeId: 15, name: app.localize('DepositRefund') });

                }
                else
                    vm.paymentTypes.push({ voucherSubTypeId: 6, name: app.localize('ExpensePayment') });
                vm.paymentTypes.push({ voucherSubTypeId: 21, name: app.localize('GeneralPayment') });
                if (vm.isWorkshopEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 59, name: app.localize('StockPurchasePayment') });
                if (vm.isHRMEnabled)
                    vm.paymentTypes.push({ voucherSubTypeId: 114, name: app.localize('SalaryPayment') });
                if (vm.isHRMDeductionEnabled) {
                    vm.paymentTypes.push(
                        { voucherSubTypeId: 1001, name: app.localize('StaffAdvancePayment') },
                        { voucherSubTypeId: 1002, name: app.localize('StaffLoanPayment') });
                }
            }

            vm.searchAdditionalDriverPopoup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (requestedBy) {
                    vm.filters.requestedBy = requestedBy;
                    vm.filters.requestedById = requestedBy.id;
                });
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


            vm.onlyBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && row.locationId === appSession.user.locationId) {
                        return false;
                    }
                }
                return true;
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
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

            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (payment) {
                    if (!payment.isAuthorized) {
                        vm.ids.push(payment.id);
                    }
                });
                paymentService.approvePayments(vm.ids).success(function () {
                    vm.getPayments();
                    abp.notify.success(app.localize('SuccessfullyAuthorizePayment'));
                });
            };


            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 2 }).success(function (data) {
                    vm.billingMethods = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.searchVehiclePopup = function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.filters.vehicle = result;

                    }
                });
            }

            vm.getPayments = function () {
                vm.loading = true;
                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null)
                    vm.filters.contact = vm.filters.customer.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                paymentService.getPayments(vm.filters).success(function (data) {
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

            vm.getPaymentType = function (type) {
                if (type == 6) {
                    if (vm.isAccountFeatureEnabled)
                        return app.localize('PettyCashExpensePayment')
                    else
                        return app.localize('ExpensePayment')
                }
                if (type == 3)
                    return app.localize('CustomerPayment');
                if (type == 4)
                    return app.localize('SupplierPayment');
                if (type == 5)
                    return app.localize('StaffPayment')
                if (type == 15)
                    return app.localize('DepositRefund')
                if (type == 21)
                    return app.localize('GeneralPayment')
                if (type == 59)
                    return app.localize('StockPurchasePayment');
                if (type == 71)
                    return app.localize('AdvancePayment');
                if (type == 114)
                    return app.localize('Salary Payment');
                if (type == 1001)
                    return app.localize('StaffAdvancePayment');
                if (type == 1002)
                    return app.localize('StaffLoanPayment');

                return '';
            }
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                } else {
                    return "";
                }
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (vm.filters.customer != null)
                    vm.filters.contact = vm.filters.customer.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                vm.filters.paymentTypeName = vm.getPaymentType(vm.filters.paymentType);
                paymentService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewPayment(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a ng-click="grid.appScope.viewPayment(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=15 && !row.entity.disableDirectModification && row.entity.status != 5 " ng-click="grid.appScope.editPayment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && grid.appScope.isEditPaymentChequeDetails && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=15 && row.entity.billingDetail.billingMethod.type==4 && !row.entity.disableDirectModification && row.entity.status != 5 " ng-click="grid.appScope.editChequeDetails(row.entity)">' + app.localize('EditChequeDetails') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && grid.appScope.isEditPaymentChequeDetails " ng-if="grid.appScope.permissions.edit && row.entity.billingDetail.billingMethod.type==4 && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=15 && !row.entity.disableDirectModification && row.entity.voucherSubTypeId!=59 && row.entity.status != 5" ng-click="grid.appScope.editChequeDetails(row.entity)">' + app.localize('EditChequeDetails') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.voucherSubTypeId!=15 && !row.entity.disableDirectModification && row.entity.voucherSubTypeId!=59 && row.entity.status != 5 " ng-click="grid.appScope.editPayment(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.allocation && (row.entity.voucherSubTypeId == 4 || row.entity.voucherSubTypeId == 71) && row.entity.status != 5 " ng-click="grid.appScope.createAllocation(row.entity)">' + app.localize('AllocationPayables') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.allocation && grid.appScope.isAllowGeneralBillOnCustomerEnabled && vm.showCustomerPaymentAllocation && row.entity.voucherSubTypeId == 3 && row.entity.status != 5 " ng-click="grid.appScope.createAllocationForCustomerPayment(row.entity)">' + app.localize('AllocationPayables') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized" ng-click="grid.appScope.approvePayment(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapprovePayment(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.status != 5 " ng-click="grid.appScope.deletePayment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.status != 5 " ng-click="grid.appScope.deletePayment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && row.entity.status != 5 " ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printPayment/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized &&  row.entity.voucherSubTypeId != 59 && row.entity.status != 5 && grid.appScope.isAccountFeatureEnabled" ng-click="grid.appScope.voidPayment(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.permissions.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isWhatsAppSmsPaymentManualEnabled" ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isCustomEmailOrWhatsAppSMSEnabled && grid.appScope.isCustomEmailOrWhatsAppSMSManualSettingEnabled && (row.entity.amount > grid.appScope.emailOrWhatsappSMSInPaymentAmountGreaterThanX)" ng-click="grid.appScope.whatsAppSMSPaymentIsMoreThanXAmount(row.entity)">' + app.localize('WhatsAppSMSWhenPaymentIsMoreThanXAmount') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isCustomEmailOrWhatsAppSMSEnabled && grid.appScope.isCustomEmailOrWhatsAppSMSManualSettingEnabled && (row.entity.amount > grid.appScope.emailOrWhatsappSMSInPaymentAmountGreaterThanX)" ng-click="grid.appScope.emailPaymentIsMoreThanXAmount(row.entity)">' + app.localize('EmailWhenPaymentIsMoreThanXAmount') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        type: 'number',
                        width: 200,
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.isClosed" class="label label-success">' + app.localize('Allocated') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
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
                        field: 'type',
                        width: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getPaymentType(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RequestedBy'),
                        field: 'requestedBy.name',
                        width: 180,
                        visible: vm.isFMSEnabled
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        width: 180,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Contact'),
                        field: 'contact.name',
                        width: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactCode'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Method'),
                        width: 180,
                        field: 'billingDetail.billingMethod.name'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 150,
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

                        vm.getPayments();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPayments();
                    });
                },
                data: []
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            paymentService.sendPaymentWhatsAppSMSManual({
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
                            paymentService.sendPaymentWhatsAppSMSManualAmountGreateThanXAmount({
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
                            paymentService.sendPaymentEmailManualAmountGreateThanXAmount({
                                id: email.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.openprintModal = function (p) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        payment: function () {
                            return p;
                        }
                    }
                });
            };

            vm.openJournalViewModal = function (payment) {
                openJournalViewModal(payment);
            }

            openJournalViewModal = function (payment) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return payment.id;
                        },
                        voucherNo: function () {
                            return payment.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPayments();
                });
            }


            openCreateOrEditPaymentModal = function (paymentId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPayments();
                });
            };
            openCreateOrEditPDCPaymentModal = function (paymentId, agreement) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/createOrEditPdcPaymentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.createOrEditPdcPaymentsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPayments();
                });
            };
            openEditChequeDetailsModal = function (paymentId) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/editChequeDetails.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.editChequeDetails as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPayments();
                });
            };

            openViewPaymentModal = function (paymentId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });

            };

            vm.createPayments = function () {
                openCreateOrEditPaymentModal(null, null);
            };
            vm.createPDCPayments = function () {
                openCreateOrEditPDCPaymentModal(null, null);
            }
            vm.editPayment = function (payment) {
                if (payment.billingDetail.cheque) {

                    if (payment.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        openCreateOrEditPaymentModal(payment.id, null);

                    }
                }
                else {
                    openCreateOrEditPaymentModal(payment.id, null);

                }
            };
            vm.editChequeDetails = function (payment) {
                if (payment.billingDetail.cheque) {
                    if (payment.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        openEditChequeDetailsModal(payment.id, null);

                    }
                }
                else {
                    openEditChequeDetailsModal(payment.id, null);

                }
            };

            vm.viewPayment = function (payment) {
                openViewPaymentModal(payment.id, null);

            };

            vm.deletePayment = function (payment) {
                if (payment.billingDetail.cheque) {
                    if (payment.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        abp.message.confirm(
                            app.localize('DeleteWarningMessage', payment.voucherNo),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    paymentService.deletePayment({
                                        id: payment.id
                                    }).success(function () {
                                        vm.getPayments();
                                        abp.notify.success(app.localize('SuccessfullyDeleted'));
                                    });
                                }
                            }
                        );
                    }
                }
                else {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage', payment.voucherNo),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                paymentService.deletePayment({
                                    id: payment.id
                                }).success(function () {
                                    vm.getPayments();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                }

            };

            vm.voidPayment = function (payment) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', payment.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            paymentService.voidPayment({
                                id: payment.id
                            }).success(function () {
                                vm.getPayments();
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

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getPayments();
                    eventOnKeyPress.preventDefault();
                }
            };

            vm.approvePayment = function (payment) {
                if (payment.billingDetail.cheque) {
                    if (payment.billingDetail.cheque.status == 4) {
                        abp.notify.error(app.localize('ChequeIsBounced'));
                    }
                    else {

                        abp.message.okConfirm(
                            //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                            app.localize(''), app.localize('PressOkToApprovePayment'),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    paymentService.approvePayment({
                                        id: payment.id,
                                    }).success(function () {
                                        vm.getPayments();
                                        abp.notify.success(app.localize('SuccessfullyAuthorizedPayment'));
                                    });
                                }
                            }
                        );
                    }
                }
                else {

                    abp.message.okConfirm(
                        //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                        app.localize(''), app.localize('PressOkToApprovePayment'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                paymentService.approvePayment({
                                    id: payment.id,
                                }).success(function () {
                                    vm.getPayments();
                                    abp.notify.success(app.localize('SuccessfullyAuthorizedPayment'));
                                });
                            }
                        }
                    );
                }
            };
            vm.unapprovePayment = function (payment) {
                if (payment.billingDetail.cheque) {
                    if (payment.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        abp.message.okConfirm(
                            //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                            app.localize(''), app.localize('PressOkToUnApprovePayment'),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    paymentService.unApprovePayment({
                                        id: payment.id,
                                    }).success(function () {
                                        vm.getPayments();
                                        abp.notify.success(app.localize('SuccessfullyUnAuthorizedPayment'));
                                    });
                                }
                            }
                        );
                    }
                }
                else {
                    abp.message.okConfirm(
                        //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                        app.localize(''), app.localize('PressOkToUnApprovePayment'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                paymentService.unApprovePayment({
                                    id: payment.id,
                                }).success(function () {
                                    vm.getPayments();
                                    abp.notify.success(app.localize('SuccessfullyUnAuthorizedPayment'));
                                });
                            }
                        }
                    );
                }
            };
            vm.createAllocation = function (voucher) {
                if (voucher.billingDetail.cheque) {
                    if (voucher.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        openCreateAllocationModal(voucher);

                    }
                }
                else {
                    openCreateAllocationModal(voucher);

                }
            };

            vm.createAllocationForCustomerPayment = function (voucher) {
                if (payment.billingDetail.cheque) {
                    if (voucher.billingDetail.cheque.status == 4) {

                        abp.notify.error(app.localize('ChequeIsBounced'));

                    }
                    else {
                        openCreateAllocationForCustomerPaymentModal(voucher);

                    }
                }
                else {
                    openCreateAllocationForCustomerPaymentModal(voucher);

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
                            return '~/App/tenant/views/crs/vouchers/payments/report.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/payments/taxReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

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
                                tds: voucher.tds
                            };
                        }
                    }
                });
            }

            function openCreateAllocationForCustomerPaymentModal(voucher) {
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
                                tds: voucher.tds,
                                includeBillsOnly: true
                            };
                        }
                    }
                });
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.contactId = null;
            };

            function init() {
                initDate();
                getLocations();
                vm.getPayments();
                getPaymentTypes();
                getBillingMethods();
            }

            init();
        }]);
