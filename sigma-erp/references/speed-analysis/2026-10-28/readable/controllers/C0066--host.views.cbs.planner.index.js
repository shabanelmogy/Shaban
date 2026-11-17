// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36574-36862
appModule.controller('host.views.cbs.planner.index',
        [
            '$scope', 'project', '$uibModalInstance', 'abp.services.app.taskDetail', 'abp.services.app.user',
            function ($scope, project, $uibModalInstance, taskDetailService, userService) {
                var vm = this;
                vm.cancel = function () {
                    $uibModalInstance.close();
                };
                
                $scope.data = [
                    // Order is optional. If not specified it will be assigned automatically
                    {
                        name: 'Milestones', height: '3em', sortable: false, classes: 'gantt-row-milestone', color: '#45607D', tasks: [
                            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object

                        ]
                    },
                    {
                        name: 'Status meetings', tasks: [
                            { name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0) },
                            { name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0) },
                            { name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0) },
                            { name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0) },
                            { name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0) }
                        ]
                    },
                    {
                        name: 'Kickoff', movable: { allowResizing: false }, tasks: [
                            {
                                name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
                                progress: { percent: 100, color: '#3C8CF8' }, movable: false
                            },
                            {
                                name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
                                progress: { percent: 100, color: '#3C8CF8' }
                            },
                            {
                                name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
                                progress: { percent: 100, color: '#3C8CF8' }
                            }
                        ]
                    },
                    {
                        name: 'Create concept', dependencies: [], tasks: [
                            {
                                name: 'Create concept', priority: 20, content: '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}', color: '#F1C232', from: new Date(2013, 9, 10, 8, 0, 0), to: new Date(2013, 9, 16, 18, 0, 0), est: new Date(2013, 9, 8, 8, 0, 0), lct: new Date(2013, 9, 18, 20, 0, 0),
                                progress: 100, dependencies: []
                            }
                        ]
                    },
                    {
                        name: 'Finalize concept', dependencies: [], tasks: [
                            {
                                id: 'Finalize concept', name: 'Finalize concept', priority: 10, color: '#F1C232', from: new Date(2013, 9, 17, 8, 0, 0), to: new Date(2013, 9, 18, 18, 0, 0),
                                progress: 100, dependencies: []
                            }
                        ]
                    },
                    { name: 'Development', children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'], content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}' },
                    {
                        name: 'Sprint 1', tooltips: false, tasks: [
                            {
                                id: 'Product list view', name: 'Product list view', color: '#F1C232', from: new Date(2013, 9, 21, 8, 0, 0), to: new Date(2013, 9, 25, 15, 0, 0),
                                progress: 25, dependencies: [{ to: 'Order basket' }]
                            }
                        ]
                    },
                    {
                        name: 'Sprint 2', tasks: [
                            {
                                id: 'Order basket', name: 'Order basket', color: '#F1C232', from: new Date(2013, 9, 28, 8, 0, 0), to: new Date(2013, 10, 1, 15, 0, 0),
                                dependencies: { to: 'Checkout', connectParameters: { endpoint: ['Rectangle', { width: 12, height: 12 }] } }
                            }
                        ]
                    },
                    {
                        name: 'Sprint 3', tasks: [
                            {
                                id: 'Checkout', name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 1, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0),
                                dependencies: { to: 'Login & Signup & Admin Views' }
                            }
                        ]
                    },
                    {
                        name: 'Sprint 4', tasks: [
                            {
                                id: 'Login & Signup & Admin Views', name: 'Login & Signup & Admin Views', color: '#F1C232', from: new Date(2013, 10, 11, 8, 0, 0), to: new Date(2013, 10, 15, 15, 0, 0),
                                dependencies: [{ to: 'HW' }, { to: 'SW / DNS/ Backups' }]
                            }
                        ]
                    },
                    { name: 'Hosting' },
                    {
                        name: 'Setup', tasks: [
                            { id: 'HW', name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0) }
                        ]
                    },
                    {
                        name: 'Config', tasks: [
                            { id: 'SW / DNS/ Backups', name: 'SW / DNS/ Backups', color: '#F1C232', from: new Date(2013, 10, 18, 12, 0, 0), to: new Date(2013, 11, 28, 18, 0, 0) }
                        ]
                    },
                    { name: 'Server', parent: '', children: ['Setup', 'Config'] },
                    {
                        name: 'Deployment', parent: 'Hosting', tasks: [
                        ]
                    },
                    {
                        name: 'Workshop', tasks: [

                        ]
                    },
                    {
                        name: 'Content', tasks: [

                        ]
                    },
                    {
                        name: 'Documentation', tasks: [

                        ]
                    }
                ];



                $scope.options = {
                    mode: 'custom',
                    scale: 'day',
                    sortMode: undefined,
                    sideMode: 'TreeTable',
                    daily: false,
                    maxHeight: false,
                    width: false,
                    zoom: 1,
                    columns: ['model.name', 'from', 'to'],
                    treeTableColumns: ['from', 'to'],
                    columnsHeaders: { 'model.name': 'Name', 'from': 'From', 'to': 'To' },
                    columnsClasses: { 'model.name': 'gantt-column-name', 'from': 'gantt-column-from', 'to': 'gantt-column-to' },
                    columnsFormatters: {
                        'from': function (from) {
                            return from !== undefined ? from.format('lll') : undefined
                        },
                        'to': function (to) {
                            return to !== undefined ? to.format('lll') : undefined
                        },
                        'duration': function (duration) {
                            return duration !== undefined ? to.format('lll') : undefined
                        }

                    },
                    treeHeaderContent: '<i class="fa fa-align-justify"></i> {{getHeader()}}',
                    columnsHeaderContents: {
                        'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
                        'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
                        'to': '<i class="fa fa-calendar"></i> {{getHeader()}}',
                        
                    
                    },
                    autoExpand: 'none',
                    taskOutOfRange: 'truncate',
                    fromDate: moment(null),
                    toDate: undefined,
                    rowContent: '<i class="fa fa-align-justify"></i> {{row.model.name}}',
                    taskContent: '<i class="fa fa-tasks"></i> {{task.model.name}}',
                    allowSideResizing: true,
                    labelsEnabled: true,
                    currentDate: 'line',
                    currentDateValue: new Date(2013, 9, 23, 11, 20, 0),
                    draw: false,
                    readOnly: false,
                    groupDisplayMode: 'group',
                    filterTask: '',
                    filterRow: '',
                    timeFrames: {
                        'day': {
                            start: moment('8:00', 'HH:mm'),
                            end: moment('20:00', 'HH:mm'),
                            color: '#ACFFA3',
                            working: true,
                            default: true
                        },
                        'noon': {
                            start: moment('12:00', 'HH:mm'),
                            end: moment('13:30', 'HH:mm'),
                            working: false,
                            default: true
                        },
                        'closed': {
                            working: false,
                            default: true
                        },
                        'weekend': {
                            working: false
                        },
                        'holiday': {
                            working: false,
                            color: 'red',
                            classes: ['gantt-timeframe-holiday']
                        }
                    },
                    dateFrames: {
                        'weekend': {
                            evaluator: function (date) {
                                return date.isoWeekday() === 6 || date.isoWeekday() === 7
                            },
                            targets: ['weekend']
                        },
                        '11-november': {
                            evaluator: function (date) {
                                return date.month() === 10 && date.date() === 11
                            },
                            targets: ['holiday']
                        }
                    },
                    timeFramesWorkingMode: 'hidden',
                    timeFramesNonWorkingMode: 'visible',
                    columnMagnet: '15 minutes',
                    timeFramesMagnet: true,

                };


                $scope.registerApi = function (api) {
                    api.core.on.ready($scope, function () {
                        api.dependencies.on.add($scope, function (dependency) {
                            console.log("deppp 2");
                            console.log(dependency);
                            console.log(dependency.getToTaskId());
                            console.log(dependency.getFromTaskId());
                            taskDetailService.addTaskDependency({ from: dependency.getFromTaskId(), to: dependency.getToTaskId() })
                                .success(function (res) {
                                    init();
                                });
                        });
                        api.dependencies.on.remove($scope, function (dependency) {
                            console.log("remove 2");
                            console.log(dependency);
                            console.log(dependency.getToTaskId());
                            console.log(dependency.getFromTaskId());
                            taskDetailService.removeTaskDependency({ from: dependency.getFromTaskId(), to: dependency.getToTaskId() });
                        });

                        api.dependencies.on.change($scope, function (dependency,olddependency) {
                            console.log("change 2");
                            console.log(dependency);
                            console.log(olddependency);
                            taskDetailService.removeTaskDependency({ from: olddependency.getFromTaskId(), to: olddependency.getToTaskId() });
                            //taskDetailService.changeTaskDependency({ from: dependency.getFromTaskId(), to: dependency.getToTaskId(), oldFrom: olddependency.getFromTaskId(), oldTo: olddependency.getToTaskId() });
                        });


                        api.tasks.on.moveEnd($scope, function (task) {
                            console.log("move 2");
                            console.log(task.model);
                            taskDetailService.editTaskPlanner({ id: task.model.id, from: task.model.from, to: task.model.to })
                                .success(function (res) {
                                    init();
                                });
                        });
                    });

                };

                function init() {
                    vm.loading = true;
                    taskDetailService.getProjectTaskForPlanner(project)
                        .success(function (result) {
                            

                            $scope.data = result.plannerTasks;
                            vm.tasks = result.tableTasks;


                            vm.loading = false;
                        });
                }
                vm.getlocalDateTime = function (date) {
                    if (date != null) {
                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format('DD-MMM-YY');
                    }
                    else {
                        return "";
                    }
                };
                init();
            }
        ]);
