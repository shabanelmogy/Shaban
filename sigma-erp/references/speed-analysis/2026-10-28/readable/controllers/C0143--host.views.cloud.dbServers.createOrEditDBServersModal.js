// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:59041-59075
appModule.controller('host.views.cloud.dbServers.createOrEditDBServersModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.cloud','id',
        function ($scope, $uibModal, $uibModalInstance,cloudService, id) {

            var vm = this;
            vm.loading = false;
            vm.dbServerId = id;
            
            vm.save = function () {
                debugger
                vm.saving = true;
                cloudService.createOrUpdateDBServer(vm.dbServer).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                
                if (id != null) {
                    
                    cloudService.getDBServerForEdit(id).then(function (data) {
                        vm.dbServer = data.data;
                        
                    });
                }
            }
           
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            init();
        }
    ]);
