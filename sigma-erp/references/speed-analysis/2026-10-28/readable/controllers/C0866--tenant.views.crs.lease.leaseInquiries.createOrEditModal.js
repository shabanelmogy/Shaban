// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236553-236741
appModule.controller('tenant.views.crs.lease.leaseInquiries.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.leaseInquiry', 'abp.services.app.vehicleModel', 'inquiryId', 'abp.services.app.commonLookup', 'utilities',

        function ($uibModal, $uibModalInstance, vehicleService, directoryService, leaseInquiryService, vehicleModelService, inquiryId, lookupService, utilities) {
            var vm = this;

            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isEditMode = false;
            vm.vehicles = [];
            vm.customers = [];
            vm.inquiry = {
                date: null,
                customer: null,
                salePerson: null,
                inquiryLines: []
            };

            vm.leaseInquiryStage = [
                { key: 'New', value: 0 },
                { key: 'Cold', value: 1 },
                { key: 'Hot', value: 2 }
            ];
            vm.getlocalizedString = function (leaseInquiryStage) {

                if (leaseInquiryStage == 0)
                    return app.localize('New');

                else if (leaseInquiryStage == 1)
                    return app.localize('Cold');

                else if (leaseInquiryStage == 2)
                    return app.localize('Hot');
                return '';
            };

            vm.searchModelFilters = {
                name: '',
                makeId: null,
            };

            function inquiryLineObject() {

                var line = new Object();
                line.vehicle = null;
                line.quantity = '';
                line.years = null;
                return line;
            }

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchModel = function ($select) {
                vm.searchModelFilters.name = $select.search;
                if (vm.searchModelFilters.name == '')
                    vm.searchModelFilters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.searchModelFilters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchSalePerson = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salePersons = response.data.items;
                });
            };

            vm.searchContactPerson = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 2 (company), contactType: 1 (staff)
                return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.inquiry.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };

            vm.getTariffGroups = function () {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };

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
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.inquiry.customer = customer;
                    }
                });
            };

            vm.searchVehiclePopup = function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    resolve: {
                        tariffGroup: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.inquiry.vehicle = result;
                    }
                });
            }

            //Add row
            vm.addRow = function () {
                vm.inquiry.inquiryLines.push(inquiryLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.inquiry.inquiryLines.indexOf(obj);
                vm.inquiry.inquiryLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.inquiry.customerId = vm.inquiry.customer.id;
                if (vm.inquiry.salePerson) {
                    vm.inquiry.salePersonId = vm.inquiry.salePerson.id;
                }
                vm.inquiry.inquiryLines.forEach(function (value) {
                    value.vehicleModelId = value.vehicleModel.id;
                });
                vm.saving = true;
                leaseInquiryService.createOrUpdateLeaseInquiry
                    (vm.inquiry).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
            };

            function init() {
                vm.getTariffGroups();
                if (inquiryId) {
                    vm.loading = true;

                    leaseInquiryService.getLeaseInquiryForEdit({ id: inquiryId }).success(function (data) {
                        vm.isEditMode = true;
                        vm.inquiry = data;

                        vm.inquiry.leaseInquiryStage = vm.getlocalizedString(vm.inquiry.leaseInquiryStage);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }


            init();


        }]);
