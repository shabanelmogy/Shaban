// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:353810-354274
appModule.controller('tenant.views.crs.vouchers.invoices.generateParkingModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.toll', 'abp.services.app.parkingTicket', 'abp.services.app.invoice', 'tollDownloader', 'abp.services.app.directory', '$interval', 'chromeExtDownloader', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, tollService, parkingTicketService, invoiceService, tollDownloader, directoryService, $interval, chromeExtDownloader, utilities) {

            var vm = this;
            vm.loading = false;
            vm.downloadingTolls = false;
            vm.all = false;
            vm.vehicleNoEN = [];
            vm.plateTagNoEN = [];
            vm.customers = [];
            vm.isMergeEnabled = abp.features.isEnabled("CRS.CustomFeatures.MergedInvoice");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.timeOutSalikDontReportProgress = false;
            const isMv3ExtensionAvailable = chromeExtDownloader.isMv3ExtensionAvailable();

            vm.searchCustomers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.updateContactId = function (selectedCustomer) {
                vm.searchFilters.contactId = selectedCustomer ? selectedCustomer.id : null;
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
                        vm.searchFilters.contactId = customer.id;
                        vm.selectedCustomer = customer; 
                    }
                });
            };


            vm.clearCustomer = function () {
                vm.searchFilters.customer = null;
                vm.selectedCustomer = null;
                vm.searchFilters.contactId = null;
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
                name: "",
                tagNo: null,
                plateNo: null,
                plateTagNo: null,
                contactId: null,
                fromDate: null,
                agreementNo: null,
                toDate: null,
                plateTagNoEN: [],
                vehicleNoEN: [],
                vehicleNoArray: [],
                plateTagNoArray: [],
                includePreviousUnInvoicedParkings: true,
                includeOpenDailyWeeklyAgreements: false,
                onlyForClosedAgreements: false,
            };

            vm.processFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateTagNo: null,
                agreementNo: null,
                plateNo: null,
                contactId: null,
                includePreviousUnInvoicedParkings: false,
                includeOpenDailyWeeklyAgreements: false,
                onlyForClosedAgreements: false,
                skipCount: 0,
                maxResultCount: maxCountToProcessInOneRequest
            };

            vm.generateFilters = {
                fromDate: null,
                toDate: null,
                tagNo: null,
                plateTagNo: null,
                agreementNo: null,
                plateNo: null,
                contactId: null,
                includePreviousUnInvoicedParkings: false,
                includeOpenDailyWeeklyAgreements: false,
                onlyForClosedAgreements: false,
                maxGenerateInvoicesPerBatch: maxInvoicesToGenerateInOneRequest,
            };


            //vm.searchPlateNo = function ($select) {
            //    if (!$select.search) return;
            //    vm.searchFilters.name = $select.search;
            //    return parkingTicketService.getSearchPlateNo({ name: vm.searchFilters.name }).then(function (response) {
            //        vm.vehicleNoEN = response.data.items; //string list of plate numbers
            //    });
            //};
            vm.searchTagNo = function ($select) {
                if (!$select.search) return;
                vm.searchFilters.name = $select.search;
                return parkingTicketService.getSearchTagNo(vm.searchFilters).then(function (response) {
                    vm.plateTagNoEN = response.data.items; //string list of tag numbers
                });
            };

            vm.invoicesGenerated = false;
            vm.searchedParkingCount = 0;
            vm.processedParkingsTotalCount = 0;
            vm.processedParkingsWithAgreementCount = 0;
            vm.processedParkingsWithCloseAgreementCount = 0;
            vm.processedParkingsWithCustomerCount = 0;
            vm.processedParkingsWithThisAgreementCount = 0;
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
                vm.processedParkingsTotalCount = 0;
                vm.processedParkingsWithAgreementCount = 0;
                vm.processedParkingsWithCloseAgreementCount = 0;
                vm.processedParkingsWithCustomerCount = 0;
                vm.processedParkingsWithThisAgreementCount = 0;
                processParkings();
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
                    abp.message.customConfirm(app.localize('Recent Parkings may not be downloaded.'),
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


            vm.searchParkings= function () {
                vm.loading = true;
                vm.searchFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.searchFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                parkingTicketService.getCRSParkingTicketsforInvoice(vm.searchFilters).success(function (data) {
                    vm.searchedParkingCount = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            function processParkings() {
                vm.processFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.processFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.processFilters.plateTagNo = vm.searchFilters.plateTagNo;
                vm.processFilters.plateNo = vm.searchFilters.plateNo;
                vm.processFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.processFilters.contactId = vm.searchFilters.contactId;
                vm.processFilters.includePreviousUnInvoicedParkings = vm.searchFilters.includePreviousUnInvoicedParkings;
                vm.processFilters.includeOpenDailyWeeklyAgreements = vm.searchFilters.includeOpenDailyWeeklyAgreements;
                vm.processFilters.onlyForClosedAgreements = vm.searchFilters.onlyForClosedAgreements;

                parkingTicketService.processParkingTickets(vm.processFilters).success(function (result) {
                    vm.processedParkingsTotalCount += result.processedCount;
                    vm.processedParkingsWithAgreementCount += result.onAgreementsCount;
                    vm.processedParkingsWithCloseAgreementCount += result.closedAgreementsCount;
                    vm.processedParkingsWithCustomerCount += result.onThisCustomerCount;
                    vm.processedParkingsWithThisAgreementCount += result.onThisAgreementCount;


                    moreDataToProcess = (result.processedCount > 0);
                    if (moreDataToProcess) {
                        vm.processFilters.skipCount = currentPage * maxCountToProcessInOneRequest;
                        currentPage += 1;
                        processParkings();
                    } else {
                        vm.processing = false;
                        if (vm.generateFilters.onlyForClosedAgreements) {
                            if (vm.processedParkingsWithCloseAgreementCount == 0) {
                                vm.closeAgreement = true;
                            }
                        }
                    }
                }).finally(function () {
                    //vm.loading = false;
                });
            }

            function generateInvoices() {
                vm.generateFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.generateFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.generateFilters.tagNo = vm.searchFilters.tagNo;
                vm.generateFilters.plateTagNo = vm.searchFilters.plateTagNo;
                vm.generateFilters.plateNo = vm.searchFilters.plateNo;
                vm.generateFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.generateFilters.includePreviousUnInvoicedParkings = vm.searchFilters.includePreviousUnInvoicedParkings;
                vm.generateFilters.includeOpenDailyWeeklyAgreements = vm.searchFilters.includeOpenDailyWeeklyAgreements;
                vm.generateFilters.onlyForClosedAgreements = vm.searchFilters.onlyForClosedAgreements;
                vm.generateFilters.contactId = vm.processFilters.contactId;
                vm.generateFilters.continueCheck = true;

                invoiceService.generateParkingInvoices(vm.generateFilters).success(function (result) {
                    vm.generatedInvoicesCount += result.invoicesCount;
                    moreDataToGenerate = (result.invoicesCount > 0);
                    if (moreDataToGenerate) {
                        generateInvoices();
                    } else {
                        vm.generating = false;
                    }
                }).finally(function () {
                    //vm.generating = false;
                });
            }

            function generateMergeInvoices() {
                vm.generateFilters.fromDate = !vm.dateRangeModel.startDate ? moment(moment().format('YYYY-MM-DD')).utc() : vm.dateRangeModel.startDate;
                vm.generateFilters.toDate = !vm.dateRangeModel.endDate ? moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc() : vm.dateRangeModel.endDate;
                vm.generateFilters.tagNo = vm.searchFilters.tagNo;
                vm.generateFilters.plateTagNo = vm.searchFilters.plateTagNo;
                vm.generateFilters.plateNo = vm.searchFilters.plateNo;
                vm.processFilters.agreementNo = vm.searchFilters.agreementNo;
                vm.generateFilters.includePreviousUnInvoicedParkings = vm.searchFilters.includePreviousUnInvoicedParkings;
                vm.generateFilters.includeOpenDailyWeeklyAgreements = vm.searchFilters.includeOpenDailyWeeklyAgreements;
                vm.generateFilters.onlyForClosedAgreements = vm.searchFilters.onlyForClosedAgreements;
                vm.generateFilters.contactId = vm.processFilters.contactId;

                invoiceService.generateMergeParkingInvoice(vm.generateFilters).success(function (result) {
                    vm.invoiceNo = result.voucherNo;
                }).finally(function () {
                    vm.generating = false;
                });
            }



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
                 //   chromeExtDownloader.initV3(vm);
                    tollService.prepareDataForExtension({}).success(resp => {
                        vm.tollAccountsDownloadingRes = {
                            request: {
                                fromDate: moment().add('days', -7).format('YYYY-MM-DD'),
                                toDate: null,
                                tagNo: [],
                                downloadOnlyParkingTickets: true,
                            },
                            tollAccounts: resp.salikAccounts
                        };
                        chromeExtDownloader.initV3(vm, vm.downloadTollsV3);

                       // chromeExtDownloader.downloadTollsV3(vm, null);
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
                            var $scope = angular.element(document.getElementsByName('generateParkingForm')).scope();
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

            vm.downloadTollsV3 = function () {
                vm.callbackOnComplete = function () {
                   // vm.getSummary();
                };

                chromeExtDownloader.downloadTollsV3(vm, null);
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
                abp.message.customConfirm(app.localize('Recent Parkings may not be downloaded.'),
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
