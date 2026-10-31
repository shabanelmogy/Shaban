// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88340-88499
appModule.controller('tenant.views.common.dataEntryCorrections.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.dataEntryCorrection', 'entryId', 'abp.services.app.sLA', '$uibModal', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModalInstance, dataEntryCorrectionService, entryId, slaService, $uibModal, customerCareTenantService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            vm.sla = [];
            vm.requiredSLA = true;
            vm.invalidation = true;
            vm.dataEntry = {};
            vm.dataEntry.serviceLevelAgreements = [];
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

            vm.priorities = [
                { id: 1, name: app.localize("Normal") },
                { id: 3, name: app.localize("High") }
            ];

            vm.save = function () {

                vm.saving = true;
                vm.dataEntry.isCustomization = false;
                if (!(vm.selectedCountry === null || vm.selectedCountry === undefined)) vm.dataEntry.address.country = vm.selectedCountry.name;

                customerCareTenantService.createOrUpdateDataEntryCorrection({
                    dataEntry: vm.dataEntry
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



            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                    vm.dataEntry.documents = vm.documents;
                });
            };





            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            var getSLAs = function () {
                customerCareTenantService.getSLAsByTenantId().success(function (result) {
                    if (result.length > 0 && vm.dataEntry.id > 0) {
                        if (vm.dataEntry.serviceLevelAgreements.length > 0) {
                            angular.forEach(result, function (value, key) {
                                value.selected = vm.dataEntry.serviceLevelAgreements.some(e => e.id == value.id);
                            });
                        }
                    }
                    vm.sla = result;
                    if (vm.sla.length === 1) {
                        vm.sla[0].selected = true;
                        vm.requiredSLA = true;
                        vm.invalidation = false;
                        vm.slaSelected(vm.sla[0]);
                        vm.validate();
                    } else {
                        vm.validate();
                    }
                });
            };
            vm.slaSelected = function (row) {
                if (row.selected)
                    vm.dataEntry.serviceLevelAgreements.push(row);
                else {
                    var index = vm.dataEntry.serviceLevelAgreements.map(function (e) { return e.id; }).indexOf(row.id);
                    vm.dataEntry.serviceLevelAgreements.splice(index, 1);
                }
            };
            vm.validate = function () {
                if (vm.dataEntry.serviceLevelAgreements === null || vm.dataEntry.serviceLevelAgreements.length === 0) {
                    vm.errorMessage = "Please select atleast one non-expired agreement";
                    vm.invalidation = true;
                    return;
                }

                for (var i = 0; i < vm.dataEntry.serviceLevelAgreements.length; i++) {
                    if (moment() > moment(vm.dataEntry.serviceLevelAgreements[i].expiryDate)) {
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

            function init() {
                vm.loading = true;

                customerCareTenantService.getDataEntryCorrectionForEdit({
                    id: entryId
                }).success(function (result) {
                    vm.dataEntry = result;
                    getSLAs();
                    if (vm.dataEntry.id > 0) {
                        vm.isEditMod = true;
                        vm.requiredSLA = true;
                        vm.invalidation = false;
                    } else {
                        vm.isEditMod = false;
                        if (!vm.dataEntry.serviceLevelAgreements) {
                            vm.dataEntry.serviceLevelAgreements = [];
                        }
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
