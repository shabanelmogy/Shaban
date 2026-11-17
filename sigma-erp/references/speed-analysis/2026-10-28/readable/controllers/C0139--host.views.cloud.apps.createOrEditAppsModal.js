// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:58594-58648
appModule.controller('host.views.cloud.apps.createOrEditAppsModal', [
        '$scope', '$uibModal', '$uibModalInstance','appId', 'abp.services.app.cloud',
        function ($scope, $uibModal, $uibModalInstance, appId, cloudService) {

            var vm = this;
            vm.loading = false;
            vm.appId = appId;
            
            vm.setHostDB = function () {
                if (vm.app.hosting == 2)
                    vm.app.hostDbId = null;
            }

            vm.getHostDB = function () {
                vm.loading = true;
                cloudService.gethostDB().success(function (data) {
                    vm.hostDB = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.hostingTypes = [
                { id: 1, name: "Speed Cloud" },
                { id: 2, name: "External Cloud" },
            ];

            vm.save = function () {
                debugger
                vm.saving = true;
                cloudService.createOrUpdateApp(vm.app).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {
                
                if (appId != null) {
                    
                    cloudService.getAppForEdit(appId).then(function (data) {
                        vm.app = data.data;
                    });
                }
            }
           
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getHostDB();
            init();
        }
    ]);
