// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:60519-60594
appModule.controller('host.views.companies.ContactBranch', [
        '$scope', '$uibModal', '$uibModalInstance', 'ContactId', 'abp.services.app.companyHost','CompanyName',
        function ($scope, $uibModal, $uibModalInstance, ContactId, companyHostService, CompanyName) {

            var vm = this;
            vm.loading = true;
            vm.ContactBranchList = null;
            vm.CompanyName = CompanyName;

            function getContactBranchData() {
                vm.loading = true;
                companyHostService.getContactBranch(ContactId).success(function (result) {
                    vm.ContactBranchList = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.CreateContactBranch = function () {
                openCreateOrUpdateContactBranchModal(ContactId, CompanyName,null);
            };
            vm.UpdateContactBranch = function (ContactBranchData) {
                openCreateOrUpdateContactBranchModal(ContactId, CompanyName, ContactBranchData);
            };
           

            vm.DeleteContactBranch = function (DeleteData) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            debugger
                            companyHostService.deleteContactBranch(DeleteData).success(function () {
                                init();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function openCreateOrUpdateContactBranchModal(ContactId, CompanyName,ContactBranchData) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/createOrEditContactBranchModal.cshtml',
                    controller: 'host.views.companies.createOrEditContactBranchModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        ContactId: function () {
                            return ContactId;
                        },
                        CompanyName: function () {
                            return CompanyName;
                        },
                        ContactBranchData: function () {
                            return ContactBranchData;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            }
          

            vm.cancel = function () {
                     $uibModalInstance.close();
             };

            function init() {
                getContactBranchData();
            }
            init();
        }
    ]);
