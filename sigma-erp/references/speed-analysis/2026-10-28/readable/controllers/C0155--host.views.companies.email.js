// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:61297-61324
appModule.controller('host.views.companies.email',
        [
            '$scope', 'Companies', '$uibModalInstance', 'abp.services.app.companyHost',
            function ($scope, companies, $uibModalInstance, companyHostService) {
                var vm = this;

                vm.email = null;
                vm.email = {
                    companies: companies
                };


                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.sendEmail = function () {
                    var emailText = $("#htmlText").code();
                    vm.email.emailText = emailText;
                    companyHostService.sendEmail(vm.email).success(function (result) {
                        abp.notify.info(app.localize('SuccessfullyEmailTransfered'));
                    }).finally(function () {
                        $uibModalInstance.dismiss();
                    });
                    debugger;
                }
            }
        ]);
