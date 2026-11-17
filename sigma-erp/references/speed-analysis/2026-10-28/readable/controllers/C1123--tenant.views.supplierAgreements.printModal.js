// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:296364-296753
appModule.controller('tenant.views.supplierAgreements.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'abp.services.app.agreement', 'abp.services.app.agreementPrint', 'abp.services.app.qRLabel', 'abp.services.app.user', '$uibModal', 'utilities',
        function ($scope, sce, appSession, $stateParams, agreementService, agreementPrintService, qrService, userService, $uibModal, utilities) {
            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.customerDoc = {};
            vm.driverDoc = {};
            vm.customerDrivingLisence = {};
            vm.additionalDriverDoc = {};
            vm.additionalDriverDrivingLisence = {};
            vm.qrCode = null;
            vm.user = null;
            vm.agreementChargesLengthHalf = 0;
            vm.advance = 0;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.termsAndConditions = sce.trustAsHtml(app.localize('RentalTermsAndConditions'));
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showSignatureButton = true;
            var agreementId = 0;
            vm.chargeNotes = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.timeFormat = 'HH:mm';
            vm.getDiscountedRate = function (rate, discountPercent) {
                return utilities.round(rate - (rate * (discountPercent / 100)), 2)
            };
            vm.closedStatus = false;

            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.agreementId))
                    agreementId = $scope.$parent.vmMain.agreementId;
            }

            //if through url print
            if (agreementId == 0 && !isNaN($stateParams.query)) {
                agreementId = $stateParams.query;
            }

            vm.floor = function (value) {
                return Math.floor(value);
            };
            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.localizeArabic = function (input) {
                if (input == "Rent")
                    return "الايجار";
                if (input == "Mileage")
                    return "عدد الكيلو مترات الإضافية";
                if (input == "Fuel")
                    return "الوقود";
                if (input == "CDW")
                    return "قيمة التأمين الشامل";
                if (input == "PAI")
                    return "التأمين ضد الحوادث الشخصية";
                if (input == "Additional Driver")
                    return "سائق إضافي";
                if (input == "GPS")
                    return "نظام تحديد المواقع";
                if (input == "Baby Seat")
                    return "مقعد الطفل";
                if (input == "Tolls")
                    return "رسوم";
                if (input == "Fines")
                    return "المخالفات";
                if (input == "Other")
                    return "آخر";
                if (input == "Driver Charges")
                    return "رسوم سائق";
                if (input == "Tolls Surcharge")
                    return "رسوم رسوم إضافية";
                else if (input == "Fines Surcharge")
                    return "غرامات رسوم إضافية";
                else if (input == "Delivery Charges")
                    return "غرامات رسوم إضافية";
                else if (input == "Collection Charges")
                    return "رسوم استلام السيارة "
                else
                    return "";
            };

            vm.getlocalDateTime = function (date, format) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            //Showing Agreement Status 
            vm.getAgreementStatus = function (value) {
                if (value == null) {
                    return "";
                }
                if (value == 1) {
                    return "Open";
                } else if (value == 2) {
                    return "Closed";
                } else {
                    return "";
                }
            };

            // Showing Agreement Type
            vm.getAgreementType = function (agreementType) {
                if (agreementType == null)
                    return "";

                if (agreementType == 1) {
                    return "Daily";
                } else if (agreementType == 2) {
                    return "Weekly";
                } else if (agreementType == 3) {
                    return "Monthly";
                } else {
                    return "";
                }
            };

            // Showing Document Type
            vm.getDocumentType = function (value) {

                if (value == null)
                    return "";
                if (value == 1) {
                    return "Trade License";
                } else if (value == 2) {
                    return "Passport";
                } else if (value == 3) {
                    return "National Id";
                } else if (value == 4) {
                    return "Driving License";
                } else {
                    return "";
                }
            };


            //  Showing Document Localized
            vm.getDocumentTypeLocalized = function (value) {

                if (value == null)
                    return "";
                if (value == 1) {
                    return app.localize('TradeLicense');
                } else if (value == 2) {
                    return app.localize('Passport');
                } else if (value == 3) {
                    return app.localize('NationalId');
                } else if (value == 4) {
                    return app.localize('DrivingLicense');
                } else {
                    return "";
                }
            };

            //  Showing RateTypes Localized
            vm.getRateTypesLocalized = function (value) {
                return app.localize(value);
            };
            vm.getUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };
            vm.getlastModifierUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.lastModifierUserName = result.name;
                });
            };

            vm.getExcessRateCDW = function (value) {
                if (value) {
                    value.charges.forEach(function (chargesRow) {
                        if (chargesRow.chargesType.chargesCategory == 2 && chargesRow.accepted)
                            vm.cdwRate = chargesRow.excessRate;
                        if (vm.cdwRate == 0)
                            vm.cdwRate = '';
                    });
                }
                return vm.cdwRate;
            };
            //funcation is made for autoLease by saadat
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
            vm.init = function (options) {
                vm.loading = true;
                agreementPrintService.getAgreementForPrint({
                    agreementId: agreementId,
                    printQR: options.printQr,
                    printUser: options.printUser,
                    printDailyWeeklyRentRates: options.printDailyWeeklyRentRates
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.deposit = result.deposit;
                    vm.getUserName(vm.agreement.creatorUserId);
                    if (vm.agreement.lastModifierUserId && vm.agreement.status == 2)
                        vm.getlastModifierUserName(vm.agreement.lastModifierUserId);
                    
                    if (vm.agreement.signature) {
                        vm.urlWithToken = vm.agreement.signature.url;
                        vm.showSignatureButton = false;
                    }
                    vm.advance = result.advance;
                    vm.totalDaysAndTime();

                    vm.agreementChargesLengthHalf = parseInt(vm.agreement.charges.length / 2);
                    vm.dailyRate = result.dailyRate;
                    vm.weeklyRate = result.weeklyRate;
                    // ... Customer Documents
                    if (vm.agreement.customer.identityDocuments.length == 0) {
                        vm.agreement.customer.identityDocuments = [
                            {
                                identityDocumentType: {}
                            }];
                        //vm.agreement.customer.identityDocuments[0].identityDocumentType = {};
                        vm.agreement.customer.identityDocuments[0].identityDocumentType = 2;
                        vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                    } else {
                        for (var i = 0; i < vm.agreement.customer.identityDocuments.length; i++) {
                            if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 2) {
                                vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                                break;
                            }
                            if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 3) {
                                vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                            }
                        }
                        // vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                    }
                    // Customer Driving Lisence
                    if (vm.agreement.customer.identityDocuments.length > 0) {
                        angular.forEach(vm.agreement.customer.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                                vm.customerDrivingLisence = vm.agreement.customer.identityDocuments[key];
                            }
                        });
                    }
                    //// Additional Driver Documents
                    if (vm.agreement.additionalDriver != null) {
                        if (vm.agreement.additionalDriver.identityDocuments.length > 0) {
                            var passportCheck = true;
                            for (var i = 0; i < vm.agreement.additionalDriver.identityDocuments.length; i++) {
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 4)
                                    vm.additionalDriverDrivingLisence = vm.agreement.additionalDriver.identityDocuments[i];
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 2) {
                                    vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                                    passportCheck = false;
                                }
                                if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 3) {
                                    if (passportCheck)
                                        vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                                }
                            }
                        }
                    }

                    vm.checkVar = false;
                    //.... Driver Documents
                    if (vm.agreement.driver.identityDocuments.length > 0) {
                        //angular.forEach(vm.agreement.driver.identityDocuments, function (value, key) {
                        //    if (value.identityDocumentType == 4) {

                        //        if (vm.checkVar == false) {
                        //            vm.driverDoc = vm.agreement.driver.identityDocuments[key];
                        //            vm.checkVar = true;
                        //        }
                        //    }
                        //});
                        var passportCheck = true;
                        for (var i = 0; i < vm.agreement.driver.identityDocuments.length; i++) {
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 4 && !vm.checkVar) {
                                vm.driverDrivingLisence = vm.agreement.driver.identityDocuments[i];
                                vm.checkVar = true;
                            }
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 2) {
                                vm.driverDoc = vm.agreement.driver.identityDocuments[i];
                                passportCheck = false;
                            }
                            if (vm.agreement.driver.identityDocuments[i].identityDocumentType == 3) {
                                if (passportCheck) {
                                    vm.driverDoc = vm.agreement.driver.identityDocuments[i];
                                }
                                else {
                                    vm.driverNationalId = vm.agreement.driver.identityDocuments[i];
                                }
                            }
                        }
                    }
                    if (vm.agreement.driver.identityDocuments.length > 0 && vm.checkVar == false) {
                        vm.driverDoc = vm.agreement.driver.identityDocuments[0];
                    }
                    if (vm.agreement.driver.identityDocuments.length == 0) {
                        vm.agreement.driver.identityDocuments = [
                            {
                                identityDocumentType: {}
                            }];
                        //vm.agreement.customer.identityDocuments[0].identityDocumentType = {};
                        vm.agreement.driver.identityDocuments[0].identityDocumentType = 4;
                        vm.driverDoc = vm.agreement.driver.identityDocuments[0];
                    }

                    if (options.printQr)
                        vm.qrCode = result.qrLabel;
                    if (options.printUser)
                        vm.user = result.user;

                    var milagenotes = '';
                    angular.forEach(result.agreement.charges, function (value, key) {
                        if (value.notes != null) {
                            milagenotes = value.notes;
                        }
                    }, result.agreement.charges);

                    if (milagenotes != null) {
                        vm.chargeNotes = milagenotes.split(",")
                    }

                    vm.closedStatus = false;
                    if (result.agreement.status == 2) {
                        vm.closedStatus = true;
                    }


                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.signaturePopUp = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/signaturePads/wacom/signatureModal.cshtml',
                    controller: 'tenant.views.common.signaturePads.wacom.signatureModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreement: function () {
                            return vm.agreement;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    agreementService.saveAgreementSignature({
                        agreementId: agreementId,
                        signature: result
                    }).success(function () {
                        vm.urlWithToken = result.urlWithToken;
                        vm.showSignatureButton = false;
                    }).finally(function () {
                        vm.loading = false;
                    });

                });
            };
        }]);
