// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:484330-484378
appModule.controller('tenant.views.vmiGeneric.dashboard.index', [
        '$scope', '$uibModal', 'abp.services.app.vmiGenericInspection',
        function ($scope, $uibModal, inspectionService) {
            var vm = this;
            vm.vehicleInspections = [];
            vm.totalInspections = 0;
            
            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.vehiclePieChart = {};
            vm.vehiclePieChart.type = "PieChart";
            vm.vehiclePieChart.cssStyle = "float:right !important; background: black !important;";
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
                //colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#1733ed', '#777777', '#8e44ad', 'red', '#FF91F0', '#26C281', '#a5da38']
                //colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#FF91F0']
                colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#FF91F0']
            };

            function init() {
                inspectionService.getInspectionCountForDashBoard().success(function (result) {
                    vm.vehicleInspections = result;
                    vm.totalInspections = 0;
                    vm.vehicleInspections.forEach(function (data) {
                        vm.totalInspections = vm.totalInspections + data.count;
                    });
                });
            };
            init();
        }
    ]);
