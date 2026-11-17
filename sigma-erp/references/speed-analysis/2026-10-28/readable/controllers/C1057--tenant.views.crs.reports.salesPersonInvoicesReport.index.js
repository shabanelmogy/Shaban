// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:281330-281707
appModule.controller('tenant.views.crs.reports.salesPersonInvoicesReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.saleReport', 'utilities','appSession', 'abp.services.app.vehicle', 'abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, saleReportService, utilities, appSession,vehicleService, commonLookupService, directoryService) {
            var vm = this;
            vm.month = null;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.invoiceTypes = [];
            vm.loading = false;
            vm.locations = [];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };
            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");
            vm.isEquipmentLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isFmsEnable = abp.features.isEnabled("FMS");
            vm.isLimoEnabled = abp.features.isEnabled("CRS.Limo");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.isAssetEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isTransportationEnabled = abp.features.isEnabled("CRS.Transportation");
            vm.isChauffeurEnabled = abp.features.isEnabled("CRS.Chauffeur");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik"); //&& abp.setting.get("App.General.TollsInvoice") == 2;
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");// && abp.setting.get("App.General.DarbTollsInvoice") == 2;
            vm.isFineModeEnabled = (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar") || abp.features.isEnabled("CRS.Fines")); //abp.setting.get("App.General.TrafficFineInvoice") == 2
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isAccessoriesEnabled = abp.features.isEnabled("CRS.AccessoriesRental");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");

            vm.isOnlinePaymentsEnabled = abp.features.isEnabled("OnlinePayments");
            vm.isChargeCardEnabled = abp.features.isEnabled("OnlinePayments.Customer.ChargeCard");
            vm.isRequestPaymentAfterCreationEnabled = abp.features.isEnabled("OnlinePayments.Invoice.RequestPaymentAfterCreation");

            vm.isERSLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isERSRentalInvoiceEnabled = abp.features.isEnabled("ERS.Rental");
            vm.isAccidentModuleEnabled = abp.features.isEnabled("CRS.Accident");
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.agreementAdditionalCharges = abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges');
            vm.agreementAdditionalChargesAfterClosing = abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing');

            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.IsInvoiceCommision = utilities.parseBoolean(abp.setting.get("App.General.InvoiceCommission"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isEastCoast = appSession.tenant.tenancyName.toLowerCase() == 'eastcoast';
            vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isTaxEnabled = abp.features.isEnabled('CRS.Tax');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.Invoices");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.isAgreementEnabled = abp.features.isEnabled("CRS.Rental")
                || abp.features.isEnabled("FMS")
                || abp.features.isEnabled("CRS.Transportation")
                || abp.features.isEnabled("CRS.Lease");

            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");

            vm.filters = {
                fromDate: null,
                toDate: null,
                agreementCategory: null,
                agreementType: null,
                contactCategory: null,
                locationId: null,
                salesPerson: null,
                invoiceType: [],

            };
            vm.agreementCategories = [
                { type: "Rental", id: 1 },
            ];
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }
            if (abp.features.isEnabled("CRS.Chauffeur")) {
                vm.agreementCategories.push({ type: "Chauffeur", id: 4 });
            }
            vm.agreementTypes = [
                { type: app.localize("Daily"), id: 1 },
                { type: app.localize("Weekly"), id: 2 },
                { type: app.localize("Monthly"), id: 3 },
                { type: app.localize("Lease"), id: 4 }
            ];
            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };
            vm.searchUsers = function ($select) {

                return directoryService.search({
                    keyword: $select.search, contactType: 1
                }).then(function (response) {

                    vm.users = response.data.items;
                });
            };
            vm.changeAgreementCategory = function () {
                vm.agreementTypes = [];
                if (vm.filters.agreementCategory === 1 || vm.filters.agreementCategory === 4) {
                    vm.agreementTypes = [
                        { type: app.localize("Daily"), id: 1 },
                        { type: app.localize("Weekly"), id: 2 },
                        { type: app.localize("Monthly"), id: 3 },
                    ];
                } else if (vm.filters.agreementCategory === 2) {
                    vm.agreementTypes = [
                        { type: app.localize("Lease"), id: 4 }
                    ];
                } else {
                    vm.agreementTypes = [
                        { type: app.localize("Daily"), id: 1 },
                        { type: app.localize("Weekly"), id: 2 },
                        { type: app.localize("Monthly"), id: 3 },
                        { type: app.localize("Lease"), id: 4 }
                    ];
                }
            };
            function getInvoiceTypes() {
                if (vm.isRentalEnabled)
                    vm.invoiceTypes.push({ name: app.localize("RentalInvoice"), id: 1 });
                if (vm.isSalikModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("SalikInvoice"), id: 8 });
                if (vm.isDarbModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("DarbTollInvoice"), id: 63 });
                if (vm.isERSRentalInvoiceEnabled)
                    vm.invoiceTypes.push({ name: app.localize("EquipmentInvoice"), id: 46 });
                if (vm.isFineModeEnabled)
                    vm.invoiceTypes.push({ name: app.localize("FineInvoice"), id: 7 });
                if (vm.isLimoEnabled)
                    vm.invoiceTypes.push({ name: app.localize("LimousineInvoice"), id: 2 });
                if (vm.isLeaseEnabled) {
                    vm.invoiceTypes.push({ name: app.localize("LeaseInvoice"), id: 14 });
                    if (vm.agreementAdditionalCharges || vm.agreementAdditionalChargesAfterClosing)
                        vm.invoiceTypes.push({ name: app.localize("AdditionalChargesInvoice"), id: 24 });
                }
                //if (vm.isERSLeaseEnabled)
                //    vm.invoiceTypes.push({ name: app.localize("EquipmentLeaseInvoice"), id: 47 });
                if (vm.isTransportationEnabled)
                    vm.invoiceTypes.push({ name: app.localize("TransportationInvoice"), id: 16 });
                if (vm.isAssetsModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AssetSaleInvoice"), id: 17 });

                if (vm.isRentalEnabled || vm.isLeaseEnabled)
                    vm.invoiceTypes.push({ name: app.localize("FuelInvoice"), id: 29 });
                if (vm.isChauffeurEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ChauffeurInvoice"), id: 34 });
                if (vm.isWorkshopEnabled)
                    vm.invoiceTypes.push({ name: app.localize("WorkshopInvoice"), id: 37 });
                if (vm.isAccessoriesEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AccessoriesInvoice"), id: 55 });
                if (vm.isAccidentModuleEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ExcessChargesInvoice"), id: 57 });
                if (vm.isExcessKMsInvoiceEnabled)
                    vm.invoiceTypes.push({ name: app.localize("ExcessKMsInvoice"), id: 60 });
                if (vm.isAccountsEnabled && vm.isTaxEnabled)
                    vm.invoiceTypes.push({ name: app.localize("AdvanceTaxInvoice"), id: 65 });

                vm.invoiceTypes.push({ name: app.localize("MiscellaneousInvoice"), id: 9 });
                vm.invoiceTypes.push({ name: app.localize("DamageInvoice"), id: 30 });
                vm.invoiceTypes.push({ name: app.localize("FleetAssignmentInvoice"), id: 33 });
            };
            vm.getAgreementType = function (type) {
            if (type == 1) {
                return app.localize("Daily")
            }
            else if (type == 2) {
                return app.localize("Weekly")
            }
            else if (type == 3) {
                return app.localize("Monthly")
            }
            else if (type == 4) {
                return app.localize("Lease")
            }
            else if (type == 5) {
                return app.localize("LeaseToOwn")
            }
            else if (type == 6) {
                return app.localize("Hourly")
            }
        };

            vm.contactTypes = [
                { type: app.localize("Individual"), id: 1 },
                { type: app.localize("Company"), id: 2 }
            ];

            
            
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getStatus = function (x) { // Agreement Status Name
                if (x == 1) {
                    return app.localize('Open');
                } else if (x == 2) {
                    return app.localize('Closed');
                }
            }
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
             
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'saleReport.xls';
                a.click();

            };
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            vm.reportModal = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                vm.filters.invoiceTypeArray = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/salesPersonInvoicesReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.changeInvoiceRange = function () {
                if (!vm.filters.invoiceRange) {
                    vm.filters.invoiceTo = null;
                    vm.filters.invoiceFrom = null;
                }
                if (vm.filters.invoiceRange) {
                    vm.filters.voucherNo = null;
                }

            };
      
            //function getAgreementTypes() {
            //    vm.agreementTypes = [{ id: 1, name: "Daily" }, { id: 2, name: "Weekly" }, { id: 3, name: "Monthly" }];
            //};

            //vm.getSaleReport = function () {
            //    vm.loading = true;

            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            //    if (vm.filters.salesPerson != null) {
            //        vm.filters.salesPersonId = vm.filters.salesPerson.id;
            //    }

            //    saleReportService.getSaleReport(vm.filters).success(function (result) {
            //        vm.report = result;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });;
            //};
            vm.getSalesPersonInvoiceView = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate.startOf('day') : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate.endOf('day') : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                vm.filters.invoiceTypeArray = [];
                if (vm.filters.invoiceType.length > 0) {
                    angular.forEach(vm.filters.invoiceType, function (value) {
                        vm.filters.invoiceTypeArray.push(value.id);
                    });
                }

                saleReportService.getSalesPersonInvoiceView(vm.filters).success(function (result) {
                    vm.report = result;
                }).finally(function () {
                    vm.loading = false;
                });;
            };

            getLocations();
            getInvoiceTypes();
            vm.getSalesPersonInvoiceView();
            //vm.getAgreementType();
            //getAgreementTypes();
            vm.changeAgreementCategory();
        }
    ]);
