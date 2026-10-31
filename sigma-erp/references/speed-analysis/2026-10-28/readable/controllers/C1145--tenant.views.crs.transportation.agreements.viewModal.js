// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300167-300225
appModule.controller('tenant.views.crs.transportation.agreements.viewModal', [
        '$scope','$uibModalInstance','agreementId','abp.services.app.transAgreement',
        function ($scope, $uibModalInstance,agreementId, transAgreementService) {
            var vm = this;
            vm.loading = false;

            vm.localizeWeekDays = function (weekDay) {
                //if (!weekDay) return '';
                if (weekDay == 0) return app.localize('Sunday');
                else if (weekDay == 1) return app.localize('Monday');
                else if (weekDay == 2) return app.localize('Tuesday');
                else if (weekDay == 3) return app.localize('Wednesday');
                else if (weekDay == 4) return app.localize('Thursday');
                else if (weekDay == 5) return app.localize('Friday');
                else if (weekDay == 6) return app.localize('Saturday');

            }

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                }
                else {
                    return "";
                }
            };

            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                transAgreementService.getTransAgreementForEdit({ id: agreementId }).success(function (data) {
                    vm.transAgreement = data;
                }).finally(function () {
                    vm.loading = false;
                });

            }

            init();
        }
    ]);
