// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:472701-472875
appModule.controller('tenant.views.tfms.fineReceipts.importFineEmailDetailModal', [
        '$scope', 'utilities', '$uibModalInstance', 'abp.services.app.fineReceipts',
        function ($scope, utilities, $uibModalInstance, fineReceiptsService) {

            var vm = this;

            vm.loading = false;
            vm.processing = false;
            vm.selectedFile = null;
            vm.recordCountInBatch = 20;
            vm.allowImport = false;
            vm.totalRecordsCount = 0;
            vm.successRecordsCount = 0;
            vm.failRecordsCount = 0;

            const fileColumns = {
                plate: 'PLATE',
                emailCC: "EMAIL CC",
                emailTo: "EMAIL TO",
                accountToCharge: "ACCOUNT TO CHARGE"
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

                            for (let i = 0; i < dataObjects.length; i++) {
                                let value = dataObjects[i];

                                let plate = value[fileColumns.plate];
                                if (!plate) {
                                    abp.message.error("'Fine No' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                let emailCC = value[fileColumns.emailCC];
                                if (!emailCC) {
                                    abp.message.error("'Fine Email CC' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                let emailTo = value[fileColumns.emailTo];
                                if (!emailTo) {
                                    abp.message.error("'Fine Email To' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                let accountToCharge = value[fileColumns.accountToCharge];
                                if (!accountToCharge) {
                                    abp.message.error("'Fine Account To Charge' feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                let staffItem = {
                                    error: '',
                                    status: 'new',
                                    serialNo: i + 1,
                                    plateNo: plate,
                                    emailCC: emailCC,
                                    emailTo: emailTo,
                                    accountToCharge: accountToCharge
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

            vm.importData = function () {

                vm.allowImport = false;

                if (vm.fileDataList) {
                    vm.loading = true;
                    vm.saving = true;

                    fineReceiptsService.importFineEmailDetailsAsync(vm.fileDataList)
                        .success(function (data) {
                            if (data) {
                                angular.forEach(data, function (dataItem) {
                                    angular.forEach(vm.fileDataList, function (fileDataItem) {
                                        if (fileDataItem.serialNo === dataItem.serialNo) {
                                            fileDataItem.status = dataItem.status;
                                            fileDataItem.error = dataItem.error;
                                        }
                                    });
                                });
                            }
                        }).finally(function (data) {
                            vm.loading = false;
                            vm.saving = false;
                        });
                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };
        }
    ]);
