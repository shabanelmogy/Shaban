// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:279607-279664
appModule.controller('tenant.views.crs.reports.salePersonReports.salePersonDiscountReportCreation.report',
        ['$scope', '$stateParams', 'abp.services.app.salesPersonReport', 'abp.services.app.commonLookup', 'utilities',
            function ($scope, $stateParams, salesPersonReport, commonLookupService, utilities) {

            var vm = this;
            vm.locationName = '';
            vm.totalCreditAmount = 0;
            vm.totalDebitAmount = 0;
            vm.totalDueAmount = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }


            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

             
            function init() {
                vm.loading = true;
                vm.report = null; 
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                    if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.filters.vehicle)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                salesPersonReport.getSalePersonDiscountReport(vm.filters).success(function (result) {
                    vm.report = result.reportDetail;
                    

                }).finally(function () {
                    vm.loading = false;
                });;
            };
       

            init();

        }]);
