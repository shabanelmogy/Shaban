// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:135504-135542
appModule.controller('tenant.views.crs.agreements.agreementLogsModal', ['agreementId', 'abp.services.app.commonAgreement', '$uibModalInstance', 'agreementNo', 'utilities',
        function (agreementId, commonAgreementService, $uibModalInstance, agreementNo, utilities) {

            var vm = this;
            vm.loading = false;
            vm.agreementNo = agreementNo;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));
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
                    debugger
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
