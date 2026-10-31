// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:262651-262817
appModule.controller('tenant.views.crs.reports.agreementOutstandingInvoicesReport.index', [
        '$scope', 'uiGridConstants', '$uibModal', 'abp.services.app.agreementOutstandingInvoicesReport', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, uiGridConstants, $uibModal, agreementOutstandingInvoicesReportAppService, utilities, commonLookupService, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.reportData = null;
            vm.statuses = null;
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };

            vm.getStatus = function () {

                if (vm.filters.status == 1)
                    return "Open";
                else
                    return "Closed";

            };

            vm.getAgreementType = function () {

                if (vm.filters.agreementType == 1)
                    return "Daily";
                else if (vm.filters.agreementType == 2)
                    return "Weekly";
                else if (vm.filters.agreementType == 3)
                    return "Monthly";
                else if (vm.filters.agreementType == 4)
                    return "Lease";

            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];


            vm.customerTypes = [
                { name: "Individual", id: 1 },
                { name: "Company", id: 2 }
            ];

            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
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
                        vm.filters.customerId = customer.id;
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.getAgreementOutstandingInvoicesReport = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();


                agreementOutstandingInvoicesReportAppService.getAgreementOutstandingInvoicesReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                    vm.reportData.netAmount = 0;
                    angular.forEach(vm.reportData, function (value) {
                        vm.reportData.netAmount += value.amount;
                    })
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                agreementOutstandingInvoicesReportAppService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                getStatuses();
                vm.getAgreementOutstandingInvoicesReport();
            }

            init();
        }
    ]);
