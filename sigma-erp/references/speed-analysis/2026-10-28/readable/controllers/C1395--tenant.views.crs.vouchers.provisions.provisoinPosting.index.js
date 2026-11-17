// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379799-379971
appModule.controller('tenant.views.crs.vouchers.provisions.provisoinPosting.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.provision', 'abp.services.app.commonLookup', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, provisionService, commonLookupService, appSession, utilities) {

            var vm = this;
            vm.amortization = {};
            vm.monthlyPostingData = [];
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.disableSaveButton = true;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = {
                monthYear: new Date(),
                // maxResultCount: batchSize
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });

            vm.calculationDetail = function (row) {
                abp.message.info(row.calculationDetail, 'Calculation Detail');
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    vm.amortization.locationId = appSession.user.locationId;
                });
            };


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }

            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            function sumAmount() {

                if (vm.amortization == null)
                    return 0;



                var sum = 0;
                for (var i = 0; i < vm.amortization.voucherLines.length; i++) {
                    if (vm.amortization.voucherLines[i].credit != null)
                        sum = sum + parseFloat(vm.amortization.voucherLines[i].credit);
                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.amortization.amountInWords = utilities.toWords(sum);
                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.amortization.amountInWords = '';
                }

                vm.amortization.amount = sum;
                return sum;
            };

            vm.save = function () {
                vm.saving = true;
                //vm.amortization.Date = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                //vm.amortization.voucherLines = vm.amortizationData;
                //sumAmount();

                provisionService.createMonthlyPosting({ provisionsList: vm.monthlyPostingData }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.getMonthlyPosting();
                }).finally(function () {
                    vm.saving = false;
                });
            };


            vm.getMonthlyPosting = function () {
                vm.loading = true;

                vm.monthlyPostingData = [];

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
                //vm.filters.skipCount = vm.skipCount;

                provisionService.getMonthlyPosting(vm.filters).success(
                    function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.disableSaveButton = true;
                        //vm.amortizationData = data.items;
                        if (data.provisionsList) {    
                            //data.provisionsList.forEach(function (value) {
                            //    vm.monthlyPostingData.push(value);
                            //});
                            vm.monthlyPostingData = data.provisionsList;
                            vm.disableSaveButton = !vm.monthlyPostingData.some(e => e.isPosted == false);
                            //vm.disableSaveButton = false;
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('monthlyPostingTbl'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);


                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Monthly Provision Posting.xls';
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
