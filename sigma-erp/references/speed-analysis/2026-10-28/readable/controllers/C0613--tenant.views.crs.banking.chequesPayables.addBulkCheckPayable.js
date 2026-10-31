// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:164863-165149
appModule.controller('tenant.views.crs.banking.chequesPayables.addBulkCheckPayable', [
        '$scope', '$uibModalInstance', '$uibModal','abp.services.app.chequesPayables',
        function ($scope, $uibModalInstance, $uibModal,chequesPayablesService) {

            var vm = this;

            vm.pdcPayable = {};
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';



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
            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
                                var contactCode = value['Contact Code'];
                                var contactName = value['Contact Name'];

                                if (!contactCode) {
                                    abp.message.error("Contact Code feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var paymentMethod = value['Payment Method'];
                                if (!paymentMethod) {
                                    abp.message.error("Payment Method feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var chequeNo = value['Cheque No'];
                                if (!chequeNo) {
                                    abp.message.error("Cheque No feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }
                                var chequeDate = value['Cheque Date'];
                                if (!chequeDate) {
                                    abp.message.error("Cheque Date feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var batchNo = value['Batch No'];
                                if (!batchNo) {
                                    abp.message.error("Batch No feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    importStatus: 'new',
                                    serialNo: i + 1,
                                    contactCode: value['Contact Code'] ? value['Contact Code'].toString().trim() : '',
                                    contactName: value['Contact Name'] ? value['Contact Name'].toString().trim() : '',
                                    chequeDate: value['Cheque Date'] ? correctData(value['Cheque Date']) : '',
                                    paymentMethod: value['Payment Method'] ? value['Payment Method'].toString().trim() : '',
                                    chequeNo: value['Cheque No'] ? value['Cheque No'].toString().trim() : '',
                                    batchNo: value['Batch No'] ? value['Batch No'].toString().trim() : '',
                                    bank: value['Bank'] ? value['Bank'].toString().trim() : '',
                                    amount: value['Amount'] ? value['Amount'].toString().trim() : '',
                                    notes: value['Notes'] ? value['Notes'].toString().trim() : ''
                                };

                                
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
                angular.forEach(vm.fileDataList, function (dataItem) {
                    var Contact = {
                        code:  dataItem.contactCode ,
                        name: dataItem.contactName
                    };
                    var PdcPayableBillingDetailEditDto = {
                        BillingMethod: {name: dataItem.paymentMethod},
                        BankAccount: {bankName: dataItem.bank}
                      
                    };

                    dataItem.Contact = Contact;
                    dataItem.BillingDetail = PdcPayableBillingDetailEditDto;
                });
            }

            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList) {

                    //prepareDataTosend();
                    
                    sendDataInBatches();
                    vm.loading = false;

                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
                    vm.loading = false;

            };


            function sendDataInBatches() {
                vm.loading = true;
                
                // Get new records to send in this batch
                var recordsToSend = vm.fileDataList.filter(dataItem => dataItem.importStatus === 'new')
                    .slice(0, vm.recordCountInBatch);

                if (recordsToSend.length === 0) {
                    finalizeImport();
                    return; // Stop recursion
                }

                chequesPayablesService.importPdcPayableData({ pdcPayables: recordsToSend })
                    .success(function (data) {
                        if (data) {
                            data.pdcPayables.forEach(function (dataItem) {
                                let match = vm.fileDataList.find(fileDataItem => fileDataItem.serialNo === dataItem.serialNo);
                                if (match) {
                                    match.importStatus = dataItem.importStatus;
                                    match.error = dataItem.error;
                                }
                            });
                        }

                        // Call the next batch recursively only if needed
                        setTimeout(() => {
                            sendDataInBatches();
                        }, 100); // Small delay to prevent call stack overflow or freezing UI
                    })
                    .error(function () {
                        abp.message.error("An error occurred while importing data.", "Error");
                        vm.loading = false;
                    });
            }




            function finalizeImport() {
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
            }

            function hasDuplicateFeilds() {
                var result = false;
                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {

                      

                        if (vm.fileDataList[a].chequeNo === vm.fileDataList[j].chequeNo) {
                            abp.message.error("Duplicate ChequeNo at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
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
