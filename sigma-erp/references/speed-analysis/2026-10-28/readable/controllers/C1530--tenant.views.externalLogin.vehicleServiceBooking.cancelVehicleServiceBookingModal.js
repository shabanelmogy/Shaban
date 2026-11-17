// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:417105-417183
appModule.controller('tenant.views.externalLogin.vehicleServiceBooking.cancelVehicleServiceBookingModal', [
        '$scope', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleServiceBookingExternal','serviceBooking',
        function ($scope, utilities, $uibModal, $uibModalInstance, vehicleServiceBookingExternalService, serviceBooking) {

            var vm = this;

            
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.agreements = [];
            vm.serviceBooking = {};
            vm.filters = {};
            vm.serviceBooking = angular.copy(serviceBooking);
            vm.serviceBooking.notes = "";

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

            vm.save = function () {
                vm.loading = true;
                //vm.serviceBooking.agreementId = vm.filters.agreement.id;
                vehicleServiceBookingExternalService.cancelVehicleServiceBooking(
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
            
            //function init() {
            //    vm.loading = true;
            //    if (serviceBooking && serviceBooking.id) {
            //        vehicleServiceBookingExternalService.getVehicleServiceBookingForEdit({
            //            id: serviceBooking.id
            //        }).success(function (result) {
            //            vm.serviceBooking = result;
            //            vm.serviceBooking.plateNo = vm.serviceBooking.plateNo;
            //            vm.serviceBooking.makeAndModel = vm.serviceBooking.makeAndModel;
            //            vm.serviceBooking.serviceDate = vm.serviceBooking.serviceDate;
            //            vm.serviceBooking.notes = vm.serviceBooking.notes;
            //            vm.serviceBooking.vehicleId = vm.serviceBooking.VehicleId;
            //            if (vm.serviceBooking.agreement)
            //                vm.serviceBooking.agreement.plateNo = vm.serviceBooking.plateNo;
            //            vm.openAgreements = [];
            //            vm.openAgreements.push(vm.serviceBooking.agreement);
            //            vm.filters.agreement = vm.serviceBooking.agreement;
            //        }).finally(function () {
            //            vm.loading = false;
            //        });
            //    }
            //}

            //init();

        }
    ]);
