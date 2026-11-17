// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300289-300395
appModule.controller('tenant.views.transportation.dashboard.index', [
        '$scope','abp.services.app.vehicle','abp.services.app.transAgreement',
        function ($scope,vehicleService, transAgreementService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
           
            vm.vehiclesSummary = null;
           
            vm.permissions = {
                vehicles: abp.auth.hasPermission('Pages.Tenant.Vehicles'),
                transAgreements: abp.auth.hasPermission('Pages.Tenant.Transportation'),
            };

            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };

            vm.ownershipFilterChanged = function () {
                init();
            };

            vm.vehiclePieChart = {};
            vm.vehiclePieChart.type = "PieChart";
            vm.vehiclePieChart.data = {
                "cols": [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Slices", type: "number" }
                ],
                "rows": []
            };

            vm.vehiclePieChart.options = {
                'legend': { position: 'none' },
                width: 120,
                height: 120,
                chartArea: { left: 10, top: 10, bottom: 10, right: 10, height: "100%" },
                colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#1733ed', '#777777', '#FF91F0']
            };

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            };

            vm.getVehiclesSummary = function () {
                vehicleService.getLimoVehiclesSummary(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummary = result;
                    

                    //fill pie chart
                    vm.vehiclePieChart.data.rows.length = 0;
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('On') + ' ' + app.localize('Agreements') }, { v: vm.transAgreementsSummary.open }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('OnNRM') }, { v: vm.vehiclesSummary.onNrm }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('InWorkShop') }, { v: vm.vehiclesSummary.workShop }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ForSale') }, { v: vm.vehiclesSummary.forSale }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('TotalLoss') }, { v: vm.vehiclesSummary.totalLoss }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Idle') }, { v: vm.vehiclesSummary.idleOnTrip - vm.transAgreementsSummary.open }] });

                });
            };

            vm.getTransportationSummary = function () {
                transAgreementService.getTransAgreementsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                    }).success(function (result) {
                        vm.transAgreementsSummary = result;
                        if (vm.permissions.vehicles) {
                            vm.getVehiclesSummary();
                        }
                    });
            };

            vm.getVehicleSummaryNrm = function () {
                vehicleService.getVehicleSummaryNrm(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummaryNrm = result;
                    });
            };

            vm.getVehicleSummaryWorkShop = function () {
                vehicleService.getVehicleSummaryWorkShop(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummaryWorkShop = result;
                    });
            };
           
            function init() {
                vm.getTransportationSummary();
                //if (vm.permissions.vehicles) {
                //    vm.getVehiclesSummary();
                //}
                vm.getVehicleSummaryNrm();
                vm.getVehicleSummaryWorkShop();
            };

            init();
        }
    ]);
