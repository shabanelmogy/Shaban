// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:91856-92079
appModule.controller('tenant.views.common.importData.jvImport', [
        '$scope', 'abp.services.app.jV',
        function ($scope, jvAppService) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 100;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.fileDataList = [];
            vm.errorRecords = null;
            vm.showCount = false;

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

            function correctDate(date) {

                if (!date) return null;

                return moment(date, 'DD/MM/YYYY').startOf('day');
            }
            vm.getlocalDate = function (date) {

                if (!date)
                    return '';

                return moment(date).format('DD/MM/YYYY');
            };

            function readFileData() {
                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
                    var reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary',
                            cellDates: true,
                            cellNF: false,
                            cellText: false
                        });

                        var firstSheetName = workbook.SheetNames[0];
                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
                            raw: true,
                            dateNF: 'MM-DD-YYYY HH:mm:ss'
                        });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {
                                var value = dataObjects[i];
                                var item = {
                                    serialNo: i + 1,
                                    importStatus: 'new',
                                    error: '',

                                    voucherDate: value['Voucherdate'] ? correctDate(value['Voucherdate']) : null,
                                    voucherType: value['vouchertype'] ? value['vouchertype'].toString().trim() : '',
                                    voucherNumber: value['Vouchernumber'] ? value['Vouchernumber'].toString().trim() : '',

                                    speedCode: value['Speedcode'] ? value['Speedcode'].toString().trim() : '',
                                    accountName: value['Accountname'] ? value['Accountname'].toString().trim() : '',
                                    contactCode: value['Contactcode'] ? value['Contactcode'].toString().trim() : '',
                                    plateNumber: value['Platenumber'] ? value['Platenumber'].toString().trim() : '',
                                    description: value['Description'] ? value['Description'].toString().trim() : '',

                                    fromDate: value['fromdate'] ? correctDate(value['fromdate']) : null,
                                    toDate: value['todate'] ? correctDate(value['todate']) : null,

                                    debit: value['Debit'] ? parseFloat(value['Debit']) : 0,
                                    credit: value['Credit'] ? parseFloat(value['Credit']) : 0
                                };

                                vm.fileDataList.push(item);
                            }

                            if (vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateInvalidRows();
                            }

                        } else {
                            abp.message.error("Something wrong or file is empty!", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(app.localize(ex), 'Unknown File');
                    };

                    reader.readAsBinaryString(file);
                } else {
                    abp.message.error("Please select a valid Excel file!", "Unknown File");
                    vm.loading = false;
                }
            }

            vm.importData = function () {
                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList && vm.fileDataList.length > 0) {
                    sendDataInBatches();
                } else {
                    vm.loading = false;
                    abp.message.error("Something wrong or file is empty!", "Error");
                }
            };

            function sendDataInBatches() {
                vm.loading = true;

                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.importStatus === 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        recordsToSend.push(dataItem);
                    }
                });

                if (recordsToSend.length < 1) {
                    vm.loading = false;

                    vm.showCount = true;
                    vm.totalRecordsCount = vm.fileDataList.length;
                    vm.successRecordsCount = vm.fileDataList.filter(e => e.importStatus === "success").length;
                    vm.failRecordsCount = vm.fileDataList.filter(e => e.importStatus === "fail").length;
                    vm.failRecords = vm.fileDataList.filter(e => e.importStatus === "fail");

                    var failedRecordsIndex = [];
                    vm.failRecords.forEach(function (e) {
                        failedRecordsIndex.push(e.serialNo);
                    });
                    vm.errorRecords = failedRecordsIndex.join();
                    return;
                }

                jvAppService.importJVData({ rows: recordsToSend })
                    .success(function (data) {
                        if (data && data.rows) {
                            angular.forEach(data.rows, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.serialNo === dataItem.serialNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();
                    })
                    .finally(function () {
                    });
            }

            function hasDuplicateInvalidRows() {
                var result = false;

                for (var i = 0; i < vm.fileDataList.length; i++) {
                    var row = vm.fileDataList[i];

                    if (!row.voucherDate) {
                        abp.message.error("VoucherDate is missing at record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    if (!row.voucherNumber) {
                        abp.message.error("VoucherNumber is missing at record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    if (!row.speedCode) {
                        abp.message.error("SpeedCode is missing at record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    if ((row.debit <= 0 && row.credit <= 0) || (row.debit > 0 && row.credit > 0)) {
                        abp.message.error("Either Debit or Credit must be filled correctly at record " + row.serialNo + ".", "Error");
                        return true;
                    }
                }

                return result;
            }
        }
    ]);
