// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:100945-101190
appModule.controller('tenant.views.common.hrm.settings', [
        '$scope', 'abp.services.app.payStructureSetting', 'abp.services.app.salaryItemsSetting', 'abp.services.app.tenantSettings',
        function ($scope, payStructureSettingService, salaryItemsSettingService, tenantSettingsService) {

            var vm = this;
            vm.isHrmBusinessUnitEnabled = abp.features.isEnabled("HRM.Business.Unit");

            vm.salaryItems = [];
            vm.filters = [];

            vm.salaryItemCategoriesNames = [
                "Gross",
                "Overtime",
                "OtherIncentive",
                "Deduction",
                "LongTermLiability",
            ];
            vm.saving = false;
            vm.loading = true;
            vm.deleting = false;
            function init() {
                payStructureSettingService.getAll()
                    .success((r) => {
                        vm.salaryItems = r;
                        vm.getSettings();
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }
            vm.accountLinkingTypes = [
                {
                    id: 1,
                    name: app.localize('Default')
                },
                {
                    id: 2,
                    name: app.localize('Unit')
                },
                {
                    id: 3,
                    name: app.localize('Division')
                }];

            vm.daysPerMonthCalculationMethod = [
                {
                    id: 1,
                    name: app.localize('CalendarMonth')
                },
                {
                    id: 2,
                    name: app.localize('ThirtyDays')
                }];
            function getSalaryItemTypes() {
                vm.loading = true;
                salaryItemsSettingService.getSalaryItemTypes().success(function (data) {

                    vm.salaryTypes = data;
                    // Only category = 1
                    vm.leaveSalaryTypes = data.filter(function (item) {
                        return item.category === 1;
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getLocalize = (name) => {
                if (name == "OtherDeduction1")
                    return "Extra Deduction";

                return abp.localization.localize(name);
            }
            vm.isGranted = (permission) => {
                return abp.auth.isGranted(permission);
            }

            vm.addSalaryItem = (categoryId) => {
                vm.salaryItems.push({ formula: '', id: 0, salaryItem: { category: categoryId }, order: vm.salaryItems.length > 0 ? (vm.salaryItems.length + 1) : 1 });
            }

            vm.removeSalaryItem = (salaryItem) => {
                let index = vm.salaryItems.indexOf(salaryItem);
                if (index > -1) {
                    vm.salaryItems.splice(index, 1);
                    vm.deleting = true;
                }
            }

            vm.saveHrmSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateHrmSettings(
                    vm.settings.hrm
                ).success(function () {
                    vm.loading = false;
                    //    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.getSettings = function () {
                vm.loading = true;

                tenantSettingsService.getAllSettings()

                    .success(function (result) {

                        vm.settings = result;
                        vm.settings.hrm = vm.settings.hrm || {};
                        if (vm.settings.hrm.salaryItemsForLeaveSalaryCalculation)
                            vm.filters.salaryItemsForLeaveSalaryCalculation = angular.fromJson(vm.settings.hrm.salaryItemsForLeaveSalaryCalculation);


                        var value = parseInt(vm.settings.hrm.accountLinkingType);

                        vm.settings.hrm.accountLinkingType = isNaN(value) ? 1 : value;

                        var monthDaysRule = parseInt(vm.settings.hrm.monthDaysCalculationRule);

                        vm.settings.hrm.monthDaysCalculationRule = isNaN(monthDaysRule) ? 2 : monthDaysRule;

                        var attendanceRegularizationLimit =
                            parseInt(vm.settings.hrm.attendanceRegularizationLimit);

                        vm.settings.hrm.attendanceRegularizationLimit =
                            isNaN(attendanceRegularizationLimit)
                                ? null
                                : attendanceRegularizationLimit;

                        var attendanceGracePeriodMinutes =
                            parseInt(vm.settings.hrm.attendanceGracePeriodMinutes);

                        vm.settings.hrm.attendanceGracePeriodMinutes =
                            isNaN(attendanceGracePeriodMinutes)
                                ? null
                                : attendanceGracePeriodMinutes;

                        var payrollCutoffDay =
                            parseInt(vm.settings.hrm.payrollCutoffDay);

                        vm.settings.hrm.payrollCutoffDay =
                            isNaN(payrollCutoffDay)
                                ? null
                                : payrollCutoffDay;

                        var minimumOvertimeMinutesPerDay =
                            parseInt(vm.settings.hrm.minimumOvertimeMinutesPerDay);

                        vm.settings.hrm.minimumOvertimeMinutesPerDay =
                            isNaN(minimumOvertimeMinutesPerDay)
                                ? null
                                : minimumOvertimeMinutesPerDay;

                    }).finally(function () {
                        vm.loading = false;
                        vm.getNotificationAdvanceSetting();
                    });
            };

            vm.save = () => {
                //for (var i = 0; i < vm.salaryItems.length; i++) {
                //    vm.salaryItems[i].order = i;
                //}

                vm.saving = true;

                if (vm.filters.salaryItemsForLeaveSalaryCalculation)
                    vm.settings.hrm.salaryItemsForLeaveSalaryCalculation = angular.toJson(vm.filters.salaryItemsForLeaveSalaryCalculation);
                else
                    vm.settings.hrm.salaryItemsForLeaveSalaryCalculation = "";

                payStructureSettingService.createOrUpdate(vm.salaryItems)
                    .success(() => {
                        vm.saveHrmSettings();
                        abp.notify.success('successfully saved!');
                    })
                    .finally(() => {
                        vm.saving = false;
                        vm.deleting = false;
                    });
            }

            vm.isDisabledSaveBtn = (formInvalid) => {
                if (formInvalid) {
                    return true;
                }
                if (!vm.isGranted('Pages.HRM.PayStructure.Settings.Edit')) {
                    return true;
                }
                if (!vm.deleting && vm.salaryItems.length < 1) {
                    return true;
                }
            }

            vm.sortOfSalaryItemsChanged = (event, ui) => {
                //  vm.loading = true;
                debugger;
                vm.tempList = angular.copy(vm.salaryItems);
                vm.salaryItems = null;
                let obj = JSON.parse(ui.item.attr('data-id'));
                let updatedIndex = ui.item.index();
                let si = obj.si;
                if (!si.salaryItemId) {
                    init();
                    alert("select unique Type");
                    return;
                }

                let filteredItems = vm.tempList.filter(item => item.salaryItem.category === si.salaryItem.category);
                let perviousIndex = vm.tempList.findIndex(x => x.salaryItemId === si.salaryItemId);
                let updatedIndexSalaryItems = vm.tempList.findIndex(item => item.salaryItemId === filteredItems[updatedIndex].salaryItemId);

                if (updatedIndex == 0) {
                    //si.priority = (milestone.tasks[0].priority) / 2;
                    si.order = (filteredItems[0].order) / 2;
                    var element = si;
                    vm.tempList.splice(perviousIndex, 1);
                    vm.tempList.splice(updatedIndexSalaryItems, 0, element);
                }
                else if (updatedIndex == (filteredItems.length - 1)) {
                    si.order = (filteredItems[updatedIndex].order + filteredItems[updatedIndex].order + 1) / 2;
                    var element = si;
                    vm.tempList.splice(perviousIndex, 1);
                    vm.tempList.splice(updatedIndexSalaryItems, 0, element);
                }
                else {
                    if (updatedIndex > filteredItems.findIndex(x => x.salaryItemId === si.salaryItemId))
                        si.order = (filteredItems[updatedIndex + 1].order + filteredItems[updatedIndex].order) / 2;
                    else if (updatedIndex < filteredItems.findIndex(x => x.salaryItemId === si.salaryItemId))
                        si.order = (filteredItems[updatedIndex - 1].order + filteredItems[updatedIndex].order) / 2;
                    var element = si;
                    vm.tempList.splice(perviousIndex, 1);
                    vm.tempList.splice(updatedIndexSalaryItems, 0, element);
                }
                vm.salaryItems = angular.copy(vm.tempList);
                $scope.$apply();

            }
            init();
            getSalaryItemTypes();
        }
    ]);
