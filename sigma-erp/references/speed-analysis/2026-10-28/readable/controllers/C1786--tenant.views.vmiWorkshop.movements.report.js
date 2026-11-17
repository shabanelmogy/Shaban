// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:487332-487435
appModule.controller('tenant.views.vmiWorkshop.movements.report', ['$scope', '$stateParams', 'abp.services.app.garage', 'utilities', 
        function ($scope, $stateParams, garageService, utilities) {
            var vm = this;

            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            vm.filters = null;
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null) {
                vm.filters = $stateParams.filters;
            }

            if (vm.filters.movementId) {
                vm.filters.plateNo = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.IsCompleted = null;
            }

            else if (vm.filters.plateNo) {
                vm.filters.movementId = null;
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
                vm.filters.IsCompleted = null;
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.marksChangedTooltip = function (movement) {
                if (movement != null) {
                    var toolTip = "";

                    if (movement.outDetail_NewMarks > 0) {
                        toolTip = app.localize('CheckoutNewMarks') + ": " + movement.outDetail_NewMarks;
                    }
                    if (movement.outDetail_RepairedMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckoutRepairedMarks') + ": " + movement.outDetail_RepairedMarks;
                    }
                    if (movement.inDetail_NewMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckinNewMarks') + ": " + movement.inDetail_NewMarks;
                    }
                    if (movement.inDetail_RepairedMarks > 0) {
                        if (toolTip != "") {
                            toolTip += ",  ";
                        }
                        toolTip += app.localize('CheckinRepairedMarks') + ": " + movement.inDetail_RepairedMarks;
                    }

                    return toolTip;
                }
                else {
                    return "";
                }
            };

            vm.checkIfCompleted = function () {
                if (!vm.filters.isCompleted)
                    return app.localize("No");
                else if (vm.filters.isCompleted)
                    return app.localize("Yes");
            };


            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };



            function init() {
                vm.loading = true;

                garageService.getMovementsReport(vm.filters).success(function (data) {
                    vm.movementLogReportData = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
