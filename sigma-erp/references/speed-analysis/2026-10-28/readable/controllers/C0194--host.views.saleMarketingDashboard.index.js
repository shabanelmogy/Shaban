// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:67627-67776
appModule.controller('host.views.saleMarketingDashboard.index', [
        '$scope', 'abp.services.app.salesMarketingDashboard', 'abp.services.app.searchUser', 'appSession',
        function ($scope, salesMarketingDashboardService, userService, appSession) {

            var vm = this;
            vm.loading = false;

            vm.allowDateRange = true;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment().startOf('day'),
                endDate: moment().endOf('day')
            };

            vm.allowDateRange = true;

            vm.filters = {
                fromDate: vm.dateRangeModel.startDate,
                toDate: vm.dateRangeModel.endDate,
                salesPersonUser: appSession.user,
                salesPersonUserId: appSession.user.id,
                quaterYear: "2020"
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchOrganizationUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.clearSalesPersonUser = function () {
                vm.filters.salesPersonUserId = null;
                vm.filters.salesPersonUser = null;
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getDate = function (date) {
                console.log(date);
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MM-YYYY HH:mm');
                }
                else {
                    return "";
                }
            };

            function getRecentActivities() {
                salesMarketingDashboardService.getRecentActivities(vm.filters)
                    .success(function (r) {
                        vm.recentActivities = r.items;
                        vm.loading = false;
                    });
            }

            function getStatisticsActivities() {
                salesMarketingDashboardService.getStatistics(vm.filters)
                    .success(function (r) {
                        vm.statisticsActivities = r;
                        vm.loading = false;
                    });
            }

            function getDealSummary() {
                salesMarketingDashboardService.getDealSummary(vm.filters)
                    .success(function (data) {
                        vm.dealSummary = data;
                        vm.loading = false;
                    });
            }

            vm.quaterYearChange = function () {
                vm.filters.firstQuarterStartDate = (new Date(vm.filters.quaterYear, 0, 1, 0, 0, 0)).toUTCString();
                vm.filters.secondQuarterStartDate = (new Date(vm.filters.quaterYear, 3, 1, 0, 0, 0)).toUTCString();
                vm.filters.thirdQuarterStartDate = (new Date(vm.filters.quaterYear, 6, 1, 0, 0, 0)).toUTCString();
                vm.filters.fourthQuarterStartDate = (new Date(vm.filters.quaterYear, 9, 1, 0, 0, 0)).toUTCString();

                vm.filters.firstQuarterEndDate = (new Date(vm.filters.quaterYear, 2, 31, 23, 59, 59)).toUTCString();
                vm.filters.secondQuarterEndDate = (new Date(vm.filters.quaterYear, 5, 30, 23, 59, 59)).toUTCString();
                vm.filters.thirdQuarterEndDate = (new Date(vm.filters.quaterYear, 8, 31, 23, 59, 59)).toUTCString();
                vm.filters.fourthQuarterEndDate = (new Date(vm.filters.quaterYear, 11, 31, 23, 59, 59)).toUTCString();

                salesMarketingDashboardService.getQuarterlyClosedSalesStatistics(vm.filters)
                    .success(function (data) {
                        vm.quarterlyClosedSalesStatistics = data;
                    });
            };

            vm.refresh = function () {
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                vm.loading = true;
                getRecentActivities();
                getStatisticsActivities();
                getDealSummary();
                vm.quaterYearChange();
                vm.loading = false;
            };

            vm.salePersonChange = function () {
                vm.filters.salesPersonUserId = vm.filters.salesPersonUser.id;
                vm.loading = true;
                getRecentActivities();
                getStatisticsActivities();
                vm.quaterYearChange();
            };

            function init() {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
                vm.dateRangeModelChanged();
                getRecentActivities();
                getStatisticsActivities();
                getDealSummary();
                vm.quaterYearChange();
                vm.loading = false;
            }

            init();
        }
    ]);
