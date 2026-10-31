// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:90364-90627
appModule.controller('tenant.views.common.importData.customers.companies.index', [
        '$scope', 'abp.services.app.company',
        function ($scope, companyAppService) {

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
                    $scope.$apply();
                    vm.refresh();
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

                                var name = value['Name'];
                                if (!name) {
                                    abp.message.error("Name feild is missing at line " + (i + 2) + ".", "Error");
                                    checkForDuplication = false;
                                    vm.fileDataList = [];
                                    break;
                                }

                                var code = value['Code'];
                                if (!code) {
                                    abp.message.error("Code feild is missing at line " + (i + 2) + ".", "Error");
                                    checkForDuplication = false;
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    status: 'new',
                                    code: value['Code'] ? value['Code'].toString().trim() : '',
                                    codePrefix: value['CodePrefix'] ? value['CodePrefix'].toString().trim() : '',
                                    codeNumeric: value['CodeNumeric'] ? value['CodeNumeric'].toString().trim() : '',
                                    companyName: value['Name'] ? value['Name'].toString().trim() : '',
                                    email: value['Email'] ? value['Email'].toString().trim() : '',
                                    contactType: value['Type'] ? value['Type'].toString().trim() : '',
                                    contactGroup: value['ContactGroup'] ? value['ContactGroup'].toString().trim() : '',
                                    contactGroup: {
                                        name: value['ContactGroup'] ? value['ContactGroup'].toString().trim() : '',
                                        
                                    },
                                    fax: value['Fax'] ? value['Fax'].toString().trim() : '',
                                    domain: value['Website'] ? value['Website'].toString().trim() : '',
                                    contactNo: value['Tel1'] ? value['Tel1'].toString().trim() : '',
                                    contactNo2: value['Tel2'] ? value['Tel2'].toString().trim() : '',
                                    tradeLicenseNo: value['TradeLicenseNo'] ? value['TradeLicenseNo'].toString().trim() : '',
                                    address: {
                                        addressLine1: value['Address'] ? value['Address'].toString().trim() : '',
                                        addressLine2: value['Address2'] ? value['Address2'].toString().trim() : '',
                                        city: value['City'] ? value['City'].toString().trim() : '',
                                        state: value['State'] ? value['State'].toString().trim() : '',
                                        zipCode: value['Zip'] ? value['Zip'].toString().trim() : '',
                                        country: value['Country'] ? value['Country'].toString().trim() : ''
                                    },

                                    identityDocuments: [],

                                    notes: value['Notes'] ? value['Notes'].toString().trim() : ''
                                };

                                vm.fileDataList.push(item);
                            }

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateCodes();
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
                vm.loading = true;

                if (vm.fileDataList) {
                    angular.forEach(vm.fileDataList, function (dataItem) {

                        var licenseNo = dataItem.tradeLicenseNo;
                        if (licenseNo) {
                            dataItem.identityDocuments.push({
                                documentNo: dataItem.tradeLicenseNo,
                                identityDocumentType: 1
                            });
                        }

                    });

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
                    if (dataItem.status === 'new' && recordsToSend.length < vm.recordCountInBatch) {
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

                companyAppService.importCompanyData({ companies: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.companies, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.code === dataItem.code) {
                                        fileDataItem.status = dataItem.status;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();
                    })
                    .finally(function (data) {
                     //   vm.loading = false;
                    });
            }

            function hasDuplicateCodes() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {
                        if (vm.fileDataList[a].code === vm.fileDataList[j].code) {
                            abp.message.error("Duplicate Code values at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
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
