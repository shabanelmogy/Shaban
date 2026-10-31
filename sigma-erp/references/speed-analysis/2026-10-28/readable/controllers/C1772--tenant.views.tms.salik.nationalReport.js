// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:483585-483708
appModule.controller('tenant.views.tms.salik.nationalReport', [
        '$scope', 'abp.services.app.toll', '$stateParams',
        function ($scope, tollsService, $stateParams) {

            var vm = this;
            vm.tolls = [];
            vm.isShowFilter = true;

            vm.dateFormat = "DD MM YYYY";
            vm.timeFormat = 'h:mm:SS a';
            vm.dateTimeFormat = 'DD/MM/YYYY HH:mm';

            vm.totalAmount = 0;

            vm.getlocalDate = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getTimelocalDate = function (date) {
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


            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            debugger;


            if (vm.filters.enableDateRange) {
                vm.fromDate = vm.getTimelocalDate(vm.filters.fromDate.add('hours', 4));
                vm.toDate = vm.getTimelocalDate(vm.filters.toDate.add('hours', 4));
            }

            vm.dateType = 4;
            vm.tripsType = 2;
            vm.tagOrPlateType = 1;

            vm.getTollsReport = function () {
                vm.loading = true;
                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                if (vm.filters.durationType === null) vm.filters.durationType = 1;
                vm.filters.maxResultCount = 1000;
                vm.filters.skipCount = 0;
                tollsService.getTmsTollsReport(vm.filters).success(function (data) {
                    vm.tolls.totalItems = data.totalCount;
                    vm.tolls.items = data.items;
                    angular.forEach(vm.tolls.items, function (value) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    customizePagesDataForVoucherLines();
                    vm.loading = false;
                });

            };
            vm.getDateFormat = function (date) {
                if (date !== null) {
                    return moment.utc(date).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function customizePagesDataForVoucherLines() {


                var recordsPerPage = 20;
                var customArray = vm.tolls.items;

                customArray.forEach((element, index) => element.srNo = index + 1);

                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;

                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        voucherLinesdataToIterate: subArray
                    });
                }
            }

            function init() {
                vm.getTollsReport();
            }

            init();
        }
    ]);
