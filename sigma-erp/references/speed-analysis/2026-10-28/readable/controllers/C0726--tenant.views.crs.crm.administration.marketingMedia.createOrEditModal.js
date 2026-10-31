// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:187932-188076
appModule.controller('tenant.views.crs.crm.administration.marketingMedia.createOrEditModal', ['$uibModal', '$uibModalInstance', 'abp.services.app.directory',
        'marketingMediaId', 'abp.services.app.commonLookup', 'utilities', 'options', 'abp.services.app.cRMMarketingMedia',

        function ($uibModal, $uibModalInstance, directoryService, marketingMediaId, lookupService, utilities, options, marketingMediaService) {
            var vm = this;

            vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
            vm.referralIsEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseInquiry_CustomField1"));
            vm.isEditMode = false;
            vm.marketingMediaId = marketingMediaId || null;
            vm.customers = [];

            vm.marketingMedia = {
                id: null,
                name: null,
                mediaType: 1,
                isActive: true,
                description: null
            };

            vm.marketingMediaStatuses = [
                { type: "Planned", id: 1 },
                { type: "Active", id: 2 },
                { type: "Paused", id: 3 },
                { type: "Completed", id: 4 },
                { type: "Cancelled", id: 5 },
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

            };







            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                debugger



                vm.saving = true;
                if (vm.marketingMediaId) {

                    marketingMediaService.editCRMMarketingMedia(
                        vm.marketingMedia
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
                else {
                    marketingMediaService.addCRMMarketingMedia(
                        vm.marketingMedia
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    })
                }
            };

            vm.GetEnums = function () {

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

            function init() {
                debugger

                if (vm.marketingMediaId) {
                    vm.loading = true;

                    marketingMediaService.getCRMMarketingMediaForEdit(vm.marketingMediaId).success(function (data) {
                        vm.isEditMode = true;
                        vm.marketingMedia = data;
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
