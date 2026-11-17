// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:471569-472062
appModule.controller('tenant.views.tfms.fineReceipts.createOrEditModal', [
        '$scope', '$uibModal', 'utilities', 'ReceiptId', '$uibModalInstance', 'abp.services.app.fineReceipts', 'abp.services.app.uaeFine', "FileUploader",
        function ($scope, $uibModal, utilities, receiptId, $uibModalInstance, fineReceiptsService, finesService, fileUploader) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                name: null
            };

            vm.loading = false;
            vm.fineReceipt = {
                receiptAmount: 0,
                acknowledgmentAmount: 0,
                finesAmount: 0,
                receiptLines: [],
                receiptDate: moment(moment().format('YYYY-MM-DD')).utc()
            };

            vm.receiptAmount = null;
            vm.receiptId = receiptId;
            vm.fineNo = [];
            vm.enableSaveBtn = false;
            vm.server = [];

            //vm.dateRangeModel = {
            //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            //};

            vm.permissions = {
                view: true, //abp.auth.hasPermission(''),
                create: true, //abp.auth.hasPermission(''),
                'return': true, //abp.auth.hasPermission(''),
                close: true //abp.auth.hasPermission(''),
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function getFiltersData() {
                finesService.getFiltersData().success(function (data) {
                    angular.forEach(data.server, function (value, key) {
                        vm.server.push({ name: value.name, id: value.name.toUpperCase() });
                    });
                });
            }

            function fineListObject() {

                var line = new Object();
                line.fineId = null;
                line.fineNo = null;
                line.server = null;
                line.authority = null;
                line.fineDateTime = moment(moment().format('YYYY-MM-DD')).utc();
                line.fineDescription = null;
                line.plateNo = null;
                line.plateColor = null;
                line.acknowledgment = null;
                line.amount = null;
                line.disable = false;
                line.agreementId = null;
                line.agreementNo = null;
                line.amountWithSurcharge = 0;
                line.contactId = null;
                line.contactName = null;
                line.driverLicenseNo = null;
                line.driverLicenseSource = null;
                line.fineType = null;
                line.ignored = false;
                line.invoiceId = null;
                line.isAddedManually = '-1';
                line.isPayable = false;
                line.lateCharges = 0;
                line.location = null;
                line.plateSource = null;
                line.plateType = null;
                line.trafficFileId = null;
                return line;
            }

            vm.localize = function (agreementStatus) {
                return app.localize(agreementStatus);
            };

            //Add row
            vm.addRow = function () {
                vm.fineReceipt.receiptLines.push(fineListObject());
            };
            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.fineReceipt.receiptLines.indexOf(obj);
                vm.fineReceipt.receiptLines.splice(index, 1);
                vm.sumFineReceiptAmount();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/fineReceipts/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.tfms.fineReceipts.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            }

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }
                        debugger;
                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });


            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                debugger;
                vm.importing = true;
                vm.fineReceipt.receiptLines = [];
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    vm.loading = true;
                    fineReceiptsService.importFromExcel(fileName)
                        .success(function (result) {
                            vm.fineReceipt.receiptLines = result;


                            if (vm.fineReceipt.receiptLines) 
                                if (vm.fineReceipt.receiptLines.length == 0)
                                    vm.addRow();
                            
                           vm.sumAmount();

                        })
                        .finally(function () {
                         vm.loading = false;
                        });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                debugger;
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            vm.sumAmount = function ()
            {

                if (vm.fineReceipt == null)
                    return 0;

                if (vm.fineReceipt.receiptLines == null)
                    return 0;

                vm.fineReceipt.finesAmount = 0;
                vm.fineReceipt.acknowledgmentAmount = 0;
                for (var i = 0; i < vm.fineReceipt.receiptLines.length; i++) {
                    if (vm.fineReceipt.receiptLines[i].fineDetail.amount != null) {
                        vm.fineReceipt.finesAmount = vm.fineReceipt.finesAmount + vm.fineReceipt.receiptLines[i].fineDetail.amount;

                    }
                    if (vm.fineReceipt.receiptLines[i].fineDetail.acknowledgment != null) {
                        vm.fineReceipt.acknowledgmentAmount = vm.fineReceipt.acknowledgmentAmount + vm.fineReceipt.receiptLines[i].fineDetail.acknowledgment;

                    }

                }

            };

            vm.searchFineNo = function ($select) {
                if (!$select || !$select.search) return;
                vm.filters.name = $select.search;
                return fineReceiptsService.getSearchFineNo(vm.filters).then(function (response) {
                    vm.fineNo = response.data;
                    vm.fineNo.push(fineListObject());

                    if (vm.fineReceipt.receiptLines.length > 0) {
                        angular.forEach(vm.fineReceipt.receiptLines, function (value) {
                            if (value)
                                for (var i = vm.fineNo.length - 1; i >= 0; --i) {
                                    if (vm.fineNo[i].fineNo && vm.fineNo[i].fineNo === value.fineDetail.fineNo) {
                                        vm.fineNo.splice(i, 1);
                                    }
                                }
                        });
                    }

                });
            };

            vm.accountDetails = function (fineDetails) {
                if (fineDetails.contactName.length > 2 && !fineDetails.emailCC && !fineDetails.emailTo) {

                    vm.loading = false;
                    let input = { account: fineDetails.contactName, plateNo: (fineDetails.plateNo + '-' + fineDetails.plateColor) };

                    fineReceiptsService.getEmailDetailsForCustomerAccount(input)
                        .success(function (r) {
                            fineDetails.emailCC = r.emailCC;
                            fineDetails.emailTo = r.emailTO;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }

                return;
            };

            vm.getAccountDetail = function (fineDetail) {
                if (!fineDetail.plateNo || !fineDetail.plateColor) {
                    return;
                }
                else {
                    debugger;
                    var pInfo = fineDetail.plateNo + "-" + fineDetail.plateColor
                    fineReceiptsService.getEmailDetailsForCustomerAccount({ plateInfo: pInfo })
                        .success(function (r) {
                            fineDetail.contactName = r.account;
                            fineDetail.emailCC = r.emailCC;
                            fineDetail.emailTo = r.emailTO;
                        }).finally(function () {
                            vm.loading = false;
                        });
                }
            }

            vm.matchFound = function (searhKeyword) {
                var result = false;
                angular.forEach(vm.fineNo, function (value, key) {
                    if (parseInt(value.fineNo) === parseInt(searhKeyword)) {
                        result = true;
                    }
                });
                return result;
            };

            vm.getFineDetail = function (fineLine) {
                debugger;
                var result = {};
                //check duplicatin on current active row List
                var count = 0;
                angular.forEach(vm.fineReceipt.receiptLines, function (value) {
                    if (value.fineDetail.fineNo === fineLine.fineDetail.fineNo) {
                        count++;
                    }
                });
                if (count > 1) {
                    abp.notify.error(app.localize('AlreadyExistInCurrentFines'));
                    vm.removeRow(fineLine);
                    return result;
                }


                result = fineLine;
                if (fineLine.fineDetail.fineNo === null || (fineLine.fineNo && fineLine.fineNo.id === null) || (fineLine.fineNo && fineLine.fineNo.id > 0)) {
                    result = {
                        server: fineLine.server,
                        fineDateTime: fineLine.fineDateTime,
                        authority: fineLine.authority,
                        fineDescription: fineLine.fineDescription,
                        plateColor: fineLine.plateColor,
                        acknowledgment: fineLine.acknowledgment,
                        amount: fineLine.amount,
                        isAddedManually: false
                    };
                } else {
                    result = {
                        server: null,
                        fineDateTime: moment(moment().format('YYYY-MM-DD')).utc(),
                        authority: null,
                        fineDescription: null,
                        plateNo: null,
                        plateColor: null,
                        acknowledgment: 0,
                        amount: 0,
                        isPaid: true, //can use a dropdown in view to provide dynamic value
                        isAddedManually: '-1'
                    };
                }

                debugger;
                vm.sumFineReceiptAmount();
                return result;
            };

            vm.sumFineReceiptAmount = function () {
                if (vm.fineReceipt === null)
                    return 0;

                if (vm.fineReceipt.receiptLines === null)
                    return 0;

                var receiptAmount = 0;
                var acknowledgmentAmount = 0;
                var finesAmount = 0;
                for (var i = 0; i < vm.fineReceipt.receiptLines.length; i++) {

                    if (vm.fineReceipt.receiptLines[i].fineDetail.acknowledgment !== null)
                        acknowledgmentAmount = acknowledgmentAmount + utilities.round(vm.fineReceipt.receiptLines[i].fineDetail.acknowledgment, 2);

                    acknowledgmentAmount = utilities.round(acknowledgmentAmount, 2);

                    if (vm.fineReceipt.receiptLines[i].fineDetail.amount !== null)
                        finesAmount = finesAmount + utilities.round(vm.fineReceipt.receiptLines[i].fineDetail.amount, 2);

                    finesAmount = utilities.round(finesAmount, 2);

                    receiptAmount = acknowledgmentAmount + finesAmount;
                    vm.enableSaveBtn();
                }

                vm.fineReceipt.receiptAmount = receiptAmount;
                vm.fineReceipt.acknowledgmentAmount = acknowledgmentAmount;
                vm.fineReceipt.finesAmount = finesAmount;
            };

            vm.getFineReceiptsById = function (id) {
                vm.loading = true;

                fineReceiptsService.getFineReceiptsById({ id: id }).success(function (data) {
                    vm.fineReceipt = data;
                    vm.receiptAmount = data.receiptAmount;
                    angular.forEach(vm.fineReceipt.receiptLines, function (value) {
                        value.fineDetail = {};
                        value.fine.server = value.fine.server.toUpperCase();
                        value.fineDetail = value.fine;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.enableSaveBtn = function () {
                if (parseInt(vm.receiptAmount) !== parseInt(vm.fineReceipt.receiptAmount))
                    return true;
                else
                    return false;
            };

            vm.createFineReceipts = function () {
                openCreateOrEditFineReceiptsModal(null);
            };

            vm.save = function () {
                debugger;
                vm.loading = true;
                //check duplicatin on current active row List
                var count = 0;
                angular.forEach(vm.fineReceipt.receiptLines, function (value) {
                    angular.forEach(vm.fineReceipt.receiptLines, function (item) {

                        if (item.fineDetail.isAddedManually == '-1') {
                            item.fineDetail.server = item.fineDetail.server.toUpperCase();
                            item.fineDetail.isAddedManually = true;
                            item.fineDetail.isPaid = true;
                            item.fineDetail.location = "";
                            item.fineDetail.trafficFileId = 0;
                        }

                        if (item.fineDetail.fineNo === value.fineDetail.fineNo) {
                            count++;
                        }
                    });
                    if (count > 1) {
                        //abp.notify.error(app.localize('Remove Duplications In Row Fine No: ' + value.fineDetail.fineNo));
                        vm.loading = false;
                        return;
                    }
                    count = 0;
                });
                if (count > 1) {
                    vm.loading = false;
                    abp.message.confirm(
                        app.localize('RemoveDuplicationsFromRow'), app.localize('RemoveDuplications'),
                    );
                    return;
                }

                fineReceiptsService.createOrUpdateFineReceipts(vm.fineReceipt).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.loading = false;
                });
            };

           
            vm.isEmailingThroughFinesReceipt = abp.features.isEnabled('TFMS.Fines.EmailingThroughFinesReceipt');

            function tableToExcel(tableID, filename = '')
            {
                var downloadLink;
                var dataType = 'application/vnd.ms-excel';
                var tableSelect = document.getElementById(tableID);
                var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

                // Specify file name
                filename = filename ? filename + '.xls' : 'excel_data.xls';

                // Create download link element
                downloadLink = document.createElement("a");

                document.body.appendChild(downloadLink);

                if (navigator.msSaveOrOpenBlob) {
                    var blob = new Blob(['\ufeff', tableHTML], {
                        type: dataType
                    });
                    navigator.msSaveOrOpenBlob(blob, filename);
                } else {
                    // Create a link to the file
                    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

                    // Setting the file name
                    downloadLink.download = filename;

                    //triggering the function
                    downloadLink.click();
                }
            }

            vm.exportToExcel = function (exportTable)
            {
                tableToExcel(exportTable, 'FineReceipt');
            };

            function initialize() {
                getFiltersData();
                if (receiptId > 0) {
                    vm.getFineReceiptsById(receiptId);
                }

            }

            initialize();
        }
    ]);
