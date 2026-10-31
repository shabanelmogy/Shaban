// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:153631-153739
appModule.controller('tenant.views.crs.agreementsDashboard2.finesDetailModal', ['$scope', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.uaeFine',
        function ($scope, $stateParams, commonAgreementService, $stateParams, commonLookupService, utilities, fineService) {

            var vm = this;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            vm.loading = false;
            vm.agreementId = vm.filters.agreementId;
            vm.agreement = null;
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

            

            vm.ignoreFine = function (fine) {
                abp.message.okConfirm(
                    app.localize('IgnoreFineMessage'), app.localize('PressOkToIgnoreFine'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;

                            fineService.ignoreFine({
                                id: fine.id
                            }).success(function (result) {
                                fine.included = false;
                                fine.ignored = true;
                                $uibModalInstance.close();
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };


            function showFines() {
                if (vm.filters.agreementId == null) {
                    vm.loading = true;
                    var finesCopy = [];
                    for (var k = 0; k < fines.length; k++) {

                        var fineDateTime = moment(fines[k].fineDateTime);

                        if (fineDateTime <= dateTimeIn && fines[k].ignored == false) {
                            finesCopy.push(fines[k]);
                        }
                    }
                    vm.fines = finesCopy;

                    vm.loading = false;

                } else {
                    vm.loading = true;

                    fineService.getFinesByAgreementId({
                        agreementId: vm.filters.agreementId, downloadPendingfines: false
                    }).success(function (result) {
                        vm.fines = result.fines;
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
                        showFines();
                    }).finally(function (data) {
                       
                    });
                }
                else {
                    showFines();
                }

            }

            init();
        }
    ]);
