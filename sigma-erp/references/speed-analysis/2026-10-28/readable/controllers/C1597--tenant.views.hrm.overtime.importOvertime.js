// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:440505-440854
appModule.controller('tenant.views.hrm.overtime.importOvertime', [
        '$scope', '$uibModalInstance', 'abp.services.app.overtime', 'utilities',

        function ($scope, $uibModalInstance, overtimeService, utilities) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.saving = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.selectedFile = null;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.hasError = false;
            vm.isSuccessFound = false;

            vm.fileDataList = [];
            vm.failRecords = [];

            vm.showCount = false;

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

            vm.cancel = function () {

                $uibModalInstance.dismiss();

            };

            vm.refresh = function () {

                vm.fileDataList = [];
                vm.failRecords = [];

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

            vm.loadFile = function (files) {

                vm.allowImport = false;
                if (!files || files.length === 0) {

                    vm.refresh();

                    return;
                }
                $scope.$apply(function () {

                    vm.selectedFile = files[0];

                    readFileData();

                });
            };

            function correctData(date) {

                if (date) {
                    return moment(date);
                }

                return null;
            }

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (!file) {
                    return;
                }
                var extension = file.name.split('.').pop().toLowerCase();

                if (
                    ['xlsx', 'xls'].indexOf(extension) === -1
                ) {

                    abp.message.error("Please select a valid Excel file.", "Invalid File");

                    return;
                }

                var reader = new FileReader();
                vm.loading = true;

                reader.onload = function (e) {

                    try {

                        var data = e.target.result;
                        var workbook = XLSX.read(
                            data,
                            {
                                type: 'binary',
                                cellDates: true,
                                cellNF: false,
                                cellText: false
                            }
                        );

                        var firstSheetName = workbook.SheetNames[0];
                        var worksheet = workbook.Sheets[firstSheetName];

                        var dataObjects =
                            XLSX.utils.sheet_to_json(
                                worksheet,
                                {
                                    raw: true,
                                    dateNF:
                                        'MM-DD-YYYY HH:mm:ss'
                                }
                            );

                        if (!dataObjects || dataObjects.length === 0) {

                            abp.message.error(
                                "Excel file is empty.",
                                "Error"
                            );

                            vm.loading = false;
                            $scope.$apply();

                            return;
                        }

                        for (var i = 0; i < dataObjects.length; i++) {

                            var value = dataObjects[i];

                            var normalHours =
                                value['NormalOTHours'] !== undefined &&
                                    value['NormalOTHours'] !== null &&
                                    value['NormalOTHours'] !== ''
                                    ? parseFloat(
                                        value['NormalOTHours']
                                    )
                                    : 0;

                            var holidayHours =
                                value['HolidayOTHours'] !== undefined &&
                                    value['HolidayOTHours'] !== null &&
                                    value['HolidayOTHours'] !== ''
                                    ? parseFloat(
                                        value['HolidayOTHours']
                                    )
                                    : 0;

                            var record = {
                                error: '',
                                importStatus: 'new',

                                employeeCode: value['Employee_Code'] ? value['Employee_Code'].toString().trim() : '',

                                name: value['Name'] ? value['Name'].toString().trim() : '',
                                designation: '',
                                staffId: null,
                                date: value['Date'] ? correctData(value['Date']) : null,
                                normalOTHours: normalHours,
                                holidayOTHours: holidayHours,
                                totalHours: normalHours + holidayHours,
                                isImported: true
                            };

                            vm.fileDataList.push(record);
                        }


                        if (vm.fileDataList.length > 0) {

                            vm.allowImport = true;
                        }
                        else {
                            abp.message.error("No overtime records found.", "Error");
                        }

                    }
                    catch (ex) {

                        abp.message.error("Unable to read Excel file.", "Error");
                    }

                    vm.loading = false;
                    $scope.$apply();

                };


                reader.onerror = function () {

                    vm.loading = false;

                    abp.message.error("Unable to read the selected file.", "Error");
                    $scope.$apply();

                };

                reader.readAsBinaryString(file);
            }

            vm.importData = function () {

                if (!vm.fileDataList || vm.fileDataList.length === 0) {

                    abp.message.error("No overtime records found.", "Error");
                    return;
                }

                vm.allowImport = false;
                vm.loading = true;
                vm.saving = true;
                vm.hasError = false;
                sendDataToServer();

            };

            function sendDataToServer() {

                overtimeService.importOvertimes({
                    overtimes: vm.fileDataList
                })
                    .success(function (data) {

                        if (!data || !data.overtimes) {

                            abp.message.error("No response received from server.", "Error");

                            return;
                        }

                        vm.fileDataList = data.overtimes;

                        vm.totalRecordsCount = vm.fileDataList.length;

                        vm.successRecordsCount = vm.fileDataList.filter(function (x) {

                            return x.importStatus === 'success';

                        }).length;

                        vm.failRecordsCount = vm.fileDataList.filter(function (x) {

                            return x.importStatus === 'fail';

                        }).length;


                        vm.failRecords = vm.fileDataList.filter(function (x) {

                            return x.importStatus === 'fail';

                        });

                        vm.hasError = vm.failRecordsCount > 0;
                        vm.isSuccessFound = vm.successRecordsCount > 0;
                        vm.showCount = true;

                        if (vm.hasError) {

                            var errorIndexes = [];
                            vm.failRecords.forEach(
                                function (record) {

                                    var index = vm.fileDataList.indexOf(record) + 1;
                                    errorIndexes.push(index);
                                }
                            );

                            vm.errorRecords = errorIndexes.join(',');
                            return;
                        }

                        var successfulRecords =
                            vm.fileDataList.filter(
                                function (x) {

                                    return x.importStatus ===
                                        'success';

                                }
                            );


                        if (successfulRecords.length > 0) {

                            $uibModalInstance.close(successfulRecords);
                        }

                    })
                    .error(function () {

                        abp.message.error(
                            "An error occurred while importing overtime data.",
                            "Import Failed"
                        );

                        vm.allowImport = true;

                    })
                    .finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });

            }

            vm.resolveBoolValue = function (value) {

                return value === 0 ? 'NO' : 'YES';
            };

        }
    ]);
