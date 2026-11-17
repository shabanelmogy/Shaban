// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272319-272392
appModule.controller('tenant.views.crs.reports.finesReport.viewFine', [
        '$scope','utilities', '$uibModal', '$uibModalInstance', 'finesId', 'FileUploader', 'abp.services.app.uaeFine',
        function ($scope, utilities ,$uibModal, $uibModalInstance, finesId, fileUploader, uaeFineService) {
            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isEnableUploadFineImage = abp.features.isEnabled("CRS.CustomFeatures.DocumentForFine");
            vm.hasPermissionUploadFineImage = abp.auth.hasPermission('Pages.Tenant.TrafficFines.UploadFineImage');
            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.lateChargesSetting = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReDownloadLateChargesAbuDhabiFines"));

            vm.openUploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                    vm.fineImage = {
                        guid: result.guid,
                        url: result.urlWithToken,
                        path: ''
                    };
                    //to Do update fine with url = > Fine Image
                    uaeFineService.updateFineImage({ fineId: vm.fine.id, document: vm.fineImage })
                        .then(function () {

                        });


                });
            };


            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.getFine = function () {
                uaeFineService.getFineById(finesId).success(function (result) {
                    vm.fine = result;
                    vm.fine.downloadDateTime = vm.getlocalDateTime(vm.fine.downloadDateTime);
                    vm.fine.fineDateTime = vm.getlocalDateTime(vm.fine.fineDateTime);
                    vm.fine.geoLocation = vm.fine.latitude ? `${vm.fine.latitude},${vm.fine.longitude}` : '';
                    if (vm.fine.fineImageId != null) {
                        uaeFineService.getFineImage(vm.fine.fineImageId).success(function (fineImage) {
                            vm.fineImage = fineImage;
                        });
                    }
                });
            }

            vm.getFine();

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
