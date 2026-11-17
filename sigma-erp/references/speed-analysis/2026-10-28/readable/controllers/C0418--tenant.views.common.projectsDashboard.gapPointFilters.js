// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:103652-103756
appModule.controller('tenant.views.common.projectsDashboard.gapPointFilters', [
        '$scope', '$uibModalInstance', 'filterType', 'projectId', 'previousValue',
        function ($scope, $uibModalInstance, filterType, projectId, previousValue) {
            var vm = this;
            vm.filterType = filterType;
            vm.previousValue = previousValue;
            vm.projectId = projectId;
            vm.filterInput = '';
            vm.filterInputList = [];
            vm.dateFilter = {
                fromDate: null,
                toDate: null
            };
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.typeOptions = [
                { label: "GAP", value: "GAP" },
                { label: "Bug", value: "Bug" },
                { label: "CR Feedback", value: "CR Feedback" }
            ];

            vm.statusList = [
                { id: 1, name: 'New' },
                { id: 2, name: 'To Be Discussed' },
                { id: 3, name: 'In Progress' },
                { id: 4, name: 'Completed' }
            ];
            vm.dateRangeCheck = function () {
                if (!vm.filters.enableDateRange) {
                    vm.dateRangeModel = null;
                } else if (!vm.dateRangeModel) {
                    vm.dateRangeModel = {
                        startDate: moment().startOf('day').toDate(),
                        endDate: moment().endOf('day').toDate()
                    };
                }
            };

            function init() {
                if (previousValue != null) {
                    if (vm.filterType === 'title' || vm.filterType === 'reqNo') {
                        vm.filterInput = previousValue;
                    }
                    else if (vm.filterType === 'releaseDate') {
                        if (previousValue && previousValue.fromDate && previousValue.toDate) {
                            vm.dateRangeModel = {
                                startDate: new Date(previousValue.fromDate),
                                endDate: new Date(previousValue.toDate)
                            };
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = true;
                        } else {
                            vm.dateRangeModel = null;
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = false;
                        }

                    }

                    else if (vm.filterType === 'status') {
                        vm.filterInputList = vm.statusList.filter(s => previousValue.includes(s.id));
                    }

                }
                $scope.$apply();
            }

            vm.save = function () {
                let result = {
                    type: vm.filterType,
                    projectId: vm.projectId,
                };

                if (vm.filterType === 'releaseDate') {
                    if (vm.filters.enableDateRange && vm.dateRangeModel) {
                        result.value = {
                            fromDate: vm.dateRangeModel.startDate,
                            toDate: vm.dateRangeModel.endDate
                        };
                    } else {
                        result.value = null;
                    }
                }
                else if (vm.filterType === 'status') {
                    result.value = vm.filterInputList.map(i => i.id);
                }
               
                else {
                    result.value = vm.filterInput;
                }

                $uibModalInstance.close(result);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            setTimeout(function () {
                init();
            }, 500);
        }
    ]);
