// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:30297-30383
appModule.controller('host.views.carRental.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.carRental', 'companyId', '$uibModal', '$http',
        function ($scope, $uibModalInstance, carRentalService, companyId, $uibModal, $http) {
            var vm = this;
            vm.saving = false;
            vm.company = { isFeatured: false };
            vm.documents = [];
            vm.selectedImage = null;
            vm.selectedCoverPic = null;
            vm.title = "Create Company";
            vm.handleFileChange = function (element) {
                vm.company.profilePic = element.files[0];
            };
            vm.handleFileChangeCover = function (element) {
                vm.company.coverPic = element.files[0];
            };
            vm.save = function () {
                vm.saving = true;
                if (companyId != null) {
                    var formData = new FormData();
                    formData.append('_id', companyId);
                    formData.append('companyName', vm.company.name);
                    formData.append('tagline', vm.company.tagline);
                    formData.append('phoneNumber', vm.company.phone);
                    formData.append('email', vm.company.email);
                    formData.append('address', vm.company.address);
                    formData.append('isFeatured', vm.company.isFeatured);
                    formData.append('selectedProfilePic', vm.company.profilePic);
                    formData.append('selectedCoverPic', vm.company.coverPic);

                    $http.post('CarRental/CreateOrEdit', formData, {
                        headers: { 'Content-Type': undefined }
                    })
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                }
                else {
                    var formData = new FormData();
                    formData.append('_id', "");
                    formData.append('companyName', vm.company.name);
                    formData.append('tagline', vm.company.tagline);
                    formData.append('phoneNumber', vm.company.phone);
                    formData.append('email', vm.company.email);
                    formData.append('address', vm.company.address);
                    formData.append('isFeatured', vm.company.isFeatured);
                    formData.append('selectedProfilePic', vm.company.profilePic);
                    formData.append('selectedCoverPic', vm.company.coverPic);

                    $http.post('CarRental/CreateOrEdit', formData, {
                        headers: { 'Content-Type': undefined }
                    })
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
                //vm.loading = true;

                if (companyId != null) {
                    carRentalService.getCompanyForEdit(companyId).then(function (data) {
                        let datas = data.data;
                        vm.company = datas;
                        //vm.company = datas.find(x => x._id === companyId);
                        vm.title = vm.company.name;
                        vm.company.isFeatured = vm.company.isFeatured;
                        //vm.loading = false;
                    });
                }
                else {
                }
            }
            init();
        }
    ]);
