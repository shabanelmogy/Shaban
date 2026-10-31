// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:39572-39738
appModule.controller('host.views.cbs.projectDashboard.feedbackTasksFilters', [
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
                { label: "Paid", value: "Paid" },
                { label: "Complementary", value: "Complementary" },
                { label: "Buffer", value: "Buffer" },
                { label: "Bug", value: "Bug" },
                { label: "CR Feedback", value: "CR Feedback" }
            ];

            vm.statusList = [
                { id: 1, name: 'New' },
                { id: 2, name: 'TBD' },
                { id: 3, name: 'In Progress' },
                { id: 4, name: 'Completed' }
            ];
            vm.categoryList = [
                { id: 2, name: 'Bug' },
                {id:3, name: 'CR'}
            ]
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
                    else if (vm.filterType === 'creationTime') {
                        if (previousValue && previousValue.fromDate && previousValue.toDate) {
                            vm.dateRangeModel = {
                                startDate: moment(previousValue.fromDate).startOf('day').toDate(),
                                endDate: moment(previousValue.toDate).endOf('day').toDate()
                            };
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = true;
                        } else {
                            vm.dateRangeModel = null;
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = false;
                        }
                    }

                    else if (vm.filterType === 'releaseDate') {
                        if (previousValue && previousValue.fromDate && previousValue.toDate) {
                            vm.dateRangeModel = {
                                startDate: moment(previousValue.fromDate),
                                endDate: moment(previousValue.toDate)
                            };
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = true;
                        } else {
                            vm.dateRangeModel = null;
                            vm.filters = vm.filters || {};
                            vm.filters.enableDateRange = false;
                        }

                    }

                    else if (vm.filterType === 'type') {
                        vm.filterInputList = vm.typeOptions.filter(t => previousValue.includes(t.label));
                    }
                    else if (vm.filterType === 'status') {
                        vm.filterInputList = vm.statusList.filter(s => previousValue.includes(s.id));
                    }
                    else if (vm.filterType === 'category') {
                        if (previousValue === 'Bug' || previousValue === 2) {
                            vm.filterInput = 2;
                        } else if (previousValue === 'CR' || previousValue === 3) {
                            vm.filterInput = 3;
                        } else {
                            vm.filterInput = null;
                        }
                    }
                    if (vm.filterType === 'isApproved') {
                        if (previousValue === 'true' || previousValue === true) {
                            vm.filterInput = true;
                        } else if (previousValue === 'false' || previousValue === false) {
                            vm.filterInput = false;
                        } else {
                            vm.filterInput = null;
                        }
                    }
                    if (vm.filterType === 'critical') {
                        if (previousValue === 'true' || previousValue === true) {
                            vm.filterInput = true;
                        } else if (previousValue === 'false' || previousValue === false) {
                            vm.filterInput = false;
                        } else {
                            vm.filterInput = null;
                        }
                    }

                }
                $scope.$apply();
            }

            vm.save = function () {
                let result = {
                    type: vm.filterType,
                    projectId: vm.projectId,
                };

                if (vm.filterType === 'creationTime' || vm.filterType === 'releaseDate') {
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
                else if (vm.filterType === 'category') {
                    result.value = vm.filterInput;
                }
                else if (vm.filterType === 'type') {
                    result.value = vm.filterInputList.map(i => i.label);
                }
                else if (vm.filterType === 'isApproved') {
                    result.value = vm.filterInput;
                }
                else if (vm.filterType === 'critical') {
                    result.value = vm.filterInput;
                }
                else {
                    result.value = vm.filterInput;
                }

                $uibModalInstance.close(result);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            setTimeout(function (){
                init();
            }, 500);
        }
    ]);
