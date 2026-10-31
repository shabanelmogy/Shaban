// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:279862-279939
appModule.controller('tenant.views.crs.reports.salePersonReports.salesPersonAgreementOutstandingReport.report',
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

                vm.roundingforView = function (value) {
                    var roundedValue = utilities.roundforView(value, 2);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };

                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(vm.dateTimeFormat);
                    }
                    else {
                        return "";
                    }
                };
                vm.agreementStatus = function (id) {
                    debugger;
                    if (id == 1)
                        return app.localize("Open");
                    else if (id == 2)
                        return app.localize("Closed");
                }
                vm.getTotal = function () {
                    vm.totalCharges = utilities.round(vm.report.map(m => m.agreement.totalCharges).reduce((total, totalCharges) => total + totalCharges, 0), 2);
                    vm.outstanding = utilities.round(vm.report.map(m => m.outstandingAmount).reduce((total, outstandingAmount) => total + outstandingAmount, 0), 2);
                    vm.outstandingPercentage = utilities.round((vm.outstanding / vm.totalCharges) * 100, 2);
                }
                function init() {
                    debugger;
                    vm.loading = true;
                    vm.report = null;
                    if (vm.filters.salesPerson != null) {
                        vm.filters.salesPersonId = vm.filters.salesPerson.id;
                    }

                    salesPersonReport.getSalesPersonAgreementOutstandingReport(vm.filters).success(function (result) {
                        vm.report = result.reportDetail;//.filter(x => x.outstandingAmount > 0);


                    }).finally(function () {
                        vm.loading = false;
                        vm.getTotal();
                    });;
                };


                init();

            }]);
