// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:257059-257292
appModule.controller('tenant.views.crs.rental.masterAgreements.masterAgreementModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.vehicleModel', 'abp.services.app.costSetting', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.rentalMasterAgreement', 'abp.services.app.costParameter', 'agreementId',
        function ($uibModal, $uibModalInstance, utilities, directoryService, vehicleModelService, costSettingService, chargesSettingService, $filter, masterAgreementService, costParameterService, agreementId) {
            var vm = this;

            vm.customers = [];
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercentage = abp.setting.get("App.General.TaxPercentage");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
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

                if (!row.agreementId && !row.kMs) {
                    row.kMs = monthsArray[0];
                    vm.periodChanged(row, line);
                }
                return monthsArray;
            };

            function getChargesSettings() {
                vm.loading = true;
                var module = 1;

                chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.openViewAgreementModal = function (schedule) {
                openViewAgreementModal(schedule.agreementId);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewModal as vm',
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

                else if (row.kMs > 0 && row.kMs <= 36)
                    row.rentRate = line.amount3Year ? line.amount3Year : 0;

                else if (row.kMs > 0 && row.kMs <= 48)
                    row.rentRate = line.amount4Year ? line.amount4Year : 0;

                else if (row.kMs > 0 && row.kMs <= 60)
                    row.rentRate = line.amount5Year ? line.amount5Year : 0;
                else
                    row.rentRate = 0;
            };

            function getTaxAmount(amount) {
                var taxAmount = amount / (1 + (vm.taxPercentage / 100));
                return taxAmount;
            }

            vm.addAgreementUnderMasterAgreement = function (schedule, quotationLine) {
                openCreateOrEditRentalAgreementModal(schedule, quotationLine);
            };

            function openCreateOrEditRentalAgreementModal(schedule, quotationLine) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModalForMaster.cshtml',
                    controller: 'tenant.views.crs.agreements.createOrEditModalForMaster as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                quotationRates: quotationLine.extrasLines,
                                masterAgreementId: vm.masterAgreement.id,
                                date: moment().utc(),
                                noOfMonths: schedule.kMs,
                                customer: vm.masterAgreement.quotation.customer,
                                customerId: vm.masterAgreement.quotation.customerId,
                                vehicleType: quotationLine.vehicleType,
                                saleOrderToPass: vm.masterAgreement.saleOrderMasterAgreement,
                                notes: quotationLine.descToPass,
                                vehicleModel: quotationLine.vehicleModel,
                                customerPoNo: vm.masterAgreement.poNo,
                                rateType: vm.masterAgreement.quotation.type,
                                taxPercent: vm.masterAgreement.quotation.taxPercent,
                                skipTariff: true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result) {
                        schedule.agreementId = result;
                    }
                    updateScheduleLine(schedule);
                });
            }
            function updateScheduleLine(schedule) {
                masterAgreementService.updateScheduleLine(schedule)
                    .success(function () {
                        init();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.save = function () {
                vm.loading = true;
                masterAgreementService.createOrUpdateMasterRentalAgreement({ masterAgreement: vm.masterAgreement })
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

                vm.unitLines = [];

                masterAgreementService.getMasterAgreementForView({ id: agreementId })
                    .success(function (data) {
                        vm.loading = false;
                        vm.masterAgreement = data;

                        vm.masterAgreement.quotation.quotationLines.forEach(function (value, index) {

                            for (let i = 0; i < value.quantity; i++) {
                                var amount = 0;

                                value.extrasLines.forEach(function (val, line) {
                                    amount = amount + val.rate;
                                });

                                //vm.unitLines.push({ quotationLine: angular.copy(value), index: i + 1, rate: amount });

                                vm.masterAgreement.schedule.forEach(row => {
                                    if (row.vehicleTypeId == value.vehicleTypeId) {
                                        row.rate = amount;
                                    }
                                });
                            }

                                //var makeName = value.vehicleModel.make.name;
                                //var modelName = value.vehicleModel.name;
                                //var title = value.vehicleType.title;
                                var description = value.description;

                            value.descToPass = description;

                            
                        });

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
