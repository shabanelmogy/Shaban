// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:93997-94255
appModule.controller('tenant.views.common.dataMaintenance.index', [
        '$scope', 'abp.services.app.job', 'FileUploader',

        function ($scope, jobService, fileUploader) {

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


            //$scope.loadFile = function (files) {
            //    vm.allowImport = false;

            //    if (files.length > 0) {
            //        $scope.$apply(function () {
            //            vm.selectedFile = files[0];
            //            readFileData();
            //        });
            //    } else {
            //        vm.refresh();
            //        $scope.$apply();
            //    }
            //};
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

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                vm.jobs = [];
                if (response && response.result) {
                    var fileName = response.result.fileName;

                    vm.loading = true;
                    vm.importing = false;

                    jobService.jobExpenseJVImport(fileName)
                        .success(function (result) {
                            vm.fileDataList = result;
                        })
                        .finally(function () {
                            vm.loading = false;

                            if (vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateInvalidRows();
                            }
                        });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };


            //function readFileData() {
            //    vm.fileDataList = [];
            //    var file = vm.selectedFile;

            //    if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {
            //        var reader = new FileReader();
            //        vm.loading = true;

            //        reader.onload = function (e) {
            //            var data = e.target.result;
            //            var workbook = XLSX.read(data, {
            //                type: 'binary',
            //                cellDates: true,
            //                cellNF: false,
            //                cellText: false
            //            });

            //            var firstSheetName = workbook.SheetNames[0];
            //            var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
            //                raw: true,
            //                dateNF: 'MM-DD-YYYY HH:mm:ss'
            //            });

            //            if (dataObjects.length > 0) {

            //                for (var i = 0; i < dataObjects.length; i++) {
            //                    var value = dataObjects[i];

            //                    var item = {
            //                        serialNo: i + 1,
            //                        importStatus: 'new',
            //                        detail: '',
            //                        error: '',
            //                        jobNo: value['JobNo'] ? value['JobNo'].toString().trim() : '',

            //                    };

            //                    vm.fileDataList.push(item);
            //                }

            //                if (vm.fileDataList.length > 0) {
            //                    vm.allowImport = !hasDuplicateInvalidRows();
            //                }

            //            }
            //            else {
            //                abp.message.error("Something wrong or file is empty!", "Error");
            //            }

            //            vm.loading = false;
            //            $scope.$apply();
            //        };

            //        reader.onerror = function (ex) {
            //            vm.loading = false;
            //            abp.message.warn(app.localize(ex), 'Unknown File');
            //        };

            //        reader.readAsBinaryString(file);
            //    } else {
            //        abp.message.error("Please select a valid Excel file!", "Unknown File");
            //        vm.loading = false;
            //    }
            //}

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
                    if (dataItem.importStatus == 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        recordsToSend.push(dataItem);
                    }
                });

                if (recordsToSend.length < 1) {
                    vm.loading = false;

                    vm.showCount = true;
                    vm.totalRecordsCount = vm.fileDataList.length;
                    vm.successRecordsCount = vm.fileDataList.filter(e => e.importStatus === "Success").length;
                    vm.failRecordsCount = vm.fileDataList.filter(e => e.importStatus === "Fail").length;
                    vm.failRecords = vm.fileDataList.filter(e => e.importStatus === "Fail");

                    var failedRecordsIndex = [];
                    vm.failRecords.forEach(function (e) {
                        failedRecordsIndex.push(e.serialNo);
                    });
                    vm.errorRecords = failedRecordsIndex.join();
                    return;
                }

                jobService.jobExpenseJVCorrection(recordsToSend)
                    .success(function (data) {
                        if (data) {
                            angular.forEach(data, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.serialNo === dataItem.serialNo) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;
                                        fileDataItem.remarks = dataItem.remarks;
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
                var seen = {};

                for (var i = 0; i < vm.fileDataList.length; i++) {
                    var row = vm.fileDataList[i];

                    if (!row.jobNo) {
                        abp.message.error("JobNo is missing at record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    if (!row.jobId) {
                        abp.message.error("Job not found for record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    if (seen[row.jobNo]) {
                        abp.message.error("Duplicate JobNo found at record " + row.serialNo + ".", "Error");
                        return true;
                    }

                    seen[row.jobNo] = true;
                }

                return false;
            }
        }
    ]);
