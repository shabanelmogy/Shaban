// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:254118-254184
appModule.controller('tenant.views.crs.limousine.trips.uploadDocumentsModal', [
        '$scope', 'appSession', '$uibModalInstance', 'FileUploader',
        function ($scope, appSession, $uibModalInstance, fileUploader) {

            var vm = this;
            vm.loading = false;
            vm.uploadedFileName = null;
            vm.uploadedFileUrl = null;

            vm.uploadHeader = function () {
                return app.localize("Document")
            };

            function guid() {
                function _p8(s) {
                    var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
                }
                return _p8() + _p8(true) + _p8(true) + _p8();
            }
            var getGUID = guid();
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadDocument/' + getGUID,
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

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.loading = true;
                if (response.success) {
                    vm.uploadedFileName = response.result.fileName;
                    vm.uploadedFileUrl = response.result.url;
                    vm.loading = false;
                    $uibModalInstance.close({ guid: getGUID, name: response.result.fileName, url: response.result.url, urlWithToken: response.result.url + response.result.token });

                } else {
                    abp.message.error(response.error.message);
                }

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
