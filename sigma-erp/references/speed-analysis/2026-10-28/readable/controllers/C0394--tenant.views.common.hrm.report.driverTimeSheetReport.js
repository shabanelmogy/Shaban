// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100807-100942
appModule.controller('tenant.views.common.hrm.report.driverTimeSheetReport', [
        '$scope', 'abp.services.app.documentsEmail', 'abp.services.app.directory', 'abp.services.app.driverTimeSheetForAgreement', 'abp.services.app.agreement',
        function ($scope, documentsEmailAppService, directoryService, driverTimeSheetAgreementService, agreementService) {

            var vm = this;
            vm.locations = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            vm.reportData = null;
            vm.filters = {};
            vm.driver = null;
            vm.reportData = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment(moment().startOf('month').format(abp.setting.get("App.General.DateFormat"))),
                    endDate: moment(moment().endOf('month').format(abp.setting.get("App.General.DateFormat"))),
                };
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    var dateTime = moment(localTime).format(vm.dateFormat);
                    return dateTime;
                }
                else {
                    return "";
                }
            };

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.search = function () {
                if (!vm.dateRangeModel.startDate || !vm.dateRangeModel.endDate) {
                    vm.reportData = null;
                    return null;
                } else {
                    vm.loading = true;
                    return driverTimeSheetAgreementService.driverTimeSheetReport({
                        startDate: vm.dateRangeModel.startDate, endDate: vm.dateRangeModel.endDate,
                        agreementId: vm.filters.agreementId, driverType: vm.filters.driverType, driverId: vm.filters.driverId
                    })
                        .success(function (response) {
                            vm.reportData = response;
                        })
                        .finally(() => {
                            vm.loading = false;
                        });
                }
            }

            vm.searchAgreement = function ($select) {
                if ($select.search == '') return;
                agreementService.searchAgreement({ agreementNo: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getHoliday = function (isHoliday) {
                if (isHoliday == true) {
                    return "Yes";
                } else {
                    return "No";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.dateRangeModel.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.dateRangeModel.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.exportToExcel = () => {
                vm.loading = true;
                driverTimeSheetAgreementService.exportReportToExcel({
                    startDate: vm.dateRangeModel.startDate, endDate: vm.dateRangeModel.endDate,
                    agreementId: vm.filters.agreementId, driverType: vm.filters.driverType, driverId: vm.filters.driverId
                })
                    .success(r => {
                        app.downloadTempFile(r);
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            vm.exportSummaryToExcel = () => {
                vm.loading = true;
                driverTimeSheetAgreementService.exportSummaryReportToExcel({
                    startDate: vm.dateRangeModel.startDate, endDate: vm.dateRangeModel.endDate,
                    agreementId: vm.filters.agreementId, driverType: vm.filters.driverType, driverId: vm.filters.driverId
                })
                    .success(r => {
                        app.downloadTempFile(r);
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            function init() {
                initDate();
                vm.driverTypes = [
                    { key: 'All', value: null },
                    { key: 'Staff', value: 2 },
                    { key: 'External', value: 5 }
                ];
            }

            init();
        }
    ]);
