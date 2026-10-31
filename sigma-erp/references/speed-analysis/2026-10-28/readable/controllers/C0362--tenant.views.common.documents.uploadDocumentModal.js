// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:94650-94752
appModule.controller('tenant.views.common.documents.uploadDocumentModal', [
        '$uibModalInstance', 'FileUploader', 'options',
        function ($uibModalInstance, fileUploader, options) {

            var vm = this;
            vm.loading = false;
            vm.uploadedFileName = null;
            vm.uploadedFileUrl = null;

            function guid() {
                function _p8(s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                }
                return _p8() + _p8(true) + _p8(true) + _p8();
            }

            var uid = '';
            vm.uploadHeader = function () {
                if (!options)
                    return app.localize("Document");

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


            vm.url = abp.appPath + 'Document/uploadImageWithoutGuid';
            vm.uploader = new fileUploader({
                url: vm.url,
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        //if ('|jpg|jpeg|png|pdf|doc|docx|ppt|pptx'.indexOf(type) === -1) {
                        //    abp.message.warn(app.localize('Unsuppored_Document_Type'));
                        //    return false;
                        //}

                        //if ('|jpg|jpeg|png'.indexOf(type) > -1) {
                        //    //  url = abp.appPath + 'Document/uploadImageWithoutGuid';
                        //}
                        //else {
                        //    vm.url = abp.appPath + 'Document/uploadDocument/' + guid();
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

            vm.uploader.onBeforeUploadItem = function (item) {
                if (['jpg', 'jpeg', 'png'].indexOf(item.file.type) === -1) {
                    uid = guid();
                    item.url = abp.appPath + 'Document/uploadDocument/' + uid;
                }
                else { uid = ''; }
            };


            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.loading = true;
                if (response.success) {
                    vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;
                    vm.loading = false;
                    $uibModalInstance.close({
                        guid: response.result.fileNameWithoutExtension ? response.result.fileNameWithoutExtension : uid,
                        name: response.result.fileName,
                        url: response.result.url,
                        urlWithToken: response.result.url + response.result.token
                    });

                } else {
                    abp.message.error(response.error.message);
                }

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
