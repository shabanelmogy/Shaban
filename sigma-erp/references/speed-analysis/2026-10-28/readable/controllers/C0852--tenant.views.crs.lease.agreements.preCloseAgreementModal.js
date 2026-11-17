// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:233269-234388
appModule.controller('tenant.views.crs.lease.agreements.preCloseAgreementModal', [
		'$scope', 'utilities', '$uibModalInstance', '$uibModal', 'chargesCalculator', 'abp.services.app.leaseAgreement', 'abp.services.app.leaseAgreementSearch', 'abp.services.app.parkingTicket', 'agreementId', 'abp.services.app.commonLookup', 'abp.services.app.toll', 'abp.services.app.uaeFine', 'appSession', 'tariffHelper', 'fineDownloader', 'chromeExtDownloader',
		function ($scope, utilities, $uibModalInstance, $uibModal, chargesCalculator, leaseAgreementService, leaseAgreementSearchService, parkingTicketService, agreementId, commonLookupService, tollService, fineService, appSession, tariffHelper, fineDownloader, chromeExtDownloader) {

			var vm = this;
			vm.enablePickAndDropLocationInAgreement = utilities.parseBoolean(abp.setting.get("App.General.EnablePickAndDropLocationInAgreement"));

			vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
			vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
			vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
			vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
			vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
			var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
			vm.preCloseAgreement = abp.features.isEnabled("CRS.CustomFeatures.PreCloseLeaseAgreement");

			vm.dailyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateFromDays"));
			vm.dailyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateToDays"));
			vm.weeklyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateFromDays"));
			vm.weeklyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateToDays"));
			vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
			vm.editDiscountwhileAgreementClosing = utilities.parseBoolean(abp.setting.get("App.General.EditDiscountwhileAgreementClosing"));
			var gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));
			var gracePeriodInHour = parseInt(abp.setting.get("App.General.GracePeriodInHoursForIndividual")) || 0;

			vm.canChangeChargesOnClosing = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeChargesOnClosing');
			vm.canChangeOnlyRecurringCharges = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeOnlyRecurringCharges');

			var isParkingEnabled = abp.features.isEnabled("CRS.Parking");
			var salikEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
			var darbEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");

			var tollsFinesDownloadingDisabled = utilities.parseBoolean(abp.setting.get("App.General.DisableTollsAndFinesDownloading"));
			vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");

			vm.taxAccepted = false;
			vm.actionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements') || abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements');
			vm.loading = false;
			vm.locations = [];
			vm.agreement = null;
			vm.originalAgreement = null;
			vm.tollsData = null;
			vm.finesData = null;
			vm.parkingData = null;
			vm.downloadingTolls = false;
			vm.downloadingFines = false;
			vm.downloadingParking = false;
			vm.timeOutSalikDontReportProgress = false;
			vm.timeOutFinesDontReportProgress = false;
			vm.showInLocation = true;


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

			vm.agreementTypes = [
				{ type: "Hourly", id: 6 },
				{ type: "Daily", id: 1 },
				{ type: "Weekly", id: 2 },
				{ type: "Monthly", id: 3 }
			];

			vm.getAgreementType = function (type) {
				if (type == 1)
					return "Daily";
				else if (type == 1)
					return "Weekly";
				else if (type == 1)
					return "Monthly";
			};

			var rateTypes = {
				perDay: { id: 1, name: '/Day' },
				perWeek: { id: 2, name: '/Week' },
				perMonth: { id: 3, name: '/Month' },
			};

			vm.tariffOptionSelected = function (chargesRow, tariffLine) {
				chargesRow.included = tariffLine.included;
				chargesRow.rate = tariffLine.rate;
				chargesRow.excessRate = tariffLine.excessRate;
				chargesRow.limit = tariffLine.limit;
				vm.calculate();
			};

			vm.includedChanged = function (chargesRow) {
				if (chargesRow.included)
					chargesRow.rate = 0;
				vm.calculate();
			};

			vm.firebaseSalikResponse = {};
			vm.traffFilesDownloadingRes = [];
			vm.downloadingTollsCancled = false;
			vm.downloadingFinesCancled = false;
			vm.downloadingParkingCancled = false;
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

			//vm.agreementTypeChanged = function () {
			//    for (var i = 0; i < vm.agreement.charges.length; i++) {
			//        if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
			//            if (vm.agreement.agreementType == 2) {
			//                vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
			//                vm.agreement.charges[i].rateType = rateTypes.perWeek;
			//            }
			//            else if (vm.agreement.agreementType == 3) {
			//                vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
			//                vm.agreement.charges[i].rateType = rateTypes.perMonth;
			//            } else {
			//                vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
			//                vm.agreement.charges[i].rateType = rateTypes.perDay;
			//            }
			//        }
			//    }
			//};

			vm.getFuelLevel = function (value) {
				return utilities.getFuelLevel(value);
			};
			vm.searchGoogleLocations = function ($select) {
				if ($select.search == "") { vm.vehicles = null; return null; }
				commonLookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
					vm.geoLocations = response.data.items;
				});
			};

			var endDateLoaded = false;
			vm.endDateChanged = function () {
				if (!endDateLoaded) {
					endDateLoaded = true;
					return;
				}
				var dateOut = utilities.jsonUtcDateToLocalMoment(vm.agreement.movements[0].outDetail.dateTime);
				var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
				var duration = moment.duration(dateIn.diff(dateOut));
				var hours = duration.asHours();
				var days = 0;


				//if (!dateIn.isValid()) {
				//    abp.message.info("Date Is Invalid");
				//    return;
				//}

				days = Math.floor(hours / 24);
				if (gracePeriodInHour > 0) {
					const dateForGracePeriod = new Date(dateIn);
					const endDateMinutesGP = dateForGracePeriod.getHours() * 60 + dateForGracePeriod.getMinutes();
					const graceMinutesGP = gracePeriodInHour * 60;
					var dayDiff = dateIn.startOf('day').diff(dateOut.startOf('day'), 'days');
					if (dayDiff > 0 && endDateMinutesGP > graceMinutesGP)
						dayDiff += 1;
					days = dayDiff;
					if (days < 1)
						days = 1;
				} else {
					if ((hours - days * 24) * 60 > gracePeriod) // if extra minutes are greater than grace period then calculate 1 day extra
						days += 1;
				}
				// vm.agreement.endDate = vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime;

				if (days == 0)
					return;

				if (vm.originalAgreementType == 3
					&& isTariffEnabled &&
					(vm.dailyRateFromDays > 0 || vm.dailyRateToDays > 0
						|| vm.weeklyRateFromDays > 0 || vm.weeklyRateToDays > 0)
					&& vm.agreement.vehicle.tariffGroupId) {
					if (days >= vm.dailyRateFromDays && days <= vm.dailyRateToDays && days < 30) {
						vm.agreementCutShortType = 1;

						if (vm.originalAgreement == null)
							vm.originalAgreement = angular.copy(vm.agreement);

						tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, 1, function () {
							cutShortExtendApplyTariff();
						}, vm.agreement.tariffCardId);
					}
					else if (days >= vm.weeklyRateFromDays && days <= vm.weeklyRateToDays && days < 30) {
						vm.agreementCutShortType = 2;

						if (vm.originalAgreement == null)
							vm.originalAgreement = angular.copy(vm.agreement);

						tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, 1, function () {
							cutShortExtendApplyTariff();
						}, vm.agreement.tariffCardId);

					}
					else if (vm.agreement.agreementType != 3) {
						if (vm.originalAgreement != null) {
							var endDate = angular.copy(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
							var orignalAgreement = angular.copy(vm.originalAgreement);
							orignalAgreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = endDate;
							endDateLoaded = false;
							vm.agreement = orignalAgreement;
							vm.calculate();
							return;

						}

					}

				}

				if (endDateLoaded)
					vm.calculate();
				else
					endDateLoaded = true;
				//vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime
			};

			function cutShortExtendApplyTariff() {

				var tariffLinesToQuery = tariffHelper.getTariffLines();
				if (tariffLinesToQuery.filter(x => x.chargesTypeId == 1
					&& x.rateTypeId == vm.agreementCutShortType).length > 0) {

					vm.agreement.agreementType = vm.agreementCutShortType;

					for (var i = 0; i < vm.agreement.charges.length; i++) {
						if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
							if (vm.agreement.agreementType == 2) {
								vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
								vm.agreement.charges[i].rateType = rateTypes.perWeek;
							}
							else if (vm.agreement.agreementType == 1) {
								vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
								vm.agreement.charges[i].rateType = rateTypes.perDay;
							}
						}
					}
				}
				tariffHelper.applyTariff(vm.agreement);
				vm.calculate();
			}

			vm.calculate = function () {

				//chargesCalculator.calculate(vm.agreement);
			};

			vm.sumCharges = function () {
				if (!vm.agreement || !vm.agreement.charges) {
					return 0;
				}

				var totalCharges = 0;

				angular.forEach(vm.agreement.charges, function (charge) {
					totalCharges += parseFloat(charge.charges) || 0;
				});

				vm.agreement.totalCharges = totalCharges;

				return vm.agreement.totalCharges;
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
				if (moment.utc(vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.dateTime) > moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime)) {
					isValid = false;
					errorMessage = errorMessage + '\n In Date can not less than Out Date ';
				}

				if (vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km > vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km) {
					isValid = false;
					errorMessage = errorMessage + '\n ODO IN can not less than ODO OUT ';
				}
			}

			vm.openMileageInfoModal = function (mileageCharges) {
				var modalInstance = $uibModal.open({
					templateUrl: '~/App/tenant/views/crs/agreements/mileageChargesInfoModal.cshtml',
					controller: 'tenant.views.crs.agreements.mileageChargesInfoModal as vm',
					backdrop: 'static',
					size: 'sm',
					resolve: {
						mileageCharges: function () {
							return mileageCharges;
						}
					}
				});
			};

			vm.chargesAcceptanceChanged = function (chargesRow) {
				vm.showInLocation = true;
				if (chargesRow.chargesTypeId == 27 && chargesRow.accepted) {
					vm.showInLocation = false;
					vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = null;
				}
			};

			function closeAgreement() {
				validate();
				vm.saving = true;

				//if this setting is not enabled then nullify dropofflocation object to avoid
				//bug of Delivery_AddNew permission which is being used in Collection movement
				//which is based on dropoffLocation if not null
				if (!vm.enablePickAndDropLocationInAgreement) {
					vm.agreement.dropoffLocation = null;
				}

				if (isValid) {
					//if only one location then location input will not be visible on form. set location for movement in detail.
					if (vm.locations.length == 1)
						vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;

					//if Salik is enabled then get ids of tolls which were included during charges calculation
					var agreementTollsIds = [];
					var agreementTollsIdsExclude = [];
					if (salikEnabled && vm.agreement.tollsData != undefined) {
						for (var k = 0; k < vm.agreement.tollsData.tolls.length; k++) {
							if (vm.agreement.tollsData.tolls[k].included == true) {
								agreementTollsIds.push(vm.tollsData.tolls[k].id);
							} else if (vm.agreement.tollsData.tolls[k].included == false && vm.agreement.tollsData.tolls[k].agreementId) {
								agreementTollsIdsExclude.push(vm.tollsData.tolls[k].id);

							}
						}
					}


					var agreementDarbTollsIds = [];
					var agreementDarbTollsIdsExclude = [];
					if (darbEnabled && vm.agreement.darbTollsData != undefined) {
						for (var k = 0; k < vm.agreement.darbTollsData.tolls.length; k++) {
							if (vm.agreement.darbTollsData.tolls[k].included == true) {
								agreementDarbTollsIds.push(vm.darbTollsData.tolls[k].id);
							} else if (vm.agreement.darbTollsData.tolls[k].included == false && vm.agreement.darbTollsData.tolls[k].agreementId) {
								agreementDarbTollsIdsExclude.push(vm.darbTollsData.tolls[k].id);

							}
						}
					}

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
					var agreementFinesIdsExclude = [];
					//var agreementIgnoredFineIds = []; //direct ignore is provided. 
					if ((abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar")) && vm.agreement.finesData != undefined) {
						for (var k = 0; k < vm.agreement.finesData.fines.length; k++) {
							if (vm.agreement.finesData.fines[k].included == true) {
								agreementFinesIds.push(vm.finesData.fines[k].id);
							} else if (vm.agreement.finesData.fines[k].included == false && vm.agreement.finesData.fines[k].agreementId) {
								agreementFinesIdsExclude.push(vm.finesData.fines[k].id);
							}
						}
					}

					//nullify additional objects
					vm.agreement.tollsData = null;
					vm.agreement.finesData = null;
					vm.agreement.parkingData = null;

					leaseAgreementService.preCloseAgreement({
						agreement: vm.agreement,
						tollsIds: agreementTollsIds,
						darbTollsIds: agreementDarbTollsIds,
						parkingIds: agreementParkingIds,
						finesIds: agreementFinesIds,
						finesIdsExclude: agreementFinesIdsExclude,
						tollsIdsExclude: agreementTollsIdsExclude,
						darbTollsIdsExclude: agreementDarbTollsIdsExclude,
						parkingExclude: agreementParkingExclude,

					}).success(function () {
						abp.notify.info(app.localize('SavedSuccessfully'));
						$uibModalInstance.close(vm.agreement.id);
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

			vm.showParkingDetail = function (parking) {
				var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
				var modalInstance = $uibModal.open({
					templateUrl: '~/App/tenant/views/crs/agreements/parkingDetailModal.cshtml',
					controller: 'tenant.views.crs.agreements.parkingDetailModal as vm',
					backdrop: 'static',
					size: 'lg',
					resolve: {
						parkingTickets: function () {
							return parking ? vm.parkingData.parkingTicket : vm.parkingData.parkingTicket;
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

				if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
					vm.downloadingTollsCancled = true;
					chromeExtDownloader.closeAllTollsTabs();
				}

				if (vm.downloadingParking) {
					vm.downloadingParkingCancled = true;
					chromeExtDownloader.closeAllTollsTabs();
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
				vm.loading = true;
				allFuelLevels();
				let isDownloadData = false;
				chromeExtDownloader.checkAndDownload(
					function success() {
						isDownloadData = true;
					},
					function error(content) {
						isDownloadData = false;
					});


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
					vm.originalAgreementType = vm.agreement.agreementType;
					if (vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.fuelLevel != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km != null)
						vm.calculate();
					vm.agreement.tollsData = vm.tollsData; //in case if tolls data is loaded before agreement loading
					vm.agreement.darbTollsData = vm.darbTollsData; //in case if tolls data is loaded before agreement loading
					vm.agreement.finesData = vm.finesData;
					vm.agreement.parkingData = vm.parkingData;//in case if parking is loaded before agreement loading
					if (!vm.actionsOnOtherBranch)
						vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = appSession.user.locationId;
					//set return date (which was set at time of opening) as date in by default
					// vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = vm.agreement.endDate;
					if (!vm.agreement.isPreClosed)
						vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = moment().utc();
					if (vm.originalAgreementType == 3)
						endDateLoaded = true;

					vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;


					//if Salik is enabled and after calling salik downloading it will check the fines code.
					//Due to firebase the connection is made one time so for next time if connection established for fine there will be exception.

					if (salikEnabled) {

						if (tollsFinesDownloadingDisabled) {
							createStatusScript();
							vm.fetchTolls();
						}
						else {
							if (isDownloadData)
								downloadTolls();
							else
								vm.fetchTolls();
						}

						////Added to testing after disabling local downloading. COMMENT after testing
						//tollService.getTolls({
						//    agreementId: agreementId, downloadPendingTolls: false
						//}).success(function (result) {

						//    vm.tollsData = result;

						//    if (vm.agreement !== null) //if agreement is loaded then assign tolls data
						//    {
						//        vm.agreement.tollsData = vm.tollsData;
						//        vm.calculate();

						//        if (!$scope.$$phase) {
						//            $scope.$digest();
						//        }
						//    }

						//}).finally(function () {
						//    vm.downloadingTolls = false;

						//    if (!$scope.$$phase) {
						//        $scope.$digest();
						//    }

						//});
					}

					if (isParkingEnabled) {

						if (tollsFinesDownloadingDisabled) {
							createStatusScript();
							vm.fetchParking();
						}
						else {
							if (isDownloadData)
								downloadTolls();
							else
								vm.fetchParking();
						}
					}

					//if Dubai/Abu Dhabi Fines are enabled and if the above code is called then no need to call this as this code is already running there
					if (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar")) { //added by arslan for Qatar fines

						if (abp.session.tenantId == 3645 || tollsFinesDownloadingDisabled) { //RPM tenant fines shall not be download
							vm.fetchFines();
						}
						else {
							if (isDownloadData)
								downloadFines();
							else
								vm.fetchFines();
						}
					}

					if (darbEnabled &&
						vm.agreement.charges.length > 0 && vm.agreement.charges.filter(x => x.chargesTypeId == 73).length > 0) {

						//if (tollsFinesDownloadingDisabled) {
						//    vm.fetchDarbTolls();
						//}
						//else {
						if (isDownloadData)
							downloadDarbTolls();
						else
							vm.fetchDarbTolls();
						//}
					}


				}).finally(function () {
					vm.loading = false;
				});

			}

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

				if (!salikEnabled)
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

			//Temporary disabled due to slow downloading on DUBAI
			function downloadFines() {

				vm.downloadingFines = true;



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

							if (vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
								vm.downloadingTollsCancled = true;
								chromeExtDownloader.closeAllTollsTabs();
							}

							if (vm.downloadingParking) {
								vm.downloadingParkingCancled = true;
								chromeExtDownloader.closeAllTollsTabs();
							}

							if (vm.downloadingFines) {
								vm.downloadingFinesCancled = true;
								chromeExtDownloader.closeAllFinesTabs();
							}


						}
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

					if (vm.agreement !== null) //if agreement is loaded then assign tolls data
					{
						vm.agreement.darbTollsData = vm.darbTollsData;
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

			vm.showError = function (error, isFine) {
				var title = 'FinesDownloadingError';
				if (!isFine)
					title = "SalikDownloadingError";

				abp.message.error(
					error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
				);
			};

			vm.hasError = function () {
				return vm.traffFilesDownloadingRes.find(x => x.error);
			};

			vm.ok = function () {
				let e = "";
				vm.traffFilesDownloadingRes && vm.traffFilesDownloadingRes.forEach(x =>
					x.error ? e.indexOf(x.error) < 0 && (e = e + '\n' + x.error) : ''
				);
				return e;
			};

			init();
		}
	]);
