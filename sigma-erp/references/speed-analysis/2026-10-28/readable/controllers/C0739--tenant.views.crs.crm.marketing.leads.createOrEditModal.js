// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:191209-191626
appModule.controller('tenant.views.crs.crm.marketing.leads.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleModel', 'abp.services.app.cRMLead', 'leadId', 'stage', 'abp.services.app.user', 'abp.services.app.commonLookup',
        'abp.services.app.directory', 'abp.services.app.cRMProduct', 'abp.services.app.tenant', 'inquiry', 'abp.services.app.cRMCampaign', 'abp.services.app.commonLookup',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, vehicleModelService, leadService, leadId, stage, userService, commonLookupService, directoryService, productService, tenantService, inquiry, campaignService, lookupService) {

            var vm = this;
            vm.loading = false;
            /*vm.resources = [];*/
            vm.hostProducts = [];
            vm.campaigns = [];
            vm.models = [];
            vm.tariffGroups = [];
            //vm.lockSalesPersonControl = false;
            vm.businessName = utilities.divisionName();
            vm.filters = {
                name: '',
                makeId: null
            };
            const marketingManagerUserId = parseInt(abp.setting.get("App.UserManagement.MarketingManagerUserId"));
            const salesManagerUserId = parseInt(abp.setting.get("App.UserManagement.SalesManagerUserId"));

            vm.users = [];
            vm.addRow = function () {
                vm.lead.inquiryLines.push(inquiryLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.lead.inquiryLines.indexOf(obj);
                vm.lead.inquiryLines.splice(index, 1);

            };
            function inquiryLineObject() {

                var line = new Object();
                line.vehicle = null;
                line.quantity = '';
                line.years = null;
                return line;
            }
            vm.title = "";
            if (stage === 1) {
                vm.title = "Prospect";
            } else if (stage === 2) {
                vm.title = "Lead";
            } else if (stage === 3) {
                vm.title = "Deal";
            }
            //vm.lead = inquiry;
            vm.lead = {
                status: 20,
                stage: stage,
                inquiryLines: []
            };
            vm.saving = false;
            vm.searchProducts = function ($select) {
                if ($select.search == "")
                    return null;
                productService.searchCRMProducts({ keyword: $select.search }).then(function (response) {
                    vm.hostProducts = response.data;
                    console.log("host products");
                    console.log(vm.hostProducts);
                });
            };
            vm.searchCampaigns = function ($select) {
                if ($select.search == "")
                    return null;
                campaignService.searchCRMCampaigns({ keyword: $select.search }).then(function (response) {
                    vm.campaigns = response.data;
                });
            };
            vm.onVehicleModelChange = function (line) {
                if (line.vehicleModel) {
                    line.vehicleModelId = line.vehicleModel.id;
                    line.vehicleModelName = line.vehicleModel.make.name + ' ' + line.vehicleModel.name;
                } else {
                    line.vehicleModelId = null;
                    line.vehicleModelName = null;
                }
            };

            vm.onVehicleTypeChange = function (line) {
                if (line.vehicleType) {
                    line.vehicleTypeId = line.vehicleType.id;
                    line.vehicleTypeName = line.vehicleType.title;
                } else {
                    line.vehicleTypeId = null;
                    line.vehicleTypeName = null;
                }
            };

            vm.searchModel = function ($select, makeId) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions
                vm.filters.makeId = makeId;

                vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });

            };
            vm.getTariffGroups = function () {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };
            //vm.resourcesChanged = function ()
            //{
            //    vm.lead.productIds = [];
            //    vm.resources.forEach(function (resource)
            //    {
            //        vm.lead.productIds.push(resource.id);
            //    });
            //    vm.hostProducts = [];
            //}
            vm.onProductChanged = function () {
                if (vm.lead.product) {
                    vm.lead.products = [vm.lead.product];
                    vm.lead.productId = vm.lead.product.id;
                    //vm.lead.productId = vm.lead.product.id;
                } else {
                    vm.lead.productId = null;
                }
            };

            vm.onCampaignChanged = function () {
                vm.resources = [];
                vm.lead.model = vm.lead.campaign.model;
                vm.lead.tariffGroup = vm.lead.campaign.tariffGroup;
                vm.resources.push(vm.lead.campaign.product);
                //vm.resourcesChanged();
            }

            const generateNotes = function () {
                let notes = "";
                if (inquiry.companyName)
                    notes += "Company : " + inquiry.companyName;
                if (inquiry.contactNo)
                    notes += ", Contact No : " + inquiry.contactNo;
                if (inquiry.product)
                    notes += "\nProduct Name: " + inquiry.product.displayName;
                if (inquiry.personName)
                    notes += "\nContact Person : " + inquiry.personName;
                if (inquiry.mobileNo)
                    notes += ", Mobile NO : " + inquiry.mobileNo;
                if (inquiry.notes)
                    notes += "\nNotes : " + inquiry.notes;

                return notes;
            };

            if (inquiry) {
                vm.lead = {
                    status: stage == 2 ? 20 : 31,
                    stage: stage,
                    company: { id: inquiry.companyId, name: inquiry.companyName },
                    tenant: inquiry.tenant,
                    title: inquiry.companyName,
                    contactPerson: inquiry.personName ? { id: 0, name: inquiry.personName } : null,
                    notes: generateNotes(),
                };

                vm.resources = [];

                //if (inquiry.product)
                //vm.resources.push({ id: inquiry.productId, name: inquiry.product.displayName, code: inquiry.product.name });
                //vm.resourcesChanged();
            }

            vm.save = function () {
                debugger
                vm.saving = true
                vm.loading = true;

                const leadDto = angular.copy(vm.lead);

                if (leadDto.salesPersonUser)
                    leadDto.salesPersonUserId = leadDto.salesPersonUser.id;

                if (leadDto.tenant)
                    leadDto.tenantId = leadDto.tenant.id;
                if (leadDto.campaign)
                    leadDto.campaignId = leadDto.campaign.id;
                if (leadDto.product)
                    leadDto.productId = leadDto.product.id;
                leadDto.productIds = [];
                if (leadDto.productId) {
                    leadDto.productIds.push(leadDto.productId);
                }
                leadDto.product = null;
                leadDto.contactPerson = null;
                leadDto.salesPersonUser = null;
                leadDto.tenant = null;

                const input = {
                    lead: leadDto,
                    inquiryId: null,
                    companyName: null
                };

                if (inquiry) {
                    if (inquiry.personName)
                        input.lead.contactPerson = { firstName: inquiry.personName, contactNo: inquiry.mobileNo, email: inquiry.personEmail };
                    input.inquiryId = inquiry.id;
                    input.lead.isProcessed = true;

                    if (inquiry.companyId || vm.lead.company.id) {
                        input.lead.companyId = vm.lead.company.id;
                        input.lead.company = null;
                    }
                    else {
                        input.companyName = inquiry.companyName;
                    }
                }
                else {
                    input.lead.companyId = input.lead.company.id;
                    input.lead.company = null;
                }

                leadService.createOrUpdateCRMLead(input).success(function () {
                    abp.notify.info('Saved Successfully');
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    vm.loading = false;
                });

            };

            vm.subscriptionTypes = [
                { id: 1, name: 'Yearly' },
                { id: 2, name: 'Monthly ' }
            ];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.clearSalesPersonUser = function () {
                vm.lead.salesPersonUserId = null;
                vm.lead.salesPersonUser = null;
            };

            //const getUser = (userId) => userService.getUser({ id: userId }).success((user) => vm.lead.salesPersonUser = user);

            function getProducts() {
                vm.loading = true;

                productService.getCRMProducts().success(function (result) {
                    vm.products = result;
                    vm.loading = false;
                }).finally(function () {
                    vm.loading = false;
                });

                // TBD with sir...
                //commonLookupService.getEditionsForCombobox({}).success(function (result) {
                //    vm.products = result.items;
                //    vm.loading = false;
                //});
            };

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.searchContactPerson = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, companyId: vm.lead.companyId }).then(function (response) {
                    vm.contactPersons = response.data.items;
                });
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.allStatuses = [{ id: 1, name: 'Due' },
            { id: 2, name: 'Processed' },
            { id: 3, name: 'Converted' },
            { id: 4, name: 'Not Suitable' },
            { id: 10, name: 'New' },
            { id: 11, name: 'Suitable' },
            { id: 12, name: 'Not Suitable' },
            { id: 20, name: 'New' },
            { id: 21, name: 'Dull Deal' },
            { id: 22, name: 'Rejected Sale' },
            { id: 23, name: 'Not Suitable' },
            //{ id: 30, name: 'New' },
            { id: 31, name: 'Active' },
            { id: 32, name: 'Hot' },
            { id: 33, name: 'Final' },
            { id: 34, name: 'Closed' }];
            vm.statuses = [];
            vm.getAgreementTypeName = function (typeId) {
                switch (typeId) {
                    case 1: return 'Daily';
                    case 2: return 'Weekly';
                    case 3: return 'Monthly';
                    case 4: return 'Lease';
                    case 5: return 'LeaseToOwn';
                    case 6: return 'Hourly';
                    default: return 'N/A';
                }
            };

            function getStatuses() {
                if (stage === 0 || stage === null || stage === undefined) {
                    vm.statuses = vm.allStatuses.filter(f => f.id < 10);//old data
                }
                else if (stage === 1) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                }
                else if (stage === 2) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                }
                else if (stage === 3) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                }
            }
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            vm.getTeriffGroups = function () {
                //vm.loading = true;

                commonLookupService.getTariffGroups({ inActive: false }).success(function (data) {
                    vm.tariffGroups = data.items;
                });

            };

            function init() {
                vm.getTariffGroups();
                if (leadId) {
                    vm.loading = true;
                    leadService.getCRMLeadForEdit({ id: leadId })
                        .success(function (result) {
                            vm.lead = result;


                            if (vm.lead && vm.lead.inquiryLines) {
                                angular.forEach(vm.lead.inquiryLines, function (line) {
                                    if (line.vehicleModelId && line.vehicleModelName) {
                                        line.vehicleModel = {
                                            id: line.vehicleModelId,
                                            name: line.vehicleModelName,
                                            make: { name: line.makeName || '' }
                                        };
                                    }

                                    if (line.vehicleTypeId && line.vehicleTypeName) {
                                        line.vehicleType = {
                                            id: line.vehicleTypeId,
                                            title: line.vehicleTypeName
                                        };
                                    }
                                });
                            }
                            vm.loading = false;



                            vm.lead.productId = vm.lead.productId + "";
                            vm.resources = result.products;
                            vm.lead.productIds = [];
                            vm.resources.forEach(function (resource) {
                                vm.lead.productIds.push(resource.id);
                            });

                            if (result.products && result.products.length > 0) {
                                vm.lead.product = result.products[0];
                            }

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }


                if (inquiry) {

                    if (!marketingManagerUserId || !salesManagerUserId) {
                        abp.message.error('Marketing Manager & Sales Manager must be provide in settings.')
                    }

                    const salesUserIdFromSettings = stage == 2 ? marketingManagerUserId : salesManagerUserId;
                    // getUser(salesUserIdFromSettings);
                    //vm.lockSalesPersonControl = true;
                }
            }
            //vm.getbusinessDivisions = function () {
            //    vm.loading = true;
            //    businessDivisionService.getBusinessDivisions().success(function (data) {
            //        vm.businessDivisions = data.items
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}
            //vm.getbusinessDivisions();
            getStatuses();
            //getProducts();
            init();
        }
    ]);
