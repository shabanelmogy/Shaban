// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:306731-306870
appModule.controller('tenant.views.crs.vehicles.changeStatus', [
        '$scope', '$uibModalInstance', 'abp.services.app.vehicle', 'vehicleId', 'utilities', 'abp.services.app.directory', '$uibModal', 'abp.services.app.checkList', '$filter', 'abp.services.app.commonLookup',
        function ($scope, $uibModalInstance, vehicleService, vehicleId, utilities, directoryService, $uibModal, checkListService, $filter, commonLookupService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.vehicleSubstatusArray = utilities.getVehicleSubStatusesArray();
            vm.documentImages = [];
            vm.documents = [];
            vm.checklist = [];
            vm.notReadyReasons = [];
            vm.notReadyReason = null;
            var InCheckList = [];
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getCheckedItems = function () {
                return $filter('filter')(vm.checklist, {
                    checked: true
                }, true).length;
            };
            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            var getNotReadyReasons = function () {
                commonLookupService.getNotReadyReasons().success(function (data) {
                    vm.notReadyReasons = data;
                })
            };

            // Select Check List
            vm.openSelectCheckListModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/selectCheckList.cshtml',
                    controller: 'tenant.views.crs.vehicles.selectCheckList as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                checkList: vm.checklist
                            };
                        }
                    }
                });


            };

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
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: '',
                        name: result.guid,
                        documentType: 5
                    };
                    vm.documents.push(img);
                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = '';
                    vm.documentImages.push(imageDetail);
                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            function getChecklist() {
                checkListService.getCheckList({}).success(function (data) {
                    vm.checklist = data.items;
                });
            };
            function init() {
                vehicleService.getVehicleForEdit({
                    id: vehicleId
                }).success(function (result) {
                    getNotReadyReasons();
                    getChecklist();
                    vm.vehicle = result;
                    vm.dateAndTime = moment().utc();
                    vm.currentSubStatus = utilities.getVehicleSubStatuses(vm.vehicle.subStatus);

                    if (vm.vehicle.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                });
            }
            vm.save = function () {
                vm.saving = true;
                //vm.checklist.forEach(function (value) {

                //});
                var foundLines = $filter('filter')(vm.checklist, {
                    checked: true
                }, true);
                vehicleService.changeVehicleSubStatus({
                    vehicleId: vm.vehicle.id,
                    subStatus: vm.vehicle.subStatus,
                    dateAndTime: vm.dateAndTime,
                    notes: vm.notes,
                    contactId: vm.contactId,
                    documents: vm.documents,
                    inCheckList: foundLines,
                    notReadyReasonId: vm.notReadyReason
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            init();
        }
    ]);
