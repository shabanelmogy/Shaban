// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:68307-68370
appModule.controller('host.views.customization.createModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', 'supportRequestId', 'utilities', '$filter', '$uibModal', 'abp.services.app.tenant', 
        function ($scope, $uibModalInstance, customizationService, supportRequestId, utilities, $filter, $uibModal, tenantAppService) {
            var vm = this;
            vm.saving = false;
            vm.documents = [];
            
            vm.filters = {
                tenant : null,
                detail: null,
                requestNo: null,
                tenantId: 0
            };
            
            vm.save = function () {
                vm.saving = true;
                vm.filters.documents = vm.documents;
                customizationService.createOrUpdateCustomization({
                    customization: vm.filters,
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

            vm.uploadDocument = function() {
                
                if (vm.filters.tenantId != null) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/uploadDocumentsModal.cshtml',
                        controller: 'host.views.customization.uploadDocumentsModal as vm',
                        backdrop: 'static',
                        resolve: {
                            tenantId: function() {
                                return vm.filters.tenantId;
                            }
                        }
                    });
                    modalInstance.result.then(function(result) {
                        vm.documents.push(result);
                    });
                }
            };
            
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    vm.tenants = [];
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
        }
    ]);
