// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:222625-222820
appModule.controller('tenant.views.crs.fines.importTrafficFines', [
        '$scope', 'abp.services.app.trafficFine',
        function ($scope, trafficFineAppService) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

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
                    return moment(date).utc().local().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            
            function correctData(date) {
                if (date) {
                    return moment(date).add(1, 'minutes');
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

                                var record = {
                                    error: '',
                                    importStatus: 'new',

                                    fineNo: value['Fine No'] ? value['Fine No'].toString().trim() : '',
                                    fineDateTime: value['Fine Date And Time'] ? correctData(value['Fine Date And Time']) : '',
                                    plateNo: value['Vehicle'] ? value['Vehicle'].toString().trim() : '',
                                    amount: value['Amount'] ? value['Amount'] : '',
                                    fineDescription: value['Description'] ? value['Description'].toString().trim() : '',
                                };
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

                trafficFineAppService.importTrafficFines({ finesDataList: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.finesDataList, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.fineNo === dataItem.fineNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }
                        vm.loading = false;
                        //sendDataInBatches();

                    }).finally(function (data) {
                        vm.loading = false;
                    });

            }

            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
