// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64220-64366
appModule.controller('host.views.crm.dealsReport.index', [
            '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.user', 'abp.services.app.deal', 'abp.services.app.commonLookup', 'abp.services.app.directory',
            function ($scope, $uibModal, uiGridConstants, userService, dealService, commonLookupService, directoryService) {
                var vm = this;

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });

                vm.statuses = [
                { id: 1, name: 'Open' },
                { id: 2, name: 'Closed' },
                { id: 3, name: 'On Hold' },
                { id: 4, name: 'Cancelled' },
                ]

                vm.loading = false;
                vm.filters = {
                    code: '',
                    name: '',
                    status: 1,
                    editionId: null,
                    companyId: null,
                    probability: null,
                    salesPersonUserId: null,
                    dealDateFilter:1
                };
                vm.dealStages = [
                    { id: 1, name: 'New' },
                    { id: 2, name: 'Average' },
                    { id: 3, name: 'Hot' },
                    { id: 4, name: 'Final' },
                ];
                vm.filters = {
                    code: '',
                    name: '',
                    stage: 1,
                    editionId: null,
                    companyId: null,
                    probability: null,
                    salesPersonUserId: null,
                    dealDateFilter:1
                };

                vm.getStages = function (stage) {
                    if (stage == 1)
                        return 'New';
                    else if (stage == 2)
                        return 'Average';
                    else if (stage == 3)
                        return 'Hot';
                    else if (stage == 4)
                        return 'Final';
                    else return '';
                };

               
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('YYYY-MM-DD');
                    }
                    else {
                        return "";
                    }
                };

                vm.getEditionValue = function (item) {
                    return parseInt(item.value);
                };

                vm.searchCompanies = function ($select) {
                    //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                    return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                        vm.companies = response.data.items;
                    });
                };

                vm.searchUsers = function ($select) {
                    if ($select.search == "")
                        return null;
                    userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };

                var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
                vm.dateRangeOptions = app.createDateRangePickerOptions();
                vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
                vm.dateRangeModel = {
                    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
                };

                vm.searchUsers = function ($select) {
                    return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                        vm.users = response.data.items;
                    });
                };

                vm.clearCompany = function () {
                    vm.filters.companyId = null;
                    vm.filters.company = null;
                };

                vm.clearSalesPersonUser = function () {
                    vm.filters.salesPersonUserId = null;
                    vm.filters.salesPersonUser = null;
                };

                vm.getDeals = function () {
                    vm.loading = true;
                    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                    //if null then get as following
                    //fromDate: get local date with time 00:00:00 and then convert to utc
                    //toDate: get local date of max time of night and then convert to utc
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                    dealService.getDealsForReport(vm.filters).success(function (data) {
                        
                        vm.reportData = data;
                        vm.reportData.totalValue = Math.round(vm.reportData.totalValue);
                        vm.reportData.totalExpectedValue = Math.round(vm.reportData.totalExpectedValue);

                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                function getEditions() {
                    vm.loading = true;
                    commonLookupService.getEditionsForCombobox({}).success(function (result) {
                        vm.editions = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }

                function init() {
                    vm.getDeals();
                    getEditions();
                }

                init();
            }
    ]);
