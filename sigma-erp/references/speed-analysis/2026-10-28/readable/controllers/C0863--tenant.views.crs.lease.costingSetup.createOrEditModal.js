// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236210-236355
appModule.controller('tenant.views.crs.lease.costingSetup.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.tariff', 'costSettingId', 'abp.services.app.vehicleModel', 'abp.services.app.costParameter', 'abp.services.app.costSetting',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, tariffService, costSettingId, vehicleModelService, costParameterService, costSettingService) {

            var vm = this;

            vm.filters = {
            };

            vm.saving = false;
            vm.isEditMode = false;
            vm.halfDayLineAdded = false;
            vm.agreementType = 1;
            vm.statuses = null;
            vm.costSetting = {};
            vm.permissions = {
                showVehiceCost: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.ManageVehicleCost'),
            };
            
            vm.localize = function (key) {
                return app.localize(key);
            };
            function getRates() {
                vm.rates = [
                    { id: 14, name: app.localize("PerYear") },
                    { id: 15, name: app.localize("PercentPerYear") },
                    { id: 6, name: app.localize("OneTime") },
                    { id: 16, name: app.localize("PercentOfx") },
                    { id: 17, name: app.localize("PercentOfy") }
                ];
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };


            //add rental tariff line
            vm.addRow = function (row) {
                var foundLines = $filter('filter')(vm.costSetting.settingLines, {
                    name: row.name,
                }, true);

                var subOrder = 1;
                var chargesType = null;
                var rateType = null;

                if (foundLines.length > 0) {
                    subOrder = foundLines.length + 1;
                }

                vm.costSetting.settingLines.push(
                    {
                        costParam: row,
                        subOrder: subOrder,
                        costParamId: row.id,
                    });

            };

            vm.removeRow = function (row) {
                var name = row.name;
                var rateTypeId = row.rateTypeId;
                var index = vm.costSetting.settingLines.indexOf(row);
                vm.costSetting.settingLines.splice(index, 1);

                var otherSimilarLines = $filter('filter')(vm.costSetting.settingLines, {
                    name: name,
                }, true);

                //var subOrder = 1;
                //for (var i = 0; i < otherSimilarLines.length; i++) {
                //    otherSimilarLines[i].subOrder = subOrder;
                //    subOrder += 1;
                //}


            };

            vm.addCostParametersSetting = function () {
                if (vm.costSetting.settingLines.length == 0) {
                    vm.costingParameters.forEach(function (row) {
                        vm.costSetting.settingLines.push({
                            costParamId: row.id,
                            subOrder: 1,
                            fromYear: null,
                            toYear: null,
                            rateType: null,
                            rate: null,
                            costParam: row,
                            name: row.name
                        });
                    });
                }
            };

            vm.getcostingParameters = function () {
                vm.loading = true;
                costParameterService.getcostingParameters({}).success(function (data) {
                    vm.costingParameters = data.items;
                    vm.addCostParametersSetting();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.save = function () {
                vm.saving = true;
                costSettingService.createOrUpdateCostSetting({ costSetting: vm.costSetting }).success(function () {
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {

                costSettingService.getCostSettingForEdit({ id: costSettingId }).success(function (data) {
                    vm.costSetting = data;
                    vm.isEditMode = costSettingId > 0;
                    vm.costSetting.settingLines.forEach(function (row) {
                        row.name = row.costParam.name
                    });
                    getRates();
                    vm.getcostingParameters();
                });

            }

            init();

        }
    ]);
