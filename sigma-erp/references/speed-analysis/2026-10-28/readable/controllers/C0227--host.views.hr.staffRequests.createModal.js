// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:71695-71787
appModule.controller('host.views.hr.staffRequests.createModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.sLA', 'abp.services.app.staffRequest', 'supportRequestId', 'utilities', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.directory', 'abp.services.app.tenant',
        function ($scope, $uibModalInstance, countryService, slaService, staffRequestService, supportRequestId, utilities, $filter, $uibModal, contactGroupService, directoryService, tenantAppService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            

            vm.staffRequest = {
                documents: [],
                detail: '',
                type: null,

            };

            vm.save = function () {
                vm.saving = true;
                console.log(vm.staffRequest);
                staffRequestService.createStaffRequest(
                     vm.staffRequest
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.getStatus = function (id) {
                if (id === 1)
                    return "Open";
                else if (id === 2)
                    return "Closed";
                else return '';
            };
            vm.todayDate = moment();
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            //vm.priorities = [
            //        { id: 1, name: app.localize("Low") },
            //        { id: 2, name: app.localize("Medium") },
            //        { id: 3, name: app.localize("High") }
            //];

            vm.types = [
                { id: 1, name:'Hardware'},
                { id: 2, name: 'Admin' },
                { id: 3, name: 'Hr' },
                { id: 4, name: 'Other' },
                { id: 5, name: 'Suggestion' },
            ];
            

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/hr/staffRequests/uploadDocumentsModal.cshtml',
                    controller: 'host.views.hr.staffRequests.uploadDocumentsModal as vm',
                    backdrop: 'static'


                });
                modalInstance.result.then(function (result) {
                    console.log("result");
                    console.log(result);
                    vm.documents.push(result);
                    vm.staffRequest.documents = vm.documents;
                });
            };
            

            
        }
    ]);
