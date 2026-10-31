// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:29381-29567
appModule.controller('common.views.appWarmup.index', [
        '$scope', 'abp.services.app.warmup',
        function ($scope, warmupService) {
            var vm = this;

            vm.warming = false;

            vm.customersStauts;
            vm.companiesStauts;
            vm.suppliersAndStaffStauts;
            vm.vehiclesAndTariffStauts;
            vm.rentalBookingStauts;
            vm.rentalAgreementStauts;
            vm.vehiclesAndTariffStauts;
            vm.leaseStauts;
            vm.movementsStauts;
            vm.receiptVouchersStauts;
            vm.paymentVouchersStauts;

            vm.warmup = function () {

                resetStatuses();
                vm.warming = true;

                warmupService.customers()
                    .success(function (result) {
                        if (result) {
                            vm.customersStauts = result.success;
                        } else {
                            vm.customersStauts = false;
                        }
                    }).error(function () {
                        vm.customersStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.companies()
                    .success(function (result) {
                        if (result) {
                            vm.companiesStauts = result.success;
                        } else {
                            vm.companiesStauts = false;
                        }
                    }).error(function () {
                        vm.companiesStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.suppliersAndStaff()
                    .success(function (result) {
                        if (result) {
                            vm.suppliersAndStaffStauts = result.success;
                        } else {
                            vm.suppliersAndStaffStauts = false;
                        }
                    }).error(function () {
                        vm.suppliersAndStaffStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.vehiclesAndTariff()
                    .success(function (result) {
                        if (result) {
                            vm.vehiclesAndTariffStauts = result.success;
                        } else {
                            vm.vehiclesAndTariffStauts = false;
                        }
                    }).error(function () {
                        vm.vehiclesAndTariffStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.rentalBooking()
                    .success(function (result) {
                        if (result) {
                            vm.rentalBookingStauts = result.success;
                        } else {
                            vm.rentalBookingStauts = false;
                        }
                    }).error(function () {
                        vm.rentalBookingStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.rentalAgreement()
                    .success(function (result) {
                        if (result) {
                            vm.rentalAgreementStauts = result.success;
                        } else {
                            vm.rentalAgreementStauts = false;
                        }
                    }).error(function () {
                        vm.rentalAgreementStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.lease()
                    .success(function (result) {
                        if (result) {
                            vm.leaseStauts = result.success;
                        } else {
                            vm.leaseStauts = false;
                        }
                    }).error(function () {
                        vm.leaseStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.movements()
                    .success(function (result) {
                        if (result) {
                            vm.movementsStauts = result.success;
                        } else {
                            vm.movementsStauts = false;
                        }
                    }).error(function () {
                        vm.movementsStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.receiptVouchers()
                    .success(function (result) {
                        if (result) {
                            vm.receiptVouchersStauts = result.success;
                        } else {
                            vm.receiptVouchersStauts = false;
                        }
                    }).error(function () {
                        vm.receiptVouchersStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

                warmupService.paymentVouchers()
                    .success(function (result) {
                        if (result) {
                            vm.paymentVouchersStauts = result.success;
                        } else {
                            vm.paymentVouchersStauts = false;
                        }
                    }).error(function () {
                        vm.paymentVouchersStauts = false;
                    }).finally(function () {
                        IsWramupComplete();
                    });

            };

            function IsWramupComplete() {
                if (vm.customersStauts !== null
                    && vm.companiesStauts !== null
                    && vm.suppliersAndStaffStauts !== null
                    && vm.vehiclesAndTariffStauts !== null
                    && vm.rentalBookingStauts !== null
                    && vm.rentalAgreementStauts !== null
                    && vm.vehiclesAndTariffStauts !== null
                    && vm.leaseStauts !== null
                    && vm.movementsStauts !== null
                    && vm.receiptVouchersStauts !== null
                    && vm.paymentVouchersStauts !== null) {
                    vm.warming = false;
                }
            }

            function resetStatuses() {
                vm.customersStauts = null;
                vm.companiesStauts = null;
                vm.suppliersAndStaffStauts = null;
                vm.vehiclesAndTariffStauts = null;
                vm.rentalBookingStauts = null;
                vm.rentalAgreementStauts = null;
                vm.vehiclesAndTariffStauts = null;
                vm.leaseStauts = null;
                vm.movementsStauts = null;
                vm.receiptVouchersStauts = null;
                vm.paymentVouchersStauts = null;
            }
        }
    ]);
