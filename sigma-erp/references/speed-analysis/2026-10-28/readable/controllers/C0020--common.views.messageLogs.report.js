// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:27477-27542
appModule.controller('common.views.messageLogs.report', ['$scope', '$stateParams', 'abp.services.app.messageLog', 'utilities',
        function ($scope, $stateParams, messageLogService, utilities) {

            var vm = this;
            vm.locationName = '';
            
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getMessageType = function (type) {
                if (type == 1) {
                    return app.localize("Email");
                } else {
                    return app.localize("Sms");
                }
            };
            vm.getMessageStatus = function (type) {
                if (type == 1) {
                    return app.localize("Delivered");
                } else if (type == 2) {
                    return app.localize("Rejected");
                }
            };
            function getTypes() {
                vm.types = [
                    { id: 1, name: app.localize("Email") },
                    { id: 2, name: app.localize("Sms") }
                ];
            };
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Delivered") },
                    { id: 2, name: app.localize("Rejected") }
                ];
            };


            function init() {
                vm.loading = true;
                messageLogService.getMessageLogReport(vm.filters).success(function (data) {
                    vm.messageLogData = data.items;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
