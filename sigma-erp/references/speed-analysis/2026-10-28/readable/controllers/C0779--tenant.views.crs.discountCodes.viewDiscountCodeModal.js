// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:202269-202332
appModule.controller('tenant.views.crs.discountCodes.viewDiscountCodeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.discountAuthCode', 'discountCodeId', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $uibModalInstance, discountCodeService, discountCodeId, utilities, commonLookUp) {

            var vm = this;
            vm.saving = false;
            vm.isEditMod = false;
            vm.vehicleTypes = [];
            vm.discountForVehicleTypes = abp.features.isEnabled("CRS.CustomFeatures.DiscountForVehicleType");
            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            function getTariffGroups() {
                return new Promise(function (resolve, reject) {
                    commonLookUp.getTariffGroups({}).success(function (data) {
                        vm.vehicleTypes = data.items;
                        resolve(); 
                    });
                });
            };

            async function init() {
                await getTariffGroups();
                discountCodeService.getDiscountAuthCodeForView({
                    id: discountCodeId
                }).success(function (result) {
                    vm.discountCode = result;
                    if (vm.discountForVehicleTypes) {
                        vm.excludedVehicleTypeIds = vm.discountCode.excludedVehicleTypes.split(',');
                        vm.filteredVehicleTypes = vm.vehicleTypes.filter(function (type) {
                            return vm.excludedVehicleTypeIds.indexOf(type.id.toString()) !== -1;
                        });
                    }

                    if (vm.discountCode.validForHours >= 24) {
                        vm.discountCode.validForHours = utilities.round(vm.discountCode.validForHours / 24, 2);
                        vm.validForDays = true;
                    }

                });
            }
            init();
        }
    ]);
