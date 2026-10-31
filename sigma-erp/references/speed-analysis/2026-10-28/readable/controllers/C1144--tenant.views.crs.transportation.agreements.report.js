// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300098-300163
appModule.controller('tenant.views.crs.transportation.agreements.report', ['$scope', '$stateParams', 'abp.services.app.transAgreement',
        function ($scope, $stateParams, transAgreementService) {

            var vm = this;

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            if (vm.filters.agreementNo) {
                vm.filters.plateNo = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.customerId = null;
                vm.filters.customer = null;
                vm.filters.driver = null;
                vm.filters.driverId = null;
                vm.filters.status = null;
            }
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStatuses = function () {
                if (!vm.filters.status) return '';
                if (vm.filters.status == 1)
                    return app.localize("Open");
                else if (vm.filters.status == 2)
                    return app.localize("Closed");
            };

            vm.getlocalizedString = function (agreementStatus) {
                if (agreementStatus == 1)
                    return app.localize("Open");
                if (agreementStatus == 2)
                    return app.localize("Closed");
            };

            function init() {
                vm.loading = true;
                transAgreementService.getTransAgreementsReport(vm.filters).success(function (data) {
                    vm.agreementReportData = data.items;
                    angular.forEach(vm.agreementReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }]);
