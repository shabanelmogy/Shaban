// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:478319-478565
appModule.controller('tenant.views.tms.darb.salikReconciliation.index', [
        '$scope', 'abp.services.app.toll', 'abp.services.app.salikAccount', 'chromeExtDownloader',
        function ($scope, tollService, salikAccountService, chromeExtDownloader) {
            var vm = this;
            vm.isJvGenerated = false;

            vm.salikTolls = [];
            vm.salikTolls.TotalCount = null;
            vm.salikAccounts = [];
            vm.selectedSalikAccounts = [];

            vm.salikMonthEndPosting = [];
            vm.salikMonthEndPosting.totalSum = null;

            vm.authorityList = [
                { key: 'Dubai', value: 1 },
                { key: 'Abu Dhabi', value: 2 }
            ];

            vm.tollStatus = {
                dubai: {},
                abuDhabi: {
                    isDownloading: false,
                    progress: 0,
                    status: '',
                    error: null
                }
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

            vm.downloadTollsV3 = function (cancle) {
                let isCancle = false;
                if (cancle) isCancle = true;
                chromeExtDownloader.downloadTollsV3(vm, isCancle);
            };

            vm.downloadTolls = function () {

                vm.downloadingTolls = true;
                vm.salikTolls.TotalCount = null;

                var tollsReqToDate = vm.filters.toDate;
                if (tollsReqToDate > moment())
                    tollsReqToDate = moment();

                let accounts = vm.selectedSalikAccounts.length > 0 ? vm.selectedSalikAccounts : vm.tollAccounts;

                const accountsWithZeroOnlineCount = vm.salikTolls.AccountWiseCounts.filter(a => a.Count == 0);
                //skip 0 online count account
                accounts = accountsWithZeroOnlineCount.length ? accounts.filter(c => !accountsWithZeroOnlineCount.find(a => a.username == c.SalikUsername)) : accounts;

                var req = {
                    fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                    toDate: tollsReqToDate.format('YYYY-MM-DD'),
                    tagNo: [],
                    isEtoll: true,
                    salikAccounts: accounts
                };

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    vm.tollAccountsDownloadingRes = {
                        request: {
                            fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                            toDate: vm.filters.toDate.format('YYYY-MM-DD')
                        },
                        getOnlyCount: false,
                        tollAccounts: req.salikAccounts,
                        dateSlabs: []
                    };

                    vm.tollStatus.abuDhabi.isDownloading = true;
                    vm.callbackOnComplete = function () {
                        vm.getSalikReconciliation();
                    };

                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                }
                else {
                    chromeExtDownloader.downloadTolls(
                        req,
                        `function reportStatus(status) {
                            var $scope = angular.element('#appController').scope();
                            if (!$scope) return;

                            if (!$scope.vm.tollStatus.abuDhabi)
                                $scope.vm.tollStatus.abuDhabi = {};

                            if (status.isComplated || status.error) {

                                $scope.vm.tollStatus.abuDhabi.isDownloading = false;

                                if (!status.error)
                                    $scope.vm.getSalikReconciliation();

                                $scope.vm.tollStatus.abuDhabi.error = status.error;
                                $scope.vm.tollStatus.abuDhabi.status = status.status;

                            }
                            else {
                                $scope.vm.tollStatus.abuDhabi.isDownloading = true;
                                $scope.vm.tollStatus.abuDhabi.error = '';

                                $scope.vm.tollStatus.abuDhabi.progress = status.progress;
                                $scope.vm.tollStatus.abuDhabi.status = status.status;
                            }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }`,
                        function error(e) {

                            vm.downloadingTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error, null, true);
                        });
                }
            };

            vm.search = function () {
                debugger;
                vm.loading = true;
                vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                vm.filters.server = 2;
                vm.salikTolls.TotalCount = 0;

                vm.salikTolls = { AccountWiseCounts: null, TotalCount: 0 };

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
                        getOnlyCount: true,
                        tollAccounts: vm.selectedSalikAccounts.length ? vm.selectedSalikAccounts : vm.tollAccounts,
                        dateSlabs: []
                    };

                    vm.tollStatus.abuDhabi.isDownloading = true;
                    vm.callbackOnComplete = function () {
                        vm.getSalikReconciliation();
                    };

                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                }
                else {
                    getSalikCount({
                        fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                        toDate: tollsReqToDate.format('YYYY-MM-DD'),
                        salikAccounts: vm.selectedSalikAccounts.length ? vm.selectedSalikAccounts : vm.tollAccounts
                    });
                }
            };

            vm.getSalikReconciliation = function () {
                vm.tollsCountLoading = false;

                vm.filters.accountIds = [];
                if (vm.selectedSalikAccounts.length > 0) {
                    for (var i in vm.selectedSalikAccounts) {
                        vm.filters.accountIds.push(vm.selectedSalikAccounts[i].id);
                    }
                }

                tollService.getSalikReconciliation(vm.filters)
                    .success(function (data) {
                        vm.salikRecns = data;
                    }).finally(function () {
                        vm.loading = false;
                        vm.tollStatus.abuDhabi.isDownloading = false;
                    });
            };

            function getSalikCount(reqeust) {

                chromeExtDownloader.getSalikCount(
                    reqeust,
                    `function reportSalikCountStatus(status) {
                            var $scope = angular.element('#appController').scope();

                            if (status.reportCount) {
                                //$scope.vm.downloaderReq = status.requestData;
                                $scope.vm.salikTolls.TotalCount = status.requestData.totalTolls;
                                $scope.vm.salikTolls.AccountWiseCounts = status.requestData.salikAccounts;
                                $scope.vm.getSalikReconciliation();
                            }
                            else if (status.showCaptchaMessage) {
                                $scope.vm.showCaptchaMsg = 'Fill Captcha on site...';
                            }
                            else if (status.error) {
                                $scope.vm.tollsCountLoading = false;
                                $scope.vm.firebaseSalikResponse.countError = status.error;
                            }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }`,
                    function error(e) {

                        vm.tollsCountLoading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error, null, true);
                    }
                );
            }

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };

            (function () {
                salikAccountService.getSalikAccountsForExtension({ id: 2 })
                    .success(function (data) {
                        vm.tollAccounts = data.items;
                    });
            })();

            vm.showError = function (error) {
                if (error)
                    abp.message.error(error);
            };
        }
    ]);
