// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:90955-91261
appModule.controller('tenant.views.common.importData.darbTolls.index', [
        '$scope', 'abp.services.app.toll',
        function ($scope, tollAppService) {
            var vm = this;

            vm.loading = false;
            vm.processing = false;
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

                                var tripDateTime = value['Trip Date Time'];
                                if (!tripDateTime) {
                                    abp.message.error("'Trip Date' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                else {
                                    let rgexp = new RegExp("^(3[01]|[12][0-9]|0[1-9])/(1[0-2]|0[1-9])/[0-9]{4} (2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
                                    if (!rgexp.test(tripDateTime.toString())) {
                                        abp.message.error("Trip Date Time's value invalid at record " + (i + 1) + ".", "Error");
                                        vm.fileDataList = [];
                                        break;
                                    }
                                }

                                var transactionPostDate = value['Transaction Post Date'];
                                if (!transactionPostDate) {
                                    abp.message.error("'Transaction Post Date' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                else {
                                    let rgexp = new RegExp("^(3[01]|[12][0-9]|0[1-9])/(1[0-2]|0[1-9])/[0-9]{4} (2[0-3]|[01]?[0-9]):([0-5]?[0-9])$");
                                    if (!rgexp.test(transactionPostDate.toString())) {
                                        abp.message.error("Transaction Post Date's value invalid at record " + (i + 1) + ".", "Error");
                                        vm.fileDataList = [];
                                        break;
                                    }
                                }

                                var location = value['Location'];
                                if (!location) {
                                    abp.message.error("'Location' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var direction = value['Direction'];
                                if (!direction) {
                                    abp.message.error("'Direction' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var amount = value['Amount'];
                                if (!amount) {
                                    abp.message.error("'Amount' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                else {
                                    if (isNaN(amount)) {
                                        abp.message.error("Amount's value invalid at record " + (i + 1) + ".", "Error");
                                        vm.fileDataList = [];
                                        break;
                                    }
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

                                //var salikAccount = value['Salik Account'];
                                //if (!salikAccount) {
                                //    abp.message.error("'Salik Account' feild is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}

                                var contractNo = value['Contract No'];
                                if (!contractNo) {
                                    abp.message.error("'Contract No' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var staffItem = {
                                    error: '',
                                    status: 'new',
                                    serialNo: i + 1,
                                    tripDateTime: value['Trip Date Time'] ? correctDateTime(value['Trip Date Time']) : '',
                                    transactionPostDate: value['Transaction Post Date'] ? correctDate(value['Transaction Post Date']) : '',
                                    tollGateLocationEn: value['Location'] ? value['Location'].toString().trim() : '',
                                    tollGateDirectionEn: value['Direction'] ? value['Direction'].toString().trim() : '',
                                    amount: value['Amount'] ? value['Amount'].toString().trim() : '',
                                    plateNo: value['Plate No'] ? value['Plate No'].toString().trim() : '',
                                    salikAccount: value['Salik Account'] ? value['Salik Account'].toString().trim() : '',
                                    contractNo: value['Contract No'] ? value['Contract No'].toString().trim() : ''
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


            function correctDateTime(date) {
                if (date) {
                    var dateMomentObject = moment(date, "DD/MM/YYYY HH:mm"); // 1st argument - string, 2nd argument - format
                    var dateObject = dateMomentObject.add('hour', 4).toDate(); // convert moment.js object to Date object

                    return dateObject;
                } else {

                }
            }

            function correctDate(date) {
                if (date) {
                    var dateMomentObject = moment(date, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
                    var dateObject = dateMomentObject.add('hour', 4).toDate(); // convert moment.js object to Date object

                    return dateObject;
                }
                else {
                    return "";
                }
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getLocalDate = function (date) {
                if (date) {
                    return moment(date).utc().local().add('hour', -4).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getLocalDateTime = function (date) {
                if (date) {
                    return moment(date).utc().local().add('hour', -4).format(vm.dateTimeFormat);
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

                tollAppService.importDarbTolls({ darbTollsDataList: recordsToSend })
                    .success(function (data) {
                        debugger;

                        if (data) {
                            angular.forEach(data.darbTollsDataList, function (dataItem) {
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
