// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50318-50352
appModule.controller('host.views.cbs.sLAs.viewModal', [
        '$uibModalInstance', 'slaId', 'abp.services.app.sLA',
        function ($uibModalInstance, slaId, slaService) {
            var vm = this;


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getSlaTypeName = function (id) {
                if (id == 1)
                    return "Implementation";
                else if (id == 2)
                    return "Post Go-Live";
                else if (id == 3)
                    return "Live";
                else
                    return "";
            }
            
            function init() {
                vm.loading = true;
                slaService.getSLAForView({
                    id: slaId
                }).success(function (result) {
                    vm.sla = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
