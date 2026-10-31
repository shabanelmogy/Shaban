// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:449905-449978
appModule.controller('tenant.views.movements.uploadDocument', [
        '$scope', 'appSession', '$uibModalInstance', 'FileUploader', 'abp.services.app.movement', 'movementId',
        function ($scope, appSession, $uibModalInstance, fileUploader, movementService, movementId) {

            var vm = this;
            vm.loading = false;
            vm.uploadedFileName = null;
            vm.uploadedFileUrl = null;

            


            vm.uploader = new fileUploader({
                
            
                url: abp.appPath + 'Document/UploadDocument/' + movementId,
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
                if (!vm.uploadedFileName) {
                    return;
                }

                movementService.addDocument({
                    movementId: movementId,
                    document: {
                        documentType: 5,    // 5 = supporting documents
                        guid: '',
                        name: vm.uploadedFileName,
                        url: vm.uploadedFileUrl
                    }
                }).success(function () {
                    $uibModalInstance.close();
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (response.success) {
                    vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;
                   
                } else {
                    abp.message.error(response.error.message);
                }
            };
        }
    ]);
