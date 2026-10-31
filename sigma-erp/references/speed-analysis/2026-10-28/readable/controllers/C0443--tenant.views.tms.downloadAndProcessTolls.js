// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:115113-115380
appModule.controller('tenant.views.tms.downloadAndProcessTolls', [
        '$scope', 'abp.services.app.toll', 'chromeExtDownloader', 'abp.services.app.salikAccount',
        function ($scope, tollAppService, chromeExtDownloader, salikAccountAppService) {
            var vm = this;

            vm.downloadAllAccountsSummary = null;
            vm.downloadSelectedTagsSummary = null;
            vm.downloadingTolls = false;
            vm.tollStatus = {
                dubai: { isDownloading: false },
                abuDhabi: { isDownloading: false }
            };

            vm.processedTollsTotalCount = 0;
            vm.processedTollsWithAgreementCount = 0;
            vm.processedTollsWithCustomerCount = 0;

            vm.autoProcessAfterDownloading = abp.setting.getBoolean("App.General.Salik.AutoProcessAfterDownloading");
            vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Rental.Agreements');
            if (!vm.isRentalOrLeaseEnabled)
                vm.isRentalOrLeaseEnabled = abp.features.isEnabled('CRS.Lease.Agreements');

            vm.isLatestVersion = false;

            vm.selected = 'all';
            vm.downloadingTolls = false;
            vm.downloadingFomExt = false;

            vm.filters = {
                fromDate: null,
                toDate: null,
                tagNos: [],
                plateNosWithTag: null
            };

            vm.salikAccountStatusList = [];

            vm.filters = {
                fromDate: null,
                toDate: null
            };

            var currentPage = 1;
            var maxCountToProcessInOneRequest = 100;

            vm.processFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateNo: null,
                contactId: null,
                includePreviousUnInvoicedTolls: false,
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };

            vm.downloadTolls = function () {
                vm.downloadingTolls = true;
                let requestData = vm.filters;
                let tagsAccountList = [];

                //if tags based downloading then append filter info as request parems
                if (vm.selected === 'selected') {
                    vm.filters.tagNos = [];

                    angular.forEach(vm.filters.plateNosWithTag, function (obj, key) {
                        vm.filters.tagNos.push(obj.tagNo);
                        if (!tagsAccountList.find(x => obj.account))
                            tagsAccountList.push(obj.account.replace("(Not-Active)", ""));
                    });

                    try {
                        JSON.parse('[' + vm.filters.tagNos + ']');
                    } catch (e) {
                        abp.message.error(
                            app.localize('Invalid Tags'), app.localize('Tags Provided Are Invalid') //app.localize('PressOkToIgnoreFine'),
                        );
                        vm.downloadingTolls = false;
                    }

                    requestData.tagNo = JSON.parse('[' + vm.filters.tagNos + ']'); //as tagNos are comma string then convert to it as string array representation
                }
                else if (vm.selected === 'date') {
                    requestData = vm.filters;
                    requestData.tagNo = [];
                }

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    vm.downloadingTolls = true;
                    vm.tollAccountsDownloadingRes = {
                        request: requestData,
                        tollAccounts: (tagsAccountList.length ? vm.salikAccounts.filter(x => tagsAccountList.find(y => y == x.username)) : (vm.selectedSalikAccounts && vm.selectedSalikAccounts.length ? vm.selectedSalikAccounts : vm.salikAccounts))
                    };
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                    return;
                }

                var funcNode = document.getElementById('speedExtReportingSalik');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }
                debugger;
                var script = document.createElement('script');
                script.id = 'speedExtReportingSalik';
                script.appendChild(document.createTextNode(`function reportStatus(status) {
                                var $scope = angular.element('#appController').scope();
                                if (status.isComplated || status.error) {
                                    $scope.vm.downloadingTolls = false;
                                    $scope.vm.downloadingFomExt = false;

                                    $scope.vm.tollStatus.dubai.error = status.error;
                                    $scope.vm.tollStatus.dubai.status = status.status;

                                    if($scope.vm.autoProcessAfterDownloading){
                                        $scope.vm.filters.downloadFromDate = moment().add('days', -5);
                                        $scope.vm.filters.downloadToDate = moment();
                                        $scope.vm.processTolls();
                                    }

                                }
                                else {
                                    $scope.vm.downloadingTolls = true;
                                    $scope.vm.downloadingFomExt = true;
                                    $scope.vm.tollStatus.dubai.error = '';

                                    $scope.vm.tollStatus.dubai.progress = status.progress;
                                    $scope.vm.tollStatus.dubai.status = status.status;
                                }

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            }`));
                (document.body || document.head || document.documentElement).appendChild(script);

                chromeExtDownloader.downloadTolls(
                    requestData,
                    null,
                    function error(e) {

                        vm.downloadingTolls = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error);
                    });

            };

            vm.downloadTollsV3 = function () {

                vm.tollStatus.dubai.isDownloading = true;

                vm.callbackOnComplete = function () {
                    if (vm.autoProcessAfterDownloading) {
                        vm.filters.downloadFromDate = moment().add('days', -4).startOf('day');
                        vm.filters.downloadToDate = moment().endOf('day');
                        vm.processTolls();
                    }
                };

                chromeExtDownloader.downloadTollsV3(vm, null);
            };

            vm.showError = function (error) {
                console.log(error);
                var title = "SalikDownloadingError";
                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.searchPlateNo = function ($select) {
                if (!$select.search) return;
                vm.filters.name = $select.search;
                vm.filters.server = 1;

                return tollAppService.searchTollPlateAndTags(vm.filters).then(function (response) {
                    vm.plateNos = response.data; //string list of plate numbers
                });
            };

            vm.resetProcessingDate = () => {
                vm.processFilters.skipCount = 0;
                vm.processedTollsTotalCount = 0;
                currentPage = 1;
                vm.processedTollsWithAgreementCount = 0;
                vm.processedTollsWithCustomerCount = 0;
            };

            vm.processTolls = function () {

                if (vm.filters.plateNo && vm.filters.tagNo) {
                    abp.message.error('Provide only one filter PlateNo. OR E-Tag.');
                    return;
                }

                vm.processing = true;
                vm.showProcessingInfo = true;

                vm.processFilters.fromDate = moment(vm.filters.downloadFromDate) !== null ? moment(new Date(vm.filters.downloadFromDate._d.getFullYear(), vm.filters.downloadFromDate._d.getMonth(), vm.filters.downloadFromDate._d.getDate(), '00', '00', '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.processFilters.toDate = moment(vm.filters.downloadToDate) !== null ? moment(new Date(vm.filters.downloadToDate._d.getFullYear(), vm.filters.downloadToDate._d.getMonth(), vm.filters.downloadToDate._d.getDate(), '23', '59', '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.processFilters.includePreviousUnInvoicedTolls = false;
                vm.processFilters.plateNo = vm.filters.plateNo;
                vm.processFilters.tagNo = vm.filters.tagNo;
                vm.processFilters.server = 1;

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

            vm.extSalikStatus = {
                progress: 0,
                isCompleted: false,
                error: ''
            };

            //function checkExtAvailable() {
            //    var event = new CustomEvent('checkExtAvailable', {
            //        detail: {}
            //    });
            //    event.initEvent('checkExtAvailable');
            //    var rtn = document.dispatchEvent(event);
            //    if (rtn && document.getElementById('speedExt'))
            //        return true;
            //    else
            //        return false;
            //}

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };

            (function getSalikAccounts() {
                salikAccountAppService.getSalikAccountsForExtension({ id: 1 })
                    .success(function (r) {
                        vm.salikAccounts = r.items;
                    });
            })();
        }
    ]);
