// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:257295-257464
appModule.controller('tenant.views.rental.masterAgreements.printModal', ['$scope', '$sce', 'appSession', '$stateParams', 'utilities', 'abp.services.app.leaseClause', 'abp.services.app.rentalMasterAgreement',
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
            vm.getFuelLevel = function (value) {
                if (value == null)
                    return "";

                if (value == 0) {
                    return "0/8";
                } else if (value > 0 && value <= 0.125) {
                    return "1/8";
                } else if (value > 0.125 && value <= 0.25) {
                    return "2/8";
                } else if (value > 0.25 && value <= 0.375) {
                    return "3/8";
                } else if (value > 0.375 && value <= 0.5) {
                    return "4/8";
                } else if (value > 0.5 && value <= 0.625) {
                    return "5/8";
                } else if (value > 0.625 && value <= 0.75) {
                    return "6/8";
                } else if (value > 0.75 && value <= 0.875) {
                    return "7/8";
                } else if (value > 0.875 && value <= 1) {
                    return "8/8";
                } else {
                    return "";
                }

            };
            vm.init = function () {
                vm.loading = true;
                masterAgreementService.getMasterAgreementRentalForPrint({ id: masterAgreementId })
                    .success(function (result) {
                        vm.masterAgreement = result;
                        vm.linesToIterate = [];
                        var srNo = 1;
                        vm.masterAgreement.quotation.quotationLines.forEach(line => {
                            line.printQuantity = true;
                            vm.masterAgreement.schedule.forEach(schedule => {
                                if (schedule.agreement) {
                                    if (line.vehicleTypeId == schedule.vehicleTypeId && schedule.vehicleModelId == line.vehicleModelId && schedule.agreement.vehicle.customField3)
                                        line.printQuantity = false;
                                }
                                if (schedule.agreement) {
                                    if (line.vehicleTypeId == schedule.vehicleTypeId && line.vehicleModelId == schedule.agreement.vehicle.modelId) {
                                        obj = new Object();
                                        obj.srNo = srNo;
                                        obj.plateNo = schedule.agreement.vehicle.plateNo;
                                        obj.description = line.description;
                                        obj.closingLocationName = schedule.agreement.closingLocation?.name;

                                        obj.vehicleModel = line.vehicleModel.make.name + ' ' +
                                            +' ' + line.vehicleModel.name + ' ' + (line.vehicleType.title)

                                        line.closingLocationName = schedule.agreement.closingLocation?.name;
                                        srNo++;
                                        vm.linesToIterate.push(obj);
                                    }
                                } else {
                                    if (line.vehicleTypeId == schedule.vehicleTypeId && line.vehicleModelId == schedule.vehicleModelId) {
                                        obj = new Object();
                                        obj.srNo = srNo;
                                        
                                        obj.description = line.description;
                                        
                                        obj.vehicleModel = line.vehicleModel.make.name + ' ' +
                                            +' ' + line.vehicleModel.name + ' ' + (line.vehicleType.title)

                                       
                                        srNo++;
                                        vm.linesToIterate.push(obj);
                                    }
                                }
                                 
                                


                            });
                        });
                        masterAgreementService.getMasterAgreementForView({ id: masterAgreementId })
                            .success(function (result) {
                                vm.masterAgreementView = result;

                            }).finally(function () {
                                vm.loading = false;
                            });
                    }).finally(function () {
                        vm.loading = false;
                });
            };
        }]);
