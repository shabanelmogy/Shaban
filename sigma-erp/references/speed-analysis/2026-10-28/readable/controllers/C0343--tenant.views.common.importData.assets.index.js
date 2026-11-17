// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:90115-90360
appModule.controller('tenant.views.common.importData.assets.index', [
        '$scope', 'abp.services.app.asset',
        function ($scope, assetAppService) {

            var vm = this;
            var ToDaysDate = moment().utc();

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 20;
            vm.allowImport = false;
            vm.fileDataList = [];
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

                                var name = value['Asset_Title'];
                                if (!name || name.replace(' ', '').length === 0) {
                                    abp.message.error("Asset_Title feild is missing at line " + (i + 2) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var assetType = value['Asset_Type'];
                                if (!assetType || assetType.replace(' ', '').length === 0) {
                                    abp.message.error("Asset_Type feild is missing at line " + (i + 2) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var costprice = value['Asset_Cost_Price'];
                                if (!costprice || costprice < 0) {
                                    abp.message.error("Asset_Cost_Price must be more than 0 at line " + (i + 2) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var residualValue = value['Residual_Value'];
                                if (!residualValue || residualValue < 0) {
                                    abp.message.error("Residual_Value must be more than 0 at line " + (i + 2) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var assetLife = value['Asset_Life_In_Years'];
                                if (!assetLife || assetLife < 0) {
                                    abp.message.error("Asset_Life_In_Years must be more than 0 at line " + (i + 2) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    serialNo: i + 1,
                                    status: 'new',
                                    title: value['Asset_Title'].toString().trim(),
                                    assetType: {
                                        name: value['Asset_Type'].toString().trim()
                                    },
                                    fleetNo: value['Fleet_No'] ? value['Fleet_No'].toString().trim() : '',
                                    purchseCost: value['Asset_Cost_Price'].toFixed(2),
                                    chassisNo: value['Chassis_No'] ? value['Chassis_No'].toString().trim() : '',
                                    deprStartDate: value['Depreciation_Start_Date'] ? correctData(value['Depreciation_Start_Date']) : ToDaysDate,
                                    purchaseDate: value['Purchase_Date'] ? correctData(value['Purchase_Date']) : ToDaysDate,
                                    residualValue: value['Residual_Value'].toFixed(2),
                                    assetLifeInYears: value['Asset_Life_In_Years'],
                                    //description: value['Description'] ? value['Description'].toString().trim() : '',
                                    depreciationMethod: {
                                        name: value['Depreciation_Method'] ? value['Depreciation_Method'].toString().trim() : ''
                                    },
                                    openingDepr: value['Opening_Depreciation_Value'] ? value['Opening_Depreciation_Value'].toFixed(2) : 0,
                                    inServiceDate: value['In_Service_Date'] ? correctData(value['In_Service_Date']) : ToDaysDate,
                                    annualDeprPercentage: value['Annual_Depreciation_Rate'] ? value['Annual_Depreciation_Rate'].toString().trim() : '',
                                    notes: value['Detail'] ? value['Detail'].toString().trim() : '',
                                    costCenterGroup1: {
                                        name: value['CostCenterGroup1'] ? value['CostCenterGroup1'].toString().trim() : '',
                                    },
                                    costCenterGroup2: {
                                        name: value['CostCenterGroup2'] ? value['CostCenterGroup2'].toString().trim() : '',
                                    }
                                    
                                };

                                vm.fileDataList.push(item);
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
            
            function sendDataInBatches() {

                vm.loading = true;

                //get records that dont saved yet
                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.status === 'new' && recordsToSend.length < vm.recordCountInBatch) {
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
                
                assetAppService.importAsstesData({ assets: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.assets, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.serialNo === dataItem.serialNo) {
                                        fileDataItem.status = dataItem.status;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }
                        
                        sendDataInBatches();

                    }).finally(function (data) {
                    //    vm.loading = false;
                    });

            }
        }
    ]);
