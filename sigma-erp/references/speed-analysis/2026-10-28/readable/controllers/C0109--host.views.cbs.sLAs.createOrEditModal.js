// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:49929-50039
appModule.controller('host.views.cbs.sLAs.createOrEditModal', [
        '$scope', '$uibModalInstance', 'slaId', 'abp.services.app.sLA', 'utilities', '$uibModal', 'abp.services.app.tenant', 'abp.services.app.taskDetail',
        function ($scope, $uibModalInstance, slaId, slaService, utilities, $uibModal, tenantAppService, taskDetailService) {
            var vm = this;
            vm.saving = false;
            var isValid = false;

            vm.defaultMessages = {
                '1': 'Please clear your outstanding invoices to avoid service disruption.',
                '2': 'Your service is downgraded due to non-payment. Please pay immediately to avoid service disconnection.',
                '3': 'Your service is stopped due to non-payment. Please pay immediately to resume service.'
            };

            // Function to update message based on selection
            vm.updatePaymentMessage = function () {
                if (vm.sLA && vm.sLA.paymentDelayType && vm.defaultMessages[vm.sLA.paymentDelayType]) {
                    vm.sLA.paymentDelayMessage = vm.defaultMessages[vm.sLA.paymentDelayType];
                }
            };

            vm.slaTypes = [
                { id: 1, name: "Implementation" },
                { id: 2, name: "Post Go-Live" },
                { id: 3, name: "Live" },
            ];

            vm.searchProjects = function ($select) {
                if ($select.search == "")
                    vm.projects = [];
                taskDetailService.searchProjectsForCustomization({ keyword: $select.search, tenantId: null, slaType: vm.sLA.type }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };

            vm.getNameWithCompany = function (project) {
                return project.title + " (" + project.company.companyName + ")";
            };

            function validate() {
                errorMessage = '';
                errorMessage = 'SLA Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.sLA.expiryDate != null) {
                    if (moment(vm.sLA.startDate) > moment(vm.sLA.expiryDate)) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Expiry Date can not be less than Start Date ';
                    }
                }

            }

            vm.save = function () {
                vm.saving = true;
                validate();
                if (isValid) {
                    slaService.createOrUpdateSLA({
                        sla: vm.sLA,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    vm.saving = false;
                }

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    vm.tenants = [];
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            function init() {
                vm.loading = true;
                slaService.getSLAForEdit({
                    id: slaId
                }).success(function (result) {
                    if (result != null) {
                        vm.sLA = result;
                        if (vm.sLA.id > 0) {
                            vm.isEditMode = true;
                        } else {
                            vm.isEditMode = false;
                        }

                        // Initialize with default message if a type is already selected in edit mode
                        if (vm.sLA.paymentDelayType) {
                            vm.updatePaymentMessage();
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });

            }
            init();
        }
    ]);
