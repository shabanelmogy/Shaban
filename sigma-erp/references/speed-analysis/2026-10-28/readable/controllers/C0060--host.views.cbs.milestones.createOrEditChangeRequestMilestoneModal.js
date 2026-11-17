// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:36129-36196
appModule.controller('host.views.cbs.milestones.createOrEditChangeRequestMilestoneModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.milestone', 'row', 'totalCost','listMilestone',
        function ($scope, $uibModalInstance, milestoneService, row, totalCost, listMilestone) {

            var vm = this;
            vm.listMilestones = angular.copy(listMilestone);
            vm.milestone = {
                amount: 0,
                milestoneStatus: 1,
                milestonePaymentStatus: 1,
                invoiceStatus: 1,
                tempId:0,
                id:0
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            if (row) {
                var index = vm.listMilestones.indexOf(row);
                vm.listMilestones.splice(index, 1);
                vm.milestone = angular.copy(row);
                vm.milestone.expectedEndDate = vm.getlocalDateTime(vm.milestone.expectedEndDate);
            }

            

            vm.setMilestoneAmount = function () {
                vm.sumMilestoneAmount = 0;
                
                vm.sumMilestonePercentage = 0;
                vm.listMilestones.forEach(m => {
                    vm.sumMilestoneAmount += parseFloat(m.amount);
                    vm.sumMilestonePercentage += m.percentage;
                });
                vm.sumMilestonePercentage += vm.milestone.percentage;
                if (vm.sumMilestonePercentage == 100) {
                    vm.milestone.amount = (totalCost - vm.sumMilestoneAmount).toFixed(2);
                }
                else {

                    vm.milestone.amount = (totalCost * vm.milestone.percentage / 100).toFixed(0);
                }
            };

            
            vm.save = function () {

                $uibModalInstance.close(vm.milestone);
                
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            

            
        }
    ]);
