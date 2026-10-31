// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312203-312245
appModule.controller('tenant.views.crs.vehicles.printDocumentModel', [
        '$scope', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.registrationState', 'abp.services.app.vehicleModel', 'abp.services.app.location',
        '$q', 'vehicleId', 'abp.services.app.commonLookup', 'utilities', 'appSession',
        function ($scope, $uibModalInstance, $uibModal, uiGridConstants, vehicleService, stateService, vehicleModelService, locationService, $q, vehicleId, lookupService, utilities, appSession) {
            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.documentImages = [];
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            function init() {
                vm.loading = true;
                vehicleService.getVehicleForEdit({
                    id: vehicleId
                }).success(function (result) {
                    vm.vehicle = result;
                    //load document images gallery
                    vm.documentImages = [];
                    for (var i = 0; i < vm.vehicle.documentImages.length; i++) {
                        var img = vm.vehicle.documentImages[i];
                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.imageURL;
                        imageDetail.img = img.imageURL;
                        imageDetail.description = '';
                        vm.documentImages.push(imageDetail);
                    }
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
