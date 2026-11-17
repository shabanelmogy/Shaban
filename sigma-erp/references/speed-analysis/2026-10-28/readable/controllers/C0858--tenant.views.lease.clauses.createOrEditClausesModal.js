// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235827-235882
appModule.controller('tenant.views.lease.clauses.createOrEditClausesModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.leaseClause', 'clauseTypeId',
        function ($scope, $uibModalInstance, leaseClauseService, clauseTypeId) {

            var vm = this;
            vm.saving = false;
            vm.location = null;
            vm.rowToUpdateIsDefault = {};
            vm.addRow = function () {
                vm.clauseType.clauses.push(
                    {
                        detail: '',
                        clauseTypeId: clauseTypeId,
                        isDefault: false,
                    });
            };

            vm.removeRow = function (row) {
                var index = vm.clauseType.clauses.indexOf(row);
                vm.clauseType.clauses.splice(index, 1);
            };

            vm.save = function () {
                
                vm.saving = true;
                leaseClauseService.createOrUpdateClauses(vm.clauseType).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.UpdatePrimary = function (row) {
                
                _.each(vm.clauseType.clauses, function (x) {
                    x.isDefault = (x.detail === row.detail);
                });
            };

            function init() {
                leaseClauseService.getClausesForEdit({
                    id: clauseTypeId
                }).success(function (result) {
                    
                    vm.clauseType = result;
                    vm.clauseType.clauses = !vm.clauseType.clauses ? [] : vm.clauseType.clauses;
                });
            }
            init();
        }
    ]);
