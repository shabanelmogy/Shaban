// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:390049-390332
appModule.controller('tenant.views.crs.vouchers.receipts.importCcReceiptsModal', [
        '$uibModal', '$uibModalInstance', '$scope', 'abp.services.app.receipt', 'abp.services.app.commonLookup', 'abp.services.app.billingMethod',
        function ($uibModal, $uibModalInstance, $scope, receiptAppService, commonLookupService, billingMethodService) {
            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 5;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.allowFileSelection = false;
            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.totalRecordsCount = 0;
                        vm.successRecordsCount = 0;
                        vm.failRecordsCount = 0;
                        vm.errorRecords = null;
                        vm.showCount = false;
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
                vm.bankAccount = null;
                vm.allowFileSelection = false;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDate = function (date) {
                if (date) {
                    return moment(date).utc().local().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function getBankAccounts() {
                commonLookupService.getBankAccountsForSelection().success(function (data) {
                    vm.bankAccounts = data.items;
                    vm.bankAccounts.forEach(e => e.chequePrintTemplate = null);
                });
            }

            vm.checkForBankAccount = function (id) {
                if (id) {
                    vm.allowFileSelection = true;
                }
            }

            function correctData(date) {
                if (date) {
                    return moment(date).add(1, 'minutes').startOf('day');
                }
                else {
                    return "";
                }
            }

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

                            var checkForDuplication = true;

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];

                                var date = value['Transaction Date'];
                                if (!date) {
                                    abp.message.error('Transaction Date field is missing at record' + (i + 1) + '.', 'Error');
                                    vm.fileDataList = [];
                                    break;
                                }
                                var description = value['Gross Amount'];
                                if (!description) {
                                    abp.message.error("Gross Amount field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    serialNo: i + 1,

                                    importStatus: 'new',
                                    transactiondate: value['Transaction Date'] ? correctData(value['Transaction Date']) : '',
                                    customerName: value['Customer Name'] ? value['Customer Name'] : '',
                                    cardnumber: value['Card Number'] ? value['Card Number'] : '',
                                    grossamount: value['Gross Amount'] ? value['Gross Amount'] : '',
                                    authid: value['Auth. ID'] ? value['Auth. ID'] : '',
                                    commissionamt: value['Commission Amt'] ? value['Commission Amt'] : '',
                                    netamount: value['Net Amount'] ? value['Net Amount'] : '',
                                    vatamount: value['Vat Amount'] ? value['Vat Amount'] : '',
                                    terminalid: value['Terminal ID'] ? value['Terminal ID'] : '',
                                    bankAccountId: vm.bankAccount.id,
                                    receiptNo: null
                                };

                                vm.fileDataList.push(item);
                            }

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateFields();
                            }

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
                    //receiptAppService.importDdaReceiptsData({ dda: vm.fileDataList })
                    //        .success(function (data) {
                    //            if (data) {
                    //                angular.forEach(data.dda, function (dataItem) {
                    //                    angular.forEach(vm.fileDataList, function (fileDataItem) {
                    //                        if (fileDataItem.serialNo === dataItem.serialNo) {
                    //                            fileDataItem.importStatus = dataItem.importStatus;
                    //                            fileDataItem.error = dataItem.error;
                    //                            fileDataItem.receiptNo = dataItem.receiptNo;
                    //                        }
                    //                    });
                    //                });
                    //                vm.loading = false;
                    //                vm.showCount = true;
                    //                vm.totalRecordsCount = vm.fileDataList.length;
                    //                vm.successRecordsCount = vm.fileDataList.filter(e => e.importStatus == "success").length;
                    //                vm.failRecordsCount = vm.fileDataList.filter(e => e.importStatus == "fail").length;
                    //                vm.failRecords = vm.fileDataList.filter(e => e.importStatus == "fail");
                    //                var failedRecordsIndex = [];
                    //                vm.failRecords.forEach(e => {
                    //                    failedRecordsIndex.push(e.serialNo);
                    //                });
                    //                vm.errorRecords = failedRecordsIndex.join();
                    //            }
                    //        });
                    //    return;
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            function sendDataInBatches() {

                vm.loading = true;

                //get records not saved yet
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
                    var failedRecordsIndex = [];
                    vm.failRecords.forEach(e => {
                        failedRecordsIndex.push(e.serialNo);
                    });
                    vm.errorRecords = failedRecordsIndex.join();
                    return;
                }

                receiptAppService.importCcReceiptsData({ cc: vm.fileDataList, bankAccountId: vm.bankAccount.id })
                    .success(function (data) {
                        if (data) {
                            angular.forEach(data.cc, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {

                                    if (fileDataItem.serialNo == dataItem.serialNo)
                                    {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.customerName = dataItem.customerName;
                                        fileDataItem.error = dataItem.error;
                                        fileDataItem.receiptNo = dataItem.receiptNo;
                                    }
                                });
                            });

                        }
                        sendDataInBatches();
                    });

            }

            function hasDuplicateFields() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {
                    //    if (moment(vm.fileDataList[a].date).format('DD-MM-YYYY') === moment(vm.fileDataList[j].date).format('DD-MM-YYYY') && vm.fileDataList[a].description === vm.fileDataList[j].description && vm.fileDataList[a].credit === vm.fileDataList[j].credit) {
                    //        abp.message.error("Duplicate records found at " + (a + 1) + " and " + (j + 1) + ".", "Error");
                    //        result = true;
                    //        a = j = vm.fileDataList.length;
                    //        break;
                    //    }
                    }
                }
                return result;
            }

            function init() {
                billingMethodService.getBillingMethods({ category: 1, type: 5 }) // 1: receipts, 5: bank transfer
                    .success(function (list) {
                        if (!list.items || !list.items.length > 0) {
                            abp.message.error("No Any Bank Transfer Method Is Defined In System");
                            $uibModalInstance.dismiss();
                        }
                    });
                getBankAccounts();
            }
            init();
        }
    ]);
