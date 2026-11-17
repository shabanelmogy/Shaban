// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:297817-298010
appModule.controller('tenant.views.crs.tariffGroups.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.tariffGroup', 'tariffGroupId', 'FileUploader',
        function ($scope, $uibModalInstance, tariffGroupService, tariffGroupId, fileUploader) {

            var vm = this;
            vm.saving = false;
            vm.tariffGroup = null;
            vm.isEditMod = false;
            vm.AcrissCategoryTypes = null;
            vm.AcrissTypes = null;
            vm.AcrissTransDriveTypes = null;
            vm.AcrissFuelAcTypes = null;
            vm.uploadedFileName = null;

            //  Displaying Image Code

            vm.displayImage =
                {
                    documentType: '',
                    name: '',
                    url: ''
                };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploader = new fileUploader({
                url: '', //initiazlie url later once tariff group object is retrieved
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.loading = true;

                if (response.success) {

                    vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;

                    tariffGroupService.getImageForShow({ url: vm.uploadedFileUrl }).success(function (data) {
                        vm.displayImageWithToken = data;
                        vm.loading = false;
                    });

                } else {
                    abp.message.error(response.error.message);
                }

            };



            vm.save = function () {


                vm.saving = true;
                // Uploading Image Portion Start 

                if ((!angular.isUndefined(vm.uploadedFileUrl) && vm.uploadedFileUrl != null) && (!angular.isUndefined(vm.uploadedFileName) && vm.uploadedFileName != null)) {
                    vm.displayImage.documentType = 5;
                    vm.displayImage.name = vm.uploadedFileName;

                    vm.displayImage.url = vm.uploadedFileUrl;

                    vm.tariffGroup.displayImage = vm.displayImage;
                }

                //End

                tariffGroupService.createOrUpdateTariffGroup({
                    tariffGroup: vm.tariffGroup
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

            function getAcrissCategoryTypes() {
                vm.loading = true;
                tariffGroupService.getAcrissCategoryTypes({}).success(function (data) {
                    vm.AcrissCategoryTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAcrissTypes() {

                vm.loading = true;
                tariffGroupService.getAcrissTypes({}).success(function (data) {
                    vm.AcrissTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAcrissTransDriveTypes() {
                vm.loading = true;
                tariffGroupService.getAcrissTransDriveTypes({}).success(function (data) {
                    vm.AcrissTransDriveTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function getAcrissFuelAcTypes() {

                vm.loading = true;
                tariffGroupService.getAcrissFuelAcTypes({}).success(function (data) {

                    vm.AcrissFuelAcTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                getAcrissCategoryTypes();
                getAcrissTypes();
                getAcrissFuelAcTypes();
                getAcrissTransDriveTypes();

                tariffGroupService.getTariffGroupForEdit({
                    id: tariffGroupId
                }).success(function (result) {
                    vm.tariffGroup = result;
                    vm.uploader.url = abp.appPath + 'Document/UploadImage/' + vm.tariffGroup.displayImage.guid + '.jpg';

                    if (vm.tariffGroup.id > 0) {
                        vm.isEditMod = true;

                        if (vm.tariffGroup.displayImage.url != null || vm.tariffGroup.displayImage.url != '') {
                            tariffGroupService.getImageForShow({ url: vm.tariffGroup.displayImage.url }).success(function (data) {
                                vm.displayImageWithToken = data;
                            });
                        }
                    } else {
                        vm.tariffGroup.acrissCategoryId = null;
                        vm.isEditMod = false;
                    }
                });

            }


            // Code For Uploading  Documents //

            //vm.save2 = function ()
            //{
            //    
            //    if (!vm.uploadedFileName) {
            //        return;
            //    }

            //    movementService.addDocument({
            //        movementId: movementId,
            //        document: {
            //            documentType: 5,    // 5 = supporting documents
            //            guid: '',
            //            name: vm.uploadedFileName,
            //            url: vm.uploadedFileUrl
            //        }
            //    }).success(function () {
            //        $uibModalInstance.close();
            //    });
            //};



            init();
        }
    ]);
