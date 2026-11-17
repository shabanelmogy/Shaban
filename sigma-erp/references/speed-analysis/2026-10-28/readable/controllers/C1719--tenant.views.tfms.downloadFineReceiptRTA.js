// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:472383-472698
appModule.controller('tenant.views.tfms.downloadFineReceiptRTA', [
        '$scope', 'abp.services.app.fineReceipts', 'chromeExtDownloader', 'abp.services.app.salikAccount',
        function ($scope, fineReceiptsService, chromeExtDownloader, salikAccountAppService) {

            var vm = this;

            vm.downloadAllAccountsSummary = null;
            vm.downloadSelectedTagsSummary = null;

            var salikFeatureEnabled = abp.features.isEnabled('TMS.Salik.Dubai') || abp.features.isEnabled('CRS.Tolls.Salik');
            var eTollFeatureEnabled = abp.features.isEnabled('TMS.Tolls.AbuDhabi') || abp.features.isEnabled('CRS.Tolls.AbuDhabi');
            vm.isDownloadOrReconcileTollsSingleAccount = abp.setting.get("App.General.Salik.DownloadOrReconcileTollsSingleAccount") == 'True' ? true : false;
            let isDownloadUnchargedSalikTolls = abp.setting.get("App.General.Salik.DownloadUnchargedSalikTolls") == 'True' ? true : false;

            vm.isLatestVersion = false;

            vm.selected = 'all';
            vm.tollStatus = {
                dubai: { isDownloading: false },
                abuDhabi: { isDownloading: false }
            };

            vm.filters = {
                fromDate: null,
                toDate: null,
                tagNos: [],
                plateNos: [],
                plateNosWithTag: null,
                tenantId: abp.session.tenantId,
                server: 1
            };

            vm.downloadByDateSummary = [];
            var content = '<span style="font-size:28px;">Speed Extension is not available.</span><br/><span style="font-size:18px;">Please download from <a href = "https://chrome.google.com/webstore/detail/speed-extension/nhhdkapljemlnpbdhjnbmacblgbnkebe" target="_blank"> here.</a ></span> ';

            var dateFormat = abp.setting.get("App.General.DateFormat");
            if (!dateFormat) dateFormat = 'dd/MM/yyyy';

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(dateFormat);
            };

            vm.enableDebugging = true;
            vm.downloadTolls = function () {
                if (!salikFeatureEnabled && !eTollFeatureEnabled) {
                    abp.message.error('', 'One of the Features Salik | EToll should be Enabled.');
                }
                else {
                    debugger;

                    vm.tollStatus = {
                        dubai: { isDownloading: false },
                        abuDhabi: { isDownloading: false }
                    };

                    var requestData = null;
                    //vm.isLatestVersion = chromeExtDownloader.isLatestVersion();

                    //if tags based downloading then append filter info as request parems
                    if (vm.selected === 'date') {
                        requestData = vm.filters;
                        requestData.tagNo = [];
                    }

                    const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();
                    if (isMv3ExtensionAvailable) {

                        let salikRequest = { isEtoll: false, fromDate: undefined, toDate: undefined, downloadUnchargedSalikTolls: false, salikAccounts: [] };

                        if (vm.selected === 'selected') {
                            salikRequest.tagNo = vm.filters.tagNos;
                            salikRequest.plateNos = vm.filters.plateNos;

                            salikRequest.fromDate = vm.filters.fromDate;
                            salikRequest.toDate = vm.filters.toDate;
                            salikRequest.downloadUnchargedSalikTolls = isDownloadUnchargedSalikTolls;
                            salikRequest.salikAccounts = vm.salikAccounts.filter(x => vm.filters.plateNosWithTag.find(a => a.account.trim().replace('(Not-Active)', '') == x.username));
                        }
                        else if (vm.selected === 'date') {
                            debugger;
                            var accountToDownload = {};
                            if (vm.isDownloadOrReconcileTollsSingleAccount) {
                                accountToDownload = vm.salikAccounts.filter(a => a.id == vm.singleSeletedAccount);
                            }
                            else {
                                accountToDownload = vm.selectedSalikAccounts;
                            }
                            salikRequest.fromDate = vm.filters.fromDate;
                            salikRequest.toDate = vm.filters.toDate;
                            salikRequest.tagNo = [];
                            salikRequest.plateNos = [];
                            salikRequest.salikAccounts = accountToDownload;
                        }
                        else {
                            salikRequest.tagNo = [];
                            salikRequest.plateNos = [];
                            salikRequest.fromDate = vm.filters.fromDate;
                            salikRequest.toDate = vm.filters.toDate;
                            salikRequest.salikAccounts = vm.salikAccounts;
                        }

                        vm.downloadByDateSummary = [];
                        vm.tollStatus.dubai.isDownloading = true;
                        vm.tollAccountsDownloadingRes = { request: salikRequest, tollAccounts: salikRequest.salikAccounts };
                        chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                    }
                    else {
                        vm.downloadingTolls = false;
                        abp.message.error(content, null, true);
                    }
                }
            };

            vm.downloadTollsV3 = function () {
                vm.callbackOnComplete = function () {
                    console.info('all done running getSummary');
                    vm.downloadingTolls = false;
                    //vm.getSummary();
                };

                chromeExtDownloader.downloadFineReceiptV3(vm, null);
            };

            vm.showError = function (error) {
                console.log(error);
                var title = "SalikDownloadingError";
                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };


            // Fine Extension Code [Can copy and pase for other views]
            //=========================================================
            //vm.downloaderReq = {
            //    tenantId: abp.session.tenantId,
            //    trafficFileIds: [],
            //    salikRequest: {
            //        fromDate: null,
            //        toDate: null,
            //        tagNo: []
            //    }
            //};

            vm.getSummary = function () {
                vm.downloadingTolls = true;
                if (vm.selected === 'all') {
                    //Get summary for the user ....
                    tollAppService.downloadForAllAccountSummary({ server: 1 })
                        .success(function (result) {
                            vm.downloadAllAccountsSummary = result.items;

                            vm.downloadingTolls = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.downloadingTolls = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        });
                }
                else if (vm.selected === 'date') {

                    var accountIds = [];
                    if (vm.isDownloadOrReconcileTollsSingleAccount) {
                        accountIds.push(vm.singleSeletedAccount);
                    }
                    else {
                        for (var i in vm.selectedSalikAccounts) {
                            accountIds.push(vm.selectedSalikAccounts[i].id);
                        }
                    }

                    let r = {
                        fromDate: moment(vm.filters.fromDate.format('YYYY-MM-DD'), 'YYYY-MM-DD').utc(),
                        toDate: moment(vm.filters.toDate.format('YYYY-MM-DD'), 'YYYY-MM-DD').utc(),
                        accountIds: accountIds,
                    };

                    tollAppService.getTollSummaryByDate(r)
                        .success(function (result) {
                            console.log(result);
                            vm.downloadByDateSummary = result.items;

                            vm.downloadingTolls = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.downloadingTolls = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        });
                }

                else {
                    debugger;
                    let tagNosList = [];
                    vm.filters.plateNosWithTag.forEach(
                        function (plateNo) {
                            tagNosList.push(plateNo.tagNo);
                        });
                    tollAppService.downloadForSelectedTagsSummary({ fromDate: vm.filters.fromDate, toDate: vm.filters.toDate, tagNos: tagNosList })
                        .success(function (result) {
                            //vm.downloadingTolls = false;
                            vm.downloadSelectedTagsSummary = result.items;

                            vm.totalAmount = 0;
                            vm.totalTollsCount = 0;
                            angular.forEach(vm.downloadSelectedTagsSummary, function (item) {
                                vm.totalAmount += item.amount;
                                vm.totalTollsCount += item.tollsCount;
                            });

                            vm.downloadingTolls = false;

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }

                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.downloadingTolls = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }

                        });
                }
            };

            vm.extSalikStatus = {
                progress: 0,
                isCompleted: false,
                error: ''
            };

            vm.cancelAll = function () {
                chromeExtDownloader.downloadFineReceiptV3(vm, (vm.selected === 'all' ? vm.trafficFiles : vm.selectedTrafficFiles), true);
            };

            function getSalikAccounts() {
                salikAccountAppService.getSalikAccountsForExtension({ id: 1 })
                    .success(function (r) {
                        vm.salikAccounts = r.items.filter(z => z.isRtaAccount);
                        getTrafficFilesFake();

                    });
            }

            function getTrafficFilesFake() {
                vm.trafficFiles = [];
                vm.trafficFiles.push({ state: 'Abu Dhabi', trafficFileId: '' });
                downloadTammReceipts();
            }

            function init() {
                getSalikAccounts();
            }

            function downloadTammReceipts() {
                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, () => {
                        vm.downloadingResponse = [];
                        vm.downloadTammReceipt = true;
                        vm.downloadingTolls = true;

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
                            console.log("Tamm receips downloading compeleted");
                            vm.downloadingTolls = false;
                        };

                        vm.reponseCallback = function (res) {
                            console.log('response from extension for progress.', res)
                        };

                        debugger;

                        vm.trafficFilesToDownload = trafficFiles;
                        chromeExtDownloader.downloadFineReceiptV3(vm, false);

                    });
                } else alert('Extension not found.');
            }

            init();
        }
    ]);
