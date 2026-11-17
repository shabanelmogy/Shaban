// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:278683-279044
appModule.controller('tenant.views.crs.reports.reconcileTolls.index', [
        '$scope', 'abp.services.app.toll', 'abp.services.app.salikAccount', 'chromeExtDownloader',
        function ($scope, tollService, salikAccountService, chromeExtDownloader) {
            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().format(abp.setting.get("App.General.DateFormat"));
            let downloadUnchargedSalikTolls = abp.setting.get("App.General.Salik.DownloadUnchargedSalikTolls") == 'True' ? true : false;

            vm.dateRangeCountBreakup = [];

            vm.salikTolls = [];
            vm.salikTolls.TotalCount = null;
            vm.salikAccounts = [];
            vm.selectedSalikAccounts = [];
            vm.daysToReconcile = [];
            vm.filters = {};
            vm.totalCount = 0;
            vm.totalLiveCount = 0;

            vm.tollStatus = { isDownloading: false };

            vm.tollStatus = {
                abuDhabi: {},
                dubai: {
                    isDownloading: false,
                    progress: 0,
                    status: '',
                    error: null
                }
            };

            vm.tollCountError = '';

            var salikFeatureEnabled = abp.features.isEnabled('CRS.Tolls.Salik');

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');
            };

            vm.applyLiveCount = function () {
                tollService.getTollsCountBreakupDateWise(vm.filters)
                    .success(function (data) {
                        debugger;
                        console.log('applying live count');
                        vm.totalCount = 0;
                        vm.totalLiveCount = 0;

                        $scope.vm.tollsCountBreakup.forEach(x => {
                            let a = data.items.find(y => y.day == x.day);
                            x.count = a.count;
                            vm.totalCount += x.count;
                            vm.totalLiveCount += x.liveCount;

                            if (x.count == x.liveCount)
                                x.shoulReconcile = null;
                        });

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    });

            };

            vm.downloadTolls = function () {
                vm.tollStatus.dubai.isDownloading = true;
                vm.tollStatus.dubai.error = null;

                vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');

                var req = {
                    fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                    toDate: vm.filters.toDate.format('YYYY-MM-DD'),
                    tagNo: [],
                    salikAccounts: [],
                    isEtoll: false,
                    forReconciliation: true
                };

                req.salikAccounts = vm.tollAccounts.filter(a => a.id == vm.singleSeletedAccount);
                req.salikAccounts[0].daysToReconcile = vm.daysToReconcile;
                req.downloadUnchargedSalikTolls = downloadUnchargedSalikTolls;

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                    return;
                }

                chromeExtDownloader.downloadTolls(
                    req,
                    `function reportStatus(status) {
						var $scope = angular.element('#appController').scope();
						if (!$scope) return;

						if (!$scope.vm.tollStatus.dubai)
							$scope.vm.tollStatus.dubai = {};

						if (status.isComplated || status.error) {

							$scope.vm.tollStatus.dubai.isDownloading = false;

							//if (!status.error) {
								$scope.vm.applyLiveCount();
							//}
							
							$scope.vm.daysToReconcile = [];
							$scope.vm.tollsCountBreakup.forEach(x => { x.processing = false; });
							$scope.vm.tollStatus.dubai.error = status.error;
							$scope.vm.tollStatus.dubai.status = status.status;

						}
						else if (status.isSlabCompleted) {
							debugger;
							let o = $scope.vm.tollsCountBreakup.find(y => y.day == status.slabProcessing + 'T00:00:00Z');
							o.processing = false;
							$scope.vm.daysToReconcile.splice($scope.vm.daysToReconcile.indexOf(o.day), 1);
							$scope.vm.applyLiveCount();
						}
						else {
							$scope.vm.tollStatus.dubai.isDownloading = true;
							$scope.vm.tollStatus.dubai.error = '';

							$scope.vm.tollStatus.dubai.progress = status.progress;
							$scope.vm.tollStatus.dubai.status = status.status;
							if ($scope.vm.tollsCountBreakup.length && status.slabProcessing)
								$scope.vm.tollsCountBreakup.find(y => y.day == status.slabProcessing + 'T00:00:00Z').processing = true;
 
						}

						if (!$scope.$$phase) {
							$scope.$digest();
						}
					}`,
                    function error(e) {
                        vm.tollStatus.dubai.isDownloading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error, null, true);
                    });

            };

            vm.search = function () {
                vm.tollStatus.dubai.isCheckingCount = true;
                vm.tollStatus.dubai.error = null;

                vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');
                vm.filters.salikAccountId = vm.singleSeletedAccount;
                vm.tollsCountBreakup = [];
                var diffDays = Math.ceil(Math.abs((new Date(vm.filters.toDate)) - (new Date(vm.filters.fromDate))) / (1000 * 60 * 60 * 24));
                if (diffDays > 31) {
                    vm.loading = false;
                    abp.message.error("Date Range's difference cannot be more than 31 days.");
                    return;
                }

                tollService.getTollsCountBreakupDateWise(vm.filters)
                    .success(function (data) {
                        vm.tollsCountBreakup = data.items;
                    }).finally(function () {
                        let accs = vm.tollAccounts.filter(x => x.id == vm.singleSeletedAccount);
                        getSalikCount({
                            fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                            toDate: vm.filters.toDate.format('YYYY-MM-DD'),
                            salikAccounts: accs,
                            downloadUnchargedSalikTolls: downloadUnchargedSalikTolls,
                            isEtoll: false
                        });
                    });
            };

            vm.enableDebugging = true;
            vm.downloadTollsV3 = function () {
                vm.downloadingResponse = [];
                //function defination
                function getReconciliationSummary(preserveOnlineCount, callback) {
                    vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                    vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');
                    vm.filters.salikAccountId = vm.singleSeletedAccount;

                    if (!preserveOnlineCount)
                        vm.tollsCountBreakup = [];

                    var diffDays = Math.ceil(Math.abs((new Date(vm.filters.toDate)) - (new Date(vm.filters.fromDate))) / (1000 * 60 * 60 * 24));
                    if (diffDays > 31) {
                        vm.loading = false;
                        abp.message.error("Date Range's difference cannot be more than 31 days.");
                        return;
                    }

                    tollService.getTollsCountBreakupDateWise(vm.filters)
                        .success(function (data) {
                            debugger;
                            vm.totalLiveCount = 0;
                            vm.totalCount = 0;

                            if (!preserveOnlineCount) {
                                vm.tollsCountBreakup = data.items;
                                data.items.forEach(x => {
                                    vm.totalCount += x.count;
                                    vm.totalLiveCount += (x.liveCount ? x.liveCount : 0);
                                });
                            }
                            else
                                vm.tollsCountBreakup.forEach(x => {
                                    x.processing = false;
                                    const o = data.items.find(d => d.day == x.day);
                                    x.count = o.count;
                                    vm.totalCount += o.count;
                                    vm.totalLiveCount += (x.liveCount ? x.liveCount : 0);
                                });

                        }).finally(() => callback && callback());
                }

                vm.isLoading = false;
                vm.callbackOnComplete = function () {
                    if (vm.isLoading) return;
                    console.info('callbackOnComplete code run.');
                    vm.isLoading = true;
                    getReconciliationSummary(true, () => {
                        vm.tollStatus.dubai.isDownloading = false;
                        vm.tollStatus.dubai.isCheckingCount = false;
                        vm.isLoading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();
                    });
                };

                vm.reponseCallback = function (res) { //reponse received from extension to show progress
                    console.info('reponseCallback code run.');
                };

                debugger;

                //calling the function
                if (vm.tollStatus.dubai.isCheckingCount)
                    getReconciliationSummary(false, function () {
                        const accounts = vm.tollAccounts.filter(x => x.id == vm.filters.salikAccountId);
                        vm.tollAccountsDownloadingRes = {
                            request: {},
                            getOnlyCount: true,
                            fromDate: null,
                            toDate: null,
                            tollAccounts: accounts,
                            dateSlabs: []
                        };

                        for (var i in vm.tollsCountBreakup) {
                            const val = vm.tollsCountBreakup[i];
                            vm.tollAccountsDownloadingRes.dateSlabs.push({ fromDate: val.day.split('T')[0], downloadedCount: val.count, tollsCountOnSite: 0 });
                        }

                        chromeExtDownloader.downloadTollsV3(vm, false);
                    });
                else {
                    vm.tollAccountsDownloadingRes.dateSlabs = undefined;
                    vm.tollStatus.dubai.isDownloading = true;
                    chromeExtDownloader.downloadTollsV3(vm, false);
                }
            };

            function getSalikCount(reqeust) {

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    reqeust.getOnlyCount = true;
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                    return;
                }

                chromeExtDownloader.getSalikCount(
                    reqeust,
                    `function reportSalikCountStatus(status) {
						var $scope = angular.element('#appController').scope();
						if (status.reportCount && status.requestData.salikAccount) {
							debugger;
							$scope.vm.daysToReconcile = [];
							$scope.vm.tollCountError = '';
							$scope.vm.tollsCountBreakup.forEach(x => {
								let a = status.requestData.salikAccount.tollsDateList.find(y => y.day == x.day.split('T')[0]);

								if (a) {
									x.liveCount = a.count;
									if (a.count > x.count) {
										$scope.vm.daysToReconcile.push(x.day);
										x.shoulReconcile = true;
									}
								}
							});

							$scope.vm.tollStatus.dubai.isCheckingCount = false;
						}
						else if (status.isComplated && status.error) {
							$scope.vm.tollsCountBreakup.forEach(x => { x.liveCount = 0; });
							$scope.vm.tollStatus.dubai.isCheckingCount = false;
							$scope.vm.tollStatus.dubai.isDownloading = false;
							$scope.vm.salikTolls.TotalCount = 0;
							$scope.vm.tollCountError = status.error;
						}

						if (!$scope.$$phase) {
							$scope.$digest();
						}
					}

						`,
                    function error(e) {

                        $scope.vm.tollStatus.dubai.isCheckingCount = false;
                        $scope.vm.tollStatus.dubai.isDownloading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error, null, true);
                    }
                );
            }

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
                vm.tollStatus.dubai.isCheckingCount = false;
            };

            (function () {
                debugger;
                if (!salikFeatureEnabled) {
                    abp.message.error('', 'One of the Features Salik should be Enabled.');
                }
                else {
                    salikAccountService.getSalikAccountsForExtension({ id: 1 })
                        .success(function (data) {
                            vm.tollAccounts = data.items;
                        });
                }
            })();

            vm.showError = function (error) {
                if (error)
                    abp.message.error(error);
            };

        }
    ]);
