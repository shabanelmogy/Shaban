// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:120945-121109
appModule.controller('tenant.views.crs.accounting.accruals.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.accrual', 'abp.services.app.commonLookup', 'appSession', 'utilities',
    function ($scope, $uibModal, uiGridConstants, accrualService, commonLookupService, appSession, utilities) {

        var vm = this;
        vm.amortization = {};
        vm.amortizationData = [];
        vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
        vm.disableSaveButton = true;

        vm.skipCount = 0;
        var batchSize = 50;
        vm.filters = {
            monthYear: moment(),
            maxResultCount: batchSize
        };

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();

        });
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.getlocalDate = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

        vm.roundingforView = function (value) {
            var roundedValue = utilities.roundforView(value, 2);
            return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };


        function getLocations() {
            commonLookupService.getLocations({}).success(function (data) {
                vm.locations = data.items;
                vm.amortization.locationId = appSession.user.locationId;
            });
        };
        vm.calculationDetail = function (row) {
            abp.message.info(row.calculationDetail, 'Calculation Detail');
        };

        vm.save = function () {
            vm.saving = true;
            vm.amortization.Date =
            vm.accural = {
                accrualMonth: moment(vm.filters.monthYear).endOf('month').startOf('day').utc(),
                detail: vm.data
            }
            accrualService.createOrUpdateAccrual(vm.accural).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));

            }).finally(function () {
                vm.saving = false;
            });
        };

        //vm.getAccruals = function () {
        //    vm.loading = true;
        //    vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').utc();
        //    vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
        //    accrualService.getAccrualsToPass(vm.filters).success(
        //        function (data) {
        //            vm.disableSaveButton = false;
        //            vm.data = data.items;
        //        }).finally(function () {
        //            vm.loading = false;

        //        });
        //};

        vm.getAccruals = function () {
            vm.loading = true;

            if (vm.skipCount == 0)
                vm.data = [];

            vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').utc();
            vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
            vm.filters.skipCount = vm.skipCount;

            accrualService.getAccrualsToPassBatchWise(vm.filters).success(
                function (data) {
                    vm.disableSaveButton = false;
                    vm.totalDataCount = data.totalCount;

                    data.accrualsList.forEach(function (value) {
                        vm.data.push(value);
                    });

                    //vm.data = data.items;

                    vm.skipCount = vm.skipCount + batchSize;
                    if (vm.skipCount < vm.totalDataCount)
                        vm.getAccruals();
                    else {
                        vm.loading = false;
                        vm.disableSaveButton = false;
                        vm.skipCount = 0;
                    }
                }).finally(function () {
                   // vm.loading = false;

                });
        };


        vm.exportToExcel = function () {
            var tab_text = "<table border='1px'><tr>";
            var textRange;
            var j = 0;
            var tab1 = document.getElementById('accrualTable'); // id of table
            for (j = 0; j < tab1.rows.length; j++) {

                tab_text = tab_text;
                tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";

            var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            var blobUrl = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'accruals.xls';
            a.click();

        };
        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        function init() {
            getLocations();
        }

        init();
    }]);
