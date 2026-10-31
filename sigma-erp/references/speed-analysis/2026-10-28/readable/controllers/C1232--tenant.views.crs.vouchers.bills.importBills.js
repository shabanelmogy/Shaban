// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:324381-324708
appModule.controller('tenant.views.crs.vouchers.bills.importBills', [
        '$scope', 'abp.services.app.agreement', 'abp.services.app.bill',
        function ($scope, agreementAppService, billService) {

            var vm = this;
            vm.taxCalculationOnBillImport = abp.setting.getBoolean("App.Speed.Common.TaxCalculationOnBillImport");

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 1000;
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
            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
            vm.getBillTypeById = function (voucherSubTypeId) {

                if (voucherSubTypeId == 41) return app.localize("ServiceBill");
                else if (voucherSubTypeId == 42) return app.localize("StockBill");
                else if (voucherSubTypeId == 43) return app.localize("AssetBill");
                else if (voucherSubTypeId == 51) return app.localize("BillProvision");
                else if (voucherSubTypeId == 61) return app.localize("StockGrnBill");
                else if (voucherSubTypeId == 62) return app.localize("AssetGrnBill");


                else return "";
            };
            function correctData(date) {
                if (date) {
                    return moment(date).add(12, 'seconds'); // add 12 seconds
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
            function getsettingCharges() {
                vm.loading = true;
                agreementAppService.getChargesSettings()
                    .success(function (data) {

                        vm.chargesSettings = data;
                        vm.loading = false;
                    }).finally(function (data) {
                        vm.loading = false;
                    });
            }
            vm.importFromExcelSample = function () {
                vm.loading = true;


                agreementAppService.openAgreementSampleFile()
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            getsettingCharges();
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

                                //var driverCode = value['Driver_Code'];
                                //if (!driverCode) {
                                //    abp.message.error("Driver Code is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                //var driverName = value['Driver_Name'];
                                //if (!driverName) {
                                //    abp.message.error("Driver Name is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var record = {
                                    error: '',
                                    importStatus: 'new',

                                    supplierCode: value['Supplier_Code'] ? value['Supplier_Code'].toString().trim() : '',
                                    supplierName: value['Supplier_Name'] ? value['Supplier_Name'].toString().trim() : '',
                                    supplierBillNo: value['Supplier_Bill_No'] ? value['Supplier_Bill_No'].toString().trim() : '',
                                    supplierBillDate: value['Supplier_Bill_Date'] ? correctData(value['Supplier_Bill_Date']) : '',
                                    accountName: value['Account_Name'] ? value['Account_Name'].toString().trim() : '',
                                    assetType: value['Asset_Type'] ? value['Asset_Type'].toString().trim() : '',
                                    accountCode: value['Account_Code'] ? value['Account_Code'].toString().trim() : '',
                                    //contactCode: value['Contact_Code'] ? value['Contact_Code'].toString().trim() : '',
                                    //contactName: value['Contact_Name'] ? value['Contact_Name'].toString().trim() : '',
                                    description: value['Description'] ? value['Description'].toString().trim() : '',
                                    quantity: value['Quantity'] ? value['Quantity'].toString().trim() : '',
                                    price: value['Unit_Price'] ? value['Unit_Price'].toString().trim() : '',
                                    debit: value['Debit'] ? value['Debit'].toString().trim() : '',
                                    //credit: value['Credit'] ? value['Credit'].toString().trim() : '',
                                    branch: value['Branch_Code'] ? value['Branch_Code'].toString().trim() : '',
                                    prepaidFromDate: value['Prepaid_From_Date'] ? correctData(value['Prepaid_From_Date']) : '',
                                    prepaidToDate: value['Prepaid_To_Date'] ? correctData(value['Prepaid_To_Date']) : '',
                                    billDate: value['Bill_Date'] ? correctData(value['Bill_Date']) : '',
                                    //totalAmount: value['Bill_Total_Amount'] ? value['Bill_Total_Amount'].toString().trim() : '',
                                    //costCenter1: value['Cost_Center_Group_1'] ? value['Cost_Center_Group_1'].toString().trim() : '',
                                    //costCenter2: value['Cost_Center_Group_2'] ? value['Cost_Center_Group_2'].toString().trim() : '',
                                    voucherSubTypeId: value['Bill_Type'] ? value['Bill_Type'].toString().trim() : '',
                                    plateNo: (value['Plate_No (Sub Lookup)'] || value['Plate_No']) ? (value['Plate_No (Sub Lookup)'] || value['Plate_No']).toString().trim() : '',
                                    chassisNo: value['Chassis_No'] ? value['Chassis_No'].toString().trim() : '',
                                    manualAgreementNo: value['Manual_Agreement_No'] ? value['Manual_Agreement_No'].toString().trim() : '',
                                    isTaxable: value['IsTaxable'] === undefined || value['IsTaxable'] === null || value['IsTaxable'].toString().trim() === ''
                                        ? null
                                        : value['IsTaxable'].toString().trim().toLowerCase() === 'yes'
                                };
                                if (record.voucherSubTypeId == 'ServiceBill') {
                                    record.voucherSubTypeId = 41;
                                }
                                if (record.voucherSubTypeId == 'StockBill') {
                                    record.voucherSubTypeId = 42;
                                }
                                if (record.voucherSubTypeId == 'AssetBill') {
                                    record.voucherSubTypeId = 43;

                                }
                                if (record.voucherSubTypeId == 'StockGrnBill') {
                                    record.voucherSubTypeId = 61;
                                }
                                if (record.voucherSubTypeId == 'AssetGrnBill') {
                                    record.voucherSubTypeId = 62;
                                }
                                vm.fileDataList.push(record);
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
            //function prepareDataTosend() {

            //    angular.forEach(vm.fileDataList, function (dataItem) {
            //        var account = {
            //            accountCode=dataItem.accountCode,
            //            name: dataItem.accountName
            //        };
            //        var contact = {
            //            code: dataItem.contactCode,
            //            name: dataItem.contactName
            //        };
            //        var vehicle = {
            //            plateNo: dataItem.plateNo

            //        };

            //        dataItem.account = account;
            //        dataItem.contact = contact;
            //        dataItem.vehicle = vehicle;
            //    });
            //}
            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList) {
                    //prepareDataTosend();
                    sendDataInBatches();
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            function sendDataInBatches() {

                vm.loading = true;

                var recordsToSend = [];
                var promises = []; // ✅ added to handle async

                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.importStatus === 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        if (dataItem.manualAgreementNo) {
                            // ✅ wrap async call in a promise
                            var p = agreementAppService.getAgreementByManualNo(dataItem.manualAgreementNo)
                                .then(function (result) {
                                    if (result && result.data) {
                                        dataItem.agreementId = result.data.id;
                                    }
                                    recordsToSend.push(dataItem);
                                });
                            promises.push(p);
                        } else {
                            recordsToSend.push(dataItem);
                        }
                    }
                });

                Promise.all(promises).then(function () {
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

                    billService.importBills({ bills: recordsToSend })
                        .success(function (data) {

                            if (data) {
                                angular.forEach(data.bills, function (dataItem) {
                                    angular.forEach(vm.fileDataList, function (fileDataItem) {
                                        if (fileDataItem.supplierBillNo === dataItem.supplierBillNo) {
                                            fileDataItem.importStatus = dataItem.importStatus;
                                            fileDataItem.error = dataItem.error;
                                            fileDataItem.billNo = dataItem.billNo;
                                            fileDataItem.vehicleStatus = dataItem.vehicleStatus;
                                        }
                                    });
                                });
                            }
                            vm.loading = false;
                            // sendDataInBatches();

                        }).finally(function (data) {
                            vm.loading = false;
                        });
                });
            }


            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
