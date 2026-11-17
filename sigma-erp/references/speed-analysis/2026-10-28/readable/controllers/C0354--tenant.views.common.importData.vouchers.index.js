// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:93317-93642
appModule.controller('tenant.views.common.importData.vouchers.index', [
        '$scope', 'abp.services.app.leaseAgreement', 'abp.services.app.vouchersImport',
        function ($scope, leaseAgreementAppService, vouchersImportAppService) {

            var vm = this;



            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 20;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
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
                    return moment(date).add(1, 'minutes').startOf('day');
                }
                else {
                    return "";
                }
            }

            function GetFuleLevel(fraction) {
                var numinatorAndDenominator = fraction.split('/');
                return parseInt(numinatorAndDenominator[0]) / parseInt(numinatorAndDenominator[1]);
            }

            function IsCDWIncludeInRent(value) {
                return value.toUpperCase() === 'NO' ? 0 : 1;
            }

            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                })
            }

            function getVoucherType(type) {

                if (type == "Bill")
                    return { type: 5, voucherSubTypeId: 41 };
                else if (type == "Debit Note")
                    return { type: 9, voucherSubTypeId: 32 };
                else if (type == "General Journal")
                    return { type: 6, voucherSubTypeId: null };
                else if (type == "Expense Payment")
                    return { type: 3, voucherSubTypeId: 6 };
                else if (type == "Invoice")
                    return { type: 1, voucherSubTypeId: 9 };
                else if (type == "Payment On Payables")
                    return { type: 3, voucherSubTypeId: 4 };
                else if (type == "General Payment")
                    return { type: 3, voucherSubTypeId: 21 };
                else if (type == "Receipt On Receivables")
                    return { type: 2, voucherSubTypeId: 25 };
                else if (type == "Credit Note")
                    return { type: 8, voucherSubTypeId: 23 };
                else if (type == "Advance Receipt")
                    return { type: 2, voucherSubTypeId: 10 };
                else if (type == "Mature PDC Receivable")
                    return { type: 15, voucherSubTypeId: null };
                else if (type == "Monthly Update - Expense")
                    return { type: 11, voucherSubTypeId: null };
                else if (type == "Monthly Update - Prepaid Reversal")
                    return { type: 11, voucherSubTypeId: null };

                return type;
            }



            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;
                    debugger;
                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];

                                //var customerName = value['Customer_Name'];
                                //if (!customerName) {
                                //    abp.message.error("Customer Name is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                //var customerCode = value['Customer_Code'];
                                //if (!customerCode) {
                                //    abp.message.error("Customer Code is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var record = {
                                    error: '',
                                    importStatus: 'new',
                                    voucherDate: value['VoucherDate'] ? correctData(value['VoucherDate']) : '',
                                    voucherType: value['VoucherType'] ? value['VoucherType'].toString().trim() : '',
                                    voucherNo: value['VoucherNo'] ? value['VoucherNo'].toString().trim() : '',
                                    plateNo: value['PlateNo'] ? value['PlateNo'].toString().trim() : '',
                                    chassisNo: value['ChasisNo'] ? value['ChasisNo'].toString().trim() : '',
                                    status: value['Status'] ? value['Status'].toString().trim() : '',
                                    accountCode: value['AccountCode'] ? value['AccountCode'].toString().trim() : '',
                                    accountName: value['AccountName'] ? value['AccountName'].toString().trim() : '',
                                    description: value['Description'] ? value['Description'].toString().trim() : '',
                                    contactName: value['ContactName'] ? value['ContactName'].toString().trim() : '',
                                    contactCode: value['ContactCode'] ? value['ContactCode'].toString().trim() : '',
                                    branch: value['Branch'] ? value['Branch'].toString().trim() : '',
                                    debit: value['Debit'] ? parseFloat(value['Debit']) : '',
                                    credit: value['Credit'] ? parseFloat(value['Credit']) : ''
                                };

                                vm.fileDataList.push(record);
                            }

                            vm.fileDataList.forEach(e => {
                                if (e.voucherType == 'Monthly Update - Expense')
                                    e.voucherType = 'Monthly Update - Prepaid Reversal';
                            });



                            var result = groupBy(vm.fileDataList, function (item) {
                                return [item.voucherType, item.voucherNo];
                            });

                            vm.fileDataList = [];

                            angular.forEach(result, function (value) {
                                vm.fileDataList.push({
                                    importStatus: 'new',
                                    voucherNo: value[0].voucherNo,
                                    type: getVoucherType(value[0].voucherType).type,
                                    voucherSubTypeId: getVoucherType(value[0].voucherType).voucherSubTypeId,
                                    date: value[0].voucherDate,
                                    branch: value[0].branch,
                                    voucherLines: fetchVoucherlines(value)
                                });
                            });

                            console.log(vm.fileDataList);





                            //vm.fileDataList = vm.fileDataList.filter(e => !vouchersToExclude.some(vl=>vl==e.voucherNo));

                            if (vm.fileDataList.length > 0)
                                vm.allowImport = true;

                        } else {
                            abp.message.error("Something is Wrong Or File is empty !", "Error");
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

            function fetchVoucherlines(vouchers) {
                var voucherlines = [];
                vouchers.forEach(e => {
                    var obj = {
                        plateNo: e.plateNo,
                        chassisNo: e.chassisNo,
                        status: e.status,
                        accountCode: e.accountCode,
                        accountName: e.accountName,
                        description: e.description,
                        contactName: e.contactName,
                        contactCode: e.contactCode,
                        branch: e.branch,
                        debit: e.debit,
                        credit: e.credit
                    };

                    voucherlines.push(obj);
                });
                return voucherlines;
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
                    vm.successRecordsCount = vm.fileDataList.filter(e => e.status == "success").length;
                    vm.failRecordsCount = vm.fileDataList.filter(e => e.status == "fail").length;
                    vm.failRecords = vm.fileDataList.filter(e => e.status == "fail");

                    var fieldsRecordsIndex = [];
                    vm.failRecords.forEach(e => {
                        fieldsRecordsIndex.push(vm.failRecords.indexOf(e) + 1);
                    });
                    vm.errorRecords = fieldsRecordsIndex.join();
                    return;
                }

                vouchersImportAppService.importVouchersData({ vouchers: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.vouchers, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.voucherNo === dataItem.voucherNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();

                    }).finally(function (data) {
                        //     vm.loading = false;
                    });

            }

            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
