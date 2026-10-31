// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:157008-157100
appModule.controller('tenant.views.crs.agreementsDashboard2.tollsDetailModal', ['$scope', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.toll',
        function ($scope, $stateParams, commonAgreementService, $stateParams, commonLookupService, utilities, tollService) {
            /*
            *if agreement is being closed then tolls and dateTimeIn will be passed
            *if agreement is closed already and tolls are supposed to be viewed through agreement view screen then only agreementId will be passed and tolls be taken from server
            */

            var vm = this;
            vm.filters = null;
            vm.loading = false;
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            vm.agreementId = vm.filters.agreementId;
            vm.agreement = null;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            function showTolls() {
                if (vm.filters.agreementId == null) {
                    vm.loading = true;

                    var tollsCopy = [];
                    for (var k = 0; k < tolls.length; k++) {
                        if (moment(tolls[k].tripDateTime, 'YYYY-MM-DD HH:mm:ss') <= dateTimeIn) {
                            tollsCopy.push(tolls[k]);
                        }
                    }
                    vm.tolls = tollsCopy;

                    vm.loading = false;

                } else {
                    vm.loading = true;

                    tollService.getTollsByAgreementId({
                        agreementId: vm.filters.agreementId, downloadPendingTolls: false, server: 1, showAllForClosed: true
                    }).success(function (result) {
                        vm.tolls = result.tolls;
                        vm.count = result.count;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {

                if (vm.filters.agreementId) {
                    commonAgreementService.getAgreement({ id: vm.filters.agreementId, isMobile: false }).success(function (result) {
                        vm.agreement = result;
                        showTolls();
                    }).finally(function (data) {

                    });
                }
                else {
                    showTolls();
                }
            }

            init();
        }
    ]);
