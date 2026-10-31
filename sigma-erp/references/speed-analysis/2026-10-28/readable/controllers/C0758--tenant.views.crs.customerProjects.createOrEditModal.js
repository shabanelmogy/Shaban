// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:196127-196244
appModule.controller('tenant.views.crs.customerProjects.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.directory',
         'abp.services.app.vehicleModel', 'projectId', 'abp.services.app.customerProject',

        function ($uibModal, $uibModalInstance, vehicleService, directoryService, vehicleModelService, projectId, customerProjectService) {
            var vm = this;
            vm.isEditMode = false;
           
            vm.customers = [];
            vm.project = {
 
                name:null,
                status: null,
                contact: null
 
            };


            vm.statuses = [
                { name: "Active", id: true },
                { name: "InActive", id: false } 
            ];
            vm.searchModelFilters = {
                name: '',
                makeId: null
            };

          
 
            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            //vm.searchSalePerson = function ($select) {
            //    //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            //    return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
            //        vm.salePersons = response.data.items;
            //    });
            //};

            //vm.searchContactPerson = function ($select) {
            //    if (!$select.search) return;
            //    //whereas contactCategory: 2 (company), contactType: 1 (staff)
            //    return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.inquiry.customer.id }).then(function (response) {
            //        vm.contactPersons = response.data;
            //    });
            //};
 
            // extended search using search contact popup
            vm.searchContactPopoup = function () {
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
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.project.contact = contact;
                    }
                });
            };

          
         

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                debugger;
                vm.project.contactId = vm.project.contact.id;
                console.log(vm.project)
                //if (vm.inquiry.salePerson) {
                //    vm.inquiry.salePersonId = vm.inquiry.salePerson.id;
                //}
                //vm.inquiry.inquiryLines.forEach(function (value) {
                //    value.vehicleModelId = value.vehicleModel.id;
                //});
                vm.saving = true;
                customerProjectService.createOrUpdateCustomerProject
                    (vm.project).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
            };

            function init() {
                //vm.getTariffGroups(''); 
                if (projectId) {
                    vm.loading = true;

                    customerProjectService.getCustomerProjectForEdit({ id: projectId }).success(function (data) {
                        vm.isEditMode = true;
                        vm.project = data;
                        console.log(vm.project)
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }


            init();


        }]);
