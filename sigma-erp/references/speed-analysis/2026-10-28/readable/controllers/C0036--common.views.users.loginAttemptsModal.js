// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:29260-29313
appModule.controller('common.views.users.loginAttemptsModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.userLogin',
        function ($scope, $uibModalInstance, userLoginService) {
            var vm = this;

            vm.loginAttempts = [];

            function convertToLocalDateTime(date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime);
                }
                else {
                    return null;
                }
            }
            
            vm.getUserLoginAttempts = function () {
                userLoginService.getRecentUserLoginAttempts({}).success(function (result) {
                    vm.loginAttempts = result.items;

                    angular.forEach(vm.loginAttempts, function (loginAttempt) {
                        loginAttempt.profileImageUrl = (loginAttempt.result === 'Success' ?
                                                (abp.appPath + 'Profile/GetProfilePicture?v=' + new Date().valueOf()) :
                                                '/Common/Images/default-profile-picture.png');
                    });
                });
            };

            vm.getLoginAttemptClass = function(loginAttempt) {
                return loginAttempt.result === 'Success' ? 'label-success' :
                    'label-danger';
            };

            vm.getCreationTime = function (loginAttempt) {
                return moment(convertToLocalDateTime(loginAttempt.creationTime)).fromNow() + ' (' + (convertToLocalDateTime(loginAttempt.creationTime)).format('YYYY-MM-DD HH:mm:ss') + ')';
            };

            vm.formatLoginAttemptResult = function (loginAttemt) {
                return loginAttemt.result === 'Success' ? app.localize('Success') :
                    app.localize('Failed');
            }

            vm.close = function() {
                $uibModalInstance.close();
            };

            function init() {
                vm.getUserLoginAttempts();
            }

            init();
        }
    ]);
