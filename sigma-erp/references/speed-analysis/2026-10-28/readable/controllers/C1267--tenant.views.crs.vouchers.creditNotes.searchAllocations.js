// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:333808-333910
appModule.controller('tenant.views.crs.vouchers.creditNotes.searchAllocations', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.creditNote', 'utilities', 'abp.services.app.allocation', 'abp.services.app.commonLookup', 'appSession',
    function ($uibModal, $uibModalInstance, creditNoteId,agreement, directoryService, creditNoteService, utilities, allocationService, commonLookupService, appSession) {
        var vm = this;
        vm.loading = false;
        
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

        vm.filters = {
            enableDateRange: true
        }
        vm.invoiceTypes = [];

        vm.localize = function (input) {
            return app.localize(input);
        };

        vm.rounding = function (value) {
            return utilities.round(value, 2);
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            } else {
                return "";
            }
        };

        vm.dateRangeModelChange = function () {
            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function getInvoiceTypes() {
            if (vm.isRentalEnabled)
                vm.invoiceTypes.push({ name: app.localize("RentalInvoice"), id: 1 });
            if (vm.isSalikModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("SalikInvoice"), id: 8 });
            if (vm.isDarbModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("DarbTollInvoice"), id: 63 });
            if (vm.isERSRentalInvoiceEnabled)
                vm.invoiceTypes.push({ name: app.localize("EquipmentInvoice"), id: 46 });
            if (vm.isFineModeEnabled)
                vm.invoiceTypes.push({ name: app.localize("FineInvoice"), id: 7 });
            if (vm.isLimoEnabled)
                vm.invoiceTypes.push({ name: app.localize("LimousineInvoice"), id: 2 });
            if (vm.isLeaseEnabled) {
                vm.invoiceTypes.push({ name: app.localize("LeaseInvoice"), id: 14 });
                if (vm.stockSaleInvoice)
                    vm.invoiceTypes.push({ name: app.localize("StockSaleInvoice"), id: 67 });
                if (vm.agreementAdditionalCharges || vm.agreementAdditionalChargesAfterClosing)
                    vm.invoiceTypes.push({ name: app.localize("AdditionalChargesInvoice"), id: 24 });
            }
            //if (vm.isERSLeaseEnabled)
            //    vm.invoiceTypes.push({ name: app.localize("EquipmentLeaseInvoice"), id: 47 });
            if (vm.isTransportationEnabled)
                vm.invoiceTypes.push({ name: app.localize("TransportationInvoice"), id: 16 });
            if (vm.isAssetsModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("AssetSaleInvoice"), id: 17 });

            if (vm.isRentalEnabled || vm.isLeaseEnabled)
                vm.invoiceTypes.push({ name: app.localize("FuelInvoice"), id: 29 });
            if (vm.isChauffeurEnabled)
                vm.invoiceTypes.push({ name: app.localize("ChauffeurInvoice"), id: 34 });
            if (vm.isWorkshopEnabled)
                vm.invoiceTypes.push({ name: app.localize("WorkshopInvoice"), id: 37 });
            if (vm.isAccessoriesEnabled)
                vm.invoiceTypes.push({ name: app.localize("AccessoriesInvoice"), id: 55 });
            if (vm.isAccidentModuleEnabled)
                vm.invoiceTypes.push({ name: app.localize("ExcessChargesInvoice"), id: 57 });
            if (vm.isExcessKMsInvoiceEnabled)
                vm.invoiceTypes.push({ name: app.localize("ExcessKMsInvoice"), id: 60 });
            if (vm.isAccountsEnabled && vm.isTaxEnabled)
                vm.invoiceTypes.push({ name: app.localize("AdvanceTaxInvoice"), id: 65 });

            vm.invoiceTypes.push({ name: app.localize("MiscellaneousInvoice"), id: 9 });
            vm.invoiceTypes.push({ name: app.localize("RecoveryInvoice"), id: 74 });
            vm.invoiceTypes.push({ name: app.localize("ChaufferInvoice"), id: 75 });
            vm.invoiceTypes.push({ name: app.localize("DamageInvoice"), id: 30 });
            vm.invoiceTypes.push({ name: app.localize("FleetAssignmentInvoice"), id: 33 });
        };

        vm.search = () => {
            $uibModalInstance.close(vm.filters);
        }

        function init() {
            getInvoiceTypes();
        }
        init();
    }
    ]);
