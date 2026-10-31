// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:58805-58867
appModule.controller('host.views.cloud.db.createOrEditDBModal', [
        '$scope', '$uibModal', '$uibModalInstance',  'dbId', 'abp.services.app.businessDivision', 'abp.services.app.cloud',
        function ($scope, $uibModal, $uibModalInstance,  dbId, businessDivisionService, cloudService) {

            var vm = this;
            vm.loading = false;
            vm.dbId = dbId;
            vm.db = {
                maxTenants: 0,
                isDefaultHostDb:false
            };
            vm.save = function () {
                debugger
                vm.saving = true;
                cloudService.createOrUpdateDB(vm.db).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getDBServers = function () {
                vm.loading = true;
                cloudService.getDBServers().success(function (data) {
                    vm.dbServers = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.setMaxTenants = function () {
                if (vm.db.isHostDb)
                    vm.db.maxTenants = 0;
                else
                    vm.db.isDefaultHostDb = false;
            }
            function init() {
                
                if (dbId != null) {
                    
                    cloudService.getDBForEdit(dbId).then(function (data) {
                        vm.db = data.data;
                    });
                }
            }
            
            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getbusinessDivisions();
            vm.getDBServers();
            init();
        }
    ]);
