// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:319351-319772
appModule.controller('tenant.views.crs.vouchers.allocations.createAllocation', ['$scope', '$uibModalInstance', 'options', 'abp.services.app.allocation', 'utilities',
        function ($scope, $uibModalInstance, options, allocationService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.allocationData = null;
            vm.isTDSEnable = utilities.parseBoolean(abp.setting.get("App.General.EnableTDS"));
            vm.tds = options.tds;
            vm.isImportAllocations = abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ImportAllocations');
            vm.isPopUpWhenfullReceiptAmountIsNotAllocatedToInvoices = abp.features.isEnabled("CRS.CustomFeatures.PopUpWhenfullReceiptAmountIsNotAllocatedToInvoices");

            $scope.loadFile = function (files) {
                vm.allowImport = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.totalRecordsCount = 0;
                        vm.successRecordsCount = 0;
                        vm.failRecordsCount = 0;
                        vm.errorRecords = null;
                        vm.showCount = false;
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
                vm.bankAccount = null;
                vm.allowFileSelection = false;
            };

            function readFileData() {

                vm.fileDataList = [];
                let file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    let reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {
                        vm.match = 0;
                        vm.notMatch = 0;

                        let data = e.target.result;
                        let workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        let first_sheet_name = workbook.SheetNames[0];
                        let dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });
                        const getValue = (obj, fieldName) => {
                            const value = obj[fieldName];
                            if (value && typeof value === 'string') {
                                return value.trim();
                            }
                            return value;
                        }
                        if (dataObjects.length > 0) {

                            let checkForDuplication = true;

                            for (let i = 0; i < dataObjects.length; i++) {

                                let value = dataObjects[i];
                                debugger;
                                let invoiceNumber = getValue(value, "Invoice  Number");
                                //if (!invoiceNumber) {
                                //    abp.message.error('Invoice Number field is missing at record' + (i + 1) + '.', 'Error');
                                //    vm.fileDataList = [];
                                //    break;
                                //}
                                let invoiceType = getValue(value, "Invoice Type");
                                let bookingId = getValue(value, 'booking id');
                                //if (!bookingId) {
                                //    abp.message.error("Booking ID field is missing at record " + (i + 1) + ".", "Error");
                                //    vm.fileDataList = [];
                                //    break;
                                //}
                                let agreementNo = getValue(value, 'Agreement No');
                                let agreementType = getValue(value, 'Agreement Type');
                                let invoiceDate = getValue(value, 'Invoice Date');
                                let invoiceAmount = getValue(value, 'Invoice Amount');
                                let alreadyAllocated = getValue(value, 'Already Allocated');
                                let nowAllocated = getValue(value, 'Now Allocated');
                                let dueAmount = getValue(value, 'Due Amount');
                                let item = {
                                    serialNo: i + 1,
                                    invoiceNumber,
                                    invoiceType,
                                    bookingId,
                                    agreementNo,
                                    agreementType,
                                    invoiceDate,
                                    invoiceAmount,
                                    alreadyAllocated,
                                    nowAllocated,
                                    dueAmount
                                };
                                updateImportItem(item);
                                vm.fileDataList.push(item);
                            }

                            if (checkForDuplication && vm.fileDataList.length > 0) {
                                vm.allowImport = !hasDuplicateFields();
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

            //function getItem(item) {
            //    if (item.invoiceNumber) {
            //        return vm.allocationData.allocations.find(x => x.voucherNo === item.invoiceNumber);
            //    }
            //    if (item.bookingId) {
            //        return vm.allocationData.allocations.find(x => x.manualAgreementNo === item.bookingId);
            //    }
            //    return null;
            //}

            vm.exportToExcel = function (tableID) {
                var summaryText = "<div class='row' style='margin-left:20px'>"

                var tab_text = summaryText + "<table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0; j < tab.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";
                //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
                // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
                // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "allocations.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }

            function updateImportItem(item) {
                debugger;
                if (item.invoiceNumber) {
                    let findItem = vm.allocationData.allocations.find(x => x.voucherNo === item.invoiceNumber);
                    if (findItem) {
                        item.importStatus = 'match';
                        vm.match += 1;
                        findItem.allocatedNow = item.nowAllocated;
                        item.remainingDue = findItem.amount - (findItem.alreadyAllocated + item.nowAllocated);
                    } else {
                        item.importStatus = 'not match';
                        vm.notMatch += 1;
                    }
                }
                else if (item.bookingId) {
                    let nowAllocated = item.nowAllocated;
                    let totalAmount = 0;
                    let totalAlreadyAllocated = 0;
                    let findItems = vm.allocationData.allocations.filter(x => x.manualAgreementNo === item.bookingId);

                    if (findItems && findItems.length > 0) {
                        item.importStatus = 'match';
                        vm.match += 1;
                        for (let i = 0; i < findItems.length; i++) {
                            let findItem = findItems[i];
                            totalAmount += findItem.amount;
                            totalAlreadyAllocated += findItem.alreadyAllocated;
                            if (nowAllocated > 0) {
                                if (i === findItems.length - 1) {
                                    findItem.allocatedNow = nowAllocated;
                                } else {
                                    if (nowAllocated >= findItem.dueToAllocate) {
                                        findItem.allocatedNow = findItem.dueToAllocate;
                                        nowAllocated -= findItem.allocatedNow;
                                    } else {
                                        findItem.allocatedNow = nowAllocated;
                                        nowAllocated -= findItem.allocatedNow;
                                    }
                                }
                            }
                        }
                        item.remainingDue = totalAmount - (totalAlreadyAllocated + item.nowAllocated);
                    } else {
                        item.importStatus = 'not match';
                        vm.notMatch += 1;
                    }
                }
            }

            //function updateItemFromImport(item) {
            //    let findItem = getItem(item);
            //    if (findItem) {
            //        findItem.allocatedNow = item.actualAllocated
            //    }
            //}

            vm.importResult = () => {
                // Convert the list of objects to an array of arrays
                const dataArray = vm.fileDataList.map(obj => [obj.invoiceNumber, obj.invoiceType, obj.bookingId, obj.agreementNo, obj.agreementType, obj.invoiceDate, obj.invoiceAmount, obj.alreadyAllocated, obj.nowAllocated, obj.dueAmount, obj.importStatus, obj.remainingDue]);

                // Create a worksheet
                const ws = XLSX.utils.aoa_to_sheet([['Invoice Number', 'Invoice Type', 'Booking Id', 'Agreement No', 'Agreement Type', 'Invoice Date', 'Invoice Amount', 'Already Allocated', 'Now Allocated', 'Due Amount', 'Status', 'Remaining Due'], ...dataArray]);

                // Create a workbook and add the worksheet
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

                // Specify the Excel file path
                const excelFilePath = 'importAllocations.xlsx';

                // Write the workbook to an Excel file
                XLSX.writeFile(wb, excelFilePath);

                console.log(`Excel file '${excelFilePath}' has been created.`);
            }

            function hasDuplicateFields() {
                var result = false;

                //check for code duplication
                for (var a = 0; a < vm.fileDataList.length; a++) {
                    for (var j = a + 1; j < vm.fileDataList.length; j++) {
                        //    if (moment(vm.fileDataList[a].date).format('DD-MM-YYYY') === moment(vm.fileDataList[j].date).format('DD-MM-YYYY') && vm.fileDataList[a].description === vm.fileDataList[j].description && vm.fileDataList[a].credit === vm.fileDataList[j].credit) {
                        //        abp.message.error("Duplicate records found at " + (a + 1) + " and " + (j + 1) + ".", "Error");
                        //        result = true;
                        //        a = j = vm.fileDataList.length;
                        //        break;
                        //    }
                    }
                }
                return result;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.localize = function (key) {
                return app.localize(key);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.sumAmount = function () {
                if (vm.allocationData == null)
                    return 0;

                if (vm.allocationData.allocations.length == 0)
                    return 0;

                var amount = 0;
                angular.forEach(vm.allocationData.allocations, function (value, key) {
                    if (value.allocatedNow > 0)
                        amount = amount + value.allocatedNow;
                });

                return vm.rounding(amount);
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };


            vm.insertDueAmountOnClick = function (allocation) {
                if (parseFloat(allocation.allocatedNow) == 0) {
                    allocation.allocatedNow = vm.rounding(allocation.amount - allocation.alreadyAllocated - allocation.allocatedNow);
                }
            };

            vm.save = function () {

                var anyNegativeDueAmount = utilities.checkNegativeDueAmounts(vm.allocationData.allocations);
                if (anyNegativeDueAmount) {
                    abp.message.info("One or more due Amounts contain less than zero amount");
                    return;
                }

                vm.saving = true;

                var allocations = [];
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    allocations.push({
                        id: allocation.allocationId,
                        allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                        allocatedToVoucherLineId: allocation.voucherLineId,
                        amount: allocation.allocatedNow
                    });
                });

                allocationService.saveAllocations({ allocations: allocations })
                    .success(function (data) {
                        if (vm.isPopUpWhenfullReceiptAmountIsNotAllocatedToInvoices) {
                            if ((vm.allocationData.allocatingVoucherAmount - vm.sumAmount()) > 0) {
                                abp.message.info(app.localize('AmountIsNotAllocated'), 'Note', {
                                    buttons: [
                                        {
                                            text: 'OK',
                                            key: 'ok',
                                            action: function () {
                                            }
                                        }
                                    ]
                                });
                            }
                        }
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
            vm.exportToExcelAllocations = function () {

                vm.loading = true;
                var allocations = [];
                angular.forEach(vm.allocationData.allocations, function (allocation, key) {
                    if (allocation.allocatedNow > 0) {
                        allocations.push({
                            id: allocation.allocationId,
                            allocatingVoucherLineId: vm.allocationData.allocatingVoucherLineId,
                            allocatedToVoucherLineId: allocation.voucherLineId,
                            amount: allocation.allocatedNow
                        });
                }
                });
                var dueForAllocation = vm.rounding(vm.allocationData.allocatingVoucherAmount - vm.sumAmount());
                allocationService.exportToExcelReceipt(vm.allocationData.allocations, dueForAllocation)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function init() {
                vm.loading = true;
                allocationService.getAllocationsForEdit({ voucherId: options.voucherId, allocatingVoucherLineId: options.allocatingVoucherLineId, includeBillsOnly: options.includeBillsOnly }).success(
                    function (data) {
                        vm.allocationData = data;
                        var allocations = [];

                        if (options.voucherSubTypeId == 35) // show only asset type sale invoices if asset sale type receipt is selected
                        {
                            angular.forEach(data.allocations, function (item) {
                                if (item.voucherSubTypeId == 17) {
                                    allocations.push(item);
                                }
                            });
                            vm.allocationData.allocations = allocations;
                        }
                        else
                            vm.allocationData = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }]);
