// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:184126-184207
appModule.controller('tenant.views.crs.contacts.editContactGroupModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.person', 'personId', 'isFromSearchScreen',
        'abp.services.app.contactGroup', 'abp.services.app.commonLookup',
        function ($scope, $filter, $uibModal, $uibModalInstance, personService, personId, isFromSearchScreen,
            contactGroupService, commonLookupService,) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.loading = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.locations = [];

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };
            vm.save = function () {

                vm.saving = true;
                personService.updatePersonContactGroup({
                        person: vm.person,
                    }).success(function () {
                        if (!isFromSearchScreen) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        } else {
                            $uibModalInstance.close(vm.person);
                        }
                    }).finally(function () {
                        vm.saving = false;
                    });
                    vm.saving = false;
                
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getContactGroups() {
                vm.loading = true;
                contactGroupService.getContactGroupsOnContactType({ contactType: 2 }).success(function (result) {
                    vm.contactGroups = $filter('filter')(result.items, {
                        isDefault: false
                    }, true);

                }).finally(function () { vm.loading = false; });
            }
            function init() {
                vm.loading = true;
                getLocations();
                personService.getPersonForEdit({
                    id: personId
                }).success(function (result) {
                        vm.person = result;
                        getContactGroups();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            init();
        }
    ]);
