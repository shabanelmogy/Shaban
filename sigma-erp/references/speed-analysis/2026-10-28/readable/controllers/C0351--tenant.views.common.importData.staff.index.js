// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:92422-92724
appModule.controller('tenant.views.common.importData.staff.index', [
        '$scope', 'abp.services.app.staff',
        function ($scope, staffAppService) {

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
                                    abp.message.error("Name feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var code = value['Code'];
                                if (!code) {
                                    abp.message.error("Code feild is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var staffItem = {
                                    error: '',
                                    status: 'new',
                                    serialNo: i + 1,
                                    name: value['Name'] ? value['Name'].toString().trim() : '',
                                    code: value['Code'] ? value['Code'].toString().trim() : '',
                                    codePrefix: value['CodePrefix'] ? value['CodePrefix'].toString().trim() : '',
                                    codeNumeric: value['CodeNumeric'] ? value['CodeNumeric'].toString().trim() : '',
                                    dateOfBirth: value['DateOfBirth'] ? correctData(value['DateOfBirth']) : '',
                                    mobileNo: value['Mobile'] ? value['Mobile'].toString().trim() : '',
                                    contactNo: value['PhoneHome'] ? value['PhoneHome'].toString().trim() : '',
                                    contactNo2: value['PhoneWork'] ? value['PhoneWork'].toString().trim() : '',
                                    email: value['Email'] ? value['Email'].toString().trim() : '',
                                    nationality: value['Nationality'] ? value['Nationality'].toString().trim() : '',
                                    notes: value['Notes'] ? value['Notes'].toString().trim() : '',
                                    designationName: value['Designation'] ? value['Designation'].toString().trim() : '',

                                    address: {
                                        addressLine1: value['Address'] ? value['Address'].toString().trim() : '',
                                        city: value['City'] ? value['City'].toString().trim() : '',
                                        state: value['State'] ? value['State'].toString().trim() : '',
                                        zipCode: value['Zip'] ? value['Zip'].toString().trim() : '',
                                        country: value['Country'] ? value['Country'].toString().trim() : ''
                                    },

                                    identityDocuments: [],

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
                                    nationalIDExpiryDate: value['NationalIDExpiryDate'] ? correctData(value['NationalIDExpiryDate']) : ''

                                };

                                vm.fileDataList.push(staffItem);
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

                    dataItem.firstName = dataItem.name.substring(0, dataItem.name.indexOf(' ')).toString().trim();
                    dataItem.lastName = dataItem.name.substring(dataItem.name.indexOf(' ') + 1, dataItem.name.length).toString().trim();

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
                });
            }

            vm.importData = function () {

                vm.allowImport = false;
                vm.loading = true;

                if (vm.fileDataList) {

                    prepareDataTosend();

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

                staffAppService.importStaffData({ staffDataList: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.staffDataList, function (dataItem) {
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

            function hasDuplicateFeilds() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {
                        if (vm.fileDataList[a].code === vm.fileDataList[j].code) {
                            abp.message.error("Duplicate Codes at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
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
