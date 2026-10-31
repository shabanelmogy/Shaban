// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66461-66668
appModule.controller('host.views.crm.productVariants.productVariantSettingModal', [
        '$scope', '$filter', '$uibModalInstance', 'abp.services.app.productVariant', 'productVariant',
        function ($scope, $filter, $uibModalInstance, productVariantService, productVariant) {
            var vm = this;

            vm.saving = false;
            vm.variant = productVariant;
            vm.variant.checkCardTypes = [];

            vm.checkCardTypes = [
                { id: 1, name: "Agreement"},
                { id: 2, name: "NRM"},
                { id: 3, name: "Repair & Maintenance"},
                { id: 4, name: "Estimation/Job"},
                { id: 5, name: "Customer Vehicle"},
                { id: 6, name: "Replacement Vehicle"},
                { id: 7, name: "Workshop"},
                { id: 8, name: "Inspection"}
            ];

            vm.movementTypes = [
                { id: 1, name: "Agreement" },
                { id: 2, name: "NRM" },
                { id: 3, name: "Garage" },
                { id: 4, name: "Delivery" },
                { id: 5, name: "Collection" },
                { id: 6, name: "Total Loss" },
                { id: 7, name: "Due for Sale" },
                { id: 8, name: "Status Change" },
                { id: 9, name: "Mileage Update" },
                { id: 10, name: "Garage Job" }
            ];

            vm.steps = [
                {id: 1, name: 'One Step'},
                {id: 2, name: 'Two Step'}
            ]

            vm.stepCheckTypes = [
                { id: 1, name: 'Check-out' },
                { id: 2, name: 'Check-in' }
            ]

            vm.additionalFieldsList = [
                { id: 1, name: "Vehicle" },
                { id: 2, name: "Customer" },
                { id: 3, name: "Driver" },
                { id: 4, name: "Workshop" },
                { id: 5, name: "AgreementNo" },
                { id: 6, name: "Branch" },
                { id: 7, name: "Notes" },
                { id: 8, name: "Custom Field 1" },
                { id: 9, name: "Custom Field 2" },
                { id: 10, name: "Custom Field 3" },
                { id: 11, name: "Documents" }
            ];

            vm.ducumentsList = [
                { id: 1, name: "Passport" },
                { id: 2, name: "National ID" },
                { id: 3, name: "Driving License" }
            ];

            vm.getCheckCardTypeName = function (type) {
                if (type == 1)
                    return "Agreement";
                if (type == 2)
                    return "NRM";
                if (type == 3)
                    return "Repair & Maintenance";
                if (type == 4)
                    return "Estimation/Job";
                if (type == 5)
                    return "Customer Vehicle";
                if (type == 6)
                    return "Replacement Vehicle";
                if (type == 7)
                    return "Workshop";
                if (type == 8)
                    return "Inspection";
            }

            vm.sortOfCCTypeSettingsChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var row = obj.row;


                if (updatedIndex === 0) {

                    row.order = (vm.variant.checkCardTypes[0].order) / 2;
                    var element = row;
                    vm.variant.checkCardTypes.splice(obj.rowIndex, 1);
                    vm.variant.checkCardTypes.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (vm.variant.checkCardTypes.length - 1)) {
                    row.order = (vm.variant.checkCardTypes[updatedIndex].order + vm.variant.checkCardTypes[updatedIndex].order + 1) / 2;
                    element = row;
                    vm.variant.checkCardTypes.splice(obj.rowIndex, 1);
                    vm.variant.checkCardTypes.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.rowIndex)
                        row.order = (vm.variant.checkCardTypes[updatedIndex + 1].order + vm.variant.checkCardTypes[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.rowIndex)
                        row.order = (vm.variant.checkCardTypes[updatedIndex - 1].order + vm.variant.checkCardTypes[updatedIndex].order) / 2;
                    element = row;
                    vm.variant.checkCardTypes.splice(obj.rowIndex, 1);
                    vm.variant.checkCardTypes.splice(updatedIndex, 0, element);
                }
                vm.loading = false;
                $scope.$apply();
            };

            vm.sortOfSettingsChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('fieldData-id'));
                var updatedIndex = ui.item.index();
                var row = obj.row;
                var ccType = vm.variant.checkCardTypes[obj.ccTypeIndex];

                if (updatedIndex === 0) {

                    row.order = (ccType.fields[0].order) / 2;
                    var element = row;
                    ccType.fields.splice(obj.rowIndex, 1);
                    ccType.fields.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (ccType.fields.length - 1)) {
                    row.order = (ccType.fields[updatedIndex].order + ccType.fields[updatedIndex].order + 1) / 2;
                    element = row;
                    ccType.fields.splice(obj.rowIndex, 1);
                    ccType.fields.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.rowIndex)
                        row.order = (ccType.fields[updatedIndex + 1].order + ccType.fields[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.rowIndex)
                        row.order = (ccType.fields[updatedIndex - 1].order + ccType.fields[updatedIndex].order) / 2;
                    element = row;
                    ccType.fields.splice(obj.rowIndex, 1);
                    ccType.fields.splice(updatedIndex, 0, element);
                }
                vm.loading = false;
                $scope.$apply();
            };

            vm.addCheckCardType = function () {
                var order = vm.variant.checkCardTypes.length < 1 ? 1 :
                    vm.variant.checkCardTypes[vm.variant.checkCardTypes.length - 1].order + 1;
                var ccType = {
                    type: null, name: null, productVariantId: productVariant.id, order: order, stepType: null, step1CheckType: null, step1CheckTypeLabel: null, step2CheckType: null, step2CheckTypeLabel: null,
                    fields: []
                };
                vm.variant.checkCardTypes.push(ccType);
            }

            vm.removeRow = function (obj) {
                var index = vm.variant.checkCardTypes.indexOf(obj);
                vm.variant.checkCardTypes.splice(index, 1);
            };

            vm.addAdditionalField = function (row) {
                var order = row.fields.length < 1 ? 1 :
                    row.fields[row.fields.length - 1].order + 1;
                row.fields.push({ order: order});
            }

            vm.removeAdditionalFieldRow = function (obj, row) {
                var index = row.fields.indexOf(obj);
                row.fields.splice(index, 1);
            }

            vm.save = function () {
                vm.saving = true;
                productVariantService.saveVariantSetting({ checkCardTypes: vm.variant.checkCardTypes, productVariantId: productVariant.id }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function() {
                    vm.saving = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                productVariantService.getProductVariantForEdit({ id: productVariant.id }).success(function (result) {
                    vm.variant = result;
                    if (!vm.variant.checkCardTypes)
                        vm.variant.checkCardTypes = [];

                    vm.variant.checkCardTypes = $filter('orderBy')(vm.variant.checkCardTypes, 'order');
                    for (var i = 0; i < vm.variant.checkCardTypes.length; i++) {
                        vm.variant.checkCardTypes[i].fields = $filter('orderBy')(vm.variant.checkCardTypes[i].fields, 'order');
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
