// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:474028-474410
appModule.controller('tenant.views.tfms.downloadFines', [
        '$scope', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'abp.services.app.uaeFine',
        function ($scope, trafficFileAppService, chromeExtDownloader, uaeFineAppService) {

            var vm = this;

            var isAbuDhabiFinesEnabled = abp.features.isEnabled("TFMS.Fines.AbuDhabiPolice");
            vm.isDubaiFinesEnabled = abp.features.isEnabled("TFMS.Fines.DubaiPolice");
            var isQatarFinesEnabled = abp.features.isEnabled("TFMS.Fines.Qatar");
            vm.isDownloadConfiscationChargesEnabled = abp.features.isEnabled("TFMS.Fines.DownloadConfiscationCharges");
            vm.isEmailingThroughFinesReceiptEnabled = abp.features.isEnabled("TFMS.Fines.EmailingThroughFinesReceipt");

            //let tammAccountsSetting = []; //{userId:0 , uaePass:''}

            vm.trafficFiles = [];
            vm.selectedTrafficFiles = [];
            vm.selected = 'all';

            vm.isDownloading = false;

            function getTrafficFiles() {
                trafficFileAppService.getTrafficFiles().success(function (data) {

                    angular.forEach(data.items, function (value, key) {
                        if (
                            (value.state === 'Dubai' && vm.isDubaiFinesEnabled) ||
                            (value.state === 'Abu Dhabi' && isAbuDhabiFinesEnabled) ||
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

                const trafficFiles = vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles;

                chromeExtDownloader.checkAndDownload(
                    function () {
                        vm.downloaderReq.trafficFileIds = null;
                        debugger;
                        vm.downloadingFines = true;
                        vm.downloaderReq.trafficFileIds = trafficFiles;
                        //const hasAbuDhabiFile = trafficFiles.find(x => x.state == 'Abu Dhabi');

                        ////if there is no uae pass configured for current user then use first one else use current user uae pass
                        //if (hasAbuDhabiFile && tammAccountsSetting.length) {
                        //    const tas = tammAccountsSetting.find(x => x.userId == abp.session.userId);
                        //    vm.downloaderReq.uaePass = tas ? tas.uaePass : tammAccountsSetting[0].uaePass;
                        //}
                        //else vm.downloaderReq.uaePass = null;

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
                };

                vm.reponseCallback = function (res) {
                    console.log('response from extension for progress.', res)
                };

                debugger;

                chromeExtDownloader.downloadFinesV3(vm, trafficFiles, false);

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
                trafficFileIds: []
            };

            function startDownloading() {
                chromeExtDownloader.downloadFines(
                    vm.downloaderReq,
                    `function processCaptcha(msg) {
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && (msg.state.indexOf('Qatar') > -1 || msg.state.indexOf('Abu') > -1));
                        trafficFile.captchaSrc = msg.captcha;
                        trafficFile.captchaTxt = '';

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }

                    function reportFineStatus(msg) {
                        if (msg.scrapingInfo) {
                            console.error(JSON.stringify(msg.scrapingInfo.scrapingErrors));
                        }
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                        trafficFile.progress = msg.progress;
                        trafficFile.error = !trafficFile.error ? msg.error : trafficFile.error;

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

                            if (!$scope.vm.processingEmailDetails && $scope.vm.isEmailingThroughFinesReceiptEnabled) {
                                $scope.vm.processFinesEmailDetails();
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

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    const captcahRequest = {
                        trafficFile: { id: row.trafficFile.id, fileId: row.trafficFile.fileId, server: row.trafficFile.state },
                        account: null,
                        tenantId: abp.session.tenantId,
                        captcahSelector: null,
                        buttonSelector: null,
                        captchaText: row.captchaTxt,
                        capthaTabId: row.capthaTabId
                    };

                    if (row.trafficFile.state == 'Qatar')
                    {
                        captcahRequest.buttonSelector = '#frmCpy button';
                        captcahRequest.captcahSelector = '#captchaResponseCompany';
                    }
                    else {
                        alert('captcah implementation is only for Qatar');
                        throw Error('captcah implementation is only for Qatar');
                    }

                    chromeExtDownloader.sendCaptchaMv3(captcahRequest);
                }
                else
                    chromeExtDownloader.sendCaptcha(row);
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            //=========================================================

            vm.cancelAll = function () {
                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.downloadFinesV3(vm, (vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles), true);
                    return;
                }

                chromeExtDownloader.closeAllFinesTabs();
            };

            async function init() {
                getTrafficFiles();

                //if (abp.setting.get('App.General.Fine.DownloadingAuthorityType') == '1') {
                //    //Tamm based fines downloading enabled

                //    try {
                //        tammAccountsSetting = JSON.parse((await abp.services.app.tenantSettings.getAdvanceSetting({ token: 'App.General.Fine.UserUaePasses' })).value);
                //    } catch (e) {

                //    }
                //}
            }

            var lastIndex = -1;
            var toIndex = -1;
            vm.downloadConfiscationCharges = function () {
                debugger;

                if (vm.downloadingConfiscationFines || vm.traffFilesDownloadingRes.length != vm.traffFilesDownloadingRes.filter(x => x.isComplete || x.error).length)
                    return;

                vm.downloadingConfiscationFines = true;
                uaeFineAppService.getFinesForConfiscationDownloading()
                    .success(r => {
                        if (r.length > 0) {
                            vm.downloadingFines = true;

                            function downloadCCFQueue() {
                                let promisesArr = [];
                                toIndex = lastIndex + 5;
                                if (toIndex >= r.length)
                                    toIndex = r.length - 1;

                                for (var i = lastIndex + 1; i <= toIndex; i++) {
                                    promisesArr.push(new Promise((resolve, reject) => {
                                        uaeFineAppService.downloadConfiscationCharges({ id: [r[i].id] })
                                            .then(r => {
                                                if (r.items) {
                                                    reject(r);
                                                }
                                                else {
                                                    resolve();
                                                }
                                            });
                                    }));
                                }

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
                        debugger;
                        vm.downloadingFines = false;
                        vm.downloadingConfiscationFines = false;
                        vm.processingEmailDetails = false;

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }

                        abp.message.error(e)
                    });
            };

            vm.processFinesEmailDetails = function () {
                vm.processingEmailDetails = true;

                uaeFineAppService.processEmailDetailsForEmailPendingFines({ id: '2022-10-01' })
                    .success(r => {
                        vm.processingEmailDetails = false;
                    })
                    .catch(e => {
                        vm.processingEmailDetails = false;
                        abp.message.error(e);
                    });
            };

            init();
        }
    ]);
