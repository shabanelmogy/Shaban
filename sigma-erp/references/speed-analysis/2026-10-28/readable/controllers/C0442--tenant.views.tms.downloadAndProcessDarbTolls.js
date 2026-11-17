// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114841-115110
appModule.controller('tenant.views.tms.downloadAndProcessDarbTolls', [
        '$scope', 'abp.services.app.salikAccount', 'chromeExtDownloader', 'abp.services.app.toll',
        function ($scope, salikAccountAppService, chromeExtDownloader, tollAppService) {
            var vm = this;

            vm.autoProcessAfterDownloading = abp.setting.getBoolean("App.General.Darb.AutoProcessAfterDownloading");
            vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Rental.Agreements');
            if (!vm.isRentalOrLeaseEnabled)
                vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Lease.Agreements');

            vm.selected = 'all';
            vm.tollStatus = {
                dubai: { isDownloading: false },
                abuDhabi: { isDownloading: false }
            };

            var currentPage = 1;
            var maxCountToProcessInOneRequest = 100;
            vm.processedTollsTotalCount = 0;
            vm.processedTollsWithAgreementCount = 0;


            vm.filters = {
                fromDate: null,
                toDate: null

            };
            vm.processFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateNo: null,
                contactId: null,
                includePreviousUnInvoicedTolls: false,
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest,
                server: 2 //Darb
            };


            var eTollFeatureEnabled = abp.features.isEnabled('CRS.Tolls.AbuDhabi');
            var content = '<span style="font-size:28px;">Speed Extension is not available.</span><br/><span style="font-size:18px;">Please download from <a href = "https://chrome.google.com/webstore/detail/speed-extension/nhhdkapljemlnpbdhjnbmacblgbnkebe" target="_blank"> here.</a ></span> ';


            vm.downloadTolls = function () {
                if (!eTollFeatureEnabled) {
                    abp.message.error('', 'EToll Feature should be Enabled.');
                }
                else {
                    var requestData = null;
                    vm.isLatestVersion = chromeExtDownloader.isLatestVersion();

                    //if tags based downloading then append filter info as request parems
                    if (vm.selected === 'selected') {
                        requestData = vm.filters;
                        vm.filters.tagNos = [];
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

                    if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                        vm.tollStatus.abuDhabi.isDownloading = true;
                        vm.tollAccountsDownloadingRes = { request: salikRequest, tollAccounts: vm.selectedSalikAccounts.length ? vm.selectedSalikAccounts : vm.salikAccounts };
                        chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                        return;
                    }

                    var funcNode = document.getElementById('speedExtReportingSalik');
                    if (funcNode) {
                        funcNode.parentElement.removeChild(funcNode);
                    }

                    let fnc = `function reportStatus(status) {
                                var $scope = angular.element('#appController').scope();
                                if (status.isComplated || (status.error && !status.error === {})) {
                                   
                                    $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                                    $scope.vm.tollStatus.abuDhabi.error = status.error;
                                    $scope.vm.tollStatus.abuDhabi.status = status.status;

                                    $scope.vm.tollStatus.dubai.isDownloading = false;

                                    if ((!status.error || status.error === {}) && !$scope.vm.tollStatus.abuDhabi.isDownloading) { }

                                    if($scope.vm.autoProcessAfterDownloading){
                                        $scope.vm.filters.downloadFromDate = moment().add('days', -5);
                                        $scope.vm.filters.downloadToDate = moment();
                                        $scope.vm.processTolls();
                                    }
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
                }
            };

            vm.downloadTollsV3 = function () {

                vm.tollStatus.abuDhabi.isDownloading = true;

                vm.callbackOnComplete = function () {

                    if (autoProcessAfterDownloading) {
                        if (vm.processing) return;

                        vm.filters.downloadFromDate = moment().add('days', -4).startOf('day');
                        vm.filters.downloadToDate = moment().endOf('day');
                        vm.processing = true;
                        vm.showProcessingInfo = true;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        vm.processTolls();
                    }
                };

                chromeExtDownloader.downloadTollsV3(vm, null);

                if (!$scope.$$phase)
                    $scope.$digest();
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

            vm.showError = function (error) {
                var title = "DarbDownloadingError";
                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };

            (function getSalikAccounts() {
                salikAccountAppService.getSalikAccountsForExtension({ id: 2 })
                    .success(function (r) {
                        vm.salikAccounts = r.items;
                    });
            })();

            vm.processTolls = function () {

                //if (!vm.filters.plateNo) {
                //    abp.message.error('Provide only one filter PlateNo.');
                //    return;
                //}

                vm.processing = true;
                vm.showProcessingInfo = true;

                vm.processFilters.fromDate = moment(vm.filters.downloadFromDate) !== null ? moment(new Date(vm.filters.downloadFromDate._d.getFullYear(), vm.filters.downloadFromDate._d.getMonth(), vm.filters.downloadFromDate._d.getDate(), '00', '00', '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.processFilters.toDate = moment(vm.filters.downloadToDate) !== null ? moment(new Date(vm.filters.downloadToDate._d.getFullYear(), vm.filters.downloadToDate._d.getMonth(), vm.filters.downloadToDate._d.getDate(), '23', '59', '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.processFilters.includePreviousUnInvoicedTolls = false;
                vm.processFilters.plateNo = vm.filters.plateNo;

                tollAppService.processTolls(vm.processFilters).success(function (result) {
                    vm.processedTollsTotalCount += result.processedCount;
                    vm.processedTollsWithAgreementCount += result.onAgreementsCount;
                    vm.processedTollsWithCustomerCount += result.onCustomersCount;

                    var moreDataToProcess = result.processedCount > 0;
                    if (moreDataToProcess) {
                        vm.processFilters.skipCount = currentPage * maxCountToProcessInOneRequest;
                        currentPage += 1;
                        vm.processTolls();
                    } else {
                        vm.processing = false;
                    }

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                }).finally(function () {

                });
            };
        }
    ]);
