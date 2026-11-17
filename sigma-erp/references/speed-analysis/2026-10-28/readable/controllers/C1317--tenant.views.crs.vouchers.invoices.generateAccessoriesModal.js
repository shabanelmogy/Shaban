// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:345563-346110
appModule.controller('tenant.views.crs.vouchers.invoices.generateAccessoriesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.invoice', 'abp.services.app.invoiceDue', '$filter', 'abp.services.app.directory', 'abp.services.app.trafficFile', 'chromeExtDownloader', 'options', 'utilities', 'appSession', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, $uibModalInstance, invoiceService, invoiceDueService, $filter, directoryService, trafficFileService, chromeExtDownloader, options, utilities, appSession, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.data = null;
            vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
            vm.downloadingTolls = false;
            vm.downloadingFines = false;
            vm.dueToGenerateCount = 0;
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDailyEnabled = utilities.parseBoolean(abp.setting.get("App.General.DailyInvoiceForDailyAgreement"));
            vm.isWeeklyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyInvoiceForWeeklyAgreement"));
            vm.generatedCount = 0;
            var generatedInvoices = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.branchWiseInvoicingEnabled = utilities.parseBoolean(abp.setting.get("App.General.BranchWiseInvoice"));

            vm.agreementDashboardFilters = null;
            if (options.agreement) {
                vm.agreementDashboardFilters = options.agreement;
            }
            //Modified by arslan for Qatar fines
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");

            vm.isSalikModuleEnabledAndClubbedInvoice = vm.isSalikModuleEnabled && abp.setting.get("App.General.TollsInvoice") == 1;
            vm.isFineModuleEnabledAndClubbedInvoice = (vm.isAuhFinesModuleEnabled || vm.isDxbFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && abp.setting.get("App.General.TrafficFineInvoice") == 1;

            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.showFine = (vm.isDxbFinesModuleEnabled || vm.isAuhFinesModuleEnabled || vm.isQtrFinesModuleEnabled) && (parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? false : true);
            vm.showSalik = (vm.isSalikModuleEnabled) && (parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? false : true);
            vm.includeFines = parseInt(abp.setting.get("App.General.TrafficFineInvoice")) == 1 ? true : false;
            vm.includeSalik = parseInt(abp.setting.get("App.General.TollsInvoice")) == 1 ? true : false;
            vm.isAllowInvoioceMerging = utilities.parseBoolean(abp.setting.get("App.General.InvoiceMergingOnToDate"));
            vm.isAllowInvoioceMergingFromDate = utilities.parseBoolean(abp.setting.get("App.General.InvoiceMergingOnFromDate"));

            vm.timeOutSalikDontReportProgress = false;
            vm.timeOutFinesDontReportProgress = false;

            vm.downloadedFilesCount = 0;

            vm.agreementTypes = [];
            if (vm.isDailyEnabled)
                vm.agreementTypes.push({ type: "Daily", id: 1 });
            if (vm.isWeeklyEnabled)
                vm.agreementTypes.push({ type: "Weekly", id: 2 });
            vm.agreementTypes.push({ type: "Monthly", id: 3 });
            

            var generateNoOfInvoicesPerBatch = 10;

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
                    if (vm.isAllowInvoioceMerging) {
                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            customerId: row.customerId,
                            invoiceToDate: row.invoiceToDate,
                        }, true);
                        vm.data.invoicesDue = foundLines;

                    } if (vm.isAllowInvoioceMergingFromDate) {
                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            customerId: row.customerId,
                            invoiceFromDate: row.invoiceFromDate,
                        }, true);
                        vm.data.invoicesDue = foundLines;

                    }  else {
                        var foundLines = $filter('filter')(vm.data.invoicesDue, {
                            customerId: row.customerId,
                            invoiceFromDate: row.invoiceFromDate,
                            invoiceToDate: row.invoiceToDate,
                        }, true);
                        vm.data.invoicesDue = foundLines;
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

                invoiceService.generateInvoices({ invoicesDue: invoicesToGenerate }).success(function (data) {
                    generatedInvoices = data;

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


                            if (generateInvoice.invoiceId > 0 || generateInvoice.invoiceToDriverId > 0)
                                vm.generatedCount += 1;
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

            vm.mergeInvoice = function () {
                var invoicesToGenerate = [];

                angular.forEach(vm.data.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate == true)
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
                    includeSalik: vm.includeSalik
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
                                foundLines[0].invoiceToDriverNo = generateInvoice.invoiceToDriverNo;
                                foundLines[0].invoiceToDriverId = generateInvoice.invoiceToDriverId;
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

            vm.getInvoicesDueToGenerate = function () {
                vm.isEnableGeneratedInvoices = false;
                generatedInvoices = [];

                vm.loading = true;
                invoiceDueService.getInvoicesDueToGenerate({ agreementCategory: 9, agreementNo: vm.agreementNo, asOfDate: moment(vm.asOfDate).endOf('day'), customerId: vm.customerId, contactCategory: vm.contactCategory, agreementType: vm.agreementType }).success(
                    function (result) {
                        vm.data = result;
                        vm.dueToGenerateCount = vm.data.invoicesDue.length;
                        vm.generatedCount = 0;

                    }).finally(function () {
                        vm.loading = false;
                    });

                let isDownloadData = false;
                chromeExtDownloader.checkAndDownload(
                    function success() {
                        isDownloadData = true;
                    },
                    function error(content) {
                        isDownloadData = false;
                    });

                //if salik or fine enabled then first download then get agreement list after downloading
                //if (vm.isSalikModuleEnabledAndClubbedInvoice || vm.isFineModuleEnabledAndClubbedInvoice) {
                if (vm.isSalikModuleEnabledAndClubbedInvoice) {
                    if (isDownloadData)
                        downloadTolls();
                }

                //if Dubai/Abu Dhabi Fines are enabled
                if (vm.isFineModuleEnabledAndClubbedInvoice) {
                    if (isDownloadData)
                        downloadFines();
                }
                //}
            };

            var salikRequest = {
                fromDate: null,
                toDate: null,
                tagNo: []
            };

            function downloadTolls() {

                vm.downloadingTolls = true;



                vm.firebaseSalikResponse = {
                    progress: 0,
                    error: null,
                    status: ''
                };
                var funcNode = document.getElementById('speedExtReportingSalik');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                var script = document.createElement('script');
                script.id = 'speedExtReportingSalik';
                script.appendChild(document.createTextNode(`function reportStatus(status) {
                                var $scope = angular.element(document.querySelector('[name="generateInvoicesForm"]')).scope();
                                    if (status.isComplated || status.error) {
                                        $scope.vm.downloadingTolls = false;

                                        $scope.vm.firebaseSalikResponse.error = status.error;
                                        $scope.vm.firebaseSalikResponse.status = status.status;
                                    }
                                    else {
                                        $scope.vm.downloadingTolls = true;
                                        $scope.vm.firebaseSalikResponse.error = '';

                                        $scope.vm.firebaseSalikResponse.progress = status.progress;
                                        $scope.vm.firebaseSalikResponse.status = status.status;
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

                            if (vm.downloadingTolls) {
                                vm.downloadingTollsCancled = true;
                                chromeExtDownloader.closeAllTollsTabs();
                            }

                            if (vm.downloadingFines) {
                                vm.downloadingFinesCancled = true;
                                chromeExtDownloader.closeAllFinesTabs();
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

            function init() {
                if (vm.agreementDashboardFilters) {
                    vm.asOfDate = moment();
                    vm.customer = vm.agreementDashboardFilters.customer;
                    vm.customerId = vm.agreementDashboardFilters.customerId;
                    vm.agreementNo = vm.agreementDashboardFilters.agreementNo;
                    vm.getInvoicesDueToGenerate();
                }

                if (vm.branchWiseInvoicingEnabled)
                    getLocations();

            }
            init();

        }
    ]);
