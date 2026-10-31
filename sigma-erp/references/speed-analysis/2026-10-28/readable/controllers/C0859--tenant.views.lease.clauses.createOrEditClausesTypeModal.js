// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235885-235917
appModule.controller('tenant.views.lease.clauses.createOrEditClausesTypeModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.leaseClause', 'clauseTypeId',
        function ($scope, $uibModalInstance, leaseClauseService, clauseTypeId) {

            var vm = this;
            vm.saving = false;
            vm.location = null;

            vm.save = function () {
                vm.saving = true;
                leaseClauseService.createOrUpdateClauseType(vm.clauseType).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                leaseClauseService.getClauseTypeForEdit({
                    id: clauseTypeId
                }).success(function (result) {
                    vm.clauseType = result;
                });
            }

            init();
        }
    ]);
