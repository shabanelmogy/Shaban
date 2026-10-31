// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:149808-149890
appModule.controller('tenant.views.crs.agreements.uploadAgreementDocumentModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'FileUploader', 'abp.services.app.agreement', 'agreementId', 'agreementDocument', 'abp.services.app.agreement',
        function ($scope, $uibModal, $uibModalInstance, fileUploader, agreementService, agreementId, agreementDocument, agreementService) {

            var vm = this;
            vm.loading = false;
            vm.uploadedFileName = null;
            vm.uploadedFileUrl = null;
            vm.enableSave = false;
            vm.agreementDocs = agreementDocument;
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadDocument/' + agreementId,
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        //if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                        //    abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                        //    return false;
                        //}

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

            vm.save = function () {

                if (!vm.uploadedFileName && !vm.uploadedFileUrl) {
                    return;
                } else {
                    saveAgreementDocument();
                    
                }

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function saveAgreementDocument() {

                vm.saving = true;
                agreementDocument.url = vm.uploadedFileUrl;
                agreementService.saveAgreementDocument(agreementDocument).success(function (result) {
                    vm.saving = false;
                    agreementDocument.id = result.id;
                    agreementDocument.urlWithToken = result.urlWithToken;
                    $uibModalInstance.close(agreementDocument);
                }).finally(function () {
                    vm.saving = false;
                });


            };

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    //vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;
                    vm.enableSave = true;
                   


                } else {
                    abp.message.error(response.error.message);
                    vm.enableSave = false;
                }
            };

        }]);
