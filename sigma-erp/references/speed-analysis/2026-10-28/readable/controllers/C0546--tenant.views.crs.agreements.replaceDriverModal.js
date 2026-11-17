// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:147884-148049
appModule.controller('tenant.views.crs.agreements.replaceDriverModal', ['abp.services.app.vehicle', 'agreementId', 'abp.services.app.agreement',
        'abp.services.app.agreementReplacement', 'utilities' ,'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function (vehicleService, agreementId, agreementService, agreementReplacementService, utilities, commonAgreementService, $uibModalInstance, commonLookupService, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.agreement = null;
            vm.inMovement = null;
            vm.outMovement = null;
            vm.locations = [];
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
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

            vm.getFuelLevel = function (value) {
                if (value == null)
                    return "";

                if (value == 0) {
                    return "0/8";
                } else if (value > 0 && value <= 0.125) {
                    return "1/8";
                } else if (value > 0.125 && value <= 0.25) {
                    return "2/8";
                } else if (value > 0.25 && value <= 0.375) {
                    return "3/8";
                } else if (value > 0.375 && value <= 0.5) {
                    return "4/8";
                } else if (value > 0.5 && value <= 0.625) {
                    return "5/8";
                } else if (value > 0.625 && value <= 0.75) {
                    return "6/8";
                } else if (value > 0.75 && value <= 0.875) {
                    return "7/8";
                } else if (value > 0.875 && value <= 1) {
                    return "8/8";
                } else {
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

            
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }

                //var TimeFormat = moment.utc(vm.inDriver.outDateTime).toDate();
                //var outDriverDate = moment(vm.inDriver.outDateTime);
                if (moment(vm.inDriver.outDateTime) > moment(vm.outDriver.outDateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date can not less than Out Date ';
                }
                if (vm.inDriver.driverId==vm.outDriver.driverId) {
                    isValid = false;
                    errorMessage = errorMessage + '\n Out Driver can not be same as  In Driver ';
                }
            }

            vm.save = function () {
                vm.saving = true;

                validate();
                if (isValid) {

                    agreementReplacementService.replaceDriver({
                        agreementId: vm.agreement.id,
                        inDriver: vm.inDriver,
                        outDriver: vm.outDriver,
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
                allFuelLevels();
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                commonAgreementService.getAgreementForDriverReplacement({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.inDriver = vm.agreement.driverLogs[vm.agreement.driverLogs.length - 1];
                    vm.isLeaseAgreement = vm.agreement.agreementCategory == 2;
                    
                    vm.outDriver = null;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
