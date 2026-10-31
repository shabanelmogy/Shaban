// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:178428-178537
appModule.controller('tenant.views.crs.collectionMovements.addOrUpdateDriverModal', [
        '$uibModal', '$uibModalInstance', 'utilities', 'movementId', 'abp.services.app.collectionMovement', 'abp.services.app.directory',
        function ($uibModal, $uibModalInstance, utilities, movementId, collectionMovementService, directoryService) {

            var vm = this;
            vm.loading = false;
            vm.movementOut = null;
            vm.locations = [];

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
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
            vm.getMovemntType = function (type) {
                if (type == 11)
                    return app.localize("AgreementCollection");
                if (type == 11)
                    return app.localize("ReplacementCollection");
            };
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.searchDriverPopoup = function () {
                //var modalInstance = openSearchContactModel(1, null);

                var modalInstance = openSearchContactModel(1, 1);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.collectionMovement.contact = result;
                        vm.collectionMovement.contactId = result.id;
                    }
                });
            };

            function openSearchContactModel(category, type, isOnlyCorporate = false) {


                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: null,
                                activeOnly: true
                            }
                        }
                    }
                });
            }

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchDriverForCollectionMovement({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.save = function () {
                vm.saving = true;

                collectionMovementService.updateDriverToMovement(vm.collectionMovement
                ).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {

                vm.loading = true;
                allFuelLevels();
                collectionMovementService.getCollectionMovement({ id: movementId }
                ).success(function (result) {
                    vm.collectionMovement = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }

    ]);
