// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:411744-411971
appModule.controller('tenant.views.ers.timeSheet.createOrEditModal', [
        '$uibModalInstance', 'options', 'abp.services.app.equipmentTimeSheet', '$uibModal', 'abp.services.app.invoiceDue', 'utilities', 'abp.services.app.masterAgreement',
        function ($uibModalInstance, options, timeSheetService, $uibModal, invoiceDueService, utilities, masterAgreementService) {

            var vm = this;
            vm.loading = false;
            vm.agreements = [];
            vm.allowedHours = 0;
            //vm.timeSheet = {}
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            findInvoiceObj = () => {
                vm.invoice = vm.invoicesArray.find(e => vm.timeSheet.date >= moment(e.invoiceFromDate) && vm.timeSheet.date <= moment(e.invoiceToDate));

                if (vm.invoice) {

                    //vm.invoice = result.invoicesDue[0];
                    var units = 1;
                    if (!vm.invoice.completeMonth) {
                        var applicableDays = calculateApplicableDays(vm.invoice.invoiceToDate, vm.invoice.invoiceFromDate);
                        units = applicableDays / 26;
                        if (vm.timeSheet.agreement == 2)
                            units = applicableDays / 6;
                    }
                    vm.invoice.allowedHoursForThisInvoice = vm.allowedHours * units;
                    vm.hoursChanged();
                }
            }

            function calculateApplicableDays(fromDate, toDate) {
                var weekendDay1 = parseInt(abp.setting.get("App.General.WeekEndDay1")); // 0 to 6 (week day)
                var dateOut = moment(fromDate);
                var dateIn = moment(toDate);

                var duration;
                duration = moment.duration(dateIn.diff(dateOut));

                var hours = duration.asHours();
                var days = 0;
                var weekEndOrHolidayDays = 0;

                days = Math.floor(hours / 24);

                var d = moment(dateOut);
                for (var di = 1; di <= days; di++) { //loop days equal to applicable no of days
                    if (d.day() == weekendDay1)
                        weekEndOrHolidayDays += 1;

                    d = d.add(1, 'day');
                }

                return (days - weekEndOrHolidayDays);

            }

            getInvoicePeriodAndCharges = function () {
                vm.loading = true;
                invoiceDueService.getEquipmentInvoicesDueToGenerate({ asOfDate: moment(vm.timeSheet.date).add(2, 'months'), agreementNo: vm.timeSheet.agreement.agreementNo, agreementCategory: 7 }).success(function (result) {

                    vm.invoicesArray = result.invoicesDue;
                    vm.loading = false;
                    findInvoiceObj();
                });
            }


            vm.deliverySelected = function () {
                vm.timeSheet.agreementId = vm.timeSheet.agreement.id;
                vm.loading = true;

                masterAgreementService.getMasterAgreementForView({ id: vm.timeSheet.agreement.masterAgreementId }).success(function (data) {
                    vm.masterAgreement = data;
                    vm.deliveryRates = vm.masterAgreement.schedule.filter(e => e.agreementId == vm.timeSheet.agreement.id).map(e => {
                        var obj = {
                            isWithOperator: e.withOperator,
                            allowedHours: e.limit,
                            ratePerHour: e.unitRate,
                            rentPerMonth: e.rentRate
                        };
                        return obj;
                    })[0];
                    //.map(e => {
                    //    return {
                    //        isWithOperator = e.withOperator,
                    //        allowedHours  = e.limit,
                    //        ratePerHour  = e.unitRate,
                    //        rentPerMonth = e.rentRate
                    //    }
                    //})[0];
                    vm.allowedHours = vm.deliveryRates.allowedHours;
                    vm.isWithOperator = vm.deliveryRates.isWithOperator;
                    vm.loading = false;
                    getInvoicePeriodAndCharges();

                });

                //timeSheetService.getAllowedHours({ masterAgreementId: vm.timeSheet.agreement.masterAgreementId, id: vm.timeSheet.agreement.id }).success(function (result) {
                //    vm.deliveryRates = result;
                //    vm.allowedHours = result.allowedHours;
                //    vm.isWithOperator = result.isWithOperator;
                //    vm.loading = false;
                //    getInvoicePeriodAndCharges();
                //});




            }

            vm.hoursChanged = function () {
                vm.invoice.calculationDetails = `${vm.timeSheet.hours} hours @ ${vm.deliveryRates.ratePerHour}/hour`;

                var totalCharges = utilities.round(vm.timeSheet.hours * vm.deliveryRates.ratePerHour, 2);

                if (vm.timeSheet.hours == vm.deliveryRates.allowedHours)
                    totalCharges = vm.deliveryRates.rentPerMonth;

                if (vm.timeSheet.breakdownHours > 0)
                    vm.invoice.calculationDetails = `${vm.invoice.calculationDetails}. ${vm.timeSheet.breakdownHours} hours breakdown`;
                if (vm.timeSheet.endHours - vm.timeSheet.startHours > 0)
                    vm.invoice.calculationDetails = `${vm.invoice.calculationDetails}. Start HRM: ${vm.timeSheet.startHours},End HRM: ${vm.timeSheet.endHours}`;

                vm.invoice.calculationDetails = `${vm.invoice.calculationDetails} = ${totalCharges}`;
            }


            // search from dropdown
            vm.searchAgreements = function ($select) {
                return timeSheetService.searchAgreements({ keyword: $select.search }).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };

            vm.shifts = [
                { name: 'Day', id: 1 },
                { name: 'Night', id: 2 }
            ];

            vm.getAgreementType = function (type) {
                if (type == 1) {
                    return app.localize('Daily');
                }
                else if (type == 2) {
                    return app.localize('Weekly');
                }
                else if (type == 3) {
                    return app.localize('Monthly');
                }
                else if (type == 4) {
                    return app.localize('Lease');
                }
                else if (type == 5) {
                    return app.localize('LeaseToOwn');
                }
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/timeSheet/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.ers.timeSheet.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.timeSheet.document = result;
                });
            };

            vm.save = function () {

                vm.saving = true;
                //vm.timeSheet.hours = vm.timeSheet.endHours - vm.timeSheet.startHours;

                if (vm.timeSheet.hours < 0) {
                    abp.message.info(app.localize("Hours cannot be less than 0"));
                }

                timeSheetService.createOrUpdateTimeSheet({ timeSheet: vm.timeSheet }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.removeDocument = function () {
                vm.timeSheet.document = null;
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            function init() {
                vm.loading = true;
                timeSheetService.getTimeSheetForEdit({
                    id: options.timeSheetId
                }).success(function (result) {
                    vm.timeSheet = result;

                    if (options.timeSheetId > 0)
                        vm.deliverySelected();

                    if (!(options.timeSheetId > 0))
                        vm.timeSheet.shift = 1;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }
    ]);
