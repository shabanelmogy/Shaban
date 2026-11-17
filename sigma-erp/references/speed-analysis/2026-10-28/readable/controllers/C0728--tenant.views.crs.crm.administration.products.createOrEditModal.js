// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:188366-188705
appModule.controller('tenant.views.crs.crm.administration.products.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.directory',
        'productId', 'abp.services.app.commonLookup', 'utilities', 'options', 'abp.services.app.cRMProduct',

        function ($uibModal, $uibModalInstance, directoryService, productId, lookupService, utilities, options, productService) {
            var vm = this;

            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isEditMode = false;
            vm.productId = productId || null;
            vm.agreementTypeFlag = true;
            vm.customers = [];
            vm.lead = {
                date: null,
                type: null,
                status: null,
                contact: null,
                propertyCategory: null,
                propertyType: null,
                propertyDescription: null,
                notes: null,
                realEstateProjectId: options ? options.projectId : null
            };
            vm.product = {
                id: null,
                name: null,
                code: null,
                isActive: true,
                detail: null,
                productCategory: null,
                agreementType: null
            } ;

            vm.features = {
                rental: abp.features.isEnabled('CRS.Rental'),
                lease: abp.features.isEnabled('CRS.Lease'),
                limo: abp.features.isEnabled('CRS.Limo'),
            };

            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            //if (abp.features.isEnabled("CRS.Transportation"))
            //    vm.modules.push({ name: 'Transportation', id: 4 });
            //if (abp.features.isEnabled("CRS.Chauffeur"))
            //    vm.modules.push({ name: 'Chauffeur', id: 5 });
            //if (abp.features.isEnabled("ERS"))
            //    vm.modules.push({ name: 'Equipment', id: 7 });
            //if (abp.features.isEnabled("CRS.AccessoriesRental"))
            //    vm.modules.push({ name: 'Accessories', id: 8 });
            //if (abp.features.isEnabled("CRS.SalesModule"))
            //    vm.modules.push({ name: 'Sales', id: 9 });


            vm.agreementTypesData = [{ type: "Daily", id: 1 }, { type: "Weekly", id: 2 }, { type: "Monthly", id: 3 }, { type: "Lease", id: 4 }];
            vm.agreementTypes = [{ type: "Daily", id: 1 }, { type: "Weekly", id: 2 }, { type: "Monthly", id: 3 }, { type: "Lease", id: 4 }];

            vm.getlocalizedString = function (leaseInquiryStage) {

                if (leaseInquiryStage == 0)
                    return app.localize('New');

                else if (leaseInquiryStage == 1)
                    return app.localize('Active');

                else if (leaseInquiryStage == 2)
                    return app.localize('Dead');

                else if (leaseInquiryStage == 3)
                    return app.localize('Closed');

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

            vm.searchProperties = function ($select) {

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
                return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.lead.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };

            vm.getTariffGroups = function () {
                //vm.loading = true;
                //lookupService.getTariffGroups({}).success(function (data) {
                //    vm.vehicleTypes = data.items;
                //});
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
                        },
                        title: function () {
                            return null;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.lead.customer = customer;
                    }
                });
            };
            vm.showAddContact = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return null;
                        },
                        isFromSearchScreen: function () {
                            return true;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    debugger
                    if (result != null) {
                        vm.lead.contact = result;
                        vm.lead.contact.name = result.firstName + ' ' + result.lastName;
                    }
                });
            };


            //Add row
            vm.addRow = function () {
                vm.lead.inquiryLines.push(inquiryLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.lead.inquiryLines.indexOf(obj);
                vm.lead.inquiryLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.productCategorySelected = function () {
                debugger
                if (vm.product.productCategory == 1 ) {
                    vm.agreementTypeFlag = true;
                    vm.agreementTypes = vm.agreementTypesData.filter(a => a.id != 4); // 4 == Lease
                }
                else if (vm.product.productCategory == 2) {
                    vm.agreementTypeFlag = true;
                    vm.agreementTypes = [{ type: "Lease", id: 4 }];
                }
                else if (vm.product.productCategory == 3)
                    vm.agreementTypeFlag = false;
            };

            vm.save = function () {
                debugger
                //if (vm.lead.contact)
                //    vm.lead.contactId = vm.lead.contact.id;

                //if (vm.lead.propertyCategory)
                //    vm.lead.propertyCategory = vm.lead.propertyCategory.value;

                //if (vm.lead.propertyType)
                //    vm.lead.propertyType = vm.lead.propertyType.value;

                //if (vm.lead.type)
                //    vm.lead.type = vm.lead.type.value;

                //if (vm.lead.status)
                //    vm.lead.status = vm.lead.status.value;


                vm.saving = true;
                if (vm.productId) {

                    productService.editCRMProduct(
                        vm.product
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
                else {
                    productService.addCRMProduct(
                        vm.product
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
            };

            vm.GetEnums = function () {
                //inquiry Types
                angular.forEach(vm.inquiryTypes, function (obj) {
                    if (!parseInt(vm.lead.type)) return;
                    if (obj.value == vm.lead.type) {
                        vm.lead.type = obj;
                        //vm.onPropertyInquirySelect(obj);
                        return;
                    }
                    if (vm.inquiryTypes.indexOf(obj) == vm.inquiryTypes.length - 1) {
                        vm.lead.type = '';
                    }
                });
                //property Type
                angular.forEach(vm.propertyTypes, function (obj) {
                    if (!parseInt(vm.lead.propertyType)) return;
                    if (obj.value == vm.lead.propertyType) {
                        vm.lead.propertyType = obj;
                        //vm.onPropertyTypeSelect(obj);
                        return;
                    }
                    if (vm.propertyTypes.indexOf(obj) == vm.propertyTypes.length - 1) {
                        vm.lead.type = '';
                    }
                });

                //category
                angular.forEach(vm.properytCategories, function (obj) {
                    if (!parseInt(vm.lead.propertyCategory)) return;
                    if (obj.value == vm.lead.propertyCategory) {
                        vm.lead.propertyCategory = obj;
                        return;
                    }
                    if (vm.properytCategories.indexOf(obj) == vm.properytCategories.length - 1)
                        vm.property.category = '';
                });

                //Status
                angular.forEach(vm.inquiryStatuses, function (obj) {
                    if (!parseInt(vm.lead.status)) return;
                    if (obj.value == vm.lead.status) {
                        vm.lead.status = obj;
                        return;
                    }
                    if (vm.inquiryStatuses.indexOf(obj) == vm.inquiryStatuses.length - 1)
                        vm.lead.status = '';
                });
            };
            vm.searchCustomerPopoup = function (filter) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        },
                        title: function () {
                            return filter;
                        }
                    }
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.lead.contact = contact;
                    }
                });
            };
            function init() {
                debugger

                if (vm.productId) {
                    vm.loading = true;

                    productService.getCRMProductForEdit(vm.productId).success(function (data) {
                        vm.isEditMode = true;
                        vm.product = data;
                        vm.productCategorySelected();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    //vm.lead.status = vm.inquiryStatuses[0];
                }
            }


            init();


        }]);
