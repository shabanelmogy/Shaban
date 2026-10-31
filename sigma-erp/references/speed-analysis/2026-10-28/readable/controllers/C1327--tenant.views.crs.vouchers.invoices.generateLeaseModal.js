// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:350661-351272
appModule.controller('tenant.views.crs.vouchers.invoices.generateLeaseModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'options', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.toll',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, trafficFileService, chromeExtDownloader, options, utilities, appSession, commonLookupService, tollService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.contactCategories = [];
            vm.data = null;
            vm.disableContact = false;
            vm.downloadingTolls = false;
            vm.downloadingFines = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.showPoInInvoiceEngine = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowPONoInInvoicingEngine"));
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isSeperateInvoicesForEachChargesTypeEnabled = abp.features.isEnabled("CRS.CustomFeatures.SeperateInvoicesForEachChargesType");
            vm.branchWiseInvoicingEnabled = utilities.parseBoolean(abp.setting.get("App.General.BranchWiseInvoice")); // should be replaced with setting
            vm.agreementDashboardFilters = null;
            if (options.agreement) {
                vm.agreementDashboardFilters = options.agreement;
            }
            //Modified by arslan for Qatar fines
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isFineModuleEnabledAndClubbedInvoice = (vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && abp.setting.get("App.General.TrafficFineInvoice") == 1;
            vm.isParkingModuleEnabled = abp.features.isEnabled("CRS.Parking");
            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();

            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isSalikModuleEnabledAndClubbedInvoice = vm.isSalikModuleEnabled && abp.setting.get("App.General.TollsInvoice") == 1;
            vm.isDarbModuleEnabledAndClubbedInvoice = this.isDarbModuleEnabled && abp.setting.get("App.General.DarbTollsInvoice") == 1;

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.showFine = (vm.isDxbFinesModuleEnabled || vm.isAuhFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && (parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? false : true);
            vm.showSalik = (vm.isSalikModuleEnabled) && (parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? false : true);
            vm.includeFines = parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? true : false;
            vm.includeSalik = parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? true : false;
            vm.includeParking = (vm.isParkingModuleEnabled && parseInt(abp.setting.get("App.General.ParkingInvoice")) == 1) ? true : false;

            vm.dueToGenerateCount = 0;
            vm.generatedCount = 0;
            var generatedInvoices = null;
            var generateNoOfInvoicesPerBatch = 10;

            vm.downloadedFilesCount = 0;

            vm.tollStatus = {
                abuDhabi: { isDownloading: false, error: undefined },
                dubai: { isDownloading: false, error: undefined }
            };

            vm.currentDate = moment().endOf('day');

            vm.permissions = {
                canBulkGenerateForAnyAsOfDate: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForAnyAsOfDate'),
                canBulkGenerateForIndividuals: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForIndividuals'),
                canBulkGenerateForCompanies: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateForCompanies'),
                canBulkGenerateBySalesPersonFilter: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew.CanBulkGenerateBySalesPersonFilter'),
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            //generate invoices in batches 25 invoices per request
            vm.generate = function () {

                var invoicesToGenerate = [];

                var i = 1;

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null && invoiceDue.invoiceToDriverNo == null && invoiceDue.error == null && i <= generateNoOfInvoicesPerBatch) {
                        invoicesToGenerate.push(invoiceDue);
                        i += 1;
                    }
                });

                if (invoicesToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;
                vm.isEnableGeneratedInvoices = false;

                invoiceService.generateInvoices({ invoicesDue: invoicesToGenerate, agreementCategory: 2 /*set category to lease*/ }).success(function (data) {
                    generatedInvoices = data;
                    var generatedInvoiceNos = [];

                    angular.forEach(generatedInvoices, function (generateInvoice) {

                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            rowId: generateInvoice.rowId,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].invoiceId = generateInvoice.invoiceId;
                            foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                            foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                            foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;
                            foundLines[0].error = generateInvoice.error;

                            if ((generateInvoice.invoiceId > 0 || generateInvoice.invoiceToDriverId > 0) && !generatedInvoiceNos.some(x => x == generateInvoice.invoiceNo)) {
                                vm.generatedCount += 1;
                                generatedInvoiceNos.push(generateInvoice.invoiceNo);

                            }
                        }
                    });
                    vm.isEnableGeneratedInvoices = true;

                    if (generatedInvoices.length > 0) //continue generating invoices till not invoice is pending to generate
                        vm.generate();
                    else
                        vm.saving = false;

                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {

                });
            };

            var salikRequest = {
                fromDate: null,
                toDate: null,
                downloadParkingAlso: vm.isParkingModuleEnabled,
                tagNo: []
            };

            function downloadTolls() {
                vm.downloadingTolls = true;

                if (isMv3ExtensionAvailable) {
                    const isEtoll = !vm.isSalikModuleEnabledAndClubbedInvoice;
                    tollService.prepareDataForExtension({ isEToll: isEtoll }).success(resp => {
                        vm.tollAccountsDownloadingRes = {
                            request: {
                                fromDate: null,
                                toDate: null,
                                tagNo: [],
                                downloadParkingAlso: vm.isParkingModuleEnabled
                            },
                            tollAccounts: resp.salikAccounts
                        };

                        vm.tollStatus.dubai.isDownloading = true;

                        if (vm.isSalikModuleEnabledAndClubbedInvoice && vm.isDarbModuleEnabledAndClubbedInvoice) {
                            vm.tollStatus.abuDhabi.isDownloading = true;

                            tollService.prepareDataForExtension({ isEtoll: true }).success(resp => {
                                vm.tollAccountsDownloadingRes.tollAccounts = vm.tollAccountsDownloadingRes.tollAccounts.concat(resp.salikAccounts);
                                chromeExtDownloader.downloadTollsV3(vm, null);
                            });
                        }
                        else
                            chromeExtDownloader.downloadTollsV3(vm, null);
                    });
                }
                else {
                    var funcNode = document.getElementById('speedExtReportingSalik');
                    if (funcNode) {
                        funcNode.parentElement.removeChild(funcNode);
                    }

                    var script = document.createElement('script');
                    script.id = 'speedExtReportingSalik';
                    script.appendChild(document.createTextNode(`function reportStatus(status)
                {
                    var $scope = angular.element(document.querySelector('[name="generateInvoicesForm"]')).scope();
                    if (status.isComplated || status.error) {

                        if (status.isEtoll) {
                            $scope.vm.tollStatus.abuDhabi.isDownloading = false;
                            $scope.vm.tollStatus.abuDhabi.error = status.error;
                            $scope.vm.tollStatus.abuDhabi.status = status.status;
                        }
                        else {
                            $scope.vm.downloadingTolls = false;
                            $scope.vm.tollStatus.dubai.error = status.error;
                            $scope.vm.tollStatus.dubai.status = status.status;
                        }
                    }
                    else {
                        if (status.isEtoll) {
                            $scope.vm.tollStatus.abuDhabi.isDownloading = true;
                            $scope.vm.tollStatus.abuDhabi.error = '';

                            $scope.vm.tollStatus.abuDhabi.progress = status.progress;
                            $scope.vm.tollStatus.abuDhabi.status = status.status;
                        }
                        else {
                            $scope.vm.downloadingTolls = true;
                            $scope.vm.tollStatus.dubai.error = '';

                            $scope.vm.tollStatus.dubai.progress = status.progress;
                            $scope.vm.tollStatus.dubai.status = status.status;
                        }
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
                        }
                    );

                    if (vm.isDarbModuleEnabledAndClubbedInvoice) {
                        vm.tollStatus.abuDhabi.isDownloading = true;

                        const salikRequest2 = { isEtoll: true };
                        salikRequest2.tagNo = [];
                        salikRequest2.plateNos = [];

                        vm.selectedSalikAccounts = [];

                        chromeExtDownloader.downloadTolls(
                            salikRequest2,
                            null,
                            function error(e) {
                                vm.tollStatus.abuDhabi.isDownloading = false;

                                if (!$scope.$$phase)
                                    $scope.$digest();

                                abp.message.error(e.error);
                            });
                    }
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

                                    if (msg.downloadingComplete) {
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

            vm.getLeaseInvoicesDueToGenerate = function () {
                vm.isEnableGeneratedInvoices = false;
                generatedInvoices = [];
                vm.loading = true;
                invoiceDueService.getInvoicesDueToGenerate({ agreementCategory: 2, agreementNo: vm.agreementNo, masterAgreementNo: vm.masterAgreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId, salesPersonId: vm.salesPersonId, contactCategory: vm.contactCategory }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        vm.generatedCount = 0;
                    }).finally(function () {
                        vm.loading = false;
                    });

                //if salik or fine enabled then first download then get agreement list after downloading
                if (vm.isSalikModuleEnabledAndClubbedInvoice || vm.isDarbModuleEnabledAndClubbedInvoice || vm.isFineModuleEnabledAndClubbedInvoice) {
                    vm.loading = true;

                    let isDownloadData = false;

                    if (isMv3ExtensionAvailable) {
                        isDownloadData = true;
                        chromeExtDownloader.initV3(vm);
                    }
                    else
                        chromeExtDownloader.checkAndDownload(
                            function success() {
                                isDownloadData = true;
                            },
                            function error(content) {
                                isDownloadData = false;
                            });

                    if ((vm.isSalikModuleEnabledAndClubbedInvoice || vm.isDarbModuleEnabledAndClubbedInvoice ||
                        vm.isParkingModuleEnabled) && isDownloadData) {
                        downloadTolls();
                    }

                    //if Dubai/Abu Dhabi Fines are enabled
                    if (vm.isFineModuleEnabledAndClubbedInvoice && isDownloadData) {
                        downloadFines();
                    }
                }
            };

            vm.mergeInvoice = function () {
                var invoicesToGenerate = [];

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true && invoiceDue.invoiceNo == null)
                        invoicesToGenerate.push(invoiceDue);
                });
                if (invoicesToGenerate.length == 0) {
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
                    includeParking : vm.includeParking
                })
                    .success(function (data) {
                        generatedInvoices = data;
                        angular.forEach(generatedInvoices, function (generateInvoice) {
                            var foundLines = $filter('filter')(vm.data.invoicesDue, {
                                rowId: generateInvoice.rowId,
                            }, true);
                            if (foundLines.length > 0) {
                                foundLines[0].invoiceId = generateInvoice.invoiceId;
                                foundLines[0].invoiceNo = generateInvoice.invoiceNo;
                                foundLines[0].error = generateInvoice.error;

                            }
                            vm.saving = false;
                        });

                    }).error(function (response) {
                        abp.message.error(response.error);
                        vm.saving = false;

                    }).finally(function () {
                        vm.isEnableGeneratedInvoices = true;
                    });
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
                                chromeExtDownloader.closeAllTabs({ action: "closeAllTabs" })
                            }
                            else {
                                if (vm.downloadingTolls) {
                                    vm.downloadingTollsCancled = true;
                                    vm.downloadingTolls = false;
                                    chromeExtDownloader.closeAllTollsTabs();
                                }

                                if (vm.downloadingFines) {
                                    vm.downloadingFinesCancled = true;
                                    vm.downloadFines = false;
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
            }

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
                    vm.getLeaseInvoicesDueToGenerate();
                } else {
                    vm.asOfDate = vm.currentDate;
                }

                if (vm.branchWiseInvoicingEnabled)
                    getLocations();

                getContactTypes();
            }

            init();
        }
    ]);
