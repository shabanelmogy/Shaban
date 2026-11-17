// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:417269-417406
appModule.controller('tenant.views.externalLogin.vehicleServiceBooking.createOrEditModal', [
        '$scope', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleServiceBookingExternal', 'serviceBooking',
        function ($scope, utilities, $uibModal, $uibModalInstance, vehicleServiceBookingExternalService, serviceBooking) {

            var vm = this;


            vm.saveAndPrint = false;
            vm.loading = false;
            vm.agreements = [];
            vm.serviceBooking = {};
            vm.filters = {};
            vm.serviceBooking = serviceBooking;

            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");

            vm.canChangeAdvanceAmount = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeAdvanceAmount');

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.serviceBookingItems = [
                { item: 1, title: app.localize("ServiceAndRoutineMaintenance") }, { item: 2, title: app.localize("CheckBrake") },
                { item: 3, title: app.localize("CheckAirConditionOrAC") }, { item: 4, title: app.localize("CheckTiresAndPressures") },
                { item: 5, title: app.localize("ChangeWiperBlade") }, { item: 6, title: app.localize("CheckAllLights") },
                { item: 7, title: app.localize("SteeringWheelAlignment") }, { item: 8, title: app.localize("Vibration") },
                { item: 9, title: app.localize("BatteryChecking") }, { item: 10, title: app.localize("WarningLightsOnTheDashboard") },
                { item: 11, title: app.localize("RenewalOfRegistrationOrIstimara") }, { item: 12, title: app.localize("OtherServiceBookingItem") },
            ];

            vm.serviceBookingItemsName = function (item) {
                if (item === 1)
                    return app.localize("ServiceAndRoutineMaintenance");
                else if (item === 2)
                    return app.localize("CheckBrake");
                else if (item === 3)
                    return app.localize("CheckAirConditionOrAC");
                else if (item === 4)
                    return app.localize("CheckTiresAndPressures");
                else if (item === 5)
                    return app.localize("ChangeWiperBlade");
                else if (item === 6)
                    return app.localize("CheckAllLights");
                else if (item === 7)
                    return app.localize("SteeringWheelAlignment");
                else if (item === 8)
                    return app.localize("Vibration");
                else if (item === 9)
                    return app.localize("BatteryChecking");
                else if (item === 10)
                    return app.localize("WarningLightsOnTheDashboard");
                else if (item === 11)
                    return app.localize("RenewalOfRegistrationOrIstimara");
                else if (item === 12)
                    return app.localize("OtherServiceBookingItem");
                else
                    return item;
            };

            vm.agreementChanged = function () {
                vm.serviceBooking = {};
                vm.serviceBooking.plateNo = vm.filters.agreement.plateNo;
                vm.serviceBooking.makeAndModel = vm.filters.agreement.makeAndModel;
                vm.serviceBooking.serviceDate = vm.filters.agreement.serviceDate;
                //vm.serviceBooking.notes = vm.filters.agreement.notes;
                vm.serviceBooking.vehicleId = vm.filters.agreement.vehicleId;
                if (!vm.serviceBooking.items)
                    vm.serviceBooking.items = vm.serviceBookingItems;
            }

            vm.save = function () {
                vm.loading = true;
                vm.serviceBooking.agreementId = vm.filters.agreement.id;
                vehicleServiceBookingExternalService.createOrUpdateVehicleServiceBooking(
                    vm.serviceBooking
                ).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                if (serviceBooking && serviceBooking.id) {
                    vehicleServiceBookingExternalService.getVehicleServiceBookingForEdit({
                        id: serviceBooking.id
                    }).success(function (result) {
                        vm.serviceBooking = result;
                        vm.serviceBooking.plateNo = vm.serviceBooking.plateNo;
                        vm.serviceBooking.makeAndModel = vm.serviceBooking.makeAndModel;
                        vm.serviceBooking.serviceDate = vm.serviceBooking.serviceDate;
                        vm.serviceBooking.notes = vm.serviceBooking.notes;
                        vm.serviceBooking.vehicleId = vm.serviceBooking.VehicleId;
                        vm.serviceBooking.items = vm.serviceBooking.items;
                        if (vm.serviceBooking.agreement)
                            vm.serviceBooking.agreement.plateNo = vm.serviceBooking.plateNo;
                        vm.openAgreements = [];
                        vm.openAgreements.push(vm.serviceBooking.agreement);
                        vm.filters.agreement = vm.serviceBooking.agreement;
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else {
                    vehicleServiceBookingExternalService.getOpenAgreements()
                        .success(function (data) {
                            vm.openAgreements = data.items;
                            vm.serviceBooking = {};
                            vm.serviceBooking.items = vm.serviceBookingItems;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

            }

            init();

        }
    ]);
