// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:481370-481429
appModule.controller('tenant.views.tms.parking.parkingInvoicePrint', [
    '$scope', '$uibModal', '$stateParams', 'abp.services.app.parkingTicket', 'appSession',
    function ($scope, $uibModal, $stateParams, parkingTicketService, appSession) {
        var vm = this;
        vm.showLegendRacLogo = false;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });

        if ($scope.$parent !== null) {
            if ($scope.$parent.vmMain !== null)
                vm.filters = $scope.$parent.vmMain.filters;
        }
        if (appSession.tenant.tenancyName.toLowerCase() == "legendrac") {
            vm.showLegendRacLogo = true;
        }
        if (vm.filters === null)
            vm.filters = $stateParams.filters;

        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

        vm.getlocalDateTime = function (date) {
            if (date !== null) {
                return moment(date).utc().format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

        vm.toDateTimeString = function (dt, format) {
            //debugger;
            format = format ? format : vm.dateTimeFormat;
            return moment.utc(dt).format(format);
        }

        vm.isParkonicPrintEnabled = abp.features.isEnabled("PTMS.EnableParkonicPrint"); // abp.session.tenantId == 4140;

        vm.loading = true;
        parkingTicketService.getInvoicePrint({ id: vm.filters.rowId }).success(function (data) {

            vm.parkingPrintModal = data;
            vm.parkingPrintModal.totalDiscount = 0;
            vm.parkingPrintModal.totalTaxableAmount = 0;
            vm.parkingPrintModal.totalVatAmount = 0;
            vm.parkingPrintModal.grandTotal = 0;

            vm.parkingPrintModal.ticketList.forEach(x => {
                vm.parkingPrintModal.totalDiscount += x.discount;
                vm.parkingPrintModal.totalTaxableAmount += x.taxableAmount;
                vm.parkingPrintModal.totalVatAmount += x.vatAmount;
                vm.parkingPrintModal.grandTotal += x.totalAmount;
            });
        }).finally(function () {
            vm.loading = false;
        });
    }
]);
