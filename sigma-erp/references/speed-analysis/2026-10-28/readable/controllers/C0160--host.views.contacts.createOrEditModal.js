// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62204-62291
appModule.controller('host.views.contacts.createOrEditModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.country', 'abp.services.app.personHost', 'personId', 'abp.services.app.directory', 'abp.services.app.designation',
        function ($scope, $filter, $uibModal, $uibModalInstance, countryService, personHostService, personId, directoryService, designation) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.selectedCountry = null;
            vm.selectedNationality = null;
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.MissingTypes = [2, 3, 4];
            vm.filters = {
                name: '',
                //nationality:''
            };
            var scan = null;

            vm.searchCompany = function ($select) {
                return directoryService.search({ keyword: $select.search, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            vm.getDesignations = function () {
                designation.getDesignations().success(function (result) {
                    vm.designations = result.items;
                });
            }

            vm.save = function () {
                vm.saving = true;
                if (vm.selectedCountry != null) vm.person.address.country = vm.selectedCountry.name;
                if (vm.selectedNationality != null) vm.person.nationality = vm.selectedNationality.name;
                if (vm.selectedCompany != null) vm.person.companyName = vm.selectedCompany.name;

                personHostService.createOrUpdateContact({ person: vm.person }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.searchCountries = function (filter) {
                vm.filters.name = filter;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };


            function init() {
                vm.getDesignations();

                personHostService.getContactForCreateOrUpdate({
                    id: personId
                }).success(function (result) {
                    vm.person = result;
                    if (vm.person.address.country != null) vm.selectedCountry = { name: vm.person.address.country };
                    if (vm.person.nationality != null) vm.selectedNationality = { name: vm.person.nationality };

                    if (vm.person.companyName != null) {
                        vm.selectedCompany = { name: vm.person.companyName };
                    }
                    else {
                        vm.selectedCompany = vm.person.company;
                    }

                    if (vm.person.id > 0) {
                        vm.isEditMod = true;
                    } else {
                        vm.isEditMod = false;
                    }
                });
            }

            init();
        }
    ]);
