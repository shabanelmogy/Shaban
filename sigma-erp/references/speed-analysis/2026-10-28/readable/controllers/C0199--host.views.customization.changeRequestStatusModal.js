// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:68156-68277
appModule.controller('host.views.customization.changeRequestStatusModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', '$uibModal', 'changeRequest',
        function ($scope, $uibModalInstance, customizationService, $uibModal, changeRequest) {
            var vm = this;
            vm.isSaving = false
            vm.requestNo = changeRequest.reqNo;
            vm.changeRequest = changeRequest;
            vm.currentStatus = changeRequest.status;
            vm.changeRequestDto = {
                id: changeRequest.id,
                status: changeRequest.status,
                approvalDate: changeRequest.approvalDate,
                documents: [],
                invoiceGenerate: 0,
                financeStatus:0

            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/uploadDocumentsModal.cshtml',
                    controller: 'host.views.customization.uploadDocumentsModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tenantId: function () {
                            return changeRequest.tenantId
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.changeRequestDto.documents.push(result);

                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.statusChange= function () {
                if (vm.changeRequestDto.status != 13)
                    vm.changeRequestDto.invoiceGenerate = 0;

                if (vm.changeRequestDto.status != 8) {
                    vm.changeRequestDto.financeStatus = 0;
                    vm.changeRequestDto.documents.length = 0;
                }
            };

            vm.getCurrentStatusName = () => {
                return [
                    { id: 1, name: "New" },
                    { id: 2, name: "Closed" },
                    { id: 3, name: "Cancelled" },
                    { id: 4, name: "On Hold" },
                    { id: 10, name: "Scope Sent" },
                    { id: 11, name: "Scope Approved" },
                    { id: 12, name: "Quotation Sent" },
                    { id: 14, name: "On Approval" },
                    { id: 15, name: "Delivered" },
                    { id: 13, name: "Quotation Approved" },
                    { id: 8, name: "Finance Approved" }
                ].find(x => x.id == changeRequest.status).name;

            }

            vm.statuses = [];
            function getStatus() {
                
                if (changeRequest.status == 1 || changeRequest.status == 10 || changeRequest.status == 11 || changeRequest.status == 12 || changeRequest.status == 14 || changeRequest.status == 4|| changeRequest.status == 3) {
                    vm.statuses = [
                        { id: 10, name: "Scope Sent" },
                        { id: 11, name: "Scope Approved" },
                        { id: 12, name: "Quotation Sent" },
                        { id: 14, name: "On Approval" },
                        { id: 13, name: "Quotation Approved" },
                        { id: 4, name: "On Hold" },
                        { id: 3, name: "Cancelled" }
                    ];
                }
                else if (changeRequest.status == 13){
                    vm.statuses = [
                        { id: 8, name: "Finance Approved" },
                        { id: 4, name: "On Hold" },
                        { id: 3, name: "Cancelled" }
                    ];
                }
                else if (changeRequest.status == 8){
                    vm.statuses = [
                        { id: 15, name: "Delivered" }
                    ];
                }
                else if (changeRequest.status == 15){
                    vm.statuses = [
                        { id: 2, name: "Closed" }
                    ];
                }
                
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.badgeShow = function () {
                return vm.statuses.find(x => x.id == vm.changeRequestDto.status).name;

            }
            vm.save = function () {
                vm.isSaving = true;
                customizationService.changeRequestStatus(vm.changeRequestDto).success(r => {
                    abp.notify.info(app.localize('UpdatedSuccessfully'));
                    $uibModalInstance.close();
                });
            }

            getStatus();
        }
    ]);
