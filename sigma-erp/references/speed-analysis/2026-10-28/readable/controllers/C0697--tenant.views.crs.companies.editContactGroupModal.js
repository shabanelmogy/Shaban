// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:181435-181524
appModule.controller('tenant.views.crs.companies.editContactGroupModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.company', 'companyId', '$filter', '$uibModal', 'abp.services.app.contactGroup', 'abp.services.app.commonLookup',
        function ($scope, $uibModalInstance, companyService, companyId, $filter, $uibModal, contactGroupService, commonLookupService, ) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.contactCardpermissions = {
                edit: abp.auth.hasPermission('Pages.Tenant.Customers.ContactCards.Edit'),
            };
            vm.options = {
                format: vm.dateFormat,
                maxDate: moment().endOf('day')
            };
            vm.loading = false;
            vm.company = {
                emailInvoices: true,
                contactPersons: new Array(),
                verified: true
            };

            vm.locations = [];
            
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM');
                }
                else {
                    return "";
                }
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.save = function () {
               
                vm.saving = true;
                companyService.updateContactGroupCompanies({
                    company: vm.company,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
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
                companyService.getCompanyForEdit({
                    id: companyId
                }).success(function (result) {
                    vm.company = result;
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
