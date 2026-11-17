// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:121113-121434
appModule.controller('tenant.views.crs.accounting.amortization.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.amortization', 'abp.services.app.commonLookup', 'appSession', 'utilities', 'abp.services.app.loanAmortization',
        function ($scope, $uibModal, uiGridConstants, amortizationService, commonLookupService, appSession, utilities, loanAmortizationService) {

            var vm = this;
            vm.amortization = {};
            vm.amortizationCustom = {};
            vm.amortizationData = [];
            vm.amortizationDataCustom = [];
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isSalesModuleEnabled = abp.features.isEnabled("CRS.SalesModule");
            vm.isAmortizationEnabled = abp.features.isEnabled("CRS.Vouchers.LoanAmortization");
            vm.disableSaveButton = true;
            vm.totalAmountOfAmortization = 0;
            vm.totalAmountOfAmortizationCustom = 0;
            vm.skipCount = 0;
            var batchSize = 100;
            vm.filters = {
                monthYear: new Date(),
                monthYearForCustom: new Date(),
                maxResultCount: batchSize
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();

            });

            vm.calculationDetail = function (row) {
                abp.message.info(row.calculationDetail, 'Calculation Detail');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            //function getLocations() {
            //    commonLookupService.getLocations({}).success(function (data) {
            //        vm.locations = data.items;
            //        vm.amortization.locationId = appSession.user.locationId;
            //    });
            //};

            function sumAmount() {

                if (vm.amortization == null)
                    return 0;



                var sum = 0;
                for (var i = 0; i < vm.amortization.voucherLines.length; i++) {
                    //temporarily nullify
                    vm.amortization.voucherLines[i].prepaidAccount = null;
                    vm.amortization.voucherLines[i].calculationDetailOutPut = null;

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

            function sumAmountCustom() {

                if (vm.amortizationCustom == null)
                    return 0;



                var sum = 0;
                for (var i = 0; i < vm.amortizationCustom.voucherLines.length; i++) {
                    //temporarily nullify
                    vm.amortizationCustom.voucherLines[i].prepaidAccount = null;
                    vm.amortizationCustom.voucherLines[i].calculationDetailOutPut = null;

                    if (vm.amortizationCustom.voucherLines[i].credit != null)
                        sum = sum + parseFloat(vm.amortizationCustom.voucherLines[i].credit);
                }

                if (sum > 0) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.amortizationCustom.amountInWords = utilities.toWords(sum);
                } else {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.amortizationCustom.amountInWords = '';
                }

                vm.amortizationCustom.amount = sum;
                return sum;
            };

            vm.saveCustom = function () {
                vm.savingCustom = true;
                vm.amortizationCustom.Date = moment(vm.filters.monthYearForCustom).endOf('month').milliseconds(0).utc(); 
                //vm.amortizationCustom.voucherLines = vm.amortizationDataCustom;
                vm.amortizationCustom.voucherLines = angular.copy(vm.amortizationDataCustomOriginal);

                vm.amortizationCustom.voucherLines.forEach(function (row) {
                    if (row.credit < 0) {
                        row.debit = Math.abs(row.credit); 
                        row.credit = 0; 
                    } else {
                        row.debit = 0;
                    }
                });

                sumAmountCustom();

                loanAmortizationService.createAmortizationNew({ amortization: vm.amortizationCustom }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.disableSaveButton = true;

                }).finally(function () {

                    vm.savingCustom = false;
                    vm.disableSaveButton = true;


                });
            };
            vm.save = function () {
                vm.saving = true;
                vm.amortization.Date = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                vm.amortization.voucherLines = vm.amortizationData;
                sumAmount();

                amortizationService.createAmortization({ amortization: vm.amortization }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.disableSaveButton = true;

                }).finally(function () {

                    vm.saving = false;
                    vm.disableSaveButton = true;


                });
            };

            //vm.getAmmortization = function () {
            //    vm.loading = true;
            //    vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
            //    vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
            //    amortizationService.getAmortization(vm.filters).success(

            //        function (data) {

            //            vm.disableSaveButton = false;
            //            vm.amortizationData = data.items;
            //            vm.amortizationData.forEach(function (row) {
            //                row.credit = row.calculationDetailOutPut.credit;
            //                row.calculationDetail = row.calculationDetailOutPut.calculationDetail;
            //            });

            //        }).finally(function () {

            //            vm.loading = false;

            //        });
            //};

            vm.getAmmortizationCustom = function () {
                vm.loadingCustom = true;
                if (vm.skipCount == 0) {
                    vm.amortizationDataCustom = [];
                    vm.amortizationDataCustomOriginal = []; // clear original copy too
                }

                vm.filters.startDate = moment(vm.filters.monthYearForCustom).startOf('month').utc();
                vm.filters.endDate = moment(vm.filters.monthYearForCustom).endOf('month').endOf('day').utc();
                vm.filters.skipCount = vm.skipCount;

                loanAmortizationService.getAmortizationBatchWise(vm.filters).success(
                    function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.disableSaveButton = true;
                        //vm.amortizationData = data.items;
                        data.amortizationList.forEach(function (value) {
                            vm.amortizationDataCustom.push(value);
                        });

                        vm.amortizationDataCustom.forEach(function (row) {
                            row.credit = row.calculationDetailOutPut.credit;
                            row.calculationDetail = row.calculationDetailOutPut.calculationDetail;
                        });

                        // Make a copy of the processed but unfiltered data
                        vm.amortizationDataCustomOriginal = angular.copy(vm.amortizationDataCustom);

                        //vm.amortizationDataCustom = vm.amortizationDataCustom.filter(item => item.credit > 0);

                        vm.skipCount = vm.skipCount + batchSize;
                        if (vm.skipCount < vm.totalDataCount)
                            vm.getAmmortizationCustom();
                        else
                        {
                            vm.loadingCustom = false;
                            vm.disableSaveButton = false;
                            vm.totalAmountOfAmortizationCustom = vm.amortizationDataCustom.reduce((sum, item) => {
                                return item.credit > 0 ? sum + item.credit : sum;
                            }, 0);
                            vm.totalAmortizationCountCustom = vm.amortizationDataCustom.filter(item => item.credit > 0).length;
                            vm.skipCount = 0;
                        }

                    }).finally(function () {

                        // vm.loading = false;

                    });
            };

            vm.getAmmortization = function ()
            {
                vm.loading = true;
                if (vm.skipCount == 0)
                    vm.amortizationData = [];

                vm.filters.startDateCustom = moment(vm.filters.monthYear).startOf('month').utc();
                vm.filters.endDateCustom = moment(vm.filters.monthYear).endOf('month').startOf('day').utc();
                vm.filters.skipCount = vm.skipCount;

                amortizationService.getAmortizationBatchWise(vm.filters).success(
                    function (data) {
                        vm.totalDataCount = data.totalCount;
                        vm.disableSaveButton = true;
                        //vm.amortizationData = data.items;
                        data.amortizationList.forEach(function (value) {
                            vm.amortizationData.push(value);
                        });

                        vm.amortizationData.forEach(function (row) {
                            row.credit = row.calculationDetailOutPut.credit;
                            row.calculationDetail = row.calculationDetailOutPut.calculationDetail;
                        });


                        vm.skipCount = vm.skipCount + batchSize;
                        if (vm.skipCount < vm.totalDataCount)
                            vm.getAmmortization();
                        else {
                            vm.loading = false;
                            vm.disableSaveButton = false;
                            vm.totalAmountOfAmortization = vm.amortizationData.reduce((p, c) => p += c.credit, 0);
                            vm.totalAmortizationCount = vm.amortizationData.length;
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
                var tab1 = document.getElementById('amortizationTbl'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);


                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Amortization.xls';
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
                //getLocations();
            }

            init();
        }]);
