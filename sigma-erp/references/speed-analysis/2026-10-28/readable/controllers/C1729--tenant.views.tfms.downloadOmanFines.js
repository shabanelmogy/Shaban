// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:474413-474594
appModule.controller('tenant.views.tfms.downloadOmanFines', [
        '$scope', 'abp.services.app.trafficFile', 'chromeExtDownloader',
        function ($scope, trafficFileAppService, chromeExtDownloader) {

            var vm = this;

            vm.trafficFiles = [];
            vm.selectedTrafficFiles = [];
            vm.selected = 'selected';

            vm.isDownloading = false;
            vm.isLatestVersion = false;

            function getTrafficFiles() {
                trafficFileAppService.getOmanTrafficFiles()
                    .success(function (data) {
                        vm.trafficFiles = data.items;
                    });
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
                    if (vm.isDownloadConfiscationChargesEnabled && vm.isDownloadConfiscationChargesEnabled) {
                        vm.downloadConfiscationCharges();
                    }

                    if (vm.processingEmailDetails && vm.isEmailingThroughFinesReceiptEnabled) {
                        vm.processFinesEmailDetails();
                    }
                };

                vm.reponseCallback = function (res) { //reponse received from extension to show progress
                    //{fromDate: 'date', downloadedCount: int, tollsCountOnSite: int, isProcessing: false}; --response template

                };

                debugger;

                chromeExtDownloader.downloadFinesV3(vm, trafficFiles, false);

            };

            vm.downloadFines = function () {

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, vm.downloadFinesV3);
                    return;
                }

                vm.isLatestVersion = chromeExtDownloader.isLatestVersion();

                var trafficFiles = vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles;

                chromeExtDownloader.checkAndDownload(
                    function () {
                        vm.downloaderReq.trafficFileIds = null;

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
                                trafficFile: trafficFiles[i],
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
                    `function reportFineStatus(msg) {
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                        trafficFile.progress = msg.progress;
                        trafficFile.error = msg.error;
                        trafficFile.status = msg.status;

                        if (trafficFile.error)
                            trafficFile.isComplete = true;
                        else
                            trafficFile.isComplete = msg.isComplated;

                        if (trafficFile.isComplete || trafficFile.error)
                            $scope.vm.downloadingFines = false;

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

                    captcahRequest.buttonSelector = '#ctl00_ContentPlaceHolder1_bntEnquire';
                    captcahRequest.captcahSelector = '#ctl00_ContentPlaceHolder1_CaptchaCodeTextBox';

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
                chromeExtDownloader.closeAllFinesTabs();
            };

            function init() {
                getTrafficFiles();
            }

            init();
        }
    ]);
