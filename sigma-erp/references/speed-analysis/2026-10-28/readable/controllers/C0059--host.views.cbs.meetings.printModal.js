// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36084-36126
appModule.controller('host.views.cbs.meetings.printModal', [
        '$stateParams', 'abp.services.app.meeting',
        function ($stateParams,meetingService) {
            var vm = this;

            
            vm.loading = false;
            var meetingId = 0;

            if (!isNaN($stateParams.query)) {
                meetingId = $stateParams.query;
            }

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
          
            
            function getMeeting() {
                vm.loading = true;
                meetingService.getMeetingForPrint({
                    id: meetingId
                }).success(function (result) {
                    vm.meeting = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }


            function init() {
                getMeeting();
            }

            init();
        }
    ]);
