// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:348638-349112
appModule.controller('tenant.views.crs.vouchers.invoices.generateFineModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.uaeFine', 'abp.services.app.invoice', '$filter', 'fineDownloader', '$interval', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'options', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, fineService, invoiceService, $filter, fineDownloader, $interval, trafficFileService, chromeExtDownloader, options, utilities) {

            var vm = this;
            vm.loading = false;
            vm.downloadingFines = false;
            vm.trafficFilesEnqueuedResponse = [];
            vm.downloadedTrafficFiles = 0;
            vm.downloadedFilesCount = 0;
            vm.isExtHasLatestVersion = chromeExtDownloader.isLatestVersion();
            vm.downloadingFinesCancled = false;
            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();


            if (options == undefined)
                vm.options = null;
            if (options != null)
                vm.options = options;


            vm.all = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            //vm.isShowFinesOnVehicleReplacement = abp.auth.hasPermission('Pages.Tenant.ShowFinesOnReplacement');
            vm.showPoInInvoiceEngine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowPONoInInvoicingEngine"));
            vm.isShowFinesOnVehicleReplacement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.GenerateFineOnVehicleReplacement"));
            vm.isShowCustomerInMissingFines = abp.features.isEnabled('CRS.CustomFeatures.ShowCustomerInMissingFines');
            vm.isFineInvoiceForNrmEnabled = abp.features.isEnabled("CRS.CustomFeatures.FineInvoiceForNrm");

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.fineFilters = {
                fromDate: null,
                toDate: null,
                plateNo: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.timeOutFinesDontReportProgress = false;

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.allBoxTicked = function () {
                if (vm.findAgreements === null) return;
                angular.forEach(vm.findAgreements, function (invoiceDue) {
                    invoiceDue.generate = vm.all;
                });
            };
            vm.nextSearch = function () {
                vm.searchClass = 'done';
                vm.findAgreementClass = 'active';
                vm.showSearch = false;
                vm.showAgreement = true;
                //processFines();
                processFinesWithBatching();
            };
            vm.previousAgreement = function () {
                vm.showAgreement = false;
                vm.showSearch = true;
                vm.searchClass = 'active';
                vm.findAgreementClass = '';
            };
            vm.nextAgreement = function () {
                vm.showAgreement = false;
                vm.showInvoice = true;
                vm.findAgreementClass = 'done';
                vm.invoiceClass = 'active';
                angular.forEach(vm.findAgreements, function (invoiceDue) {
                    invoiceDue.generate = false;
                });
            };
            vm.previousInvoice = function () {
                vm.showInvoice = false;
                vm.showAgreement = true;
                vm.findAgreementClass = 'active';
                vm.invoiceClass = '';
            };
            vm.finishInvoice = function () {
                vm.invoiceClass = 'done';
            };
            vm.cancel = function () {
                if (vm.downloadingFines) {
                    abp.message.customConfirm(app.localize('Recent Fines may not be downloaded.'),
                        app.localize('Want to cancel downloading?'),
                        function (r) {
                            if (r) {
                                chromeExtDownloader.closeAllFinesTabs();
                                vm.downloadingFinesCancled = true;
                                $uibModalInstance.dismiss();
                            }
                        });
                } else {
                    $uibModalInstance.dismiss();
                }
            };

            angular.element(window).bind("keyup", keyup);
            function keyup(e) {
                if (e.keyCode == 27) {
                    vm.cancel();
                }
            }


            function processFines() {
                if (vm.fines) {
                    vm.loading = true;
                    fineService.processFines({ fines: vm.fines }).success(function (data) {
                        vm.findAgreements = data;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            function processFinesWithBatching() {
                vm.findAgreements = [];
                if (vm.fines) {

                    vm.loading = true;
                    let finesToProcess = [...vm.fines];

                    const processFineApi = (callback) => {
                        const finesBatch = finesToProcess.splice(0, 100);
                        fineService.processFines({ fines: finesBatch })
                            .success(function (data) {
                                vm.findAgreements = [...vm.findAgreements, ...data];

                                if (vm.isShowCustomerInMissingFines) {
                                    angular.forEach(vm.findAgreements, function (row) {
                                        if (row.contactId && row.contact) {
                                            row.contactName = row.contact.name;
                                            row.contactId = row.contact.id;
                                        }
                                    });
                                }
                                if (finesToProcess.length) {
                                    processFineApi(callback);
                                }
                                else {
                                    callback && callback();
                                }
                            });
                    }

                    processFineApi(() => {
                        vm.loading = false;
                    });
                }
            }

            vm.searchFines = function () {
                vm.fineFilters.fromDate = vm.dateRangeModel && vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.fineFilters.toDate = vm.dateRangeModel && vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.loading = true;
                fineService.getPendingFines(vm.fineFilters).success(function (data) {
                    vm.fines = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //Show Fines On Vehicle Replacement Modal Funcitonlaity Starts

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };



            vm.showFinesOnVehicleReplacement = function () {
                //let AgreementStartDate = vm.convertStringDateToMomentDate(vm.options.agreementStartDate);
                //let AgreementEndDate = vm.convertStringDateToMomentDate(vm.options.agreementEndDate);

                let inMovementoutDetail = new Date(vm.options.inMovement.outDetail.dateTime); //Since This Date Is In String So We Need To Convert It.
                inMovementoutDetail = moment(inMovementoutDetail);; //Since This Date Is In String So We Need To Convert It.
                let inMovementinDetail = vm.options.inMovement.inDetail.dateTime


                //Initializing Calender According To To The Agreement DateRange. 
                //Because Autosearch is implemented.So DatePickerRange Is Set Automatically Instead Of User Input In This Case

                vm.dateRangeModel = {
                    startDate: moment(moment(inMovementoutDetail).format('YYYY-MM-DD')).utc(),
                    endDate: moment(moment(inMovementinDetail).format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
                };


                vm.fineFilters.plateNo = vm.options.plateNo;


                //Initializing DateRangeFilters
                vm.fineFilters.fromDate = vm.dateRangeModel && vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.fineFilters.toDate = vm.dateRangeModel && vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //Setting Search Type If 'VehicleReplacement' Then Column Name "PlateInfo" Will Be Used To Search For 'PlateNo'
                vm.fineFilters.searchType = 1; //GetPendingFinesSearchType Enum 1 -> FromVehicleReplacement

                vm.loading = true;
                fineService.getPendingFines(vm.fineFilters).success(function (data) {
                    vm.fines = data;

                }).finally(function () {
                    vm.loading = false;

                    vm.dateRangeModel = {
                        startDate: moment(moment(inMovementoutDetail).format('YYYY-MM-DD')).utc(),
                        endDate: moment(moment(inMovementinDetail).format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
                    };


                });
            };



            //Show Fines On Vehicle Replacement Modal Funcitonlaity Ends

            vm.ignoreFine = function (fine) {
                abp.message.okConfirm(
                    app.localize('IgnoreFineMessage'), app.localize('PressOkToIgnoreFine'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            fineService.ignoreFine({
                                id: fine.id
                            }).success(function (result) {
                                var index = vm.findAgreements.indexOf(fine);
                                vm.findAgreements.splice(index, 1);
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.generateInvoice = function () {
                debugger;
                vm.saving = true;
                var invoicesToGenerate = [];
                angular.forEach(vm.findAgreements, function (invoiceDue) {
                    //if (invoiceDue.generate === true && invoiceDue.invoiceNo === null)
                    if (invoiceDue.generate === true && !invoiceDue.invoiceNo)
                        invoicesToGenerate.push(invoiceDue);
                });
                if (invoicesToGenerate.length === 0) {
                    vm.saving = false;
                    return;
                }
                invoiceService.generateFineInvoices({
                    fromDate: vm.fineFilters.fromDate,
                    toDate: vm.fineFilters.toDate, fines: invoicesToGenerate
                }).success(function (data) {
                    vm.generatedInvoices = data;

                    angular.forEach(vm.generatedInvoices, function (generatedInvoice) {

                        var foundLines = $filter('filter')(invoicesToGenerate, {
                            id: generatedInvoice.fineId
                        }, true);

                        if (foundLines.length) {
                            foundLines[0].invoiceId = generatedInvoice.invoiceId;
                            foundLines[0].invoiceNo = generatedInvoice.invoiceNo;
                            foundLines[0].error = generatedInvoice.error;
                        }
                        vm.saving = false;
                    });
                });
            };

            vm.addMissingFine = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/addMissingFineModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.addMissingFineModal as vm',
                    backdrop: 'static'
                });
                modalInstance.result.then(function (result) {
                    vm.searchFines();
                });
            };


            function downloadFines() {
                if (isMv3ExtensionAvailable) {
                    vm.downloadingFines = true;
                    chromeExtDownloader.initV3(vm, () => {
                        trafficFileService.getTrafficFiles().success(function (r) {
                            vm.traffFilesDownloadingRes = [];

                            for (var i in r.items) {
                                vm.traffFilesDownloadingRes.push({
                                    isComplete: false,
                                    status: '',
                                    progress: 0,
                                    error: '',
                                    trafficFile: r.items[i]
                                });
                            }

                            vm.callbackOnComplete = function () {
                                vm.downloadingFines = false;

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            };

                            chromeExtDownloader.downloadFinesV3(vm, r.items, false);
                        });
                    });
                }
                else {
                    chromeExtDownloader.checkAndDownload(
                        function success() {

                            vm.downloadingFines = true;

                            vm.traffFilesDownloadingRes = [];
                            vm.downloadedFilesCount = 0;


                            trafficFileService.getTrafficFiles()
                                .success(function (r) {

                                    //r.items = r.items.filter(x => x.state !== 'Abu Dhabi');//remove this aftert testing.

                                    for (var i in r.items) {
                                        vm.traffFilesDownloadingRes.push({
                                            isComplete: false,
                                            status: '',
                                            progress: 0,
                                            error: '',
                                            trafficFile: r.items[i]
                                        });
                                    }

                                    if (!$scope.$$phase) $scope.$digest();

                                    chromeExtDownloader.downloadFines(
                                        {
                                            trafficFileIds: r.items
                                        },

                                        `function processCaptcha(msg) {
                                    var $scope = angular.element(document.querySelector('[name="generateFineForm"]')).scope();
                                    var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && (msg.state.indexOf('Abu') > -1 || msg.state.indexOf('Qat') > -1));
                                    trafficFile.captchaSrc = msg.captcha;
                                    trafficFile.captchaTxt = '';

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }

                                function reportFineStatus(msg) {
                                    var $scope = angular.element(document.querySelector('[name="generateFineForm"]')).scope();
                                    var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                                    trafficFile.progress = msg.progress;
                                    trafficFile.error = msg.error;
                                    trafficFile.status = msg.status;

                                    if (trafficFile.error)
                                        trafficFile.isComplete = true;
                                    else
                                        trafficFile.isComplete = msg.isComplated;

                                    if (msg.downloadingComplete) {
                                        $scope.vm.downloadingFines = false;
                                    }

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                } `,
                                        function error() {
                                            vm.downloadingFines = false;

                                            if (!$scope.$$phase) {
                                                $scope.$digest();
                                            }
                                        }
                                    );
                                });


                        },
                        function error(content) {
                            vm.downloadingTolls = false;
                            abp.message.error(content, null, true);
                        });
                }
            }

            function init() {
                vm.searchClass = 'active';
                vm.showSearch = true;
                vm.showAgreement = false;
                vm.showInvoice = false;

                downloadFines();
                if (vm.options != null && vm.options.inMovement.outDetail.dateTime != null && vm.options.inMovement.inDetail.dateTime != null && vm.isShowFinesOnVehicleReplacement) {
                    vm.showFinesOnVehicleReplacement();
                }

            }

            vm.showError = function (error) {

                var title = 'FinesDownloadingError';
                if (vm.timeOutFinesDontReportProgress) {
                    title = "TemporaryDownloadingIssue";
                }

                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.sendCaptcha = function (row) {
                chromeExtDownloader.sendCaptcha(row);
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Fines may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                    if (r) {
                        chromeExtDownloader.closeAllFinesTabs();
                        vm.downloadingFinesCancled = true;
                    }
                });
            };

            vm.ok = function () {
                let e = "";
                vm.traffFilesDownloadingRes && vm.traffFilesDownloadingRes.forEach(x =>
                    x.error ? e.indexOf(x.error) < 0 && (e = e + '\n' + x.error) : ''
                );
                return e;
            };

            init();
        }
    ]);
