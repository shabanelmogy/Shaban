// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292362-292509
appModule.controller('tenant.views.sagX3Integration.batchPosting.index', [
        '$scope', 'abp.services.app.sagX3BatchPosting', 'utilities',
        function ($scope, sagX3BatchPostingService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                type: ''
            }
            vm.configuration = {
                sagX3Mappings: []
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getRounding = function (val) {
                if (val) {
                    return utilities.round(val, 2);
                }
            }

            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("TollInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 24) return app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) return app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) return app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) return app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 46) return app.localize("EquipmentInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else return "";
            };

            vm.allBoxTicked = function () {
                if (vm.vouchers == null) return;

                angular.forEach(vm.vouchers, function (row) {
                        row.post = vm.all;
                });
                if (vm.all == true) {
                    vm.savingDisable = false;
                }
                else {
                    vm.savingDisable = true;
                }
            };

            vm.savingDisable = true;
            vm.boxTicked = function () {
                angular.forEach(vm.vouchers, function (row) {
                    if (row.post == true) {
                        vm.savingDisable = false;
                    }
                });
            }

            var pageSize = 10;
            vm.processedSize = 0;
            vm.totalVoucherToPost = 0;
            vm.postToSagX3 = function () {
                vm.saving = true;
                vm.loading = true;
                var voucherToPost = [];
                angular.forEach(vm.vouchers, function (row) {
                    if (row.post == true) {
                        voucherToPost.push(row);
                    }
                });
                vm.totalVoucherToPost = voucherToPost.length;
                var pagedVouchers = [];
                if (vm.processedSize < voucherToPost.length) {
                    for (var i = vm.processedSize; i < (pageSize + (vm.processedSize <= 0 ? 0 : vm.processedSize - 1)); i++) {
                        pagedVouchers.push(voucherToPost[i]);
                    }
                }
                else {
                    vm.processedSize = 0;
                    return;
                }

                var proceedVouchers = [];
                angular.forEach(pagedVouchers, function (row) {
                    if (!row.isShared) {
                        proceedVouchers.push(row);
                    }
                });

                sagX3BatchPostingService.postVoucherToSagX3(proceedVouchers).success(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (vm.vouchers.find(x => x.id === result[i].id)) {
                            var obj = vm.vouchers.find(x => x.id === result[i].id);
                            obj.status = result[i].status;
                            obj.isShared = result[i].isShared;
                            obj.isError = result[i].isError;
                            if (!obj.isError) {
                                obj.notes2 = "";
                            }
                        }
                    }
                }).finally(function () {
                    vm.processedSize = vm.processedSize + pagedVouchers.length;
                    if (vm.processedSize >= voucherToPost.length) {
                        vm.saving = false;
                        vm.loading = false;
                        vm.processedSize = 0;
                    }
                    else {
                        vm.postToSagX3();
                    }
                });
            }

            vm.init = function(){
                vm.loading = true;
                sagX3BatchPostingService.getVouchersForX3BatchPosting(vm.filters).success(function (result) {
                    vm.vouchers = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.init();
        }
    ]);
