// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:351592-352568
appModule.controller('tenant.views.crs.vouchers.invoices.generateModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'abp.services.app.toll', 'options', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.customerProject',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, trafficFileService, chromeExtDownloader, tollService, options, utilities, appSession, commonLookupService, customerProjectService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.contactCategories = [];
            //vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
            vm.downloadingTolls = false;
            vm.downloadingParkings = false;
            vm.downloadingFines = false;
            vm.dueToGenerateCount = 0;
            vm.isRentalProjectEnabled = abp.features.isEnabled("CRS.CustomFeatures.RentalCustomerProject");
            vm.extendAgreement = abp.features.isEnabled("CRS.CustomFeatures.AdvanceInvoicingOnAgreementCreationAndExtension");
            vm.isSeperateInvoicesForEachChargesTypeEnabled = abp.features.isEnabled("CRS.CustomFeatures.SeperateInvoicesForEachChargesType");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDailyEnabled = utilities.parseBoolean(abp.setting.get("App.General.DailyInvoiceForDailyAgreement"));
            vm.isWeeklyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyInvoiceForWeeklyAgreement"));
            vm.showPoInInvoiceEngine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowPONoInInvoicingEngine"));
            vm.generateDaliyInvoiceForAnyPeriod = false;
            //utilities.parseBoolean(abp.setting.get("App.General.GenerateDaliyInvoiceForAnyPeriod"));
            vm.generatedCount = 0;
            vm.selectedInvoices = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            if (vm.generateDaliyInvoiceForAnyPeriod)
                vm.agreementType = 3;
            vm.branchWiseInvoicingEnabled = utilities.parseBoolean(abp.setting.get("App.General.BranchWiseInvoice"));

            vm.currentDate = moment().endOf('day');

            vm.agreementDashboardFilters = null;
            if (options.agreement) {
                vm.agreementDashboardFilters = options.agreement;
            }
            function getDateString(date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);

            }
            //Modified by arslan for Qatar fines
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");

            vm.isSalikModuleEnabledAndClubbedInvoice = vm.isSalikModuleEnabled && abp.setting.get("App.General.TollsInvoice") == 1;
            vm.isDarbModuleEnabledAndClubbedInvoice = vm.isDarbModuleEnabled && abp.setting.get("App.General.DarbTollsInvoice") == 1;
            vm.isParkingModuleEnabledAndClubbedInvoice = vm.isParkingModuleEnabled && abp.setting.get("App.General.ParkingInvoice") == 1;
            vm.isFineModuleEnabledAndClubbedInvoice = (vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && abp.setting.get("App.General.TrafficFineInvoice") == 1;

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.showFine = (vm.isDxbFinesModuleEnabled || vm.isAuhFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && (parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? false : true);
            vm.showSalik = (vm.isSalikModuleEnabled) && (parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? false : true);
            vm.showParking = (vm.isParkingModuleEnabled) && (parseInt(abp.setting.get("App.General.ParkingInvoice")) == 1 ? false : true);
            vm.includeFines = parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? true : false;
            vm.includeSalik = parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? true : false;
            vm.includeParking = parseInt(abp.setting.get("App.General.ParkingInvoice")) == 1 ? true : false;
            vm.isAllowInvoioceMerging = utilities.parseBoolean(abp.setting.get("App.General.InvoiceMergingOnToDate"));
            vm.isAllowInvoioceMergingFromDate = utilities.parseBoolean(abp.setting.get("App.General.InvoiceMergingOnFromDate"));
            vm.invoiceMergingOnSameMonth = utilities.parseBoolean(abp.setting.get("App.General.InvoiceMergingOnSameMonth"));

            vm.timeOutSalikDontReportProgress = false;
            vm.timeOutFinesDontReportProgress = false;

            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();
            vm.tollStatus = {
                dubai: {
                    isDownloading: false
                },
                abuDhabi: {
                    isDownloading: false
                }
            };

            vm.downloadedFilesCount = 0;

            vm.agreementTypes = [];
            if (vm.isDailyEnabled)
                vm.agreementTypes.push({ type: "Daily", id: 1 });
            if (vm.isWeeklyEnabled)
                vm.agreementTypes.push({ type: "Weekly", id: 2 });
            vm.agreementTypes.push({ type: "Monthly", id: 3 });

            vm.permissions = {
                canBulkGenerateForAnyAsOfDate: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForAnyAsOfDate'),
                canBulkGenerateForIndividuals: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForIndividuals'),
                canBulkGenerateForCompanies: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForCompanies'),
                canBulkGenerateBySalesPersonFilter: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateBySalesPersonFilter'),
            };

            var generateNoOfInvoicesPerBatch = 10;
            vm.searchProjects = function ($select) {
                var keyword = '';
                if ($select && $select.search)
                    keyword = $select.search;
                vm.project = null;
                vm.projectId = null;

                return customerProjectService.getCustomerProject({ status: true, filter: keyword, contactId: vm.customer.id }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };
            vm.projectSelected = function () {
                if (vm.project)
                    vm.merge = false;
            }
            vm.emptyRentalInoiveData = function () {
                if (vm.isRentalProjectEnabled) {
                    vm.data = null;
                    vm.dueToGenerateCount = 0;
                    vm.generatedCount = 0;
                    vm.selectedInvoices = 0;
                }
            }
            vm.checkSelectedInvoices = function () {
                if (vm.isRentalProjectEnabled) {
                    var totalSelectedInvoices = vm.data.invoicesDue.filter(function (element) { return element.generate == true });
                    var duplicateIds = totalSelectedInvoices
                        .map(v => v.groupNo)
                        .filter((v, i, vIds) => vIds.indexOf(v) !== i);

                    //if the auto merge is selected then we have to separate the count of same group no otherwise show the total selected rows
                    if (!vm.merge)
                        vm.selectedInvoices = totalSelectedInvoices.length - duplicateIds.length;
                    else {
                        var selectedInvoicesLength = totalSelectedInvoices.length;
                        //in case of merge all the invoices selected will make a single merge invoice, so we should show the count to one if selected are more than one 
                        if (selectedInvoicesLength > 1)
                            vm.selectedInvoices = 1;
                        else
                            vm.selectedInvoices = selectedInvoicesLength;
                    }
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: vm.contactCategory, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.customer = customer;
                        vm.customerId = customer.id;
                    }
                });
            };
            vm.clearCustomer = function () {
                vm.customer = null;
                vm.customerId = null;
                vm.merge = false;
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.changeMergedCheck = function () {
                var continued = true;
                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate && continued) {
                        vm.boxTicked(invoiceDue);
                        continued = false;
                    }
                });
            };

            vm.boxTicked = function (row) {
                if (vm.merge) {

                    if (vm.generateDaliyInvoiceForAnyPeriod) {


                        if (vm.masterAgreementNo && row.isClosingInvoice) {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                customerId: row.customerId,
                                isClosingInvoice: row.isClosingInvoice,
                                masterAgreementNo: row.masterAgreementNo

                            }, true);
                            vm.data.invoicesDue = foundLines;
                        } else {
                            var currentDate = moment(row.invoiceToDate).toDate();
                            var foundLines = vm.data.invoicesDue.filter(function (item) {
                                return (
                                    item.customerId === row.customerId &&
                                    item.isClosingInvoice === row.isClosingInvoice
                                    &&
                                    getDateString(item.invoiceToDate) === getDateString(currentDate)
                                );
                            });

                            vm.data.invoicesDue = foundLines;
                        }

                    }
                    else {
                        if (vm.isAllowInvoioceMerging) {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                customerId: row.customerId,
                                invoiceToDate: row.invoiceToDate,
                            }, true);
                            vm.data.invoicesDue = foundLines;

                        }
                        else if (vm.isAllowInvoioceMergingFromDate) {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                customerId: row.customerId,
                                invoiceFromDate: row.invoiceFromDate,
                            }, true);
                            vm.data.invoicesDue = foundLines;

                        }
                        else if (vm.invoiceMergingOnSameMonth) {

                            var baseDate = moment(row.invoiceFromDate);

                            var monthStart = baseDate.clone().startOf('month');
                            var monthEnd = baseDate.clone().endOf('month');

                            var foundLines = vm.data.invoicesDue.filter(function (inv) {

                                if (inv.customerId !== row.customerId)
                                    return false;

                                var invFrom = moment(inv.invoiceFromDate);
                                var invTo = moment(inv.invoiceToDate);

                                // overlap check inside same month
                                return invFrom.isSameOrBefore(monthEnd) &&
                                    invTo.isSameOrAfter(monthStart);
                            });

                            vm.data.invoicesDue = foundLines;
                        }

                        else {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                customerId: row.customerId,
                                invoiceFromDate: row.invoiceFromDate,
                                invoiceToDate: row.invoiceToDate,
                            }, true);
                            vm.data.invoicesDue = foundLines;
                        }
                    }

                }
            };

            vm.allBoxTicked = function () {
                if (vm.data == null) return;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.invoiceNo == null)
                        invoiceDue.generate = vm.all;
                });
            };

            vm.getInvoicingRule = function (id) {
                if (id == 1)
                    return app.localize('DateToDate');
                else if (id == 2)
                    return app.localize('CalendarMonth');
                else if (id == 3)
                    return app.localize('ThirtyDays');
                else
                    return '';
            };

            vm.getInvoicingType = function (id) {
                if (id == 1)
                    return app.localize('Advance');
                else if (id == 2)
                    return app.localize('Post');
                else
                    return '';
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                var invoicesToGenerate = [];
                var i = 1;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.invoiceToDriverNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
                        if (vm.isRentalProjectEnabled) {
                            if (invoicesToGenerate.some(x => x.groupNo == invoiceDue.groupNo) || invoicesToGenerate.length == 0) {
                                invoicesToGenerate.push(invoiceDue);
                                i += 1;
                            }
                        } else {
                            invoicesToGenerate.push(invoiceDue);
                            i += 1;
                        }
                    }
                });

                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;
                vm.isEnableGeneratedInvoices = false;
                var merge = false;

                //If there are more than one rows with same groupNo then those have to merge
                if (vm.isRentalProjectEnabled && invoicesToGenerate.length > 1) {
                    merge = true;
                }

                invoiceService.generateInvoices({
                    invoicesDue: invoicesToGenerate,
                    IsMerge: merge,
                    includeFines: vm.includeFines,
                    includeSalik: vm.includeSalik,
                    includeParking: vm.includeParking
                }).success(function (data) {
                    generatedInvoices = data;
                    var generatedInvoiceNos = [];

                    angular.forEach(generatedInvoices, function (generateInvoice) {

                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            rowId: generateInvoice.rowId,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].error = generateInvoice.error;
                            foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                            foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;


                            if ((generateInvoice.invoiceId > 0 || generateInvoice.invoiceToDriverId > 0) && !generatedInvoiceNos.some(x => x == generateInvoice.invoiceNo)) {
                                vm.generatedCount += 1;
                                generatedInvoiceNos.push(generateInvoice.invoiceNo);

                            }
                        }
                    });
                    vm.isEnableGeneratedInvoices = true;

                    //if (generatedInvoices.length > 0) //continue generating invoices till not invoice is pending to generate
                    if (generatedInvoices.length > 0 || i <= vm.data.invoicesDue.length) //continue generating invoices till not invoice is pending to generate
                        vm.generate();
                    else
                        vm.saving = false;

                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {

                });
            };
            vm.mergeInvoice = function () {
                var invoicesToGenerate = [];


                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate && !invoiceDue.invoiceId) { // Check if invoice is marked for generation and not already generated
                        invoicesToGenerate.push(invoiceDue);
                    }
                });

                if (invoicesToGenerate.length === 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;
                vm.isEnableGeneratedInvoices = false;

                invoiceService.generateInvoices({
                    invoicesDue: invoicesToGenerate,
                    IsMerge: vm.merge,
                    includeFines: vm.includeFines,
                    includeSalik: vm.includeSalik,
                    includeParking: vm.includeParking
                }).success(function (data) {
                    generatedInvoices = data;
                    angular.forEach(generatedInvoices, function (generateInvoice) {
                        // Check if the generated invoice number already exists

                        var foundLines = $filter('filter')(vm.data.invoicesDue, { rowId: generateInvoice.rowId }, true);
                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].error = generateInvoice.error;
                            foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                            foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;
                            vm.generatedCount += 1;

                        }

                    });
                    vm.saving = false;
                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;
                }).finally(function () {
                    vm.isEnableGeneratedInvoices = true;
                });
            };
            //Old downloading methods 
            //---------------------------------------
            //function downloadTolls() {
            //    vm.downloadingTolls = true;
            //    tollService.downloadAllTolls(
            //    ).success(function (result) {

            //    }).finally(function () {
            //        vm.downloadingTolls = false;
            //    });
            //}

            //function downloadFines() {
            //    vm.downloadingFines = true;
            //    fineService.downloadAllFines(
            //      ).success(function (result) {

            //      }).finally(function () {
            //          vm.downloadingFines = false;
            //      });
            //}


            vm.skipClosedInvoiceDue = function (row) {
                abp.message.confirm(
                    'Do you want to ignore this?',
                    function (isConfirmed) {
                        if (isConfirmed) {

                            vm.loading = true;
                            invoiceDueService.ignoreInvoiceDueToGenerate(row.agreementId)
                                .then(function (result) {
                                    vm.getInvoicesDueToGenerate();
                                })
                                .finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };


            vm.getInvoicesDueToGenerate = function () {
                if (vm.isRentalProjectEnabled && vm.merge && vm.customerId == null) {
                    //abp.notify.error('Please select customer.');
                    abp.message.info('Please select customer');
                    return true;
                } else {
                    vm.isEnableGeneratedInvoices = false;
                    generatedInvoices = [];

                    vm.loading = true;
                    invoiceDueService.getInvoicesDueToGenerate({ agreementCategory: 1, agreementNo: vm.agreementNo, masterAgreementNo: vm.masterAgreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId, salesPersonId: vm.salesPersonId, projectId: vm.projectId, contactCategory: vm.contactCategory, agreementType: vm.agreementType }).success(
                        function (result) {
                            vm.data = result;

                            if (vm.extendAgreement) {
                                vm.filteredInvoicesDue = [];
                            }

                            angular.forEach(vm.data.invoicesDue, function (invoiceDue) {

                                invoiceDue.invoicePeriodMinutes = null;
                                invoiceDue.showIgnoreButton = false;
                                invoiceDue.isClosingInvoice = false; 

                                if (invoiceDue.invoiceFromDate && invoiceDue.invoiceToDate) {
                                    const from = moment(invoiceDue.invoiceFromDate);
                                    const to = moment(invoiceDue.invoiceToDate);
                                    const diffMinutes = to.diff(from, 'minutes');

                                    if (invoiceDue.completeClosing || invoiceDue.partialClosing) {
                                        invoiceDue.isClosingInvoice = true;

                                        invoiceDue.invoicePeriodMinutes = diffMinutes;
                                        invoiceDue.showIgnoreButton = diffMinutes >= 0 && diffMinutes < 1440;
                                    }
                                    
                                    // If extendAgreement, filter invoices < 48 hours
                                    if ((vm.extendAgreement && diffMinutes >= 2880) || invoiceDue.isClosingInvoice) {
                                        vm.filteredInvoicesDue.push(invoiceDue);
                                    }
                                }
                            });

                            if (vm.extendAgreement) {
                                vm.data.invoicesDue = vm.filteredInvoicesDue;
                            }


                            vm.dueToGenerateCount = vm.data.invoicesDue.length;
                            vm.generatedCount = 0;
                            if (vm.isRentalProjectEnabled) {
                                vm.selectedInvoices = 0;
                                //get the elements with same groupNo and give them one color and give the remaining one color
                                const duplicateIds = vm.data.invoicesDue
                                    .map(v => v.groupNo)
                                    .filter((v, i, vIds) => vIds.indexOf(v) !== i)

                                vm.data.invoicesDue.forEach(function (element) {
                                    if (duplicateIds.some(x => x == element.groupNo))
                                        element.backgroundColor = 'grey';
                                    else
                                        element.backgroundColor = 'white';
                                });
                                var newArray = [];
                                var array = vm.data.invoicesDue;


                                //Arrange the record in the array in such a way that the records with same groupNo are together
                                function compare(a, b) {
                                    const groupNoA = a.groupNo;
                                    const groupNoB = b.groupNo;

                                    let comparison = 0;
                                    if (groupNoA < groupNoB) {
                                        comparison = -1;
                                    } else if (groupNoA > groupNoB) {
                                        comparison = 1;
                                    }
                                    return comparison;
                                }
                                vm.data.invoicesDue.sort(compare);

                                //Give different colors to the alternate groupNo and same color to the same groupNos
                                var j = 0;
                                for (var i = 0; i < vm.data.invoicesDue.length; i++) {
                                    j = i + 1;
                                    if (j != vm.data.invoicesDue.length) {

                                        if (vm.data.invoicesDue[j].groupNo == vm.data.invoicesDue[i].groupNo) {
                                            vm.data.invoicesDue[j].backgroundColor = vm.data.invoicesDue[i].backgroundColor;
                                        }
                                        else {
                                            if (vm.data.invoicesDue[i].backgroundColor == 'white') {
                                                vm.data.invoicesDue[j].backgroundColor = 'grey';
                                            } else {
                                                vm.data.invoicesDue[j].backgroundColor = 'white';
                                            }
                                        }
                                    }
                                }
                            }

                        })
                        .finally(function () {
                            vm.loading = false;
                        });

                    //if salik or fine enabled then first download then get agreement list after downloading
                    if (vm.isFineModuleEnabledAndClubbedInvoice ||
                        vm.isSalikModuleEnabledAndClubbedInvoice ||
                        vm.isDarbModuleEnabledAndClubbedInvoice ||
                        vm.isParkingModuleEnabledAndClubbedInvoice) {

                        createStatusScript();

                        if (vm.isFineModuleEnabledAndClubbedInvoice)
                            downloadFines();

                        if (vm.isSalikModuleEnabledAndClubbedInvoice || vm.isParkingModuleEnabledAndClubbedInvoice)
                            downloadTolls();

                        if (vm.isDarbModuleEnabledAndClubbedInvoice)
                            downloadDarbTolls();
                    }
                }
            };

            var salikRequest = {
                fromDate: null,
                toDate: null,
                downloadParkingAlso: vm.isParkingModuleEnabled,
                tagNo: []
            };

            function createStatusScript() {

                let helperFunc = `function reportStatus(status) {
                                var $scope = angular.element(document.getElementsByName('generateInvoicesForm')).scope();
                                if (!$scope) return;
                                if (!status.isEtoll) {
                                    if (status.isComplated || status.error) {
debugger;
                                        $scope.vm.tollStatus.dubai.isDownloading = false;

                                        $scope.vm.tollStatus.dubai.error = status.error;
                                        $scope.vm.tollStatus.dubai.status = status.status;
                                    }
                                    else {
                                        $scope.vm.tollStatus.dubai.isDownloading = true;
                                        $scope.vm.tollStatus.dubai.error = '';

                                        $scope.vm.tollStatus.dubai.progress = status.progress;
                                        $scope.vm.tollStatus.dubai.status = status.status;
                                    }
                                }`;
                if (vm.isDarbModuleEnabled)
                    helperFunc += `else {
                                    if (status.isComplated || (status.error && !status.error === {})) {
debugger;
                                        $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                                        $scope.vm.tollStatus.abuDhabi.error = status.error;
                                        $scope.vm.tollStatus.abuDhabi.status = status.status;
                                    }
                                    else {
                                        $scope.vm.tollStatus.abuDhabi.isDownloading = true;
                                        $scope.vm.tollStatus.abuDhabi.error = '';

                                        $scope.vm.tollStatus.abuDhabi.progress = status.progress;
                                        $scope.vm.tollStatus.abuDhabi.status = status.status;
                                    }
                                } `;

                helperFunc += `if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            } `;
                var funcNode = document.getElementById('speedExtReportingSalik');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                var script = document.createElement('script');
                script.id = 'speedExtReportingSalik';
                script.appendChild(document.createTextNode(helperFunc));

                (document.body || document.head || document.documentElement).appendChild(script);
            }

            function downloadDarbTolls() {

                vm.tollStatus.abuDhabi.isDownloading = true;

                var currentDate = moment().utc().format('YYYY-MM-DDThh:mm:ss') + 'Z';

                let darbRequest = {
                    fromDate: moment().add('days', -7).format('YYYY-MM-DD'),
                    toDate: currentDate,
                    tagNo: [],
                    isEtoll: true
                };

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    tollService.prepareDataForExtension(darbRequest).success(resp => {

                        debugger;
                        let tollAccounts = (resp.accountWithPlateNos.length ? vm.salikAccounts.filter(x => resp.accountWithPlateNos.find(y => y == x.username)) : resp.salikAccounts)

                        if (vm.tollAccountsDownloadingRes) {
                            vm.tollAccountsDownloadingRes.isEtoll = darbRequest.isEtoll;
                            vm.tollAccountsDownloadingRes.plateNos = darbRequest.plateNos;
                            vm.tollAccounts = [...vm.tollAccounts || [], ...tollAccounts];
                        }
                        else
                            vm.tollAccountsDownloadingRes = {
                                request: darbRequest,
                                tollAccounts: tollAccounts
                            };

                        chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {
                    chromeExtDownloader.downloadTolls(
                        darbRequest,
                        function success(s) { },
                        function error(e) {

                            vm.tollStatus.abuDhabi.isDownloading = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error);
                        });
                }
            }

            function downloadTolls() {

                //vm.downloadingTolls = true;

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm);
                    const isEtoll = !vm.isSalikModuleEnabledAndClubbedInvoice;
                    tollService.prepareDataForExtension({ isEToll: isEtoll }).success(resp => {

                        if (isEtoll)
                            vm.tollStatus.abuDhabi.isDownloading = true;
                        else
                            vm.tollStatus.dubai.isDownloading = true;

                        vm.tollAccountsDownloadingRes = {
                            request: {
                                fromDate: moment().add('days', -7).format('YYYY-MM-DD'),
                                toDate: null,
                                tagNo: []
                            },
                            tollAccounts: resp.salikAccounts
                        };

                        if (vm.isSalikModuleEnabledAndClubbedInvoice && vm.isDarbModuleEnabledAndClubbedInvoice) {
                            vm.tollStatus.abuDhabi.isDownloading = true;
                            tollService.prepareDataForExtension({ isEToll: true }).success(darbResp => {
                                vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(darbResp.salikAccounts);
                                chromeExtDownloader.downloadTollsV3(vm, null);
                            });
                        }
                        else
                            chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {

                    chromeExtDownloader.downloadTolls(
                        salikRequest,
                        null,
                        function error(e) {

                            vm.downloadTolls = false;

                            if (!$scope.$$phase)
                                $scope.$digest();

                            abp.message.error(e.error);
                        }
                    );
                }
            }

            function downloadFines() {

                vm.downloadingFines = true;
                vm.downloadedFilesCount = 0;
                vm.traffFilesDownloadingRes = [];

                trafficFileService.getTrafficFiles()
                    .success(function (r) {

                        for (var i in r.items) {
                            vm.traffFilesDownloadingRes.push({
                                isComplete: false,
                                status: '',
                                progress: 0,
                                error: '',
                                trafficFile: r.items[i]
                            });
                        }

                        if (isMv3ExtensionAvailable)
                            chromeExtDownloader.downloadFinesV3(vm, r.items, false);
                        else {
                            if (!$scope.$$phase) $scope.$digest();

                            chromeExtDownloader.downloadFines(
                                {
                                    trafficFileIds: r.items
                                },

                                `function processCaptcha(msg) {
                                    var $scope = angular.element(document.querySelector('[name="generateInvoicesForm"]')).scope();
                                    var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId && msg.state.indexOf('Abu') > -1);
                                    trafficFile.captchaSrc = msg.captcha;
                                    trafficFile.captchaTxt = '';

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }

                                function reportFineStatus(msg) {
                                    var $scope = angular.element(document.querySelector('[name="generateInvoicesForm"]')).scope();
                                    var trafficFile = $scope.vm.traffFilesDownloadingRes.find(x => x.trafficFile.fileId === msg.trafficFile.fileId);
                                    trafficFile.progress = msg.progress;
                                    trafficFile.error = msg.error;
                                    trafficFile.status = msg.status;

                                    if (!trafficFile.error)
                                        trafficFile.isComplete = msg.isComplated;
                                    else {
                                        trafficFile.isComplete = true;
                                        msg.progress = 100;
                                    }

                                    if (trafficFile.isComplete && msg.allDone) {
                                        $scope.vm.downloadingFines = false;
                                    }


                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }`,
                                function error() {
                                    vm.downloadingFines = false;

                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                }
                            );
                        }
                    });
            }

            vm.showError = function (error, isFine) {

                var title = 'SalikDownloadingError';

                if (vm.timeOutSalikDontReportProgress || vm.timeOutFinesDontReportProgress) {
                    title = "TemporaryDownloadingIssue";
                }
                else if (isFine) {
                    title = "FinesDownloadingError";
                }

                abp.message.error(
                    error, app.localize(title)  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.sendCaptcha = function (row) {
                chromeExtDownloader.sendCaptcha(row);
            };

            vm.focusWindow = function (r) {
                chromeExtDownloader.focusWindow({
                    type: 'fine',
                    trafficFileId: r.trafficFile.fileId
                });
            };

            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Tolls/Fines may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                        if (r) {
                            if (isMv3ExtensionAvailable) {
                                chromeExtDownloader.closeAllTabs({ action: "closeAllTabs" });

                                if (vm.downloadingTolls || vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                                    vm.tollStatus.dubai.isDownloading = false;
                                    vm.downloadingTollsCancled = true;
                                    vm.tollStatus.abuDhabi.isDownloading = false;
                                }

                                if (vm.downloadingFines) {
                                    vm.downloadingFines = false;
                                    vm.downloadingFinesCancled = true;
                                }

                                vm.callbackOnComplete = () => {
                                    console.log('callbackOnComplete, downloading canceled');
                                };

                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            }
                            else {
                                if (vm.downloadingTolls || vm.tollStatus.dubai.isDownloading || vm.tollStatus.abuDhabi.isDownloading) {
                                    vm.downloadingTollsCancled = true;
                                    chromeExtDownloader.closeAllTollsTabs();
                                }

                                if (vm.downloadingFines) {
                                    vm.downloadingFinesCancled = true;
                                    chromeExtDownloader.closeAllFinesTabs();
                                }
                            }
                        }
                    });
            };


            function getLocations() {

                commonLookupService.getLocations({
                }).success(function (data) {
                    var location = data.items.find(e => e.id == appSession.user.locationId);
                    vm.locationName = location.name;

                });
            };

            function getContactTypes() {
                if (vm.permissions.canBulkGenerateForIndividuals) {
                    vm.contactCategories.push({ id: 1, name: app.localize('Individuals') });
                }
                if (vm.permissions.canBulkGenerateForCompanies) {
                    vm.contactCategories.push({ id: 2, name: app.localize('Companies') });
                }
                if (!vm.permissions.canBulkGenerateForIndividuals && !vm.permissions.canBulkGenerateForCompanies) {
                    vm.disableButton = true;
                }
            };

            vm.clearSalesPerson = function () {
                vm.salesPerson = null;
                vm.salesPersonId = null;
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            function init() {
                if (vm.agreementDashboardFilters) {
                    vm.asOfDate = moment();
                    vm.customer = vm.agreementDashboardFilters.customer;
                    vm.customerId = vm.agreementDashboardFilters.customerId;
                    vm.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.getInvoicesDueToGenerate();
                } else {
                    vm.asOfDate = vm.currentDate;
                }
                if (vm.isRentalProjectEnabled)
                    vm.merge = false;
                if (vm.branchWiseInvoicingEnabled)
                    getLocations();

                getContactTypes();
            }
            init();

        }
    ]);
