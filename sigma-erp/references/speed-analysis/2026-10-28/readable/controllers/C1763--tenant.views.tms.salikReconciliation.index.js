// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:481772-482164
appModule.controller('tenant.views.tms.salikReconciliation.index', [
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

            var salikFeatureEnabled = abp.features.isEnabled('TMS.Salik.Dubai');

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
                        $scope.vm.tollsCountBreakup.forEach(x => {
                            let a = data.items.find(y => y.day == x.day);
                            x.count = a.count;
                            if (x.count == x.liveCount)
                                x.shoulReconcile = null;
                        });

                        vm.tollStatus.dubai.isDownloading = false;

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    });

            };

            vm.downloadTolls = function () {
                debugger;
                vm.tollStatus.dubai.isDownloading = true;
                vm.tollStatus.dubai.error = null;

                vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');

                let req = {
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
                } else {
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
                }

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
                            if (!preserveOnlineCount)
                                vm.tollsCountBreakup = data.items;
                            else
                                vm.tollsCountBreakup.forEach(x => {
                                    x.processing = false;
                                    x.count = data.items.find(d => d.day == x.day).count;
                                });

                        }).finally(() => callback && callback());
                }

                vm.callbackOnComplete = function () {
                    console.info('callbackOnComplete code run.');
                    vm.tollStatus.dubai.isDownloading = false;

                    getReconciliationSummary(true, null);
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
                            tollAccounts: accs,
                            downloadUnchargedSalikTolls: downloadUnchargedSalikTolls,
                            isEtoll: false
                        });
                    });
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
            vm.exportToExcel = function () {
                debugger;
                var tableId = 'tblTripsOvertime';
                var tab_text = "";

                var dateRange = document.querySelector('input[date-range-picker]').value;
                var account = document.querySelector('select').selectedOptions[0].innerText;

                var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan='2'>" + 'Date Range : ' + dateRange + "</td><td style='font-size:18px;font-weight:bold' colspan='2'>" + 'Account     : ' + account + "</td></tr>"
                tab_text = tab_text + "<br/>" + "<table border='1px'>" + tr + "<tr>";

                var j = 0;
                var tab2 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab2.rows.length; j++) {
                    tab_text = tab_text + tab2.rows[j].cells[0].outerHTML.toUpperCase() + tab2.rows[j].cells[1].outerHTML.toUpperCase();

                    // Only include the content from the first two cells, excluding the last one
                    for (var i = 2; i < tab2.rows[j].cells.length - 1; i++) {
                        tab_text = tab_text + tab2.rows[j].cells[i].outerHTML.toUpperCase();
                    }

                    tab_text = tab_text + "</tr>";
                }

                tab_text = tab_text + "</table>";
                debugger;
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'SalikRecoReport_' + moment().format('DDMMMYY') + '.xls';
                a.click();
            };

            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }
            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
                chromeExtDownloader.downloadTollsV3 && chromeExtDownloader.downloadTollsV3(vm, true);
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
