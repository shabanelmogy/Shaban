// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:491361-491779
appModule.controller('tenant.views.workshop.jobs.createInvoiceOnOpenJob', [
        '$uibModalInstance', 'abp.services.app.job', 'jobId', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.chargesSetting',
        function ($uibModalInstance, jobAppService, jobId, utilities, vehicleService, chargesSettingService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isPostTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.PostTaxInclusive"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isGenerateInvoiceOnCloseJob = abp.features.isEnabled('WORKSHOP_GenerateInvoiceOnJobClose');
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.isChargesTypeWiseLinkingForWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeWiseLinkingForWorkShop");
            vm.saving = false;
            vm.isEditMod = false;

            vm.insuranceCompanySumTax = 0;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.jobLog = {
                jobId: jobId,
                detail: ''
            }

            vm.jobTypes = [
                { id: 1, name: app.localize("RoutineService") },
                { id: 2, name: app.localize("MechanicalService") },
                { id: 3, name: app.localize("ElectricalService") },
                { id: 4, name: app.localize("DentingAndPainting") },
                { id: 5, name: app.localize("AccidentService") },
                { id: 6, name: app.localize("ACService") },
                { id: 7, name: app.localize("BreakdownService") },
                { id: 8, name: app.localize("TyreService") },
                { id: 9, name: app.localize("UnitMaintenance") },
                { id: 10, name: app.localize("UnitRepair") },
                { id: 11, name: app.localize("RegularLubrications") },
                { id: 12, name: app.localize('BodyShop') },
                { id: 13, name: app.localize('InspectionJob') },
                { id: 14, name: app.localize('MakeReadyForSaleOrRent') },
                { id: 15, name: app.localize('Polishing') },
                { id: 16, name: app.localize('Others') }
            ];


            vm.insuranceTypes = [
                { id: 1, name: app.localize("ExcessRepair") },
                { id: 2, name: app.localize("FullInsurance") }
            ];

            vm.getJobType = function (type) {
                let jobType = vm.jobTypes.filter(e => e.id == type);
                return jobType && jobType.length > 0 ? jobType[0].name : '';
            };

            vm.getInsuranceType = function (type) {
                var insuranceType = vm.insuranceTypes.filter(e => e.id == type)[0].name;
                return insuranceType;
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.damageChargesChanged = function (jd) {
                jd.insuranceCompanyItemsAmount = jd.itemsCharges - jd.excessToDamage - jd.excessFromParts;
                vm.sumInsuranceCompanyAmount();
                vm.sumInsuranceTax();
            };

            vm.removeRow = function (obj, isInsuranceCompanyInvoice = false) {
                let invoice = !isInsuranceCompanyInvoice ? vm.invoice : vm.invoiceOnInsuranceCompany;
                let index = invoice.voucherLines.indexOf(obj);
                invoice.voucherLines.splice(index, 1);
                //vm.sumAmount();
                vm.sumAmountTax(isInsuranceCompanyInvoice);
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.sumAmountTax = function (isInsuranceCompanyInvoice = false) {
                let totalAmount = 0.0;
                let totalTax = 0.0;
                let invoice = !isInsuranceCompanyInvoice ? vm.invoice : vm.invoiceOnInsuranceCompany;
                invoice.voucherLines.forEach(function (value) {
                    if (value.credit > 0 || value.credit < 0)
                        totalAmount = totalAmount + parseFloat(value.credit);
                    if (value.tax > 0 || value.tax < 0) {
                        //value.taxable = true;
                        totalTax += utilities.round(value.tax, 2);
                    }
                    //else
                    //value.taxable = false;
                    value.amount = value.credit + value.tax;
                });
                invoice.tax = totalTax;
                invoice.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                invoice.amount = utilities.round(invoice.amount, 2);
                if (invoice.amount > 0) {
                    let currencyName = null;
                    let decimalName = null;
                    if (vm.isMultiCurrencyEnabled) {
                        if (invoice.contact) {
                            currencyName = invoice.contact.currencyDto ? invoice.contact.currencyDto.name : null;
                            decimalName = invoice.contact.currencyDto ? invoice.contact.currencyDto.decimalName : null;
                        }
                    }
                    if (vm.autoCalculateAmountInWords == "true")
                        invoice.amountInWords = utilities.toWords(invoice.amount, currencyName, decimalName);
                }
            };

            vm.cancel = function () {
                if (vm.downloadingFines) {
                    abp.message.customConfirm(app.localize('Recent Fines may not be downloaded.'),
                        app.localize('Want to cancel downloading?'),
                        function (r) {
                            if (r) {
                                chromeExtDownloader.closeAllFinesTabs();
                                vm.downloadingFinesCancled = true;
                                $uibModalInstance.dismiss();
                            }
                        });
                } else {
                    $uibModalInstance.dismiss();
                }
            };
            function getChargesTypes() {
                vm.loading = true;
                chargesSettingService.getConfiguredChargesTypes({ module: 6 }).success(function (data) {
                    vm.chargesTypes = data.items;
                    
                    if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                        chargesSettingService.getChargesTypes().success((data) => {
                            vm.selectedChargesTypes.forEach(ct => {
                                var chargesType = data.find(e => e.id == ct.id);
                                vm.chargesTypes.push(chargesType);
                            });
                        });
                    }
                    //angular.forEach(vm.chargesTypes, function (row) {
                    //    row.name = app.localize(row.name);
                    //});
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.calculateTaxPerRow = function (row, isInsuranceCompanyInvoice = false) {
                if (vm.invoice == null)
                    return 0;

                if (row == null)
                    return 0;

                var sum = 0;
                var totalTax = 0.0;

                if (row.credit != null) {
                    if (vm.invoice.taxPercent > 0) {
                        var tax = 0;
                        if (row.chargesType) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        else if (row.accountId) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (row.credit * 100) / (100 + vm.invoice.taxPercent);
                                tax = utilities.round(row.credit - chargesWithoutTax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(row.credit * vm.invoice.taxPercent / 100, 2);
                                // vm.tripCharges[i].charges += utilities.round(tax,2);

                            }
                            row.tax = tax;
                            row.taxable = true;
                        }
                        //else {
                        //    row.tax = 0;
                        //    row.taxable = (row.chargesType.taxable || row.taxable);
                        //}

                    }
                    else {
                        row.tax = 0;
                        row.taxable = (row.chargesType ? row.chargesType.taxable : false) || row.taxable;
                    }
                }

                vm.sumAmountTax(isInsuranceCompanyInvoice);
                row.amount = row.credit + row.tax;
            };

            vm.addRow = function (line, isInsuranceCompanyInvoice = false) {
                let invoice = !isInsuranceCompanyInvoice ? vm.invoice : vm.invoiceOnInsuranceCompany;
                if (invoice?.voucherLines) {
                    if (line == undefined) {
                        line = new Object();
                        line.chargesType = null;
                        line.account = null;
                        line.vehicle = null;
                        line.description = null;
                        line.credit = null;
                        line.tax = null;
                    }

                    if (vm.newRowAgreement) {
                        line.agreement = vm.newRowAgreement;
                        line.agreementId = vm.newRowAgreement.id;
                    }

                    invoice.voucherLines.push(line);
                }
            };

            angular.element(window).bind("keyup", keyup);
            function keyup(e) {
                if (e.keyCode == 27) {
                    vm.cancel();
                }
            }

            function init() {
                getChargesTypes();

                vm.searchClass = 'active';
                vm.showSearch = true;
                vm.showAgreement = false;
                vm.showInvoice = false;
                vm.loading = true;
                jobAppService.getJobForClosing({ id: jobId }).success(function (result) {
                    if (result.createdInvoicesAmount > 0) {
                        abp.message.error('Invoice is already created on this Job');
                        $uibModalInstance.dismiss();
                    }
                    vm.job = result;
                    vm.jobOriginal = angular.copy(result);
                    vm.sumInsuranceCompanyAmount();
                    vm.sumInsuranceTax();
                    vm.sumCustomerTax();
                    vm.nextSearch();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

            vm.generateInvoices = function () {
                vm.saving = true;
                jobAppService.closeWorkShop(vm.job).success(function (result) {
                    vm.preCloseJob = result;
                    vm.invoice = vm.preCloseJob.invoiceOnCustomer;
                    vm.invoice.date = vm.job.completionDateTime;
                    if (vm.preCloseJob.invoiceOnInsuranceCompany?.amount > 0) {
                        abp.message.error('Invoice of insurance company cannot be created for Open Job');
                        $uibModalInstance.dismiss();
                    }
                    //vm.invoiceOnInsuranceCompany = vm.preCloseJob.invoiceOnInsuranceCompany;
                    //vm.invoiceOnInsuranceCompany.date = moment(vm.job.completionDateTime).format('MM/DD/YYYY h:mm a');
                    vm.sumAmountTax();
                    vm.sumAmountTax(true);
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.createInvoice = () => {
                //if (vm.invoiceOnInsuranceCompany.amount != vm.totalInvoiceOnInsuranceCompany) {
                //    abp.message.error(`Insurance company invoice amount should be equal to ${vm.totalInvoiceOnInsuranceCompany}`);
                //    return;
                //}
                //if (vm.invoice.amount != vm.totalInvoiceOnCustomer) {
                //    abp.message.error(`Invoice amount should be equal to ${vm.totalInvoiceOnCustomer}`);
                //    return;
                //}

                vm.saving = true;
                jobAppService.createInvoice({
                    closingJob: vm.preCloseJob.closingJob,
                    invoiceOnCustomer: vm.preCloseJob.invoiceOnCustomer.amount > 0 ? vm.preCloseJob.invoiceOnCustomer : null,
                    invoiceOnInsuranceCompany: null
                })
                    .success(() => {
                        abp.notify.success(app.localize("SavedSuccessfully"));
                    })
                    .finally(() => {
                        vm.saving = false;
                        $uibModalInstance.dismiss();
                    });
            }

            vm.closeWorkShopInsurance = function () {
                vm.preCloseJob.invoiceOnCustomer = vm.invoice;
                jobAppService.closeWorkShop(vm.preCloseJob).success(function (result) {
                    vm.preCloseJob = result;
                    vm.invoice = vm.preCloseJob.invoiceOnCustomer;
                }).finally(function () {
                    vm.saving = false;
                });


            };

            vm.sumInsuranceCompanyAmount = function () {
                var insuranceSum = 0;
                vm.job.jobDetail.forEach(e => {
                    insuranceSum += e.insuranceCompanyItemsAmount + e.insuranceCompanyLabourAmount + e.insuranceCompanyMiscAmount;
                })

                vm.insuranceCompanySum = insuranceSum;
                vm.sumCustomerTax();
            }

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.nextSearch = function () {
                vm.searchClass = 'done';
                vm.findAgreementClass = 'active';
                vm.showSearch = false;
                vm.showAgreement = true;
                vm.totalInvoiceOnInsuranceCompany = vm.insuranceCompanySum + vm.insuranceCompanySumTax;
                vm.totalInvoiceOnCustomer = vm.job.totalCharges - (vm.insuranceCompanySum + vm.insuranceCompanySumTax);
                vm.generateInvoices();
            };

            vm.previousAgreement = function () {
                vm.showAgreement = false;
                vm.showSearch = true;
                vm.searchClass = 'active';
                vm.findAgreementClass = '';
            };

            vm.nextAgreement = function () {
                vm.showAgreement = false;
                vm.showInvoice = true;
                vm.findAgreementClass = 'done';
                vm.invoiceClass = 'active';
                angular.forEach(vm.findAgreements, function (invoiceDue) {
                    invoiceDue.generate = false;
                });
            };

            vm.previousInvoice = function () {
                vm.showInvoice = false;
                vm.showAgreement = true;
                vm.findAgreementClass = 'active';
                vm.invoiceClass = '';
            };

            vm.finishInvoice = function () {
                vm.invoiceClass = 'done';
            };

            vm.sumInsuranceTax = function () {
                var insuranceTaxSum = 0;
                vm.job.jobDetail.forEach(e => {
                    if (e.insuranceCompany) {
                        if (!e.insuranceCompany.isTaxExempted) {
                            insuranceSum = e.insuranceCompanyItemsAmount + e.insuranceCompanyLabourAmount + e.insuranceCompanyMiscAmount;
                            insuranceTaxSum += utilities.round((vm.taxPercent / 100) * insuranceSum, 2);
                        }
                    }
                })
                if (vm.job.customer.isTaxExempted) {
                    vm.job.tax = insuranceTaxSum;
                    vm.job.totalCharges = vm.jobOriginal.totalCharges + vm.job.tax;
                }

                vm.insuranceCompanySumTax = insuranceTaxSum;
                vm.sumCustomerTax();
            }

            vm.sumCustomerTax = function () {
                var customerSum = vm.jobOriginal.totalCharges - vm.jobOriginal.tax - vm.insuranceCompanySum;

                var customerTax = utilities.round((vm.jobOriginal.taxPercent / 100) * customerSum, 2);
                if (!vm.job.customer.isTaxExempted) {
                    if (vm.job.totalCharges) {
                        vm.job.totalCharges = vm.job.totalCharges - vm.job.tax;
                        vm.job.tax = customerTax + vm.insuranceCompanySumTax;
                        vm.job.totalCharges = vm.job.totalCharges + vm.job.tax;
                    }

                }
            }
        }]);
