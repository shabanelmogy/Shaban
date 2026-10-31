// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:462511-462594
appModule.controller('tenant.views.safetyCheckTemplates.editQuestionModal', [
        '$scope', '$uibModalInstance', 'item', 'isView',
        function ($scope, $uibModalInstance, item, isView) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.isView = isView;

            vm.question = {
                "guid": item.guid,
                "detail": item.detail,
                "value": item.value,
                "type": item.type + "",
                "choices": item.choices,
                "category": 2,
                "children": item.children
            };

            vm.choices = [];

            for (var i = 0; i < vm.question.choices.length; i++) {
                vm.choices.push({ val: vm.question.choices[i] });
            }

            vm.addChoice = function () {
                vm.choices.push({ val: "" });
            }

            vm.removeChoice = function (row) {
                var index = vm.choices.indexOf(row);
                vm.choices.splice(index, 1);
            }


            vm.sortOfChoicesChanged = function (event, ui) {
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();
                var choice = obj.choice;
                var choiceIndex = obj.choiceIndex;

                if (updatedIndex == 0) {
                    var element = choice;
                    vm.choices.splice(choiceIndex, 1);
                    vm.choices.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (vm.choices.length - 1)) {
                    var element = choice;
                    vm.choices.splice(choiceIndex, 1);
                    vm.choices.splice(updatedIndex, 0, element);
                }
                else {
                    var element = choice;
                    vm.choices.splice(choiceIndex, 1);
                    vm.choices.splice(updatedIndex, 0, element);
                }
                $scope.$apply();
            };

            vm.save = function () {
                vm.question.choices = [];
                vm.saving = true;
                if (vm.question.type == 2) {
                    for (var i = 0; i < vm.choices.length; i++) {
                        vm.question.choices.push(vm.choices[i].val);
                    }
                }
                item.guid = vm.question.guid;
                item.detail = vm.question.detail;
                item.value = vm.question.value;
                item.type = vm.question.type ? parseInt(vm.question.type): null;
                item.choices = vm.question.choices;
                item.children = vm.question.children;

                vm.saving = false;
                $uibModalInstance.dismiss();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
