// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314638-314733
appModule.controller('tenant.views.crs.vehicles.updateVehicleServiceModal', [
        '$uibModalInstance', 'utilities', 'options', 'abp.services.app.vehicleAlerts', 'abp.services.app.vehicleService',
        function ($uibModalInstance, utilities, options, vehicleAlertsService, vehicleService) {

            var vm = this;
            vm.saving = false;

            vm.dueService = options.dueService;
            vm.vehicle = options.vehicle;

            console.log(new Date())
            vm.data = {
                dateTime: new Date(),
                vehicleId: options.vehicle.id,
                fuelLevel: options.vehicle.fuelLevel,
                kMs: options.vehicle.kMs,
                serviceId: options.serviceId
            };

            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.CanChangeKMOut');
            vm.canChangeFuelOut = abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.CanChangeFuelOut');

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            }

            function getDueServices(getServiceAlert) {
                if (getServiceAlert == null) getServiceAlert = false;

                vm.loading = true;
                vehicleService.getVehicleServicesByModelOrDefault({ id: vm.vehicle.modelId }).success(function (servicesData) {
                    //vm.dueServices = servicesData.items;
                    if (getServiceAlert) {
                        vehicleAlertsService.getServiceAlerts({ vehicleId: vm.vehicle.id }).success(function (result) {
                            vm.serviceAlerts = result.items;
                            if (vm.serviceAlerts.length > 0 && servicesData.items.length > 0) {
                                //vm.workshopMovement.serviceLog.serviceId = vm.serviceAlerts[0].dueService.id;
                                //vm.workshopMovement.serviceLog.dueDate = vm.serviceAlerts[0].dueDate;
                                //vm.workshopMovement.serviceLog.dueKms = vm.serviceAlerts[0].dueKms;
                                //vm.workshopMovement.serviceLog.dueReason = vm.serviceAlerts[0].dueReason;

                                vm.dueService = vm.serviceAlerts[0].dueService;

                                fillDueServices(servicesData.items);
                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                    } else {

                        fillDueServices(servicesData.items);
                    }

                }).finally(function () {
                    if (!getServiceAlert)
                        vm.loading = false;
                });
            }

            function fillDueServices(servicesList) {
                if (vm.dueService != null) {
                    vm.dueServices = [];
                    angular.forEach(servicesList, function (service) {
                        if (service.dueOnKMs >= vm.dueService.dueOnKMs && service.dueOnMonths >= vm.dueService.dueOnMonths)
                            vm.dueServices.push(service);
                    });
                } else {
                    vm.dueServices = servicesList;
                }
            }
            
            vm.save = function () {
                vm.saving = true;

                vehicleAlertsService.updateVehicleService(vm.data)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                allFuelLevels();
                getDueServices(true);
            }

            init();
        }
    ]);
