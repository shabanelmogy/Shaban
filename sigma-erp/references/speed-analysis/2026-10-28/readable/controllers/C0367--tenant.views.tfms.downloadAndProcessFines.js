// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:95054-95478
appModule.controller('tenant.views.tfms.downloadAndProcessFines', [
        '$scope', 'abp.services.app.trafficFile', 'fineDownloader', 'abp.services.app.uaeFine', 'chromeExtDownloader',
        function ($scope, trafficFileAppService, fineDownloader, fineService, chromeExtDownloader) {

            var vm = this;

            vm.isAbuDhabiFinesEnabled = abp.features.isEnabled("TFMS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isDubaiFinesEnabled = abp.features.isEnabled("TFMS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.DubaiPolice");
            var isQatarFinesEnabled = abp.features.isEnabled("TFMS.Fines.Qatar") || abp.features.isEnabled("CRS.Fines.Qatar");
            const doNotReprocessEnabled = abp.setting.getBoolean('App.General.Fine.AutoProcessAfterDownloading');
            vm.isDownloadConfiscationChargesEnabled = abp.features.isEnabled("TFMS.Fines.DownloadConfiscationCharges");
            vm.isWhatsAppSendSmsOnFineProcessing = abp.features.isEnabled("Notifications.WhatsAppSendCustomerSmsOnFineProcessing");
            vm.isWhatsAppSendSmsOnFineProcessingManual = abp.features.isEnabled("Notifications.WhatsAppSendCustomerSmsOnFineProcessingManual");
            vm.isEmailOnFineProcessingManual = abp.features.isEnabled("Notifications.SendCustomerEmailOnFineProcessingManual");

            vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Rental.Agreements');
            if (!vm.isRentalOrLeaseEnabled)
                vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Lease.Agreements');

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.trafficFiles = [];
            vm.selectedTrafficFiles = [];
            vm.selected = 'all';

            vm.totalProcessedFines = 0;
            vm.totalProcessedFinesWithAgreement = 0;
            var currentPage = 1;
            var maxCountToProcessInOneRequest = 1000;
            var moreDataToProcess = true;

            vm.filters = {
                fromDate: null,
                toDate: null,
                includePreviousUnInvoicedTolls: false,
                doNotReprocess: doNotReprocessEnabled,
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.selectFilesOnly = function () {
                vm.selectedTrafficFiles = [];
                if (vm.selected == "onlyAbuDhabi") {
                    vm.selectedTrafficFiles = vm.trafficFiles.filter(x => x.state == 'Abu Dhabi');
                }
                else if (vm.selected == "onlyDubai") {
                    vm.selectedTrafficFiles = vm.trafficFiles.filter(x => x.state == 'Dubai');
                }
                else {
                    vm.selectedTrafficFiles = [];
                }
            }

            function getTrafficFiles() {
                trafficFileAppService.getTrafficFiles().success(function (data) {

                    angular.forEach(data.items, function (value, key) {
                        if (
                            (value.state === 'Dubai' && vm.isDubaiFinesEnabled) ||
                            (value.state === 'Abu Dhabi' && vm.isAbuDhabiFinesEnabled) ||
                            (value.state === 'Qatar' && isQatarFinesEnabled)
                        ) {
                            vm.trafficFiles.push(value);
                        }
                    });
                });
            }

            vm.downloadFines = function () {

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, vm.downloadFinesV3);
                    return;
                }

                var trafficFiles = vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles;

                chromeExtDownloader.checkAndDownload(
                    function () {
                        vm.downloaderReq.trafficFileIds = null;
                        vm.downloaderReq.settings.downloadFinesOriginalAmountInsteadOfDiscounted = abp.setting.get('Download.Fines.Original.Amount.Instead.Of.Discounted');

                        vm.downloadingFines = true;
                        vm.downloaderReq.trafficFileIds = trafficFiles;

                        //for progress reporing on UI
                        vm.traffFilesDownloadingRes = [];
                        for (var i in trafficFiles) {
                            vm.traffFilesDownloadingRes.push({
                                isComplete: false,
                                status: '',
                                progress: 0,
                                error: '',
                                trafficFile: trafficFiles[i]
                            });
                        }

                        if (!$scope.$$phase)
                            $scope.$digest();

                        startDownloading();

                    },
                    function (content) {
                        abp.message.error(content, null, true);
                    });
            };

            vm.downloadFinesV3 = function () {
                vm.downloadingResponse = [];
                vm.downloadingFines = true;

                let trafficFiles = vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles;
                vm.traffFilesDownloadingRes = [];

                for (var i in trafficFiles) {
                    vm.traffFilesDownloadingRes.push({
                        isComplete: false,
                        status: '',
                        progress: 0,
                        error: '',
                        trafficFile: trafficFiles[i]
                    });
                }

                vm.callbackOnComplete = function () {
                    if (vm.isDownloadConfiscationChargesEnabled) {
                        vm.downloadConfiscationCharges();
                    }

                    if (vm.processingEmailDetails && vm.isEmailingThroughFinesReceiptEnabled) {
                        vm.processFinesEmailDetails();
                    }

                    vm.filters.fromDate = moment().add('days', -4).startOf('day');
                    vm.filters.toDate = moment().endOf('day');
                    vm.processFines();
                };

                debugger;
                vm.processingFines = true;
                chromeExtDownloader.downloadFinesV3(vm, trafficFiles, false);
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            vm.showError = function (error) {
                var title = "FineDownloadingError";
                abp.message.error(
                    error, app.localize(title)
                );
            };

            // Fine Extension Code [Can copy and pase for other views]
            //=========================================================
            vm.downloaderReq = {
                tenantId: abp.session.tenantId,
                settings: {},
                trafficFileIds: []
            };

            function startDownloading() {
                debugger;
                chromeExtDownloader.downloadFines(
                    vm.downloaderReq,
                    `function processCaptcha(msg) {
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && (msg.state.indexOf('Abu') > -1 || msg.state.indexOf('Qat') > -1));
                        trafficFile.captchaSrc = msg.captcha;
                        trafficFile.captchaTxt = '';

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }
                    function reportFineStatus(msg) {
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                        trafficFile.progress = msg.progress;
                        trafficFile.error = msg.error;

                        if(msg.status && msg.status.toUpperCase().indexOf('ACCEPT LOGIN FROM MOBILE APP') > -1){
                            trafficFile.showTammLoginImg = true;
                            trafficFile.status = 'Check Mobile...'
                        }
                        else{
                             trafficFile.status = msg.status;
                             trafficFile.showTammLoginImg = false;
                            }

                        if (trafficFile.error)
                            trafficFile.isComplete = true;
                        else
                            trafficFile.isComplete = msg.isComplated;
                        const allDone = $scope.vm.traffFilesDownloadingRes.filter(x=> x.isComplete == true).length == $scope.vm.traffFilesDownloadingRes.length;

                        if (allDone) {
                            $scope.vm.downloadingFines = false;

                          if ($scope.vm.isDownloadConfiscationChargesEnabled) {
                      
                                       $scope.vm.downloadConfiscationCharges();
                            }

                            if($scope.vm.filters.doNotReprocess && !$scope.vm.processingFines && !$scope.vm.traffFilesDownloadingRes.find(x=> !x.isComplete)){
                                $scope.vm.filters.fromDate = moment().add('days', -4).startOf('day');
                                $scope.vm.filters.toDate = moment().endOf('day');
                                $scope.vm.processFines();
                            }
                        }

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }`,
                    function error(e) {
                        abp.message.error(e.error);
                    });

            }

            vm.sendCaptcha = function (row) {
                chromeExtDownloader.sendCaptcha(row);
            };


            //=========================================================

            vm.cancelAll = function () {
                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.downloadFinesV3(vm, (vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles), true);
                    return;
                }

                chromeExtDownloader.closeAllFinesTabs();
            };

            var lastIndex = -1;
            var toIndex = -1;

            vm.downloadConfiscationCharges = function () {
                debugger;

                if (vm.downloadingConfiscationFines || vm.traffFilesDownloadingRes.length != vm.traffFilesDownloadingRes.filter(x => x.isComplete || x.error).length)
                    return;

                vm.downloadingConfiscationFines = true;
                fineService.getFinesForConfiscationDownloading()
                    .success(r => {
                        if (r.length > 0) {
                            vm.downloadingFines = true;

                            function downloadCCFQueue() {
                                let batchSize = 10;
                                let promisesArr = [];
                                toIndex = lastIndex + 5;
                                if (toIndex >= r.length)
                                    toIndex = r.length - 1;
                                debugger;
                                let ids = [];
                                for (var i = lastIndex + 1; i <= toIndex; i++) {
                                    ids.push(r[i].id);
                                }

                                promisesArr.push(new Promise((resolve, reject) => {
                                    fineService.downloadConfiscationCharges({ id: ids })
                                        .then(r => {
                                            if (r.items) {
                                                reject(r);
                                            }
                                            else {
                                                resolve();
                                            }
                                        });
                                }));

                                lastIndex = toIndex;

                                Promise.all(promisesArr)
                                    .then(result => {
                                        if (lastIndex == r.length - 1) {
                                            vm.downloadingFines = false;
                                            vm.downloadingConfiscationFines = false;
                                            lastIndex = -1;
                                            toIndex = -1;

                                            if (!$scope.$$phase) {
                                                $scope.$digest();
                                            }
                                        }
                                        else {
                                            downloadCCFQueue();
                                        }
                                    })
                                    .catch(e => {
                                        console.log(e);
                                        abp.message.error(JSON.stringify(e));
                                        vm.downloadingFines = false;
                                        vm.downloadingConfiscationFines = false;
                                        lastIndex = -1;
                                        toIndex = -1;

                                        if (!$scope.$$phase) {
                                            $scope.$digest();
                                        }

                                    });
                            }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }

                            downloadCCFQueue();
                        }
                        else {
                            vm.downloadingFines = false;
                            vm.downloadingConfiscationFines = false;
                            vm.processingEmailDetails = false;

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }
                    })
                    .catch(e => {
                        vm.downloadingFines = false;
                        vm.downloadingConfiscationFines = false;
                        vm.processingEmailDetails = false;

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }

                        abp.message.error(e)
                    });
            };

            vm.refreshProcessing = function () {
                currentPage = 1;
                moreDataToProcess = true;
                vm.totalProcessedFines = 0;
                vm.filters.skipCount = 0;
                vm.filters.maxResultCount = maxCountToProcessInOneRequest;
                vm.totalProcessedFinesWithAgreement = 0;


                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), '00', '00', '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), '23', '59', '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                vm.processFines();
            };
            vm.whatsAppSMSManual = function () {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), '00', '00', '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                            vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), '23', '59', '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                            fineService.whatsAppProcessFines(vm.filters).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.emailManual = function () {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Send Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), '00', '00', '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                            vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), '23', '59', '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                            fineService.emailFines(vm.filters).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.processFines = function () {
                vm.processingFines = true;
                vm.showProcessingInfo = true;

                fineService.processFinesInBulk(vm.filters).success(function (result) {
                    vm.totalProcessedFines += result.onTotalCount;
                    vm.totalProcessedFinesWithAgreement += result.onAgreementsCount;

                    moreDataToProcess = (result.processedCount > 0);
                    if (moreDataToProcess) {
                        vm.filters.skipCount = currentPage * maxCountToProcessInOneRequest;
                        currentPage += 1;
                        vm.processFines();
                    } else {
                        vm.processingFines = false;
                    }
                });
            };

            function init() {
                getTrafficFiles();
            }

            init();
        }
    ]);
