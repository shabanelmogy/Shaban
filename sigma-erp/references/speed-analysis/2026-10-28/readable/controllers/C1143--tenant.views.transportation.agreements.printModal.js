// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:299795-300095
appModule.controller('tenant.views.transportation.agreements.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'abp.services.app.agreement', 'abp.services.app.qRLabel', 'abp.services.app.user', '$uibModal', 'utilities', 'abp.services.app.transAgreement',
        function ($scope, sce, appSession, $stateParams, agreementService, qrService, userService, $uibModal, utilities, transAgreementService) {
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
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.showSignatureButton = true;
            var agreementId = 0;

            //if pop-up print
            if ($scope.$parent) {
                if ($scope.$parent.vmMain && $scope.$parent.vmMain.agreementId)
                    agreementId = $scope.$parent.vmMain.agreementId;
            }

            //if through url print
            if (agreementId == 0 && !isNaN($stateParams.query)) {
                agreementId = $stateParams.query;
            }

            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.localizeArabic = function (input) {
                if (input == "Rent")
                    return "إيجار";
                if (input == "Mileage")
                    return "عدد الأميال";
                if (input == "Fuel")
                    return "وقود";
                if (input == "CDW")
                    return "تطرحها";
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
                else
                    return "";
            };

            vm.getlocalDateTimeNew = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
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

            vm.init = function (options) {
                vm.loading = true;
       
                transAgreementService.getAgreementForPrint({
                    agreementId: agreementId,
                    printQR: options.printQr,
                    printUser: options.printUser,
                    printDailyWeeklyRentRates: options.printDailyWeeklyRentRates
                }).success(function (result) {
                 
                    vm.agreement = result.agreement;
                 
                    if (vm.agreement.signature) {
                        vm.urlWithToken = vm.agreement.signature.url;
                        vm.showSignatureButton = false;
                    }
                    //vm.advance = result.advance;
                    //vm.agreementChargesLengthHalf = parseInt(vm.agreement.charges.length / 2);
                    //vm.dailyRate = result.dailyRate;
                    //vm.weeklyRate = result.weeklyRate;
                    // ... Customer Documents
                   // if (vm.agreement.customer.identityDocuments.length == 0) {
                   //     vm.agreement.customer.identityDocuments = [
                   //         {
                   //             identityDocumentType: {}
                   //         }];
                   //     vm.agreement.customer.identityDocuments[0].identityDocumentType = {};
                   //     vm.agreement.customer.identityDocuments[0].identityDocumentType = 2;
                   //     vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                   // } else {
                   //     for (var i = 0; i < vm.agreement.customer.identityDocuments.length; i++) {
                   //         if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 2) {
                   //             vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                   //             break;
                   //         }
                   //         if (vm.agreement.customer.identityDocuments[i].identityDocumentType == 3) {
                   //             vm.customerDoc = vm.agreement.customer.identityDocuments[i];
                   //         }
                   //     }
                   //      vm.customerDoc = vm.agreement.customer.identityDocuments[0];
                   // }
                   //////  Customer Driving Lisence
                   // if (vm.agreement.customer.identityDocuments.length > 0) {
                   //     angular.forEach(vm.agreement.customer.identityDocuments, function (value, key) {
                   //         if (value.identityDocumentType == 4) {
                   //             vm.customerDrivingLisence = vm.agreement.customer.identityDocuments[key];
                   //         }
                   //     });
                   // }
                   // //// Additional Driver Documents
                   // if (vm.agreement.additionalDriver != null) {
                   //     if (vm.agreement.additionalDriver.identityDocuments.length > 0) {
                   //         var passportCheck = true;
                   //         for (var i = 0; i < vm.agreement.additionalDriver.identityDocuments.length; i++) {
                   //             if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 4)
                   //                 vm.additionalDriverDrivingLisence = vm.agreement.additionalDriver.identityDocuments[i];
                   //             if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 2) {
                   //                 vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                   //                 passportCheck = false;
                   //             }
                   //             if (vm.agreement.additionalDriver.identityDocuments[i].identityDocumentType == 3) {
                   //                 if (passportCheck)
                   //                     vm.additionalDriverDoc = vm.agreement.additionalDriver.identityDocuments[i];
                   //             }
                   //         }
                   //     }
                   // }

                    vm.checkVar = false;
                    //.... Driver Documents
                 
                    if (vm.agreement.driver.identityDocuments.length > 0) {
                     
                        angular.forEach(vm.agreement.driver.identityDocuments, function (value, key) {
                            if (value.identityDocumentType == 4) {
                    
                                if (vm.checkVar == false) {
                                    vm.driverDoc = vm.agreement.driver.identityDocuments[key];
                                 
                                    vm.checkVar = true;
                                }
                            }
                        });
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

                    //if (options.printQr)
                    //    vm.qrCode = result.qrLabel;
                    //if (options.printUser)
                    //    vm.user = result.user;

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
