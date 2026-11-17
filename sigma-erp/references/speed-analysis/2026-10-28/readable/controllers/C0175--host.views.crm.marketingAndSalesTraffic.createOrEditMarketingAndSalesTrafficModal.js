// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64807-64910
appModule.controller('host.views.crm.marketingAndSalesTraffic.createOrEditMarketingAndSalesTrafficModal', [
        '$scope','$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.inquiry', 'abp.services.app.tenant', 'abp.services.app.user',
        function ($scope, $uibModal, $uibModalInstance, directoryService, commonLookupService, inquiryService, tenantService, userService) {

            var vm = this;
            vm.loading = false;
            vm.filters = {
                editionId: null,
                companyId: null,
            };

            vm.inquiry = {};

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            function getEditions() {
                vm.loading = true;
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                }).finally(function () {
                    vm.loading = false;
                });

            }


            vm.searchCompaniesPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2, false);
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.inquiry.companyId = result.id;
                        vm.inquiry.companyName = result.name;
                       // vm.customerSelected();
                    }
                });
            };

            function openSearchContactModel(category, type, isOnlyCorporate) {
                if (vm.isSagX3Enabled) {
                    category = 1;
                }

                //var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;

                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: null
                            }
                        }
                    }
                });
            }


            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.inquiry.channel = 3;
                inquiryService.createInquiry({ inquiry: vm.inquiry }).success(function () {
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

                getEditions();

            }

            vm.companyChanged = function () {
                if (vm.company.id) {
                    vm.inquiry.companyId = vm.company.id;
                    vm.inquiry.companyName = vm.company.companyName;
                    vm.inquiry.companyEmail = vm.company.email;
                    vm.inquiry.contactNo = vm.company.contactNo;
                }
            }

            init();
        }
    ]);
