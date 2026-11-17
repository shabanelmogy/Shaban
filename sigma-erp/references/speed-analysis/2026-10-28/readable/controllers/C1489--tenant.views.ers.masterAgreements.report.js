// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:406760-406832
appModule.controller('tenant.views.ers.masterAgreements.report', ['$scope', 'abp.services.app.masterAgreement', '$stateParams', 'abp.services.app.commonLookup',
        function ($scope, masterAgreementService, $stateParams, lookupService) {

            var vm = this;
            //vm.reportData = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            if (vm.filters.agreementNo) {
                vm.filters.quotationNo = null;
                vm.filters.customerId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            else if (vm.filters.quotationNo) {
                vm.filters.agreementNo = null;
                vm.filters.customerId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getAgreementType = function (id) {
                if (id == 1)
                    return "Daily"
                if (id == 2)
                    return "Weekly"
                if (id == 3)
                    return "Monthly"
                if (id == 4)
                    return "Lease"
                if (id == 5)
                    return "LeaseToOwn"
            }


            function init() {

                vm.loading = true;

                lookupService.getLocations()
                    .success(r => {
                        vm.locations = r.items;
                    });

                masterAgreementService.getReport(vm.filters).success(function (data) {
                vm.reportData = data;
                 //   alert(JSON.stringify(vm.reportData));

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
