// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:475161-475220
appModule.controller('tenant.views.tms.attachDetails.updateModal', [
        '$scope', '$filter', '$uibModal', 'utilities', 'SelectedTollsDetail', 'uiGridConstants', '$uibModalInstance', 'abp.services.app.toll',
        function ($scope, $filter, $uibModal, utilities, SelectedTollsDetail, uiGridConstants, $uibModalInstance, tollsService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = {
                name: null,
            }
            vm.loading = false;
            vm.SelectedTollsDetail = SelectedTollsDetail;
            vm.isSentByDashboard = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.cancel = function () {
                $uibModalInstance.close(vm.SelectedTollsDetail);
            }
            vm.save = function () {
                vm.loading = true;
                vm.SelectedTollsDetail.agreementNo = vm.agreementNo;

                tollsService.updateSalikAccountDetails(vm.SelectedTollsDetail).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.SelectedTollsDetail);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function initialize() {
                if (!(vm.SelectedTollsDetail.agreementNo === null || vm.SelectedTollsDetail.agreementNo === undefined || vm.SelectedTollsDetail.agreementNo === '')) {
                    vm.agreementNo = vm.SelectedTollsDetail.agreementNo;
                    vm.isSentByDashboard = true;
                }
            }
            initialize();
        }
    ]);
