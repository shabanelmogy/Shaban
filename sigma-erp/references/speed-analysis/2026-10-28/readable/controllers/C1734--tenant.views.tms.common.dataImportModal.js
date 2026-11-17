// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:475223-475424
appModule.controller('tenant.views.tms.common.dataImportModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.dataSharingMapping', 'dataType',
        function ($scope, $uibModalInstance, dataSharingMappingService, dataType) {

            var vm = this;
            vm.dataType = dataType;
            vm.loading = false;
            vm.processing = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            debugger
            vm.isEnableApplicableDate = abp.setting.get("App.DarbVehiclePlateNoMapped.EnableApplicableDate") == "True" ? true : false;
            vm.selectedFile = null;
            vm.recordCountInBatch = 500;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;
            vm.added = 0;
            vm.updated = 0;

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

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false, dateNF: 'yyyy-mm-dd' });


                        if (workbook.Strings[0].t.trim() !== "PlateNo" || workbook.Strings[1].t.trim() !== "OutputValue") {
                            abp.message.error("In-valid Excel File Template", "Error");
                            return;
                        }

                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];
                                var record = {
                                    error: '',
                                    inputValue: value['PlateNo'] ? value['PlateNo'].toString().trim() : '',
                                    outputValue: value['OutputValue'] ? value['OutputValue'].toString().trim() : ''
                                };
                                debugger;
                                if (dataType === 3) {
                                    record.applicableDate = value['ApplicableDate'] ? new Date(value['ApplicableDate'].toString().trim()) : null;
                                }

                                vm.fileDataList.push(record);
                            }

                            if (vm.fileDataList.length > 0)
                                vm.allowImport = true;

                        } else {
                            abp.message.error("Something is Wrong Or File is empty !", "Error");
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
                let patern = /([0-9]|[A-Z]|[a-z])+[" "][0-9]+/;
                let patern2 = /^[0-9]+.[A-Z].+$/;

                let isInValidData = false;

                if (dataType === 3) {
                    angular.forEach(vm.fileDataList, function (dataItem) {
                        if (patern.test(dataItem.inputValue) || patern2.test(dataItem.inputValue)) {
                            if (patern2.test(dataItem.inputValue) && !patern.test(dataItem.inputValue)) {
                                let authorityIndex = dataItem.inputValue.search("[A-Z]");
                                let regNo = dataItem.inputValue.substring(0, authorityIndex);
                                let plateCode = dataItem.inputValue.substring(authorityIndex + 1);
                                dataItem.inputValue = plateCode + " " + regNo;
                            }
                        } else {
                            isInValidData = true;
                            abp.message.error("Provided in-valid input plate no:" + dataItem.inputValue, "Error");
                            vm.loading = false;
                        }
                    });
                }

                if (isInValidData)
                    return;

                if (vm.fileDataList) {
                    sendDataInBatches();
                }
                else {
                    vm.loading = false;
                    abp.message.error("Something Wrong Or File is empty !", "Error");
                }
            };


            function sendDataInBatches() {

                vm.loading = true;

                //get records that dont saved yet
                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {


                    if (recordsToSend.length < vm.recordCountInBatch) {
                        recordsToSend.push(dataItem);
                    }
                });

                dataSharingMappingService.importPlateNoMapping({ plateNoMappings: recordsToSend, dataType: dataType })
                    .success(function (data) {
                        vm.totalRecordsCount += recordsToSend.length;
                        vm.added += data.inserted;
                        vm.updated += data.updated;
                        vm.successRecordsCount += data.inserted + data.updated;
                        vm.failRecordsCount += vm.totalRecordsCount - (vm.added + vm.updated);
                        vm.fileDataList.splice(0, vm.recordCountInBatch);

                        if (vm.fileDataList && vm.fileDataList.length)
                            sendDataInBatches();
                        else
                            vm.loading = false;

                        vm.showCount = true;
                    });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
