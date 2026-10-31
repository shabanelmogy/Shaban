// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:55084-55225
appModule.controller('host.views.cbs.timeSheetReport.index', [
        '$scope', '$uibModal', 'abp.services.app.user', 'appSession', 'abp.services.app.projectTask', 'abp.services.app.timeSheetReport',  'utilities',
        function ($scope, $uibModal, userService, appSession, projectTaskService, timeSheetReportService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.selectionName = null;
            vm.selectionId = null;
            vm.isOrganization = false;
            vm.taskDetailLogs = [];
            //Input Filters
            vm.filters = {
                organizationId: null,
                userId : null
            };
                  

            //Page permission
            vm.permissions = {
                release: abp.auth.hasPermission('Pages.CBS.TimeSheetReport')
            };

          
            // Refresh
            vm.refresh = function () {
                vm.loading = true;
                vm.getUserWorkingHoursWeekly();
                vm.loading = false;
            };

            vm.clearSelection = function () {
                vm.selectionName = null;
                vm.selectionId = null;
                vm.filters.userId = null;
                vm.isOrganization = false;
                vm.getUserWorkingHoursWeekly();

            };

          

            // Get User's work per Hours weekly(Timesheet)
            vm.getUserWorkingHoursWeekly = function () {
                vm.loading = true;
                vm.filters.organizationId = null;
                if (vm.isOrganization == true) {
                    vm.filters.userId = null;
                    vm.filters.organizationId = vm.selectionId;
                }
                timeSheetReportService.getAllUsersWorkingHours(vm.filters).success(function (result) {
                    vm.taskDetailLogs = [];
                    vm.days = [];
                    for (var i = 0; i < 1; i++)
                    {
                        result[i].timeSheet.forEach(function (item, index)
                        {
                            vm.days.push({ day: item.day, startDateinString: item.startDateinString });
                        });
                    }
                    vm.taskDetailLogs = result;
                    vm.loading = false;
                });
            };

            vm.searchOrganizationContactPopup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/dueTasks/searchOrganizationUnitContactModal.cshtml',
                    controller: 'host.views.cbs.dueTasks.searchOrganizationUnitContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        debugger
                        vm.selectionId = result.id;
                        vm.selectionName = result.name;
                        vm.isOrganization = result.isOrganization;
                        if (vm.isOrganization == true) {
                            vm.filters.userId = vm.selectionId;
                            vm.getUserWorkingHoursWeekly();

                        }
                        else {
                            vm.filters.userId = vm.selectionId;
                            vm.filters.user = { id: vm.selectionId, name: result.name };
                            vm.getUserWorkingHoursWeekly();
                        }

                    }

                });
            };





            vm.userSelectionChanged = function () {
                vm.isOrganization = false;
                vm.getUserWorkingHoursWeekly();
            };


            vm.ViewTasks = function (startdate, enddate, userId, hours) {
                if (hours > 0) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/timeSheetReport/ViewDailyWorkingHours.cshtml',
                        controller: 'host.views.cbs.timeSheetReport.ViewDailyWorkingHours as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve:
                        {
                            startdate: function () {
                                return startdate;
                            },
                            enddate: function () {
                                return enddate;
                            },
                            userId: function () {
                                return userId;
                            },

                        }
                    });
                    modalInstance.result.then(function () {
                        vm.taskDetailLogs = [];
                        vm.getUserWorkingHoursWeekly();
                        vm.refresh();
                    });
                }
            };

            

      
            function init() {
                vm.getUserWorkingHoursWeekly();
            }
            init();
        }
    ]);
