// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:432244-432372
appModule.controller('tenant.views.fms.vehicleAssignment.report', ['$stateParams', 'abp.services.app.vehicleAssignment', '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($stateParams, vehicleAssignmentService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.filters = $stateParams.filters;
            if (vm.filters.vehicleAssignmentNo) {
                vm.filters.plateNo = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.rateTypeId = null;
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.status = null;
                vm.filters.requestedById = null;
                vm.filters.driverId = null;
            }
            else if (vm.filters.plateNo) {
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.rateTypeId = null;
                vm.filters.status = null;
                vm.filters.requestedById = null;
                vm.filters.driverId = null;
            }

            vm.rateTypes = [
                { id: 1, name: '/Day' },
                { id: 2, name: '/Week' },
                { id: 3, name: '/Month' },
                { id: 5, name: '/KM' },
                { id: 7, name: '/Hour' },
                { id: 6, name: '/Trip' }
            ];

            vm.getRateName = function (id) {
                var name = "";
                for (var i = 0; i < vm.rateTypes.length; i++) {
                    if (vm.rateTypes[i].id == id) {
                        name = vm.rateTypes[i].name;
                        break;
                    }
                }
                return name;
            }

            vm.getDriverName = function () {
                var driverName = "";
                if (vm.vehicleAssignmentReportData != undefined)
                    driverName = vm.vehicleAssignmentReportData[0].driver.name;              
                return driverName;
            };
            vm.getCustomerName = function () {
                var customerName = "";
                if (vm.vehicleAssignmentReportData != undefined)
                    customerName = vm.vehicleAssignmentReportData[0].customer;
                return customerName;
            };


            vm.getRequestedByName = function () {
                var name = "";
                if (vm.vehicleAssignmentReportData != undefined)
                name = vm.vehicleAssignmentReportData[0].additionalDriver.name;             
                return name;
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getStatuses = function () {
                if (!vm.filters.status) return '';
                if (vm.filters.status == 1)
                    return app.localize("Open");
                else if (vm.filters.status == 2)
                    return app.localize("Closed");
            };

            vm.getlocalizedString = function (vehicleAssignmentStatus) {
                return app.localize(vehicleAssignmentStatus);
            };


            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }

            function init() {
                //getLocations();
                vm.loading = true;
                //if (vm.filters.agreementType)
                //    getAgreementTypes();
                vehicleAssignmentService.getVehicleAssignmentsReport(vm.filters).success(function (data) {
                    vm.vehicleAssignmentReportData = data.items;
                    angular.forEach(vm.vehicleAssignmentReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
