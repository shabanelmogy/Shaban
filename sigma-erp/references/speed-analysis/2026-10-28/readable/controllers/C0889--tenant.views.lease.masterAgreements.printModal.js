// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:242176-242401
appModule.controller('tenant.views.lease.masterAgreements.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'utilities', 'abp.services.app.leaseClause', 'abp.services.app.leaseMasterAgreement',
        function ($scope, sce, appSession, $stateParams, utilities, leaseClauseService, masterAgreementService) {
            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            //vm.trafficFineSurCharge = abp.setting.get("App.General.TrafficFineSurCharge");
            vm.trafficFineSurCharge = parseFloat(abp.setting.get("App.General.TrafficFineSurCharge"));
            vm.tollSurcharge = parseFloat(abp.setting.get("App.General.TollsSurCharge"));
            vm.fineSurchargeType = abp.setting.get("App.General.FineSurchargeType");
            vm.tollsSurCharge = abp.setting.get("App.General.TollsSurCharge");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.termsAndConditions = sce.trustAsHtml(app.localize('RentalTermsAndConditions'));
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showSignatureButton = true;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.clauseTypeDataName = null;
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.masterAgreementId))
                    masterAgreementId = $scope.$parent.vmMain.masterAgreementId;
            }
            //if through url print
            if (masterAgreementId == 0 && !isNaN($stateParams.query)) {
                masterAgreementId = $stateParams.query;
            }
            vm.onImageError = function () { vm.imgError = true; };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            vm.getClauses = function (id) {
                vm.loading = true;
                vm.clauseTypeDataName = null;
                leaseClauseService.getClausesForEdit({
                    id: id
                }).success(function (data) {
                    vm.clauseTypeDataName = data.name
                    return vm.clauseTypeDataName;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getCustomerId = function (documents) {
                var customerDocuments = "";
                if (documents != null) {
                    var nationalId = documents.filter(e => e.identityDocumentType == 3);
                    if (nationalId != null) {
                        customerDocuments = nationalId[0];
                    }
                    else {
                        var passportId = documents.filter(e => e.identityDocumentType == 2);
                        if (passportId != null) {
                            customerDocuments = passportId[0];
                        }
                    }
                    return customerDocuments;
                }
            }

            vm.period = (masterAgreement) => {
                let period = masterAgreement && masterAgreement.schedule && masterAgreement.schedule.length > 0 ? masterAgreement.schedule[0].kMs : 0;
                return period === 0 ? 1 : period;
            }
            vm.getAmountInWords = function (totalValue) {
                if (totalValue != null && totalValue > 0) {
                    return utilities.toWords(vm.rounding(totalValue));
                }
            };
            vm.totalValue = (masterAgreement) => {
                if (masterAgreement) {
                    let period = vm.period(masterAgreement);
                    let amount = 0;
                    masterAgreement.quotation.quotationLines.forEach(line => {

                        if (line.amount1Year>0)
                            amount += line.amount1Year * line.quantity;
                        if (line.amount2Year > 0)
                            amount += line.amount2Year * line.quantity;
                        if (line.amount3Year > 0)
                            amount += line.amount3Year * line.quantity;
                        if (line.amount4Year > 0)
                            amount += line.amount4Year * line.quantity;
                        if (line.amount5Year > 0)
                            amount += line.amount5Year * line.quantity;
                       
                    });
                    return period * amount;
                }
                return 0;
            }

            vm.getAllowedCharges = function (charges) {
                if (charges != null) {
                    var result = charges.filter(e => e.chargesTypeId == 5);
                    if (result != null) {
                        return result[0];
                    }
                }
            };
            vm.getlocalDateTime = function (date, format) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };
            vm.getVehicleType = (type) => {
                if (type == 0) {
                    return 'NA';
                }
                if (type == 1) {
                    return 'Rental';
                }
                if (type == 2) {
                    return 'Lease';
                }
                if (type == 3) {
                    return 'Replacement';
                }
                if (type == 4) {
                    return 'Limousine';
                }
                if (type == 5) {
                    return 'Workshop';
                }
                if (type == 6) {
                    return 'Staff';
                }
            }
            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.buildLeaseVehicleRows = function (masterAgreement) {
                var rows = [];
                var schedules = (masterAgreement.schedule || []).slice();
                var lines = (masterAgreement.quotation || {}).quotationLines || [];

                function addRow(line, schedule, quantity) {
                    var agreement = schedule.agreement || {};
                    var vehicle = agreement.vehicle || schedule.vehicle || {};
                    var model = line.vehicleModel || schedule.vehicleModel || vehicle.model || {};
                    var make = model.make || {};
                    var kmCharge = vm.getAllowedCharges(agreement.charges);
                    var months = schedule.kMs > 0 ? schedule.kMs : (line.years > 0 ? line.years * 12 : null);
                    var termRate = months > 0 && months <= 60 ? line['amount' + Math.ceil(months / 12) + 'Year'] : null;
                    var rate = schedule.rentRate > 0 ? schedule.rentRate :
                        (line.amountPerMonth > 0 ? line.amountPerMonth :
                            (termRate > 0 ? termRate : (line.amountPerVehicle > 0 ? line.amountPerVehicle : line.amount)));
                    rows.push({
                        vehicleType: [typeof make === 'string' ? make : make.name, model.name,
                            (line.vehicleType || schedule.vehicleType || {}).title].filter(Boolean).join(' '),
                        plateNo: vehicle.plateNo,
                        color: vehicle.exteriorColor || '-',
                        quantity: quantity,
                        monthlyRate: rate > 0 ? vm.rounding(rate) : '-',
                        months: months,
                        mileage: kmCharge && kmCharge.limit != null ? vm.rounding(kmCharge.limit) : '-',
                        mileagePeriod: kmCharge && kmCharge.rateType ? vm.localize(kmCharge.rateType.name) : '',
                        excessRate: kmCharge && kmCharge.excessRate != null ? vm.rounding(kmCharge.excessRate) : '-'
                    });
                }

                lines.forEach(function (line) {
                    var remaining = Number(line.quantity) || 0;
                    schedules.forEach(function (schedule, index) {
                        if (schedule && remaining > 0 && schedule.vehicleModelId === line.vehicleModelId &&
                            schedule.vehicleTypeId === line.vehicleTypeId) {
                            addRow(line, schedule, 1);
                            schedules[index] = null;
                            remaining--;
                        }
                    });
                    if (remaining > 0) addRow(line, {}, remaining);
                });
                // A scheduled vehicle must still print if its quotation line was removed or changed.
                schedules.forEach(function (schedule) {
                    if (schedule) addRow({}, schedule, 1);
                });
                return rows;
            };
            vm.init = function () {
                vm.loading = true;
                masterAgreementService.getMasterAgreementLeaseForPrint({ id: masterAgreementId })
                    .success(function (result) {
                    vm.masterAgreement = result;
                    vm.leaseVehicleRows = vm.buildLeaseVehicleRows(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.startDate);
                var endDate = moment(vm.agreement.endDate);

                if (startDate.isValid() && endDate.isValid()) {
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days();
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');

                }

            };
            vm.agreementDateDiffDays = function (endDate, startDate) {
                var dateDiffrence = (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24;
                return dateDiffrence;
            }
        }]);
