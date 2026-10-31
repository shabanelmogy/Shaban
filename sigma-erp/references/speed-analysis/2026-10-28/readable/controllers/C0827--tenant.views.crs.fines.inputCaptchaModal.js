// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223398-223421
appModule.controller('tenant.views.crs.fines.inputCaptchaModal', [
        '$scope', '$filter', '$uibModalInstance', 'abp.services.app.person', 'trafficFile', 'captcha',
        function ($scope, $filter, $uibModalInstance, personService, trafficFile, captcha) {

            var vm = this;

            captcha.captchaCode = "";

            vm.captcha = captcha;
            vm.trafficFile = trafficFile;

            vm.ok = function () {

                $uibModalInstance.close({
                    trafficFile: trafficFile,
                    captcha: vm.captcha
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
