// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:105312-105391
appModule.controller('tenant.views.common.settings.createOrEditTrafficFileModal', ['$scope', '$uibModalInstance', 'trafficFile', 'abp.services.app.trafficFile', function ($scope, $uibModalInstance,
        trafficFile, trafficFileService) {
        var vm = this;
        vm.ViewOnly = trafficFile.showModeTraffic;
        vm.states = [];

        isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
        isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
        isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar"); 
        isOmanFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Oman"); 

        isFMSEnabled = abp.features.isEnabled("TFMS");
        isFMS_DxbFinesModuleEnabled = abp.features.isEnabled("TFMS.Fines.DubaiPolice");
        isFMS_AuhFinesModuleEnabled = abp.features.isEnabled("TFMS.Fines.AbuDhabiPolice");
        isFMS_QtrFinesModuleEnabled = abp.features.isEnabled("TFMS.Fines.Qatar");
        isFMS_OmanFinesModuleEnabled = abp.features.isEnabled("TFMS.Fines.Oman");

        vm.enabledCompanyCodeFine = abp.setting.getBoolean("App.General.Fine.EnableCompanyCode");

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        vm.save = function () {

            vm.saving = true;

            //Rta downlading is enabled for Dubai.
            if (vm.trafficFile.state == "Abu Dhabi" || vm.trafficFile.state == "Qatar" || vm.trafficFile.state == "Oman") {
                vm.trafficFile.rtaPassword = null;
                vm.trafficFile.rtaUsername = null;
            }
            trafficFileService.createOrUpdateTrafficFile({
                trafficFile: vm.trafficFile
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        };

        vm.userNameOrPasswordHideOrShow = function () {

            if (vm.trafficFile.state === "Dubai")
                vm.show = true;
            else if (vm.trafficFile.state === "Abu Dhabi" || vm.trafficFile.state === "Qatar" || vm.trafficFile.state == "Oman")
                vm.show = false;
        };

        function init() {

            trafficFileService.getTrafficFileForEdit({
                id: trafficFile.id
            }).success(function (result) {

                vm.trafficFile = result;
                vm.userNameOrPasswordHideOrShow();

                //Add state according to enabled feature : added by arslan for Qatar fines 
                if (isAuhFinesModuleEnabled || isFMS_AuhFinesModuleEnabled)
                    vm.states.push({ id: 1, name: 'Abu Dhabi' });
                if (isDxbFinesModuleEnabled || isFMS_DxbFinesModuleEnabled)
                    vm.states.push({ id: 2, name: 'Dubai' });
                if (isQtrFinesModuleEnabled || isFMS_QtrFinesModuleEnabled)
                    vm.states.push({ id: 3, name: 'Qatar' });
                if (isQtrFinesModuleEnabled || isFMS_OmanFinesModuleEnabled)
                    vm.states.push({ id: 4, name: 'Oman' });

                if (vm.trafficFile.id > 0) {
                    vm.isEditMod = true;

                } else {
                    vm.trafficFile.fileId = null;
                    vm.isEditMod = false;
                }
            });
        }
        init();
    }]);
