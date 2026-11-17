// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:231361-232597
appModule.controller('tenant.views.lease.agreements.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.agreement', 'abp.services.app.leaseAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.leaseAgreement', 'abp.services.app.leaseAgreementSearch', 'abp.services.app.vehicleModel',
        function ($scope, $uibModal, uiGridConstants, agreementService, leaseAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService, leaseAgreementService, leaseAgreementSearchService, vehicleModelService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            vm.models = null;

            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.preCloseAgreement = abp.features.isEnabled("CRS.CustomFeatures.PreCloseLeaseAgreement");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isCreateLeaseAgreementByWizardEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCreateLeaseAgreementByWizardEnabled"));
            vm.vehicle_EnableMortgage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
            vm.vehicle_EnableLeaseToOwn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));

            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
            vm.isRequestPaymentAfterCreationEnabled = abp.features.isEnabled("OnlinePayments.Agreement.RequestPaymentAfterCreation");

            vm.isEmailLinkToCharge = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.EmailLinkToCharge');
            vm.isChargeCard = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ChargeCard');
            vm.isLeaseToOwnEnabled = abp.features.isEnabled("CRS.Lease.LeaseToOwn");
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));
            vm.changeAgreementStatusToPrecloseOnAgreementUpgradeDowngrade = utilities.parseBoolean(abp.setting.get("App.Tars.ChangeAgreementStatusToPrecloseOnAgreementUpgradeDowngrade"));
            isCouponsAndLuckyDrawEnabled = abp.features.isEnabled('CRS.CouponsAndLuckyDraw');
            createCouponsPermission = abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.Create');
            vm.advancedFiltersAreShown = false;
            vm.agreementTypes = [

                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 },
            ];
            //vm.agreementTypes = null;
            vm.statuses = null;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];
            vm.getAgreementTypes = function (type) {
                if (!type)
                    return '';
                if (type == 4)
                    return app.localize("Lease");
                if (type == 5)
                    return app.localize("LeaseToOwn");
            };
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                masterAgreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                vehicleCheckedInButAgreementDueToClose: false,
                extendedAgreement: false,
                vehicleOwnerId: null,
                agreementCategory: 2,
                plateNo: '',
                modelYear: '',
                makeAndModel: '',
                modelId: null,
                permanentVehicle: false,
                locationId: '',
                poNo: null,
                saleOrder: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                vehicleOwnership: null,
                ownership: null,
            };


            vm.clearModel = function () {
                vm.filters.makeAndModel = null;
                vm.filters.modelId = null;
            };

            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 
                vm.filters.modelId = vm.filters.makeAndModel ? vm.filters.makeAndModel.id : null;   // 👈 yahan
                return vehicleModelService.searchPreUsedVehicleModels(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.leaseAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 }
            ];
            vm.isSaleOrderEnable = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};

            vm.features = {
                agreementDocument: abp.features.isEnabled("CRS.Lease.Agreements.AgreementDocuments")
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
            };
            vm.statusChanged = function () {

                vm.filters.status = vm.filters.selectedStatus;
                if (vm.filters.status) {
                    if (vm.filters.status == 9) {
                        vm.filters.status = 2;
                        vm.filters.isPreClosed = true;
                    }
                    else
                        vm.filters.isPreClosed = false;
                }
                else {
                    vm.filters.isPreClosed = false;
                }

                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;

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
                void: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Void'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges'),
                delivery: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.DeliveryMovement'),
                canOpenAgreementWithoutSaleOrder: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease'),
                updatePaymentInstruction: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanUpdatePaymentInstructions'),
                agreementDiscountsPeriodWise: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDiscountsPeriodWise'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ExportToExcel'),
                exportToExcelDetailed: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ExportToExcelDetailed'),
                billingHistory: abp.auth.hasPermission('Pages.Tenant.Agreements.BillingHistory'),
                extend: abp.auth.hasPermission('Pages.Tenant.Agreements.Extend'),
                extendWithCharges: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ExtendWithCharges'),
                preClose: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.PreClose'),
                editPreClose: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.PreClose.EditPreClose')
            };
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
            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.clearSalesPerson = function () {s
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
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
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
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

            vm.openPaymentInstructionsModal = function (agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/paymentInstructionsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.paymentInstructionsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        }
                    }
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status == 1 && row.entity.status != 8 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.agreementDocument && row.entity.status != 8"  ng-click="grid.appScope.openAgreementDocumentsModal(row.entity)">' + app.localize('AgreementDocuments') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.agreementDiscountsPeriodWise  && row.entity.status != 8" ng-click="grid.appScope.openAgreementDiscountsModal(row.entity)">' + app.localize('AgreementDiscounts') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print  && row.entity.status != 8" ng-click="grid.appScope.printAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'       <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printModalLeaseAgreement/{{row.entity.id}}">' + app.localize('Print (Old)') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.addReceipt  && row.entity.status != 8" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && row.entity.deposit == 0  && row.entity.status != 8" ng-click="grid.appScope.createDeposit(row.entity)">' + app.localize('CreateDeposit') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && row.entity.status != 8 && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceVehicle(row.entity)">' + app.localize('ReplaceVehicle') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.permissions.replaceDriver && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity) && row.entity.status != 8" ng-click="grid.appScope.replaceDriver(row.entity)">' + app.localize('ReplaceDriver') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.permissions.agreementAdditionalCharges && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && row.entity.status != 8" ng-click="grid.appScope.agreementAdditionalCharges(row.entity)">' + app.localize('AdditionalCharges') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.permissions.extend && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)  && row.entity.status != 8 && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.extendAgreement(row.entity.id)" ng-hide="row.entity.status == 8">' + app.localize('ExtendPeriod') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isSaleOrderEnable && row.entity.status != 8" ng-click="grid.appScope.createOrViewSaleOrders(row.entity)">' + app.localize('SaleOrders') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.extendWithCharges && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && row.entity.status != 8  && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.extendLeaseAgreement(row.entity)">' + app.localize('ExtendRateAndPeriod') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && (row.entity.status == 1 || row.entity.isPreClosed) && grid.appScope.locationPermissionClose(row.entity) && row.entity.status != 8 && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.closeAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unClose &&  row.entity.status == 2 &&!row.entity.isPreClosed && grid.appScope.locationPermissionClose(row.entity) && row.entity.status != 8" ng-click="grid.appScope.unCloseAgreement(row.entity)">' + app.localize('UnCloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && row.entity.status != 8 " ng-click="grid.appScope.viewBillingHistory(row.entity) &&  grid.appScope.permissions.billingHistory">' + app.localize('BillingHistory') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.updatePaymentInstruction && row.entity.status != 8 " ng-click="grid.appScope.openPaymentInstructionsModal(row.entity)">' + app.localize('PaymentInstructions') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status == 1 && row.entity.status != 8 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.status != 8" ng-click="grid.appScope.voidAgreement(row.entity)">' + app.localize('VoidAgreement') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isEmailLinkToCharge && !row.entity.customer.hasCard && (row.entity.statusText != \'Closed\' && row.entity.statusText != \'Voided\')"><a ng-click="grid.appScope.emailLinkToCharge(row.entity)">' + app.localize('EmailLinkToCharge') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isOnlinePaymentsEnabled && grid.appScope.isRequestPaymentAfterCreationEnabled && grid.appScope.isChargeCardEnabled && grid.appScope.isChargeCard && row.entity.customer.hasCard && (row.entity.statusText != \'Closed\' && row.entity.statusText != \'Voided\')"><a ng-click="grid.appScope.openSilentPaymentModal(row.entity)">' + app.localize('ChargeCard') + '</a></li>' +
                            '      <li ng-if="!row.entity.isVehicleDelivered"><a ng-click="grid.appScope.changeDeliveryDate(row.entity)">' + app.localize('ChangeDeliveryDate') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.preClose && (row.entity.status == 1) &&grid.appScope.locationPermissionClose(row.entity)" ng-hide="row.entity.status == 8" ng-click="grid.appScope.preCloseAgreement(row.entity)">' + app.localize('PreCloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.editPreClose && (row.entity.isPreClosed) &&grid.appScope.locationPermissionClose(row.entity)" ng-hide="row.entity.status == 8" ng-click="grid.appScope.preCloseAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        type: 'number',
                        field: 'agreementNo',
                        width: 130
                    },
                    {
                        name: app.localize('AgreementType'),
                        field: 'agreementType',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getAgreementTypes(row.entity.agreementType)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PoNo'),
                        type: 'number',
                        field: 'poNo',
                        width: 110
                    },                    
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicleId',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.vehicle.ownership==2" class="label label-danger">' + app.localize('External') + '</span>' +
                            ' <span  ng-show="row.entity.vehicle.ownership==8" class="label label-warning">' + app.localize('Mortgage') + '</span>' +
                            ' <span  ng-show="row.entity.vehicle.ownership==9" class="label label-success">' + app.localize('LeaseToOwn') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PermanentVehicle'),
                        field: 'permanentVehicleId',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.permanentVehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer.name',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.name',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        field: 'driver.name',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ExtendedDate'),
                        visible: vm.showExtendedDate,
                        field: 'extendedToDate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDateTime(row.entity.extendedToDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 130,
                        cellTemplate: '<div style="text-align:left;margin-left:5px""><span ng-if="row.entity.isPreClosed">Pre-</span>{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        width: 150,
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
            }


            // Extend Agreement 
            vm.extendLeaseAgreement = function (agreemnt) {
                openExtendLeaseAgreementModal(agreemnt.id, vm.chargesSettings);
            }

            // Extend Agreement Modal
            function openExtendLeaseAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/extendLeaseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.extendLeaseAgreementModal as vm',
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

            vm.emailLinkToCharge = (entity) => {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/emailLinkToCharge.cshtml',
                    controller: 'tenant.views.common.payments.emailLinkToCharge as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'agreement',
                                agreementId: entity.id,
                                agreementNo: entity.agreementNo,
                                customerId: entity.customerId,
                                customerName: entity.customer.name,
                                customerEmail: entity.customer.email
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }

            vm.openSilentPaymentModal = (agreement) => {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/silentPayment.cshtml',
                    controller: 'tenant.views.common.payments.silentPayment as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        data: () => {
                            return {
                                agreementId: agreement.id,
                                customerId: agreement.customerId,
                                source: 'agreement'
                            }
                        }
                    }
                });
                modalInstance.result.then(result => {

                });
            }

            vm.exportToExcel = function () {

                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                leaseAgreementExportService.exportToExcelNormal(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelDetailed = function () {

                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                leaseAgreementExportService.exportToExcelView(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }
                    
                ];
                if (abp.features.isEnabled("CRS.CustomFeatures.PreCloseLeaseAgreement") || vm.changeAgreementStatusToPrecloseOnAgreementUpgradeDowngrade) {
                    vm.statuses.push({ name: "Pre-Closed", id: 9 });
                }
                vm.statuses.push({ id: 2, name: app.localize("Closed") });
                vm.statuses.push({ id: 8, name: app.localize("Voided") });
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
            }
            vm.preCloseAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be PreClosed As It has Open Custody Movement');
                else
                    openPreCloseAgreementModal(agreement.id);
            };
            function openPreCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/preCloseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.preCloseAgreementModal as vm',
                    backdrop: 'static',
                    keyboard: false,
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
                    if (isCouponsAndLuckyDrawEnabled && createCouponsPermission && result) {
                        opencreateOrEditShoppingCouponModel(result);
                    }
                    else
                        vm.getLeaseAgreements();

                });
            }
            function opencreateOrEditShoppingCouponModel(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/createOrEditCouponModel.cshtml',
                    controller: 'tenant.views.crs.coupons.createOrEditCouponModel as vm',
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
                    vm.loading = false;
                });
            }
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
            }

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
                            }
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
                    vm.getLeaseAgreements();
                });
            }
            function openAgreementAdditionalChargesModal(agreementId) {
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

            vm.openAgreementDiscountsModal = function (agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDiscountsPeriodWiseModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                agreementStatus: agreement.status
                            };
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

            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/closeLeaseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.closeLeaseAgreementModal as vm',
                    backdrop: 'static',
                    keyboard: false,
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
                    vm.getLeaseAgreements();
                });
            }

            function createOrEditWizardModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditWizardModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.createOrEditWizardModal as vm',
                    //backdrop: 'static',
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
                modalInstance.result.then(function () {
                    vm.getLeaseAgreements();
                });
            }

            function openExtendModal(input) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/extendAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.extendAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: input.agreementId,
                                chargesSettings: vm.chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }




            function openPrintAgreementModal(agreementId) {
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

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/lease/agreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            vm.addDeliveryMovement = function (agreement) {
                openDeliveryMovementModal(agreement.id);
            };

            vm.createAgreement = function () {

                openCreateOrEditAgreementModal(null, vm.chargesSettings);
                //if (vm.isCreateLeaseAgreementByWizardEnabled) {
                //    createOrEditWizardModal(null, vm.chargesSettings);
                //}
                //else {

                //}
            };

            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };

            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };

            vm.replaceVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openReplaceVehicleModal(agreement.id);
            };

            vm.viewBillingHistory = function (agreement) {
                openBillingHistoryModal(agreement.id);
            };
            vm.replaceDriver = function (agreement) {
                openReplaceDriverModal(agreement.id);
            };
            vm.agreementAdditionalCharges = function (agreement) {
                openAgreementAdditionalChargesModal(agreement.id);
            };
            vm.extendAgreement = function (agreementId) {
                openExtendModal({ agreementId: agreementId});
            }
            vm.closeAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseAgreementModal(agreement.id);
            };

            vm.unCloseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.uncloseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getLeaseAgreements();
                                abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
                            });
                        }
                    }
                );
            };

            function getChargesSettings() {
                //vm.loading = true;
                chargesSettingService.getChargesSettings({ module: 2 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    //vm.loading = false;
                });
            };
            vm.searchvehicleOwners = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.vehicleOwners = response.data.items;
                });
            };
            vm.clearVehicleOwner = function () {
                vm.filters.vehicleOwner = null;
                vm.filters.vehicleOwnerId = null;
            };
            vm.searchvehicleOwnersPopoup = function () {
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
                        vm.filters.vehicleOwner = customer;
                    }
                });
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

            vm.getLeaseAgreements = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.vehicleOwner != null) {
                    vm.filters.vehicleOwnerId = vm.filters.vehicleOwner.id;
                }
                if (vm.filters.vehicleOwnership != 2)
                {
                    vm.filters.vehicleOwnerId = null;
                    vm.filters.vehicleOwner = null;;
                }

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
              
                leaseAgreementSearchService.getLeaseAgreements(vm.filters).success(function (data) {
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
            vm.voidAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.voidAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getLeaseAgreements();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            });
                        }
                    }
                );
            };
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function getLocationsActiveAndInActive() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            function initializeFilters() {
                initDate();
                getStatuses();
                vm.searchUsersWithDesignation();
                if (vm.vehicle_EnableMortgage) {
                    vm.leaseAgreementOwnerships.push({ key: 'Mortgage', value: 8 })
                }
                if (vm.vehicle_EnableLeaseToOwn) {
                    vm.leaseAgreementOwnerships.push({ key: 'LeaseToOwn', value: 9 })
                }

                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.getLeaseAgreements();
                getLocationsActiveAndInActive();
            }

            initializeFilters();
        }
    ]);
