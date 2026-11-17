// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:495526-495635
appModule.controller('tenant.views.workshop.jobs.report', ['$scope', 'abp.services.app.job', '$stateParams', 'abp.services.app.commonLookup','utilities',
        function ($scope, jobAppService, $stateParams, commonLookupService, utilities) {

            var vm = this;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters.jobNo) {
                vm.filters.plateNo = null;
                vm.filters.customer = null;
                vm.filters.status = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.estimationNo = null;
            }

            //if (vm.filters.enableDateRange) {
            //    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //}

            if (vm.filters.customer) {
                vm.filters.customerId = vm.filters.customer.id;
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
                else if (status === 3) {
                    return app.localize('Cancelled');
                }
            };

            vm.getJobTypeName = function (jobType) {
                if (jobType === 1) {
                    return "Routine Service";
                }
                else if (jobType === 2) {
                    return "Mechanical Service";
                }
                else if (jobType === 3) {
                    return "Electrical Service";
                }
                else if (jobType === 4) {
                    return "Denting & Painting";
                }
                else if (jobType === 5) {
                    return "Accident Service";
                }
                else if (jobType === 6) {
                    return "AC Service";
                }
                else if (jobType === 7) {
                    return "Breakdown Service";
                }
                else if (jobType === 8) {
                    return "Tyre Service";
                }
                else if (jobType === 9) {
                    return "Unit Maintenance";
                }
                else if (jobType === 10) {
                    return "Unit Repair";
                }
                else if (jobType === 11) {
                    return "Regular Lubrications";
                }
            };

            function init() {
                vm.loading = true;

                //if (vm.filters.locationId)
                //    getLocations();

                jobAppService.getReport(vm.filters).success(function (data) {
                    // alert(JSON.stringify(data));
                    vm.reportData = data;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            init();
        }]);
