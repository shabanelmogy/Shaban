// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87214-87316
appModule.controller('tenant.views.common.customerRequests.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.customerRequest', 'customerRequestId', 'utilities', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.directory',
        function ($scope, $uibModalInstance, countryService, customerRequestService, customerRequestId, utilities, $filter, $uibModal, contactGroupService, directoryService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
          
            vm.getStatus = function (id) {
                if (id == 1)
                    return "Open";
                else if (id == 2)
                    return "Closed";
                else return '';
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
            vm.clearCustomer = function () {
                vm.customerRequest.customer = null;
                vm.customerRequest.customerId = null;
            };
            // loading Customers

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
                    }
                });
            };
   
            vm.save = function () {
                
                vm.saving = true;

                if (vm.selectedCountry != null) vm.customerRequest.address.country = vm.selectedCountry.name;
                if (vm.customerRequest.customer)
                    vm.customerRequest.customerId = vm.customerRequest.customer.id;
                customerRequestService.createOrUpdateCustomerRequest({
                    customerRequest: vm.customerRequest,

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

            function init() {
                vm.loading = true;
                customerRequestService.getCustomerRequestForEdit({
                    id: customerRequestId
                }).success(function (result) {
                    vm.customerRequest = result;
                    
                    if (vm.customerRequest.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
