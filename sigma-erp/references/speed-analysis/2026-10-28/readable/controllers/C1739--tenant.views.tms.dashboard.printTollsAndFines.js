// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477151-477276
appModule.controller('tenant.views.tms.dashboard.printTollsAndFines', [
        '$scope', '$stateParams', 'abp.services.app.toll',
        function ($scope, $stateParams, tollAppService) {
            debugger;
            var vm = this;
            vm.filters = null;
            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters == null)
                vm.filters = $stateParams.filters;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.totalAmountWithSurcharge = 0;
            vm.totalChargedAmmount = 0;
            vm.totalCollectedAmount = 0;
            vm.totalDueAmount = 0;
            vm.totalTollAmount = 0;

            vm.isEmailSent = function (value) {
                if (value) {
                    return "Yes";
                } else {
                    return "No";
                }

            };
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
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

            vm.getlocalDateTimeForTolls = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat); //moment(moment(date)).format(vm.dateTimeFormat).utc();
                }
                else {
                    return "";
                }
            };

            //vm.getTolls = function (callback) {
            //    vm.loading = true;
            //    if (!(vm.filters.agreementNo === null || vm.filters.agreementNo === undefined || vm.filters.agreementNo === ''))
            //        vm.filters.isPrintTolldRequest = true;
            //    tollAppService.getTollsForTFMS(vm.filters).success(function (data) {
            //        vm.tolls = data;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            vm.toFixeRound = function (num) {
                return parseFloat(num).toFixed(2);
            };
            vm.tollsAndfineSummary = function () {
                debugger;
                if (vm.fines.length > 0) {
                    vm.totalAmountWithSurcharge = 0;
                    vm.totalChargedAmmount = 0;
                    vm.totalCollectedAmount = 0;
                    vm.totalDueAmount = 0;
                    angular.forEach(vm.fines, function (value) {
                        vm.totalAmountWithSurcharge += parseFloat(vm.toFixeRound(value.amountWithSurcharge));
                        vm.totalChargedAmmount += parseFloat(vm.toFixeRound(value.chargedAmmount));
                        vm.totalCollectedAmount += parseFloat(vm.toFixeRound(value.collectedAmount));
                        vm.totalDueAmount += (parseFloat(vm.toFixeRound(value.chargedAmmount)) - parseFloat(vm.toFixeRound(value.collectedAmount)));
                    });
                }

                if (vm.tolls.length > 0) {
                    vm.totalTollAmount = 0;
                    angular.forEach(vm.tolls, function (value) {
                        vm.totalTollAmount += parseFloat(value.amount);
                    });
                }
                if (vm.parkings.length > 0) {
                    vm.totalParkingAmount = 0;
                    angular.forEach(vm.tolls, function (value) {
                        vm.totalParkingAmount += parseFloat(value.amount);
                    });
                }
            };
            function getTolls() {
                /////temporary fix to solve sixt uae issue. Remove before next deployment
                //var tolls = vm.filters.tolls;
                //let tollsClone = JSON.parse(JSON.stringify(tolls));
                //angular.forEach(tollsClone, function (toll) {
                //    var tripDate = new Date(toll.tripDateTime);
                //    tripDate.setHours(tripDate.getHours() - 4);
                //    toll.tripDateTime = tripDate;
                //});
                ////temprary fix---------------------


                //vm.getTolls();
                vm.tolls = vm.filters.tolls;
                vm.fines = vm.filters.fines;
                vm.darbTolls = vm.filters.darbTolls;
                vm.parkings = vm.filters.parkings;
                vm.tollsAndfineSummary();
            }
            getTolls();
        }]);
