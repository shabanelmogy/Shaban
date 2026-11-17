// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:305848-305919
appModule.controller('tenant.views.crs.vehicleAttachments.viewModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleAttachment', 'attachmentId', 'abp.services.app.vehicleModel', '$q', 'abp.services.app.commonLookup', 'appSession', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, attachmentService, attachmentId, vehicleModelService, $q, lookupService, appSession, utilities, ) {

            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');

            vm.vehicleLocation = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.Location'));

            vm.isEditMod = false;
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.editMode = true;
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }


            vm.createMake = function () {
                openCreateOrEditMakeModal(null);
            };

           
            vm.locationPermission = function (row) {

                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId) {
                    vm.disable = false;
                    return false;
                }

                return true;
            };
            

            function init() {
                vm.loading = true;
                getLocations();
                attachmentService.getVehicleAttachmentForEdit({
                    id: attachmentId

                }).success(function (result) {
                    vm.loading = false;
                    if (attachmentId > 0) {
                        vm.editMode = false;
                    }
                    vm.vehicleAttachment = result;

                    if (vm.vehicleAttachment.id > 0)
                        vm.isEditMod = true;
                    else
                        vm.isEditMod = false;
                });
            }

            init();
        }
    ]);
