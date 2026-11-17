// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:483268-483366
appModule.controller('tenant.views.tms.tollReport.report', [
        '$scope', '$stateParams', 'abp.services.app.toll',
        function ($scope, $stateParams, tollsService) {

            var vm = this;
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
            vm.totalAmount = 0;
            vm.totalSurcharge = 0;
            vm.totalAmountWithSurcharge = 0;
            vm.enableCompanyCodeSalik = abp.setting.getBoolean('App.General.Salik.EnableCompanyCode');

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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

                vm.filters.fromDate = moment(vm.filters.fromDate);
                vm.filters.toDate = moment(vm.filters.toDate);
                vm.filters.fromTime = moment(vm.filters.fromTime);
                vm.filters.toTime = moment(vm.filters.toTime);

                //vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                //vm.filters.toDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;


                if (vm.filters.durationType === null) vm.filters.durationType = 1;
                tollsService.getTmsTollsReportForReport(vm.filters).success(function (data) {
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
            init();
        }]);
