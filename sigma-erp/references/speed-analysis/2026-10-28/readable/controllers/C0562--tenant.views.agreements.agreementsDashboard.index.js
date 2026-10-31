// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:151466-153064
appModule.controller('tenant.views.agreements.agreementsDashboard.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.commonAgreement', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.rentalAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', '$state', 'abp.services.app.agreementGroup', 'abp.services.app.agreement',
        function ($scope, $uibModal, $window, uiGridConstants, commonAgreementService, rentalAgreementSearchService, rentalAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService, $state, agreementGroupService, agreementService,) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.isStartDateOfAgreementAsDeliveryDate = abp.features.isEnabled("CRS.CustomFeatures.StartDateOfAgreementAsDeliveryDate");
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isAgreementGroups = abp.auth.hasPermission('Pages.Tenant.AgreementGroups');
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];
            
            vm.customerType = [
                { name: "Person", id: 1 },
                { name: "Company", id: 2 }
            ];

            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];
            /*vm.vehicleTypes = [];*/
            vm.type = '';
            vm.filters = {
                enableDateRange: true,
                dateTimeType: 1,
                /*vehicleType: null,*/
                agreementNo: null,
               /* chargesType:null,*/
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                salesPerson: null,
                insuranceCompany: null,
                agreementCategory: 1,
                permanentVehicle: false,
                plateNo: '',
                insuranceClaimNo: '',
                locationId: '',
                poNo: null,
                saleOrder: null,
                agreementGroupId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                vehicleOwnership: null
            };
            vm.searchAgreementGroup = function () {

                return agreementGroupService.getAgreementGroups().then(function (response) {
                    vm.agreementGroups = response.data.items;
                });
            };
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
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

            function getTariffGroups() {
                //vm.loading = true;
                //commonLookupService 
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.Tenant.Agreements.ReplaceVehicle'),
                replaceDriver: abp.auth.hasPermission('Pages.Tenant.Agreements.ReplaceDriver'),
                print: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                close: abp.auth.hasPermission('Pages.Tenant.Agreements.Close'),
                extend: abp.auth.hasPermission('Pages.Tenant.Agreements.Extend'),
                cutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.CutShort'),
                unclose: abp.auth.hasPermission('Pages.Tenant.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Agreements.Delete'),
                upGrade: abp.auth.hasPermission('Pages.Tenant.Agreements.UpGrade'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalCharges'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                'viewReceipt': abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.View'),
                createDeposit: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Addnew'),
                'viewDepsit': abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.View'),
                extendCutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.ExtendCutShort'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.AgreementsDashboard.ExportToExcel'),
                delivery: abp.auth.hasPermission('Pages.Tenant.Agreements.DeliveryMovement'),
                canOpenAgreementWithoutSaleOrder: abp.auth.hasPermission('Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental'),
            };
            vm.leasePermissions = {
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
                'viewReceipt': abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.View'),
                createDeposit: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Addnew'),
                'viewDepsit': abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.View'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges'),
                delivery: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.DeliveryMovement'),
                canOpenAgreementWithoutSaleOrder: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease'),
            };

            vm.invoicesPermissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Edit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Approve'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Delete'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ViewOtherBranchInvoices'),
                emailInvoice: abp.features.isEnabled("Notifications.EmailTrafficFineInvoice"),
                SendFineSMS: abp.features.isEnabled("Notifications.FinesSMS"),
                createReceiptFromInvoice: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.CreateReceiptFromInvoice')
            };

            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.isSaleOrderEnable = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            
            vm.locationLeasePermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.leasePermissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
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

            //if delivery pending then don't allow certain actions like Replace Vehicle, Close Agreement, Extent etc.
            vm.isDeliveryNotPendingLease = function (row) {
                if (row.isDeliveryRequired && !row.isVehicleDelivered)
                    return false;

                return true;
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
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


            vm.locationLeasePermissionClose = function (row) {
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

                if (vm.filters.status == 1) {
                    vm.filters.enableDateRange = false;
                    vm.filters.dateTimeType = 1;
                    vm.filters.enableDateRange = false;
                }
                else {
                    vm.filters.enableDateRange = true;
                    vm.filters.dateTimeType = 1;
                    vm.filters.enableDateRange = true;
                    if (vm.filters.status == 2)
                        vm.filters.dateTimeType = 2;
                }
                vm.dateRangeCheck();
            };
            vm.getAgreementType = function (category) {
                if (category === 0)
                    return "NA";
                if (category === 1)
                    return "Daily";
                if (category === 2)
                    return "Weekly";
                if (category === 3)
                    return "Monthly";
                else if (category === 4)
                    return "Lease";
                else if (category === 5)
                    return "LeaseToOwn";
                else
                    return category;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };
            vm.features = {
                agreementDocument: abp.features.isEnabled("CRS.Rental.Agreements.AgreementDocuments")
            };
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };

            vm.changeDeliveryDate = (agreement) => {
                openChangeDeliveryDateModal(agreement);
            }

            function openChangeDeliveryDateModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/changeDeliveryDateModal.cshtml',
                    controller: 'tenant.views.crs.agreements.changeDeliveryDateModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

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
                            '    <ul uib-dropdown-menu>' +//1 for rental, 2 for lease
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.view" ng-click="grid.appScope.viewLeaseAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.edit && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.edit && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity)" ng-click="grid.appScope.editLeaseAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.features.agreementDocument" ng-click="grid.appScope.openAgreementDocumentsModal(row.entity)">' + app.localize('AgreementDocuments') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.print && grid.appScope.isStartDateOfAgreementAsDeliveryDate && row.entity.expectedDeliveryDate" ng-click="grid.appScope.printAgreementDelivery(row.entity)">' + app.localize('PrintWithDeliveryDateAsStartDate') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.print" ng-click="grid.appScope.printLeaseAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceVehicle(row.entity)">' + app.localize('ReplaceVehicle') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.replace && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.replaceLeaseVehicle(row.entity)">' + app.localize('ReplaceVehicle') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.replaceDriver && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceDriver(row.entity)">' + app.localize('ReplaceDriver') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.replaceDriver && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.replaceDriver(row.entity)">' + app.localize('ReplaceDriver') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.agreementAdditionalCharges && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.agreementAdditionalCharges(row.entity)">' + app.localize('AdditionalCharges') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.agreementAdditionalCharges && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity)" ng-click="grid.appScope.leaseAgreementAdditionalCharges(row.entity)">' + app.localize('AdditionalCharges') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.extend && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)  && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.extendAgreement(row.entity.id)">' + app.localize('Extend') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.cutShort && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.cutShortAgreement(row.entity.id)">' + app.localize('CutShort') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.upGrade && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.upgradeAgreement(row.entity)">' + app.localize('Upgrade/Downgrade') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.isSaleOrderEnable " ng-click="grid.appScope.createOrViewSaleOrders(row.entity)">' + app.localize('SaleOrders') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.isSaleOrderEnable" ng-click="grid.appScope.createOrViewSaleOrders(row.entity)">' + app.localize('SaleOrders') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.close && row.entity.status == 1 && grid.appScope.locationPermissionClose(row.entity) && grid.appScope.isDeliveryNotPending(row.entity) " ng-click="grid.appScope.closeAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.close && row.entity.status == 1 && grid.appScope.locationLeasePermissionClose(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.closeLeaseAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.unclose && row.entity.status == 2 && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.unCloseAgreement(row.entity)">' + app.localize('UnCloseAgreement') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.unClose &&  row.entity.status == 2 && grid.appScope.locationLeasePermissionClose(row.entity)" ng-click="grid.appScope.unCloseAgreement(row.entity)">' + app.localize('UnCloseAgreement') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.delete && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.delete && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteLeaseAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.enableManualAgreementNo" ng-click="grid.appScope.openUpdateManualAgreementNoModal(row.entity)">' + app.localize('UpdateManualAgreementNo') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '      <li><hr></li>' +
                            '      <li><a ng-click="grid.appScope.openviewCustomerModal(row.entity)">' + app.localize('ViewCustomer') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openCustomerSOAModal(row.entity)">' + app.localize('StatementOfAccount') + '</a></li>' +
                            '      <li><hr></li>' +
                            '      <li><a ng-if="grid.appScope.invoicesPermissions.create && grid.appScope.isRentalEnabled" ng-show="row.entity.agreementCategory === 1" ng-click="grid.appScope.openAddRentalInvoiceModal(row.entity)">' + app.localize('AddInvoice') + '</a></li>' +//rental
                            '      <li><a ng-if="grid.appScope.invoicesPermissions.create && grid.appScope.isLeaseEnabled" ng-show="row.entity.agreementCategory === 2" ng-click="grid.appScope.openAddLeaseInvoiceModal(row.entity)">' + app.localize('AddInvoice') + '</a></li>' +//lease
                            '      <li><a ng-click="grid.appScope.openViewInvoice(row.entity)">' + app.localize('ViewInvoices') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.view && row.entity.deposit == 0" ng-click="grid.appScope.createDeposit(row.entity)">' + app.localize('CreateDeposit') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.view && row.entity.deposit == 0" ng-click="grid.appScope.createDeposit(row.entity)">' + app.localize('CreateDeposit') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.viewReceipt" ng-click="grid.appScope.openViewReceiptVoucher(row.entity)">' + app.localize('ViewReceipts') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.viewReceipt" ng-click="grid.appScope.openViewReceiptVoucher(row.entity)">' + app.localize('ViewReceipts') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.createDeposit" ng-click="grid.appScope.openAddDebiteNoteModal(row.entity)">' + app.localize('AddDebiteNote') + '</a></li>' +//lease
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.createDeposit" ng-click="grid.appScope.openAddDebiteNoteModal(row.entity)">' + app.localize('AddDebiteNote') + '</a></li>' +//lease
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.viewDepsit" ng-click="grid.appScope.openViewDebiteNote(row.entity)">' + app.localize('ViewDebitNotes') + '</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.viewDepsit" ng-click="grid.appScope.openViewDebiteNote(row.entity)">' + app.localize('ViewDebitNotes') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openUpgradeLPOModal(row.entity)">' + app.localize('UpdateLPO') + '</a></li>' +
                            '      <li ng-if="!row.entity.isVehicleDelivered"><a ng-click="grid.appScope.changeDeliveryDate(row.entity)">' + app.localize('ChangeDeliveryDate') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        /*width: 134,*/
                        type: 'number',
                        field: 'agreementNo',

                    },
                    {
                        name: app.localize('Type'),
                        field: 'agreementType',
                       /* width: 120,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getAgreementType(row.entity.agreementType)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.name',
                        /*width: 180,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SalesPerson'),
                        field: 'salesPerson.name',
                        /*width: 180,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.salesPerson.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        field: 'driver.name',
                        //width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        /*width: 120,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                       /* width: 120,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VehicleType'),
                        /*width: "10%",*/
                        field: 'vehicle.tariffGroup.title'
                    },
                   
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicleId',
                       /* width: 100,*/
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>'
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
                    //{
                    //    name: app.localize('PermanentVehicle'),
                    //    field: 'permanentVehicleId',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //    '<div class=\"ui-grid-cell-contents\">{{row.entity.permanentVehicle.plateNo}}</div>' +
                    //    '</div>'
                    //},
                    {
                        name: app.localize('Status'),
                      /*  width: 70,*/
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Total'),
                       /* width: 70,*/
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.roundingforView(row.entity.total)}}</div>',
                        field: 'total'
                    },
                    {
                        name: app.localize('RentRate'),
                        /* width: 70,*/
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.roundingforView(row.entity.rentRate)}}</div>',
                        field: 'total'
                    },
                    {
                        name: app.localize('Received'),
                       /* width: 70,*/
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.roundingforView(row.entity.received)}}</div>',
                        field: 'received'
                    },
                     
                    {
                        name: app.localize('CSTBL'),
                       /* width: 70,*/
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.roundingforView(row.entity.balance)}}</div>',
                        field: 'balance'
                    },
                    //{
                    //    name: app.localize('Location'),
                    //    field: 'locationId',
                    //    cellTemplate:
                    //    '<div class=\"ui-grid-cell\">' +
                    //    '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                    //    '</div>'
                    //}
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

                        vm.getAgreements();
                    });
                },
                data: []
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            vm.viewInvoices = function (agreement) {
                var filters = {
                    agreement: agreement
                }
                var url = `/Application#/tenant/crs/invoices`;
                window.open(url, "_blank");
            }

            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                commonAgreementService.exportToExcelView(vm.filters)
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

            //function getAgreementTypes() {
            //    vm.agreementTypes = [{ id: 1, name: "Daily" }, { id: 2, name: "Weekly" }, { id: 3, name: "Monthly" }];
            //};

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            }

            vm.report = function () {
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard/report.cshtml';
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

            function openPrintAgreementModalDelivery(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreviewDelivery as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        startDateAsDeliveryDate: true

                        
                    }
                });

            }

            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            vm.printAgreementDelivery = function (agreement) {
                openPrintAgreementModalDelivery(agreement.id);
            };

            




            function openPrintLeaseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }



            vm.printLeaseAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewModal as vm',
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
            function openAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementAdditionalCharges as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }
            function openLeaseAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.agreementAdditionalCharges as vm',
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
            }

            vm.leaseAgreementAdditionalCharges = function (agreement) {
                openLeaseAgreementAdditionalChargesModal(agreement.id);
            };
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

            vm.agreementAdditionalCharges = function (agreement) {
                openAgreementAdditionalChargesModal(agreement.id);
            };

            vm.createOrViewSaleOrders = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/addOrViewSaleOrder.cshtml',
                    controller: 'tenant.views.crs.agreements.addOrViewSaleOrder as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        },
                        contactId: function () {
                            return agreement.customerId
                        }
                    }
                });
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
            }

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
            }

            vm.isFirebaseInitalized = false;

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

                    try {

                        firebase.auth().signOut();
                    } catch (e) { //Not loggedIn or firebase app not initialized...
                        //Do nothing...
                    }

                    vm.getAgreements();
                });
            }

            function openCloseLeaseAgreementModal(agreementId) {
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
            }
            vm.closeLeaseAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseLeaseAgreementModal(agreement.id);
            };

            // Replace Vehicle Modal

            function openReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                isFirebaseInitalized: vm.isFirebaseInitalized
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openLeaseReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openDeliveryMovementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/deliveryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.deliveryModal as vm',
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
            }

            function openReplaceDriverModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceDriverModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceDriverModal as vm',
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
            }

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
            }

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
            }
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
            }

            function openViewLeaseAgreementModal(agreementId) {
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
            }

            function openCreateOrEditLeaseAgreementModal(agreementId, chargesSettings) {
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
            }

            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.editLeaseAgreement = function (agreement) {
                openCreateOrEditLeaseAgreementModal(agreement.id, vm.chargesSettingsForLease);
            };

            vm.viewLeaseAgreement = function (agreement) {
                openViewLeaseAgreementModal(agreement.id);
            };

            vm.viewBillingHistory = function (agreement) {
                openBillingHistoryModal(agreement.id);
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

            // UpGrade Agreement Code
            vm.upgradeAgreement = function (agreemnt) {
                openUpgradeAgreementModal(agreemnt.id, vm.chargesSettings);
            }

            vm.unCloseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.uncloseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
                            });
                        }
                    }
                );
            };


            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getChargesSettingsForLease() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 2 }).success(function (data) {
                    vm.chargesSettingsForLease = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, contactCategory: vm.filters.contactCategory }).then(function (response) {
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
            vm.getAgreements = function () {
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
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                commonAgreementService.getAgreements(vm.filters).success(function (data) {
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
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deleteLeaseAgreement = function (agreement) {
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

            vm.openviewCustomerModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/viewModel.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return agreement.customerId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            };

            vm.openCustomerSOAModal = function (agreement) {
                var params = {
                    customer: {
                        name: agreement.customer.name,
                        code: agreement.customer.code
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_customerStatementOfAccountsAgreementsDashboard', { "filters": params });
                window.open(url, '_blank');
            };

            vm.openUpgradeLPOModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard/upgradeLPOModal.cshtml',
                    controller: 'tenant.views.agreements.agreementsDashboard.upgradeLPOModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.openUpdateManualAgreementNoModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard/updateManualAgreementNoModal.cshtml',
                    controller: 'tenant.views.agreements.agreementsDashboard.updateManualAgreementNoModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.openAddRentalInvoiceModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
            }

            vm.openAddLeaseInvoiceModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateLeaseModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateLeaseModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
            }

            vm.openAddDebiteNoteModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return null;
                        },
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDebitNotes();
                });
            }

            vm.openViewDebiteNote = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customer.name,
                        code: agreement.customer.code
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_debitNotesAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            vm.openViewReceiptVoucher = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customer.name,
                        code: agreement.customer.code
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_receiptsAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            vm.openViewInvoice = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customer.name,
                        code: agreement.customer.code
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_invoicesAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            vm.openAgreementDocumentsModal = function (agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDocumentsModalU.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDocumentsModalU as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                ContactCategory: agreement.customer.contactCategory,
                                driverType: agreement.driver.contactType,
                                driverId: agreement.driverId,
                                customerId: agreement.customerId
                            };
                        }

                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };


            function openCreateOrEditLeaseAgreementModal(agreementId, chargesSettings) {
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
            }
            vm.createLeaseAgreement = function () {
                openCreateOrEditLeaseAgreementModal(null, vm.chargesSettingsForLease);
            };

            vm.clearInsuranceCompany = function () {
                vm.filters.insuranceCompany = null;
                vm.filters.insuranceCompanyId = null;
            };

            vm.replaceVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openReplaceVehicleModal(agreement.id);
            };

            vm.replaceLeaseVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openLeaseReplaceVehicleModal(agreement.id);
            };

            vm.replaceDriver = function (agreement) {
                openReplaceDriverModal(agreement.id);
            };

            vm.addDeliveryMovement = function (agreement) {
                openDeliveryMovementModal(agreement.id);
            };

            vm.extendAgreement = function (agreementId) {
                openExtendCutShortModal({ agreementId: agreementId, action: 1 });
            }
            vm.cutShortAgreement = function (agreementId) {
                openExtendCutShortModal({
                    agreementId: agreementId, action: 2
                });
            }
            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };
            vm.createDeposit = function (agreement) {
                openCreateDepositModal(agreement);
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function initializeFilters() {
                initDate();
                //getAgreementTypes();
                getStatuses();
                if (vm.isAgreementGroups) {
                    vm.searchAgreementGroup();
                }
                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.searchUsersWithDesignation();
                getChargesSettingsForLease();
                vm.getAgreements();
                
                getLocationsActiveAndInActive();
            }
            getTariffGroups();
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
