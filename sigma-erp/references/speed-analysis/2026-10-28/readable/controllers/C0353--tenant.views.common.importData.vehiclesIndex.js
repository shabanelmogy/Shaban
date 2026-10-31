// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:92958-93313
appModule.controller('tenant.views.common.importData.vehiclesIndex', [
        '$scope', 'abp.services.app.vehicle',
        function ($scope, vehicleAppService) {

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

                                var vehicleNo = value['Vehicle_No'];
                                if (!vehicleNo) {
                                    abp.message.error("Vehicle_No feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var fleetNo = value['Fleet_No'];
                                if (!fleetNo) {
                                    abp.message.error("Fleet_No feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var model = value['Model'];
                                if (!model) {
                                    abp.message.error("model feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var make = value['Make'];
                                if (!make) {
                                    abp.message.error("Make feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    importStatus: 'new',
                                    serialNo: i + 1,
                                    plateNo: value['Vehicle_No'].toString().trim(),
                                    fleetCode: value['Fleet_No'],
                                    vehicleModel: value['Model'].toString().trim(),
                                    vehicleMake: value['Make'].toString().trim(),
                                    branchName: value['Branch_Name'] ? value['Branch_Name'].toString().trim() : '',
                                    modelYear: value['Year'] ? value['Year'] : '',
                                    chassisNo: value['Chassis_No'] ? value['Chassis_No'].toString().trim() : '',
                                    engineNo: value['Engine_No'] ? value['Engine_No'].toString().trim() : '',
                                    engineCapacity: value['Engine_Capacity'] ? value['Engine_Capacity'].toString().trim() : '',
                                    interiorColor: value['Interior_Color'] ? value['Interior_Color'].toString().trim() : '',
                                    exteriorColor: value['Exterior_Color'] ? value['Exterior_Color'].toString().trim() : '',
                                    fuelTankCapacity: value['Fuel_Tank_Capacity'] ? value['Fuel_Tank_Capacity'].toString().trim() : '',
                                    eTag: value['Salik_Tag'] ? value['Salik_Tag'].toString().trim() : '',
                                    acrissCodes: value['Acriss_Code'] ? value['Acriss_Code'].toString().trim() : '',
                                    tariffGroupTitle: value['Vehicle_Type'] ? value['Vehicle_Type'].toString().trim() : '',
                                    trafficFileId: value['TrafficFileId'] ? value['TrafficFileId'].toString().trim() : '',
                                    vehicleType: value['Fleet_Type'] ? value['Fleet_Type'].toString().trim() : '',
                                    kMs: value['KMs'] ? value['KMs'] : 0,
                                    ownership: value['Ownership'] ? value['Ownership'].toString().trim() : '',
                                    purchaseDate: value['Purchase_Date'] ? correctData(value['Purchase_Date']) : '',
                                    onFleetDate: value['On_Fleet_Date'] ? correctData(value['On_Fleet_Date']) : '',
                                    registrationDate: value['Registration_Date'] ? correctData(value['Registration_Date']) : '',
                                    nextRegistrationDate: value['Next_Registration_Date'] ? correctData(value['Next_Registration_Date']) : '',
                                    insuranceDate: value['Insurance_Date'] ? correctData(value['Insurance_Date']) : '',
                                    nextInsuranceDate: value['Next_Insurance_Date'] ? correctData(value['Next_Insurance_Date']) : '',
                                    insurancePolicyNo: value['Insurance_Policy_No'] ? value['Insurance_Policy_No'].toString().trim() : '',
                                    warrantyInKms: value['Warranty_In_Kms'] ? value['Warranty_In_Kms'] : '',
                                    warrantyInMonths: value['Warranty_In_Months'] ? value['Warranty_In_Months'] : '',
                                    notes: value['Notes'] ? value['Notes'].toString().trim() : ''
                                };


                                var status = value['Status'];
                                if (status) {
                                    if (status === "Hired") {
                                        item.StatusId = "HIR"; item.SubStatus = null; item.status = status;
                                    } else if (status === "OnNRM") {
                                        item.StatusId = "NRM"; item.SubStatus = null; item.status = status;
                                    }
                                    else if (status === "InWorkshop") {
                                        item.StatusId = "WRK"; item.SubStatus = null; item.status = status;
                                    }
                                    else if (status === "ForSale") {
                                        item.StatusId = "IDL"; item.SubStatus = 3; item.status = status;
                                    }
                                    else if (status === "TotalLoss") {
                                        item.StatusId = "IDL"; item.SubStatus = 4; item.status = status;
                                    }
                                    else if (status === "Custody") {
                                        item.StatusId = "IDL"; item.SubStatus = 8; item.status = status;
                                    }
                                    else if (status === "PendingCustomerDelivery") {
                                        item.StatusId = "IDL"; item.SubStatus = 5; item.status = status;
                                    }
                                    else if (status === "PendingWorkshopDelivery") {
                                        item.StatusId = "IDL"; item.SubStatus = 6; item.status = status;
                                    }
                                    else if (status === "NotReady") {
                                        item.StatusId = "IDL"; item.SubStatus = 2; item.status = status;
                                    }
                                    else if (status === "Available") {
                                        item.StatusId = "IDL"; item.SubStatus = 1; item.status = status;
                                    }
                                    else if (status === "ReadyToGo") {
                                        item.StatusId = "IDL"; item.SubStatus = 7; item.status = status;
                                    }
                                    else if (status === "Booked") {
                                        item.StatusId = "BKD"; item.SubStatus = null; item.status = status;
                                    }
                                    else if (status === "Defleeted") {
                                        item.StatusId = "DFL"; item.SubStatus = null; item.status = status;
                                    }
                                } else {
                                    item.StatusId = "IDL"; item.SubStatus = 1; item.status = "Available";
                                }

                                var fuelLevel = value['Current_Fuel_Level'];
                                if (fuelLevel) {
                                    if (value === "0/8")
                                        return 0;
                                    else if (fuelLevel === "1/8")
                                        item.fuelLevel = 0.125;
                                    else if (fuelLevel === "2/8")
                                        item.fuelLevel = 0.25;
                                    else if (fuelLevel === "3/8")
                                        item.fuelLevel = 0.375;
                                    else if (fuelLevel === "4/8")
                                        item.fuelLevel = 0.5;
                                    else if (fuelLevel === "5/8")
                                        item.fuelLevel = 0.625;
                                    else if (fuelLevel === "6/8")
                                        item.fuelLevel = 0.75;
                                    else if (fuelLevel === "7/8")
                                        item.fuelLevel = 0.875;
                                    else if (fuelLevel === "8/8")
                                        item.fuelLevel = 1;
                                } else {
                                    item.fuelLevel = 0;
                                }

                                vm.fileDataList.push(item);
                            }

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateFeilds();
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
                debugger;
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

                    prepareDataTosend();

                    sendDataInBatches();

                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            function sendDataInBatches() {
                debugger;
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
                        fieldsRecordsIndex.push(e.serialNo);
                    });
                    vm.errorRecords = fieldsRecordsIndex.join();
                    return;
                }

                vehicleAppService.importVehiclesData({ vehicles: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.vehicles, function (dataItem) {
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
                     //   vm.loading = false;
                    });

            }

            function hasDuplicateFeilds() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {

                        if (vm.fileDataList[a].plateNo === vm.fileDataList[j].plateNo) {
                            abp.message.error("Duplicate PlateNo at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
                            result = true;
                            a = j = vm.fileDataList.length;
                            break;
                        }

                        if (vm.fileDataList[a].fleetCode === vm.fileDataList[j].fleetCode) {
                            abp.message.error("Duplicate FleetCode at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
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
