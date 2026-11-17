// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:355719-356241
appModule.controller('tenant.views.crs.vouchers.invoices.generateSalikModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.toll', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', 'tollDownloader', 'abp.services.app.directory', '$interval', 'chromeExtDownloader', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, tollService, invoiceService, invoiceDueService, tollDownloader, directoryService, $interval, chromeExtDownloader, utilities) {

            var vm = this;
            vm.loading = false;
            vm.downloadingTolls = false;
            vm.all = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showPoInInvoiceEngine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowPONoInInvoicingEngine"));
            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isFineModuleEnabledAndClubbedInvoice = (vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && abp.setting.get("App.General.TrafficFineInvoice") == 1;
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            vm.isAllowMergeTollInvoice = abp.features.isEnabled("CRS.Vouchers.Invoices.AllowMergeTollInvoice");
            vm.agreements = [];
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isSalikModuleEnabledAndClubbedInvoice = vm.isSalikModuleEnabled && abp.setting.get("App.General.TollsInvoice") == 1;
            vm.isDarbModuleEnabledAndClubbedInvoice = this.isDarbModuleEnabled && abp.setting.get("App.General.DarbTollsInvoice") == 1;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;

            vm.timeOutSalikDontReportProgress = false;
            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
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
                    if (customer !== null) {
                        vm.customer = customer;
                        vm.processFilters.contactId = customer.id;
                    }
                });
            };


            vm.clearCustomer = function () {
                vm.customer = null;
                vm.processFilters.contactId = null;
                vm.merge = false;
            };

            var currentPage = 1;
            var maxCountToProcessInOneRequest = 100;
            var maxInvoicesToGenerateInOneRequest = 10;
            var moreDataToProcess = true;
            var moreDataToGenerate = true;
            vm.processing = false;
            vm.closeAgreement = false;
            vm.generating = false;
            vm.salikAccountsEnqueuedResponse = null;

            vm.searchFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateNo: null,
                includePreviousUnInvoicedTolls: true
            };

            vm.processFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateNo: null,
                contactId: null,
                includePreviousUnInvoicedTolls: false,
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest,
                server: 1
            };

            vm.generateFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateNo: null,
                includePreviousUnInvoicedTolls: false,
                includeOpenDailyWeeklyAgreements: false,
                onlyForClosedAgreements: false,
                maxGenerateInvoicesPerBatch: maxInvoicesToGenerateInOneRequest,
            };

            vm.invoicesGenerated = false;
            vm.searchedTollsCount = 0;
            vm.processedTollsTotalCount = 0;
            vm.processedTollsWithAgreementCount = 0;
            vm.processedTollsWithCloseAgreementCount = 0;
            vm.processedTollsWithCustomerCount = 0;
            vm.processedTollsWithThisAgreementCount = 0;
            vm.generatedInvoicesCount = 0;

            vm.nextSearch = function () {
                vm.searchClass = 'done';
                vm.findAgreementClass = 'active';
                vm.showSearch = false;
                vm.showAgreement = true;

                currentPage = 1;
                moreDataToProcess = true;
                vm.processFilters.skipCount = 0;
                vm.processing = true;
                vm.processedTollsTotalCount = 0;
                vm.processedTollsWithAgreementCount = 0;
                vm.processedTollsWithCloseAgreementCount = 0;
                vm.processedTollsWithCustomerCount = 0;
                vm.processedTollsWithThisAgreementCount = 0;
                processTolls();
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

                vm.generating = true;
                vm.generatedInvoicesCount = 0;
                moreDataToGenerate = true;
                if (!vm.merge)
                    generateInvoices();
                else
                    generateMergeInvoices();
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

            vm.cancel = function () {
                if (vm.downloadingTolls) {
                    abp.message.customConfirm(app.localize('Recent Tolls may not be downloaded.'),
                        app.localize('Want to cancel downloading?'),
                        function (r) {
                            if (r) {

                                if (vm.downloadingTolls) {
                                    vm.downloadingTollsCancled = true;
                                    chromeExtDownloader.closeAllTollsTabs();
                                }
                                $uibModalInstance.dismiss();
                            }
                        });
                } else {
                    $uibModalInstance.dismiss();
                }
            };


            angular.element(window).bind("keyup", keyup);
            function keyup(e) {
                if (e.keyCode == 27) {
                    vm.cancel();
                }
            }

            vm.searchTolls = function () {
                vm.searchFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.searchFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.loading = true;

                tollService.getPendingTollsToInvoice(vm.searchFilters).success(function (result) {
                    vm.searchedTollsCount = result.count;
                    vm.invoicesGenerated = false;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function processTolls() {
                vm.processFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.processFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.processFilters.tagNo = vm.searchFilters.tagNo;
                vm.processFilters.plateNo = vm.searchFilters.plateNo;
                vm.processFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.processFilters.includePreviousUnInvoicedTolls = vm.searchFilters.includePreviousUnInvoicedTolls;

                tollService.processTolls(vm.processFilters).success(function (result) {

                    vm.processedTollsTotalCount += result.processedCount;
                    vm.processedTollsWithAgreementCount += result.onAgreementsCount;
                    vm.processedTollsWithCloseAgreementCount += result.closedAgreementsCount;
                    vm.processedTollsWithCustomerCount += result.onThisCustomerCount;
                    vm.processedTollsWithThisAgreementCount += result.onThisAgreementCount;

                    //  ADD AGREEMENTS (UNIQUE)
                    if (!vm.agreements) {
                        vm.agreements = [];
                    }

                    if (result.agreements && result.agreements.length > 0) {

                        result.agreements.forEach(function (a) {

                            var exists = vm.agreements.some(function (x) {
                                return x.id === a.id;
                            });

                            if (!exists) {
                                a.selected = false; // checkbox state
                                vm.agreements.push(a);
                            }

                        });
                    }

                    moreDataToProcess = (result.processedCount > 0);

                    if (moreDataToProcess) {
                        vm.processFilters.skipCount = currentPage * maxCountToProcessInOneRequest;
                        currentPage += 1;
                        processTolls();
                    } else {
                        vm.processing = false;
                    }

                });
            }
            vm.toggleAllAgreements = function () {
                angular.forEach(vm.agreements, function (a) {
                    a.selected = vm.allAgreements;
                });
            };

            vm.agreementTicked = function () {
                var allSelected = vm.agreements.every(function (a) {
                    return a.selected;
                });

                vm.allAgreements = allSelected;
            };
            vm.generateFilters.agreementIds = vm.agreements
                .filter(function (x) { return x.selected; })
                .map(function (x) { return x.id; });
            function generateInvoices() {
                vm.generateFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.generateFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.generateFilters.tagNo = vm.searchFilters.tagNo;
                vm.generateFilters.plateNo = vm.searchFilters.plateNo;
                vm.generateFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.generateFilters.includePreviousUnInvoicedTolls = vm.searchFilters.includePreviousUnInvoicedTolls;
                vm.generateFilters.contactId = vm.processFilters.contactId;
                vm.generateFilters.continueCheck = true;

                invoiceService.generateTollInvoices(vm.generateFilters).success(function (result) {
                    vm.generatedInvoicesCount += result.invoicesCount;
                    //moreDataToGenerate = (result.agreementsCount > 0);
                    moreDataToGenerate = (result.invoicesCount > 0);
                    if (moreDataToGenerate) {
                        generateInvoices();
                    } else {
                        vm.generating = false;
                    }

                }).finally(function () {
                    //vm.saving = false;
                });
            }

            function generateMergeInvoices() {
                vm.generateFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.generateFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.generateFilters.tagNo = vm.searchFilters.tagNo;
                vm.generateFilters.plateNo = vm.searchFilters.plateNo;
                vm.processFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.generateFilters.includePreviousUnInvoicedTolls = vm.searchFilters.includePreviousUnInvoicedTolls;
                vm.generateFilters.contactId = vm.processFilters.contactId;

                //vm.generateFilters.agreementIds = (vm.agreements || [])
                //    .filter(function (x) { return x.selected; })
                //    .map(function (x) { return x.id; });

                //// ✅ optional safety
                //if (!vm.generateFilters.agreementIds.length) {
                //    abp.message.warn("Please select at least one agreement");
                //    vm.generating = false;
                //    return;
                //}
                invoiceService.generateMergeTollInvoice(vm.generateFilters).success(function (result) {
                    vm.invoiceNo = result.voucherNo;
                }).finally(function () {
                    vm.generating = false;
                });
            }

            
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.boxTicked = function (row) {
                if (vm.merge) {
                    var foundLines = $filter('filter')(vm.data.invoicesDue, {
                        customerId: row.customerId,
                        invoiceFromDate: row.invoiceFromDate,
                        invoiceToDate: row.invoiceToDate,
                    }, true);
                    vm.data.invoicesDue = foundLines;
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
                else if (id == 4)
                    return app.localize('LeaseFinancial');
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

            var salikRequest = {
                fromDate: null,
                toDate: null,
                tagNo: []
            };

            vm.enterKeyPress = function (event) {

            };

            function downloadTolls() {

                vm.downloadingTolls = true;

                if (isMv3ExtensionAvailable) {
                    chromeExtDownloader.initV3(vm);
                    tollService.prepareDataForExtension({}).success(resp => {
                        vm.tollAccountsDownloadingRes = {
                            request: {
                                fromDate: moment().add('days', -7).format('YYYY-MM-DD'),
                                toDate: null,
                                tagNo: []
                            },
                            tollAccounts: resp.salikAccounts
                        };

                        chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {
                    //Speed app uses chrome extension for salik & fines downloading
                    //- Cheking is downloding with extension is enabled

                    vm.tollStatus = {
                        dubai: {
                            progress: 0,
                            error: null,
                            status: ''
                        }
                    };

                    if (!$scope.$$phase)
                        $scope.$digest();

                    chromeExtDownloader.checkAndDownload(
                        function success() {
                            var funcNode = document.getElementById('speedExtReportingSalik');
                            if (funcNode) {
                                funcNode.parentElement.removeChild(funcNode);
                            }

                            var script = document.createElement('script');
                            script.id = 'speedExtReportingSalik';
                            script.appendChild(document.createTextNode(`function reportStatus(status) {
                            var $scope = angular.element(document.getElementsByName('generateSalikForm')).scope();
                            if (!$scope) return;

                            if (status.isComplated || status.error) {
                                $scope.vm.downloadingTolls = false;

                                //if(!status.error)
                                //    No func call on completion.

                                $scope.vm.tollStatus.dubai.error = status.error;
                                $scope.vm.tollStatus.dubai.status = status.status;
                            }
                            else {
                                $scope.vm.downloadingTolls = true;
                                $scope.vm.tollStatus.dubai.error = '';

                                $scope.vm.tollStatus.dubai.progress = status.progress;
                                $scope.vm.tollStatus.dubai.status = status.status;
                            }

                            if (!$scope.$$phase) {
                                $scope.$digest();
                            }
                        }`));
                            (document.body || document.head || document.documentElement).appendChild(script);

                            chromeExtDownloader.downloadTolls(
                                salikRequest,
                                null,
                                function error(e) {

                                    vm.downloadTolls = false;

                                    if (!$scope.$$phase)
                                        $scope.$digest();

                                    abp.message.error(e.error);
                                });
                        },
                        function error(content) {
                            vm.downloadingTolls = false;
                            abp.message.error(content, null, true);
                        }
                    );
                }
            }
            vm.hasSelectedAgreements = function () {
                if (!vm.agreements || vm.agreements.length === 0) return false;

                return vm.agreements.some(function (a) {
                    return a.selected;
                });
            };
            function init() {
                vm.searchClass = 'active';
                vm.showSearch = true;
                vm.showAgreement = false;
                vm.showInvoice = false;

                downloadTolls();
            }

            vm.showError = function () {
                var title = "SalikDownloadingError";
                if (vm.timeOutSalikDontReportProgress)
                    title = "";
                abp.message.error(
                    vm.tollStatus.dubai.error, app.localize('SalikDownloadingError')  //app.localize('PressOkToIgnoreFine'),
                );
            };

            vm.closeAllTabs = function () {
                abp.message.customConfirm(app.localize('Recent Tolls may not be downloaded.'),
                    app.localize('Want to cancel downloading?'), function (r) {
                        if (r) {

                            if (vm.downloadingTolls) {
                                vm.downloadingTollsCancled = true;
                                chromeExtDownloader.closeAllTollsTabs();
                            }
                        }
                    });
            };

            init();
        }
    ]);
