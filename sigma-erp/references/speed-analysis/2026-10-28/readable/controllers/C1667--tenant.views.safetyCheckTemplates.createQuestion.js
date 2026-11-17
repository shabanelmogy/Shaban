// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:457528-457597
appModule.controller('tenant.views.safetyCheckTemplates.createQuestion', [
        '$scope', '$uibModalInstance', 'item',
        function ($scope, $uibModalInstance, item) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            debugger;

            vm.question = {
                "guid": Math.random().toString(36).substring(2) + Date.now().toString(36),
                "detail": "",
                "value": null,
                "type": null,
                "choices": [],
                "category": 2,
                "children": []
            }

            vm.choices = [];

            vm.addChoice = function () {
                vm.choices.push({ val: ""});
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
                //$scope.$apply();
            };

            vm.save = function () {
                vm.saving = true;
                for (var i = 0; i < vm.choices.length; i++) {
                    vm.question.choices.push(vm.choices[i].val);
                }
                vm.question.type = vm.question.type ? vm.question.type / 1 : null;
                item.children.push(vm.question);
                vm.saving = false;
                $uibModalInstance.dismiss();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
