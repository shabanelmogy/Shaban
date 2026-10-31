// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:479199-479548
appModule.controller('tenant.views.tms.darb.downloadTolls', [
        '$scope', 'tollDownloader', 'abp.services.app.toll', 'chromeExtDownloader', 'abp.services.app.salikAccount',
        function ($scope, tollDownloader, tollAppService, chromeExtDownloader, salikAccountAppService) {
            var vm = this;

            vm.downloadAllAccountsSummary = null;
            vm.downloadSelectedTagsSummary = null;

            var salikFeatureEnabled = abp.features.isEnabled('TMS.Salik.Dubai') || abp.features.isEnabled('CRS.Tolls.Salik');
            var eTollFeatureEnabled = abp.features.isEnabled('TMS.Tolls.AbuDhabi') || abp.features.isEnabled('CRS.Tolls.AbuDhabi');

            vm.isLatestVersion = false;
            vm.selectedSalikAccounts = [];

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
                server: 2
            };

            vm.downloadByDateSummary = [];
            var content = '<span style="font-size:28px;">Speed Extension is not available.</span><br/><span style="font-size:18px;">Please download from <a href = "https://chrome.google.com/webstore/detail/speed-extension/nhhdkapljemlnpbdhjnbmacblgbnkebe" target="_blank"> here.</a ></span> ';

            var dateFormat = abp.setting.get("App.General.DateFormat");
            if (!dateFormat) dateFormat = 'dd/MM/yyyy';

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(dateFormat);
            };

            vm.downloadTolls = function () {
                if (!salikFeatureEnabled && !eTollFeatureEnabled) {
                    abp.message.error('', 'One of the Features Salik | EToll should be Enabled.');
                }
                else {

                    vm.tollStatus = {
                        dubai: { isDownloading: false },
                        abuDhabi: { isDownloading: false }
                    };

                    var requestData = null;
                    vm.isLatestVersion = chromeExtDownloader.isLatestVersion();

                    //if tags based downloading then append filter info as request parems
                    if (vm.selected === 'selected') {
                        requestData = vm.filters;
                        vm.filters.tagNos = [];
                        vm.filters.plateNos = [];
                        angular.forEach(vm.filters.plateNosWithTag, function (obj, key) {
                            if (obj.state === "AUH") {
                                vm.filters.plateNos.push(obj.plateNo);
                            }
                            else {
                                vm.filters.tagNos.push(obj.tagNo);
                            }

                        });

                        try {
                            JSON.stringify('[' + vm.filters.tagNos + ']');
                        } catch (e) {
                            abp.message.error(
                                app.localize('Invalid Tags'), app.localize('Tags Provided Are Invalid') //app.localize('PressOkToIgnoreFine'),
                            );

                            vm.tollStatus.abuDhabi.isDownloading = false;
                            vm.tollStatus.dubai.isDownloading = false;
                        }

                        requestData.tagNo = JSON.stringify('[' + vm.filters.tagNos + ']'); //as tagNos are comma string then convert to it as string array representation
                    }
                    else if (vm.selected === 'date') {
                        requestData = vm.filters;
                        requestData.tagNo = [];
                    }


                    //if (checkExtAvailable()) {

                    var salikRequest = { isEtoll: true };

                    if (vm.selected === 'selected') {
                        salikRequest.tagNo = vm.filters.tagNos;
                        salikRequest.plateNos = vm.filters.plateNos;

                        vm.selectedSalikAccounts = [];
                        salikRequest.fromDate = vm.filters.fromDate.format('YYYY-MM-DD');
                        salikRequest.toDate = vm.filters.toDate.format('YYYY-MM-DD');
                    }
                    else if (vm.selected === 'date') {
                        salikRequest.fromDate = vm.filters.fromDate.format('YYYY-MM-DD');
                        salikRequest.toDate = vm.filters.toDate.format('YYYY-MM-DD');
                        salikRequest.tagNo = [];
                        salikRequest.plateNos = [];
                        salikRequest.salikAccounts = vm.selectedSalikAccounts;
                    }
                    else {
                        salikRequest.tagNo = [];
                        salikRequest.plateNos = [];
                        vm.selectedSalikAccounts = [];
                    }

                    var funcNode = document.getElementById('speedExtReportingSalik');
                    if (funcNode) {
                        funcNode.parentElement.removeChild(funcNode);
                    }

                    if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                        vm.tollStatus.abuDhabi.isDownloading = true;
                        vm.downloadAllAccountsSummary = [];
                        vm.tollAccountsDownloadingRes = { request: salikRequest, tollAccounts: vm.selectedSalikAccounts.length ? vm.selectedSalikAccounts : vm.salikAccounts };
                        chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                        return;
                    }

                    let fnc = `function reportStatus(status) {
                                var $scope = angular.element('#appController').scope();
                                if (status.isComplated || (status.error && !status.error === {})) {
                                    
                                        $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                                        $scope.vm.tollStatus.abuDhabi.error = status.error;
                                        $scope.vm.tollStatus.abuDhabi.status = status.status;

                                        $scope.vm.tollStatus.dubai.isDownloading = false;

                                    if ((!status.error || status.error === {}) && !$scope.vm.tollStatus.abuDhabi.isDownloading)
                                        $scope.vm.getSummary();
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
                            }
                                `;

                    var script = document.createElement('script');
                    script.id = 'speedExtReportingSalik';
                    script.appendChild(document.createTextNode(fnc));
                    (document.body || document.head || document.documentElement).appendChild(script);

                    chromeExtDownloader.downloadTolls(
                        salikRequest,
                        null,
                        function error(e) {

                            vm.downloadTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error);
                        });
                    //}
                    //else {
                    //    vm.tollStatus.abuDhabi.isDownloading = false;
                    //    abp.message.error(content, null, true);
                    //}
                }
            };

            vm.downloadTollsV3 = function () {
                vm.callbackOnComplete = function () {
                    vm.getSummary();
                };

                chromeExtDownloader.downloadTollsV3(vm, null);
            };

            vm.showError = function (error) {
                var title = "DarbDownloadingError";
                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;

                tollAppService.searchTollPlateAndTags(vm.filters).then(function (response) {
                    let searchData = [];

                    //removing results on Not-Active salik accounts
                    response.data.forEach(r => {
                        if (r.account.indexOf("Not-Active") == -1) searchData.push(r);
                    });

                    debugger;
                    response = null;
                    vm.plateNos = searchData; //string list of plate numbers
                });
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
                vm.tollStatus.abuDhabi.isDownloading = true;
                if (vm.selected === 'all') {
                    //Get summary for the user ....
                    tollAppService.downloadForAllAccountSummary({ server: 2 })
                        .success(function (result) {
                            vm.downloadAllAccountsSummary = result.items;

                            vm.tollStatus.abuDhabi.isDownloading = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.tollStatus.abuDhabi.isDownloading = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        });
                }
                else if (vm.selected === 'date') {

                    var accountIds = [];
                    for (var i in vm.selectedSalikAccounts) {
                        accountIds.push(vm.selectedSalikAccounts[i].id);
                    }

                    let r = {
                        fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                        toDate: vm.filters.toDate.format('YYYY-MM-DD'),
                        accountIds: accountIds,
                        tollServer: 2
                    };

                    tollAppService.getTollSummaryByDate(r)
                        .success(function (result) {
                            console.log(result);
                            vm.downloadByDateSummary = result.items;

                            vm.tollStatus.abuDhabi.isDownloading = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.tollStatus.abuDhabi.isDownloading = false;
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        });
                }

                else {
                    let plateNosList = [];
                    vm.filters.plateNosWithTag.forEach(
                        function (plateNo) {
                            plateNosList.push(plateNo.plateNo);
                        });
                    tollAppService.getTollSummaryByDateAndPlateNo({ fromDate: vm.filters.fromDate, toDate: vm.filters.toDate, plateNos: plateNosList, Servers: 2 })
                        .success(function (result) {
                            vm.downloadSelectedTagsSummary = result.items;

                            vm.totalAmount = 0;
                            vm.totalTollsCount = 0;
                            angular.forEach(vm.downloadSelectedTagsSummary, function (item) {
                                vm.totalAmount += item.amount;
                                vm.totalTollsCount += item.tollsCount;
                            });

                            vm.tollStatus.abuDhabi.isDownloading = false;

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }

                        })
                        .error(function (exception) {
                            console.log(exception);
                            abp.message.error(exception);

                            vm.tollStatus.abuDhabi.isDownloading = false;
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

            function checkExtAvailable() {
                var event = new CustomEvent('checkExtAvailable', {
                    detail: {}
                });
                event.initEvent('checkExtAvailable');
                var rtn = document.dispatchEvent(event);
                if (rtn && document.getElementById('speedExt'))
                    return true;
                else
                    return false;
            }

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };

            (function getSalikAccounts() {
                salikAccountAppService.getSalikAccountsForExtension({ id: 2 })
                    .success(function (r) {
                        vm.salikAccounts = r.items;
                    });
            })();

        }
    ]);
