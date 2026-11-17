// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:133994-134171
appModule.controller('tenant.views.crs.agreements.agreementAdditionalCharges', ['$uibModal', 'abp.services.app.vehicle', 'agreementId', 'abp.services.app.agreementAdditionalCharges', '$uibModalInstance', 'abp.services.app.movement', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.chargesSetting', 'utilities',
        function ($uibModal, vehicleService, agreementId, agreementAdditionalChargesService, $uibModalInstance, movementService, commonLookupService, directoryService, chargesSettingService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.additionalCharges = [];
            vm.additionaldrivers = [];

            vm.rateTypes = [{ id: 1, name: app.localize('/Day') }, { id: 2, name: app.localize('/One Time') }];

            vm.searchAdditionalDrivers = function ($select) {
                //whereas contactCategory: 1 (person). contactType: 2 (customer) get individual customers/drivers
                return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 2 }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };
            vm.permissions = {
                add: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalCharges.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalCharges.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalCharges.Delete'),
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
                    notes: null,
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

            vm.calculateCharges = function (row) {
                    if (row.rateTypeId == 1) {
                        if (row.toDate != null) {
                        var start = moment.utc(row.fromDate).startOf('day'); //todays date
                        var end = moment.utc(row.toDate).startOf('day'); // another date
                            var days = end.diff(start, 'days') + 1;
                        row.charges = days > 0 ? days * row.rate : 0;
                    }
                }
                    else if (row.rateTypeId == 2) {
                        row.charges = row.rate;
                    }
                              
                else {
                    row.charges = 0;
                }
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
                    var rowDate=angular.copy(vm.additionalCharges[i].date)
                    if (vm.additionalCharges[i].rateTypeId == 3
                        && rowDate.add(vm.additionalCharges[i].units, 'M') > moment(vm.agreementEndDate)) {
                        isValid = false;
                        break;
                    }
                    else if (vm.additionalCharges[i].toDate < vm.additionalCharges[i].fromDate) {
                        isValid = false;
                        break;
                    }
                }                    
                return isValid;
            };

            vm.save = function () {

                vm.additionalCharges.forEach(function (row) {
                    row.fromDate = moment(row.fromDate).startOf('day');
                    row.toDate = moment(row.toDate).startOf('day');
                });
                if (validate()) {
                    vm.saving = true;
                    vm.additionalCharges.forEach(function (row) {
                        if (row.driver != null) {

                            row.driverId = row.driver.id;
                            row.driver = null;
                        }
                    });
                    agreementAdditionalChargesService.saveAdditionalRentalAgreementCharges({
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
                chargesSettingService.getConfiguredChargesTypes({ module: 1 }).success(function (data) {
                    vm.chargesTypes = data.items;
                    angular.forEach(vm.chargesTypes, function (row) {
                        row.name = app.localize(row.name);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
          

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
