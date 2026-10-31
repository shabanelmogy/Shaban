// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:192662-193067
appModule.controller('tenant.views.crs.crm.marketing.leads.leadQualification', ['$uibModal', '$uibModalInstance', 'abp.services.app.directory',
        'inquiryId', 'abp.services.app.commonLookup', 'utilities', 'options',

        function ($uibModal, $uibModalInstance, directoryService, inquiryId, lookupService, utilities, options) {
            var vm = this;

            // Sample lead data - in a real app, this would come from an API
            vm.lead = {
                firstName: 'Lisa',
                lastName: 'Johnson',
                email: 'lisa.johnson@example.com',
                phone: '555-222-3333',
                source: 'LinkedIn',
                status: 'contacted',
                notes: 'Interested in our enterprise solutions'
            };

            // Qualification data
            vm.qualification = {
                score: 66,
                budget: '$10,000-$25,000',
                hasAuthority: false,
                need: 'Looking for a CRM solution',
                timeline: 'Next 3 months',
                notes: ''
            };

            // Options for dropdowns
            vm.budgetOptions = [
                'Under $5,000',
                '$5,000-$10,000',
                '$10,000-$25,000',
                '$25,000-$50,000',
                '$50,000-$100,000',
                'Over $100,000',
                'Unknown'
            ];

            vm.timelineOptions = [
                'Immediate',
                'Next month',
                'Next 3 months',
                'Next 6 months',
                'Next year',
                'No specific timeline'
            ];

            // Get qualification status
            vm.getStatusLabel = function (score) {
                if (score >= 80) return 'Highly Qualified';
                if (score >= 60) return 'Qualified';
                if (score >= 40) return 'Possibly Qualified';
                return 'Not Qualified';
            };

            vm.getStatusClass = function (score) {
                if (score >= 80) return 'label-success';
                if (score >= 60) return 'label-primary';
                if (score >= 40) return 'label-warning';
                return 'label-danger';
            };

            // Navigation
            vm.backToLeads = function () {
                $location.path('/leads');
            };

            // Form actions
            vm.saveQualification = function () {
                // In a real app, you would save to your API here
                console.log('Saving qualification:', vm.qualification);
                alert('Qualification saved!');
                $location.path('/leads');
            };

            vm.cancel = function () {
                $location.path('/leads');
            };

            // Capitalize filter
            //vm.capitalize = function (value) {
            //    return value.charAt(0).toUpperCase() + value.slice(1);
            //};


            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isEditMode = false;
            vm.vehicles = [];
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
            //vm.Inquiry = {
            //    date: null,
            //    customer: null,
            //    salePerson: null,
            //    inquiryLines: []
            //} ;
            vm.inquiryTypes = [
                { key: 'To Sell', value: 1 },
                { key: 'To Buy', value: 2 },
                { key: 'To Rent Out', value: 3 },
                { key: 'To Get on Rental', value: 4 }
            ];
            vm.inquiryStatuses = [
                { key: 'New', value: 1 },
                { key: 'Active', value: 2 },
                { key: 'Dead', value: 3 },
                { key: 'Closed', value: 4 }
            ];
            vm.propertyTypes = [
                { key: "Apartment", isResidential: true, isCommercial: false, inBuilding: true, bedsBaths: true, value: 1, properytCategoryId: 1 },
                { key: "Villa", isResidential: true, isCommercial: true, inBuilding: true, bedsBaths: true, value: 2, properytCategoryId: null },
                { key: "Townhouse", isResidential: true, isCommercial: false, inBuilding: false, bedsBaths: true, value: 3, properytCategoryId: 1 },
                { key: "Penthouse", isResidential: true, isCommercial: false, inBuilding: true, bedsBaths: true, value: 4, properytCategoryId: 1 },
                { key: "Villa Compound", isResidential: true, isCommercial: false, inBuilding: false, bedsBaths: true, value: 5, properytCategoryId: 1 },
                { key: "Hotel Apartment", isResidential: true, isCommercial: false, inBuilding: true, bedsBaths: true, value: 6, properytCategoryId: 1 },
                { key: "Plot", isResidential: true, isCommercial: true, inBuilding: false, bedsBaths: false, value: 7, properytCategoryId: null },
                { key: "Floor", isResidential: true, isCommercial: true, inBuilding: true, bedsBaths: true, value: 8, properytCategoryId: null },
                { key: "Building", isResidential: true, isCommercial: true, inBuilding: false, bedsBaths: false, value: 9, properytCategoryId: null },
                { key: "Office", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 10, properytCategoryId: 2 },
                { key: "Shop", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 11, properytCategoryId: 2 },
                { key: "Warehouse", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 12, properytCategoryId: 2 },
                { key: "Labour Camp", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 13, properytCategoryId: 1 },
                { key: "Bulk Unit", isResidential: false, isCommercial: true, inBuilding: false, bedsBaths: false, value: 14, properytCategoryId: 2 },
                { key: "Factory", isResidential: false, isCommercial: true, inBuilding: false, bedsBaths: false, value: 15, properytCategoryId: 2 },
                { key: "Industrial Land", isResidential: false, isCommercial: true, inBuilding: false, bedsBaths: false, value: 16, properytCategoryId: 2 },
                { key: "Mixed Use Land", isResidential: false, isCommercial: true, inBuilding: false, bedsBaths: false, value: 17, properytCategoryId: 2 },
                { key: "Showroom", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 18, properytCategoryId: 2 },
                { key: "Parking", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 19, properytCategoryId: 2 },
                { key: "Storage", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 20, properytCategoryId: 2 },
                { key: "Other", isResidential: false, isCommercial: true, inBuilding: true, bedsBaths: false, value: 21, properytCategoryId: 2 },

            ];
            vm.properytCategories = [
                { key: 'Residential', value: 1 },
                { key: 'Commercial', value: 2 },
                //{ key: 'Industrial', value: 3 },

            ];
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
                //if ($select.search == "") { vm.vehicles = null; return null; }
                //return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                //    vm.vehicles = response.data.items;
                //});
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

            vm.save = function () {
                debugger
                if (vm.lead.contact)
                    vm.lead.contactId = vm.lead.contact.id;

                if (vm.lead.propertyCategory)
                    vm.lead.propertyCategory = vm.lead.propertyCategory.value;

                if (vm.lead.propertyType)
                    vm.lead.propertyType = vm.lead.propertyType.value;

                if (vm.lead.type)
                    vm.lead.type = vm.lead.type.value;

                if (vm.lead.status)
                    vm.lead.status = vm.lead.status.value;


                //vm.saving = true;
                //propertyInquiryService.createOrUpdateInquiry({
                //    propertyInquiry: vm.lead
                //}).success(function () {
                //    abp.notify.info(app.localize('SavedSuccessfully'));
                //    $uibModalInstance.close();
                //}).finally(function () {
                //    vm.saving = false;
                //})
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
                vm.lead.date = new Date;
                vm.getTariffGroups();
                if (inquiryId) {
                    //vm.loading = true;

                    //propertyInquiryService.getPropertyInquiryForEdit({ id: inquiryId }).success(function (data) {
                    //    vm.isEditMode = true;
                    //    vm.lead = data;
                    //    vm.GetEnums();
                    //    vm.inquiry.leaseInquiryStage = vm.getlocalizedString(vm.inquiry.leaseInquiryStage);
                    //}).finally(function () {
                    //    vm.loading = false;
                    //});
                }
                else {
                    vm.lead.status = vm.inquiryStatuses[0];
                }
            }


            init();


        }]);
