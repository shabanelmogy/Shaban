// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:89412-89782
appModule.controller('tenant.views.common.importData.agreement.rental.closedAgreements', [
        '$scope', 'abp.services.app.agreement',
        function ($scope, agreementAppService) {

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
            getsettingCharges();
            

            
            function correctData(date) {
                if (date) {
                    return moment(date);
                }
                else {
                    return "";
                }
            }

            function GetFuleLevel(fraction) {
                var numinatorAndDenominator = fraction.split('/');
                return parseInt(numinatorAndDenominator[0]) / parseInt(numinatorAndDenominator[1]);
            }
            vm.exportToExcelSample = function () {
                vm.loading = true;


                agreementAppService.agreementClosedSampleFile()
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function IsCDWIncludeInRent(value) {
                return value.toUpperCase() === 'NO' ? 0 : 1;
            }
            //getsettingCharges();
            function readFileData() {
                
                vm.fileDataList = [];
                var file = vm.selectedFile;
                vm.chargesList = [];
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

                                var customerName = value['Customer_Name'];
                                if (!customerName) {
                                    abp.message.error("Customer Name is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var customerCode = value['Customer_Code'];
                                if (!customerCode) {
                                    abp.message.error("Customer Code is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

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
                                    agreementNo: value['Agreement_No'] ? value['Agreement_No'].toString().trim() : '',
                                    agreementNoPrefix: value['Agreement_No_Prefix'] ? value['Agreement_No_Prefix'].toString().trim() : '',
                                    agreementNoMain: value['Agreement_No_Main'] ? value['Agreement_No_Main'].toString().trim() : '',
                                    agreementType: value['Agreement_Type'] ? value['Agreement_Type'].toString().trim() : '',
                                    branchOut: value['Branch_Out'] ? value['Branch_Out'].toString().trim() : '',
                                    branchIn: value['Branch_In'] ? value['Branch_In'].toString().trim() : '',
                                    startDate: value['Start_Date'] ? correctData(value['Start_Date']) : '',
                                    endDate: value['End_Date'] ? correctData(value['End_Date']) : '',
                                    vehiclePlateNo: value['Vehicle_PlateNo'] ? value['Vehicle_PlateNo'].toString().trim() : '',
                                    fuelLevelOut: value['Fuel_Level_Out'] ? GetFuleLevel(value['Fuel_Level_Out'].toString().trim()) : '',
                                    fuelLevelIn: value['Fuel_Level_In'] ? GetFuleLevel(value['Fuel_Level_In'].toString().trim()) : '',
                                    kmOut: value['KMs_Out'] ? value['KMs_Out'] : '',
                                    kmIn: value['KMs_In'] ? value['KMs_In'] : '',
                                    customerName: value['Customer_Name'] ? value['Customer_Name'].toString().trim() : '',
                                    customerCode: value['Customer_Code'] ? value['Customer_Code'].toString().trim() : '',
                                    driverCode: value['Driver_Code'] ? value['Driver_Code'].toString().trim() : '',
                                    driverName: value['Driver_Name'] ? value['Driver_Name'].toString().trim() : '',
                                    driverType: value['Driver_Type'] ? value['Driver_Type'].toString().trim() : '',
                                    additionalDriverCode: value['Additional_Driver_Code'] ? value['Additional_Driver_Code'].toString().trim() : '',
                                    additionalDriverName: value['Additional_Driver_Name'] ? value['Additional_Driver_Name'].toString().trim() : '',
                                    
                                    recurringRatesSum: value['RecurringRates_Sum'] ? value['RecurringRates_Sum'] : '',
                                    poNo: value['PoNo'] ? value['PoNo'] : ''
                                };
                                
                                angular.forEach(vm.chargesSettings, function (chargesAmount) {
                                    chargesAmount.rate = 0;
                                    if (chargesAmount.chargesType.name +'_Rate')
                                    {
                                        
                                        chargesAmount.rate = value[chargesAmount.chargesType.name + '_Rate'] ? value[chargesAmount.chargesType.name + '_Rate'] : '';
                                        if (value[chargesAmount.chargesType.name + '_Rate'] && parseFloat(value[chargesAmount.chargesType.name + '_Rate']) > 0) {
                                            chargesAmount.rate = parseFloat(value[chargesAmount.chargesType.name + '_Rate']);

                                        }

                                        chargesAmount.charges = value[chargesAmount.chargesType.name + '_Charges'] ? value[chargesAmount.chargesType.name + '_Charges'] : '';
                                        if (value[chargesAmount.chargesType.name + '_Charges'] && parseFloat(value[chargesAmount.chargesType.name + '_Charges']) > 0) {
                                            chargesAmount.charges = parseFloat(value[chargesAmount.chargesType.name + '_Charges']);

                                        }

                                        chargesAmount.receivedOpening = value[chargesAmount.chargesType.name + '_Received'] ? value[chargesAmount.chargesType.name + '_Received'] : '';
                                        if (value[chargesAmount.chargesType.name + '_Received'] && parseFloat(value[chargesAmount.chargesType.name + '_Received']) > 0) {
                                            chargesAmount.receivedOpening = parseFloat(value[chargesAmount.chargesType.name + '_Received']);

                                        }


                                        
                                        var include = chargesAmount.chargesType.name + "_" + "Include";
                                        if (value[include] && value[include].toString().trim().toUpperCase() === 'YES') {
                                            chargesAmount.included = true;
                                        } else {
                                            chargesAmount.included = false;
                                        }
                                        
                                        var deductiblePerIncident = chargesAmount.chargesType.name + "_" + "DeductiblePerIncident";
                                        chargesAmount.excessRate = value[deductiblePerIncident] ? value[deductiblePerIncident] : '';
                                        if (value[deductiblePerIncident] && parseFloat(value[deductiblePerIncident]) > 0) {
                                            chargesAmount.excessRate = parseFloat(value[deductiblePerIncident]);

                                        }

                                        if (chargesAmount.chargesType.chargesCategory == 6)
                                        {
                                            var allowed = chargesAmount.chargesType.name + "_" + "Allowed";
                                            record.mileageAllowed = value[allowed] ? value[allowed] : '';
                                            if (value[allowed] && parseFloat(value[allowed]) > 0) {
                                                record.mileageAllowed = parseFloat(value[allowed]);

                                            }



                                            var excessRate = chargesAmount.chargesType.name + "_" + "Excess";
                                            chargesAmount.excessRate = value[excessRate] ? value[excessRate] : '';
                                            if (value[excessRate] && parseFloat(value[excessRate]) > 0) {
                                                chargesAmount.excessRate = parseFloat(value[excessRate]);

                                            }
                                            
                                        }

                                    }
                                });
                                
                                record.charges = angular.copy(vm.chargesSettings);

                                if (value['TotalCharges']) {
                                    record.totalCharges = 0.0;
                                    var totalCharges = parseFloat(value['TotalCharges']);
                                    if (totalCharges) {
                                        record.totalCharges = totalCharges;
                                    }
                                } else { record.totalCharges = 0.0; }
                                if (value['Tax']) {
                                    record.tax = 0.0;
                                    var tax = parseFloat(value['Tax']);
                                    if (tax) {
                                        record.tax = tax;
                                    }
                                } else { record.tax = 0.0; }

                                if (value['Tax_Received']) {
                                    record.taxReceivedOpening = 0.0;
                                    var taxReceivedOpening = parseFloat(value['Tax_Received']);
                                    if (taxReceivedOpening) {
                                        record.taxReceivedOpening = taxReceivedOpening;
                                    }
                                } else { record.taxReceivedOpening = 0.0; }

                                if (value['Tax_Percentage']) {
                                    record.texPercentage = 0.0;
                                    var texPercentage = parseFloat(value['Tax_Percentage']);
                                    if (texPercentage) {
                                        record.texPercentage = texPercentage;
                                    }
                                } else { record.texPercentage = 0.0; }
                                

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
            vm.localize = function (chargesName) {
                return app.localize(chargesName);
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

                agreementAppService.importClosedAgreementsData({ agreements: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.agreements, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.agreementNo === dataItem.agreementNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();
                        vm.loading = false;
                    }).finally(function (data) {
                        vm.loading = false;
                    });

            }

            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
