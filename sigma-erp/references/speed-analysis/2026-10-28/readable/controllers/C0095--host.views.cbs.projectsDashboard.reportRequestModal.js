// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:45460-45648
appModule.controller('host.views.cbs.projectsDashboard.reportRequestModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'project', 'abp.services.app.taskDetail',
        function ($scope, $uibModal, $uibModalInstance, project, taskDetailService) {

            var vm = this;
            vm.saving = false;
            vm.project = project;
            vm.tasks = [];
            vm.taskFilter = [];
            vm.searchText = null;
             
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.openFeedbackDetailModal = function (taskDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/feedbackDetailModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.feedbackDetailModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        taskDetail: function () {
                            return taskDetail;
                        },
                        prepareRelease: vm.prepareRelease,
                        releaseId: vm.activeRelease,
                        isFromReportModal: true,
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                });
            };


            vm.exportTasksToExcel = function () {
                vm.loading = true;

                var categoryIds = vm.filters.categories.map(x => x.id);
                var statusIds = vm.filters.taskStatuses.map(x => x.id);

                taskDetailService.getTasksForReport({
                    id: vm.project,
                    category: categoryIds,
                    taskStatuses: statusIds
                }).success(function (data) {
                    if (!data || data.length === 0) {
                        abp.notify.warn("No tasks to export.");
                        return;
                    }

                    var tab1 = `<table border='1px'>
            <tr>
                <th>Task</th>
                <th>Description</th>
                <th>CR No</th>
                <th>CR Date</th>
                <th>Category</th>
                <th>Hours</th>
                <th>FeedBack Hrs</th>
                <th>Total Hours</th>
                <th>Released Date</th>
                <th>Status</th>
            </tr>`;

                    data.forEach(t => {
                        let category = vm.getCategoryType(t.category);
                        let status = vm.getTaskStatus(t.taskStatus);
                        let formattedDate = moment(t.crDate).format("DD MMM YYYY");
                        let releaseDate = t.releaseDate ? moment(t.releaseDate).format("DD MMM YYYY") : '';

                        tab1 += `<tr>
                <td>${t.title || ''}</td>
                <td>${t.description || ''}</td>
                <td>${t.changeReqNo || ''}</td>
                <td>${formattedDate}</td>
                <td>${category}</td>
                <td>${t.hours || 0}</td>
                <td>${t.feedBackHours || 0}</td>
                <td>${t.feedBackHours + t.hours || 0}</td>
                <td>${releaseDate}</td>
                <td>${status}</td>
            </tr>`;
                    });

                    tab1 += "</table>";

                    var blob = new Blob([tab1], { type: "application/vnd.ms-excel" });
                    var blobUrl = URL.createObjectURL(blob);

                    var a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = 'CRTaskReport.xls';
                    a.click();

                }).error(function () {
                    abp.notify.error("Failed to export tasks.");
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.filters = {
                categories: [],
                taskStatuses: []
            };

            vm.chargingTypes = [
                { id: 1, name: "Paid" },
                { id: 2, name: "Project Buffer" },
                { id: 3, name: "Complementary" },
                { id: 4, name: "Project GAP" }
            ];

            vm.statuses = [
                { id: 1, name: 'New' },
                { id: 2, name: 'To Be Discussed' },
                { id: 3, name: 'In Progress' },
                { id: 4, name: 'Completed' }
            ];

            vm.loadTasks = function () {
                vm.loading = true;

                taskDetailService.getTasksForReport({
                    id: vm.project,
                    category: vm.filters.categories.map(x => x.id),
                    taskStatuses: vm.filters.taskStatuses.map(x => x.id)
                }).success(function (data) {
                    vm.tasks = data;
                    vm.taskFilter = vm.tasks.slice();
                }).error(function () {
                    abp.notify.error("Failed to load tasks.");
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getTaskStatus = function (taskStatus) {
                if (!taskStatus) return '';
                else if (taskStatus == 1) return 'New';
                else if (taskStatus == 2) return 'To Be Discussed';
                else if (taskStatus == 3) return 'In Progress';
                else if (taskStatus == 4) return 'Completed';
                else return '';
            };

            vm.getCategoryType = function (id) {
                if (id == 1) {
                    return "Paid";
                }
                else if (id == 2) {
                    return "Project Buffer";
                }
                else if (id == 3) {
                    return "Complementary";
                }
                else if (id == 4) {
                    return "Project GAP";
                }

            }

            vm.FilterTasks = function () {
                vm.taskFilter = vm.tasks.slice();

                if (vm.searchText !== null && vm.searchText !== '') {
                    const search = vm.searchText.toLowerCase();
                    vm.taskFilter = vm.taskFilter.filter(f =>
                        (f.changeReqNo && f.changeReqNo.toLowerCase().includes(search)) ||
                        (f.title && f.title.toLowerCase().includes(search)) ||
                        (f.description && f.description.toLowerCase().includes(search)) ||
                        (f.categoryInString && f.categoryInString.toLowerCase().includes(search)) ||
                        (f.taskStatusInString && f.taskStatusInString.toLowerCase().includes(search))
                    );
                }
            };

            function init() {
                vm.loading = true;
                vm.loadTasks(); 
            }
            init();
        }
    ]);
