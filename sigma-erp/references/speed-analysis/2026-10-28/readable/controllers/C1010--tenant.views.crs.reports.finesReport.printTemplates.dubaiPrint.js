// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272396-272449
appModule.controller('tenant.views.crs.reports.finesReport.printTemplates.dubaiPrint',
        [
            '$scope', 'abp.services.app.uaeFine',
            function ($scope, uaeFineService) {
                var vm = this;
                vm.currentDate = new Date();
                vm.fine = {};
                if ($scope.$parent !== null) {
                    if ($scope.$parent.vmMain !== null)
                        vm.filters = $scope.$parent.vmMain.filters;
                }

                var finesId = vm.filters;

                vm.dateTimeFormat = "DD-MM-YYYY h:mm a";

                vm.getLocalTime = function (date) {
                    if (date != null) {
                        return moment(date).format(vm.dateTimeFormat).toUpperCase();
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
                


                vm.getFine = function () {
                    uaeFineService.getFineById(finesId).success(function (result) {
                        vm.fine = result;
                    });
                }

                vm.getFine();
            }
        ]);
