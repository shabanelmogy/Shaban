// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:141248-141399
appModule.controller('tenant.views.crs.agreements.deliveryModal', ['abp.services.app.vehicle', 'agreementId', 'abp.services.app.agreement', 'abp.services.app.commonAgreement', '$uibModalInstance', 'abp.services.app.replacementReason','utilities', 'abp.services.app.directory',
        function (vehicleService, agreementId, agreementService, commonAgreementService, $uibModalInstance, replacementReasonService, utilities,directoryService) {

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
            vm.deliveryMovement = {
                outDetail: {}
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

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
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

            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD HH:mm');
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
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

                if (vm.getlocalDateTime(vm.inMovement.outDetail.dateTime) > vm.getlocalDateTime(vm.inMovement.inDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date can not less than Out Date ';
                }

                if (vm.inMovement.outDetail.km > vm.inMovement.inDetail.km) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ODO IN can not less than ODO OUT ';
                }

                if (vm.getlocalDateTime(vm.inMovement.inDetail.dateTime) > vm.getlocalDateTime(vm.outMovement.outDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ReplaceVehicle Out Date can not less than In Date ';
                }
            }

            vm.save = function () {
                vm.saving = true;

                // validate();
                if (true) {

                    agreementService.addDeliveryMovement({
                        driverId: vm.driverId,
                        agreementId: vm.agreement.id,
                        deliveryMovement: vm.deliveryMovement
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

            function getReplacementReasons() {
                replacementReasonService.getReplacementReasons().success(function (result) {
                    vm.replacementReasons = result.items;
                })
            };

            function init() {
                vm.loading = true;
                allFuelLevels();
                //commonLookupService.getLocations({}).success(function (data) {
                //    vm.locations = data.items;
                //});

                commonAgreementService.updateFuelRate({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.deliveryMovement.outDetail.dateTime = vm.agreement.startDate;
                    vm.deliveryMovement.outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                    vm.deliveryMovement.outDetail.km = vm.agreement.vehicle.kMs;
                    vm.deliveryMovement.refNo = vm.agreement.agreementNo;
                    vm.deliveryMovement.contactId = vm.agreement.customerId;
                    vm.deliveryMovement.vehicleId = vm.agreement.vehicleId;
                    vm.deliveryMovement.outDetail_LocationId = vm.agreement.locationId;
                    vm.deliveryMovement.inDetail_LocationId = vm.agreement.locationId;
                    vm.deliveryMovement.inDetail_GeoLocationId = vm.agreement.pickupLocationId;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
