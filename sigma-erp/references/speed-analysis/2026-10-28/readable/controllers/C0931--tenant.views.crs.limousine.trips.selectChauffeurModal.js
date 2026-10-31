// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253828-253899
appModule.controller('tenant.views.crs.limousine.trips.selectChauffeurModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.limoTrip', 'uiGridConstants',
            function ($scope, $uibModal, $uibModalInstance, limoTripService, uiGridConstants) {

                var vm = this;
                vm.showOtherBranchDrivers = false;
                vm.getChauffeurQueue = function (branchCheck) {
                    vm.loading = true;
                    return limoTripService.getChauffeurQueue({ showOtherBranchDrivers: branchCheck })
                        .then(function (response) {
                            vm.minimumTripCount = Math.min(...response.data.map(e => e.tripCount));
                            vm.chaufferQueue = response.data;
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };

                vm.changeBranchDriver = function () {
                    vm.getChauffeurQueue(vm.showOtherBranchDrivers);
                };

                vm.redButtonClicked = function (contactId) {
                    var selectedContact = vm.chaufferQueue.filter(e => e.id == contactId)[0];
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/limousine/trips/driverForcedSelectionReasonModal.cshtml',
                        controller: 'tenant.views.crs.limousine.trips.driverForcedSelectionReasonModal as vm',
                        backdrop: 'static',
                        resolve: {
                            category: function () {
                                return null;
                            },
                            type: function () {
                                return 2;
                            }
                        }
                    }).result.then(function (selectedReason) {
                        if (selectedReason != null) {
                            selectedContact.selectedReason = selectedReason;
                            $uibModalInstance.close(selectedContact);
                        }
                    });
                };

                vm.openViewTripModal = function (tripId) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/limousine/trips/viewTripModal.cshtml',
                        controller: 'tenant.views.crs.limousine.trips.viewTripModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            tripId: function () {
                                return tripId;
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.contactSelected = function (contactId) {
                    if (contactId != null) {
                        var selectedContact = vm.chaufferQueue.filter(e => e.id == contactId)[0];
                        $uibModalInstance.close(selectedContact);
                    }
                };
                vm.getChauffeurQueue();
            }]);
