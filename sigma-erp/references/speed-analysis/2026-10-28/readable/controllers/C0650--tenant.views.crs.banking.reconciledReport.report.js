// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170046-170146
appModule.controller('tenant.views.crs.banking.reconciledReport.report', [
        '$scope','appSession', 'abp.services.app.bankReconciliation', 'utilities', 'abp.services.app.commonLookup', '$stateParams',
        function ($scope, appSession, bankReconciliationAppService, utilities, commonLookupService, $stateParams) {

            var vm = this;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.loading = false;
            vm.filters = $stateParams.filters;

            var reportId = 0;
            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.reportId)
                    reportId = $scope.$parent.vmMain.reportId;
            }

            //if through url print
            if (reportId == 0 && !isNaN($stateParams.query)) {
                reportId = $stateParams.query;
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };


            vm.getBankAccounts = function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                });
            };


            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.LocationsForAgreement = data.items;

                });
            };

            //Location related code END ---------------

            vm.getBankReconciledReport = function () {
                vm.loading = true;
                bankReconciliationAppService.getReconciledReportForPrint({ id: reportId }).success(function (data) {
                    vm.bankReconciledData = data.bankReconciliations.items;
                    vm.bankName = data.bankName;
                    vm.reconciledBalance = data.reconciledBalance;
                    vm.reconciliationDate = data.reconciliationDate;
                    vm.pendingEntriesBalance = data.pendingEntriesBalance;
                    vm.ledgerBalance = data.ledgerBalance;

                    var sumReconciledDebit = 0.0;
                    var sumReconciledCredit = 0.0;
                    vm.bankReconciledData.forEach(function (value, key) {
                        // in case of Debit
                        sumReconciledDebit = sumReconciledDebit + value.debit;
                        // in case of Credit
                        sumReconciledCredit = sumReconciledCredit + value.credit;
                    });
                    vm.sumReconciledDebit = utilities.round(sumReconciledDebit, 2);
                    vm.sumReconciledCredit = utilities.round(sumReconciledCredit, 2);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                //vm.getBankAccounts();
                //getLocations();
                vm.getBankReconciledReport();
            }

            init();
        }
    ]);
