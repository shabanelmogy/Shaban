// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:63633-63713
appModule.controller('host.views.crm.deals.dealReportModal', [
        '$scope', 'abp.services.app.deal',
        function ($scope, deal) {

            var vm = this;

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null) {
                    vm.filters = $scope.$parent.vmMain.filters;
                }
            }

            vm.getStages = function (stage) {
                if (stage == 1)
                    return 'New';
                else if (stage == 2)
                    return 'Average';
                else if (stage == 3)
                    return 'Hot';
                else if (stage == 4)
                    return 'Final';
                else return '';
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getStatusName = function (id) {
                if (id === 1) {
                    return "Due";
                }
                else if (id === 2) {
                    return "Processed";
                }
                else if (id === 3) {
                    return "Converted";
                }
                else if (id === 4) {
                    return "Not Suitable";
                }
            };

            vm.getVerifyStatusesName = function (value) {
                if (value === false) {
                    return "No";
                }
                else if (value === true) {
                    return "Yes";
                } else {
                    return null;
                }
            };

            vm.getDealReport = function() {
                vm.loading = true;
                deal.getDealsForReport(vm.filters).success(function (result) {
                    vm.reportData = result;
                    vm.reportData.totalValue = Math.round(vm.reportData.totalValue);
                    vm.reportData.totalExpectedValue = Math.round(vm.reportData.totalExpectedValue);
                    vm.reportData.totalSetup = Math.round(vm.reportData.totalSetup);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                vm.getDealReport();
            }

            init();
        }
    ]);
