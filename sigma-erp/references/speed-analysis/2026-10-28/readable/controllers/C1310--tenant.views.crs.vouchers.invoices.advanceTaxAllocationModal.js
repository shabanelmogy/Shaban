// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342433-342569
appModule.controller('tenant.views.crs.vouchers.invoices.advanceTaxAllocationModal', ['$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.allocation', 'invoice', 'utilities',
        function ($uibModalInstance, invoiceService, allocationService, invoice, utilities) {

            var vm = this;
            vm.loading = false;
            vm.advanceTaxInvoice = invoice;
            vm.deleteATIReversal = utilities.parseBoolean(abp.setting.get("App.General.DeleteATIReversal"));
            vm.alreadyAllocated = 0;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.rounding = function (value) {

                return utilities.round(value, 2);
            };
            vm.customRound = function (amount, allocated) {
                var rAmount = amount - allocated;
                return utilities.round(rAmount, 2);
            };
            vm.localize = function (value) {

                return app.localize(value);
            };


            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("SalikInvoice");
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
                else if (voucherSubTypeId == 57) return app.localize("ExcessChargesInvoice");
                else if (voucherSubTypeId == 60) return app.localize("ExcessKMsInvoice");
                else if (voucherSubTypeId == 63) return app.localize('DarbTollInvoice');
                else if (voucherSubTypeId == 65) return app.localize('AdvanceTaxInvoice');
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else return "";
            };

            vm.sumAmount = function () {
                if (vm.invoicesToAllocate == null)
                    return 0;

                if (vm.invoicesToAllocate.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.invoicesToAllocate, function (value, key) {

                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                vm.totalAllocated = utilities.round(amount, 2);
            };

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                var invoicesToBeAllocated = vm.invoicesToAllocate.filter(e => e.allocatedNow > 0);
                invoiceService.allocateInvoicesToAdvanceTaxInvoice({ advanceTaxInvoiceId: vm.advanceTaxInvoice.id, allocations: invoicesToBeAllocated, allocatingVoucherAmount: vm.totalAllocated })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                        vm.loading = false;
                    });
            };


            vm.deleteReversal = function (row) {
                abp.message.confirm(
                    "Are you sure you want to delete this allocation?",
                    "Confirm Delete",
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceService.deleteAdvanceTaxInvoiceAllocation({
                                advanceTaxInvoiceId: invoice.id,
                                reversalVoucherId: row.id
                            }).then(function () {
                                abp.notify.success("Allocation deleted successfully.");

                                loadAlreadyAllocatedInvoices();
                                loadAllocations();
                            });
                        }
                    }
                );
            };

            function loadAlreadyAllocatedInvoices() {
                vm.loading = true;
                vm.invoicesToAllocate = undefined;
                invoiceService.getAlreadyAllocatedDetails({ id: vm.advanceTaxInvoice.id }).success(function (result) {
                    vm.alreadyAllocated = result.alreadyAllocatedAmount;
                    vm.alreadyAllocatedDetails = result.detail;

                    if (vm.alreadyAllocated < vm.advanceTaxInvoice.amount)
                        loadAllocations();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function loadAllocations() {
                vm.loading = true;
                allocationService.getAllocationsForEdit({ contactId: vm.advanceTaxInvoice.contact.id, voucherCategory: 2 }).success(function (result) {
                    vm.invoicesToAllocate = result.allocations;



                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                loadAlreadyAllocatedInvoices();
            }

            init();
        }
    ]);
