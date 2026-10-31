// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94755-94825
appModule.controller('tenant.views.common.documents.uploadImageModal', [
        '$uibModalInstance', 'FileUploader', 'options',
        function ($uibModalInstance, fileUploader, options) {

            var vm = this;
            vm.loading = false;
            vm.uploadedFileName = null;
            vm.uploadedFileUrl = null;

            vm.uploadHeader = function () {
                if (!options)
                    return app.localize("Document");;

                if (!options.identityDocument)
                    return "";
                if (options.identityDocument.identityDocumentType == 2)
                    return app.localize("Passport");
                if (options.identityDocument.identityDocumentType == 3)
                    return app.localize("NationalId");
                if (options.identityDocument.identityDocumentType == 4)
                    return app.localize("DrivingLicense");

                return "";
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/uploadImageWithoutGuid',
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
                    vm.loading = false;
                    $uibModalInstance.close({ guid: response.result.fileNameWithoutExtension, url: response.result.url, urlWithToken: response.result.url + response.result.token });

                } else {
                    abp.message.error(response.error.message);
                }

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
