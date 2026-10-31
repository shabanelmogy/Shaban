// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:81340-81567
appModule.controller('host.views.support.supportRequests.createModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.sLA','abp.services.app.supportRequestHost', 'abp.services.app.customerCareTenant', 'supportRequestId', 'utilities', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.directory', 'abp.services.app.tenant',
        function ($scope, $uibModalInstance, countryService, slaService, supportRequestHostService, customerCareTenantService, supportRequestId, utilities, $filter, $uibModal, contactGroupService, directoryService, tenantAppService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.documents = [];
            vm.sla = [];
            vm.requiredSLA = false;
            vm.invalidation = true;

            vm.supportRequest = {
                tenantId: 0,
                tenant: null,
                detail: null,
                priority:null,
                requestNo: null,

                serviceLevelAgreements: [],
                documents : []
            };



            vm.removeDocument = function (urlWithToken) {
                vm.supportRequest.documents.forEach(function (item, index) {
                    if (item.urlWithToken === urlWithToken) {
                        vm.supportRequest.documents.splice(index, 1);
                    }
                });
            };


            vm.save = function () {
                vm.saving = true;
                vm.supportRequest.documents = vm.documents;
                customerCareTenantService.createSupportRequest({
                    supportRequest: vm.supportRequest
                }).success(function () {
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

            vm.priorities = [
                { id: 1, name: app.localize("Normal") },
                { id: 3, name: app.localize("High") }
            ];

            //vm.save = function () {

            //    vm.saving = true;
            //    vm.supportRequest.isCustomization = false;
            //    if (!(vm.selectedCountry === null || vm.selectedCountry === undefined)) vm.supportRequest.address.country = vm.selectedCountry.name;

            //    supportRequestService.createOrUpdateSupportRequest({
            //        supportRequest: vm.supportRequest
            //    }).success(function () {
            //        abp.notify.info(app.localize('SavedSuccessfully'));
            //        $uibModalInstance.close();
            //    }).finally(function () {
            //        vm.saving = false;
            //    });
            //};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.uploadDocument = function () {
                if (vm.supportRequest.tenantId != null) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/support/supportRequests/uploadDocumentsModal.cshtml',
                        controller: 'host.views.support.supportRequests.uploadDocumentsModal as vm',
                        backdrop: 'static',
                        resolve: {
                            tenantId: function () {
                                return vm.supportRequest.tenantId;
                            }
                        }

                    });
                    modalInstance.result.then(function (result) {
                        vm.documents.push(result);
                        vm.supportRequest.documents = vm.documents;
                    });
                }
            };

            function getSLAs() {
                slaService.getTenantSLAForSupport(vm.supportRequest.tenantId).success(function (result) {
                    if (result.length > 0 && vm.supportRequest.id > 0) {
                        if (vm.supportRequest.serviceLevelAgreements.length > 0) {
                            angular.forEach(result, function (value, key) {
                                value.selected = vm.supportRequest.serviceLevelAgreements.some(e => e.id === value.id);
                            });
                        }
                    }

                    vm.sla = result;
                    //vm.slatemp = vm.sla;
                    //vm.sla = [];
                    //vm.sla.push(vm.slatemp[0]);

                    //vm.sla[1].expiryDate = "2019-12-30T19:00:00Z";

                    //if (vm.sla.length == 0) {
                    //    vm.requiredSLA = false;
                    //    vm.invalidation = false;
                    //}
                    //else
                    if (vm.sla.length === 1) {
                        vm.sla[0].selected = true;

                        vm.slaSelected(vm.sla[0]);
                        vm.validate();
                    } else {
                        vm.validate();
                    }

                });
            }
            vm.slaSelected = function (row) {
                if (row.selected)
                    vm.supportRequest.serviceLevelAgreements.push(row);
                else {
                    var index = vm.supportRequest.serviceLevelAgreements.map(function (e) { return e.id; }).indexOf(row.id);
                    vm.supportRequest.serviceLevelAgreements.splice(index, 1);
                }
            };
            vm.getTenantSLA = function () {
               vm.requiredSLA = true;
                getSLAs();
            };

           
            vm.validate = function () {
                if (vm.supportRequest.serviceLevelAgreements === null || vm.supportRequest.serviceLevelAgreements.length === 0) {
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
            vm.searchTenants = function ($select) {
                if ($select.search === "")
                    vm.tenants = [];
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            function init() {
                //getSLAs();
            }
            //{
            //    vm.loading = true;
            //    supportRequestService.getSupportRequestForEdit({
            //        id: supportRequestId
            //    }).success(function (result) {
            //        vm.supportRequest = result;
            //        getSLAs();
            //        if (vm.supportRequest.id > 0) {
            //            vm.isEditMod = true;
            //            vm.requiredSLA = true;
            //            vm.invalidation = false;

            //        } else {
            //            vm.isEditMod = false;
            //            if (!vm.supportRequest.serviceLevelAgreements) {
            //                vm.supportRequest.serviceLevelAgreements = [];
            //            }
            //        }


            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            init();
        }
    ]);
