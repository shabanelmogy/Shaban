// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:473277-473365
appModule.controller('tenant.views.tfms.fineReceipts.report', [
        '$scope', '$stateParams', 'abp.services.app.fineReceipts',
        function ($scope, $stateParams, fineReceiptsService) {

            var vm = this;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;      
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableFMS = abp.features.isEnabled("TFMS");
            vm.isEnableCRS = abp.features.isEnabled("CRS");

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.customers = [];
            vm.selectedVehicle = null;
            vm.vehicleNo = [];
            vm.trafficFileId = [];
            vm.server = [];
            vm.plateNos = null;
            vm.totalAmount = 0;
            vm.totalAcknowledgmentAmount = 0;
            vm.totalFinesAmount = 0;
            vm.totalReceiptAmount = 0;

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.authorityTypes = [
                { type: app.localize("Dubai RTA"), id: 1 },
                { type: app.localize("TAMM"), id: 2 },
                { type: app.localize("Abu Dhabi Police"), id: 3 }
            ];
            vm.downloadAuthority = function (id) {
                var t = vm.authorityTypes.find(x => x.id)
                return t.type;
            };
            vm.isIgnored = function (data) {
                if (data === true)
                    return "Yes";
                else
                    return "No";
            };
            
            function init() {
                vm.loading = true;
                fineReceiptsService.getFineReceipts(vm.filters).success(function (data) {
                    vm.finesReceipts = data.fineReceiptsList;
                    vm.finesReceipts.totalItems = data.totalCount;
                    angular.forEach(vm.finesReceipts, function (value) {
                        vm.totalAcknowledgmentAmount += value.acknowledgmentAmount;
                        vm.totalFinesAmount += value.finesAmount;
                        vm.totalReceiptAmount += value.receiptAmount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }]);
