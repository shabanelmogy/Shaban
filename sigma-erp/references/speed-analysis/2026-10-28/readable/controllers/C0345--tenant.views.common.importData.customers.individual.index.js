// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:90631-90951
appModule.controller('tenant.views.common.importData.customers.individual.index', [
        '$scope', 'abp.services.app.person',
        function ($scope, personAppService) {

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
                    vm.refresh();
                    $scope.$apply();
                }
            };

            vm.refresh = function () {
                vm.fileDataList = [];
                angular.element('#dataFile').val(null);
                vm.selectedFile = null;

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
                                    vm.fileDataList = [];
                                    break;
                                }

                                var item = {
                                    error: '',
                                    status: 'new',
                                    notes: value['Notes'] ? value['Notes'].toString().trim() : '',
                                    code: value['Code'] ? value['Code'].toString().trim() : '',
                                    codePrefix: value['CodePrefix'] ? value['CodePrefix'].toString().trim() : '',
                                    codeNumeric: value['CodeNumeric'] ? value['CodeNumeric'].toString().trim() : '',
                                    name: value['Name'].toString().trim(),
                                    gender: value['Gender'] ? value['Gender'].toString().trim() : '',
                                    contactGroup: value['ContactGroup'] ? value['ContactGroup'].toString().trim() : '',
                                    contactGroup: {
                                        name: value['ContactGroup'] ? value['ContactGroup'].toString().trim() : '',

                                    },
                                    email: value['Email'] ? value['Email'].toString().trim() : '',
                                    dateOfBirth: value['DateOfBirth'] ? correctData(value['DateOfBirth']) : '',
                                    fax: value['Fax'] ? value['Fax'].toString().trim() : '',
                                    domain: value['Website'] ? value['Website'].toString().trim() : '',
                                    tradeLicenseNo: value['TradeLicenseNo'] ? value['TradeLicenseNo'].toString().trim() : '',
                                    mobileNo: value['Mobile'] ? value['Mobile'].toString().trim() : '',
                                    contactNo: value['PhoneHome'] ? value['PhoneHome'].toString().trim() : '',
                                    contactNo2: value['PhoneWork'] ? value['PhoneWork'].toString().trim() : '',

                                    address: {
                                        addressLine1: value['Address'] ? value['Address'].toString().trim() : '',
                                        city: value['City'] ? value['City'].toString().trim() : '',
                                        state: value['State'] ? value['State'].toString().trim() : '',
                                        zipCode: value['Zip'] ? value['Zip'].toString().toString().trim() : '',
                                        country: value['Country'] ? value['Country'].toString().trim() : ''
                                    },

                                    nationality: value['Nationality'] ? value['Nationality'].toString().trim() : '',

                                    licenseNo: value['LicenseNo'] ? value['LicenseNo'].toString().trim() : '',
                                    licenseIssuedBy: value['LicenseIssuedBy'] ? value['LicenseIssuedBy'].toString().trim() : '',
                                    licenseIssueDate: value['LicenseIssueDate'] ? correctData(value['LicenseIssueDate']) : '',
                                    licenseExpiryDate: value['LicenseExpiryDate'] ? correctData(value['LicenseExpiryDate']) : '',

                                    passportNo: value['PassportNo'] ? value['PassportNo'].toString().trim() : '',
                                    passportIssuedBy: value['PassportIssuedBy'] ? value['PassportIssuedBy'].toString().trim() : '',
                                    passportIssueDate: value['PassportIssueDate'] ? correctData(value['PassportIssueDate']) : '',
                                    passportExpiryDate: value['PassportExpiryDate'] ? correctData(value['PassportExpiryDate']) : '',

                                    nationalIDNo: value['NationalIDNo'] ? value['NationalIDNo'].toString().trim() : '',
                                    nationalIDIssuedBy: value['NationalIDIssuedBy'] ? value['NationalIDIssuedBy'].toString().trim() : '',
                                    nationalIDIssueDate: value['NationalIDIssueDate'] ? correctData(value['NationalIDIssueDate']) : '',
                                    nationalIDExpiryDate: value['NationalIDExpiryDate'] ? correctData(value['NationalIDExpiryDate']) : '',

                                    identityDocuments: []

                                };

                                vm.fileDataList.push(item);

                                if (checkForDuplication && vm.fileDataList.length > 0) {
                                    vm.allowImport = !hasDuplicateCodes();
                                }
                            }
                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        console.log(ex);
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };

                    reader.readAsBinaryString(file);

                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                }

            }

            vm.importData = function () {

                if (vm.fileDataList) {

                    vm.allowImport = false;
                    vm.loading = true;

                    prepareDataTosend();
                    sendDataInBatches();

                }
                else
                    abp.message.error("Something Wrong Or File is empty !", "Error");
            };

            function prepareDataTosend() {

                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.name.indexOf(' ') >= 0) {
                        dataItem.firstName = dataItem.name.substring(0, dataItem.name.indexOf(' ')).toString().trim();
                        dataItem.lastName = dataItem.name.substring(dataItem.name.indexOf(' ') + 1, dataItem.name.length).toString().trim();
                    } else {
                        dataItem.firstName = dataItem.name.toString().trim();
                    }

                    var licenseNo = dataItem.licenseNo;
                    if (licenseNo) {
                        dataItem.identityDocuments.push({
                            documentNo: dataItem.licenseNo,
                            issuedBy: dataItem.licenseIssuedBy,
                            issueDate: dataItem.licenseIssueDate,
                            expiryDate: dataItem.licenseExpiryDate,
                            identityDocumentType: 4
                        });
                    }

                    var PassportNo = dataItem.passportNo;
                    if (PassportNo) {
                        dataItem.identityDocuments.push({
                            documentNo: dataItem.passportNo,
                            issuedBy: dataItem.passportIssuedBy,
                            issueDate: dataItem.passportIssueDate,
                            expiryDate: dataItem.passportExpiryDate,
                            identityDocumentType: 2
                        });
                    }

                    var nationalIDNo = dataItem.nationalIDNo;
                    if (nationalIDNo) {
                        dataItem.identityDocuments.push({
                            documentNo: dataItem.nationalIDNo,
                            issuedBy: dataItem.nationalIDIssuedBy,
                            issueDate: dataItem.nationalIDIssueDate,
                            expiryDate: dataItem.nationalIDExpiryDate,
                            identityDocumentType: 3
                        });
                    }

                    var tradeLicenseNo = dataItem.tradeLicenseNo;
                    if (tradeLicenseNo) {
                        dataItem.identityDocuments.push({
                            documentNo: dataItem.tradeLicenseNo,
                            identityDocumentType: 1
                        });
                    }
                });
            }

            function sendDataInBatches() {

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

                personAppService.importIndividualsData({ people: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.people, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {

                                    if (fileDataItem.code === dataItem.code) {
                                        fileDataItem.status = dataItem.status;
                                        fileDataItem.error = dataItem.error;
                                    }
                                });
                            });
                        }

                        sendDataInBatches();
                    }).finally(function (data) {
                      //  vm.loading = false;
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
