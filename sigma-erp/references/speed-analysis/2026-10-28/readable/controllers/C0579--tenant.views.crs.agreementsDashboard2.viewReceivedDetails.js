// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:158937-159036
appModule.controller('tenant.views.crs.agreementsDashboard2.viewReceivedDetails', ['$scope', '$stateParams', 'abp.services.app.commonAgreement',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, commonAgreementService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.oneReceiptOnMultipleAgreement = abp.features.isEnabled("CRS.CustomFeatures.OneReceiptOnMultipleAgreement");
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            vm.getType = function (type) {
                if (type == 2) {
                    return app.localize("Receipt");
                } else if (type == 3) {
                    return app.localize("Payment");
                } else if (type == 7) {
                    return app.localize("OpeningBalance");
                } else {
                    return "";
                }

            };
            var vm = this;
            vm.saving = false;
            vm.total = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.agreementDetail = vm.filters.agreementForReceviced;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getType = function (type) {
                if (type == 2) {
                    return app.localize("Receipt");
                } else if (type == 3) {
                    return app.localize("Payment");
                } else if (type == 7) {
                    return app.localize("OpeningBalance");
                } else if (type == 20) {
                    return app.localize("UsedDeposit");
                } else {
                    return "";
                }

            };


            function init() {
                vm.loading = true;
                commonAgreementService.getReceiptsByAgreementId({
                    id: vm.filters.agreementForReceviced.id

                }).success(function (result) {
                    vm.loading = false;
                    vm.receipts = result.items;

                    angular.forEach(vm.receipts, function (receipt) {
                        //if (receipt.type == 2 || receipt.type == 7)
                        //{
                        //    vm.total = vm.total + receipt.amount;
                        //}
                        //if (receipt.type == 3) {
                        //    vm.total = vm.total - receipt.amount;

                        //}
                        if (receipt.status != 5)
                            vm.total = vm.total + receipt.amountOnAgreement;
                        
                    });


                });
            }

            init();
        }]);
