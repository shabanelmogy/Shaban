// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:194860-194982
appModule.controller('tenant.views.todoDashboard.index', [
        '$scope', '$uibModal', '$timeout', 'abp.services.app.cRMCampaign', 'appSession',
        function ($scope, $uibModal, $timeout, taskAssignmentService, appSession) {
            var vm = this;
            vm.loading = false;
            vm.filters = {
                startDate: '',
                endDate: '',
                status: '',
                userId: null,
                locationId: appSession.user.locationId
            };

            vm.users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }, { id: 3, name: appSession.user.name }]; // Dummy data
            vm.userFilter = null;
            vm.statuses = ['Assigned', 'Started', 'Finished'];
            vm.totalAssignedTasks = 15;
            vm.myTasks = 5;
            vm.completedTasks = 10;
            vm.overdueTasks = 2;

            vm.tasks = [
                { id: 1, name: 'Prepare Report', assignedTo: 'User 1', dueDateTime: '2025-06-30', status: 'Assigned' },
                { id: 2, name: 'Fix Bug', assignedTo: appSession.user.name, dueDateTime: '2025-07-01', status: 'Started' },
                { id: 3, name: 'Team Meeting', assignedTo: 'User 2', dueDateTime: '2025-06-29', status: 'Finished' }
            ];

            vm.getTasks = function () {
                vm.loading = true;
                var filteredTasks = vm.tasks.filter(function (task) {
                    var taskDate = new Date(task.dueDateTime);
                    return (!vm.filters.startDate || taskDate >= new Date(vm.filters.startDate)) &&
                        (!vm.filters.endDate || taskDate <= new Date(vm.filters.endDate)) &&
                        (!vm.filters.status || task.status === vm.filters.status) &&
                        (!vm.filters.userId || task.assignedTo === vm.userFilter.name);
                });
                vm.tasks = filteredTasks;
                vm.loading = false;
            };

            vm.viewTask = function (task) {
                //$uibModal.open({
                //    templateUrl: '~/App/tenant/views/taskAssignment/createOrEditModal.cshtml',
                //    controller: 'tenant.views.taskAssignment.createOrEditModal as vm',
                //    backdrop: 'static',
                //    size: 'lg',
                //    resolve: {
                //        assignmentId: function () { return task.id; },
                //        editFlag: function () { return false; },
                //        viewFlag: function () { return true; }
                //    }
                //});
            };

            function initializeCharts() {
                const dates = [];
                for (let i = 13; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                }

                // Task Assignment Chart
                const taskAssignmentCtx = document.getElementById('taskAssignmentChart').getContext('2d');
                new Chart(taskAssignmentCtx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Tasks Assigned',
                            data: [5, 7, 3, 6, 8, 4, 9, 6, 5, 7, 8, 6, 7, 5],
                            backgroundColor: 'rgba(50, 197, 210, 0.2)',
                            borderColor: 'rgba(50, 197, 210, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(50, 197, 210, 1)',
                            pointRadius: 4,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { callbacks: { label: function (context) { return context.parsed.y + ' tasks'; } } }
                        },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 2 } } }
                    }
                });

                // Task Completion Chart
                const taskCompletionCtx = document.getElementById('taskCompletionChart').getContext('2d');
                new Chart(taskCompletionCtx, {
                    type: 'bar',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Tasks Completed',
                            data: [1, 0, 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 0],
                            backgroundColor: 'rgba(50, 197, 210, 0.7)',
                            borderColor: 'rgba(50, 197, 210, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { callbacks: { label: function (context) { return context.parsed.y + ' completed'; } } }
                        },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                    }
                });
            }

            function init() {
                vm.getTasks();
                initializeCharts();
            }
            init();
        }
    ]);
