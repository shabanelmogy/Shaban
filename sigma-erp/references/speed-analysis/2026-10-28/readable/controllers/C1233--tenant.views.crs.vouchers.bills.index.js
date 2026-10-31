// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:324713-325718
appModule.controller('tenant.views.crs.vouchers.bills.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.bill', 'appSession', 'abp.services.app.commonLookup', 'utilities', '$rootScope',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, billService, appSession, commonLookupService, utilities, $rootScope) {

            var vm = this;
            vm.loading = false;
            vm.allowAssetLoanBillEdit = utilities.parseBoolean(abp.setting.get("App.General.AllowAssetLoanBillEdit"));
            vm.showPrintLogoCheck = appSession.tenant.tenancyName == 'Galadari';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }, { id: 4, name: 'Rejected' }];
            vm.billDueDate = [{ id: null, name: '' }, { id: 1, name: 'Due Date' }, { id: 2, name: 'Over Due' }];
            vm.approveAllEnableBotton = false;
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.vehicles = [];
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.editBillAllocation = abp.features.isEnabled('CRS.CustomFeatures.EditBillAllocation');
            vm.suppliers = [];
            vm.isExportToExcelDetailedEnabled = abp.features.isEnabled("CRS.Vouchers.Bills.ExportToExcelDetailed")
            vm.isDubaiPoliceEnable = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isLoanEnabled = abp.features.isEnabled("CRS.Accounts.Loan");
            vm.isAbuDhabiPoliceEnable = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesEnable = abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.isFinesMonthEndPostingEnable = abp.features.isEnabled("CRS.Fines.FineMonthEndPosting");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Bills");
            vm.deleteBillsInBulk = abp.features.isEnabled("CRS.Vouchers.Bills.DeleteFineBillsInBulk");
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.Bills");
            vm.isImportBillsEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportBills");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.showOnlyDueInvoices = abp.setting.getBoolean("App.Speed.Common.ShowOnlyDueInvoices");
            vm.showLoanForGeneralBill = abp.setting.getBoolean("App.Speed.Common.ShowLoanForGeneralBill");
            vm.assignVehicleBranchInVoucherLine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AssignVehicleBranchInVoucherLine"));

            vm.changePrintingWithoutLogo = function () {
                vm.gridOptions.data.forEach(function (value) {
                    value.printObj.printHeader = vm.filters.printingWithoutLogo;
                });
            };
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                refNo: null,
                vehicleId: null,
                vehicle: null,
                billDueDate: null,
                fromDate: null,
                dueFromDate: null,
                dueToDate: null,
                toDate: null,
                isPaymentPlanDefined: false,
                skipCount: 0,
                printingWithoutLogo: false,
                maxResultCount: app.consts.grid.defaultPageSize,
                billDateFilter: 1,
                enableSupplierBillDate: false,
                dealNo: null
            }
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dueDateFilter = function () {
                if (vm.filters.billDueDate != null) {
                    vm.filters.dueFromDate = moment().startOf('day').utc();
                    vm.filters.dueToDate = moment().endOf('day').utc();
                }
                else {
                    vm.filters.dueFromDate = null;
                    vm.filters.dueToDate = null;
                }
            };
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }, { id: 5, name: app.localize("Voided") }
                ];
            };
            //vm.dateRangeModel = {
            //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            //};
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

            vm.radioButtonValueChanged = function () {
                if (vm.filters.billDateFilter == 1)
                    vm.filters.enableSupplierBillDate = false;
                else if (vm.filters.billDateFilter == 2)
                    vm.filters.enableSupplierBillDate = true;
                else if (vm.filters.billDateFilter == 3)
                    vm.filters.enableSupplierBillDate = true;

                vm.getBills();
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Addnew'),
                importBillEnable: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.ImportBills'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Edit'),
                serviceBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.ServiceBillEdit'),
                stockBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.StockBillEdit'),
                assetBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AssetBillEdit'),
                stockGrnBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.StockGrnBillEdit'),
                assetGrnBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AssetGrnBillEdit'),
                saleInventoryBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.SaleInventoryBillEdit'),
                assetLoanBillEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AssetLoanBillEdit'),
                assetBillLoanLimitedEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AssetBillLoanLimitedEdit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.CanApproveOtherBranchBills'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.UnApprove'),
                reject: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Reject'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Delete'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Void') : false,
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.AllActionsOnOtherBranchBills'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.ViewOtherBranchBills'),
                voucherLineExport: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.ExportToExcelDetailed'),
                cloneBill: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.CloneBill'),
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

            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

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
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;
                    }
                });
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

            vm.getBills = function () {
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

                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                billService.getBills(vm.filters).success(function (data) {
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
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
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


            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (bill) {
                    if (!bill.isAuthorized) {
                        vm.ids.push(bill.id);
                    }
                });
                billService.approveBills(vm.ids).success(function () {
                    vm.getBills();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeBill'));
                });
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                ;//set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                billService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcel2 = function () {
                vm.loading = true;
                ;//set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                billService.exportToExcel2(vm.filters)
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBill(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.serviceBillEdit && row.entity.voucherSubTypeId == 41 && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.stockBillEdit && row.entity.voucherSubTypeId == 42 && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetBillEdit && row.entity.voucherSubTypeId == 43 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.stockGrnBillEdit && row.entity.voucherSubTypeId == 61 && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetGrnBillEdit && row.entity.voucherSubTypeId == 62 && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && (!row.entity.isPaymentPlanDefined || grid.appScope.allowAssetLoanBillEdit) && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.saleInventoryBillEdit && row.entity.voucherSubTypeId == 102 && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetLoanBillEdit && row.entity.voucherSubTypeId == 43 && row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4 && row.entity.voucherStatus != 5" ng-if="!grid.appScope.permissions.edit && !grid.appScope.permissions.assetLoanBillEdit && grid.appScope.permissions.assetBillLoanLimitedEdit && row.entity.voucherSubTypeId == 43 && row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editAssetLoanBillLimited(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && !row.entity.isPaymentPlanDefined" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.serviceBillEdit && row.entity.voucherSubTypeId == 41 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.stockBillEdit && row.entity.voucherSubTypeId == 42 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetBillEdit && row.entity.voucherSubTypeId == 43 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.stockGrnBillEdit && row.entity.voucherSubTypeId == 61 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetGrnBillEdit && row.entity.voucherSubTypeId == 62 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.saleInventoryBillEdit && row.entity.voucherSubTypeId == 102 && !row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && grid.appScope.permissions.assetLoanBillEdit && row.entity.voucherSubTypeId == 43 && row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editBill(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled && row.entity.voucherStatus != 5 " ng-if="!grid.appScope.permissions.edit && !grid.appScope.permissions.assetLoanBillEdit && grid.appScope.permissions.assetBillLoanLimitedEdit && row.entity.voucherSubTypeId == 43 && row.entity.isPaymentPlanDefined && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editAssetLoanBillLimited(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity) && row.entity.voucherStatus != 5 " ng-click="grid.appScope.openprintModal(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalBill/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.voucherStatus!=4" ng-click="grid.appScope.approveBills(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized && row.entity.voucherSubTypeId != 42 && !(grid.appScope.isApprovedEnabled && (row.entity.voucherSubTypeId == 43 || row.entity.voucherSubTypeId == 102)) && !row.entity.isPaymentPlanDefined" ng-click="grid.appScope.unapproveBills(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.reject && !row.entity.isAuthorized && row.entity.voucherStatus!=4" ng-click="grid.appScope.rejectBills(row.entity,grid.appScope.rejectReason)">' + app.localize('Reject') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.editBillAllocation && row.entity.isAuthorized && row.entity.voucherSubTypeId == 41" ng-click="grid.appScope.allocateBill(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)  && row.entity.voucherStatus != 5" ng-click="grid.appScope.deleteBill(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.voucherStatus != 5 " ng-click="grid.appScope.deleteBill(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.voucherSubTypeId != 61 && row.entity.voucherSubTypeId != 62 && row.entity.voucherStatus != 5 && grid.appScope.isAccountsEnabled && !(grid.appScope.isApprovedEnabled && ((row.entity.voucherSubTypeId == 43 || row.entity.voucherSubTypeId == 41) && row.entity.isPaymentPlanDefined))" ng-click="grid.appScope.voidBill(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isPaymentPlanDefined" ng-click="grid.appScope.openInstallmentPaymentModel(row.entity)">' + app.localize('Installments') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.viewbill(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.cloneBill && row.entity.voucherSubTypeId == 41 && row.entity.isAuthorized" ng-click="grid.appScope.cloneBill(row.entity)">' + app.localize('CloneBill') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        width: 150,
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.voucherStatus==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SupplierBillNo'),
                        field: 'refNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.refNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PONo'),
                        field: 'poNo',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.voucherSubTypeId == 41">{{row.entity.poNo}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.voucherSubTypeId == 42 || row.entity.voucherSubTypeId == 43">{{row.entity.stockOrAssetPoNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Supplier'),
                        field: 'contact.name',
                        width: 200,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SupplierCode'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RequestedBy'),
                        field: 'requestedBy.name',
                        width: 200,
                        visible: vm.isFMSEnabled
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DueAmount'),
                        field: 'dueAmount',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.dueAmount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.statusText}}</div>' +
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

                        vm.getBills();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getBills();
                    });
                },
                data: []
            };


            vm.openprintModal = function (b) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        bill: function () {
                            return b;
                        }
                    }
                });
            };

            vm.exportToExcelTaxReport = function (tblTaxReport) {
                var tab_text = "<style>#tblTaxReport tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tblTaxReport); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'BillsTaxReport.xls';
                a.click();

            };

            vm.allocateBill = function (row) {
                openAllocateBillModal(row.id);
            };

            openAllocateBillModal = function (BillId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/allocateBillModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.allocateBillModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        BillId: function () {
                            return BillId;
                        }
                    }
                });

            }

            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }
            vm.report = function () {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/bills/report.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/bills/report2.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/bills/taxReport.cshtml';
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
                            return '~/App/tenant/views/crs/vouchers/bills/taxReport2.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.rejectReason = function (bill) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Bill?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    bill.rejectionReason = result;
                    rejectBillRequest(bill);
                });
            };

            vm.approveBills = function (bill) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToApproveBill'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.approveBill({
                                id: bill.id,
                            }).success(function () {
                                vm.getBills();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedBill'));
                            });
                        }
                    }
                );
            };

            vm.unapproveBills = function (bill) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('PressOkToUnApproveBill'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.unApproveBill({
                                id: bill.id,
                            }).success(function () {
                                vm.getBills();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedBill'));
                            });
                        }
                    }
                );
            };

            vm.rejectBills = function (bill, rejectReason) {
                rejectReason(bill);
                //abp.message.confirm(
                //    app.localize(''), app.localize('Press Ok To Reject Bill'),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            rejectReason(bill);
                //        }
                //    }
                //);
            };


            function rejectBillRequest(bill) {
                var input = {};
                input.id = bill.id;
                input.rejectionReason = bill.rejectionReason;
                billService.rejectBill(input)
                    .success(function () {
                        vm.getBills();
                        abp.notify.success(app.localize('SuccessfullyRejectBill'));
                    });
            }

            vm.generateFinesBills = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/generateModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.generateModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
            };

            vm.deleteFinesBillsInBulk = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/deleteFineBillsInBulkModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.deleteFineBillsInBulkModal as vm',
                    backdrop: 'static',
                    size: 'xl'
                });
            };

            openCreateOrEditBillModal = function (billId) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        //billId: function () {
                        //    return billId;
                        //}
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBills();
                });
            };
            openCreateOrEditAssetLoanBillLimitedModal = function (billId) {
                 $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditAssetLoanBillLimitedModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditAssetLoanBillLimitedModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBills();
                });
            };
            openCreateOrEditCloneBillModal = function (billId) {
                $rootScope.headerPrintCheck = vm.filters.printingWithoutLogo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId,
                                isClone: true,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBills();
                });
            };
            openViewbillModal = function (billId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        //billId: function () {
                        //    return billId;
                        //}
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId
                            };
                        }
                    }
                });

            };

            vm.openInstallmentPaymentModel = function (bill) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/installmentPaymentModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.installmentPaymentModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        parentVoucherId: function () {
                            return bill.id;
                        }
                    }
                });
            };

            vm.createBill = function () {
                openCreateOrEditBillModal(null);
            };


            vm.openImportBillModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/importBills.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.importBills as vm',
                    backdrop: 'static',
                    size: 'full',


                });
            };

            vm.exportToExcelDetailed = function () {
                vm.loading = true;

                billService.exportToExcelDetailed(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.importBill = function () {
                vm.openImportBillModal();
            };
            vm.editBill = function (bill) {
                openCreateOrEditBillModal(bill.id);
            };

            vm.editAssetLoanBillLimited = function (bill) {
                openCreateOrEditAssetLoanBillLimitedModal(bill.id);
            };
            vm.cloneBill = function (bill) {
                openCreateOrEditCloneBillModal(bill.id);
            };

            vm.viewBill = function (bill) {
                openViewbillModal(bill.id);

            }
            vm.deleteBill = function (bill) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', bill.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.deleteBill({
                                id: bill.id
                            }).success(function () {
                                vm.getBills();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.voidBill = function (bill) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', bill.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            billService.voidBill({
                                id: bill.id
                            }).success(function () {
                                vm.getBills();
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
                    vm.getBills();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.openJournalViewModal = function (bill) {
                openJournalViewModal(bill);
            }

            openJournalViewModal = function (bill) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return bill.id;
                        },
                        voucherNo: function () {
                            return bill.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getBills();
                });
            }

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.getBills();
                getStatuses();
            }
            init();
        }]);
