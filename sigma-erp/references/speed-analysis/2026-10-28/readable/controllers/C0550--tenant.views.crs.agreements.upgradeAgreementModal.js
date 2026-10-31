// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:148620-149804
appModule.controller('tenant.views.crs.agreements.upgradeAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.agreement', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.commonAgreement', 'agreementId', 'abp.services.app.commonLookup', 'abp.services.app.toll', 'abp.services.app.uaeFine', 'tariffHelper', 'chargesSettings', '$filter', 'abp.services.app.directory', 'fineDownloader', 'tollDownloader', '$interval', 'abp.services.app.vehicle', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'abp.services.app.commonLookup',
        function ($scope, utilities, $uibModalInstance, $uibModal, uiGridConstants, chargesCalculator, agreementService, rentalAgreementSearchService, commonAgreementService, agreementId, commonLookupService, tollService, fineService, tariffHelper, chargesSettings, $filter, directoryService, fineDownloader, tollDownloader, $interval, vehicleService, trafficFileService, chromeExtDownloader, lookupService,) {

            //  CloseAgreement Portion
            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            var disableTollsAndFinesDownloading = utilities.parseBoolean(abp.setting.get("App.General.DisableTollsAndFinesDownloading"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.enablePickAndDropLocationInAgreement = utilities.parseBoolean(abp.setting.get("App.General.EnablePickAndDropLocationInAgreement"));
            vm.carryforwardKMsonRAExtension = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CarryforwardKMsonRAExtension"));
            vm.showMileageInFuelInWithoutVehicleChange = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowMileageInFuelInWithoutVehicleChangeOnAgreementUpgradeDowngrade"));
            vm.upgradeAgreementType = null;
            vm.taxAccepted = false;

            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();
            const isFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar");
            const isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            var isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");

            vm.loading = false;
            vm.locations = [];
            vm.closeAgreement = null;
            vm.tollsData = null;
            vm.finesData = null;
            vm.downloadingTolls = false;
            vm.downloadingFines = false;

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.tollStatus = {
                dubai: {
                    isDownloading: false,
                    status: '',
                    progress: 0,
                    error: ''
                },
                abuDhabi: {
                    isDownloading: false,
                    status: '',
                    progress: 0,
                    error: ''
                }
            };

            vm.tollAccountsDownloadingRes = {
                request: {
                    fromDate: null,
                    toDate: null
                },
                tollAccounts: []
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];


            //var rateTypes = {
            //    perDay: { id: 1, name: '/Day' },
            //    perWeek: { id: 2, name: '/Week' },
            //    perMonth: { id: 3, name: '/Month' },
            //};

            vm.getAgreementTypeName = function (AgreementType) {
                if (AgreementType == 1)
                    return "Daily";
                if (AgreementType == 2)
                    return "Weekly";
                if (AgreementType == 3)
                    return "Monthly";
                return "";
            };

            vm.agreementTypeChanged = function () {
                for (var i = 0; i < vm.closeAgreement.charges.length; i++) {
                    if (vm.closeAgreement.charges[i].rateTypeId == 1 || vm.closeAgreement.charges[i].rateTypeId == 2 || vm.closeAgreement.charges[i].rateTypeId == 3) {
                        if (vm.closeAgreement.agreementType == 2) {
                            vm.closeAgreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.closeAgreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.closeAgreement.agreementType == 3) {
                            vm.closeAgreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.closeAgreement.charges[i].rateType = rateTypes.perMonth;
                        } else {
                            vm.closeAgreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.closeAgreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }
                }
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (endDateLoaded) {
                    vm.calculate();

                    //set end date of current detail as start date of new detail
                    vm.agreement.movements[0].outDetail.dateTime = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime).utc();
                }
                else
                    endDateLoaded = true;
            };

            // Calculate In ClosePortion 
            vm.calculate = function () {
                chargesCalculator.calculate(vm.closeAgreement);

                if (!vm.showMileageInFuelInWithoutVehicleChange)
                    return;

                // Calculate this segment's mileage charge independently from carry-forward state.
                var mileageCalculation = angular.copy(vm.closeAgreement);
                mileageCalculation.isCarryFwdKmsTicked = false;
                mileageCalculation.openingKms = 0;
                mileageCalculation.agreementType = 2;
                chargesCalculator.calculate(mileageCalculation);

                var calculatedMileageCharge = mileageCalculation.charges.find(function (charge) {
                    return charge.chargesTypeId == 5;
                });
                var agreementMileageCharge = vm.closeAgreement.charges.find(function (charge) {
                    return charge.chargesTypeId == 5;
                });

                if (calculatedMileageCharge && agreementMileageCharge) {
                    agreementMileageCharge.charges = calculatedMileageCharge.charges;
                    agreementMileageCharge.units = calculatedMileageCharge.units;
                    agreementMileageCharge.notes = calculatedMileageCharge.notes;
                    agreementMileageCharge.tax = calculatedMileageCharge.tax;
                    chargesCalculator.sumCharges(vm.closeAgreement);
                }
            };

            vm.calculateMileage = function () {
                vm.mileageDriven = 0;
                if (!vm.closeAgreement || !vm.closeAgreement.movements) return;

                for (var i = 0; i < vm.closeAgreement.movements.length; i++) {
                    var movement = vm.closeAgreement.movements[i];
                    var kmIn = movement.inDetail && movement.inDetail.km;
                    var kmOut = movement.outDetail && movement.outDetail.km;
                    if (kmIn != null && kmOut != null)
                        vm.mileageDriven += Number(kmIn) - Number(kmOut);
                }
            };

            vm.mileageInChanged = function () {
                if (vm.showMileageInFuelInWithoutVehicleChange)
                    vm.calculateMileage();
                vm.calculate();
            };

            vm.sumCharges = function () {
                return chargesCalculator.sumCharges(vm.closeAgreement);
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.closeAgreement.taxPercent = vm.taxPercent;
                else
                    vm.closeAgreement.taxPercent = 0;
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };
            vm.carryFwdKmsToggle = function () {

                vm.calculate();

                if (vm.closeAgreement.isCarryFwdKmsTicked)
                    vm.agreement.openingKms = vm.closeAgreement.mileageBalance;
                else
                    vm.agreement.openingKms = 0;
            };
            function getLocations() {


                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {

                });
            }

            vm.otherPickUpLocationChanged = function () {
                if (vm.otherPickUpLocation)
                    vm.agreement.locationId = null;
                else
                    vm.agreement.pickupLocation = null;
            };
            vm.otherDropoffLocationChanged = function () {
                if (vm.otherDropoffLocation)
                    vm.agreement.closingLocationId = null;
                else
                    vm.agreement.dropoffLocation = null;
            };

            vm.showTollsDetail = function (isDarb) {
                var dateIn = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/tollsDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.tollsDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tolls: function () {
                            return isDarb ? vm.darbTollsData.tolls : vm.tollsData.tolls;
                        },
                        dateTimeIn: function () {
                            return dateIn;
                        },
                        agreementId: function () {
                            return null;
                        }
                    }
                });
            };

            vm.showFinesDetail = function () {
                var dateIn = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/finesDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.finesDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fines: function () {
                            return vm.finesData.fines;
                        },
                        dateTimeIn: function () {
                            return dateIn;
                        },
                        agreementId: function () {
                            return null;
                        }
                    }
                });
            };

            //vm.cancel = function () {
            //    $uibModalInstance.dismiss();
            //};
            vm.cancel = function () {

                if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                    vm.downloadingTollsCancled = true;
                    chromeExtDownloader.closeAllTollsTabs();
                }

                if (vm.downloadingFines) {
                    vm.downloadingFinesCancled = true;
                    chromeExtDownloader.closeAllFinesTabs();
                }


                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                allFuelLevels();
                getLocations();

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                commonAgreementService.getAgreement({
                    id: agreementId,
                    includeVehicle: true,
                    includeCustomer: true,
                    includeDriver: true,
                    includeAddtionalDriver: true,
                    includeCharges: true,
                    includeMovements: true,
                    isMobile: false
                }).success(function (result) {
                    vm.closeAgreement = result;
                    vm.closeAgreement.tollsData = vm.tollsData; //in case if tolls data is loaded before agreement loading
                    vm.closeAgreement.finesData = vm.finesData; //in case if fines data is loaded before agreement loading
                    vm.closeAgreement.isCarryFwdKmsTicked = true;
                    initOpenPortion(() => {

                        let isDownloadData = false;
                        if (isMv3ExtensionAvailable) {
                            isDownloadData = true;
                            chromeExtDownloader.initV3(vm);
                        }
                        else
                            chromeExtDownloader.checkAndDownload(
                                function success() {
                                    isDownloadData = true;
                                },
                                function error(content) {
                                    isDownloadData = false;
                                });

                        if (disableTollsAndFinesDownloading || !isDownloadData) {
                            createStatusScript();
                            isSalikModuleEnabled && vm.fetchTolls();
                            isFinesModuleEnabled && vm.fetchFines();
                            isDarbModuleEnabled && vm.fetchDarbTolls();
                        }
                        else if (isDownloadData) {
                            if (isSalikModuleEnabled)
                                downloadTolls();
                            if (isFinesModuleEnabled)
                                downloadFines();
                            const hasDarbCharges = vm.closeAgreement.charges.length > 0 && vm.closeAgreement.charges.filter(x => x.chargesTypeId == 73).length > 0;
                            if (!isMv3ExtensionAvailable && isDarbModuleEnabled && hasDarbCharges)
                                downloadDarbTolls();
                        }

                    });
                    //set return date (which was set at time of opening) as date in by default
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime = vm.closeAgreement.endDate;
                    vm.taxAccepted = vm.closeAgreement.taxPercent > 0 ? true : false;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();


            function downloadTolls() {

                vm.tollStatus.dubai.isDownloading = true;
                var currentDate = moment().utc().format('YYYY-MM-DDThh:mm:ss') + 'Z';

                let requestData = {
                    fromDate: vm.agreement.fromDate,
                    toDate: vm.agreement.endDate && moment(vm.agreement.endDate) <= moment.utc() ? vm.agreement.endDate : currentDate,
                    tagNo: null,
                    isEtoll: false
                };
                requestData.fromDate = moment(requestData.toDate, "YYYY-MM-DD HH:mm:ss").add('days', -2);
                var downloadFromDate = moment(requestData.fromDate, 'YYYY-MM-DD HH:mm:ss').add(4, 'hours');
                var tollsCutOffDate = abp.setting.get("App.General.TollsCutOffDate");

                if (!tollsCutOffDate) {
                    tollsCutOffDate = moment('0001-01-01', "YYYY-MM-DD");
                }
                else {
                    tollsCutOffDate = moment(tollsCutOffDate, "YYYY-MM-DD");
                }

                if (downloadFromDate < tollsCutOffDate)
                    downloadFromDate = tollsCutOffDate;


                var tagNo = [];

                //if days are more then 30 then make period of 30 days.
                var diffInDays = moment(requestData.toDate, "YYYY-MM-DD").diff(downloadFromDate, 'days');
                if (diffInDays > 30)
                    downloadFromDate = moment(requestData.toDate, "YYYY-MM-DD").add('days', -28);

                requestData.fromDate = downloadFromDate.format("YYYY-MM-DD");
                debugger;
                //appending ETags from agreement movements in request ...
                let lastMovement = vm.agreement.movements.find(x => x.toDate == null);
                tagNo.push(lastMovement.vehicle.eTag);

                requestData.tagNo = tagNo;

                if (isMv3ExtensionAvailable) {
                    tollService.prepareDataForExtension(requestData).success(resp => {
                        vm.downloadingTolls = true;
                        vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(resp.salikAccounts);

                        if (isDarbModuleEnabled) {
                            requestData.plateNos = [];
                            requestData.plateNos.push(lastMovement.vehicle.plateNo);
                            vm.tollAccountsDownloadingRes.tags = requestData.tagNo;

                            requestData.tagNo = [];
                            requestData.isEtoll = true;

                            tollService.prepareDataForExtension(requestData).success(rsp => {
                                vm.tollAccountsDownloadingRes.isEtoll = requestData.isEtoll;
                                vm.tollAccountsDownloadingRes.plateNos = requestData.plateNos;
                                vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(rsp.salikAccounts);
                                chromeExtDownloader.downloadTollsV3(vm, null);
                            });
                        }
                        else
                            chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {
                    createStatusScript();
                    chromeExtDownloader.downloadTolls(
                        requestData,
                        null,
                        function error(e) {

                            vm.downloadTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error);
                        }
                    );
                }
            }

            vm.fetchTolls = function () {
                tollService.getTolls({
                    agreementId: agreementId, downloadPendingTolls: false, server: 1
                }).success(function (result) {

                    vm.tollsData = result;

                    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.closeAgreement.tollsData = vm.tollsData;
                        vm.fetchDarbTolls();
                        vm.calculate();

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }

                    }

                }).finally(function () {
                    vm.downloadingTolls = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                });
            };

            vm.fetchDarbTolls = function () {
                tollService.getTolls({
                    agreementId: agreementId, downloadPendingTolls: false, server: 2
                }).success(function (result) {

                    vm.darbTollsData = result;

                    if (vm.closeAgreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.closeAgreement.darbTollsData = vm.darbTollsData;
                        vm.calculate();

                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    }

                }).finally(function () {
                    vm.tollStatus.abuDhabi.isDownloading = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                });
            };

            function downloadDarbTolls() {

                vm.tollStatus.abuDhabi.isDownloading = true;

                var currentDate = moment().utc().format('YYYY-MM-DDThh:mm:ss') + 'Z';

                let darbRequest = {
                    fromDate: vm.closeAgreement.startDate,
                    toDate: vm.closeAgreement.endDate && moment(vm.closeAgreement.endDate) <= moment.utc() ? vm.closeAgreement.endDate : currentDate,
                    plateNos: [],
                    isEtoll: true
                };
                darbRequest.fromDate = moment(darbRequest.toDate, "YYYY-MM-DD").add('days', -2);
                var downloadFromDate = moment(darbRequest.fromDate, 'YYYY-MM-DD HH:mm:ss').add(4, 'hours');
                var tollsCutOffDate = abp.setting.get("App.General.TollsCutOffDate");

                if (!tollsCutOffDate) {
                    tollsCutOffDate = moment('0001-01-01', "YYYY-MM-DD");
                }
                else {
                    tollsCutOffDate = moment(tollsCutOffDate, "YYYY-MM-DD");
                }

                if (downloadFromDate < tollsCutOffDate)
                    downloadFromDate = tollsCutOffDate;

                //if days are more then 30 then make period of 30 days.
                var diffInDays = moment(darbRequest.toDate, "YYYY-MM-DD").diff(downloadFromDate, 'days');
                if (diffInDays > 30)
                    downloadFromDate = moment(darbRequest.toDate, "YYYY-MM-DD").add('days', -28);


                let plateNos = [];
                //appending ETags from agreement movements in request ...
                let lastMovement = vm.closeAgreement.movements.find(x => x.toDate == null);
                plateNos.push(lastMovement.vehicle.plateNo);
                darbRequest.plateNos = [];

                //To:Do
                //plateNos downloading shall be make in next update;
                //   darbRequest.plateNos = [];


                darbRequest.fromDate = downloadFromDate.format("YYYY-MM-DD");
                darbRequest.toDate = darbRequest.toDate.split('T')[0];

                if (!isSalikModuleEnabled)
                    createStatusScript();

                chromeExtDownloader.downloadTolls(
                    darbRequest,
                    function success(s) { },
                    function error(e) {

                        vm.tollStatus.abuDhabi.isDownloading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error);
                    });
            }

            function downloadFines() {
                vm.downloadingFines = true;

                vm.traffFilesDownloadingRes = [];

                var reqData = { onlyDubaiFilesDownloading: true };

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
                        if (isMv3ExtensionAvailable) {
                            chromeExtDownloader.downloadFinesV3(vm, r.items, false);
                        }
                        else {
                            vm.downloadedFiles = true;
                            if (!$scope.$$phase) $scope.$digest();

                            chromeExtDownloader.downloadFines(
                                {
                                    trafficFileIds: r.items
                                },

                                `function processCaptcha(msg) {
                                            var $scope = angular.element(document.getElementsByName('upGradeAgreementForm')[0]).scope();
                                            var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && msg.state.indexOf('Abu') > -1);
                                            trafficFile.captchaSrc = msg.captcha;
                                            trafficFile.captchaTxt = '';

                                            if (!$scope.$$phase) {
                                                $scope.$digest();
                                            }
                                        }

                                        function reportFineStatus(msg) {
                                            var $scope = angular.element(document.getElementsByName('upGradeAgreementForm')[0]).scope();
                                            var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                                            trafficFile.progress = msg.progress;
                                            trafficFile.error = msg.error;
                                            trafficFile.status = msg.status;
                                            trafficFile.isComplete = msg.isComplated;
                                            
                                            $scope.vm.downloadingFines = true;

                                            if (trafficFile.error)
                                                trafficFile.isComplete = true;

                                           if (msg.downloadingComplete) {
                                                $scope.vm.downloadingFines = false;
                                                $scope.vm.fetchFines();
                                            }

                                            if (!$scope.$$phase) {
                                                $scope.$digest();
                                            }
                                        }`,
                                function error(e) {
                                    vm.downloadingFines = false;
                                    abp.message.error(e, null);

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }
                            );
                        }
                    });
            }

            function createStatusScript() {

                let helperFunc = `function reportStatus(status) {
                    var $scope = angular.element(document.getElementsByName('closeAgreementForm')[0]).scope();
                    if (!$scope) return;
                    debugger;
                    if (!status.isEtoll) {
                        if (status.isComplated || status.error) {
                            $scope.vm.tollStatus.dubai.isDownloading = false;

                            $scope.vm.tollStatus.dubai.error = status.error;
                            $scope.vm.tollStatus.dubai.status = status.status;

                            $scope.vm.fetchTolls();
                        }
                        else {
                            $scope.vm.tollStatus.dubai.isDownloading = true;
                            $scope.vm.tollStatus.dubai.error = '';

                            $scope.vm.tollStatus.dubai.progress = status.progress;
                            $scope.vm.tollStatus.dubai.status = status.status;
                        }
                    } `;
                if (isDarbModuleEnabled)
                    helperFunc += `else {
                        if (status.isComplated || (status.error && !status.error === {})) {

                            $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                            $scope.vm.tollStatus.abuDhabi.error = status.error;
                            $scope.vm.tollStatus.abuDhabi.status = status.status;
                            $scope.vm.fetchDarbTolls();

                        }
                        else {
                            $scope.vm.tollStatus.abuDhabi.isDownloading = true;
                            $scope.vm.tollStatus.abuDhabi.error = '';

                            $scope.vm.tollStatus.abuDhabi.progress = status.progress;
                            $scope.vm.tollStatus.abuDhabi.status = status.status;
                        }
                    } `;

                helperFunc += `if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                } `;
                var funcNode = document.getElementById('speedExtReportingSalik');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                var script = document.createElement('script');
                script.id = 'speedExtReportingSalik';
                script.appendChild(document.createTextNode(helperFunc));

                (document.body || document.head || document.documentElement).appendChild(script);
            }

            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Tolls/Fines may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                        if (r) {
                            if (isMv3ExtensionAvailable) {
                                chromeExtDownloader.closeAllTabs({});
                            }
                            else {
                                if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                                    vm.downloadingTollsCancled = true;
                                    chromeExtDownloader.closeAllTollsTabs();
                                }

                                if (vm.downloadingFines) {
                                    vm.downloadingFinesCancled = true;
                                    chromeExtDownloader.closeAllFinesTabs();
                                }
                            }
                        }
                    });
            };

            vm.fetchFines = function () {
                fineService.getFines({
                    agreementId: agreementId, downloadPendingFines: false
                }).success(function (result) {
                    vm.finesData = result;

                    if (vm.closeAgreement != null) //if agreement is loaded then assign tolls data
                    {
                        vm.closeAgreement.finesData = vm.finesData;
                        vm.calculate();
                    }
                }).finally(function () {
                    vm.downloadingFines = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                });
            };

            //       -------------------  Open Agreement Portion ----------------------------------------------////
            vm.chargesSettings = chargesSettings;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            var errorMessage = {};

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            //date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {

                if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                else
                    startDateLoaded = true;
            };

            vm.agreementTypeSelected = function () {
                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 3) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        } else {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }
                }

                tariffHelper.applyTariff(vm.agreement);
            };

            var endDateOpenLoaded = false;
            vm.endDateChangedOpen = function () {
                if ((vm.isEditMod && startDateLoaded && endDateOpenLoaded) || !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                else
                    endDateLoaded = true;
            };

            vm.searchVehicles = function ($select) {
                //if ($select.search == "") { vm.vehicles = null; return null; }
                //return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL' }).then(function (response) {
                //    vm.vehicles = response.data.items;
                //});

                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, null);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
                });
            };

            vm.searchAdditionalDrivers = function ($select) {
                //whereas contactCategory: 1 (person). contactType: 2 (customer) get all individual customers/drivers
                return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 2 }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.additionalDriver = result;
                });
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.searchSalesPersonWithDesignation({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.vehicleSelected = function () {

                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;
                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                //load and apply tariff
                tariffHelper.loadTariff(groupId, function () {
                    tariffHelper.applyTariff(vm.agreement);
                });
            };

            vm.customerSelected = function () {
                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                }
            };

            vm.driverSelected = function () {

                tariffHelper.applyTariff(vm.agreement);
            };

            vm.additionalDriverSelected = function () {

                tariffHelper.applyTariff(vm.agreement);
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            function loadChargesFromSettings() {
                ////if new agreement then load charges detail from settings
                //if (vm.isEditMod == false) {
                //    vm.agreement.charges.length = 0;    //clear charges list

                //navigation charges settings and add charges rows in agreement charges list
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);



                    if (foundLines.length == 0) {
                        vm.agreement.charges.push(
                            {
                                agreementId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: vm.chargesSettings[i].rateTypes[0].id,
                                rate: null,
                                units: null,
                                charges: null,
                                applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                                isMandatory: vm.chargesSettings[i].isMandatory,
                                taxable: false, //vm.chargesSettings[i].taxable,
                                accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                                included: false,
                                excessRate: null,
                                limit: null,
                                chargesType: vm.chargesSettings[i].chargesType,
                                rateType: vm.chargesSettings[i].rateTypes[0],
                                tariff: []
                                //    { included: true, rate: 0, excessRate: 5, limit: 100 },
                                //    { included: false, rate: 30, excessRate: 4, limit: 250 },
                                //    { included: false, rate: 50, excessRate: 3, limit: 500 }

                                //]
                            }
                        );
                    }
                    //    }
                }
            }

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };

            // Calculate In Open Portion
            vm.calculateOpen = function () {

                return chargesCalculator.calculate(vm.agreement);
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
            };

            vm.taxAcceptedChangedOpen = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };

            vm.discountApplied = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };


            function initOpenPortion(clb) {
                vm.loading = true;

                //get copy of current agreement as base of new agreement.
                rentalAgreementSearchService.getAgreementForUpgrade({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;

                    //reset agreement no and id
                    vm.agreement.agreementNo = null;
                    vm.agreement.id = null;

                    vm.otherPickUpLocation = vm.agreement.pickupLocation != null ? true : false;
                    vm.otherDropoffLocation = vm.agreement.dropoffLocation != null ? true : false;                    //get copy of last movement as set it in movements list containing this movement only
                    var lastMovement = angular.copy(vm.agreement.movements[vm.closeAgreement.movements.length - 1]);
                    vm.agreement.movements = [lastMovement];

                    vm.agreement.movements[0].outDetail.dateTime = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime).utc();
                    vm.agreement.endDate = null;
                    angular.forEach(vm.agreement.charges, function (value, key) {
                        value.charges = 0;
                    });

                    vm.isEditMod = true;


                    //load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                    var groupId = vm.agreement.vehicle.tariffGroupId;
                    if (groupId == null) groupId = -1;

                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, function () {
                        //tariffHelper.applyTariff(vm.agreement);
                    });

                    loadChargesFromSettings();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                    //initially set km and fuel same for in. will be used if vehicle is not changed.
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.fuelLevel = vm.agreement.movements[0].outDetail.fuelLevel;
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.km = vm.agreement.movements[0].outDetail.km;
                    vm.calculateMileage();

                }).finally(function () {
                    vm.loading = false;
                    clb && clb();
                });
            }

            vm.save = function () {
                vm.saving = true;

                //update ids for selected records
                vm.agreement.vehicleId = vm.agreement.vehicle.id;
                vm.agreement.customerId = vm.agreement.customer.id;
                vm.agreement.driverId = vm.agreement.driver.id;

                if (vm.agreement.additionalDriver != null)
                    vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;

                if (vm.agreement.salesPerson != null)
                    vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                else
                    vm.agreement.salesPersonId = null;

                if (vm.agreement.pickupLocation != null)
                    vm.agreement.pickupLocationId = vm.agreement.pickupLocation.id;
                else
                    vm.agreement.pickupLocationId = null;

                if (vm.agreement.dropoffLocation != null)
                    vm.agreement.dropoffLocationId = vm.agreement.dropoffLocation.id;
                else
                    vm.agreement.dropoffLocationId = null;

                // Close Agreement Portion
                if (vm.locations.length == 1)
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;


                if (vm.closeAgreement.vehicle.id == vm.agreement.vehicle.id) {


                    //if vehicle is not changed then keep fuel and km in detail for closing same as set for out detail
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.fuelLevel = vm.agreement.movements[0].outDetail.fuelLevel;
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.km = vm.agreement.movements[0].outDetail.km;

                    // and set in location same as out location of closing
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail_LocationId = vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].outDetail_LocationId;
                }

                //if Salik is enabled then get ids of tolls which were included during charges calculation
                var agreementTollsIds = [];
                if (abp.features.isEnabled("CRS.Tolls.Salik") && vm.closeAgreement.tollsData != undefined) {
                    for (var k = 0; k < vm.closeAgreement.tollsData.tolls.length; k++) {
                        if (vm.closeAgreement.tollsData.tolls[k].included == true) {
                            agreementTollsIds.push(vm.tollsData.tolls[k].id);
                        }
                    }
                }


                var agreementDarbTollsIds = [];
                if (isDarbModuleEnabled && vm.agreement.darbTollsData != undefined) {
                    for (var k = 0; k < vm.agreement.darbTollsData.tolls.length; k++) {
                        if (vm.agreement.darbTollsData.tolls[k].included == true) {
                            agreementDarbTollsIds.push(vm.darbTollsData.tolls[k].id);
                        }
                    }
                }

                //if Dubai or Abu Dhabi is enabled then get ids of fines which were included during charges calculation
                var agreementFinesIds = [];
                if ((abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice")) && vm.closeAgreement.finesData != undefined) {
                    for (var k = 0; k < vm.closeAgreement.finesData.fines.length; k++) {
                        if (vm.closeAgreement.finesData.fines[k].included == true) {
                            agreementFinesIds.push(vm.finesData.fines[k].id);
                        }
                    }
                }

                //nullify additional objects
                vm.closeAgreement.tollsData = null;
                vm.closeAgreement.finesData = null;

                vm.CloseAgreement = {
                    tollsIds: agreementTollsIds,
                    finesIds: agreementFinesIds,
                    agreement: vm.closeAgreement,
                    isUpgradeOrDowngrade: true
                };
                vm.OpenAgreement = {
                    agreement: vm.agreement
                };

                agreementService.upgradeOrDowngradeAgreement({
                    openAgreement: vm.OpenAgreement,
                    closeAgreement: vm.CloseAgreement
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            };

        }
    ]);
