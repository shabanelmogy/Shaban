// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:449026-449062
appModule.controller('tenant.views.mcc.movements.movementLogsModal', ['movementId', 'abp.services.app.movement', '$uibModalInstance',
        function (movementId, movementService, $uibModalInstance,) {

            var vm = this;
            vm.loading = false;
            vm.movementNo = movementId;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            }

            function init() {
                vm.loading = true;
                movementService.getMovementLogs({
                    id: movementId
                }).success(function (result) {
                    vm.movementLogs = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
