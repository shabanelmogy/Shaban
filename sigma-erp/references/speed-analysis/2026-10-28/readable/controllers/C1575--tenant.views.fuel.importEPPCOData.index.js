// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:434912-435165
appModule.controller('tenant.views.fuel.importEPPCOData.index', [
        '$scope', 'abp.services.app.ePPCOImportData',
        function ($scope, eppcoImportDataService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isFuelEnabled = abp.features.isEnabled("FuelDataMangement");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.loading = false;
            vm.processing = false;
            var currentPage = 1;
            var maxCountToProcessInOneRequest = 100;
            vm.dateOptions = {
                format: vm.dateFormat
            };
            vm.filters = {
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest
            };

            vm.permissions = {
                create: vm.isFuelEnabled
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    //var localTime = moment.utc(date).toDate();
                    //return moment(localTime).format(vm.dateTimeFormat);
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

            //start
            $scope.selectedFile = null;
            vm.response = {
                processed: 0,
                unProcessed: 0,
                total: 0
            };

            $scope.loadFile = function (files) {
                $scope.$apply(function () {
                    $scope.selectedFile = files[0];
                });
            };

            vm.save = function () {
                vm.loading = true;
                var file = $scope.selectedFile;
                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
                    vm.response = {
                        processed: 0,
                        unProcessed: 0,
                        total: 0
                    };
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            //if VIP Export File detacted
                            if (dataObjects[0]['SITE'] !== undefined) {
                                var fileDataList = [];
                                angular.forEach(dataObjects, function (value) {

                                    fileDataList.push({
                                        amount: value['AMOUNT'],
                                        amountWithoutVat: value['VDET ACTUALAMOUNT'],
                                        batchNo: value['BATCH NO'],
                                        cardNo: value['CARDOFFSET'],//value['VID NUMBER'],
                                        cardOffset: value['CARDOFFSET'],
                                        odoMeter: value['ODOMETER'],
                                        product: value['PRODUCT'],
                                        quantity: value['QUANTITY'],
                                        site: value['SITE'],
                                        source: 1,
                                        transactionDateTime: value['TRANSACTIONDATE'],
                                        unitPrice: value['UNIT PRICE'],
                                        vatAmount: value['VDET VATAMOUNT'],
                                        vatRate: value['VDET VATRATE'],
                                        vehicleInfo: value['PLATECODE'],
                                        voucherNo: value['VOUCHERNO']
                                    });

                                });
                                vm.importDataFuelTransaction(fileDataList);
                            } else if (dataObjects[0]['INT BATCH NO'] !== undefined) {
                                //If ENOC Data File Detected
                                fileDataList = [];
                                angular.forEach(dataObjects, function (value) {
                                    fileDataList.push({//change value names
                                        amount: value['AMOUNT'],
                                        amountWithoutVat: value['ACTUAL AMOUNT WITHOUT VAT'],
                                        batchNo: value['INT BATCH NO'],
                                        cardNo: value['VID NUMBER'],
                                        cardOffset: value['CARDOFFSET'],
                                        odoMeter: value['ODOMETER'],
                                        product: value['PRODUCT'],
                                        quantity: value['QUANTITY'],
                                        site: value['SITE NO'],
                                        source: 2,
                                        transactionDateTime: value['TRANSACTIONDATE'],
                                        unitPrice: value['UNIT PRICE'],
                                        vatAmount: value['VDET ACTUALAMOUNT'],
                                        vatRate: value['VDET VATAMOUNT'],
                                        vehicleInfo: value['VEHICLE NUMBER'],
                                        voucherNo: null
                                    });
                                });
                                vm.importDataFuelTransaction(fileDataList);
                            } else {
                                abp.message.warn("Please select Valid file to upload !", "Unknown File");
                                vm.loading = false;
                            }

                        } else {
                            console.log("Error : Something Wrong Or File is empty !");
                            abp.message.warn("Error : Something Wrong Or File is empty !", "Error");
                            vm.loading = false;
                        }
                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };
                    reader.readAsBinaryString(file);
                } else {
                    abp.message.warn("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }
            };

            vm.importDataFuelTransaction = function (data) {
                vm.loading = true;
                vm.response = {
                    processed: 0,
                    unProcessed: 0,
                    total: 0
                };
                eppcoImportDataService.importDataFuelTransaction({ fuelTransactionList: data })
                    .success(function (result) {
                        vm.response = result;
                        vm.autoProcess(vm.response);
                        abp.notify.success("Saved");
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.refresh = function () {
                vm.response = {
                    processed: 0,
                    unProcessed: 0,
                    total: 0
                };
                angular.element('#fileMobile').val(null);
                $scope.selectedFile = null;
            };

            vm.autoProcess = function (par) {
                if (par.minDate)
                    vm.filters.fromDate = moment(par.minDate).utc().toJSON();
                if (par.maxDate)
                    vm.filters.toDate = moment(par.maxDate).utc().toJSON();

                vm.filters.fromDate = moment(vm.filters.fromDate).startOf('day');
                vm.filters.toDate = moment(vm.filters.toDate).startOf('day').endOf('day');
                
                vm.filters.count = par.count;
                vm.filters.skipCount = 0;
                currentPage = 1;
                moreDataToProcess = true;

                vm.response = {
                    processed: 0,
                    unProcessed: 0,
                    total: 0
                };

                vm.process();
            };

            vm.process = function () {
                if (vm.filters.fromDate > vm.filters.toDate) return;
                vm.processing = true;

                var filters = {};
                filters = vm.filters;

                eppcoImportDataService.processEPPCOData(filters)
                    .success(function (result) {

                        moreDataToProcess = (result.total > 0);
                        if (moreDataToProcess) {

                            //vm.response = result;
                            vm.response.processed += result.processed;
                            vm.response.unProcessed += result.unProcessed;
                            vm.response.total += result.total;

                            vm.filters.skipCount = currentPage * maxCountToProcessInOneRequest;
                            currentPage += 1;
                            vm.process();
                        } else {
                            vm.processing = false;
                        }
                    }).finally(function () {
                        //vm.processing = false;
                    });

            };

            vm.nextProcess = function () {
                vm.filters.skipCount = 0;
                currentPage = 1;
                moreDataToProcess = true;
                vm.response = {
                    processed: 0,
                    unProcessed: 0,
                    total: 0
                };

                vm.filters.fromDate = moment(vm.filters.fromDate).utc().startOf('day');
                vm.filters.toDate = moment(vm.filters.toDate).utc().startOf('day').endOf('day');

                vm.process();
            };
        }
    ]);
