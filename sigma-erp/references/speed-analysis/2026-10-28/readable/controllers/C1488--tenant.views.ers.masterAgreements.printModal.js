// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:406441-406757
appModule.controller('tenant.views.ers.masterAgreements.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.masterAgreement', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.vehicle',
        function ($scope, appSession, $stateParams, masterAgreementService, commonLookupService, utilities, vehicleService) {

            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.locationId = appSession.user.locationId;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.userName = '';
            var recordsPerPage = 5;
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.masterAgreementId))
                    masterAgreementId = $scope.$parent.vmMain.masterAgreementId;
            }

            //if through url print
            if (masterAgreementId == 0 && !isNaN($stateParams.query)) {
                masterAgreementId = $stateParams.query;
            }

            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.getAgreementTypeName = function (id) {
                if (id == 0) {
                    return 'NA';
                }
                else if (id == 1) {
                    return 'Daily';
                }
                else if (id == 2) {
                    return 'Weekly';
                }
                else if (id == 3) {
                    return 'Monthly';
                }
                else if (id == 4) {
                    return 'Lease';
                }
                else if (id == 5) {
                    return 'LeaseToOwn';
                }
            };

            vm.getPerName = function (id) {
                if (id == 0) {
                    return 'NA';
                }
                else if (id == 1) {
                    return '/Day';
                }
                else if (id == 2) {
                    return '/Week';
                }
                else if (id == 3) {
                    return '/Month';
                }
                else if (id == 4) {
                    return '/Month';
                }
                else if (id == 5) {
                    return '/Month';
                }
            };

            vm.getDeliveryStatus = function (id) {
                if (id == 0)
                    return "NA";
                else if (id == 1)
                    return "Delivered";
                else if (id == 2)
                    return "Closed";
                else if (id == 3)
                    return "Cancelled";
                else if (id == 4)
                    return "Approval 1 Pending";
                else if (id == 5)
                    return "Approval 2 Pending";
                else if (id == 7)
                    return "Delivery Pending";
                else
                    return "NA";
            }

            vm.getAccessoriesMakeAndModel = function (accessories) {
                if (accessories && accessories.length > 0) {
                    var vehicleType = accessories[0].vehicleType != null ? accessories[0].vehicleType.title : null;
                    var makeAndModel = accessories[0].vehicleModel != null ? accessories[0].vehicleModel.make + ' ' + accessories[0].vehicleModel.name : null;
                    return [vehicleType, makeAndModel].filter(Boolean).join(', ');
                }
            };


            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };


            vm.getQuotationPeriodType = function (id) {
                if (id == 1) {
                    return "Days";
                }
                else if (id == 2) {
                    return "Weeks";
                }
                else if (id == 3) {
                    return "Months";
                }
                else if (id == 4) {
                    return "Months";
                }
                else if (id == 5) {
                    return "Months";
                }
            };

            vm.rounding = function (value) {

                return utilities.round(value, 2);
            };

            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.getExtraHourRate = function (rentRate) {
                return rentRate / vm.allowedHours;
            };

            vm.operatorExistCheck = function (agreementCharges) {
                vm.rentWithOperatorCharges = 0;
                vm.rentCharges = agreementCharges.filter(e => e.chargesTypeId == 1)[0];
                vm.operatorExist = agreementCharges.filter(e => e.chargesTypeId == 70)[0];
                if (vm.operatorExist) {
                    vm.rentWithOperatorCharges = vm.rentCharges.charges + vm.operatorExist.charges;
                }
                else {
                    vm.rentWithOperatorCharges = vm.rentCharges.charges;
                }

            };

            vm.getAgreementType = function (id) {
                if (id == 1)
                    return vm.localize("Daily")
                if (id == 2)
                    return vm.localize("Weekly")
                if (id == 3)
                    return vm.localize("Monthly")
                if (id == 4)
                    return vm.localize("Lease")
                if (id == 5)
                    return vm.localize("LeaseToOwn")
            }


            vm.getlocalDateTimeYearMonth = function (date, format) {
                if (date != null) {
                    if (format == null) format = 'YYYY/MM';

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                }
                else {
                    return "";
                }
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name;
                });
            };

            vm.getRateType = function (id) {
                if (id == 1) {
                    return 'PerDay';
                }
                else if (id == 2) {
                    return 'PerWeek';
                }
                else if (id == 3) {
                    return 'PerMonth';
                }
                else if (id == 4) {
                    return 'PerLiter';
                }
                else if (id == 5) {
                    return 'PerKM';
                }
                else if (id == 6) {
                    return 'OneTime';
                }
                else if (id == 7) {
                    return 'PerHour';
                }
                else if (id == 8) {
                    return 'PerHalfDay';
                }
                else if (id == 14) {
                    return 'PerYear';
                }
                else if (id == 15) {
                    return 'PercentPerYear';
                }
            };


            vm.getRateHeading = function (id) {
                if (id == 1) {
                    return "Daily Rate";
                }
                else if (id == 2) {
                    return "Weekly Rate";
                }
                else if (id == 3) {
                    return "Monthly Rate";
                }
                else if (id == 4) {
                    return "Monthly Rate";
                }
                else if (id == 5) {
                    return "Monthly Rate";
                }
            };


            function customizePagesDataForQuotationLines() {
                var customArray = [];
                var i = 1;
                //customArray = vm.invoice.voucherLines.filter(v => v.credit != 0 && !v.hidden);
                angular.forEach(vm.masterAgreement.quotation.quotationLines, function (keyOne) {
                    angular.forEach(vm.masterAgreement.schedule, function (keyTwo) {
                        if (keyOne.vehicleModelId == keyTwo.vehicleModelId) {
                            keyTwo.customeSrNo = i;
                            keyTwo.vehicleType = keyOne.vehicleType;
                            keyTwo.vehicleModel = keyOne.vehicleModel;
                            //var vehicle= vm.masterAgreement.agreements.find(obj => obj.vehicleId === keyTwo.vehicle.id);
                            //if (vehicle)
                            //    keyTwo.vehicle.customField2 = vehicle.customField2;
                            if (keyTwo.vehicle) {
                                vehicleService.getVehicleForView({ id: keyTwo.vehicle.id })
                                    .success((v) => {
                                        if (v) {
                                            keyTwo.vehicle.customField2 = v.customField2;
                                        }
                                    });
                            }
                            
                            customArray.push(keyTwo);
                            i = i + 1;
                        }
                    })
                })
                var arrayLength = customArray.length;
                var noOfPages = arrayLength / recordsPerPage;
                vm.pagesData = [];
                for (var i = 0; i < noOfPages; i++) {
                    var subArray = [];
                    var start = i * recordsPerPage;
                    var end = start + recordsPerPage;
                    subArray = customArray.slice(start, end);
                    vm.pagesData.push({
                        pageNo: i + 1,
                        quotationLinesdataToIterate: subArray
                    })
                }
            }
            function init() {
                vm.loading = true;
                masterAgreementService.getMasterAgreementForPrint({
                    id: masterAgreementId
                }).success(function (result) {
                    vm.masterAgreement = result;
                    vm.headingName = '';
                    if (vm.masterAgreement) {
                        vm.headingName = vm.masterAgreement.quotation.type == 1 || vm.masterAgreement.quotation.type == 2 || vm.masterAgreement.quotation.type == 3 ? "Rental Agreement Schedule" : "Lease Agreement Schedule";
                        vm.mobilizationCharges = vm.masterAgreement.quotation.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 26)[0];   // filtering mobilization charges out of extraslines
                        vm.extraHours = vm.masterAgreement.quotation.quotationLines[0].extrasLines.find(e => e.chargesTypeId == 68);
                        if (vm.extraHours)
                            vm.allowedHours = vm.extraHours.limit;
                    }
                    customizePagesDataForQuotationLines();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            init();
        }
    ]);
