// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:96111-96424
appModule.controller('tenant.views.common.hrm.deduction.importDeductions', [
        '$scope', 'abp.services.app.directory', 'abp.services.app.deduction', 'utilities', '$uibModalInstance',
        function ($scope, directoryService, deductionService, utilities, $uibModalInstance) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.recordCountInBatch = 1000;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;

            vm.hasError = false;
            vm.isSuccessFound = false;

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
                vm.hasError = false;
                vm.isSuccessFound = false;
            };


            vm.getlocalDate = function (date) {
                if (date) {
                    let localDate = moment.utc(date); // First, treat it as UTC

                    localDate.add(12, 'seconds');
                    localDate.local();

                    return localDate.format(vm.dateFormat);
                } else {
                    return "";
                }
            };



            //vm.getlocalDate = function (date) {
            //    console.log(date);
            //    if (date) {
            //        return moment(date).utc().local().format(vm.dateFormat);
            //    }
            //    else {
            //        return "";
            //    }
            //};

            function correctData(date) {
                if (date) {
                    return moment(date).add(12, 'seconds');
                }
                else {
                    return "";
                }
            }

            vm.getTypeOfDeduction = function (type) {
                type = parseInt(type);
                if (type === 1) return app.localize("AdvanceDeduction");
                if (type === 2) return app.localize("LoanDeduction");
                if (type === 3) return app.localize("FinesDeduction");
                if (type === 4) return app.localize("ExtraDeduction");
                return "";
            };

            vm.importFromExcelSample = function () {
                vm.loading = true;


                agreementAppService.openAgreementSampleFile()
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;
                    vm.saving = true;
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

                                    employeeCode: value['Employee_Code'] ? value['Employee_Code'].toString().trim() : '',
                                    name: value['Name'] ? value['Name'].toString().trim() : '',
                                    date: value['Date'] ? correctData(value['Date']) : null,
                                    type: value['Type'] ? value['Type'].toString().trim() : '',
                                    amount: value['Amount'] ? parseFloat(value['Amount']) : 0,
                                    remarks: value['Remarks'] ? value['Remarks'].toString().trim() : ''
                                    //salaryItemId: value['Salary_Item_Id'] ? parseInt(value['Salary_Item_Id']) : ''

                                };

                                vm.fileDataList.push(record);
                            }

                            if (vm.fileDataList.length > 0)
                                vm.allowImport = true;

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        vm.saving = false;
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
                    vm.saving = false;
                }

            }

            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;
                vm.saving = true;

                if (vm.fileDataList) {
                    sendDataInBatches();
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };


            function sendDataInBatches() {
                vm.saving = true;
                vm.loading = true;

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

                deductionService.importDeductions({ deductions: recordsToSend })
                    .success(function (data) {

                        if (data) {

                            angular.forEach(data.deductions, function (dataItem) {
                                if (dataItem.error) {
                                    vm.hasError = true;
                                }

                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.employeeCode === dataItem.employeeCode) {
                                        fileDataItem.importStatus = dataItem.importStatus;
                                        fileDataItem.error = dataItem.error;

                                        if (fileDataItem.importStatus === 'success') {
                                            vm.isSuccessFound = true;
                                        }

                                    }
                                });
                            });

                            if (vm.hasError) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.importStatus === 'success') {
                                        fileDataItem.importStatus = 'new';
                                    }
                                });
                            }

                        }

                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
            }


            //function sendDataInBatches() {

            //    vm.loading = true;

            //    //get records that dont saved yet
            //    var recordsToSend = [];
            //    angular.forEach(vm.fileDataList, function (dataItem) {
            //        if (dataItem.importStatus === 'new' && recordsToSend.length < vm.recordCountInBatch) {
            //            recordsToSend.push(dataItem);
            //        }
            //    });

            //    //return condition
            //    if (recordsToSend.length < 1) {
            //        vm.loading = false;
            //        vm.showCount = true;
            //        vm.totalRecordsCount = vm.fileDataList.length;
            //        vm.successRecordsCount = vm.fileDataList.filter(e => e.status == "success").length;
            //        vm.failRecordsCount = vm.fileDataList.filter(e => e.status == "fail").length;
            //        vm.failRecords = vm.fileDataList.filter(e => e.status == "fail");

            //        var fieldsRecordsIndex = [];
            //        vm.failRecords.forEach(e => {
            //            fieldsRecordsIndex.push(vm.failRecords.indexOf(e) + 1);
            //        });
            //        vm.errorRecords = fieldsRecordsIndex.join();
            //        return;
            //    }

            //    deductionService.importDeductions({ deductions: recordsToSend })
            //        .success(function (data) {

            //            if (data) {
            //                angular.forEach(data.deductions, function (dataItem) {
            //                    angular.forEach(vm.fileDataList, function (fileDataItem) {
            //                        if (fileDataItem.employeeCode === dataItem.employeeCode) {
            //                            fileDataItem.importStatus = dataItem.importStatus;
            //                            fileDataItem.error = dataItem.error;
            //                        }
            //                    });
            //                });
            //            }
            //            vm.loading = false;
            //            //sendDataInBatches();

            //        }).finally(function (data) {
            //            vm.loading = false;
            //        });

            //}

            vm.resolveBoolValue = function (value) {
                return value === 0 ? 'NO' : 'YES';
            };
        }
    ]);
