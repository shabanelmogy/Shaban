// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:479136-479196
appModule.controller('tenant.views.tms.e-darb.tollReport.printTemplates.nationalReport', [
        '$scope', 'abp.services.app.toll', '$stateParams',
        function ($scope, tollsService, $stateParams) {

            var vm = this;

            vm.tolls = [];

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            vm.dateFormat = "DD MMM YYYY";
            vm.timeFormat = 'h:mm:SS a';
            vm.dateTimeFormat = 'DD MMM YYYY h:mm:SS a';

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            debugger;

            vm.getTimelocalDate = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            if (vm.filters.enableDateRange) {
                vm.fromDate = vm.getTimelocalDate(vm.filters.fromDate);
                vm.toDate = vm.getTimelocalDate(vm.filters.toDate);
            }

            vm.getTollsReport = function () {
                vm.loading = true;
                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                vm.filters.maxResultCount = 1000;
                vm.filters.skipCount = 0;

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                tollsService.getTmsTollsReport(vm.filters).success(function (data) {
                    debugger;
                    vm.tolls.totalItems = data.totalCount;
                    vm.tolls.items = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.getTollsReport();
        }
    ]);
