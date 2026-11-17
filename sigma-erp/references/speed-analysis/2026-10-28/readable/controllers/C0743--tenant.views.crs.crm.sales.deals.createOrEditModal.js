// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:193071-193523
appModule.controller('tenant.views.crs.crm.sales.deals.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleModel', 'abp.services.app.cRMDeal', 'leadId', 'stage', 'abp.services.app.user', 'abp.services.app.commonLookup',
        'abp.services.app.directory', 'abp.services.app.cRMProduct', 'abp.services.app.tenant', 'inquiry', 'abp.services.app.cRMCampaign', 'abp.services.app.commonLookup', 'abp.services.app.leaseQuotation',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, vehicleModelService, dealService, leadId, stage, userService, commonLookupService, directoryService, productService, tenantService, inquiry, campaignService, lookupService, leaseQuotationService) {

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
                vm.deal.inquiryLines.push(inquiryLineObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.deal.inquiryLines.indexOf(obj);
                vm.deal.inquiryLines.splice(index, 1);

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
            //vm.deal = inquiry;
            vm.deal = {
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
            //    vm.deal.productIds = [];
            //    vm.resources.forEach(function (resource)
            //    {
            //        vm.deal.productIds.push(resource.id);
            //    });
            //    vm.hostProducts = [];
            //}
            vm.onProductChanged = function () {
                if (vm.deal.product) {
                    vm.deal.products = [vm.deal.product];
                    vm.deal.productId = vm.deal.product.id;
                    //vm.deal.productId = vm.deal.product.id;
                } else {
                    vm.deal.productId = null;
                }
            };

            vm.onCampaignChanged = function () {
                vm.resources = [];
                vm.deal.model = vm.deal.campaign.model;
                vm.deal.tariffGroup = vm.deal.campaign.tariffGroup;
                vm.resources.push(vm.deal.campaign.product);
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
                vm.deal = {
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

                const dealDto = angular.copy(vm.deal);

                if (dealDto.salesPersonUser)
                    dealDto.salesPersonUserId = dealDto.salesPersonUser.id;

                if (dealDto.tenant)
                    dealDto.tenantId = dealDto.tenant.id;
                if (dealDto.campaign)
                    dealDto.campaignId = dealDto.campaign.id;
                if (dealDto.product)
                    dealDto.productId = dealDto.product.id;
                dealDto.productIds = [];
                if (dealDto.productId) {
                    dealDto.productIds.push(dealDto.productId);
                }
                dealDto.product = null;
                dealDto.contactPerson = null;
                dealDto.salesPersonUser = null;
                dealDto.tenant = null;

                if (dealDto.inquiryLines && dealDto.inquiryLines.length > 0) {
                    dealDto.inquiryLines = dealDto.inquiryLines.map(function (line) {
                        return {
                            id: line.id || 0,
                            quotationId: dealDto.quotationId,
                            vehicleModelId: line.vehicleModel ? line.vehicleModel.id : line.vehicleModelId,
                            vehicleModelName: line.vehicleModel
                                ? (line.vehicleModel.make.name + ' ' + line.vehicleModel.name)
                                : line.vehicleModelName,
                            vehicleTypeId: line.vehicleType ? line.vehicleType.id : line.vehicleTypeId,
                            vehicleTypeName: line.vehicleType ? line.vehicleType.title : line.vehicleTypeName,
                            quantity: line.quantity || 0,
                            years: line.years || 0
                        };
                    });
                }
                const input = {
                    lead: dealDto,
                    inquiryId: null,
                    companyName: null
                };

                if (inquiry) {
                    if (inquiry.personName)
                        input.lead.contactPerson = { firstName: inquiry.personName, contactNo: inquiry.mobileNo, email: inquiry.personEmail };
                    input.inquiryId = inquiry.id;
                    input.lead.isProcessed = true;

                    if (inquiry.companyId || vm.deal.company.id) {
                        input.lead.companyId = vm.deal.company.id;
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

                dealService.createOrUpdateCRMDeal(input).success(function () {
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
                vm.deal.salesPersonUserId = null;
                vm.deal.salesPersonUser = null;
            };

            //const getUser = (userId) => userService.getUser({ id: userId }).success((user) => vm.deal.salesPersonUser = user);

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
                return directoryService.search({ keyword: $select.search, companyId: vm.deal.companyId }).then(function (response) {
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
            { id: 21, name: 'Dull lead' },
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
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//lead
                }
                else if (stage === 3) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//lead
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
            function loadLeaseQuotation(quotationId) {
                leaseQuotationService.getQuotationForEdit({ id: quotationId })
                    .success(function (result) {
                        var quotation = result;
                        vm.deal.quotationNo = quotation.quotationNo;
                        // 🔹 Map quotationLines to match the table structure
                        vm.deal.inquiryLines = [];

                        if (quotation.quotationLines && quotation.quotationLines.length > 0) {
                            quotation.quotationLines.forEach(function (line) {
                                vm.deal.inquiryLines.push({
                                    id: line.id,
                                    quotationId: line.quotationId,
                                    vehicleModel: line.vehicleModel,  // already has make + name
                                    vehicleType: line.vehicleType,
                                    quantity: line.quantity,
                                    years: line.years
                                });
                            });
                        } else {
                            vm.deal.inquiryLines = [];
                        }

                        // You can also store full quotation for reference
                        //vm.deal.quotation = quotation;
                    })
                    .error(function (err) {
                        console.error("Failed to load quotation:", err);
                        abp.message.error("Unable to load lease quotation.");
                    });
            }

            function init() {

                vm.getTariffGroups();
                vm.getTeriffGroups();
                if (leadId) {
                    vm.loading = true;
                    dealService.getCRMDealForEdit({ id: leadId })
                        .success(function (result) {
                            vm.deal = result;

                            // 🔹 If this lead is in lead stage and has a quotation → load quotation lines




                            vm.deal.productId = vm.deal.productId + "";
                            vm.resources = result.products;
                            vm.deal.productIds = [];
                            vm.resources.forEach(function (resource) {
                                vm.deal.productIds.push(resource.id);
                            });

                            if (result.products && result.products.length > 0) {
                                vm.deal.product = result.products[0];
                            }
                            if (vm.deal.quotationId) {
                                loadLeaseQuotation(vm.deal.quotationId);
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
