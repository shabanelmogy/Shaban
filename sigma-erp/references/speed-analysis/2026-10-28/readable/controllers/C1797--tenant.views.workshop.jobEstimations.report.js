// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:490546-490627
appModule.controller('tenant.views.workshop.jobEstimations.report', ['$scope', 'abp.services.app.jobEstimation', '$stateParams', 'abp.services.app.commonLookup','utilities',
        function ($scope, jobEstimationService, $stateParams, commonLookupService, utilities) {

            var vm = this;


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
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
                else if (status === 4) {
                    return app.localize('Rejected')
                }
            };
            vm.getApprovalStatusString = function (isApproved) {
                if (isApproved === true || isApproved === 1) {
                    return app.localize('Approved');
                }
                else if (isApproved === false || isApproved === 0) {
                    return app.localize('Not Approved');
                }
            };

            function init() {

            vm.loading = true;

                if (vm.filters.jobNo) {
                    vm.filters.plateNo = null;
                    vm.filters.customer = null;
                    vm.filters.status = null;
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                //if (vm.filters.enableDateRange) {
                //    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //}

                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
            //if (vm.filters.locationId)
            //    getLocations();

                jobEstimationService.getReport(vm.filters).success(function (data) {
                   // alert(JSON.stringify(data));
                vm.reportData = data;

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
