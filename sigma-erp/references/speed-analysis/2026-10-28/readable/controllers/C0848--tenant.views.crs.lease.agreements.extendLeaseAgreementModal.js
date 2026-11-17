// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:230310-231357
appModule.controller('tenant.views.crs.lease.agreements.extendLeaseAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.agreement', 'abp.services.app.rentalAgreementSearch',
        'abp.services.app.commonAgreement', 'agreementId', 'abp.services.app.commonLookup', 'abp.services.app.toll', 'abp.services.app.uaeFine', 'tariffHelper', 'chargesSettings',
        '$filter', 'abp.services.app.directory', 'fineDownloader', 'tollDownloader', '$interval', 'abp.services.app.vehicle', 'abp.services.app.trafficFile',
        'chromeExtDownloader', 'abp.services.app.leaseClause', 'abp.services.app.leaseAgreement',
        function ($scope, utilities, $uibModalInstance, $uibModal, uiGridConstants, chargesCalculator, agreementService, rentalAgreementSearchService,
            commonAgreementService, agreementId, commonLookupService, tollService, fineService, tariffHelper, chargesSettings, $filter, directoryService,
            fineDownloader, tollDownloader, $interval, vehicleService, trafficFileService, chromeExtDownloader, leaseClauseService, leaseAgreementService) {

            //  CloseAgreement Portion
            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit.CanChangeRates');
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isLeaseProjectEnabled = abp.features.isEnabled("CRS.Lease.Projects");
            vm.upgradeAgreementType = null;
            vm.taxAccepted = false;
            vm.isCreateLeaseAgreementByWizardEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCreateLeaseAgreementByWizardEnabled"));
            vm.provisionNextEnabled = true;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");

            vm.loading = false;
            vm.locations = [];
            vm.closeAgreement = null;
            vm.tollsData = null;
            vm.finesData = null;
            vm.downloadingTolls = false;
            vm.downloadingFines = false;
            vm.canChangeLeaseClauses = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses');

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};
            [vm.leaseDetail, vm.showProvisions, vm.showClauses, vm.showPreTermination] = [true, false, false, false]

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.agreementProvisionItems = [
                { id: 1, name: app.localize('Battery') },
                { id: 2, name: app.localize('Tyres') }
            ];
            vm.leaseRateTypes = [{ id: 3, name: app.localize('/Month') }, { id: 6, name: app.localize('OneTime') }];

            vm.agreementProvisionTypes = [
                { id: 1, name: app.localize('KMs') },
                { id: 2, name: app.localize('Months') }
            ];

            vm.agreementPreTerminationTypes = [
                { id: 1, name: app.localize('Fixed') },
                { id: 2, name: app.localize('PercentageOfRemainingPeriod') },
                { id: 3, name: app.localize('NoOfMonths') },
            ];

            vm.addProvisionRow = function () {
                vm.agreement.provisions.push(
                    {
                        item: null,
                        type: null,
                        value: null
                    });
                vm.checkProvisionsRowEmpty();
            };

            vm.addClauseRow = function () {
                vm.agreement.clauses.push(
                    {
                        clauseId: null,
                    });
                vm.checkClausesRowEmpty();
            };

            vm.disableRate = function (chargesRow) {

                //tariffLine.included == chargesRow.included &&
                //tariffLine.rate == chargesRow.rate &&
                //tariffLine.excessRate == chargesRow.excessRate
                //&& tariffLine.limit == chargesRow.limit
                if (chargesRow.tariff.length > 1) {
                    var foundLines = $filter('filter')(chargesRow.tariff, {
                        included: chargesRow.included,
                        rate: chargesRow.rate,
                        excessRate: chargesRow.excessRate,
                        limit: chargesRow.limit
                    }, true);
                    if (foundLines.length > 0) {
                        return foundLines[0].rate > 0;
                    }
                    else {
                        return false;
                    }
                }

                return chargesRow.tariff[0].rate > 0;
            };
            vm.addPreTerminationRuleRow = function () {
                if (vm.agreement.preTerminationRules == undefined) {
                    vm.agreement.preTerminationRules = [];
                }
                vm.agreement.preTerminationRules.push(
                    {
                        fromMonth: null,
                        toMonth: null,
                        type: null,
                        penalityValue: null
                    });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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
                if (AgreementType == 4)
                    return "Lease";
                return "";
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
            };

            vm.calculate1 = function () {
                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                        }
                    }
                }
                return chargesCalculator.calculate(vm.agreement);
            };

            vm.inKmsChanged = function () {

                 
                vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.fuelLevel
                =
                vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.fuelLevel;

                vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km
                =
                vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.km;

                vm.calculate();
            };

            vm.carryFwdKmsToggle = function () {

                vm.calculate();

                if (vm.closeAgreement.isCarryFwdKmsTicked)
                    vm.agreement.openingKms = vm.closeAgreement.mileageBalance;
                else
                    vm.agreement.openingKms = 0;
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

            vm.tollsCount = function () {
            };


            vm.showTollsDetail = function () {
                var dateIn = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/tollsDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.tollsDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tolls: function () {
                            return vm.tollsData.tolls;
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                allFuelLevels();

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                commonAgreementService.getAgreement({
                    id: agreementId,
                    includeProject: true,
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
                    if (vm.closeAgreement.customer)
                        getCustomerPicture(vm.closeAgreement.customer.id);
                    initOpenPortion();
                    //set return date (which was set at time of opening) as date in by default
                    vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime = vm.closeAgreement.endDate;
                    vm.taxAccepted = vm.closeAgreement.taxPercent > 0 ? true : false;
                    vm.closeAgreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.closeAgreement.endDate);

                    vm.closeAgreement.noOfMonths = vm.closeAgreement.endDate.diff(moment(vm.closeAgreement.movements[0].outDetail.dateTime), 'months');

                    //vm.noOfMonthsChange();
                    //if Salik is enabled
                    //if (abp.features.isEnabled("CRS.Tolls.Salik")) {
                    //    downloadTolls();

                    //}

                    //if (abp.features.isEnabled("CRS.Fines.DubaiPolice") ||
                    //    abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") ||
                    //    abp.features.isEnabled("CRS.Fines.Qatar")) {
                    //    downloadFines();
                    //}


                }).finally(function () {
                    vm.loading = false;
                });

                //if Salik is enabled
                //if (abp.features.isEnabled("CRS.Tolls.Salik")) {
                //    downloadTolls();

                //vm.downloadingTolls = true;

                //tollService.getTolls({
                //    agreementId: agreementId, downloadPendingTolls: true
                //}).success(function (result) {
                //    vm.tollsData = result;
                //    if (vm.closeAgreement != null) //if agreement is loaded then assign tolls data
                //    {
                //        vm.closeAgreement.tollsData = vm.tollsData;
                //        vm.calculate();
                //    }

                //}).finally(function () {
                //    vm.downloadingTolls = false;
                //});
            }

            //if Dubai/Abu Dhabi Fines are enabled
            //if (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar")) {//added by arslan for Qatar fines

            //}
            //}

            init();





            vm.removeProvisionRow = function (row) {
                var index = vm.agreement.provisions.indexOf(row);
                vm.agreement.provisions.splice(index, 1);
                vm.checkProvisionsRowEmpty();
            };

            vm.removeClauseRow = function (row) {
                var index = vm.agreement.clauses.indexOf(row);
                vm.agreement.clauses.splice(index, 1);
                vm.checkClausesRowEmpty();
            };

            vm.removePreTerminationRuleRow = function (row) {
                var index = vm.agreement.preTerminationRules.indexOf(row);
                vm.agreement.preTerminationRules.splice(index, 1);
            };
            vm.checkProvisionsRowEmpty = function () {
                if (vm.isCreateLeaseAgreementByWizardEnabled) {
                    vm.agreement.provisions.forEach(function (row) {
                        if (row.item === null || row.value === null || row.type === null) {
                            vm.provisionNextEnabled = false;
                            return;
                        }
                        else
                            vm.provisionNextEnabled = true;
                    });
                }
                else
                    return;
            }

            vm.checkClausesRowEmpty = function () {
                if (vm.isCreateLeaseAgreementByWizardEnabled) {
                    vm.agreement.clauses.forEach(function (row) {
                        if (row.clauseId === null || row.clause.clauseTypeId === null) {
                            vm.clausesNextEnabled = false;
                            return;
                        }
                        else
                            vm.clausesNextEnabled = true;
                    });
                }
                else
                    return;
            }

            vm.noOfMonthsChange = function () {
                if (vm.agreement.movements[0].outDetail.dateTime) {
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                    //vm.endDateChanged();
                    vm.calculate();
                }
                //vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                //vm.endDateChanged();
            };

            function getLeaseClauseTypes() {
                vm.loading = true;
                leaseClauseService.getLeaseClauseTypes({}).success(function (data) {
                    vm.leaseClauseTypes = data.items;
                    vm.addClauses();
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.addClauses = function () {
                if (vm.agreement.clauses.length == 0) {
                    vm.leaseClauseTypes.forEach(function (row) {
                        // vm.getClauses()
                        vm.loading = true;
                        leaseClauseService.getClausesForEdit({
                            id: row.id
                        }).success(function (data) {
                            row.leaseClauses = data.clauses;
                            var foundLines = $filter('filter')(row.leaseClauses, {
                                isDefault: true
                            }, true);
                            if (foundLines.length >= 1) {
                                vm.agreement.clauses.push(
                                    {
                                        clause: {
                                            clauseTypeId: row.id
                                        },
                                        leaseClauses: row.leaseClauses,
                                        clauseId: foundLines[0].id
                                    });

                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                    });
                }
            };

            vm.getClauses = function (row, id) {
                vm.loading = true;
                leaseClauseService.getClausesForEdit({
                    id: id
                }).success(function (data) {
                    row.leaseClauses = data.clauses;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function downloadTolls() {

                vm.downloadingTolls = true;
                var currentDate = moment().format("YYYY-MM-DD");

                var requestData = {
                    fromDate: vm.closeAgreement.startDate,
                    toDate: currentDate,
                    tagNo: null
                };

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
                angular.forEach(vm.closeAgreement.movements, function (movement) {
                    if (movement.vehicle.eTag)
                        if (tagNo.length > 0) {
                            if (tagNo.indexOf(movement.vehicle.eTag) < 0)
                                tagNo.push(movement.vehicle.eTag);
                        }
                        else {
                            tagNo.push(movement.vehicle.eTag);
                        }
                });

                requestData.tagNo = tagNo;


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
                                var $scope = angular.element(document.getElementsByName('upGradeAgreementForm')[0]).scope();
                                    if (status.isComplated || status.error) {
                                        $scope.vm.downloadingTolls = false;

                                        $scope.vm.firebaseSalikResponse.error = status.error;
                                        $scope.vm.firebaseSalikResponse.status = status.status;
                                        var agreementId = $scope.vm.agreement.agreementId;

                                        $scope.vm.fetchTolls();
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
                            requestData,
                            null,
                            function error(e) {

                                vm.downloadTolls = false;

                                if (!$scope.$$phase)
                                    $scope.$digest();

                                abp.message.error(e.error);
                            }
                        );
                    },
                    function error(e) {
                        vm.downloadTolls = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e, null, true);
                    });

            }

            vm.fetchTolls = function () {
                tollService.getTolls({
                    agreementId: agreementId, downloadPendingTolls: false
                }).success(function (result) {

                    vm.tollsData = result;

                    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
                    {
                        vm.closeAgreement.tollsData = vm.tollsData;
                        vm.calculate();
                    }

                }).finally(function () {
                    vm.downloadingTolls = false;

                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }

                });
            };

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

                        vm.downloadedFiles = 0;
                        if (!$scope.$$phase) $scope.$digest();

                        chromeExtDownloader.checkAndDownload(
                            function success() {
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
                            },
                            function error(content) {
                                vm.downloadingFines = false;
                                abp.message.error(content, null, true);
                            });
                    });
            }

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

                    //vm.agreement.movements[0].outDetail.dateTime = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime).utc();
                vm.agreement.startDate = vm.agreement.movements[0].outDetail.dateTime;
                vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime = vm.agreement.startDate;
                vm.closeAgreement.endDate = vm.agreement.startDate;
                vm.calculate();

                if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                else
                    startDateLoaded = true;
            };

            var endDateOpenLoaded = false;
            //vm.endDateChangedOpen = function () {
            //    if ((vm.isEditMod && startDateLoaded && endDateOpenLoaded) || !vm.isEditMod)
            //        tariffHelper.applyTariff(vm.agreement);
            //    else
            //        endDateLoaded = true;
            //};

            
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


            function initOpenPortion() {
                vm.loading = true;

                //get copy of current agreement as base of new agreement.
                leaseAgreementService.getAgreementForExtension({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    //if (vm.agreement.customer)
                    //    getCustomerPicture(vm.agreement.customer.id);
                    //reset agreement no and id
                    vm.agreement.agreementNo = null;
                    vm.agreement.id = null;
                    vm.agreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.agreement.endDate);
                    vm.agreement.noOfMonths = vm.agreement.endDate.diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');

                    getLeaseClauseTypes();
                    //get copy of last movement as set it in movements list containing this movement only
                    var lastMovement = angular.copy(vm.agreement.movements[vm.closeAgreement.movements.length - 1]);
                    vm.agreement.movements = [lastMovement];

                    //vm.agreement.movements[0].outDetail.dateTime = moment(vm.closeAgreement.movements[vm.closeAgreement.movements.length - 1].inDetail.dateTime).utc();
                    vm.agreement.endDate = null;

                    angular.forEach(vm.agreement.charges, function (value, key) {
                        value.charges = 0;
                    });
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });
                    vm.isEditMod = false;


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

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };

            function getCustomerPicture(id) {
                vm.picture = [];
                directoryService.searchCustomerPhoto({ id: id }).success(function (result) {
                    if (result) {
                        var img = result;
                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.url;
                        imageDetail.img = img.url;
                        imageDetail.description = img.description;
                        imageDetail.url = img.url;
                        imageDetail.name = img.name;
                        imageDetail.guid = img.guid;
                        imageDetail.ImageURL = img.url;
                        imageDetail.ImagePath = img.name;
                        vm.picture.push(imageDetail);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };
            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };

            vm.save = function () {

                //popup for advance or deposit if needed
                if (vm.showAdvancePopupOnSave || vm.showDepositPopupOnSave) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
                        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    agreement: vm.agreement,
                                    advance: vm.advance,
                                    deposit: vm.deposit,
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        var continueSaving = false;
                        if (result != null && result.save != null)
                            continueSaving = result.save;

                        vm.saving = continueSaving;
                        if (continueSaving) {
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
                            {
                                //put hold for days in the from of fromdate & todate
                                vm.deposit.fromDate = moment();
                                var fromDate = angular.copy(vm.deposit.fromDate);
                                vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                            }

                            save(); //save on closing of popup
                        }
                        else
                            vm.saving = false; //saving cacelled on popup
                    });

                } else //if advance or deposit popup is not shown then save directly
                    save();
            }

            function save() {
                vm.saving = true;

                //update ids for selected records
                vm.agreement.vehicleId = vm.agreement.vehicle.id;
                vm.agreement.customerId = vm.agreement.customer.id;
                vm.agreement.driverId = vm.agreement.driver.id;

                if (vm.agreement.additionalDriver != null)
                    vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;

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
                };
                vm.OpenAgreement = {
                    advance: vm.advance,
                    deposit: vm.deposit,
                    agreement: vm.agreement
                };

                leaseAgreementService.extendLeaseAgreement({
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
