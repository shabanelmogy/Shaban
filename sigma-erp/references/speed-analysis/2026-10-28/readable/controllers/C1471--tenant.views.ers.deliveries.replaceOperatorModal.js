// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:402220-402346
appModule.controller('tenant.views.ers.deliveries.replaceOperatorModal', ['abp.services.app.vehicle', 'agreementId', 'abp.services.app.agreement',
        'abp.services.app.equipmentAgreementReplacement', 'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        'abp.services.app.designation',
        function (vehicleService, agreementId, agreementService, agreementReplacementService, commonAgreementService, $uibModalInstance, commonLookupService, directoryService,
            designationService) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;
            vm.inMovement = null;
            vm.outMovement = null;
            vm.outAgreement = {
                operator1Type: 2,
                operator2Type: 2
            }
            vm.locations = [];
            var isValid = true;
            var errorMessage = {};

            function searchOperators() {
                return designationService.getDesignations().then(function (response) {
                    vm.operators = response.data.items;
                });
            };

            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null;
                    return null;
                }
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL' }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.vehicleSelected = function () {
                vm.outMovement.vehicleId = vm.outMovement.vehicle.id;
                vm.outMovement.outDetail.fuelLevel = vm.outMovement.vehicle.fuelLevel;
                vm.outMovement.outDetail.km = vm.outMovement.vehicle.kMs;
                vm.outMovement.outDetail_LocationId = vm.outMovement.vehicle.locationId;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;

                //validate();
                if (isValid) {
                    vm.outAgreement.id = agreementId;
                    agreementReplacementService.replaceOperator({
                        agreement: vm.outAgreement
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                } else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };

            function init() {
                vm.loading = true;
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                commonAgreementService.getAgreementForOperatorReplacement({
                    id: agreementId
                }).success(function (result) {
                    vm.inAgreement = result;
                    //vm.inDriver = vm.agreement.driverLogs[vm.agreement.driverLogs.length - 1];
                    //vm.isLeaseAgreement = vm.agreement.agreementCategory == 2;
                    
                    //vm.outDriver = null;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            searchOperators();
            init();
        }
    ]);
