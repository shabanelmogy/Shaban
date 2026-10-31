// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:185770-186041
appModule.controller('tenant.views.crs.coupons.couponsImport', [
        '$scope', '$uibModalInstance', 'abp.services.app.coupon', 'abp.services.app.luckyDraw',
        function ($scope, $uibModalInstance, couponAppService, luckyDrawAppService) {

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
                vm.luckyDrawId = null;
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
            vm.getDateLuckyDraw = function (row) {
                if (!row.startDate)
                    return "";
                else
                    return '(' + vm.getlocalDate(row.startDate) + " - " + vm.getlocalDate(row.endDate) + ')';
            };
            function correctData(date) {
                if (date) {
                    return moment(date, ["DD/MM/YYYY h:mm A"]);
                }
                else {
                    return "";
                }
            }

            vm.cancel = function () {
                $uibModalInstance.close();
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
                        console.log(dataObjects);
                        if (dataObjects.length > 0) {

                            var checkForDuplication = true;

                            for (var i = 0; i < dataObjects.length; i++) {
                                var value = dataObjects[i];

                                var orderId = value['Order ID'];
                                if (!orderId) {
                                    abp.message.error("Order Id feild is missing at line " + (i + 2) + ".", "Error");
                                    checkForDuplication = false;
                                    vm.fileDataList = [];
                                    break;
                                }

                                var orderReference = value['Order Reference'];
                                if (!orderReference) {
                                    abp.message.error("Order Reference feild is missing at line " + (i + 2) + ".", "Error");
                                    checkForDuplication = false;
                                    vm.fileDataList = [];
                                    break;
                                }
                                var dateTimeNow = moment();

                                var item = {
                                    error: '',
                                    status: 'new',
                                    type: 1,
                                    luckyDrawId: vm.luckyDrawId,
                                    refId: value['Order ID'],
                                    refNo: value['Order Reference'],
                                    amount: value['Order Value'],
                                    couponDate: value['Created Date'] ? correctData(value['Created Date'].toString().trim()) : '',
                                    customerName: value['Customer Name'],
                                    customerMobile: value['Customer Mobile'],
                                    customerEmail: value['Customer Email'],
                                    couponVoucher: {
                                        date: dateTimeNow,
                                        billingDetail: {
                                            creditCard: {
                                                cardNoLastDigits: value['Card Number'] ? value['Card Number'].substr(value['Card Number'].length - 4) : '',
                                                transactionNo: value['Payment ID'] ? value['Payment ID'].toString().trim() : '',
                                                expiryDate: dateTimeNow
                                            }
                                        }
                                    }
                                };

                                vm.fileDataList.push(item);
                            }
                            console.log(vm.fileDataList);

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateCodes();
                            }
                            if (!vm.luckyDrawId)
                                vm.allowImport = false;
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
            vm.luckyDrawChange = function () {
                if (!vm.luckyDrawId)
                    vm.allowImport = false;
                else
                    vm.allowImport = true;
            }
            vm.importData = function () {
                vm.allowImport = false;
                vm.loading = true;

                if (!vm.fileDataList || vm.fileDataList.length == 0) {
                    abp.message.error("Something Wrong Or File is empty !", "Error");
                    return;
                }
                sendDataInBatches();
            };

            function sendDataInBatches() {
                vm.loading = true;

                //get records that dont saved yet
                var recordsToSend = [];
                angular.forEach(vm.fileDataList, function (dataItem) {
                    if (dataItem.status === 'new' && recordsToSend.length < vm.recordCountInBatch) {
                        dataItem.luckyDrawId = vm.luckyDrawId;
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

                couponAppService.importCouponsData({ coupons: recordsToSend })
                    .success(function (data) {

                        if (data) {
                            angular.forEach(data.coupons, function (dataItem) {
                                angular.forEach(vm.fileDataList, function (fileDataItem) {
                                    if (fileDataItem.refId === dataItem.refId) {
                                        fileDataItem.status = dataItem.status;
                                        fileDataItem.couponNo = dataItem.couponNo;
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
                        if (vm.fileDataList[a].refId === vm.fileDataList[j].refId) {
                            abp.message.error("Duplicate Order Id values at records " + (a + 1) + " and " + (j + 1) + ".", "Error");
                            result = true;
                            a = j = vm.fileDataList.length;
                            break;
                        }
                    }
                }

                return result;
            }


            function getActiveLuckyDraws() {
                luckyDrawAppService.getActiveLuckyDraws({}).success(function (data) {
                    vm.luckyDraws = data;
                    console.log(vm.luckyDraws);
                });
            }
            function init() {
                getActiveLuckyDraws();
            }
            init();
        }
    ]);
