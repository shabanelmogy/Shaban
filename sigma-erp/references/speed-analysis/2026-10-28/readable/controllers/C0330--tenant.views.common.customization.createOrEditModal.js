// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87545-87798
appModule.controller('tenant.views.common.customization.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.customization', 'supportRequestId', 'utilities', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.directory', 'abp.services.app.sLA', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModalInstance, countryService, customizationService, supportRequestId, utilities, $filter, $uibModal, contactGroupService, directoryService, slaService, customerCareTenantService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            vm.sla = [];
            vm.requiredSLA = true;
            vm.invalidation = true;
            vm.totalSubTasks = 0;
            
            if (!vm.supportRequest) {
                vm.supportRequest = {};
            }
            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("New");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Approved";
                else if (id == 9)
                    return "In-Progress";
                else return '';
            };
            vm.getChargingType = function (id) {
                if (id == 1)
                    return app.localize("Paid");
                else if (id == 2)
                    return app.localize("ProjectBuffer");
                else if (id == 3)
                    return app.localize("Complementary");
                else if (id == 4)
                    return app.localize("ProjectGAP");
                else return '';
            }
            // Assign an empty array to the subTasks property
            vm.supportRequest.subTasks = [];

            //vm.getStatus = function (id) {
            //    if (id === 1)
            //        return "Open";
            //    else if (id === 2)
            //        return "Closed";
            //    else return '';
            //};
            vm.removeSubTasks = function (Id) {
                vm.supportRequest.subTasks.forEach(function (item, index) {
                    if (item.taskId === Id) {
                        if (!vm.isEditMod) {
                            vm.supportRequest.subTasks.splice(index, 1);
                        }
                        else {
                            item.isDeleted = true;
                        }

                    }
                });
                vm.calculateHours();
            };
            vm.calculateHours = function () {
                debugger;
                vm.totalHours = 0.0;
                vm.supportRequest.subTasks.forEach(function (item, index) {
                    if (item.estimatedHours != undefined && item.isDeleted == false) {
                        vm.totalHours += item.estimatedHours
                    }
                });
                vm.supportRequest.totalEstimatedHours = vm.totalHours;
                
                
            };
            vm.addSubTasks = function () {
                vm.totalSubTasks = vm.supportRequest.subTasks.length;
                vm.supportRequest.subTasks.push(
                    {
                        taskId: vm.totalSubTasks,
                        description: "",
                        scope: "",
                        isTempId: true,
                        isDeleted: false
                    }
                );
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

            vm.priorities = [
                    { id: 1, name: app.localize("Normal") },
                    { id: 3, name: app.localize("High") }
            ];

            vm.save = function () {

                vm.saving = true;
                vm.supportRequest.isCustomization = true;
                vm.totalSubTasks = vm.supportRequest.subTasks.length;
                if (vm.totalSubTasks == 0) {
                    vm.supportRequest.subTasks.push(
                        {
                            taskId: vm.totalSubTasks,
                            description: vm.supportRequest.detail,
                            scope: "",
                            isTempId: true,
                            isDeleted: false
                        }
                    );
                }
                if (!(vm.selectedCountry === null || vm.selectedCountry === undefined)) vm.supportRequest.address.country = vm.selectedCountry.name;
                vm.supportRequest.subTasks.forEach(function (value) {

                    if (value.isTempId) {
                        value.taskId = 0;
                    }
                });
                customerCareTenantService.createOrUpdateCustomization({
                    supportRequest: vm.supportRequest
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                    vm.supportRequest.documents = vm.documents;
                });
            };

            getSLAs = function () {
                customerCareTenantService.getSLAsByTenantId().success(function (result) {
                    if (result.length > 0 && vm.supportRequest.id > 0) {
                        if (vm.supportRequest.serviceLevelAgreements && vm.supportRequest.serviceLevelAgreements.length > 0) {
                            angular.forEach(result, function (value, key) {
                                value.selected = vm.supportRequest.serviceLevelAgreements.some(e => e.id == value.id);
                            });
                        }
                    }
                    vm.sla = result;
                    if (vm.sla.length === 1) {
                        vm.sla[0].selected = true;
                        vm.requiredSLA = true;
                        vm.invalidation = false;
                       // vm.validate();
                    } else {
                        vm.validate();
                    }
                });
            };
            vm.slaSelected = function (row) {
                if (row.selected)
                    vm.supportRequest.serviceLevelAgreements.push(row);
                else {
                    var index = vm.supportRequest.serviceLevelAgreements.map(function (e) { return e.id; }).indexOf(row.id);
                    vm.supportRequest.serviceLevelAgreements.splice(index, 1);
                }
            };
            vm.validate = function () {
                if (!vm.supportRequest.serviceLevelAgreements || vm.supportRequest.serviceLevelAgreements.length === 0) {
                    vm.errorMessage = "Please select atleast one non-expired agreement";
                    vm.invalidation = true;
                    return;
                }

                for (var i = 0; i < vm.supportRequest.serviceLevelAgreements.length; i++) {
                    if (moment() > moment(vm.supportRequest.serviceLevelAgreements[i].expiryDate)) {
                        //vm.slas.pop();
                        vm.errorMessage = "Note: You cannot move further because you have selected expired agreement(s)";
                        vm.invalidation = true;
                        return;
                    }
                    else {
                        vm.errorMessage = '';
                        vm.invalidation = false;
                    }
                }
            };
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);
            function init() {
                if (supportRequestId > 0) {
                    debugger
                    vm.loading = true;
                    customerCareTenantService.getChangeRequestsById({
                        id: supportRequestId
                    }).success(function (result) {
                        vm.supportRequest = result;
                        getSLAs();

                        
                            vm.isEditMod = true;
                            vm.requiredSLA = true;
                            vm.invalidation = false;
                         
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    getSLAs();
                    vm.isEditMod = false;
                    if (!vm.supportRequest.serviceLevelAgreements) {
                        vm.supportRequest.serviceLevelAgreements = [];
                    }
                }
            }

            init();
        }
    ]);
