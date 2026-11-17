// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272453-272510
appModule.controller('tenant.views.crs.reports.finesReport.printTemplates.emiratesCabPrint',
        [
            '$scope', 'abp.services.app.uaeFine',
            function ($scope, uaeFineService) {
                var vm = this;
                vm.fine = {};
                if ($scope.$parent !== null) {
                    if ($scope.$parent.vmMain !== null)
                        vm.filters = $scope.$parent.vmMain.filters;
                }

                var finesId = vm.filters;

                vm.dateFormat = "DD MMM YYYY";
                vm.timeFormat = 'h:mm:SS a';

                vm.getLocalTime = function (date) {
                    if (date != null) {
                        return moment(date).format(vm.timeFormat);
                    }
                    else {
                        return "";
                    }
                };

                vm.getLocalDate = function (date) {
                    if (date != null) {
                        return moment(date).format(vm.dateFormat);
                    }
                    else {
                        return "";
                    }
                };

                vm.getLocalYear = function (date) {
                    if (date != null) {
                        return moment(date).format("YYYY");
                    }
                    else {
                        return "";
                    }
                };

                vm.isPayableFine = function (value) {
                    debugger;
                    return value == true ? "Yes" : "No";
                }


                vm.getFine = function () {
                    uaeFineService.getFineById(finesId).success(function (result) {
                        vm.fine = result;
                    });
                }

                vm.getFine();
            }
        ]);
