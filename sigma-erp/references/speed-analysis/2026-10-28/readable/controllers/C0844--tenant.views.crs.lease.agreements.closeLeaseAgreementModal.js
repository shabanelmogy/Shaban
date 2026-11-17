// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225920-226939
appModule.controller('tenant.views.crs.lease.agreements.closeLeaseAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.agreement', 'abp.services.app.leaseAgreementSearch', 'agreementId', 'abp.services.app.commonLookup', 'abp.services.app.toll', 'abp.services.app.uaeFine', 'abp.services.app.parkingTicket', 'appSession', 'abp.services.app.leaseAgreement', 'tollDownloader', 'fineDownloader', '$interval', 'abp.services.app.trafficFile', 'chromeExtDownloader',
        function ($scope, utilities, $uibModalInstance, $uibModal, uiGridConstants, chargesCalculator, agreementService, leaseAgreementSearchService, agreementId, commonLookupService, tollService, fineService, parkingTicketService, appSession, leaseAgreementService, tollDownloader, fineDownloader, $interval, trafficFileService, chromeExtDownloader) {

            var vm = this;
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

            vm.canEditCloseDate = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CloseDate');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.taxAccepted = false;
            vm.isSeparateInvoiceStartDateForAgreement = abp.features.isEnabled("CRS.CustomFeatures.SeparateInvoiceStartDateForAgreement");
            vm.allowLimitedUsersToEditOneTimeChargesOnPreClose = abp.auth.hasPermission("Pages.Tenant.Lease.Agreements.PreClose.AllowLimitedUsersToEditOneTimeChargesOnPreClose");
            vm.actionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements') || abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements');
            vm.loading = false;
            vm.locations = [];
            vm.agreement = null;
            vm.tollsData = null;
            vm.finesData = null;
            vm.parkingData = null;
            vm.downloadingTolls = false;
            vm.downloadingFines = false;
            vm.downloadingParking = false;

            vm.isExtHasLatestVersion = chromeExtDownloader.isLatestVersion();
            var tollsFinesDownloadingDisabled = utilities.parseBoolean(abp.setting.get("App.General.DisableTollsAndFinesDownloading"));

            var isSalikEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            var isFineEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar");
            var darbEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isLeaseToOwnEnabled = abp.features.isEnabled("CRS.Lease.LeaseToOwn");
            var isParkingEnabled = abp.features.isEnabled("CRS.Parking");
            vm.isParkingEnabled = abp.features.isEnabled("CRS.Parking");

            const isDubaiFinesEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            const isAbuDhabiFinesEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            const isQatarFinesEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();

            vm.tollAccountsDownloadingRes = {
                request: {},
                tollAccounts: []
            };

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };

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

            vm.calculateMileage = function () {
                vm.mileageDriven = 0;
                for (var x = 0; x < vm.agreement.movements.length; x++) {
                    var diff = vm.agreement.movements[x].inDetail.km - vm.agreement.movements[x].outDetail.km;
                    vm.mileageDriven += diff;
                }
            };

            vm.agreementTypes = [

                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 },
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.traffFilesDownloadingRes = [];
            vm.downloadingTollsCancled = false;
            vm.downloadingFinesCancled = false;
            vm.downloadingParkingCancled = false;

            vm.agreementTypeChanged = function () {
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
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            var endDateLoaded = false;
            vm.endDateChanged = function () {


                if (endDateLoaded)
                    vm.calculate();
                else
                    endDateLoaded = true;
            };

            vm.calculate = function () {
                chargesCalculator.calculate(vm.agreement);
            };

            vm.sumCharges = function () {
                return chargesCalculator.sumCharges(vm.agreement);
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };

            vm.tollsCount = function () {
            };

            // validate
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }

                if (moment.utc(vm.agreement.movements[0].outDetail.dateTime) > moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date cannot be less than Out Date ';
                }

                if (vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km > vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ODO IN cannot be less than ODO OUT ';
                }
            }

            vm.openMileageInfoModal = function (mileageCharges) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/mileageChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.mileageChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        mileageCharges: function () {
                            return mileageCharges;
                        },
                    }
                });
            }


            function closeAgreement() {
                validate();

                vm.saving = true;
                if (isValid) {
                    //if only one location then location input will not be visible on form. set location for movement in detail.
                    if (vm.locations.length == 1)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;

                    //if Salik is enabled then get ids of tolls which were included during charges calculation
                    var agreementTollsIds = [];
                    if (isSalikEnabled && vm.agreement.tollsData != undefined) {
                        for (var k = 0; k < vm.agreement.tollsData.tolls.length; k++) {
                            if (vm.agreement.tollsData.tolls[k].included == true) {
                                agreementTollsIds.push(vm.tollsData.tolls[k].id);
                            }
                        }
                    }

                    //if darb is enabled then get ids of tolls which were included during charges calculation
                    var agreementDarbTollsIds = [];
                    if (darbEnabled && vm.agreement.darbTollsData != undefined) {
                        for (var k = 0; k < vm.agreement.darbTollsData.tolls.length; k++) {
                            if (vm.agreement.darbTollsData.tolls[k].included == true) {
                                agreementDarbTollsIds.push(vm.darbTollsData.tolls[k].id);
                            }
                        }
                    }

                    //if parking is enabled then get ids of parkings which were included during charges calculation
                    var agreementParkingIds = [];
                    var agreementParkingExclude = [];
                    if (isParkingEnabled && vm.agreement.parkingData != undefined) {
                        for (var k = 0; k < vm.agreement.parkingData.parkingTicket.length; k++) {
                            if (vm.agreement.parkingData.parkingTicket[k].included == true) {
                                agreementParkingIds.push(vm.parkingData.parkingTicket[k].id);
                            } else if (vm.agreement.parkingData.parkingTicket[k].included == false && vm.agreement.parkingData.parking[k].agreementId) {
                                agreementParkingExclude.push(vm.parkingData.parkingTicket[k].id);

                            }
                        }
                    }

                    //if Dubai or Abu Dhabi is enabled then get ids of fines which were included during charges calculation
                    var agreementFinesIds = [];
                    //var agreementIgnoredFineIds = []; //direct ignore is provided. 
                    if ((abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar")) && vm.agreement.finesData != undefined) {  //added by arslan for Qatar fines
                        for (var k = 0; k < vm.agreement.finesData.fines.length; k++) {
                            if (vm.agreement.finesData.fines[k].included == true) {
                                agreementFinesIds.push(vm.finesData.fines[k].id);
                            }
                        }
                    }

                    //nullify additional objects
                    vm.agreement.tollsData = null;
                    vm.agreement.parkingData = null;
                    vm.agreement.finesData = null;

                    leaseAgreementService.closeLeaseAgreement({
                        agreement: vm.agreement,
                        tollsIds: agreementTollsIds,
                        darbTollsIds: agreementDarbTollsIds,
                        parkingIds: agreementParkingIds,
                        finesIds: agreementFinesIds,
                        parkingExclude: agreementParkingExclude
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfullyInvoiceGenerated'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            }


            vm.save = function () {
                utilities.confirmKmPopUp(vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km, vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km, closeAgreement);
            };

            vm.showTollsDetail = function (isDarb) {
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
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
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
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
                modalInstance.result.then(function () {
                    vm.calculate();
                });
            };

            vm.showParkingDetail = function () {
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/parkingDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.parkingDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        parkingTickets: function () {
                            return vm.parkingData.parkingTicket;
                        },
                        dateTimeIn: function () {
                            return dateIn;
                        },
                        agreementId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.calculate();
                });
            };


            vm.cancel = function () {

                if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                    vm.downloadingTollsCancled = true;
                    chromeExtDownloader.closeAllTollsTabs();
                }

                if (vm.downloadingParking) {
                    vm.downloadingParkingCancled = true;
                    chromeExtDownloader.closeAllFinesTabs();
                }

                if (vm.downloadingFines) {
                    vm.downloadingFinesCancled = true;
                    chromeExtDownloader.closeAllFinesTabs();
                }


                $uibModalInstance.dismiss();

            };

            angular.element(window).bind("keyup", keyup);
            function keyup(e) {
                if (e.keyCode == 27) {
                    vm.cancel();
                }
            }

            function init() {
                allFuelLevels();
                let isDownloadData = false;

                if (isMv3ExtensionAvailable) {
                    isDownloadData = true;
                    chromeExtDownloader.initV3(vm);
                }
                else {
                    chromeExtDownloader.checkAndDownload(
                        function success() {
                            isDownloadData = true;
                        },
                        function error(content) {
                            isDownloadData = false;
                        });
                }

                vm.loading = true;

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                leaseAgreementSearchService.getLeaseAgreementForClosing({
                    id: agreementId
                }).success(function (result) {
                    //var isEmptyETagMsg = '';

                    //result.movements.forEach(function (movement) {
                    //    if (!movement.vehicle.eTag) {
                    //        isEmptyETagMsg = "E-Tag not found for \n Vehicle: " + movement.vehicle.plateNo + "."
                    //    }
                    //});


                    //if (isEmptyETagMsg) {
                    //    abp.message.error(isEmptyETagMsg);
                    //    return;
                    //}

                    vm.agreement = result;
                    if (vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.fuelLevel != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km != null)
                        vm.calculate();

                    vm.agreement.tollsData = vm.tollsData; //in case if tolls data is loaded before agreement loading
                    vm.agreement.darbTollsData = vm.darbTollsData; //in case if tolls data is loaded before agreement loading
                    vm.agreement.parkingData = vm.parkingData; //in case if parkings data is loaded before agreement loading
                    vm.agreement.finesData = vm.finesData; //in case if fines data is loaded before agreement loading

                    if (!vm.actionsOnOtherBranch)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = appSession.user.locationId;
                    //set return date (which was set at time of opening) as date in by default
                    //vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = vm.agreement.endDate;
                    if (!vm.agreement.isPreClosed)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = moment().utc();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                })
                    .finally(function () {

                        //if Salik/Parking is enabled
                        if (isSalikEnabled || isParkingEnabled) {

                            if (tollsFinesDownloadingDisabled) {
                                vm.fetchTolls();
                                vm.fetchParking();
                            }
                            else {
                                if (isDownloadData)
                                    downloadTolls();
                                else
                                    vm.fetchParking();
                                vm.fetchTolls();
                            }
                        }

                        if (!isMv3ExtensionAvailable) {
                            const agreementHasDarbCharges = vm.agreement.charges.length > 0 && vm.agreement.charges.filter(x => x.chargesTypeId == 73).length > 0;
                            if (darbEnabled && agreementHasDarbCharges) {
                                if (tollsFinesDownloadingDisabled) {
                                    vm.fetchDarbTolls();
                                }
                                else {
                                    if (isDownloadData)
                                        downloadDarbTolls();
                                    else
                                        vm.fetchDarbTolls();
                                }
                            }
                        }

                        //if Dubai/Abu Dhabi Fines are enabled
                        if (isDubaiFinesEnabled || isAbuDhabiFinesEnabled || isQatarFinesEnabled) { //added by arslan for Qatar fines

                            if (abp.session.tenantId == 3645 || tollsFinesDownloadingDisabled) { //RPM tenant fines shall not be download
                                vm.fetchFines();
                            }
                            else {
                                //Temporary disabled due to slow downloading on DUBAI
                                if (isDownloadData)
                                    downloadFines();
                                else
                                    vm.fetchFines();
                            }
                        }

                        if (isMv3ExtensionAvailable) //once downloading complete this function will be called by extension
                            vm.callbackOnComplete = function () {
                                isFineEnabled && !vm.downloadingFines && vm.fetchFines && vm.fetchFines();
                                isSalikEnabled && !vm.tollStatus.dubai.isDownloading && vm.fetchTolls && vm.fetchTolls();
                                darbEnabled && !vm.tollStatus.abuDhabi.isDownloading && vm.fetchDarbTolls && vm.fetchDarbTolls();
                            };

                        vm.loading = false;
                    });

                //Code this is commented as we need contract date details to send for downloading

                //    //if Salik is enabled
                //    if (abp.features.isEnabled("CRS.Tolls.Salik")) {

                //        downloadTolls();

                //        //vm.downloadingTolls = true;

                //        //tollService.getTolls({
                //        //    agreementId: agreementId, downloadPendingTolls: true
                //        //}).success(function (result) {
                //        //    vm.tollsData = result;
                //        //    if (vm.agreement != null) //if agreement is loaded then assign tolls data
                //        //    {
                //        //        vm.agreement.tollsData = vm.tollsData;
                //        //        vm.calculate();
                //        //    }

                //        //}).finally(function () {
                //        //    vm.downloadingTolls = false;
                //        //});
                //    }

                //    //if Dubai/Abu Dhabi Fines are enabled
                //    if (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar")) { //added by arslan for Qatar fines

                //        downloadFines();

                //        //vm.downloadingFines = true;

                //        //fineService.getFines({
                //        //    agreementId: agreementId, downloadPendingFines: true
                //        //}).success(function (result) {
                //        //    vm.finesData = result;
                //        //    if (vm.agreement != null) //if agreement is loaded then assign tolls data
                //        //    {
                //        //        vm.agreement.finesData = vm.finesData;
                //        //        vm.calculate();
                //        //    }

                //        //}).finally(function () {
                //        //    vm.downloadingFines = false;
                //        //});
                //    }
                //}
            }

            function downloadDarbTolls() {


                vm.tollStatus.abuDhabi.isDownloading = true;

                var currentDate = moment().utc().format('YYYY-MM-DDThh:mm:ss') + 'Z';

                let darbRequest = {
                    fromDate: vm.agreement.startDate,
                    toDate: vm.agreement.endDate && moment(vm.agreement.endDate) <= moment.utc() ? vm.agreement.endDate : currentDate,
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
                let lastMovement = vm.agreement.movements.find(x => x.toDate == null);
                plateNos.push(lastMovement.vehicle.plateNo);
                darbRequest.plateNos = [];

                //To:Do
                //plateNos downloading shall be make in next update;
                //   darbRequest.plateNos = [];


                darbRequest.fromDate = downloadFromDate.format("YYYY-MM-DD");
                darbRequest.toDate = darbRequest.toDate.split('T')[0];

                if (isMv3ExtensionAvailable) {
                    tollService.prepareDataForExtension(darbRequest).success(resp => {

                        debugger;
                        let tollAccounts = (resp.accountWithPlateNos.length ? vm.salikAccounts.filter(x => resp.accountWithPlateNos.find(y => y == x.username)) : resp.salikAccounts)

                        if (vm.tollAccountsDownloadingRes) {
                            vm.tollAccountsDownloadingRes.isEtoll = darbRequest.isEtoll;
                            vm.tollAccountsDownloadingRes.plateNos = darbRequest.plateNos;
                            vm.tollAccounts = tollAccounts;
                        }
                        else
                            vm.tollAccountsDownloadingRes = {
                                request: darbRequest,
                                tollAccounts: tollAccounts
                            };

                        chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {
                    if (!isSalikEnabled)
                        createStatusScript();

                    chromeExtDownloader.downloadTolls(
                        darbRequest,
                        null,
                        function error(e) {

                            vm.tollStatus.abuDhabi.isDownloading = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error);
                        });
                }
            }

            function createStatusScript() {

                let helperFunc = `function reportStatus(status) {
                                var $scope = angular.element(document.getElementsByName('closeAgreementForm')[0]).scope();
                                if(!$scope) return;

                                if (!status.isEtoll) {
                                    if (status.isComplated || status.error) {
                                        $scope.vm.tollStatus.dubai.isDownloading = false;

                                        $scope.vm.tollStatus.dubai.error = status.error;
                                        $scope.vm.tollStatus.dubai.status = status.status;

                                        $scope.vm.fetchTolls();

                                        if($scope.vm.isParkingEnabled)
                                            $scope.vm.fetchParking();
                                    }
                                    else {
                                        $scope.vm.tollStatus.dubai.isDownloading = true;
                                        $scope.vm.tollStatus.dubai.error = '';

                                        $scope.vm.tollStatus.dubai.progress = status.progress;
                                        $scope.vm.tollStatus.dubai.status = status.status;
                                    }
                                } `;
                if (darbEnabled)
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

            function downloadTolls() {

                vm.tollStatus.dubai.isDownloading = true;
                var currentDate = moment().utc().format('YYYY-MM-DDThh:mm:ss') + 'Z';

                let requestData = {
                    fromDate: vm.agreement.startDate,
                    toDate: vm.agreement.endDate && moment(vm.agreement.endDate) <= moment.utc() ? vm.agreement.endDate : currentDate,
                    tagNo: null,
                    downloadParkingAlso: isParkingEnabled,
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

                //appending ETags from agreement movements in request ...
                let lastMovement = vm.agreement.movements.find(x => x.toDate == null);
                tagNo.push(lastMovement.vehicle.eTag);

                requestData.tagNo = tagNo;

                if (isMv3ExtensionAvailable) {
                    tollService.prepareDataForExtension(requestData).success(resp => {
                        vm.downloadingTolls = true;
                        vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(resp.salikAccounts);

                        if (darbEnabled) {
                            vm.tollStatus.abuDhabi.isDownloading = true;
                            requestData.plateNos = [];
                            requestData.plateNos.push(lastMovement.vehicle.plateNo);
                            vm.tollAccountsDownloadingRes.tags = requestData.tagNo;

                            requestData.tagNo = [];
                            requestData.isEtoll = true;

                            tollService.prepareDataForExtension(requestData).success(resp2 => {
                                vm.tollAccountsDownloadingRes.isEtoll = requestData.isEtoll;
                                vm.tollAccountsDownloadingRes.plateNos = requestData.plateNos;
                                vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(resp2.salikAccounts);

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

            //Temporary disabled due to slow downloading on DUBAI
            vm.traffFilesDownloadingRes = [];
            function downloadFines() {

                vm.downloadingFines = true;
                vm.downloadedFilesCount = 0;

                debugger;
                let vehicleIds = [];
                for (var i = 0; i < vm.agreement.movements.length; i++) {
                    vehicleIds.push(vm.agreement.movements[i].vehicleId);
                }

                fineService.getTrafficFilesOnVehicles(vehicleIds)
                    .success(function (r) {
                        if (r.length === 0)
                            vm.fetchFines();
                        else {
                            for (var i in r) {
                                vm.traffFilesDownloadingRes.push({
                                    isComplete: false,
                                    status: '',
                                    progress: 0,
                                    error: '',
                                    trafficFile: r[i]
                                });
                            }

                            if (isMv3ExtensionAvailable) {
                                chromeExtDownloader.downloadFinesV3(vm, r, false);
                            }
                            else {
                                if (!$scope.$$phase) $scope.$digest();
                                chromeExtDownloader.downloadFines(
                                    {
                                        trafficFileIds: r
                                    },

                                    `function processCaptcha(msg) {
                                var $scope = angular.element(document.getElementsByName('closeAgreementForm')[0]).scope();
                                var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                                trafficFile.captchaSrc = msg.captcha;
                                trafficFile.captchaTxt = '';

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            }

                                        function reportFineStatus(msg) {
                                    var $scope = angular.element(document.getElementsByName('closeAgreementForm')[0]).scope();
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
                        }
                    });
            }

            vm.hasError = function () {
                return vm.traffFilesDownloadingRes.find(x => x.error);
            };

            vm.fetchFines = function () {
                fineService.getFines({
                    agreementId: agreementId, downloadPendingFines: false
                }).success(function (result) {
                    vm.finesData = result;
                    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.agreement.finesData = vm.finesData;
                        vm.calculate();
                    }

                    vm.downloadingFines = false;
                    if (!$scope.$$phase) $scope.$digest();

                }).finally(function () {
                    vm.downloadingFines = false;
                    if (!$scope.$$phase) $scope.$digest();
                });
            };

            vm.fetchTolls = function () {
                tollService.getTolls({
                    agreementId: agreementId, downloadPendingTolls: false, server: 1
                }).success(function (result) {

                    vm.tollsData = result;

                    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.agreement.tollsData = vm.tollsData;
                        vm.calculate();
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

                    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.agreement.darbTollsData = vm.darbTollsData;
                        vm.calculate();
                    }

                }).finally(function () {
                    vm.tollStatus.dubai.isDownloading = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                });
            };

            vm.fetchParking = function () {
                parkingTicketService.getParkingTicket({
                    agreementId: agreementId, downloadPendingTolls: false
                }).success(function (result) {
                    vm.parkingData = result;

                    if (vm.agreement !== null) //if agreement is loaded then assign parking data
                    {
                        vm.agreement.parkingData = vm.parkingData;
                        vm.calculate();
                    }

                    vm.downloadingParking = false;
                    if (!$scope.$$phase) $scope.$digest();

                }).finally(function () {
                    vm.downloadingParking = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                });
            };


            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Tolls/Fines may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                        if (r) {

                            if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                                vm.downloadingTollsCancled = true;
                                chromeExtDownloader.closeAllTollsTabs();
                            }

                            if (vm.downloadingParking) {
                                vm.downloadingParkingCancled = true;
                                chromeExtDownloader.closeAllFinesTabs();
                            }

                            if (vm.downloadingFines) {
                                vm.downloadingFinesCancled = true;
                                chromeExtDownloader.closeAllFinesTabs();
                            }


                        }
                    });
            };

            vm.sendCaptcha = function (row) {
                chromeExtDownloader.sendCaptcha(row);
            };

            vm.showError = function (error, isFine) {
                var title = 'FinesDownloadingError';
                if (!isFine)
                    title = "SalikDownloadingError";

                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.ok = function () {
                let e = "";
                vm.traffFilesDownloadingRes && vm.traffFilesDownloadingRes.forEach(x =>
                    x.error ? e.indexOf(x.error) < 0 && (e = e + '\n' + x.error) : ''
                );
                return e;
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            init();
        }
    ]);
