// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:293818-293899
appModule.controller('tenant.views.crs.staff.printDocumenetModel', [
        '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.staff', 'staffId', '$uibModal', 'appSession',
        function ($uibModalInstance, countryService, staffService, staffId, $uibModal, appSession) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.isEditMod = false;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.openPrintModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/staff/printDocumenetModel.cshtml',
                    controller: 'tenant.views.crs.staff.printDocumenetModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        staffId: function () {
                            return staffId;
                        }
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.documentToPrint = null;

            vm.getIdentificationDocumentType = function (id) {

                if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 6)
                    return app.localize('StaffDocument1');
                else if (id == 7)
                    return app.localize('HealthCard');
                else
                    return "";
            };

            function init() {
                vm.loading = true;
                staffService.getStaffForEdit({
                    id: staffId
                }).success(function (result) {
                    vm.staff = result;
                    if (vm.staff.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }

                    //add gallary images list with each document
                    for (var i = 0; i < vm.staff.identityDocuments.length; i++) {
                        if (vm.staff.identityDocuments[i].images == null)
                            vm.staff.identityDocuments[i].images = [];

                        var gallaryImages = [];
                        for (var j = 0; j < vm.staff.identityDocuments[i].images.length; j++) {
                            var img = vm.staff.identityDocuments[i].images[j];

                            var imageDetail = imageGalleryObject();
                            imageDetail.thumb = img.url;
                            imageDetail.img = img.url;
                            imageDetail.description = vm.getIdentificationDocumentType(vm.staff.identityDocuments[i].identityDocumentType);
                            gallaryImages.push(imageDetail);
                        }
                        vm.staff.identityDocuments[i].gallaryImages = gallaryImages;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
