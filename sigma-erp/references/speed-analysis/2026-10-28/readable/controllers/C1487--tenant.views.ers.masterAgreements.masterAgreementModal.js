// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405876-406438
appModule.controller('tenant.views.ers.masterAgreements.masterAgreementModal', ['$uibModalInstance', '$uibModal', 'utilities', 'agreementId', 'abp.services.app.masterAgreement', 'abp.services.app.vehicle', 'abp.services.app.chargesSetting', 'abp.services.app.equipmentDelivery', 'utilities', 'abp.services.app.commonLookup',
        function ($uibModalInstance, $uibModal, utilities, agreementId, masterAgreementService, vehicleService, chargesSettingService, equipmentDeliveryService, utilities, lookupService) {
            var vm = this;
            vm.customers = [];

            var invoicingRuleIndividual = abp.setting.get("App.General.InvoicingRuleIndividual");
            var invoicingRuleCorporate = abp.setting.get("App.General.InvoicingRuleCorporate");
            var leaseInvoicingRuleIndividual = abp.setting.get("App.General.LeaseInvoicingRuleIndividual");
            var leaseInvoicingRuleCorporate = abp.setting.get("App.General.LeaseInvoicingRuleCorporate");
            vm.canDeleteDeliveryNote = abp.auth.hasPermission("Pages.ERS.EquipmentDelivery.Delete");

            vm.daysArray = [];

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

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];

            vm.getAgreementType = function (id) {
                if (id == 1)
                    return vm.localize("Daily");
                if (id == 2)
                    return vm.localize("Weekly");
                if (id == 3)
                    return vm.localize("Monthly");
                if (id == 4)
                    return vm.localize("Lease");
                if (id == 5)
                    return vm.localize("LeaseToOwn");
            }
            vm.getPeriodType = function (id) {
                if (id == 1)
                    return "Days";
                if (id == 2)
                    return "Weeks";
                if (id >= 3)
                    return "Months";
            }
            vm.getAgreementStatus = function (id) {
                if (id === 1)
                    return "Open";
                else if (id === 2)
                    return "Closed";
                else if (id === 3)
                    return "Cancelled";
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

            var deliveryStatuses = {
                NA: 0,
                Open: 1,
                Closed: 2,
                Cancelled: 3,
                Approval1Pending: 4,
                Approval2Pending: 5,
                DeliveryPending: 7,
            }


            vm.calculateUnitRate = (deliverySchedule) => {

                var clubInvoicesCharges = vm.masterAgreement.quotation.customer.clubInvoicesCharges;
                var extraHoursLimit = 0;
                var extraHourRow = vm.masterAgreement.quotation.quotationLines[0].extrasLines.find(e => e.chargesTypeId == 68); // extra hour row

                if (extraHourRow) {
                    extraHoursLimit = extraHourRow.limit;
                    var unitRate = deliverySchedule.rentRate / extraHoursLimit;
                    deliverySchedule.limit = extraHoursLimit;
                    deliverySchedule.unitRate = clubInvoicesCharges ? utilities.getFlooredFixed(unitRate, 3) / 1 : utilities.round(unitRate, 2) / 1;
                }
            };

            //vm.viewAgreement = function (line) {
            //    if (vm.masterAgreement.quotation.type >= 4)
            //        openViewLeaseAgreementModal(line.id);
            //    else
            //        openViewAgreementModal(line.id);
            //};

            //function openViewAgreementModal(agreementId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/ers/rental/agreements/viewModal.cshtml',
            //        controller: 'tenant.views.ers.rental.agreements.viewModal as vm',
            //        backdrop: 'static',
            //        //windowClass: 'app-modal-window',
            //        size: 'lg',
            //        resolve: {
            //            agreementId: function () {
            //                return agreementId;
            //            }
            //        }
            //    });
            //};

            //function openViewLeaseAgreementModal(agreementId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/ers/lease/agreements/viewModal.cshtml',
            //        controller: 'tenant.views.ers.lease.agreements.viewModal as vm',
            //        backdrop: 'static',
            //        //windowClass: 'app-modal-window',
            //        size: 'lg',
            //        resolve: {
            //            agreementId: function () {
            //                return agreementId;
            //            }
            //        }
            //    });
            //}

            //vm.createIndividaulAgreement = function (quotationLine) {
            //    if (vm.masterAgreement.quotation.type >= 4)
            //        openCreateOrEditLeaseAgreementModal(quotationLine);
            //    else
            //        openCreateOrEditAgreementModal(quotationLine);
            //};

            vm.changeAccessoryCharges = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/changeAccessoryChargesModal.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.changeAccessoryChargesModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        scheduleLine: function () {
                            return row;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    row.accessoriesRate = result;
                });
            };

            vm.createDeliveryNote = function (schedule, quotationLine) {
                var chargesLine = angular.copy(quotationLine.extrasLines);
                chargesLine = chargesLine.filter(e => e.chargesTypeId != 71);
                if (schedule.withOperator) {
                    if (schedule.operatorRate <= 0) {
                        abp.message.info(app.localize("Opertor Charges should be greater than 0"));
                        return;
                    }
                    var operatorChargesRow = {
                        chargesTypeId: 70,
                        rate: schedule.operatorRate,
                        rateTypeId: 1
                    };
                    chargesLine.push(operatorChargesRow);
                }
                var arr = [schedule.vehicle, schedule.expectedDeliveryDate, schedule.rentRate];
                if (arr.some(e => !e)) {
                    abp.message.info(app.localize("Please fill all required text fields"));
                    return;
                }
                if (schedule.accessories && schedule.accessories.length > 0) {
                    if (schedule.accessories.some(e => !e.vehicleId)) {
                        abp.message.info(app.localize("Please select vehicles for all attachments"));
                        return;
                    }

                    schedule.accessories.forEach(e => {
                        //var attachmentCharge = chargesLine.find(c => c.vehicleModelId == e.vehicleModelId && c.vehicleTypeId == e.vehicleTypeId)[0];
                        // if (attachmentCharge) {
                        //     attachmentCharge.vehicleId = e.vehicleId;
                        //     attachmentCharge.rate = e.rate;
                        // }
                        var attachmentRow = {
                            chargesTypeId: 71,
                            rate: e.rate,
                            vehicleId: e.vehicleId,
                            rateTypeId: 1
                        };
                        chargesLine.push(attachmentRow);


                    });
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/deliveries/equipmentDeliveryModal.cshtml',
                    controller: 'tenant.views.ers.deliveries.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                masterAgreement: vm.masterAgreement,
                                //masterAgreementId: vm.masterAgreement.id,
                                //date: vm.masterAgreement.date,
                                //agreementType: vm.masterAgreement.quotation.type,
                                //customerId: vm.masterAgreement.quotation.customerId,
                                //customer: vm.masterAgreement.quotation.customer,
                                chargesLines: chargesLine,
                                //poNo: vm.masterAgreement.poNo,
                                schedule: schedule
                                //vehicleId: schedule.vehicleId,
                                //vehicle: schedule.vehicle,
                                //vehicleTypeId: schedule.vehicleTypeId,
                                //vehicleType: schedule.vehicleType
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
            };

            function updateScheduleLine(schedule) {
                masterAgreementService.updateScheduleLineErs(schedule)
                    .success(function () {
                        init();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            function getChargesSettings() {
                vm.loading = true;
                var module = 7;

                chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.searchVehicles = function ($select, line) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                return vehicleService.searchVehicles({
                    plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses,
                    tariffGroupId: line.vehicleTypeId, modelId: line.vehicleModelId
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                    //var selectedVehicles = vm.masterAgreement.schedule.filter(e => e.vehicle !== null);
                    //selectedVehicles.forEach(t => {
                    //    vm.vehicles = vm.vehicles.filter(v => v.id !== t.vehicleId);
                    //});
                    var selectdVehicles = vm.masterAgreement.schedule.filter(e => e.vehicle !== null);
                    var notNullVehicles = selectdVehicles.filter(e => e.vehicle).map(e => e.vehicle.plateNo);
                    notNullVehicles.forEach(t => {
                        vm.vehicles = vm.vehicles.filter(v => v.plateNo !== t);
                    });

                });
            };


            vm.searchVehiclePopup = function (line, scheduleLine) {
                openSearchVehicleModal(line, scheduleLine);
            };

            function openSearchVehicleModal(line, scheduleLine) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                //fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                //toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: line.vehicleType,
                                tariffGroupId: line.vehicleTypeId,
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                modelId: line.vehicleModelId,
                                model: line.vehicleModel,
                                // source: 'openagreement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        scheduleLine.vehicle = result;
                        scheduleLine.vehicleId = result.id;
                        scheduleLine.kMs = result.kMs;
                    }
                });
            }

            vm.openViewDeliveryNoteModal = function (schedule) {
                //var respectiveAgreement = vm.masterAgreement.agreements.filter(e => e.vehicleId == schedule.vehicleId)[0];
                openViewDeliveryModal(schedule.agreementId);
            };

            function openViewDeliveryModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/deliveries/viewModal.cshtml',
                    controller: 'tenant.views.ers.deliveries.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            vm.addExtraSchdule = function (line) {
                var relatedRow = vm.masterAgreement.schedule.find(e => e.vehicleModelId == line.vehicleModelId && e.vehicleTypeId == line.vehicleTypeId);
                var scheduleObject = {};
                if (relatedRow) {
                    scheduleObject.vehicleTypeId = relatedRow.vehicleTypeId;
                    scheduleObject.vehicleModelId = relatedRow.vehicleModelId;
                    scheduleObject.withOperator = relatedRow.withOperator;
                    scheduleObject.operatorRate = relatedRow.operatorRate;
                    scheduleObject.masterAgreementId = relatedRow.masterAgreementId;
                }
                else {
                    scheduleObject.vehicleTypeId = line.vehicleTypeId;
                    scheduleObject.vehicleModelId = line.vehicleModelId;
                    scheduleObject.withOperator = line.cost > 0;
                    scheduleObject.kMs = 0;
                    scheduleObject.operatorRate = 0;
                    scheduleObject.masterAgreementId = line.masterAgreementId;
                }
                vm.masterAgreement.schedule.push(scheduleObject);
                vm.operatorChanged(scheduleObject, line);
                vm.calculateUnitRate(scheduleObject);
            };

            vm.removeScheduleLine = (scheduleLine) => {
                if (scheduleLine.deliveryCreated)
                    return;
                var indexOfScheduleLine = vm.masterAgreement.schedule.indexOf(scheduleLine);
                vm.masterAgreement.schedule.splice(indexOfScheduleLine, 1);
            };

            vm.deleteDeliveryNote = function (agreementId) {

                abp.message.confirm(
                    app.localize('DeliveryNoteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            equipmentDeliveryService.deleteDeliveryNote({
                                id: agreementId
                            }).success(function () {
                                vm.loading = false;
                                init();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );

            }

            vm.redeliver = function (row, index) {

                if (row.vehicle.statusId != 'IDL') {
                    abp.message.info(app.localize("VehicleIsNotAvailable"));
                    return;
                }

                var scheduleObject = {};
                scheduleObject.vehicleId = row.vehicleId;
                scheduleObject.vehicle = row.vehicle;
                scheduleObject.vehicleTypeId = row.vehicleTypeId;
                scheduleObject.vehicleModelId = row.vehicleModelId;
                scheduleObject.expectedDeliveryDate = row.expectedDeliveryDate;
                scheduleObject.kMs = row.kMs;
                scheduleObject.withOperator = row.withOperator;
                scheduleObject.operatorRate = row.operatorRate;
                scheduleObject.rentRate = row.rentRate;
                scheduleObject.limit = row.limit;
                scheduleObject.unitRate = row.unitRate;
                scheduleObject.masterAgreementId = row.masterAgreementId;
                scheduleObject.redeliveryRow = true;

                vm.masterAgreement.schedule.splice(index + 1, 0, scheduleObject);
                //vm.operatorChanged(scheduleObject, line);
            };

            vm.operatorChanged = function (row, line) {
                row.rentRate = 0;
                //var quotationRate = vm.masterAgreement.quotation.quotationLines.filter(e => e.vehicleTypeId == row.vehicleTypeId)[0];
                row.rentRate = row.withOperator ? line.cost : line.extras;
            };

            vm.disableOperatorCheckbox = function (line) {
                line.enableOperatorCheckbox = false;
                line.enableOperatorCheckbox = line.extras > 0 && line.cost > 0;

                var scheduleLines = vm.masterAgreement.schedule.filter(e => e.vehicleTypeId == line.vehicleTypeId && e.vehicleModelId == line.vehicleModelId);
                scheduleLines.forEach(row => {
                    if (row.agreementId)
                        row.deliveryCreated = true;
                    //row.deliveryCreated = row.vehicle ? row.vehicle.statusId == "HIR" : false;
                    vm.operatorChanged(row, line);
                });
            };

            vm.save = function () {
                vm.loading = true;
                if (vm.showInvoicingStartDate)
                    vm.masterAgreement.invoicingStartDate = moment(vm.masterAgreement.date).set("date", vm.invoiceStartDay);

                vm.masterAgreement.period = vm.period;

                masterAgreementService.createOrUpdateMasterAgreement({ masterAgreement: vm.masterAgreement })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            function createDayArray(datePassed) {
                var daysInMonth = datePassed.daysInMonth();
                vm.daysArray = [...Array(daysInMonth).keys()].map(d => ++d);
            }

            function init() {
                vm.loading = true;
                lookupService.getLocations()
                    .success(r => {
                        vm.locations = r.items;
                    });

                masterAgreementService.getMasterAgreementForView({ id: agreementId })
                    .success(function (data) {
                        vm.loading = false;
                        vm.masterAgreement = data;
                        debugger
                        vm.quotationType = vm.agreementTypes.filter(e => e.id == vm.masterAgreement.quotation.type)[0].type;


                        vm.showInvoicingStartDate = false;

                        if (vm.masterAgreement.quotation.type <= 3) { // rental quotation type
                            if (vm.masterAgreement.quotation.customer.invoicingRule
                                && vm.masterAgreement.quotation.customer.invoicingRule == 1) {
                                vm.showInvoicingStartDate = true;
                            }
                            else {
                                if (vm.masterAgreement.quotation.customer.contactCategory == 2 && invoicingRuleCorporate == 1)
                                    vm.showInvoicingStartDate = true;
                                else if (invoicingRuleIndividual == 1)
                                    vm.showInvoicingStartDate = true;
                            }
                        }
                        else { // for lease QuotaionType
                            if (vm.masterAgreement.quotation.customer.leaseInvoicingRule
                                && vm.masterAgreement.quotation.customer.leaseInvoicingRule == 1) {
                                vm.showInvoicingStartDate = true;
                            }
                            else {
                                if (vm.masterAgreement.quotation.customer.contactCategory == 2 && leaseInvoicingRuleCorporate == 1)
                                    vm.showInvoicingStartDate = true;
                                else if (leaseInvoicingRuleIndividual == 1)
                                    vm.showInvoicingStartDate = true;
                            }
                        }

                        if (vm.showInvoicingStartDate) {
                            createDayArray(moment(vm.masterAgreement.date));
                            vm.invoiceStartDay = moment(vm.masterAgreement.invoicingStartDate).format('D') / 1;
                        }

                        vm.extraHours = vm.masterAgreement.quotation.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 68)[0];   // filtering extra hours limit out of extraslines
                        vm.mobilizationCharges = vm.masterAgreement.quotation.quotationLines[0].extrasLines.filter(e => e.chargesTypeId == 26)[0];   // filtering mobilization charges out of extraslines
                        vm.period = vm.masterAgreement.quotation.quotationLines[0].years;

                        vm.masterAgreement.quotation.quotationLines.forEach(line => {
                            vm.disableOperatorCheckbox(line);
                        });
                        getChargesSettings();

                        vm.masterAgreement.schedule.forEach(row => {
                            var relatedAgreement = vm.masterAgreement.agreements.filter(e => e.id == row.agreementId)[0];
                            if (relatedAgreement)
                                row.status = relatedAgreement.status;

                            var relatedSchedules = vm.masterAgreement.schedule.filter(e => e.vehicleId == row.vehicleId && row.vehicleId);
                            if (relatedSchedules && relatedSchedules.length > 0 && !row.agreementId)
                                row.redeliveryRow = true;
                            else if (relatedSchedules && row.agreementId && row.agreementId == relatedSchedules[relatedSchedules.length - 1].agreementId)
                                row.duplicateableRow = true;

                            row.accessoriesRate = 0.0;
                            row.accessories.forEach(e => {
                                if (e.rate)
                                    row.accessoriesRate += e.rate;
                            });

                            if (row.unitRate == 0)
                                vm.calculateUnitRate(row);
                        });
                    }).finally(function () {

                    });

            }

            init();

        }]);
