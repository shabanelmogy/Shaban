// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:250387-250541
appModule.controller('tenant.views.crs.limousine.trips.finishTripModal', [
        '$scope', '$filter', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'utilities', 'tripId', 'abp.services.app.tripType',
        function ($scope, $filter, $uibModal, $uibModalInstance, limoTripsService, utilities, tripId, tripTypeService) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.showKms = false;
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.isLimoDiscountEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoDiscount"));
            vm.trackMileage = utilities.parseBoolean(abp.setting.get("App.General.Trip_TrackMileage"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));
            vm.dontRecalculateChargesOnTripFinish = utilities.parseBoolean(abp.setting.get("App.General.DontRecalculateChargesOnTripFinish"));

            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.permissions = {
                changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
            };
            //date change calls on loading data first time in edit mode. disable calculation if it is first time loading of editing mode
            var dropOffDateTimeLoaded = false;
            vm.dropOffDateTimeChanged = function () {
                if (dropOffDateTimeLoaded && vm.dontRecalculateChargesOnTripFinish) {
                    if (!vm.trip.dontCalcCharges) {
                        calculateCharges();

                    }
                }
                else if (dropOffDateTimeLoaded && !vm.dontRecalculateChargesOnTripFinish) {
                    calculateCharges();
                }
                else
                    dropOffDateTimeLoaded = true;
            };
            vm.changeCharges = function () {
                if (vm.isLimoDiscountEnabled) {
                    var discountCharge = vm.trip.tripCharges.find(e => e.chargesTypeId == 22);
                    if (discountCharge) {
                        discountCharge.chargesType.name = '(' + discountCharge.chargesType.name + ')'
                    }
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                trip: vm.trip,
                                viewMode: (vm.trip.isPrepaymentRequired && vm.trip.receiptId),
                                customerTaxRule: vm.trip.customer ? vm.trip.customer.taxRule : null,
                                isPassFromFinish: true
                            };
                        }
                    }
                });
            };
            vm.onKMsChange = function () {
                if (vm.trackMileage == true) {
                    vm.trip.kms = vm.trip.endingKms - vm.trip.startingKms;
                }

                if (vm.dontRecalculateChargesOnTripFinish) {
                    if (!vm.trip.dontCalcCharges) {
                        calculateCharges();

                    }
                }
                else
                    calculateCharges();

            };

            function calculateCharges() {
                if (vm.trip == null) return;
                if (!(vm.trip.customer != null && vm.trip.tripTypeId > 0 && vm.trip.pickupLocation != null && vm.trip.tariffGroupId > 0)) return;

                vm.loading = true;
                vm.trip.customerId = vm.trip.customer.id;

                limoTripsService.calculateCharges(vm.trip).success(function (result) {
                    if (vm.isLimoDiscountEnabled) {
                        vm.trip.charges = result.charges + result.tax;

                    }
                    else {

                        vm.trip.charges = result.charges + result.tax;
                    }
                    vm.trip.tripCharges = result.tripCharges;
                    vm.trip.tax = result.tax;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.save = function () {
                if (vm.trip.endingKms < vm.trip.startingKms) {
                    abp.message.info("Ending KMs cannot be less than starting KMs");
                    return;
                }
                if (vm.separateDateAndTime) {

                    if ((vm.trip.dropOffDateTime < vm.trip.pickupDateTime)) {
                        abp.message.error(app.localize('DropOff DateAndTime should be greater than PickUp DateAndTime  '));
                        return;
                    }
                }
                vm.saving = true;
                limoTripsService.finishTrip({
                    trip: vm.trip,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));


                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            function init() {

                vm.loading = true;
                limoTripsService.getTripForEdit({ id: tripId }).success(function (data) {
                    vm.trip = data;
                    if (vm.trackMileage == true) {
                        vm.trip.kms = null;

                    }
                    tripTypeService.getTripTypeSettingForEdit({ id: vm.trip.tripTypeId }).success(function (data) {
                        var foundLinesBase = $filter('filter')(data.baseSetting.rateTypes, {
                            id: 5,
                        }, true);
                        var foundLinesCorporate = $filter('filter')(data.corporateSetting.rateTypes, {
                            id: 5,
                        }, true);
                        if (foundLinesBase.length >= 1 || foundLinesCorporate.length >= 1) {
                            vm.showKms = true;
                        }
                    }
                    )
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
