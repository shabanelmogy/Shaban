// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:61904-62006
appModule.controller('host.views.companies.report', [
        '$scope', 'abp.services.app.companyHost', '$uibModal', '$uibModalInstance', 'filters',
        function ($scope, companyHostService, $uibModal, $uibModalInstance, filters) {
            var vm = this;

            vm.filters = filters;
            debugger
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Companies.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Companies.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Companies.Delete'),
            };

            vm.companies = new Array();

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getCompaniesHostForReport = function () {
                vm.loading = true;
                companyHostService.getCompaniesHostForReport(vm.filters).success(function (data) {
                    vm.companies = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.allBoxTicked = function () {
                if (vm.companies === null) return;
                angular.forEach(vm.companies, function (row) {
                    row.generate = vm.tickAllBox;
                });
            };

            vm.getSelectedEmailCount = function () {
                if (vm.companies)
                    return vm.companies.filter(e => e.generate === true).length;
                else
                    return 0;
            };

            vm.sendEmail = function () {
                var selectCompanies = vm.companies.filter(e => e.generate === true);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/email.cshtml',
                    controller: 'host.views.companies.email as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        Companies: function () {
                            return selectCompanies;
                        }
                    }
                });
            }

            vm.editCompanyContact = function (companyContacts) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/createOrEditModal.cshtml',
                    controller: 'host.views.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyContacts.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCompaniesHostForReport();
                });
            };

            function openCreateOrEditCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/companies/createOrEditModal.cshtml',
                    controller: 'host.views.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCompaniesHostForReport();
                });
            }


            vm.createCompany = function () {
                openCreateOrEditCompanyModal(null);
            };

            function init() {
                vm.getCompaniesHostForReport();
            }
            init();
        }
    ]);
