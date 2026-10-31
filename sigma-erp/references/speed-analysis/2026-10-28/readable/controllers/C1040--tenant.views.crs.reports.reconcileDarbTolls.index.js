// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:278373-278680
appModule.controller('tenant.views.crs.reports.reconcileDarbTolls.index', [
        '$scope', 'abp.services.app.toll', 'abp.services.app.salikAccount', 'chromeExtDownloader',
        function ($scope, tollService, salikAccountService, chromeExtDownloader) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.salikTolls = [];
            vm.salikAccounts = [];
            vm.selectedSalikAccounts = [];

            vm.tollsCountLoading = false;
            vm.totalOnlineCount = 0;
            vm.totalDownloadedCount = 0;
            vm.totalDifference = 0;

            vm.tollStatus = {
                dubai: {},
                abuDhabi: {}
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

            vm.tollDownloader = {
                dubai: {},
                abuDhabi: {
                    isDownloading: false,
                    progress: 0,
                    status: '',
                    error: null
                }
            };

            vm.isRecoRun = false;
            vm.getSalikReconciliation = function () {

                if (vm.isRecoRun) return;
                vm.isRecoRun = true;

                var accountWithCount = [];
                vm.tollsCountLoading = true;

                if (vm.salikAccounts.AccountWiseCounts)
                    angular.forEach(vm.salikTolls.AccountWiseCounts, function (v, k) {
                        accountWithCount.push({ key: v.username, value: v.tollsCount });
                    });
                else { //MV3
                    vm.selectedSalikAccounts.forEach(x => {
                        accountWithCount.push({ key: x.username, value: 0 });
                    })
                }

                var tollsReqToDate = vm.filters.toDate;
                if (tollsReqToDate > moment())
                    tollsReqToDate = moment();

                var reqData = {
                    accountWithCount: accountWithCount,
                    fromDate: vm.filters.fromDate,
                    toDate: tollsReqToDate,
                    servers: 2
                };

                tollService.getReconcileToll(reqData)
                    .success(function (result) {
                        vm.accountReconcileDetails = result.items;

                        vm.totalOnlineCount = 0;
                        vm.totalDownloadedCount = 0;
                        vm.totalDifference = 0;

                        angular.forEach(vm.accountReconcileDetails, function (v, k) {
                            v.onlineCount = v.downloadedCount;
                            v.difference = 0;

                            vm.totalDownloadedCount += v.downloadedCount;
                            vm.totalOnlineCount += v.onlineCount;
                            vm.totalDifference += v.difference;
                        });

                        if (vm.downloadTolls)
                            vm.downloadingTolls = false;
                        vm.tollStatus.abuDhabi.isDownloading = false;
                    })
                    .error(function (reason) {
                        abp.notify.error(reason);
                    })
                    .finally(function () {
                        vm.tollsCountLoading = false;
                        vm.isRecoRun = false;
                    });
            };

            vm.downloadTollsV3 = function (getOnlyCount) {
                //var req = {
                //    fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                //    toDate: vm.filters.toDate.format('YYYY-MM-DD'),
                //    tollAccounts: vm.selectedSalikAccounts.length > 0 ? vm.selectedSalikAccounts : vm.salikAccounts,
                //    isEtoll: true
                //};

                ////const nonReconciledAccounts = vm.accountReconcileDetails.filter(x => x.difference);
                //vm.tollAccountsDownloadingRes = {
                //    request: req,
                //    getOnlyCount: true,
                //    tollAccounts: req.tollAccounts
                //};

                chromeExtDownloader.downloadTollsV3(vm, false);
            };

            vm.getTollsCount = function () {
                debugger;
                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day');

                var tollsReqToDate = vm.filters.toDate;
                if (tollsReqToDate > moment())
                    tollsReqToDate = moment();

                vm.tollsCountLoading = true;
                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    vm.tollAccountsDownloadingRes = {
                        request: {
                            fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                            toDate: vm.filters.toDate.format('YYYY-MM-DD')
                        },
                        getOnlyCount: false,
                        tollAccounts: vm.selectedSalikAccounts,
                        dateSlabs: []
                    };

                    vm.callbackOnComplete = () => { vm.getSalikReconciliation(); }
                    vm.tollStatus.abuDhabi.isDownloading = true;
                    vm.downloadTolls = true;
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3)
                }
                else
                    getSalikCount({
                        fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                        toDate: tollsReqToDate.format('YYYY-MM-DD'),
                        salikAccounts: vm.selectedSalikAccounts.length > 0 ? vm.selectedSalikAccounts : vm.salikAccounts
                    });
            };

            vm.downloadTolls = function () {
                vm.downloadingTolls = true;
                vm.tollStatus.abuDhabi.error = '';

                //if reconcile accounts have 0 toll difference from web then don't include in downloading
                //vm.salikAccounts = vm.salikAccounts.filter(x =>
                //    vm.accountReconcileDetails.find(y => y.accountName === x.username && y.amount > 0));

                var tollsReqToDate = vm.filters.toDate;
                if (tollsReqToDate > moment())
                    tollsReqToDate = moment();

                var req = {
                    fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                    toDate: tollsReqToDate.format('YYYY-MM-DD'),
                    salikAccounts: vm.selectedSalikAccounts.length > 0 ? vm.selectedSalikAccounts : vm.salikAccounts,
                    isEtoll: true
                };

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    vm.tollDownloader.abuDhabi.isDownloading = true;
                    vm.callbackOnComplete = () => { vm.getSalikReconciliation(); }
                    vm.tollAccountsDownloadingRes.getOnlyCount = false;
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                }
                else {
                    var funcNode = document.getElementById('speedExtReportingSalik');
                    if (funcNode) {
                        funcNode.parentElement.removeChild(funcNode);
                    }

                    chromeExtDownloader.downloadTolls(
                        req,
                        function () {
                            debugger;
                        },
                        function error(e) {

                            vm.downloadTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error, null, true);
                        });
                }
            };

            vm.cancel = function () {
                chromeExtDownloader.closeAllTabs({});
            };

            function getSalikCount(reqeust) {

                vm.tollStatus.abuDhabi.countError = '';

                var funcNode = document.getElementById('speedExtReportingSalikCount');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                var script1 = document.createElement('script');
                script1.id = 'speedExtReportingSalik';
                script1.appendChild(document.createTextNode(`function reportStatus(status) {
                            var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                            if(status.error){
                                $scope.vm.tollsCountLoading = false;
                            }

                            if (!$scope.vm.tollStatus.abuDhabi)
                                $scope.vm.tollStatus.abuDhabi = {};

                            if (status.isComplated || status.error) {
                                $scope.vm.downloadingTolls = false;

                                if (!status.error)
                                    $scope.vm.getSalikReconciliation();

                                $scope.vm.tollStatus.abuDhabi.error = status.error;
                                $scope.vm.tollStatus.abuDhabi.status = status.status;

                            }
                            else {
                                $scope.vm.downloadingTolls = true;
                                $scope.vm.tollStatus.abuDhabi.error = '';

                                $scope.vm.tollStatus.abuDhabi.progress = status.progress;
                                $scope.vm.tollStatus.abuDhabi.status = status.status;
                            }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }`));
                (document.body || document.head || document.documentElement).appendChild(script1);

                var script = document.createElement('script');
                script.id = 'speedExtReportingSalikCount';
                script.appendChild(document.createTextNode(
                    `function reportSalikCountStatus(status) {
                        var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();

                        if (status.reportCount) {
                            $scope.vm.salikTolls.TotalCount = status.requestData.totalTolls;
                            $scope.vm.salikTolls.AccountWiseCounts = status.requestData.salikAccounts;
                            $scope.vm.tollsCountLoading = false;
                            $scope.vm.getSalikReconciliation();
                        }
                        else if (status.showCaptchaMessage) {
                            if(!$scope.vm.tollStatus.abuDhabi) $scope.vm.tollStatus.abuDhabi = {};
                            $scope.vm.tollStatus.abuDhabi.status = 'Fill Captcha on site...';
                        }
                        else if (status.error) {
                            $scope.vm.tollsCountLoading = false;
                            $scope.vm.tollStatus.abuDhabi.countError = status.error;
                        }

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }`
                ));

                (document.body || document.head || document.documentElement).appendChild(script);

                chromeExtDownloader.getSalikCount(
                    reqeust,
                    null,
                    function error(e) {

                        vm.tollsCountLoading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error, null, true);
                    }
                );
            }

            vm.showError = function (error) {
                abp.message.error(error);
            };

            (function () {
                salikAccountService.getSalikAccountsForExtension({ id: 2 })
                    .success(function (data) {
                        vm.salikAccounts = data.items;
                    });
            })();

        }
    ]);
