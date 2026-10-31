// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:241879-242173
appModule.controller('tenant.views.crs.lease.masterAgreements.masterAgreementModal', ['$uibModal', '$uibModalInstance', 'utilities', 'appSession',
        'abp.services.app.directory', 'abp.services.app.vehicleModel', 'abp.services.app.costSetting', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.leaseMasterAgreement', 'abp.services.app.costParameter', 'agreementId',
        function ($uibModal, $uibModalInstance, utilities, appSession, directoryService, vehicleModelService, costSettingService, chargesSettingService, $filter, masterAgreementService, costParameterService, agreementId) {
            var vm = this;

            vm.customers = [];
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.isAlthiqa = appSession.tenant.tenancyName.toLowerCase() == 'althiqa';//althiqa
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            
            //vm.getPeriodType = function (id) {
            //    if (id == 1)
            //        return "Days";
            //    if (id == 2)
            //        return "Weeks";
            //    if (id >= 3)
            //        return "Months";
            //}
            vm.getAgreementStatus = function (id) {
                if (id === 1)
                    return "Open";
                else if (id === 2)
                    return "Closed";
                else if (id === 3)
                    return "Cancelled";
            };

            vm.lineWiseMonthsList = function (row, line) {
                var monthsArray = [];
                if (vm.isAlthiqa)
                {
                    monthsArray.push(12);
                    monthsArray.push(24);
                    monthsArray.push(36);
                    monthsArray.push(48);
                    monthsArray.push(60);
                    monthsArray.push(72);
                    monthsArray.push(84);
                    monthsArray.push(96);
                    monthsArray.push(108);
                    monthsArray.push(120);


                } else
                {
                    
                    if (line.amount1Year)
                        monthsArray.push(12);
                    if (line.amount2Year)
                        monthsArray.push(24);
                    if (line.amount3Year)
                        monthsArray.push(36);
                    if (line.amount4Year)
                        monthsArray.push(48);
                    if (line.amount5Year)
                        monthsArray.push(60);

                }
                
                if (!row.agreementId && (!row.kMs || !monthsArray.includes(row.kMs))) {
                    if (monthsArray.length > 0) {
                        row.kMs = monthsArray[0]; // Assign the first valid option
                    }
                    vm.periodChanged(row, line); // Trigger change event if needed
                }
                return monthsArray;
            };

            function getChargesSettings() {
                vm.loading = true;
                var module = 2;

                chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }


            //vm.searchVehicles = function ($select, line) {
            //    if ($select.search == "") { vm.vehicles = null; return null; }
            //    var subStatuses = [1, 7]; //1: Available, 7: Ready to go
            //    return vehicleService.searchVehicles({
            //        plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses,
            //        tariffGroupId: line.tariffGroupId, modelId: line.vehicleModelId
            //    }).then(function (response) {
            //        vm.vehicles = response.data.items;
            //        var selectdVehicles = vm.masterAgreement.schedule.filter(e => e.vehicle !== null).map(e => e.vehicle.plateNo);
            //        selectdVehicles.forEach(t => {
            //            vm.vehicles = vm.vehicles.filter(v => v.plateNo !== t);
            //        });

            //    });
            //};


            //vm.searchVehiclePopup = function (line, scheduleLine) {
            //    openSearchVehicleModal(line, scheduleLine);
            //};

            //function openSearchVehicleModal(line, scheduleLine) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
            //        controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    //fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
            //                    //toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
            //                    tariffGroup: line.vehicleType,
            //                    tariffGroupId: line.vehicleType.id,
            //                    statusId: 'IDL',
            //                    subStatuses: [1, 7], //1: Available, 7: Ready to go
            //                    modelId: line.vehicleModelId,
            //                    model: line.vehicleModel,
            //                    // source: 'openagreement',
            //                    selectable: true
            //                };
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        if (result != null) {
            //            scheduleLine.vehicle = result;
            //            scheduleLine.vehicleId = result.id;
            //        }
            //    });
            //}

            vm.openViewAgreementModal = function (schedule) {
                //var respectiveAgreement = vm.masterAgreement.agreements.filter(e => e.vehicleId == schedule.vehicleId)[0];
                openViewAgreementModal(schedule.agreementId);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            vm.periodChanged = function (row, line) {
                if (row.kMs > 0 && row.kMs <= 12)
                    row.rentRate = line.amount1Year ? line.amount1Year : 0;

                else if (row.kMs > 12 && row.kMs <= 24)
                    row.rentRate = line.amount2Year ? line.amount2Year : 0;

                else if (row.kMs > 24 && row.kMs <= 36)
                    row.rentRate = line.amount3Year ? line.amount3Year : 0;

                else if (row.kMs > 36 && row.kMs <= 48)
                    row.rentRate = line.amount4Year ? line.amount4Year : 0;

                else if (row.kMs > 48 && row.kMs <= 60)
                    row.rentRate = line.amount5Year ? line.amount5Year : 0;

                else
                    row.rentRate = 0;
            };

            function getTaxAmount(amount) {
                //var taxAmount = amount * vm.taxPercentage / (100 + vm.taxPercentage);
                //return amount - taxAmount;
                var taxAmount = amount / (1 + (vm.taxPercentage / 100));
                return taxAmount;
            }

            vm.addAgreementUnderMasterAgreement = function (schedule, quotationLine) {
                quotationLine.extrasLines = [];
                var rentalChargesRow = {
                    chargesTypeId: 1,
                    rate: getTaxAmount(schedule.rentRate),
                    rateTypeId: 3
                };

                quotationLine.extrasLines.push(rentalChargesRow);
                openCreateOrEditLeaseAgreementModal(schedule, quotationLine);
            };

            function openCreateOrEditLeaseAgreementModal(schedule, quotationLine) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                masterAgreementId: vm.masterAgreement.id,
                                date: moment(),
                                chargesLines: quotationLine.extrasLines,
                                noOfMonths: schedule.kMs,
                                customer: vm.masterAgreement.quotation.customer,
                                customerId: vm.masterAgreement.quotation.customerId,
                                vehicleType: quotationLine.vehicleType,
                                vehicleModel: quotationLine.vehicleModel
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        schedule.agreementId = result;
                    }
                    updateScheduleLine(schedule);
                    //init();
                });
            }
            function updateScheduleLine(schedule) {
                masterAgreementService.updateScheduleLine(schedule)
                    .success(function () {
                       // abp.notify.info(app.localize('Agreement attached to Schedule Successfully'));
                        init();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.save = function () {
                vm.loading = true;
                masterAgreementService.createOrUpdateMasterLeaseAgreement({ masterAgreement: vm.masterAgreement })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            function init() {
                vm.loading = true;
                masterAgreementService.getMasterAgreementForView({ id: agreementId })
                    .success(function (data) {
                        vm.loading = false;
                        vm.masterAgreement = data;
                        
                        vm.masterAgreement.quotation.quotationLines.forEach(line => {
                            var looping = 1;
                            vm.masterAgreement.schedule.forEach(row => {
                                if (row.vehicleTypeId == line.vehicleTypeId) {
                                    row.unitNo = looping++;
                                }
                            });
                        });
                        getChargesSettings();

                    }).finally(function () {

                    });

            }

            init();

        }]);
