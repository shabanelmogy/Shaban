// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36037-36081
appModule.controller('host.views.cbs.meetings.minutesOfMeetingViewModel', ['$uibModalInstance', 'meeting', 'abp.services.app.meeting',
        function ($uibModalInstance, meeting, meetingService) {

            vm = this;
            vm.loading = true;
            vm.meetingTitle = meeting.title;
            vm.minutes = [];

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
            };

            function init() {
                meetingService.getMeetingMinutes({ id: meeting.id }).success(function (data) {
                    vm.filters = data;
                    vm.minutes = data.meetingMinutes;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }]);
