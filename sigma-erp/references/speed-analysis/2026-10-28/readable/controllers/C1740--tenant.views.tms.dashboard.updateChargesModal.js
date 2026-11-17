// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477280-477349
appModule.controller('tenant.views.tms.dashboard.updateChargesModal', [
        '$scope', '$filter', '$uibModal', 'utilities', 'finesData', 'uiGridConstants', '$uibModalInstance', 'abp.services.app.uaeFine',
        function ($scope, $filter, $uibModal, utilities, finesData, uiGridConstants, $uibModalInstance, finesService) {

            var vm = this;
            vm.isEnableTFMS = abp.features.isEnabled("TFMS");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = {
                name: null,
            }
            vm.loading = false;
            vm.fine = finesData;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isEnableUpdateChargedAmount = abp.auth.hasPermission('Pages.TFMS.Update.Charged.Amount');
            vm.isEnableUpdateCollectedAmount = abp.auth.hasPermission('Pages.TFMS.Update.Collected.Amount');
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
                $uibModalInstance.dismiss(vm.fine);
            }
            vm.save = function () {
                vm.loading = true;
                if (vm.fine.agreementNo) {
                    vm.fine.refNo = vm.fine.agreementNo;
                }
                else {
                    vm.fine.refNo = vm.fine.movement ? vm.fine.movement.refNo : null ;
                }

                finesService.updateChargeAndCollection(vm.fine).success(function (data) {
                    if (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    } else {
                        abp.notify.error(app.localize('Error'));
                    }
                    //abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(vm.fine);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function initialize() {
                console.log(vm.fine);
            }
            initialize();
        }
    ]);
