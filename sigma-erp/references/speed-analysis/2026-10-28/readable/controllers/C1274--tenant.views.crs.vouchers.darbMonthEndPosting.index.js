// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:334447-334817
appModule.controller('tenant.views.crs.vouchers.darbMonthEndPosting.index', [
        '$scope', '$uibModal', 'abp.services.app.toll', 'abp.services.app.tollMonthEndPosting', 'tollDownloader', 'chromeExtDownloader', 'abp.services.app.salikAccount',
        function ($scope, $uibModal, tollService, tollMonthEndPostingService, tollDownloader, chromeExtDownloader, salikAccountService) {
            var vm = this;

            vm.isJvGenerated = false;
            vm.showDateRange = false;
            vm.filters = {};
            vm.allPostingGroupsOptional = abp.setting.get("App.DarbMonthEndPosting.MakeAllPostingGroupsOptional");
            vm.dateRangeModel = { startDate: null, endDate: null };

            const isMv3ExtensionAvailable = () => chromeExtDownloader.isMv3ExtensionAvailable();
            vm.tollStatus = {
                dubai: { isDownloading: false },
                abuDhabi: { isDownloading: false },
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };

            vm.dateRangeModelChange = function () {
                console.log(vm);
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.salikTolls = [];
            vm.salikTolls.TotalCount = null;
            vm.salikAccounts = [];
            vm.selectedSalikAccounts = [];

            var downloadTollsWithExt = abp.features.isEnabled('TMS.Download.From.Chrome.Ext');

            vm.salikMonthEndPosting = [];
            vm.salikMonthEndPosting.totalSum = null;

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.showUnIdentifiedTolls = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/darbMonthEndPosting/showUnIdentifiedDarbsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.darbMonthEndPosting.showUnIdentifiedDarbs as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        unIdentifiedTolls: function () {
                            return vm.salikMonthEndPosting.unIdentifiedTolls;
                        }
                    }
                }).result.then(function (customer) {
                });
            };

            vm.rowId = 1;

            vm.postTollsMonthEnd = function () {
                vm.posting = true;
                vm.rowId = 1;

                //post first row and continue posting till last
                postRow();
            };

            //id: 1 to 7 (2 will be skipped as it will be done with 1)
            function postRow() {
                if (!vm.salikMonthEndPosting.processTollsMonthEndPostings[vm.rowId - 1].generate) {
                    vm.rowId += 1;
                    postRow();
                } else {
                    vm.filters.postingFor = vm.rowId;
                    tollMonthEndPostingService.postDarbsMonthEnd(vm.filters).success(function (data) {
                        vm.salikMonthEndPosting.processTollsMonthEndPostings[vm.rowId - 1].isJvGenerated = data.isSuccessful;
                        if ((vm.rowId == 1 || vm.rowId == 2) && data.isSuccessful && data.stillPending) {
                            postRow();
                        }
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();

                    }).finally(function () {
                        vm.rowId += 1;

                        if (vm.rowId === 2) { //skop row id 2 as it is done with 1
                            vm.salikMonthEndPosting.processTollsMonthEndPostings[vm.rowId - 1].isJvGenerated = true;
                            vm.rowId += 1;
                        }

                        if (vm.rowId < 7 || (vm.rowId === 7 && vm.salikMonthEndPosting.processTollsMonthEndPostings[vm.rowId - 1].generate))
                            postRow(); //keep on posting next row
                        else
                            vm.posting = false;
                    });
                }
            }

            function getTollsCount() {
                if (isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, () => {
                        vm.downloadingTolls = true;
                        vm.tollStatus.abuDhabi.isDownloading = true;
                        salikAccountService.getSalikAccountsForExtension({ id: 2 })
                            .success((salikAccResp) => {
                                vm.salikAccounts = salikAccResp.items;
                                vm.tollAccountsDownloadingRes = {
                                    request: {
                                        fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                                        toDate: vm.filters.toDate.format('YYYY-MM-DD'),
                                        downloadBySingleDay: true,
                                        tagNo: [],
                                        isEtoll: true
                                    },
                                    tollAccounts: vm.salikAccounts
                                };

                                vm.callbackOnComplete = () => {
                                    vm.getTollsMonthEndPosting()
                                };

                                chromeExtDownloader.downloadTollsV3(vm, null);
                            });
                    });
                }
                else {
                    var tollsReqToDate = vm.filters.toDate;
                    if (tollsReqToDate > moment())
                        tollsReqToDate = moment();

                    vm.tollsCountLoading = true;

                    if (downloadTollsWithExt) {
                        chromeExtDownloader.checkAndDownload(
                            function success() {
                                salikAccountService.getSalikAccountsForExtension({ id: 2 })
                                    .success(function (data) {
                                        var salikAccounts = data.items;

                                        var request = {
                                            fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                                            toDate: tollsReqToDate.format('YYYY-MM-DD'),
                                            tagNo: [],
                                            salikAccounts: salikAccounts,
                                            isEtoll: true
                                        };

                                        chromeExtDownloader.getSalikCount(
                                            request,
                                            function reportSalikCountStatus(status) { //function name should never change...
                                                var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();

                                                if (status.error) {
                                                    var msg = status.error + (status.error.indexOf('login') > -1 ? ' Account Name:' + status.salikAccount.username : '');
                                                    abp.message.error(msg);
                                                }
                                                else if (status.reportCount) {
                                                    $scope.vm.salikTolls.TotalCount = status.requestData.totalTolls;
                                                    $scope.vm.salikTolls.AccountWiseCounts = status.requestData.salikAccounts;

                                                    $scope.vm.tollsCountLoading = false;

                                                    $scope.vm.getTollsMonthEndPosting();

                                                    if (!$scope.$$phase) {
                                                        $scope.$digest();
                                                    }
                                                }
                                            },
                                            function error(e) {
                                                vm.tollsCountLoading = false;

                                                if (!$scope.$$phase)
                                                    $scope.$digest();

                                                abp.message.error(e.error);
                                            }
                                        );
                                    })
                                    .error(function (e) { abp.message.error(e); });
                            },
                            function failed(content) {
                                $scope.vm.getTollsMonthEndPosting();
                                vm.tollsCountLoading = false;
                                abp.message.error(content, null, true);
                            });
                    }
                    else {
                        //abp.ajax({
                        //    url: 'https://speedcloudsalikextensionfunctionapp.azurewebsites.net/api/GetTollsCount',
                        //    type: 'POST',
                        //    aync: false,
                        //    data: JSON.stringify({
                        //        tenantId: abp.session.tenantId,
                        //        fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                        //        toDate: tollsReqToDate.format('YYYY-MM-DD')
                        //    })
                        //}).done(function (result) {
                        //    vm.salikTolls = result;
                        //    vm.tollsCountLoading = false;

                        //    vm.getTollsMonthEndPosting();

                        //    $scope.$digest();

                        //}).fail(function (error) {
                        //    console.log(error);
                        //    vm.tollsCountLoading = false;
                        //    $scope.$digest();
                        //});
                        abp.message.error('TMS.Download.From.Chrome.Ext Permission Required.');
                    }
                }
            }

            vm.downloadTolls = function () {

                vm.downloadingTolls = true;

                //vm.salikTolls = [];

                var tollsReqToDate = vm.filters.toDate;
                if (tollsReqToDate > moment())
                    tollsReqToDate = moment();
                var request = {
                    fromDate: vm.filters.fromDate.format('YYYY-MM-DD'),
                    toDate: tollsReqToDate.format('YYYY-MM-DD'),
                    isEtoll: true
                };


                if (downloadTollsWithExt) {

                    chromeExtDownloader.checkAndDownload(
                        function success() {
                            vm.firebaseSalikResponse = {
                                progress: 0,
                                error: null,
                                status: ''
                            };

                            var funcNode = document.getElementById('speedExtReportingSalik');
                            if (funcNode) {
                                funcNode.parentElement.removeChild(funcNode);
                            }

                            var script = document.createElement('script');
                            script.id = 'speedExtReportingSalik';
                            script.appendChild(document.createTextNode(`function reportStatus(status) {
                                var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                                if (status.isComplated || status.error) {
                                    $scope.vm.downloadingTolls = false;

                                    $scope.vm.firebaseSalikResponse.error = status.error;
                                    $scope.vm.firebaseSalikResponse.status = status.status;
                                    $scope.vm.getTollsMonthEndPosting();

                                }
                                else {
                                    $scope.vm.downloadingTolls = true;
                                    $scope.vm.firebaseSalikResponse.error = '';

                                    $scope.vm.firebaseSalikResponse.progress = status.progress;
                                    $scope.vm.firebaseSalikResponse.status = status.status;
                                }

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            }`));
                            (document.body || document.head || document.documentElement).appendChild(script);

                            chromeExtDownloader.downloadTolls(
                                request,
                                null,
                                function error(e) {

                                    vm.downloadTolls = false;

                                    if (!$scope.$$phase)
                                        $scope.$digest();

                                    abp.message.error(e.error);
                                }
                            );
                        },
                        function failed(content) {
                            vm.downloadingTolls = false;
                            abp.message.error(content, null, true);
                        });
                }
                else {

                    tollDownloader.downloadWithProgress(

                        function statusReporter(firebaseResponse) {

                            vm.firebaseSalikResponse = firebaseResponse;

                            if (firebaseResponse.isComplete)
                                vm.downloadingTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                        },

                        request,

                        function errorReporter(reason) {
                            alert(reason);
                        });
                }
            };

            vm.processTollsMonthEndPosting = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.showDateRange ? vm.filters.fromDate : moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = vm.showDateRange ? vm.filters.toDate : moment(vm.filters.monthYear).endOf('month').endOf('day');
                getTollsCount();

            };


            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };


            vm.getTollsMonthEndPosting = function () {
                tollService.processDarbsMonthEndPosting(vm.filters).success(function (data) {
                    vm.salikMonthEndPosting = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

        }
    ]);
