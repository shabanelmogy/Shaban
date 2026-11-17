// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:91264-91568
appModule.controller('tenant.views.common.importData.fines.index', [
        '$scope', 'abp.services.app.uaeFine',
        function ($scope, fineAppService) {
            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.selectedFile = null;
            vm.recordCountInBatch = 20;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;

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

                                var fineNo = value['Fine No'];
                                if (!fineNo) {
                                    abp.message.error("'Fine No' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var authority = value['Authority'];
                                if (!authority) {
                                    abp.message.error("'Authority' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var discountRate = value['Discount Rate'];
                                if (discountRate && isNaN(discountRate)) {
                                    abp.message.error("Discount Rate's value invalid at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var orignalAmount = value['Orignal Amount'];
                                if (orignalAmount && isNaN(orignalAmount)) {
                                    abp.message.error("Orignal Amount's value invalid at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var amount = value['Amount'];
                                if (amount && isNaN(amount)) {
                                    abp.message.error("Amount's value invalid at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                
                                var plateNo = value['Plate No'];
                                if (!plateNo) {
                                    abp.message.error("'Plate No' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                //else {
                                //    let rgexp = new RegExp("^\s*([0-9a-zA-Z]*)-([0-9a-zA-Z]*)\s*$");;
                                //    if (!rgexp.test(plateNo.toString().trim())) {
                                //        abp.message.error("Plate No's value invalid at record " + (i + 1) + ".", "Error");
                                //        vm.fileDataList = [];
                                //        break;
                                //    }
                                //}

                                var plateSource = value['Plate Source'];
                                if (!plateSource) {
                                    abp.message.error("'Plate Source' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                //var plateType = value['Plate Type'];
                                //if (!plateType) {
                                //    abp.message.error("'Plate Type' feild is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var blackPoints = value['Black Points'];
                                if (blackPoints && isNaN(blackPoints)) {
                                    abp.message.error("Black Points's value invalid at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                //var trafficFileId = value['Traffic File Id'];
                                //if (!trafficFileId) {
                                //    abp.message.error("'Traffic File Id' feild is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                //var contractNo = value['Contract No'];
                                //if (!contractNo) {
                                //    abp.message.error("'Contract No' feild is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var fineDateTime = value['Fine Date Time'];
                                if (!fineDateTime) {
                                    abp.message.error("'Fine Date Time' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                else {
                                    let rgexp = new RegExp("^(3[01]|[12][0-9]|0[1-9])/(1[0-2]|0[1-9])/[0-9]{4} (2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
                                    if (!rgexp.test(fineDateTime.toString())) {
                                        abp.message.error("Fine Date Time's value invalid at record " + (i + 1) + ".", "Error");
                                        vm.fileDataList = [];
                                        break;
                                    }
                                }
                                

                                var staffItem = {
                                    error: '',
                                    status: 'new',
                                    serialNo: i + 1,
                                    fineNo: value['Fine No'] ? value['Fine No'] : '',
                                    authority: value['Authority'] ? value['Authority'] : '',
                                    discountRate: value['Discount Rate'] ? value['Discount Rate'] : 0,
                                    originalAmount: value['Orignal Amount'] ? value['Orignal Amount'] : 0,
                                    amount: value['Amount'] ? value['Amount'] : 0,
                                    plateNo: value['Plate No'] ? value['Plate No'] : '',
                                    plateSource: value['Plate Source'] ? value['Plate Source'] : '',
                                    plateType: value['Plate Type'] ? value['Plate Type'] : '',
                                    fineDescription: value['Description'] ? value['Description'] : '',
                                    location: value['Location'] ? value['Location'] : '',
                                    blackPoints: value['Black Points'] ? value['Black Points'] : 0,
                                    trafficFile: value['Traffic File Id'] ? value['Traffic File Id'] : null,
                                    contractNo: value['Contract No'] ? value['Contract No'] : '',
                                    fineDateTime: value['Fine Date Time'] ? correctDateTime(value['Fine Date Time']) : '',
                                };

                                vm.fileDataList.push(staffItem);
                            }

                            if (vm.fileDataList.length > 0) {
                                vm.allowImport = true;
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

            function correctDateTime(date) {
                if (date) {
                    var dateMomentObject = moment(date, "DD/MM/YYYY HH:mm"); // 1st argument - string, 2nd argument - format
                    var dateObject = dateMomentObject.toDate(); // convert moment.js object to Date object

                    return dateObject;
                } else {

                }
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getLocalDateTime = function (date) {
                if (date) {
                    return moment(date).utc().local().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

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
                    if (dataItem.status == "new" && recordsToSend.length < vm.recordCountInBatch) {
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

                fineAppService.importFines({ finesDataList: recordsToSend })
                    .success(function (data) {
                        debugger;

                        if (data) {
                            angular.forEach(data.finesDataList, function (dataItem) {
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
