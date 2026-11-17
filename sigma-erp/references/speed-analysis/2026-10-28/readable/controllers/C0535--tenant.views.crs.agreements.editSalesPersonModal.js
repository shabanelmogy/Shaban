// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:141442-141559
appModule.controller('tenant.views.crs.agreements.editSalesPersonModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.staff', 'abp.services.app.directory', 'abp.services.app.agreement','agreementId', 'abp.services.app.commonLookup',
        function ($scope, $filter, $uibModal, $uibModalInstance, staffService, directoryService, agreementService, agreementId, commonLookupService,) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.loading = false;
            vm.save = false;
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

            vm.clearSalesPerson = function () {
                vm.agreement.salesPerson = null;
                vm.agreement.salesPersonId = null;
            };

            vm.save = function () {
                vm.saving = true;

                if (vm.agreement.salesPerson != null) {
                    vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                } else {
                    vm.agreement.salesPersonId = null;
                }

                agreementService.updateSalesPerson({
                    agreement: vm.agreement,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.agreement.id);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.searchSalesPersonWithDesignation({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            function getSalesPerson(agreement) {

                if (agreement)
                    if (agreement.customer && !agreement.salesPersonId)
                        if (agreement.customer.salesPersonId) {
                            staffService.getStaffForEdit({
                                id: agreement.customer.salesPersonId
                            }).success(function (result) {

                                vm.salesPerson = {
                                    name: result.name,
                                    id: result.id,
                                    code: result.code
                                };

                                if (vm.agreement.salesPersonId != null) {
                                    vm.agreement.salesPerson = vm.salesPerson;
                                    vm.agreement.salesPersonId = vm.salesPerson.id;
                                }
                                else {
                                    vm.agreement.salesPersonId = null;
                                }
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }

            }


            function init() {
                vm.loading = true;
                getLocations();
                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result.agreement;

                    if (vm.agreement != null) {
                        getSalesPerson(vm.agreement);
                    }

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
