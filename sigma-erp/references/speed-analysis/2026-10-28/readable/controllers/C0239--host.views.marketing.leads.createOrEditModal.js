// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:74063-74344
appModule.controller('host.views.marketing.leads.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.lead', 'leadId', 'stage', 'abp.services.app.user', 'abp.services.app.commonLookup', 
        'abp.services.app.directory', 'abp.services.app.hostProduct', 'abp.services.app.tenant', 'inquiry', 'abp.services.app.businessDivision',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, countryService, leadService, leadId, stage, userService, commonLookupService, directoryService, productService, tenantService, inquiry, businessDivisionService)
        {

            var vm = this;
            vm.loading = true;
            //vm.isExistingCustomer = false;
            vm.resources = [];
            vm.hostProducts = [];
            //vm.lockSalesPersonControl = false;
            vm.businessName = utilities.divisionName();
            
            const marketingManagerUserId = parseInt(abp.setting.get("App.UserManagement.MarketingManagerUserId"));
            const salesManagerUserId = parseInt(abp.setting.get("App.UserManagement.SalesManagerUserId"));

            vm.users = [];

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
                status: 1,
                stage: stage
            };
            vm.saving = false;
            vm.searchProducts = function ($select)
            {
                if ($select.search == "")
                    return null;
                productService.searchProducts({ keyword: $select.search }).then(function (response)
                {
                    vm.hostProducts = response.data;
                    console.log("host products");
                    console.log(vm.hostProducts);
                });
            };

            vm.resourcesChanged = function ()
            {
                vm.lead.productIds = [];
                vm.resources.forEach(function (resource)
                {
                    vm.lead.productIds.push(resource.id);
                });
                vm.hostProducts = [];
            }

            const generateNotes = function ()
            {
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

            vm.save = function ()
            {
                vm.saving = true
                vm.loading = true;
                
                const leadDto = angular.copy(vm.lead);

                if (leadDto.salesPersonUser)
                    leadDto.salesPersonUserId = leadDto.salesPersonUser.id;

                if (leadDto.tenant)
                    leadDto.tenantId = leadDto.tenant.id;

                leadDto.product = null;
                leadDto.contactPerson = null;
                leadDto.salesPersonUser = null;
                leadDto.tenant = null;

                const input = {
                    lead: leadDto,
                    inquiryId: null,
                    companyName: null
                };
                input.lead.isExistingCustomer = vm.lead.isExistingCustomer;
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

                leadService.createOrUpdateLead(input).success(function ()
                {
                    abp.notify.info('Saved Successfully');
                    $uibModalInstance.close();
                }).finally(function ()
                {
                    vm.saving = false;
                    vm.loading = false;
                });

            };

            vm.subscriptionTypes = [
                { id: 1, name: 'Yearly' },
                { id: 2, name: 'Monthly ' }
            ];

            vm.cancel = function ()
            {
                $uibModalInstance.dismiss();
            };

            vm.clearSalesPersonUser = function ()
            {
                vm.lead.salesPersonUserId = null;
                vm.lead.salesPersonUser = null;
            };

            //const getUser = (userId) => userService.getUser({ id: userId }).success((user) => vm.lead.salesPersonUser = user);

            vm.searchCompanies = function ($select)
            {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response)
                {
                    vm.companies = response.data.items;
                });
            };
            vm.searchContactPerson = function ($select)
            {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, companyId: vm.lead.companyId }).then(function (response)
                {
                    vm.contactPersons = response.data.items;
                });
            };

            vm.searchUsers = function ($select)
            {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response)
                {
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

            function getStatuses()
            {
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
            vm.searchTenants = function ($select)
            {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response)
                {
                    vm.tenants = response.data.items;
                });
            };

            function init()
            {
                if (leadId) {
                    vm.loading = true;
                    leadService.getLeadForEdit({
                        id: leadId
                    }).success(function (result)
                    {

                        vm.lead = result;
                        vm.lead.productId = vm.lead.productId + "";
                        vm.resources = result.products;
                        vm.lead.productIds = [];
                        vm.resources.forEach(function (resource)
                        {
                            vm.lead.productIds.push(resource.id);
                        });
                        //var product = vm.lead.product;
                        //vm.lead.product = { value: product.id, displayText: product.displayName };
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
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getbusinessDivisions();
            getStatuses();
            init();
        }
    ]);
