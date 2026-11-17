// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:99866-99980
appModule.controller('tenant.views.common.hrm.payrolls.report', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.person', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.payroll',
        'abp.services.app.directory', 'abp.services.app.designation',
        function ($scope, $uibModal, uiGridConstants, personService, appSession, commonLookupService, payrollService, directoryService, designationService) {

            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.features = {
                payroll: abp.features.isEnabled('HRM.Payroll'),
            };

            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }

            //Date Rangeus
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate;
                vm.filters.toDate = vm.dateRangeModel.endDate;
            };

            vm.search = () => {
                vm.isSearch = true;
                if (vm.filters.staff) {
                    vm.filters.staffId = vm.filters.staff.id;
                }
                if (vm.filters.designation) {
                    vm.filters.staffDesignationId = vm.filters.designation.id;
                }
                payrollService.report(vm.filters).success(data => {
                    vm.data = data;
                }).finally(() => {
                    vm.isSearch = false;
                });
            };

            vm.getLocalDateTime = function (date) {
                if (date != null) {
                    let localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.isSearchEnabled = () => {
                if (vm.filters.fromDate && vm.filters.toDate) {
                    return true;
                }
                return false;
            }

            vm.rounding = (value) => {
                if (value === null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }

            vm.searchStaffs = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffs = response.data.items;
                });
            };

            vm.searchDesignations = function ($select) {
                return designationService.search({ key: $select.search }).then(function (response) {
                    vm.designations = response.data.items;
                });
            };

            vm.clearStaff = () => {
                vm.filters.staff = null;
                vm.filters.staffId = null;
            }

            vm.clearDesignation = () => {
                vm.filters.designation = null;
                vm.filters.staffDesignationId = null;
            }

            vm.export = () => {
                vm.isExport = true;
                payrollService.reportExportToExcel(vm.filters)
                    .success(r => {
                        app.downloadTempFile(r);
                    })
                    .finally(() => {
                        vm.isExport = false;
                    });
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            function init() {
                //vm.dateRangeModel = {
                //    startDate: moment().add(-29, 'days').startOf('day'),
                //    endDate: moment().endOf('day')
                //};

                vm.filters = {
                    fromDate: null,
                    toDate: null,
                    staffId: null,
                    staffDesignationId: null
                }
            }

            init();
        }
    ]);
