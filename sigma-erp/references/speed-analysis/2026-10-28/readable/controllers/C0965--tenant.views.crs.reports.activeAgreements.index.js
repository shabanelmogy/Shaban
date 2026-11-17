// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:262182-262647
appModule.controller('tenant.views.crs.reports.activeAgreements.index', [
        '$scope', 'abp.services.app.outStandingAgreementReport', 'utilities', 'tollDownloader', 'abp.services.app.directory', 'fineDownloader', 'abp.services.app.trafficFile', 'chromeExtDownloader',
        function ($scope, outStandingAgreementReportService, utilities, tollDownloader, directoryService, fineDownloader, trafficFileService, chromeExtDownloader) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.filters = {

                salesPerson: null,

            };


            vm.searchUser = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.user = response.data.items;
                });
            };


            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isFineModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.agreements = [];
            vm.downloadingFines = false;
            vm.downloadingTolls = false;
            vm.estimateChargesTillNow = false;

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };


            vm.exportToExcel = function () {
                var tab_text = "<h3>Active Agreements</h3><br />";
                tab_text = tab_text + "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('activeAgremmentsTable'); // id of table
                var tab2 = document.getElementById('closedAgreementsTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table> <br />";

                tab_text = tab_text + "<h3>OutStanding Closed Agreements</h3><br />";



                tab_text = tab_text + "<table border='1px'><tr>";
                var i = 0;
                // var tab2 = document.getElementById('closedAgreementsTable'); // id of table
                for (i = 0; i < tab2.rows.length; i++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[i].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'AgreementsReport.xls';
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


            const setIntervalX = (fn, delay, times) => {
                if (!times || getElementById('speedExt')) return;

                setTimeout(() => {
                    fn();
                    setIntervalX(fn, delay, times - 1);
                }, delay);
            };

            vm.refresh = function () {
                //if salik or fine enabled then first download then get agreement list after downloading
                if (vm.isSalikModuleEnabled || vm.isFineModuleEnabled) {
                    if (vm.isSalikModuleEnabled)
                        downloadTolls();

                    //if Dubai/Abu Dhabi Fines are enabled
                    if (vm.isFineModuleEnabled)
                        downloadFines();

                } else {
                    getAgreements();
                }
            };

            //function downloadTolls() {
            //    vm.downloadingTolls = true;
            //    tollService.downloadAllTolls(
            //    ).success(function (result) {

            //    }).finally(function () {
            //        vm.downloadingTolls = false;

            //        if (vm.downloadingTolls == false && vm.downloadingFines == false) {
            //            getAgreements();
            //        }
            //    });
            //}

            //function downloadFines() {
            //    vm.downloadingFines = true;
            //    fineService.downloadAllFines(
            //    ).success(function (result) {

            //    }).finally(function () {
            //        vm.downloadingFines = false;

            //        if (vm.downloadingTolls == false && vm.downloadingFines == false) {
            //            getAgreements();
            //        }
            //    });
            //}

            // On Estimate Charges Change
            vm.onEstimateChargesTillNow = function () {
                getAgreements();
            };

            function getAgreements() {
                vm.loading = true;
                outStandingAgreementReportService.getOpenAgreements({ estimateChargesTillNow: vm.estimateChargesTillNow }).success(function (data) {
                    vm.agreements = data.items;

                    vm.sumTotalCharges = 0.0;
                    vm.sumTollsCharges = 0.0;
                    vm.sumFinesCharges = 0.0;
                    vm.sumTotal = 0.0;
                    vm.sumReceived = 0.0;
                    vm.sumDue = 0.0;

                    angular.forEach(vm.agreements, function (value, key) {
                        value.totalCharges = utilities.round(value.totalCharges, 2);
                        value.tollsCharges = utilities.round(value.tollsCharges, 2);
                        value.finesCharges = utilities.round(value.finesCharges, 2);
                        value.sum = utilities.round(value.sum, 2);
                        value.received = utilities.round(value.received, 2);
                        value.due = utilities.round(value.due, 2);

                        vm.sumTotalCharges += value.totalCharges;
                        vm.sumTollsCharges += value.tollsCharges;
                        vm.sumFinesCharges += value.finesCharges;
                        vm.sumTotal += value.sum;
                        vm.sumReceived += value.received;
                        vm.sumDue += value.due;
                    });

                    //vm.sumTotalCharges = utilities.round(vm.sumTotalCharges, 2);
                    //vm.sumTollsCharges = utilities.round(vm.sumTollsCharges, 2);
                    //vm.sumFinesCharges = utilities.round(vm.sumFinesCharges, 2);
                    //vm.sumTotal = utilities.round(vm.sumTotal, 2);
                    //vm.sumReceived = utilities.round(vm.sumReceived, 2);
                    //vm.sumDue = utilities.round(vm.sumDue, 2);

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.refreshClosed = function () {
                getOutStandingClosedAgreements();
            };

            // Getting OutStanding Closed Agreements
            function getOutStandingClosedAgreements() {
                vm.loadingClosed = true;
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                outStandingAgreementReportService.getOutStandingClosedAgreements(vm.filters)
                    .success(function (data) {
                        vm.closeOutStandingAgreements = data.items;

                        vm.sumTotalOutstanding = 0.0;
                        vm.sumReceivedOutstanding = 0.0;
                        vm.sumDueOutstanding = 0.0;

                        angular.forEach(vm.closeOutStandingAgreements, function (value, key) {
                            value.totalCharges = utilities.round(value.totalCharges, 2);
                            value.received = utilities.round(value.received, 2);
                            value.due = utilities.round(value.due, 2);

                            vm.sumTotalOutstanding += value.totalCharges;
                            vm.sumReceivedOutstanding += value.received;
                            vm.sumDueOutstanding += value.due;
                        });

                        vm.sumTotalOutstanding = utilities.round(vm.sumTotalOutstanding, 2);
                        vm.sumReceivedOutstanding = utilities.round(vm.sumReceivedOutstanding, 2);
                        vm.sumDueOutstanding = utilities.round(vm.sumDueOutstanding, 2);

                    }).finally(function () {
                        vm.loadingClosed = false;
                    });
            }

            var salikRequest = {
                fromDate: null,
                toDate: null,
                tagNo: []
            };

            function downloadTolls() {

                vm.downloadingTolls = true;

                //debugger;
                const waitLoading = setInterval(
                    function () {

                        if (!document.getElementById('speedExt'))
                            return;

                        clearInterval(waitLoading);

                        //chromeExtDownloader.checkAndDownload(
                        //function success() {
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
                                    var $scope = angular.element( document.querySelector('.portlet,.light')).scope();
                                    if (status.isComplated || status.error) {
                                        $scope.vm.downloadingTolls = false;

                                        $scope.vm.firebaseSalikResponse.error = status.error;
                                        $scope.vm.firebaseSalikResponse.status = status.status;
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
                            salikRequest,
                            null,
                            function error(e) {

                                vm.downloadTolls = false;

                                if (!$scope.$$phase)
                                    $scope.$digest();

                                abp.message.error(e.error);
                            }
                        );
                        //},
                        //function error(e) {
                        //    vm.downloadTolls = false;

                        //    if (!$scope.$$phase)
                        //        $scope.$digest();

                        //    abp.message.error(e, null, true);
                        //});

                    }, 1000);


            }

            function downloadFines() {

                vm.downloadingFines = true;
                vm.traffFilesDownloadingRes = [];

                //Due to extension script rendering
                var dlF = setInterval(function () {
                    clearInterval(dlF);
                    trafficFileService.getTrafficFiles()
                        .success(function (r) {

                            for (var i in r.items) {
                                vm.traffFilesDownloadingRes.push({
                                    isComplete: false,
                                    status: '',
                                    progress: 0,
                                    error: '',
                                    trafficFile: r.items[i]
                                });
                            }

                            if (!$scope.$$phase) $scope.$digest();

                            chromeExtDownloader.downloadFines(
                                {
                                    trafficFileIds: r.items
                                },

                                `function processCaptcha(msg) {
                                        var $scope = angular.element(document.querySelector('.portlet,.light')).scope();
                                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && msg.state.indexOf('Abu') > -1);
                                        trafficFile.captchaSrc = msg.captcha;
                                        trafficFile.captchaTxt = '';

                                        if (!$scope.$$phase) {
                                            $scope.$digest();
                                        }
                                    }

                                function reportFineStatus(msg) {
                                        var $scope = angular.element(document.querySelector('.portlet,.light')).scope();
                                        var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                                        trafficFile.progress = msg.progress;
                                        trafficFile.error = msg.error;
                                        trafficFile.status = msg.status;

                                        if (trafficFile.error)
                                            trafficFile.isComplete = true;
                                        else
                                            trafficFile.isComplete = msg.isComplated;

                                        if (msg.downloadingComplete) {
                                            $scope.vm.downloadingFines = false;
                                            $scope.vm.onEstimateChargesTillNow();
                                        }

                                        if (!$scope.$$phase) {
                                            $scope.$digest();
                                        }
                                    }`,
                                function error() {
                                    vm.downloadingFines = false;

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }
                            );
                        });
                }, 1500);
            }

            vm.showError = function (error, isFine) {
                var title = 'FinesDownloadingError';
                if (!isFine)
                    title = "SalikDownloadingError";

                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            //salesperson
            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };


            function init() {

                getOutStandingClosedAgreements();

                //setTimeout(function () { vm.refresh(); }, 1500);
            }

            vm.sendCaptcha = function (row) {
                chromeExtDownloader.sendCaptcha(row);
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Tolls/Fines may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                        if (r) {

                            if (vm.downloadingTolls) {
                                vm.downloadingTollsCancled = true;
                                chromeExtDownloader.closeAllTollsTabs();
                                vm.downloadingTollsCancled = true;
                            }

                            if (vm.downloadingFines) {
                                vm.downloadingFinesCancled = true;
                                chromeExtDownloader.closeAllFinesTabs();
                                vm.downloadingFinesCancled = true;
                            }
                        }
                    });
            };

            init();
        }
    ]);
