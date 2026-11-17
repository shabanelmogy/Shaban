// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:268296-268400
appModule.controller('tenant.views.crs.reports.darbTollReport.report', [
        '$scope', '$stateParams', 'abp.services.app.toll', 'utilities',
        function ($scope, $stateParams, tollsService, utilities) {

            var vm = this;
            vm.totalAmount = 0;
            vm.totalSurcharge = 0;
            vm.totalAmountWithSurcharge = 0;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableTMS = abp.features.isEnabled("TMS");
            vm.isEnableFMS = abp.features.isEnabled("TFMS");
            vm.isEnableCRS = abp.features.isEnabled("CRS");

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
            vm.customers = [];
            vm.selectedVehicle = null;
            vm.vehicleNoEN = [];
            vm.plateTagNoEN = [];

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            function init() {
                vm.loading = true;
                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(vm.filters.fromDate) : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(vm.filters.toDate) : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;
                tollsService.darbTollReportView(vm.filters).success(function (data) {
                    vm.tolls = data;
                    vm.tolls.totalItems = data.length;
                    angular.forEach(vm.tolls, function (value) {
                        vm.totalAmount += value.amountWithSurcharge;
                        vm.totalSurcharge += value.surcharge;
                        vm.totalAmountWithSurcharge += value.amountWithSurcharge;
                    });
                }).finally(function () {
                    vm.loading = false;
                });

            }
            //vm.dateRangeCheck();
            //getStatuses();
            //getInvoiceStatuses();
            //getFineStatuses();
            //getFiltersData();
            init();
        }]);
