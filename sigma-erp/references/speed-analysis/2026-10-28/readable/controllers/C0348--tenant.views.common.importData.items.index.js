// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:91571-91852
appModule.controller('tenant.views.common.importData.items.index', [
        '$scope', 'abp.services.app.item',
        function ($scope, itemService) {

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

                                var itemNo = value['Item No'];
                                if (!itemNo) {
                                    abp.message.error("Item No field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                var itemNoMain = value['Item No Main'];
                                if (!itemNoMain) {
                                    abp.message.error("Item No Main field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                var itemNoPrefix = value['Item No Prefix'];
                                if (!itemNoPrefix) {
                                    abp.message.error("Item No Prefix field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var itemName = value['Name'];
                                if (!itemName) {
                                    abp.message.error("Item Name field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var itemTypeName = value['Type'];
                                if (!itemTypeName) {
                                    abp.message.error("Item Type field is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                //var model = value['Make, Model and Year'];
                                //if (!model) {
                                //    abp.message.error("make and model field is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var supplierItemCode = value['Supplier Item Code'];
                                if (!supplierItemCode) {
                                    abp.message.error("Supplier Item Code is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    importStatus: 'new',
                                    serialNo: i + 1,
                                    itemNo: value['Item No'].toString().trim(),
                                    itemNoMain: value['Item No Main'] ? value ['Item No Main'].toString().trim() : '',
                                    itemNoPrefix: value['Item No Prefix'].toString().trim(),
                                    name: value['Name'].toString().trim(),
                                    itemTypeName: value['Type'],
                                    makeAndModel: value['Make, Model and Year'] ? value['Make, Model and Year'].toString().trim() : '',
                                    //makeName: value['Make'].toString().trim(),
                                    //modelName: value['Model'].toString().trim(),
                                    //modelYear: value['Model Year'] ? value['Model Year'] : '',
                                    supplierItemCode: value['Supplier Item Code'] ? value['Supplier Item Code'].toString().trim() : '',
                                    unitOfMeasure: value['Unit Of Measure'] ? value['Unit Of Measure'].toString().trim() : '',
                                    price: value['Price'] ? value['Price'].toString().trim() : ''
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

            function prepareDataTosend() {

                angular.forEach(vm.fileDataList, function (dataItem) {
                    var model = {
                        make: { name: dataItem.vehicleMake },
                        name: dataItem.vehicleModel
                    };

                    dataItem.model = model;
                });
            }

            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList) {

                   // prepareDataTosend();

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

                itemService.importItemsData({ items: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.items, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.serialNo === dataItem.serialNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();

                    }).finally(function (data) {
                        vm.loading = false;
                    });

            }

            function hasDuplicateFields() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {

                        if (vm.fileDataList[a].itemNo === vm.fileDataList[j].itemNo) {
                            abp.message.error("Duplicate Item No at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
                            result = true;
                            a = j = vm.fileDataList.length;
                            break;
                        }

                    }
                }

                return result;
            }
        }
    ]);
