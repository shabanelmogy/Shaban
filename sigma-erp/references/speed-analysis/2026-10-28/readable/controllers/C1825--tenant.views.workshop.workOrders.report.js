// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:497875-497951
appModule.controller('tenant.views.workshop.workOrders.report', ['$scope', 'abp.services.app.workOrder', '$stateParams', 'abp.services.app.commonLookup','utilities',
        function ($scope, workOrderAppService, $stateParams, commonLookupService,utilities) {

            var vm = this;


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters.voucherNo) {
                vm.filters.vehicle = null;
                vm.filters.customer = null;
                vm.filters.status = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.refNo = null;
                vm.filters.chassisNo = null;
            }

            //if (vm.filters.enableDateRange) {
            //    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //}

            if (vm.filters.customer) {
                vm.filters.customerId = vm.filters.customer.id;
            }
            if (vm.filters.vehicle) {
                vm.filters.vehicleId = vm.filters.vehicle.id;
            }

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.getStatusString = function (status) {
                if (status === 1) {
                    return app.localize('Open');
                }
                else if (status === 2) {
                    return app.localize('Closed');
                }
            };

            function init() {

            vm.loading = true;

            if (vm.filters.locationId)
                getLocations();

                workOrderAppService.getWorkOrdersReport(vm.filters).success(function (data) {
                   // alert(JSON.stringify(data));
                vm.reportData = data.items;

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
