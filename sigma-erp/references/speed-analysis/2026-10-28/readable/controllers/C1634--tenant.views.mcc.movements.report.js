// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:449758-449902
appModule.controller('tenant.views.mcc.movements.report', ['$scope', '$stateParams', 'abp.services.app.movement', 
         'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, movementService, commonLookupService, utilities) {
            var vm = this;

            vm.showFuelInPercentage = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowFuelInPercentage"));
            vm.showDriverMinutesInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverMinutesInMovements"));

            vm.filters = null;
            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null) {
                vm.filters = $stateParams.filters;
            }

            //if (vm.filters.movementId) {
            //    vm.filters.plateNo = null;
            //    vm.filters.fromDate = null;
            //    vm.filters.toDate = null;
            //    vm.filters.IsCompleted = null;
            //    vm.filters.driverId = null;
            //    vm.filters.movementTypeId = null;
            //}

            //else if (vm.filters.plateNo) {
            //    vm.filters.movementId = null;
            //    vm.filters.fromDate = null;
            //    vm.filters.toDate = null;
            //    vm.filters.IsCompleted = null;
            //    vm.filters.driverId = null;
            //    vm.filters.movementTypeId = null;
            //}
            vm.movementType = '';

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
            vm.getMovementSubType = function (id) {
                if (id == 1)
                    return app.localize("Workshop_Maintenance");
                else if (id == 2)
                    return app.localize("Workshop_Repair");
                else if (id == 3)
                    return app.localize("Workshop_AccidentRepair");
                else if (id == 4)
                    return "NRM_General";
                else if (id == 5)
                    return "NRM_StaffCar";
                else if (id == 6)
                    return "NRM_SoldCarCustomerMovement";
                else if (id == 7)
                    return "NRM_NRT";
                else if (id == 8)
                    return "NRM_AgreementDelivery";
                else if (id == 9)
                    return "NRM_ReplacementDelivery";
                else if (id == 10)
                    return app.localize("Workshop_Inspection");
                else if (id == 13)
                    return app.localize("NRM_CustomerMovement");
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

            vm.getMovementType = function (type) {
                if (row.movementTypeId == 2 && row.movementSubType == 8)
                    return app.localize("AgreementDelivery");
                else if (row.movementTypeId == 2 && row.movementSubType == 9)
                    return app.localize("ReplacementDelivery");
                else
                    return app.localize(row.movementType);
            }

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

                movementService.getMovementsReport(vm.filters).success(function (data) {
                    vm.movementLogReportData = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
