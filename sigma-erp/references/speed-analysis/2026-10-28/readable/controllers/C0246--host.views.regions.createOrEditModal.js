// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76053-76099
appModule.controller('host.views.regions.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.regions', 'regionId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, regionsAppService, regionId, $uibModal, $http) {
            var vm = this;
            vm.title = "Create Region";
            vm.region;
            vm.save = function () {
                debugger;
                vm.saving = true;
                if (regionId != null) {
                    regionsAppService.createOrUpdateRegion({ Id: regionId, Name: vm.region.name, Countries: vm.region.countries, SalesStaff: vm.region.salesStaff })
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                } else {
                    regionsAppService.createOrUpdateRegion({ Name: vm.region.name, Countries: vm.region.countries, SalesStaff: vm.region.salesStaff, })
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function init() {
                if (regionId != null) {
                    vm.isEditMod = false;
                    vm.title = "Update Region"
                    regionsAppService.getRegionForEdit(regionId).then(function (data) {
                        let allData = data.data;
                        vm.region = allData;
                    });
                }
                else {
                }
            }
            init();
        }
    ]);
