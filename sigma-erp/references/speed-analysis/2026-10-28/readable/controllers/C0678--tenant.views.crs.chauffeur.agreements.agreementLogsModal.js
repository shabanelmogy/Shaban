// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:175366-175402
appModule.controller('tenant.views.crs.chauffeur.agreements.agreementLogsModal', ['agreementId', '$uibModalInstance', 'agreementNo', 'abp.services.app.commonAgreement',
        function (agreementId, $uibModalInstance, agreementNo, commonAgreementService) {

            var vm = this;
            vm.loading = false;
            vm.agreementNo = agreementNo;

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

            vm.cancel = function () {
                $uibModalInstance.close();
            }

            function init() {
                vm.loading = true;
                commonAgreementService.getAgreementLogs({
                    id: agreementId
                }).success(function (result) {
                    vm.agreementLogs = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
