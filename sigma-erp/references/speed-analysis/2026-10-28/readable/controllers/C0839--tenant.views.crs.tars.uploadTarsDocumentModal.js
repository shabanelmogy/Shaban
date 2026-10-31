// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225221-225268
appModule.controller('tenant.views.crs.tars.uploadTarsDocumentModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'FileUploader',
        function ($scope, $uibModal, $uibModalInstance, fileUploader) {

            var vm = this;
            vm.loading = false;

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadDocumentWithGuid',
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    $uibModalInstance.close(response.result);

                } else {
                    abp.message.error("Error occured during processing or kindly check the size of file");
                }
            };

        }]);
