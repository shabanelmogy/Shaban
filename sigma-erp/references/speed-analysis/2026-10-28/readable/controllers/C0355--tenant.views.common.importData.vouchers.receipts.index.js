// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:93646-93993
appModule.controller('tenant.views.common.importData.vouchers.receipts.index', [
        '$scope', 'abp.services.app.abooshi',
        function ($scope, abooshiService) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 20000;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;

            vm.totalIdentifyRecordsCount = 0;
            vm.successIdentifyRecordsCount = 0;
            vm.failIdentifyRecordsCount = 0;
            vm.filters = {
                
                type: 0,
               
            };
            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.selectedFile = files[0];
                        readFileData();
                    });
                } else {
                    vm.refresh();
                    $scope.$apply();
                }
            };

            vm.refresh = function () {
                vm.fileDataList = [];
                angular.element('#dataFile').val(null);
                vm.selectedFile = null;
                vm.allowImport = false;

                vm.totalRecordsCount = 0;
                vm.successRecordsCount = 0;
                vm.failRecordsCount = 0;
                vm.errorRecords = null;
                vm.showCount = false;
            };
            vm.fileTypes = [
                { type: "BankJV", id: 1},
                { type: "CashJV", id: 2 }
                
            ];
            vm.voucherTypes = [
                { key: "BankReceipt", value: 1 },
                { key: "CCReceipt", value: 2 },
                
            ];
            vm.getlocalDate = function (date) {
                if (date) {
                    return moment(date).utc().local().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function correctData(date) {
                if (date) {
                    var momentObj = moment(date, 'DD/MM/YYYY');
                    return momentObj;// moment(date).add(50, 'seconds');
                }
                else {
                    return "";
                }
            }

           

            vm.importFromExcelSample = function () {
                //vm.loading = true;


                //agreementAppService.openAgreementSampleFile()
                //    .success(function (result) {
                //        app.downloadTempFile(result);
                //    }).finally(function () {
                //        vm.loading = false;
                //    });
            };

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];



                                var record = {
                                    error: '',
                                    importStatus: 'new',
                                    voucherNo: value['VoucherNo'] ? value['VoucherNo'].toString().trim() : '',
                                    date: value['Date'] ? correctData(value['Date']) : '',
                                    accountCode: value['AccountCode'] ? value['AccountCode'].toString().trim() : '',
                                    accountName: value['AccountName'] ? value['AccountName'].toString().trim() : '',
                                    notes: value['Notes'] ? value['Notes'].toString().trim() : '',
                                    debit: value['Debit'] ? value['Debit'].toString().trim() : '',
                                    credit: value['Credit'] ? value['Credit'] : '',
                                    extraDetail: value['ExtraDetail'] ? value['ExtraDetail'] : '',
                                    fileType: vm.fileType,
                                   


                                };

                                if (record.accountCode) {
                                    vm.fileDataList.push(record);
                                }

                            }
                            for (var i = 0; i < vm.fileDataList.length; i++) {

                                if (!vm.fileDataList[i].date) {
                                    if (i > 0) {
                                        vm.fileDataList[i].date = vm.fileDataList[i - 1].date;
                                    }

                                }
                                if (!vm.fileDataList[i].voucherNo) {
                                    if (i > 0) {
                                        vm.fileDataList[i].voucherNo = vm.fileDataList[i - 1].voucherNo;
                                    }

                                }


                            }


                            if (vm.fileDataList.length > 0)
                                vm.allowImport = true;

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };

                    reader.readAsBinaryString(file);

                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }

            }

            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList) {
                    sendDataInBatches();
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            vm.identify = function () {
                abooshiService.identifyAbooshiData()
                    .success(function (data) {

                        if (data) {
                            vm.totalCount = data.totalCount;
                            vm.identifiedCount = data.identifiedCount;
                            vm.unidentifiedCount = data.totalCount - data.identifiedCount;
                            
                        }

                        

                    }).finally(function (data) {
                        //    vm.loading = false;voucherType
                    });
            };
            
            vm.searchVoucher = function () {


                vm.totalRecordsCount = null;
                vm.successRecordsCount = null;
                vm.failRecordsCount = null;
                abooshiService.searchAbooshiVoucher(vm.filters)
                    .success(function (data) {
                       
                        if (data) {
                            vm.booshiDataByType = data.abooshiReceipts;
                            vm.totalIdentifyRecordsCount = data.abooshiReceipts.length;
                            vm.successIdentifyRecordsCount = data.abooshiReceipts.filter(e => e.importStatus == "success").length;
                            vm.failIdentifyRecordsCount = data.abooshiReceipts.filter(e => e.importStatus == "fail").length;
                            vm.failRecords = data.abooshiReceipts.filter(e => e.importStatus == "fail");

                        }



                    }).finally(function (data) {
                        //    vm.loading = false;
                    });
            };
            vm.create = function () {
                vm.loading = true;
                abooshiService.createAbooshiData(({ abooshiReceipts: vm.booshiDataByType }))
                    .success(function (data) {

                        if (data) {
                            //vm.totalIdentifyRecordsCount = data.abooshiReceipts.length;
                            //vm.successIdentifyRecordsCount = data.abooshiReceipts.filter(e => e.importStatus == "success").length;
                            //vm.failIdentifyRecordsCount = data.abooshiReceipts.filter(e => e.importStatus == "fail").length;
                            //vm.failRecords = data.abooshiReceipts.filter(e => e.importStatus == "fail");

                        }

                        vm.loading = false;

                    }).finally(function (data) {
                           vm.loading = false;
                    });
            };
            vm.identifyAccount = function () {
                abooshiService.identifyAccounts()
                    .success(function (data) {
                        vm.loading = true;
                        if (data) {
                            vm.totalCountAccount = data.totalCount;
                            vm.identifiedCountAccount = data.identifiedCount;
                            vm.unidentifiedCountAccount = data.totalCount - data.identifiedCount;

                        }

                        vm.loading = false;

                    }).finally(function (data) {
                          vm.loading = false;
                    });
            };
            vm.getBooshiDataByType = function () {
                abooshiService.getAbooshiData(({ abooshiReceipts: vm.fileDataList }))
                    .success(function (data) {

                        vm.booshiDataByType = data.abooshiReceipts;



                    }).finally(function (data) {
                        //    vm.loading = false;
                    });
            };

            function sendDataInBatches() {

                vm.loading = true;

                //get records that dont saved yet
                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.importStatus === 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        recordsToSend.push(dataItem);
                    }
                });

                //return condition
                if (recordsToSend.length < 1) {
                    vm.loading = false;
                    vm.showCount = true;
                    vm.totalRecordsCount = vm.fileDataList.length;
                    vm.successRecordsCount = vm.fileDataList.filter(e => e.importStatus == "success").length;
                    vm.failRecordsCount = vm.fileDataList.filter(e => e.importStatus == "fail").length;
                    vm.failRecords = vm.fileDataList.filter(e => e.importStatus == "fail");

                    var fieldsRecordsIndex = [];
                    vm.failRecords.forEach(e => {
                        fieldsRecordsIndex.push(vm.failRecords.indexOf(e) + 1);
                    });
                    vm.errorRecords = fieldsRecordsIndex.join();
                    return;
                }

                abooshiService.abooshiDataExport({ abooshiReceipts: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            //angular.forEach(data.abooshiReceipts, function (dataItem) {
                            //    angular.forEach(vm.fileDataList, function (fileDataItem) {
                            //        if (fileDataItem.voucherNo === dataItem.voucherNo) {
                            //            fileDataItem.importStatus = dataItem.importStatus;
                            //            fileDataItem.error = dataItem.error;
                            //        }
                            //    });
                            //});
                            app.downloadTempFile(data);

                        }

                        //sendDataInBatches();

                    }).finally(function (data) {
                            vm.loading = false;
                    });

            }

            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
