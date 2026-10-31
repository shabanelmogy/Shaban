// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:35698-35823
appModule.controller('host.views.cbs.meetings.createOrEditMeetingModal', ['$scope', '$uibModal', 'uiGridConstants',
        'abp.services.app.directory', 'abp.services.app.meeting', 'abp.services.app.project', '$uibModalInstance',
        function ($scope, $uibModal, uiGridConstants, directoryService, meetingService, projectService, $uibModalInstance) {
            var vm = this;
            vm.loading = false;
            //vm.meeting = {
            //    meetingMinutes: []
            //};
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CBS.Meetings'),
                create: abp.auth.hasPermission('Pages.CBS.Meetings.AddNew'),
                edit: abp.auth.hasPermission('Pages.CBS.Meetings.Edit'),
                'delete': abp.auth.hasPermission('Pages.CBS.Meetings.Delete')
            };

            vm.filters = {
                project: null,
                title:'',
                detail:'',
                remarks: '',
                meetingMinutes: [],
            };

            vm.searchProjects = function ($select) {
                if ($select.search == "") return;

                projectService.searchProjects({ keyword: $select.search }).success(function (result) {

                    vm.projects = result.items;
                });
            };

            vm.clearProject = function () {
                vm.filters.project = null;
                vm.filters.projectId = null;
            };

            vm.projectChange = function (project) {
                vm.filters.company = project.company.companyName;
                vm.filters.tenant = project.tenant.tenancyName;
            };

            vm.createMeeting = function () {
                openCreateOrEditMeetingModal(null);
            };

            function openCreateOrEditMeetingModal(meetingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/meetings/createOrEditMeetingModal.cshtml',
                    controller: 'host.views.cbs.meetings.createOrEditMeetingModal as vm',
                    backdrop: 'static',
                    resolve: {
                        meetingId: function () {
                            return meetingId;
                        }
                    },
                    size: 'lg'
                });
                modalInstance.result.then(function (result) {
                    vm.getMeetings();
                });
            }

            vm.addRow = function (line) {
                if (line == undefined)
                    line = meetingLineObject();
                vm.filters.meetingMinutes.push(line);
            };

            function meetingLineObject() {
                var line = new Object();
                line.description = '';
                return line;
            }




            vm.removeRow = function (obj) {
                var index = vm.filters.meetingMinutes.indexOf(obj);
                vm.filters.meetingMinutes.splice(index, 1);
            };

            vm.save = function () {
          
                vm.saving = true;

                if (vm.filters.project != null) {
                    vm.filters.projectId = vm.filters.project.id;
                   // vm.filters.project = null;
                }

                meetingService.createOrUpdateMeeting({ meeting: vm.filters }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.getMeetings = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                meetingService.getMeetings(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
