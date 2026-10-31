// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:316717-316807
appModule.controller('tenant.views.crs.vehicles.serviceBooking.createNotesServiceBookingModal', [
        '$scope', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.serviceBookings','serviceBooking',
        function ($scope, utilities, $uibModal, $uibModalInstance, serviceBookingsService, serviceBooking) {

            var vm = this;

            vm.saveAndPrint = false;
            vm.loading = false;
            vm.agreements = [];
            vm.serviceBooking = {};
            vm.filters = {};
            vm.serviceBooking = angular.copy(serviceBooking);
            vm.serviceBooking.notes = "";

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


            vm.agreementChanged = function () {
                vm.serviceBooking = {};
                vm.serviceBooking.plateNo = vm.filters.agreement.plateNo;
                vm.serviceBooking.makeAndModel = vm.filters.agreement.makeAndModel;
                vm.serviceBooking.serviceDate = vm.filters.agreement.serviceDate;
                //vm.serviceBooking.notes = vm.filters.agreement.notes;
                vm.serviceBooking.vehicleId = vm.filters.agreement.vehicleId;
                vm.openAgreements = [];
            }

            vm.searchAgreementChanged = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                var search = {
                    keyword: $select.search
                };
                return serviceBookingsService.searchGetOpenAgreements(search).then(function (response) {
                    vm.openAgreements = response.data.items;
                });
            };

            vm.save = function () {
                vm.loading = true;
                //vm.serviceBooking.agreementId = vm.filters.agreement.id;
                serviceBookingsService.createNotesForServiceBooking(
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
            //    if (serviceBooking && serviceBooking.id) {
            //        vm.loading = true;
            //        serviceBookingsService.getVehicleServiceBookingForEdit({
            //            id: serviceBooking.id
            //        }).success(function (result) {
            //            vm.serviceBooking = result;
            //            vm.serviceBooking.plateNo = vm.serviceBooking.plateNo;
            //            vm.serviceBooking.makeAndModel = vm.serviceBooking.makeAndModel;
            //            vm.serviceBooking.serviceDate = vm.serviceBooking.serviceDate;
            //            vm.serviceBooking.notes = vm.serviceBooking.notes;
            //            vm.serviceBooking.vehicleId = vm.serviceBooking.VehicleId;
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
