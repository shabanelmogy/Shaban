// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445342-445409
appModule.controller('tenant.views.mcc.customers.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.person', 'abp.services.app.country', 'utilities','customerId',
        function ($scope, $uibModalInstance, personService, countryService, utilities, customerId) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.person = {};
            vm.filters = {
                name: ''
            };
            vm.selectedCountry = null;
            vm.selectedNationality = null;
            vm.genders = [{ id: 1, name: app.localize('Male') }, { id: 2, name: app.localize('Female') }];
            vm.save = function () {
                vm.saving = true;
                vm.person.nationality = vm.selectedNationality != null ? vm.selectedNationality.name : null;
                vm.person.country = vm.selectedCountry != null ? vm.selectedCountry.name : null;
                
                if (customerId > 0) {
                    vm.person.id = customerId;
                }
                personService.addOrEditCutomerForVMIRental(vm.person).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };
            vm.searchCountries = function (filter) {

                vm.filters.name = filter;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            function getGender(id) {
                if (id === 1)
                    vm.gender = "Male";
                if (id === 2)
                    vm.gender = "Female";

            };
            function init() {
                if (customerId > 0) {
                    personService.getCustomerForEditForVMIRental(customerId).success(function (result) {
                        vm.person = result;
                        if (vm.person.id > 0) {
                            vm.isEditMod = true;
                            vm.selectedCountry = { name: vm.person.country};
                            vm.selectedNationality = { name: vm.person.nationality};
                        } else {
                            vm.isEditMod = false;
                        }
                    });
                }
            }

            init();
        }
    ]);
