// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:474963-475157
appModule.controller('tenant.views.tms.attachDetails.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.toll', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.salikAccount',
        function ($scope, $uibModal, uiGridConstants, tollsService, vehicleService, directoryService, salikAccountService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isEnableTMS = abp.features.isEnabled("TMS");

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
            vm.selectedTollsCount = 0;

            vm.filters = {
                isAgreementClosing: false,
                enableDateRange: true,
                name: "",
                vehicleId: null,
                agreementNo: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,
                vehicleNo: null,
                enableWithAgreement: false,
                enableWithOutAgreement: false,
                enableInvoiced: false,
                enableUnInvoiced: false,
                enableCharged: true,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                ContactId: null,
                tmsAgreementNo: null,

                transactionNumber: null,
                plateTagNoEN: [],
                vehicleNoEN: [],
                location: null,
                direction: null,
                salikAccount: null,
                durationType: 1,
                vehicleNoArray: [],
                plateTagNoArray: []
            };
            function getFiltersDateForSAF() {
                vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                vm.filters.toTime = moment(new Date()).endOf('day').utc();
            };

            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollsService.getSearchPlateNo(vm.filters).then(function (response) {
                    vm.vehicleNoEN = response.data.items; //string list of plate numbers
                });
            };
            vm.searchTagNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollsService.getSearchTagNo(vm.filters).then(function (response) {
                    vm.plateTagNoEN = response.data.items; //string list of tag numbers
                });
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount === null) return null;
                return amount.toLocaleString('en');
            };

            vm.getTollsReport = function () {
                vm.loading = true;
                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;
                if (vm.filters.durationType === null) vm.filters.durationType = 1;

                tollsService.getTollsReportForReport(vm.filters).success(function (data) {
                    vm.tolls = data;
                    vm.tolls.totalItems = data.length;
                }).finally(function () {
                    vm.loading = false;
                    vm.tollReportChecked();
                    vm.allTollReports = false;
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getServerName = function (server) {
                if (server == 1) {
                    return app.localize('Dubai');
                }
                else if (server == 2) {
                    return app.localize('AbuDhabi');
                }
            }

            vm.allTollReportsChecked = function () {
                angular.forEach(vm.tolls, function (value, key) {
                    if (vm.allTollReports) {
                        value.selected = true;
                    } else {
                        value.selected = false;
                    }
                    vm.tollReportChecked();
                });
            };

            vm.tollReportChecked = function () {
                vm.selectedTollsCount = 0;
                angular.forEach(vm.tolls, function (value, key) {
                    if (value.selected) {
                        vm.selectedTollsCount++;
                    }
                });
            }

            function openAttachAgreementDetailModal(selectedTollsDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/attachDetails/updateModal.cshtml',
                    controller: 'tenant.views.tms.attachDetails.updateModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        SelectedTollsDetail: function () {
                            return selectedTollsDetail;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getTollsReport();
                });
            }

            vm.attachAgreementDetail = function () {
                var selectedTollsDetail = new Object();
                selectedTollsDetail.tollsId = [];
                selectedTollsDetail.selectedCount = vm.selectedTollsCount;
                angular.forEach(vm.tolls, function (value) {
                    if (value.selected) {
                        selectedTollsDetail.tollsId.push(value.id);
                    }
                });
                openAttachAgreementDetailModal(selectedTollsDetail);
            }

            function init() {
                getFiltersDateForSAF();
                vm.getTollsReport();
            };

            init();
        }
    ]);
