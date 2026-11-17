// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:156436-156545
appModule.controller('tenant.views.crs.agreementsDashboard2.parkingDetailModal', ['$scope', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.parkingTicket',
        function ($scope, $stateParams, commonAgreementService, $stateParams, commonLookupService, utilities, parkingService) {

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

            

            //vm.ignoreparking = function (parking) {
            //    abp.message.okConfirm(
            //        app.localize('IgnoreparkingMessage'), app.localize('PressOkToIgnoreParking'),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                vm.loading = true;

            //                parkingervice.ignoreparking({
            //                    id: parking.id
            //                }).success(function (result) {
            //                    parking.included = false;
            //                    parking.ignored = true;
            //                    $uibModalInstance.close();
            //                }).finally(function () {
            //                    vm.loading = false;
            //                });
            //            }
            //        }
            //    );
            //};


            function showParking() {
                if (vm.filters.agreementId == null) {
                    vm.loading = true;
                    var parkingCopy = [];
                    for (var k = 0; k < parking.length; k++) {

                        var parkingDateTime = moment(parking[k].parkingDateTime);

                        if (parkingDateTime <= dateTimeIn && parking[k].ignored == false) {
                            parkingCopy.push(parking[k]);
                        }
                    }
                    vm.parking = parkingCopy;

                    vm.loading = false;

                } else {
                    vm.loading = true;

                    parkingService.getParkingByAgreementId({
                        agreementId: vm.filters.agreementId, downloadPendingParking: false
                    }).success(function (result) {
                        vm.parking = result.parkingTicket;
                        vm.count = result.count;
                        vm.amount = result.amount;
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
                        showParking();
                    }).finally(function (data) {
                       
                    });
                }
                else {
                    showParking();
                }

            }

            init();
        }
    ]);
