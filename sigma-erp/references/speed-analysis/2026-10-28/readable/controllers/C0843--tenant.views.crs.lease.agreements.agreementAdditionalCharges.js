// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225753-225917
appModule.controller('tenant.views.crs.lease.agreements.agreementAdditionalCharges', ['$uibModal', 'abp.services.app.vehicle', 'agreementId', 'abp.services.app.agreementAdditionalCharges', '$uibModalInstance', 'abp.services.app.movement', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.chargesSetting', 'utilities',
        function ($uibModal, vehicleService, agreementId, agreementAdditionalChargesService, $uibModalInstance, movementService, commonLookupService, directoryService, chargesSettingService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.additionalCharges = [];
            vm.additionaldrivers = [];

            vm.rateTypes = [{ id: 3, name: app.localize('/Month') }, { id: 6, name: app.localize('OneTime') }];

            vm.searchAdditionalDrivers = function ($select) {
                //whereas contactCategory: 1 (person). contactType: 2 (customer) get individual customers/drivers
                return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 2 }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };
            vm.permissions = {
                add: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges.Delete'),
            };

            vm.searchAdditionalDriverPopoup = function (row) {
                var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        row.driver = result;
                });
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }
            vm.addRow = function () {
                vm.additionalCharges.push({
                    chargesTypeId: null,
                    rateTypeId: null,
                    date: moment(),
                    fromDate: null,
                    toDate: null,
                    rate: null,
                });
            };

            vm.removeRow = function (row) {
                var index = vm.additionalCharges.indexOf(row);
                vm.additionalCharges.splice(index, 1);
            };


            vm.getAgreementTypeName = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3) {
                    return "Monthly";
                } else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function validate() {
                var isValid = true;
                for (i = 0; i < vm.additionalCharges.length; i++) {
                    var rowDate = angular.copy(vm.additionalCharges[i].date)
                    if (vm.additionalCharges[i].rateTypeId == 3
                        && rowDate.add(vm.additionalCharges[i].units, 'M') > moment(vm.agreementEndDate)) {
                        isValid = false;
                        break;
                    }
                }
                return isValid;
            };

            vm.save = function () {

                vm.additionalCharges.forEach(function (row) {
                    row.date = moment(row.date).startOf('day');
                });
                if (validate()) {
                    vm.saving = true;
                    vm.additionalCharges.forEach(function (row) {
                        if (row.driver != null) {
                            row.driverId = row.driver.id;
                            row.driver.firstName = row.driver.name;
                            // row.driver = null;
                        }
                    });
                    agreementAdditionalChargesService.saveAdditionalAgreementCharges({
                        agreementId: agreementId,
                        additionalCharges: vm.additionalCharges
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info("Additional Charges Can Not Saved Due To Invalid Periods");
                }

            };
            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: 2 }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            //function getChargesTypes() {
            //    vm.loading = true;
            //    chargesSettingService.getChargesTypes().success(function (data) {
            //        vm.chargesTypes = data;
            //        angular.forEach(vm.chargesTypes, function (value, key) {
            //            if (value.detail != null) value.name = value.name + ' (' + value.detail + ')';
            //        });

            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            function init() {
                vm.loading = true;
                agreementAdditionalChargesService.getAdditionalAgreementCharges({
                    id: agreementId
                }).success(function (result) {
                    vm.additionalCharges = result.additionalCharges;
                    vm.agreementEndDate = utilities.jsonUtcDateToLocalMoment(result.endDate);
                    getChargesTypes();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
