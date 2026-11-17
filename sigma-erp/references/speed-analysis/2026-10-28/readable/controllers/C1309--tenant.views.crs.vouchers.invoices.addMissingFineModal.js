// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342284-342430
appModule.controller('tenant.views.crs.vouchers.invoices.addMissingFineModal',
        ['$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'abp.services.app.trafficFine', 'abp.services.app.customer', 'abp.services.app.directory', 'utilities',
            function ($uibModal, $uibModalInstance, vehicleService,
                trafficFineAppService, customerService, directoryService, utilities) {
                var vm = this;
                vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
                vm.isShowCustomerInMissingFines = abp.features.isEnabled('CRS.CustomFeatures.ShowCustomerInMissingFines');

                vm.clearCustomer = function () {
                    vm.trafficFine.contact = null;
                    vm.trafficFine.contactId = null;
                };
                vm.searchVehicles = function ($select) {
                    if ($select.search == "") { vm.vehicles = null; return null; }
                    return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                        vm.vehicles = response.data.items;
                        vm.vehicles.forEach((v) => {
                            if (v.deFleetDate) {
                                v.label = `${v.plateNo} (Defleet)`;
                            } else {
                                v.label = v.plateNo;
                            }
                        });
                    });
                };

                vm.vehicleChanged = function () {
                    if (vm.trafficFine.vehicle) {
                        vm.loading = true;
                        trafficFineAppService.getMovementOnVehicle(vm.trafficFine).success(
                            function (result) {
                                vm.vehicleMovement = result;
                                if (vm.vehicleMovement) {
                                    vm.vehicleMovementType = getMovementType(vm.vehicleMovement.movementTypeId);
                                    if (vm.vehicleMovement.movementTypeId == 1) {
                                        vm.vehicleMovementLabel = vm.localize("AgreementNo");
                                        vm.vehicleMovementId = vm.vehicleMovement.refNo;
                                        vm.vehicleMovementContactLabel = vm.localize("Customer");
                                        vm.vehicleMovementContact = vm.vehicleMovement.contact.name;
                                    }
                                    else {
                                        vm.vehicleMovementLabel = vm.localize("MovementNo");
                                        vm.vehicleMovementId = vm.vehicleMovement.id;
                                        vm.vehicleMovementContactLabel = vm.localize("Staff");
                                        vm.vehicleMovementContact = vm.vehicleMovement.contact.name;
                                    }
                                }

                                if (vm.vehicleMovement) {
                                    customerService.getSurcharge(vm.vehicleMovement.contactId)
                                        .success((d) => {
                                            debugger;
                                            if (d?.fineSurchargeType === 1) {
                                                vm.surcharge = d.fineSurcharge;
                                            } else if (d?.fineSurchargeType === 2) {
                                                vm.surcharge = vm.trafficFine.amount / 100 * d.fineSurcharge;
                                            } else {
                                                vm.surcharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
                                            }
                                        })
                                        .finally(() => {
                                            vm.loading = false;
                                        });
                                }
                            }).finally(() => {
                                if (!vm.vehicleMovement) {
                                    vm.loading = false;
                                }
                            });
                    }
                };

                function getMovementType(movementTypeId) {
                    if (movementTypeId == 1)
                        return vm.localize("Agreement");
                    if (movementTypeId == 2)
                        return vm.localize("StaffMove");
                    if (movementTypeId == 3)
                        return vm.localize("Garage");
                    if (movementTypeId == 4)
                        return vm.localize("Delivery");
                    if (movementTypeId == 5)
                        return vm.localize("Collection");
                }

                vm.localize = function (input) {
                    if (input == null)
                        return "";
                    return app.localize(input);
                };
                vm.searchCustomers = function ($select) {

                    //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                    return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: vm.contactCategory, activeOnly: true }).then(function (response) {
                        vm.customers = response.data.items;
                    });
                };
                vm.searchCustomerPopoup = function () {
                    $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                        controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                        backdrop: 'static',
                        resolve: {
                            category: function () {
                                return null;
                            },
                            type: function () {
                                return 2;
                            }
                        }
                    }).result.then(function (contact) {
                        if (contact != null) {
                            vm.trafficFine.contact = contact;
                            vm.trafficFine.contactId = contact.id;
                        }
                    });
                };
                vm.save = function () {
                    debugger;
                    vm.saving = true;
                    vm.trafficFine.vehicleId = vm.trafficFine.vehicle.id;
                    vm.trafficFine.surcharge = vm.surcharge;
                    if (vm.vehicleMovement) {
                        vm.trafficFine.agreementId = vm.vehicleMovement.agreementId;
                        vm.trafficFine.movementId = vm.vehicleMovement.id;
                    }
                    //vm.trafficFine.fineDateTime = moment.utc(vm.trafficFine.fineDateTime, 'YYYY-MM-DD hh:mm').local().format('YYYY-MM-DD hh:mm A');
                    vm.trafficFine.isAddedManually = true;

                    trafficFineAppService.createOrUpdateTrafficFine({ trafficFine: vm.trafficFine }).success(function () {
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
                    
                }

                init();
            }]);
