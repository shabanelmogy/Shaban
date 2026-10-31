// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:189073-189162
appModule.controller('tenant.views.crs.crm.marketing.campaign.addProspectsModal', [
        'utilities', '$uibModalInstance', '$uibModal', 'existingProspects', 'abp.services.app.person', 'abp.services.app.cRMCampaign','campaignId',
        function (utilities, $uibModalInstance, $uibModal, existingProspects, personService, campaignService, campaignId) {
            var vm = this;
            vm.filters = {
                code: '',
                name: '',
                status: null,
                customField4: '',
                locationId: null,
                skipCount: 0,
                maxResultCount: 20,
            };
            vm.campaignId = campaignId || null;
            vm.prospects = null;
            // Dummy prospects data
            //vm.allProspects = [
            //    {
            //        id: 1, code: 'P001', firstName: 'John', lastName: 'Doe', nameToShow: 'John Doe',
            //        mobileNo: '1234567890', contactNo: '1234567890', email: 'john@gmale.com', selected: false
            //    },
            //    {
            //        id: 2, code: 'P002', firstName: 'Jane', lastName: 'Smith', nameToShow: 'Jane Smith',
            //        mobileNo: '9876543210', contactNo: '9876543210', email: 'jane@gmale.com', selected: false
            //    },
            //    {
            //        id: 3, code: 'P003', firstName: 'Robert', lastName: 'Johnson', nameToShow: 'Robert Johnson',
            //        mobileNo: '5551234567', contactNo: '5551234567', email: 'robert@gmale.com', selected: false
            //    },
            //    {
            //        id: 4, code: 'P004', firstName: 'Emily', lastName: 'Williams', nameToShow: 'Emily Williams',
            //        mobileNo: '4445556666', contactNo: '4445556666', email: 'emily@gmale.com', selected: false
            //    },
            //    {
            //        id: 5, code: 'P005', firstName: 'Michael', lastName: 'Brown', nameToShow: 'Michael Brown',
            //        mobileNo: '7778889999', contactNo: '7778889999', email: 'michael@gmale.com', selected: false
            //    }
            //];

            // Filter out already selected prospects
            //vm.prospects = vm.allProspects.filter(function (prospect) {
            //    return !existingProspects.some(function (existing) {
            //        return existing.id === prospect.id;
            //    });
            //});

            vm.addSelectedProspects = function () {
                debugger
                var selectedProspects = vm.prospects.filter(p => p.selected);
                var input = {
                    crmCampaignId: vm.campaignId,
                    prospectIds: selectedProspects.map(p => p.id)
                };

                vm.loading = true;
                campaignService.addProspectToCampaign(input).success(function (data) {
                    $uibModalInstance.close(selectedProspects);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getProspects = function () {
                vm.loading = true;
                // personService.getPerson({ filter: vm.filterText }).success(function (data) {
                personService.getPerson(vm.filters).success(function (data) {

                    //vm.gridOptions.totalItems = data.totalCount;
                    vm.prospects = data.items.filter(function (prospect) {
                return !existingProspects.some(function (existing) {
                    return existing.id === prospect.id;
                });
            });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getProspects();
            }


            init();
        }
    ]);
