// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:475427-476168
appModule.controller('tenant.views.tms.dashboard.index', [
        '$scope', '$uibModal', 'abp.services.app.toll', 'abp.services.app.uaeFine', 'fineDownloader', 'tollDownloader', 'chromeExtDownloader',
        function ($scope, $uibModal, tollAppService, finesService, fineDownloader, tollDownloader, chromeExtDownloader) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = [];

            vm.darbTollBusy = false;
            vm.trafficFiles = [];
            vm.isValidForm = false;
            vm.fines = [];
            vm.tolls = [];
            vm.darbTolls = [];
            vm.darbPlateNos = [];
            vm.countSearchedPlateNo = 0;
            vm.countToSearchPlateNo = 0;
            vm.totalAmountWithSurcharge = 0;
            vm.totalChargedAmmount = 0;
            vm.totalCollectedAmount = 0;
            vm.totalDueAmount = 0;
            vm.totalTollAmount = 0;
            vm.loadingTolls = false;
            vm.loadingFines = false;
            vm.loadingDarbTolls = false;
            vm.downloadingFines = false;
            vm.downloadingTolls = false;

            vm.tollStatus = {
                dubai: { isDownloading: false },
                abuDhabi: { isDownloading: false }
            };
            var eTollFeatureEnabled = abp.features.isEnabled('TMS.Tolls.AbuDhabi') || abp.features.isEnabled('CRS.Tolls.AbuDhabi');

            var content = '<span style="font-size:28px;">Speed Extension is not available.</span><br/><span style="font-size:18px;">Please download from <a href = "https://chrome.google.com/webstore/detail/speed-extension/nhhdkapljemlnpbdhjnbmacblgbnkebe" target="_blank"> here.</a ></span> ';

            vm.isFinesEnabled = abp.features.isEnabled("TFMS");
            vm.isDarbEnable = abp.features.isEnabled("TMS.Tolls.AbuDhabi");
            vm.isSalikEnable = abp.features.isEnabled("TMS.Salik.Dubai");

            vm.permissions = {
                tms: abp.auth.hasPermission('Pages.TMS'),
                tfms: abp.auth.hasPermission('Pages.TFMS')
            };

            vm.filters = {
                filterLines: [],
                darbFilterLines: [],
                agreementNo: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.searchDarbPlateNo = function ($select) {
                debugger;
                if (!$select.search) return;
                vm.filters.name = $select.search;
                return tollAppService.searchTollPlateAndTags({ name: vm.filters.name, server: 2 }).then(function (response) {
                    vm.darbPlateNos = response.data; //string list of plate numbers
                });
            };


            vm.getlocalDateTimeForTolls = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateTimeFormat); //moment(moment(date)).format(vm.dateTimeFormat).utc();
                }
                else {
                    return "";
                }
            };

            vm.getServerName = function (server) {
                if (server === 2) {
                    return app.localize('AbuDhabi');
                }
                else
                    return app.localize('Dubai');
            };

            vm.counFilterLines = 0;

            function filterObject() {
                var line = new Object();
                line.fromDate = moment(moment().format('YYYY-MM-DD')).utc(); //moment(moment().format('YYYY-MM-DD')).utc();
                line.fromTime = moment(moment().startOf('day')).utc();//moment(new Date()).startOf('day').utc();
                line.toDate = moment(moment().format('YYYY-MM-DD')).utc();//moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
                line.toTime = moment(moment().endOf('day')).utc();//moment(new Date()).endOf('day').utc();
                line.finesVehicleArray = [];
                line.finePlateNoArray = null;
                line.plateNo = null;
                line.tollPlateNo = null;
                line.counFilterLines = vm.counFilterLines++;
                return line;
            }

            vm.addRow = function (isDarb) {
                if (isDarb)
                    vm.filters.darbFilterLines.push(filterObject());
                else
                    vm.filters.filterLines.push(filterObject());
            };

            vm.removeDarbTollRow = function (obj) {
                let index = vm.darbTolls.indexOf(obj);
                vm.darbTolls.splice(index, 1);
            }

            vm.removeDarbOrFineRow = function (obj, isDarb) {
                debugger;
                if (isDarb) {
                    if (vm.filters.darbFilterLines.length > 1) {
                        let index = vm.filters.darbFilterLines.indexOf(obj);
                        vm.filters.darbFilterLines.splice(index, 1);
                    }
                }
                else {
                    if (vm.filters.filterLines.length > 1) {
                        let index = vm.filters.filterLines.indexOf(obj);
                        vm.filters.filterLines.splice(index, 1);
                    }
                }
            };

            function appendDateAndTime(callback) {
                try {
                    for (var i in vm.filters.filterLines) {
                        var value = vm.filters.filterLines[i];
                        var fromDateTime = value.fromDate.format('YYYY-MM-DD');
                        fromDateTime += "T" + value.fromTime.format('HH:mm') + ":00.000" + value.fromTime.format('Z');

                        var toDateTime = value.toDate.format('YYYY-MM-DD');
                        toDateTime += "T" + value.toTime.format('HH:mm') + "59.999" + value.fromTime.format('Z');

                        value.fromDateTime = fromDateTime;
                        value.toDateTime = toDateTime;
                    }

                    if (callback !== null)
                        callback && callback();

                } catch (e) {
                    console.log(e);
                }
            }

            vm.downloadFines = function () {

                if (checkExtAvailable()) {
                    //Check is selected vehicles has traffic file associated in system so fines download could be done on those
                    //if there is none then its show error 'Select some vehicles'
                    finesService.getTrafficFilesOnPlateNo(vm.filters)
                        .success(function (response) {
                            if (response.items.length === 0)
                                abp.message.error('Please select some vehicles.');
                            else {
                                vm.downloaderReq.trafficFileIds = null;

                                vm.downloadingFines = true;
                                vm.downloaderReq.trafficFileIds = response.items;

                                //for progress reporing on UI
                                vm.traffFilesDownloadingRes = [];
                                for (var i in response.items) {
                                    vm.traffFilesDownloadingRes.push({
                                        isComplete: false,
                                        status: '',
                                        progress: 0,
                                        error: '',
                                        trafficFile: response.items[i]
                                    });
                                }

                                if (!$scope.$$phase)
                                    $scope.$digest();

                                startDownloading();

                            }
                        })
                        .error(function (err) {
                            console.error(err);
                            vm.downloadFines = false;
                            vm.downloadingFines = false;
                        });
                }
                else {
                    abp.message.error(content, null, true);
                }
            };

            vm.showError = function (error) {
                var title = "DownloadingError";
                abp.message.error(
                    error, app.localize(title)
                );
            };
            //end fines downloading

            //start tolls downloading
            vm.downloadTolls = function () {
                debugger;

                if (checkExtAvailable()) {

                    vm.downloadingTolls = true;

                    var funcNode = document.getElementById('speedExtReportingSalik');
                    if (funcNode) {
                        funcNode.parentElement.removeChild(funcNode);
                    }

                    var script = document.createElement('script');
                    script.id = 'speedExtReportingSalik';
                    script.appendChild(document.createTextNode(
                        `function reportToDashboard(status) {
                                debugger;
                                var $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
                                try {

                                    if(status.isCompleted) $scope.vm.downloadingTolls = false;                                
                                    else{
                                        for (var i in status.selectedTolls) {
                                            status.selectedTolls[i].customTextField1 = $scope.vm.filters.agreementNo;
                                            status.selectedTolls[i].tenantId = abp.session.tenantId;
                                            $scope.vm.totalTollAmount += parseInt(status.selectedTolls[i].amount);
                                        }

                                       $scope.vm.tolls = $scope.vm.tolls.concat(status.selectedTolls);
                                    }

                                } catch (e) {
                                    abp.message.error(e); $scope.vm.downloadingTolls = false;
                                }

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                        }`));

                    (document.body || document.head || document.documentElement).appendChild(script);

                    var event = new CustomEvent('openSalikTab', {
                        detail: JSON.stringify({})
                    });
                    event.initEvent('openSalikTab');
                    document.dispatchEvent(event);
                }
                else
                    abp.message.error(content, null, true);
            };
            //end salik downloading

            vm.downloadingDarbTolls = false;
            vm.downloadDarbTolls = function () {
                if (!eTollFeatureEnabled) {
                    abp.message.error('', 'One of the Features Salik | EToll should be Enabled.');
                }
                else {
                    var requestData = null;

                    //if tags based downloading then append filter info as request parems
                    requestData = vm.filters;
                    vm.filters.tagNos = [];
                    vm.filters.plateNos = [];
                    let requestDarbTolls = angular.copy(vm.filters);

                    let fromDateList = [];
                    let toDateList = [];

                    for (var i in requestDarbTolls.darbFilterLines) {
                        let fromDate = moment(requestDarbTolls.darbFilterLines[i].fromDate) !== null ? moment(new Date(requestDarbTolls.darbFilterLines[i].fromDate._d.getFullYear(), requestDarbTolls.darbFilterLines[i].fromDate._d.getMonth(), requestDarbTolls.darbFilterLines[i].fromDate._d.getDate(), requestDarbTolls.darbFilterLines[i].fromTime._d.getHours(), requestDarbTolls.darbFilterLines[i].fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                        let toDate = moment(requestDarbTolls.darbFilterLines[i].toDate) !== null ? moment(new Date(requestDarbTolls.darbFilterLines[i].toDate._d.getFullYear(), requestDarbTolls.darbFilterLines[i].toDate._d.getMonth(), requestDarbTolls.darbFilterLines[i].toDate._d.getDate(), requestDarbTolls.darbFilterLines[i].toTime._d.getHours(), requestDarbTolls.darbFilterLines[i].toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                        if (requestDarbTolls.darbFilterLines[i].plateNo !== "")
                         vm.filters.plateNos.push(requestDarbTolls.darbFilterLines[i].plateNo);
                        fromDateList.push(fromDate);
                        toDateList.push(toDate);
                    };
                    vm.filters.fromDate = (fromDateList.sort((a, b) => a - b))[0];
                    vm.filters.toDate = (toDateList.sort((a, b) => b - a))[0];
                    debugger;

                    //try {
                    //    JSON.stringify('[' + vm.filters.tagNos + ']');
                    //} catch (e) {
                    //    abp.message.error(
                    //        app.localize('Invalid Tags'), app.localize('Tags Provided Are Invalid') //app.localize('PressOkToIgnoreFine'),
                    //    );

                    //    vm.tollStatus.abuDhabi.isDownloading = false;
                    //    vm.tollStatus.dubai.isDownloading = false;
                    //}

                    //   requestData.tagNo = JSON.stringify('[' + vm.filters.tagNos + ']'); //as tagNos are comma string then convert to it as string array representation


                    if (checkExtAvailable()) {

                        var salikRequest = { isEtoll: true };

                        salikRequest.tagNo = [];
                        salikRequest.plateNos = vm.filters.plateNos;

                        vm.selectedSalikAccounts = [];
                        salikRequest.fromDate = vm.filters.fromDate.format('YYYY-MM-DD');
                        salikRequest.toDate = vm.filters.toDate.format('YYYY-MM-DD');


                        var funcNode = document.getElementById('speedExtReportingSalik');
                        if (funcNode) {
                            funcNode.parentElement.removeChild(funcNode);
                        }

                        let fnc = `function reportStatus(status) {
                                debugger;
                                var $scope = angular.element('#appController').scope();
                                if (status.isComplated || (status.error && !status.error === {})) {
                                    
                                        $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                                        $scope.vm.tollStatus.abuDhabi.error = status.error;
                                        $scope.vm.tollStatus.abuDhabi.status = status.status;

                                        $scope.vm.tollStatus.dubai.isDownloading = false;

                                    if ((!status.error || status.error === {}) && !$scope.vm.tollStatus.abuDhabi.isDownloading)
                                        $scope.vm.getDarbTolls();
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
                    else {
                        vm.downvm.tollStatus.abuDhabi.isDownloading = false;
                        abp.message.error(content, null, true);
                    }
                }

            };

            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
            };

            vm.getDarbTolls = function () {
                vm.darbTollBusy = true;
                let requestDarbTolls = angular.copy(vm.filters);

                for (var i in requestDarbTolls.darbFilterLines) {
                    //requestDarbTolls.darbFilterLines[i].fromDateTime = moment(requestDarbTolls.darbFilterLines[i].fromDate.addHours(requestDarbTolls.darbFilterLines[i].fromTime));
                    //requestDarbTolls.darbFilterLines[i].toDateTime = moment(requestDarbTolls.darbFilterLines[i].toDate.addHours(requestDarbTolls.darbFilterLines[i].toTime));


                    requestDarbTolls.darbFilterLines[i].fromDate = moment(requestDarbTolls.darbFilterLines[i].fromDate) !== null ? moment(new Date(requestDarbTolls.darbFilterLines[i].fromDate._d.getFullYear(), requestDarbTolls.darbFilterLines[i].fromDate._d.getMonth(), requestDarbTolls.darbFilterLines[i].fromDate._d.getDate(), requestDarbTolls.darbFilterLines[i].fromTime._d.getHours(), requestDarbTolls.darbFilterLines[i].fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                    requestDarbTolls.darbFilterLines[i].toDate = moment(requestDarbTolls.darbFilterLines[i].toDate) !== null ? moment(new Date(requestDarbTolls.darbFilterLines[i].toDate._d.getFullYear(), requestDarbTolls.darbFilterLines[i].toDate._d.getMonth(), requestDarbTolls.darbFilterLines[i].toDate._d.getDate(), requestDarbTolls.darbFilterLines[i].toTime._d.getHours(), requestDarbTolls.darbFilterLines[i].toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                }
                debugger;
                tollAppService.getDarbTollsForTmsDashboard(requestDarbTolls.darbFilterLines).success(function (data) {
                    vm.darbTolls = data.items;
                }).finally(function () {
                    vm.darbTollBusy = false;
                });
                debugger;
            };

            //load fines
            vm.getFines = function (callback) {
                vm.loadingFines = true;

                appendDateAndTime(
                    function () {

                        var request = angular.copy(vm.filters);

                        for (var i in request.filterLines) {
                            request.filterLines[i].fromDate = moment(request.filterLines[i].fromDateTime);
                            request.filterLines[i].toDate = moment(request.filterLines[i].toDateTime);
                        }


                        finesService.getFinesForTMS(request)
                            .success(function (data) {
                                vm.fines = data;
                                vm.tollsAndfineSummary();
                            })
                            .finally(function () {
                                vm.loadingFines = false;
                                vm.allfineReports = false;
                                vm.printFinesChanges();
                                if (callback !== null)
                                    callback && callback();
                            });
                    });

            };

            vm.printDashboardTollsAndFines = function (obj) {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/tms/dashboard/printTollsAndFines.cshtml';
                        },
                        filters: function () {
                            return obj;
                        }
                    }
                });
            };
            //end fines

            vm.tollsAndfineSummary = function () {
                debugger;
                if (vm.fines.length > 0) {
                    vm.totalAmountWithSurcharge = 0;
                    vm.totalChargedAmmount = 0;
                    vm.totalCollectedAmount = 0;
                    vm.totalDueAmount = 0;
                    angular.forEach(vm.fines, function (value) {
                        vm.totalAmountWithSurcharge += parseFloat(value.amountWithSurcharge);
                        vm.totalChargedAmmount += parseFloat(value.chargedAmmount);
                        vm.totalCollectedAmount += parseFloat(value.collectedAmount);
                        vm.totalDueAmount += (parseFloat(value.chargedAmmount).toFixed(2) - parseFloat(value.collectedAmount).toFixed(2));
                    });
                } else {
                    vm.totalAmountWithSurcharge = 0;
                    vm.totalChargedAmmount = 0;
                    vm.totalCollectedAmount = 0;
                    vm.totalDueAmount = 0;
                }

                if (vm.tolls.length > 0) {
                    vm.totalTollAmount = 0;
                    angular.forEach(vm.tolls, function (value) {
                        vm.totalTollAmount += parseFloat(value.amount);
                    });
                } else {
                    vm.totalTollAmount = 0;
                }
            };

            //start tolls
            vm.getTolls = function (callback) {
                vm.loadingTolls = true;
                appendDateAndTime(
                    function () {
                        vm.getTollsFilters = vm.filters;
                        tollAppService.getTollsForTFMS(vm.getTollsFilters).success(function (result) {
                            vm.tolls = result;
                            vm.tollsAndfineSummary();
                        }).error(function (exception) {
                            console.log(exception);
                        }).finally(function () {
                            vm.loadingTolls = false;
                            vm.allTollReports = false;
                            if (callback !== null)
                                callback && callback();
                        });
                    });
            };
            //end tolls

            vm.isVAlidForm = function () {
                vm.isValidForm = false;
                var isValid = false;
                var checkAgain = true;
                if (!(vm.filters.agreementNo === null || vm.filters.agreementNo === '' || vm.filters.agreementNo === undefined) && checkAgain) {
                    angular.forEach(vm.filters.filterLines, function (value) {
                        if (!(value.plateNo === null || value.plateNo === '' || value.plateNo === undefined) &&
                            !(value.fromDate === null || value.fromDate === '' || value.fromDate === undefined || value.fromDate === false) &&
                            !(value.fromTime === null || value.fromTime === '' || value.fromTime === undefined || value.fromTime === false) &&
                            !(value.toDate === null || value.toDate === '' || value.toDate === undefined || value.toDate === false) &&
                            !(value.toTime === null || value.toTime === '' || value.toTime === undefined || value.toTime === false) &&
                            checkAgain) {
                            isValid = true;
                        } else {
                            isValid = false;
                            checkAgain = false;
                        }
                    });
                    if (isValid) {
                        vm.isValidForm = true;
                    } else {
                        vm.isValidForm = false;
                    }
                } else {
                    vm.isValidForm = false;
                }
            };

            vm.updateChargeAndCollection = function (fine) {
                fine.agreementNo = vm.filters.agreementNo;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/dashboard/updateChargesModal.cshtml',
                    controller: 'tenant.views.tms.dashboard.updateChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        finesData: function () {
                            return fine;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.tollsAndfineSummary();
                });
            };


            //implement SaveTollsInBulk first then update agreement in tolls and fines.
            vm.saveAndPrint = function () {
                appendDateAndTime(
                    function () {
                        debugger;
                        let totalServiceCall = 0;
                        let completedServiceCall = 0;

                        var selectedDetail = new Object();
                        selectedDetail.fineIds = [];
                        selectedDetail.agreementNo = vm.filters.agreementNo;

                        if (vm.fines.length > 0) {
                            totalServiceCall++;
                            vm.loadingFines = true;
                            angular.forEach(vm.fines,
                                function (value) {
                                    selectedDetail.fineIds.push(value.id);
                                });
                            finesService.updateFineWithAgreementNo(selectedDetail)
                                .success(function (data) {
                                    completedServiceCall++;
                                    vm.getFines();
                                    if (completedServiceCall === totalServiceCall)
                                        showPrintModal();
                                })
                                .error(function (exception) {
                                    console.log(exception);
                                });
                        }

                        if (vm.tolls.length > 0) {
                            totalServiceCall++;
                            vm.loadingTolls = true;
                            tollAppService.saveAndUpdateAgreementNo({ agreementNo: vm.filters.agreementNo, tolls: vm.tolls })
                                .success(function (res) {
                                    completedServiceCall++;
                                    vm.tolls.forEach(function (toll) {
                                        toll.customTextField1 = vm.filters.agreementNo;
                                    });
                                    if (completedServiceCall === totalServiceCall)
                                        showPrintModal();
                                })
                                .error(function (e) {
                                    abp.message.error(e);
                                });
                        }

                        if (vm.darbTolls.length > 0) {
                            totalServiceCall++;
                            vm.loadingDarbTolls = true;
                            tollAppService
                                .updateTollsAgreement({ agreementNo: vm.filters.agreementNo, tolls: vm.darbTolls })
                                .success(function (res) {
                                    completedServiceCall++;
                                    vm.darbTolls.forEach(function (darbToll) {
                                        darbToll.customTextField1 = vm.filters.agreementNo;
                                    });
                                    if (completedServiceCall === totalServiceCall)
                                        showPrintModal();
                                })
                                .error(function (exception) {
                                    console.log(exception);
                                });
                        }

                        function showPrintModal() {
                            abp.notify.info(app.localize('TollsUpdateSuccessfully'));
                            vm.loadingFines = false;
                            vm.loadingTolls = false;
                            vm.loadingDarbTolls = false;
                            var newObj = new Object();
                            newObj.fines = vm.fines;
                            newObj.tolls = vm.tolls;
                            newObj.darbTolls = vm.darbTolls;
                            vm.printDashboardTollsAndFines(newObj);
                        }

                    });
            };

            // Fine Extension Code [Can copy and pase for other views]
            //=========================================================
            vm.downloaderReq = {
                tenantId: abp.session.tenantId,
                trafficFileIds: [],
                salikRequest: {
                    fromDate: null,
                    toDate: null,
                    tagNo: []
                }
            };


            function checkExtAvailable() {
                var event = new CustomEvent('checkExtAvailable', {
                    detail: {}
                });
                event.initEvent('checkExtAvailable');
                document.dispatchEvent(event);
                if (document.getElementById('speedExt'))
                    return true;
                else
                    return false;
            }

            function startDownloading() {

                var funcNode = document.getElementById('speedExtReporting');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                var script = document.createElement('script');
                script.id = 'speedExtReporting';
                script.appendChild(document.createTextNode(
                    `function processCaptcha(msg){
                            var $scope =angular.element( document.querySelectorAll('[ng-controller]')[1]).scope();
                            var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x=> x.trafficFile.fileId === msg.trafficFile.fileId && msg.state.indexOf('Abu') > -1);
                            trafficFile.captchaSrc = msg.captcha;
                            trafficFile.captchaTxt = '';
    
                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }

                        function reportFineStatus(msg){
                            var $scope =angular.element( document.querySelectorAll('[ng-controller]')[1]).scope();
                            var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x=> x.trafficFile.fileId === msg.trafficFile.fileId);
                            trafficFile.progress = msg.progress;
                            trafficFile.error = msg.error;
                            trafficFile.status = msg.status;
    
                            if(trafficFile.error)
                                trafficFile.isComplete = true;
                            else
                                trafficFile.isComplete = msg.isComplated;

                            if(msg.allDone){
                               $scope.vm.downloadingFines = false;
                               $scope.vm.getFines();
                             }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }`
                ));

                (document.body || document.head || document.documentElement).appendChild(script);

                var event = new CustomEvent('starDownloadingEvent', {
                    detail: JSON.stringify(vm.downloaderReq)
                });
                event.initEvent('starDownloadingEvent');
                document.dispatchEvent(event);
            }

            vm.sendCaptcha = function (row) {
                var event = new CustomEvent('sendCaptchaAndDownloadEvent', { detail: row.captchaTxt + ',' + row.trafficFile.fileId });
                event.initEvent('sendCaptchaAndDownloadEvent');
                document.dispatchEvent(event);
            };

            //=========================================================


            vm.searchPlateNo = function ($select) {
                if ($select.search) {
                    vm.filters.name = $select.search;
                    return finesService.getSearchPlateNo(vm.filters).then(function (response) {
                        vm.plateNos = response.data.items;
                    });
                }
            };

            vm.removeRow = function (item) {
                debugger;
                vm.tolls.splice(vm.tolls.indexOf(item), 1);
                vm.totalTollAmount = 0;
                for (var i in vm.tolls) {
                    vm.totalTollAmount += parseFloat(vm.tolls[i].amount);
                }
            };

        }
    ]);
