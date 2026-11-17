// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:301322-305404
appModule.controller('tenant.views.crs.updateFuelRate.index', [
        '$scope', 'abp.services.app.commonAgreement', 'abp.services.app.tenantSettings', 'appSession', 'abp.services.app.contactGroup', '$uibModal', 'abp.services.app.salikAccount', 'abp.services.app.fuelAccount', 'uiGridConstants', 'abp.services.app.trafficFile', 'abp.services.app.designation', 'abp.services.app.holiday', 'FileUploader',
        'abp.services.app.chargesSetting', 'abp.services.app.directory', 'abp.services.app.billingMethod', 'abp.services.app.expenseType', 'abp.services.app.commonLookup', 'abp.services.app.account', 'utilities',
        'abp.services.app.costCenter', 'abp.services.app.user', 'abp.services.app.tariffCard', 'abp.services.app.designation', 'abp.services.app.location', '$filter',
        function ($scope, commonAgreementService, tenantSettingsService, appSession, contactGroupService, $uibModal, salikAccountService, fuelAccountService, uiGridConstants, trafficFileService, designationService, holidayService, fileUploader,
            chargesSettingService, directoryService, billingMethodService, expenseTypeService, commonLookupService, accountService, utilities, costCenterService, userService, tariffCardService, locationService, $filter) {
            var vm = this;
            vm.isposEnabled = abp.features.isEnabled("POS");
            var isValid = true;
            vm.loading = false;
            vm.saving = false;
            var errorMessage = {};

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.agreementTypes = [{ type: "Daily", id: 1 }, { type: "Weekly", id: 2 }, { type: "Monthly", id: 3 }];
            vm.voucherTypes = [{ name: "Purchase Request", id: 34 }];

            vm.selectedJobTypes = utilities.getJobTypes();
            vm.documentTypes = [{ name: app.localize("IndividualCustomer"), id: "AdvanceSettings.FormAndFields.IndividualCustomer" },
            { name: app.localize("CompanyCustomer"), id: "AdvanceSettings.FormAndFields.CompanyCustomer" },
            { name: app.localize("CompanyDriver"), id: "AdvanceSettings.FormAndFields.CompanyDriver" },
            { name: app.localize("Vehicle"), id: "AdvanceSettings.FormAndFields.Vehicle" },
            { name: app.localize("Job"), id: "AdvanceSettings.FormAndFields.Job" }];
            vm.tripOptions = [{ type: "Input", id: 1 }, { type: "Selection", id: 2 }];
            vm.businessSourceBrokerOptions = [{ type: "Input", id: 1 }, { type: "Selection", id: 2 }];

            vm.fineSurchargeType = [{ type: "Fixed", id: 1 }, { type: "Percentage", id: 2 }];
            vm.invoicingOptions = [{ id: 1, name: app.localize('ClubWithRental') }, { id: 2, name: app.localize('Separate') }];
            vm.chargesSettings = [];
            vm.agreementDocuments = [];
            vm.filters = [];
            vm.expenseTypes = [];
            vm.tariffCards = [];
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.profitShareForLessee = 20;
            vm.isMultiTenancyEnabled = abp.multiTenancy.isEnabled;
            vm.isFineModeEnabled = abp.features.isEnabled("CRS.Fines");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik") || abp.features.isEnabled("TMS.Salik.Dubai");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi") || abp.features.isEnabled("TMS.Tolls.AbuDhabi");
            vm.isFuelModuleEnabled = abp.features.isEnabled("FuelDataMangement");
            vm.isTollModuleEnabled = abp.features.isEnabled("CRS.Tolls") || abp.features.isEnabled("TMS");
            vm.isDxbFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.DubaiPolice");
            vm.isAuhFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice");
            vm.isQtrFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Qatar");
            vm.isOmanFinesModuleEnabled = abp.features.isEnabled("CRS.Fines.Oman");
            vm.isCarShareEnabled = abp.features.isEnabled("CRS.CarShare");
            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isInvoiceEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isItemEnabled = abp.features.isEnabled("STOCK_Items");
            //vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS.Rental");
            vm.isMccEnabled = abp.features.isEnabled("MCC");
            vm.isCrsEnabled = abp.features.isEnabled("CRS");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isErsEnabled = abp.features.isEnabled("ERS");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isPassCreditNoteOnAgreementClosingEnabled = abp.features.isEnabled("CRS.CustomFeatures.PassCreditNoteOnAgreementClosing");
            vm.isDownloadPaidFinesOmanAlsoEnabled = abp.features.isEnabled("TFMS.Fines.Oman");
            vm.isShowCustomPlateNoEnabled = abp.features.isEnabled("TFMS.Fines.ShowCustomPlateNo");
            vm.isExcludeFinesFromSharingByAuthorities = abp.features.isEnabled("TFMS.Fines.ExcludeFinesFromSharingByAuthorities");
            vm.isDisableTollsAndFinesDownloadingEnabled = abp.features.isEnabled("CRS.CustomFeatures.DisableTollsAndFinesDownloading");
            vm.isEnableCustomerExpiringDocumentsFeature = abp.features.isEnabled("Notifications.CustomerExpiringDocuments");
            vm.isEnableEmployeeExpiringDocumentsFeature = abp.features.isEnabled("Notifications.EmployeeExpiringDocuments");
            vm.isEnableBlackPointsFinesFeature = abp.features.isEnabled("Notifications.BlackPointsFines");
            vm.isEnableExpiredSecurityDepositsFeature = abp.features.isEnabled("Notifications.ExpiredSecurityDeposits");
            vm.isEnableTMSAutoDownloadingInSDCFeature = abp.features.isEnabled("TMS.Auto.Downloading.In.SDC");
            vm.isEnableFMSAutoDownloadingInSDCFeature = abp.features.isEnabled("TFMS.Fines.FMSAutoDownloadingInSDC");
            vm.iSSalikEmailNotificationEnabled = abp.features.isEnabled("Notifications.EmailSalikDailyStatusAlert");
            vm.iSDarbEmailNotificationEnabled = abp.features.isEnabled("Notifications.EmailDarbDailyStatusAlert");
            vm.isEnableDataSharing = abp.auth.hasPermission('Pages.TMS.Tolls.SharingSetting') || abp.auth.hasPermission('Pages.TMS.Tolls.EDarb.SharingSetting') || abp.auth.hasPermission('Pages.TFMS.Fines.SharingSetting') || abp.auth.hasPermission('Pages.Tenant.FuelDataMangement.SharingSetting');
            vm.isCustomizeCurrencyDecimalsEnabled = abp.features.isEnabled("Core.CustomizeCurrencyDecimals");
            vm.islinkCrsToWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop");
            vm.islinkCrsToWorkShopTanantNameIdHasValue = abp.features.getValue("CRS.CustomFeatures.LinkCrsToWorkShop.TenantNameId");
            vm.specialBranchwithnoFinancialeffects = abp.features.isEnabled("CRS.CustomFeatures.VoucherswithoutFinancialaffectforaSpecialBranch");
            vm.islinkWorkShopToCrsTenantNameHasValue = abp.features.getValue("CRS.CustomFeatures.LinkCrsToWorkShop.CRSTenantName");
            vm.isEnableProcessingInSdc = abp.features.getValue("CRS.Rental.Agreements") == "true" || abp.features.getValue("CRS.Rental.Agreements") == "true" ? true : false;

            vm.isTMSEnabled = abp.features.isEnabled("TMS");
            vm.isTFMSEnabled = abp.features.isEnabled("TFMS");
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.brokerContactGroup = abp.features.isEnabled("CRS.CustomFeatures.BrokerContactGroup");
            vm.isFineSharingEnabled = abp.features.isEnabled("TFMS.Fines.ShareFines");
            vm.isDdaProcessAutomationEnabled = abp.features.isEnabled("CRS.Vouchers.Receipts.DdaProcessAutomation");
            vm.isWorkshopMovementEnabled = abp.features.isEnabled("CRS.Rental.WorkshopMovements");
            vm.isCustodyMovementEnabled = abp.features.isEnabled("CRS.Rental.CustodyMovements");
            /* vm.isUpdateFuelPriceEnabled = abp.features.isEnabled("CRS.Rental.UpdateFuelPrice");*/
            vm.isLimousineEnabled = abp.features.isEnabled("CRS.Limo");
            vm.isEmailNotificationEnabled = abp.features.isEnabled("CRS.Limousine.EmailNotification");
            vm.isWebBookingPlugInEnabled = abp.features.isEnabled("CRS.Bookings.WebBookingPlugIn");
            vm.isStripePaymentEnabled = abp.features.isEnabled("CRS.Bookings.StripePayment");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            //  vm.isDamageInvoice = abp.features.isEnabled("CRS.Lease");
            vm.isCOAEnabled = abp.features.isEnabled("CRS.Accounts.ChartofAccounts");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isTransportationEnabled = abp.features.isEnabled("CRS.Transportation");
            vm.isAssetEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isServiceModuleEnabled = abp.features.isEnabled("CRS.FleetManagement_Services");
            vm.isLeaseAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
            vm.isRentalAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements");
            vm.isInvoiceEnabled = abp.features.isEnabled("CRS.Vouchers.Invoices");
            vm.isCreditNoteEnabled = abp.features.isEnabled("CRS.Vouchers.CreditNotes");
            vm.isDebitNoteEnabled = abp.features.isEnabled("CRS.Vouchers.DebitNotes");
            vm.isReceiptEnabled = abp.features.isEnabled("CRS.Vouchers.Receipts");
            vm.isBillEnabled = abp.features.isEnabled("CRS.Vouchers.Bills");
            vm.isPurchaseOrderEnabled = abp.features.isEnabled("CRS.Vouchers.PurchaseOrders");
            vm.isPurchaseRequestEnabled = abp.features.isEnabled("CRS.Vouchers.PurchaseRequest");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.isPaymentsEnabled = abp.features.isEnabled("CRS.Vouchers.Payments");
            vm.isJVEnabled = abp.features.isEnabled("CRS.Vouchers.JVs");
            vm.isBankDepositEnabled = abp.features.isEnabled("CRS.Vouchers.BankDeposits");
            vm.isAmortizationEnabled = abp.features.isEnabled("CRS.Accounts.Amortization");
            vm.isOpeningBalanceEnabled = abp.features.isEnabled("CRS.Vouchers.OpeningBalances");
            vm.isDepositEnabled = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isAccountEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isChartofAccountEnabled = abp.features.isEnabled("CRS.Accounts.ChartofAccounts");
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isBookingEnabled = abp.features.isEnabled("CRS.Bookings");
            vm.isDueDefleetVehiclesReportsEnabled = abp.features.isEnabled("CRS.Reports.DueDefleetVehiclesReports");
            vm.isEmailInvoiceEnabled = abp.features.isEnabled("Notifications.EmailInvoice");
            vm.isSMSInvoiceEnabled = abp.features.isEnabled("Notifications.SMSInvoice");
            console.log(vm.isSMSInvoiceEnabled);
            vm.isEmailSOAenabled = abp.features.isEnabled("Notifications.EmailSOA");
            vm.isEmailTrafficFineInvoiceEnabled = abp.features.isEnabled("Notifications.EmailTrafficFineInvoice");
            vm.isMileageAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailMileageAlerts");
            vm.isServiceAlertEmailEnabled = abp.features.isEnabled("Notifications.EmailServiceAlerts");
            vm.isDetailedVehicleUtilizationReportEnabled = abp.features.isEnabled("CRS.Reports.DetailedVehicleUtilizationReport");
            vm.isAccountEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isStripeEnabled = abp.features.isEnabled("CRS.Bookings.StripePayment");
            vm.isUserWiseDiscountEnabled = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isChauffeurEnabled = abp.features.isEnabled("CRS.Chauffeur");
            vm.isAccessoriesEnabled = abp.features.isEnabled("CRS.AccessoriesRental");
            vm.isExternalAgreementsEnabled = abp.features.isEnabled("CRS.ExternalAgreements");
            vm.isSupplierAgreementsEnabled = abp.features.isEnabled("CRS.ExternalAgreements.SupplierAgreements");
            vm.isExternalDriverAgreementsEnabled = abp.features.isEnabled("CRS.ExternalAgreements.ExternalDriverAgreements");
            vm.isExpenseTypeEnabled = abp.auth.hasPermission('Pages.Tenant.ExpenseTypes');
            vm.agreementDocument = abp.features.isEnabled("CRS.Rental.Agreements.AgreementDocuments");
            vm.isProvisionEnabled = abp.features.isEnabled("CRS.Vouchers.Provisions");
            vm.isIndividualContactEnabled = abp.features.isEnabled("Core.Contacts");
            vm.isCompanyEnabled = abp.features.isEnabled("Core.Companies");
            vm.isSupplierEnabled = abp.features.isEnabled("Core.Suppliers");
            vm.isStaffEnabled = abp.features.isEnabled("Core.Staff");
            vm.isVehicleEnabled = abp.features.isEnabled("Core.Vehicles");
            vm.isJobEnabled = abp.features.isEnabled("WORKSHOP.Jobs");
            vm.isCouponsAndLuckyDrawEnabled = abp.features.isEnabled("CRS.CouponsAndLuckyDraw");
            vm.isJobEstimationEnabled = abp.features.isEnabled("WORKSHOP.JobEstimations");
            vm.isScsEnabled = abp.features.isEnabled("SCS");
            vm.isVoucherEnabled = abp.features.isEnabled("CRS.Vouchers");
            vm.isTaxEnabled = abp.features.isEnabled("CRS.Tax");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isEnableRentalBookingFeature = abp.features.isEnabled("CRS.Bookings");
            vm.isEnableRentalBookingPermission = abp.auth.hasPermission('Page.ExternaLogin.Bookings');
            vm.isFuelCreatePermission = abp.auth.hasPermission('Pages.Tenant.FuelDataMangement.FuelAccount.Addnew');
            vm.isFuelEditPermission = abp.auth.hasPermission('Pages.Tenant.FuelDataMangement.FuelAccount.Edit');
            vm.isEnableVehicleServiceBookingFeature = abp.features.isEnabled("ExternalLogin.VehicleServiceBooking");
            vm.isEnableVehicleServicelBookingPermission = abp.auth.hasPermission('Page.ExternaLogin.VehicleServiceBooking');
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.isRentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.isFinancialLeaseEnabled = abp.features.isEnabled("CRS.LeaseFinancial");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isPurchaseRequestApprovalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseRequests");
            vm.isPaymentGatewayFeatureEnabled = abp.features.isEnabled("Core.PaymentProcessor");
            vm.paymentGatewayFeatureSelected = abp.features.getValue("Core.PaymentProcessorType");
            vm.isOnlinePaymentsEnabled = abp.features.isEnabled('OnlinePayments');
            vm.downloadAdnocSmartTransactionsfromInvoiceLink = abp.features.isEnabled("FuelDataMangementDownlaod.ADNOCTransactions.Smart");
            vm.updateFuelRateGloballyPermission = abp.auth.hasPermission('Pages.Tenant.UpdateFuelRateGlobally.Edit');
            vm.loading = false;
            vm.settings = null;
            vm.voucherSubTypes = [];
            //vm.isAgeRequired = true;
            vm.isDateOfBirthRequired = 1;
            function getVoucherSubTypes() {
                vm.voucherSubTypes.push({ name: app.localize("ServicePurchaseOrder"), id: 52 });
                if (vm.isStockEnabled)
                    vm.voucherSubTypes.push({ name: app.localize("StockPurchaseOrder"), id: 53 });
                if (vm.isAssetEnabled)
                    vm.voucherSubTypes.push({ name: app.localize("AssetPurchaseOrder"), id: 54 });


            }
            vm.modules = [];
            if (abp.features.isEnabled("CRS.Rental"))
                vm.modules.push({ name: 'Rental', id: 1 });
            if (abp.features.isEnabled("CRS.Lease"))
                vm.modules.push({ name: 'Lease', id: 2 });
            if (abp.features.isEnabled("CRS.Limo"))
                vm.modules.push({ name: 'Limousine', id: 3 });
            if (abp.features.isEnabled("CRS.Transportation"))
                vm.modules.push({ name: 'Transportation', id: 4 });
            if (abp.features.isEnabled("CRS.Chauffeur"))
                vm.modules.push({ name: 'Chauffeur', id: 5 });
            if (abp.features.isEnabled("ERS"))
                vm.modules.push({ name: 'Equipment', id: 7 });
            if (abp.features.isEnabled("CRS.AccessoriesRental"))
                vm.modules.push({ name: 'Accessories', id: 8 });
            //if (abp.features.isEnabled("ERS.Lease"))
            //    vm.modules.push({ name: 'Equipment Lease', id: 8 });
            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;
            //vm.tenancyNameLowerCase = vm.tenancyName.toLowerCase();
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.logoFileName = vm.tenancyName.toLowerCase() + '-' + 'logo.png';
            vm.successFullyUploaded = null;
            vm.ImageSrc = "/App/images/tenantImages/" + vm.fileName;
            vm.ImageSrcLogo = "/App/images/tenantImages/" + vm.logoFileName;
            vm.invoicingRules = [
                {
                    id: 1,
                    name: app.localize('DateToDate')
                },
                {
                    id: 2,
                    name: app.localize('CalendarMonth')
                },
                {
                    id: 3,
                    name: app.localize('ThirtyDays')
                }];
            if (vm.isFinancialLeaseEnabled)
                vm.invoicingRules.push({ id: 4, name: app.localize('LeaseFinancial') });

            vm.excessKMsInvoicingRules = [
                {
                    id: 1,
                    name: app.localize('Monthly')
                },
                {
                    id: 2,
                    name: app.localize('Quarterly')
                },
                {
                    id: 3,
                    name: app.localize('HalfYearly')
                },
                {
                    id: 4,
                    name: app.localize('Yearly')
                }
            ];

            vm.invoicingTypes = [
                {
                    id: 1,
                    name: app.localize('Advance')
                },
                {
                    id: 2,
                    name: app.localize('Post')
                }]
            vm.daysOfWeek = [{
                id: 0,
                Name: 'Sunday'
            }, {
                id: 1,
                Name: 'Monday'
            },
            {
                id: 2,
                Name: 'Tuesday'
            },
            {
                id: 3,
                Name: 'Wednesday'
            },
            {
                id: 4,
                Name: 'Thursday'
            },
            {
                id: 5,
                Name: 'Friday'
            }, {
                id: 6,
                Name: 'Saturday'
            },
            ];

            vm.timeofDay =
                [
                    {
                        id: 0,
                        Name: '12 am'
                    },
                    {
                        id: 1,
                        Name: '1 am'
                    },
                    {
                        id: 2,
                        Name: '2 am'
                    },
                    {
                        id: 3,
                        Name: '3 am'
                    },
                    {
                        id: 4,
                        Name: '4 am'
                    },
                    {
                        id: 5,
                        Name: '5 am'
                    },
                    {
                        id: 6,
                        Name: '6 am'
                    },
                    {
                        id: 7,
                        Name: '7 am'
                    },
                    {
                        id: 8,
                        Name: '8 am'
                    },
                    {
                        id: 9,
                        Name: '9 am'
                    },
                    {
                        id: 10,
                        Name: '10 am'
                    },
                    {
                        id: 11,
                        Name: '11 am'
                    },
                    {
                        id: 12,
                        Name: '12 pm'
                    },
                    {
                        id: 13,
                        Name: '1 pm'
                    },
                    {
                        id: 14,
                        Name: '2 pm'
                    },
                    {
                        id: 15,
                        Name: '3 pm'
                    },
                    {
                        id: 16,
                        Name: '4 pm'
                    },
                    {
                        id: 17,
                        Name: '5 pm'
                    },
                    {
                        id: 18,
                        Name: '6 pm'
                    },
                    {
                        id: 19,
                        Name: '7 pm'
                    },
                    {
                        id: 20,
                        Name: '8 pm'
                    },
                    {
                        id: 21,
                        Name: '9 pm'
                    },
                    {
                        id: 22,
                        Name: '10 pm'
                    },
                    {
                        id: 23,
                        Name: '11 pm'
                    },


                ];

            vm.numericLengths = [3, 4, 5, 6];
            vm.invoiceNumericLengths = [3, 4, 5, 6];
            vm.numericLengthsAccount = [4, 5, 6, 7, 8];
            vm.driverMobileAcceptOrReject =
                [
                    {
                        id: 0,
                        Name: 'None'
                    },
                    {
                        id: 1,
                        Name: 'Accept'
                    },
                    {
                        id: 2,
                        Name: 'Reject'
                    },


                ];



            vm.permissions = {
                create: true, //abp.auth.hasPermission('Pages.Tenant.Locations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Locations.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Locations.Delete')
            };
            vm.countryCodes = [
                {
                    name: "Afghanistan",
                    code: "AF"
                },
                {
                    name: "ALA	Aland Islands",
                    code: "AX"
                },
                {
                    name: "Albania",
                    code: "AL"
                },
                {
                    name: "Algeria",
                    code: "DZ"
                },
                {
                    name: "American Samoa",
                    code: "AS"
                },
                {
                    name: "Andorra",
                    code: "AD"
                },
                {
                    name: "Andorra",
                    code: "AND"
                },
                {
                    name: "Angola",
                    code: "AO"
                },
                {
                    name: "Anguilla",
                    code: "AI"
                },
                {
                    name: "Antarctica",
                    code: "AQ"
                },
                {
                    name: "Antigua and Barbuda",
                    code: "AG"
                },
                {
                    name: "Argentina",
                    code: "AR"
                }, {
                    name: "Armenia",
                    code: "AM"
                }, {
                    name: "Aruba",
                    code: "AW"
                }, {
                    name: "Australia",
                    code: "AU"
                },
                {
                    name: "Austria",
                    code: "AT"
                },
                {
                    name: "Azerbaijan",
                    code: "AZ"
                },
                {
                    name: "Bahamas",
                    code: "BS"
                },
                {
                    name: "Bahrain",
                    code: "BH"
                },
                {
                    name: "Bangladesh",
                    code: "BD"
                }, {
                    name: "Barbados",
                    code: "BB"
                }, {
                    name: "Belarus",
                    code: "BY"
                }, {
                    name: "Belgium",
                    code: "BE"
                }, {
                    name: "Belize",
                    code: "BZ"
                }, {
                    name: "Benin",
                    code: "BJ"
                }, {
                    name: "Belize",
                    code: "BZ"
                }, {
                    name: "Bermuda",
                    code: "BM"
                },
                {
                    name: "Bhutan",
                    code: "BT"
                }, {
                    name: "Bolivia",
                    code: "BO"
                }, {
                    name: "Bosnia and Herzegovina",
                    code: "BA"
                }, {
                    name: "Botswana",
                    code: "BW"
                }, {
                    name: "Bouvet Island	",
                    code: "BV"
                }, {
                    name: "Brazil",
                    code: "BR"
                }, {
                    name: "British Virgin Islands",
                    code: "VG"
                }, {
                    name: "British Indian Ocean Territory",
                    code: "IO"
                }, {
                    name: "Brunei Darussalam",
                    code: "BN"
                }, {
                    name: "Bulgaria",
                    code: "BG"
                }, {
                    name: "Burkina Faso",
                    code: "BF"
                }, {
                    name: "Burundi",
                    code: "BI"
                },
                {
                    name: "Cambodia",
                    code: "KH"
                }, {
                    name: "Cameroon",
                    code: "CM"
                }, {
                    name: "Canada",
                    code: "CA"
                }, {
                    name: "Cape Verde",
                    code: "CV"
                }, {
                    name: "Cayman Islands",
                    code: "KY"
                }, {
                    name: "Central African Republic",
                    code: "CF"
                }, {
                    name: "Chad",
                    code: "TD"
                }, {
                    name: "Chile",
                    code: "CL"
                }, {
                    name: "China",
                    code: "CN"
                }, {
                    name: "Hong Kong, SAR China",
                    code: "HK"
                }, {
                    name: "Macao, SAR China",
                    code: "MO"
                }, {
                    name: "Christmas Island",
                    code: "CX"
                }, {
                    name: "Cocos (Keeling) Islands",
                    code: "CC"
                }, {
                    name: "Colombia",
                    code: "CO"
                }, {
                    name: "Comoros",
                    code: "KM"
                }, {
                    name: "Congo (Brazzaville)",
                    code: "CG"
                }, {
                    name: "Congo, (Kinshasa)",
                    code: "CD"
                }, {
                    name: "Cook Islands",
                    code: "CK"
                }, {
                    name: "Costa Rica",
                    code: "CR"
                }, {
                    name: "Côte d'Ivoire",
                    code: "CI"
                }, {
                    name: "Croatia",
                    code: "HR"
                }, {
                    name: "Cuba",
                    code: "CU"
                }, {
                    name: "Cyprus",
                    code: "CY"
                }, {
                    name: "Czech Republic",
                    code: "CZ"
                },
                {
                    name: "Denmark",
                    code: "DK"
                },
                {
                    name: "Dominica",
                    code: "DM"
                },
                {
                    name: "Dominican Republic",
                    code: "DO"
                },
                {
                    name: "Ecuador",
                    code: "EC"
                },
                {
                    name: "Egypt",
                    code: "EG"
                },
                {
                    name: "El Salvador",
                    code: "SV"
                },
                {
                    name: "Equatorial Guinea",
                    code: "GQ"
                },
                {
                    name: "Eritrea",
                    code: "ER"
                },
                {
                    name: "Estonia",
                    code: "EE"
                },
                {
                    name: "Ethiopia",
                    code: "ET"
                },
                {
                    name: "Falkland Islands (Malvinas)",
                    code: "FK"
                },
                {
                    name: "Faroe Islands",
                    code: "FO"
                },
                {
                    name: "Fiji",
                    code: "FJ"
                },
                {
                    name: "Finland",
                    code: "FI"
                },
                {
                    name: "France",
                    code: "FR"
                },
                {
                    name: "French Guiana",
                    code: "GF"
                },
                {
                    name: "French Polynesia",
                    code: "PF"
                },
                {
                    name: "French Southern Territories",
                    code: "TF"
                },
                {
                    name: "Gabon",
                    code: "GA"
                },
                {
                    name: "Gambia",
                    code: "GM"
                },
                {
                    name: "Georgia",
                    code: "GE"
                },
                {
                    name: "Germany",
                    code: "DE"
                },
                {
                    name: "Ghana",
                    code: "GH"
                },
                {
                    name: "Gibraltar",
                    code: "GI"
                },
                {
                    name: "Greece",
                    code: "GR"
                },
                {
                    name: "Greenland",
                    code: "GL"
                },
                {
                    name: "Grenada",
                    code: "GD"
                },
                {
                    name: "Guadeloupe",
                    code: "GP"
                },
                {
                    name: "Guam",
                    code: "GU"
                },
                {
                    name: "Guatemala",
                    code: "GT"
                },
                {
                    name: "Guernsey",
                    code: "GG"
                },
                {
                    name: "Guinea",
                    code: "GN"
                },
                {
                    name: "Guinea-Bissau",
                    code: "GW"
                },
                {
                    name: "Guyana",
                    code: "GY"
                },
                {
                    name: "Haiti",
                    code: "HT"
                },
                {
                    name: "Heard and Mcdonald Islands",
                    code: "HM"
                },
                {
                    name: "Holy See (Vatican City State)",
                    code: "VA"
                },
                {
                    name: "Honduras",
                    code: "HN"
                },
                {
                    name: "Hungary",
                    code: "HU"
                },
                {
                    name: "Iceland",
                    code: "IS"
                },
                {
                    name: "India",
                    code: "IN"
                },
                {
                    name: "Indonesia",
                    code: "ID"
                },
                {
                    name: "Iran, Islamic Republic of",
                    code: "IR"
                },
                {
                    name: "Iraq",
                    code: "IQ"
                },
                {
                    name: "Ireland",
                    code: "IE"
                },
                {
                    name: "Isle of Man",
                    code: "IM"
                },
                {
                    name: "Israel",
                    code: "IL"
                },
                {
                    name: "Italy",
                    code: "IT"
                },
                {
                    name: "Jamaica",
                    code: "JM"
                },
                {
                    name: "Japan",
                    code: "JP"
                },
                {
                    name: "Jersey",
                    code: "JE"
                },
                {
                    name: "Jordan",
                    code: "JO"
                },
                {
                    name: "Kazakhstan",
                    code: "KZ"
                },
                {
                    name: "Kenya",
                    code: "KE"
                },
                {
                    name: "Kiribati",
                    code: "KI"
                },
                {
                    name: "Korea (North)",
                    code: "KP"
                },
                {
                    name: "Korea (South)",
                    code: "KR"
                },
                {
                    name: "Kuwait",
                    code: "KW"
                },
                {
                    name: "Kyrgyzstan",
                    code: "KG"
                },
                {
                    name: "Lao PDR",
                    code: "LA"
                },
                {
                    name: "Latvia",
                    code: "LV"
                },
                {
                    name: "Lebanon",
                    code: "LB"
                },
                {
                    name: "Lesotho",
                    code: "LS"
                },
                {
                    name: "Liberia",
                    code: "LR"
                },
                {
                    name: "Libya",
                    code: "LY"
                },
                {
                    name: "Liechtenstein",
                    code: "LI"
                },
                {
                    name: "Lithuania",
                    code: "LT"
                },
                {
                    name: "Luxembourg",
                    code: "LU"
                },
                {
                    name: "Macedonia, Republic of",
                    code: "MK"
                },
                {
                    name: "Madagascar",
                    code: "MG"
                },
                {
                    name: "Malawi",
                    code: "MW"
                },
                {
                    name: "Malaysia",
                    code: "MY"
                },
                {
                    name: "Maldives",
                    code: "MV"
                },
                {
                    name: "Mali",
                    code: "ML"
                },
                {
                    name: "Malta",
                    code: "MT"
                },
                {
                    name: "Marshall Islands",
                    code: "MH"
                },
                {
                    name: "Martinique",
                    code: "MQ"
                },
                {
                    name: "Mauritania",
                    code: "MR"
                },
                {
                    name: "Mauritius",
                    code: "MU"
                },
                {
                    name: "Mayotte",
                    code: "YT"
                },
                {
                    name: "Mexico",
                    code: "MX"
                },
                {
                    name: "Micronesia, Federated States of",
                    code: "FM"
                },
                {
                    name: "Moldova",
                    code: "MD"
                },
                {
                    name: "Monaco",
                    code: "MC"
                },
                {
                    name: "Mongolia",
                    code: "MN"
                },
                {
                    name: "Montenegro",
                    code: "ME"
                },
                {
                    name: "Montserrat",
                    code: "MS"
                },
                {
                    name: "Morocco",
                    code: "MA"
                },
                {
                    name: "Mozambique",
                    code: "MZ"
                },
                {
                    name: "Myanmar",
                    code: "MM"
                },
                {
                    name: "Namibia",
                    code: "NA"
                },
                {
                    name: "Nauru",
                    code: "NR"
                },
                {
                    name: "Nepal",
                    code: "NP"
                },
                {
                    name: "Netherlands",
                    code: "NL"
                },
                {
                    name: "Netherlands Antilles",
                    code: "AN"
                },
                {
                    name: "New Caledonia",
                    code: "NC"
                },
                {
                    name: "New Zealand",
                    code: "NZ"
                },
                {
                    name: "Nicaragua",
                    code: "NI"
                },
                {
                    name: "Niger",
                    code: "NE"
                },
                {
                    name: "Nigeria",
                    code: "NG"
                },
                {
                    name: "Niue",
                    code: "NU"
                },
                {
                    name: "Norfolk Island",
                    code: "NF"
                },
                {
                    name: "Northern Mariana Islands",
                    code: "MP"
                },
                {
                    name: "Norway",
                    code: "NO"
                },
                {
                    name: "Oman",
                    code: "OM"
                },
                {
                    name: "Pakistan",
                    code: "PK"
                },
                {
                    name: "Palau",
                    code: "PW"
                },
                {
                    name: "Palestinian Territory",
                    code: "PS"
                },
                {
                    name: "Panama",
                    code: "PA"
                },
                {
                    name: "Papua New Guinea",
                    code: "PG"
                },
                {
                    name: "Paraguay",
                    code: "PY"
                },
                {
                    name: "Peru",
                    code: "PE"
                },
                {
                    name: "Philippines",
                    code: "PH"
                },
                {
                    name: "Pitcairn",
                    code: "PN"
                },
                {
                    name: "Poland",
                    code: "PL"
                },
                {
                    name: "Portugal",
                    code: "PT"
                },
                {
                    name: "Puerto Rico",
                    code: "PR"
                },
                {
                    name: "Qatar",
                    code: "QA"
                },
                {
                    name: "Réunion",
                    code: "RE"
                },
                {
                    name: "Romania",
                    code: "RO"
                },
                {
                    name: "Russian Federation",
                    code: "RU"
                },
                {
                    name: "Rwanda",
                    code: "RW"
                },
                {
                    name: "Saint-Barthélemy",
                    code: "BL"
                },
                {
                    name: "Saint Helena",
                    code: "SH"
                },
                {
                    name: "Saint Kitts and Nevis",
                    code: "KN"
                },
                {
                    name: "Saint Lucia",
                    code: "LC"
                },
                {
                    name: "Saint-Martin (French part)",
                    code: "MF"
                },
                {
                    name: "Saint Pierre and Miquelon",
                    code: "PM"
                },
                {
                    name: "Saint Vincent and Grenadines",
                    code: "VC"
                },
                {
                    name: "Samoa",
                    code: "WS"
                },
                {
                    name: "San Marino",
                    code: "SM"
                },
                {
                    name: "Sao Tome and Principe",
                    code: "ST"
                },
                {
                    name: "Saudi Arabia",
                    code: "SA"
                },
                {
                    name: "Senegal",
                    code: "SN"
                },
                {
                    name: "Serbia",
                    code: "RS"
                },
                {
                    name: "Seychelles",
                    code: "SC"
                },
                {
                    name: "Sierra Leone",
                    code: "SL"
                },
                {
                    name: "Singapore",
                    code: "SG"
                },
                {
                    name: "Slovakia",
                    code: "SK"
                },
                {
                    name: "Slovenia",
                    code: "SI"
                },
                {
                    name: "Solomon Islands",
                    code: "SB"
                },
                {
                    name: "Somalia",
                    code: "SO"
                },
                {
                    name: "South Africa",
                    code: "ZA"
                },
                {
                    name: "South Georgia and the South Sandwich Islands",
                    code: "GS"
                },
                {
                    name: "South Sudan",
                    code: "SS"
                },
                {
                    name: "Spain",
                    code: "ES"
                },
                {
                    name: "Sri Lanka",
                    code: "LK"
                },
                {
                    name: "Sudan",
                    code: "SD"
                },
                {
                    name: "Suriname",
                    code: "SR"
                },
                {
                    name: "Svalbard and Jan Mayen Islands",
                    code: "SJ"
                },
                {
                    name: "Swaziland	",
                    code: "SZ"
                },
                {
                    name: "Sweden",
                    code: "SE"
                },
                {
                    name: "Switzerland",
                    code: "CH"
                },
                {
                    name: "Syrian Arab Republic (Syria)",
                    code: "SY"
                },
                {
                    name: "Taiwan, Republic of China",
                    code: "TW"
                },
                {
                    name: "Tajikistan",
                    code: "TJ"
                },
                {
                    name: "Tanzania, United Republic of",
                    code: "TZ"
                },
                {
                    name: "Thailand",
                    code: "TH"
                },
                {
                    name: "Timor-Leste",
                    code: "TL"
                },
                {
                    name: "Togo",
                    code: "TG"
                },
                {
                    name: "Tokelau",
                    code: "TK"
                },
                {
                    name: "Tonga",
                    code: "TO"
                },
                {
                    name: "Trinidad and Tobago",
                    code: "TT"
                },
                {
                    name: "Tunisia",
                    code: "TN"
                }
                , {
                    name: "Turkey",
                    code: "TR"
                }
                , {
                    name: "Turkmenistan",
                    code: "TM"
                }
                , {
                    name: "Turks and Caicos Islands",
                    code: "TC"
                }
                , {
                    name: "Tuvalu",
                    code: "TV"
                }
                , {
                    name: "Uganda",
                    code: "UG"
                }
                , {
                    name: "Ukraine",
                    code: "UA"
                }
                , {
                    name: "United Arab Emirates",
                    code: "AE"
                }
                , {
                    name: "United Kingdom",
                    code: "GB"
                }, {
                    name: "United States of America",
                    code: "US"
                }, {
                    name: "US Minor Outlying Islands",
                    code: "UM"
                }, {
                    name: "Uruguay",
                    code: "UY"
                }, {
                    name: "Uzbekistan",
                    code: "UZ"
                }, {
                    name: "Vanuatu",
                    code: "VU"
                }, {
                    name: "Venezuela (Bolivarian Republic)",
                    code: "VE"
                }, {
                    name: "Viet Nam",
                    code: "VN"
                }, {
                    name: "Virgin Islands,",
                    code: "US"
                }, {
                    name: "Wallis and Futuna Islands",
                    code: "WF"
                }, {
                    name: "Western Sahara",
                    code: "EH"
                }, {
                    name: "Yemen",
                    code: "YE"
                }, {
                    name: "Zambia",
                    code: "ZM"
                }, {
                    name: "Zimbabwe",
                    code: "ZW"
                }

            ]
            // Validating Settings

            var designationDetails = function () {
                designationService.getDesignations().success(function (result) {
                    vm.designationDetails = result.items;
                    //console.log(test);
                });
            };


            function ValidatingSettings(settingDetail) {
                var weekEndDayValidate = {};
                errorMessage = '';
                errorMessage = 'Setting Can Not Be Updated Due To Following Issues: \n';

                if (isValid == false) {
                    isValid = true;
                }
                if (settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (settingDetail.speedCommon.weekEndDay2 == 0) {
                            weekEndDayValidate = 7;
                        }
                        else {
                            weekEndDayValidate = settingDetail.speedCommon.weekEndDay2;
                        }


                    }

                }

                if (settingDetail.speedCommon.weekEndDay1 == null || isNaN(settingDetail.speedCommon.weekEndDay1)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n WeekEnd Day1 Can Not Be Empty';

                }


                if (isValid == true && settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (weekEndDayValidate != (settingDetail.speedCommon.weekEndDay1 + 1)) {
                            isValid = false;
                            errorMessage = errorMessage + '\n WeekEnd Days Must Be Consecutive ';
                        }
                    }
                }

                //Validating for Email
                var errorFieldCount = 0;
                if (!settingDetail.email.defaultFromAddress) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.defaultFromDisplayName) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpHost) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpPort && settingDetail.email.smtpPort <= 0) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpUseDefaultCredentials) {
                    if (!settingDetail.email.smtpUserName) {
                        errorFieldCount++;
                    }
                    if (!settingDetail.email.smtpPassword) {
                        errorFieldCount++;
                    }
                }

                if (errorFieldCount == 0) {
                    //valid for saving
                }
                else if (!settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 6) {
                    //skip email info saving
                }
                else if (settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 4) {
                    //skip email info saving
                }
                else {
                    isValid = false;
                    errorMessage = errorMessage + '\nEmail information is incomplete';
                }

            }

            vm.sendTestEmail = function () {
                tenantSettingsService.sendTestEmail({
                    emailAddress: vm.testEmailAddress
                }).success(function () {
                    abp.notify.info(app.localize('TestEmailSentSuccessfully'));
                });
            };

            vm.getTariffCards = function () {

                tariffCardService.getTariffCards({}).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                    vm.tariffCards.splice(0, 0, { id: 0, name: "" });
                }).finally(function () {

                });
            };

            // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
            function isValidDate(dateString) {

                // First check for the pattern
                if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
                    return false;

                // Parse the date parts to integers
                var parts = dateString.split("/");
                var day = parseInt(parts[1], 10);
                var month = parseInt(parts[0], 10);
                var year = parseInt(parts[2], 10);

                // Check the ranges of month and year
                if (year < 1000 || year > 3000 || month == 0 || month > 12)
                    return false;

                var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Adjust for leap years
                if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                    monthLength[1] = 29;

                // Check the range of the day
                return day > 0 && day <= monthLength[month - 1];
            };

            function getLocations() {
                vm.loading = true;
                commonLookupService.getLocations().success(function (result) {
                    vm.locations = result.items;

                    if (vm.islinkCrsToWorkShopEnabled && vm.islinkWorkShopToCrsTenantNameHasValue)
                        getCRSsuppliersAndWScontactsLinkings();
                }).finally(function () {
                    vm.loading = false;

                });


            }

            function getCRSsuppliersAndWScontactsLinkings() {
                vm.branchSuppliersLinkings = [];
                var linkings = JSON.parse(vm.settings.speedCommon.tenantLinkedSuppliers);
                vm.locations.forEach(e => {
                    var linkingObj = null;
                    if (Array.isArray(linkings)) {
                        linkingObj = linkings.find(b => b.branchId == e.id);
                        if (linkingObj)
                            linkingObj.supplier = { id: linkingObj.supplierId, name: linkingObj.supplierName };
                    }
                    if (!linkingObj) {
                        vm.branchSuppliersLinkings.push({
                            branchId: e.id,
                            branchName: e.name,
                            supplierId: null,
                            supplierName: null
                        });
                    }
                    else
                        vm.branchSuppliersLinkings.push(linkingObj);

                });
            };

            //vm.saveCRSsuppliersAndWScontactsLinkings = function () {
            //    vm.settings.speedCommon.tenantLinkedSuppliers = JSON.stringify(vm.branchSuppliersLinkings);
            //};

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };


            vm.searchTenantLinkedCustomer = function ($select) {
                return directoryService.searchLinkedCustomer({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.tenantLinkedCustomers = response.data.items;
                });
            };


            vm.searchTenantLinkedSupplier = function ($select) {
                return directoryService.searchLinkedSupplier({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.tenantLinkedSuppliers = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };


            vm.searchUsers = function ($select) {
                return userService.searchUsersOptimized({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };


            vm.getFineAuthoritySupplier = function (data) {

                return directoryService.getContactInfo({ id: data }).then(function (response) {
                    vm.supplier = response.data;
                });
            };


            vm.getTenantLinkedCustomer = function (data) {
                vm.tenantLinkedCustomers = [];
                return directoryService.getLinkedCustomerInfo({ contanctId: data }).then(function (result) {
                    vm.tenantLinkedCustomer = result.data;
                    vm.tenantLinkedCustomers.push(vm.tenantLinkedCustomer);
                });
            };


            vm.getTenantLinkedSupplier = function (data) {
                vm.tenantLinkedSuppliers = [];
                return directoryService.getLinkedSupplierInfo({ contanctId: data }).then(function (result) {
                    vm.tenantLinkedSupplier = result.data;
                    vm.tenantLinkedSuppliers.push(vm.tenantLinkedSupplier);
                });
            };
            vm.getContactGroups = function () {
                vm.loading = true;
                vm.contactfilters = { contactType: 2 };
                contactGroupService.getContactGroupsOnContactType(vm.contactfilters).success(function (data) {
                    vm.contactGroups = data.items;
                    vm.contactGroups.splice(0, 0, { id: 0, name: "" });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.posDefaultCustomerselect = function (data) {
                return directoryService.getContactInfo({ id: data }).then(function (response) {
                    vm.customer = response.data;
                });
            };
            vm.getSettings = function () {
                vm.loading = true;

                tenantSettingsService.getAllSettings()

                    .success(function (result) {

                        vm.settings = result;
                        console.log(vm.settings);
                        vm.settings.speedCommon.weekEndDay1 = parseInt(vm.settings.speedCommon.weekEndDay1);
                        if (!vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod)
                            vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = 0;
                        if (!vm.settings.speedCommon.specialBranchwithnoFinancialeffects)
                            vm.settings.speedCommon.specialBranchwithnoFinancialeffects = 0;
                        if (!vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect)
                            vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect = 0;
                        //if (!isValidDate(vm.settings.speedCommon.invoicingStartDate)) 
                        //vm.settings.speedCommon.invoicingStartDate =null

                        vm.settings.speedCommon.weekEndDay2 = parseInt(vm.settings.speedCommon.weekEndDay2);
                        vm.settings.limousine.trip_CustomField1Type = parseInt(vm.settings.limousine.trip_CustomField1Type);
                        vm.settings.limousine.trip_CustomField2Type = parseInt(vm.settings.limousine.trip_CustomField2Type);
                        vm.settings.limousine.trip_CustomField3Type = parseInt(vm.settings.limousine.trip_CustomField3Type);
                        vm.settings.requiredFieds.isBusinessSourceBroker_CustomFieldType = parseInt(vm.settings.requiredFieds.isBusinessSourceBroker_CustomFieldType);
                        vm.settings.limousine.trip_DriverMobileAppAcceptOrReject = parseInt(vm.settings.limousine.trip_DriverMobileAppAcceptOrReject);
                        vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect = parseInt(vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect);

                        vm.settings.speedCommon.fineSurchargeType = parseInt(vm.settings.speedCommon.fineSurchargeType);
                        vm.settings.speedCommon.brokerContactGroupId = parseInt(vm.settings.speedCommon.brokerContactGroupId);
                        vm.settings.speedCommon.halfDaySlab1From = parseInt(vm.settings.speedCommon.halfDaySlab1From);
                        vm.settings.speedCommon.halfDaySlab1To = parseInt(vm.settings.speedCommon.halfDaySlab1To);
                        vm.settings.speedCommon.halfDaySlab2From = parseInt(vm.settings.speedCommon.halfDaySlab2From);
                        vm.settings.speedCommon.halfDaySlab2To = parseInt(vm.settings.speedCommon.halfDaySlab2To);
                        vm.settings.speedCommon.invoicingRuleIndividual = parseInt(vm.settings.speedCommon.invoicingRuleIndividual);
                        vm.settings.speedCommon.invoicingTypeIndividual = parseInt(vm.settings.speedCommon.invoicingTypeIndividual);
                        vm.settings.speedCommon.invoicingRuleCorporate = parseInt(vm.settings.speedCommon.invoicingRuleCorporate);
                        vm.settings.speedCommon.invoicingTypeCorporate = parseInt(vm.settings.speedCommon.invoicingTypeCorporate);

                        vm.settings.speedCommon.accessoriesInvoicingRuleIndividual = parseInt(vm.settings.speedCommon.accessoriesInvoicingRuleIndividual);
                        vm.settings.speedCommon.accessoriesInvoicingTypeIndividual = parseInt(vm.settings.speedCommon.accessoriesInvoicingTypeIndividual);
                        vm.settings.speedCommon.accessoriesInvoicingRuleCorporate = parseInt(vm.settings.speedCommon.accessoriesInvoicingRuleCorporate);
                        vm.settings.speedCommon.accessoriesInvoicingTypeCorporate = parseInt(vm.settings.speedCommon.accessoriesInvoicingTypeCorporate);

                        vm.settings.speedCommon.leaseInvoicingRuleIndividual = parseInt(vm.settings.speedCommon.leaseInvoicingRuleIndividual);
                        vm.settings.speedCommon.leaseInvoicingTypeIndividual = parseInt(vm.settings.speedCommon.leaseInvoicingTypeIndividual);
                        vm.settings.speedCommon.leaseInvoicingRuleCorporate = parseInt(vm.settings.speedCommon.leaseInvoicingRuleCorporate);
                        vm.settings.speedCommon.leaseInvoicingTypeCorporate = parseInt(vm.settings.speedCommon.leaseInvoicingTypeCorporate);

                        vm.settings.speedCommon.excessKMsInvoicingRuleRental = parseInt(vm.settings.speedCommon.excessKMsInvoicingRuleRental);
                        vm.settings.speedCommon.accessoriesExcessKMsInvoicingRuleRental = parseInt(vm.settings.speedCommon.accessoriesExcessKMsInvoicingRuleRental);
                        vm.settings.speedCommon.excessKMsInvoicingRuleLease = parseInt(vm.settings.speedCommon.excessKMsInvoicingRuleLease);

                        vm.settings.speedCommon.assetDisposalPostingOptions = parseInt(vm.settings.speedCommon.assetDisposalPostingOptions);
                        vm.settings.speedCommon.profitMarginOnBookValue = parseFloat(vm.settings.speedCommon.profitMarginOnBookValue);

                        vm.settings.speedCommon.dueDefleetVehiclesReportsKMs = parseInt(vm.settings.speedCommon.dueDefleetVehiclesReportsKMs);
                        vm.settings.speedCommon.dueDefleetVehiclesReportsPeriod = parseFloat(vm.settings.speedCommon.dueDefleetVehiclesReportsPeriod);
                        vm.settings.speedCommon.stripeReceiptPaymentMethod = parseInt(vm.settings.speedCommon.stripeReceiptPaymentMethod);
                        vm.settings.speedCommon.taxPercentage = parseFloat(vm.settings.speedCommon.taxPercentage);
                        vm.settings.speedCommon.updateFuelRate = parseFloat(vm.settings.speedCommon.updateFuelRate);
                        vm.getTenantLinkedCustomer(vm.settings.speedCommon.tenantLinkedCustomer);
                        //vm.getTenantLinkedSupplier(vm.settings.speedCommon.tenantLinkedSupplier);

                        //pos get setting
                        vm.posDefaultCustomerselect(vm.settings.speedCommon.posDefaultCustomer);

                        vm.settings.speedCommon.expenseTypeCanBeCreatedWithName = parseInt(vm.settings.speedCommon.expenseTypeCanBeCreatedWithName);
                        if (vm.isExpenseTypeEnabled)
                            vm.getExpenseType(vm.settings.speedCommon.expenseTypeCanBeCreatedWithName);
                        if (vm.settings.speedCommon.account)
                            vm.filters.accountsList = angular.fromJson(vm.settings.speedCommon.account);
                        if (vm.settings.speedCommon.chargesType)
                            vm.filters.chargesType = angular.fromJson(vm.settings.speedCommon.chargesType);
                        if (vm.settings.speedCommon.showSelectedJobTypes)
                            vm.filters.showSelectedJobTypes = angular.fromJson(vm.settings.speedCommon.showSelectedJobTypes);
                        if (vm.settings.speedCommon.isMiscellaneousJobCardValueZero)
                            vm.filters.isMiscellaneousJobCardValueZero = angular.fromJson(vm.settings.speedCommon.isMiscellaneousJobCardValueZero);

                        vm.settings.salik.tollsInvoice = parseInt(vm.settings.salik.tollsInvoice);
                        vm.settings.darb.tollsInvoice = parseInt(vm.settings.darb.tollsInvoice);
                        vm.settings.fine.trafficFineInvoice = parseInt(vm.settings.fine.trafficFineInvoice);
                        vm.settings.fine.fineSurchargeType = parseInt(vm.settings.fine.fineSurchargeType);
                        vm.settings.fine.fineAuthoritySupplier = parseInt(vm.settings.fine.fineAuthoritySupplier);
                        vm.getFineAuthoritySupplier(vm.settings.fine.fineAuthoritySupplier);

                        vm.settings.fine.fineAlertOnAmountLimit = parseFloat(vm.settings.fine.fineAlertOnAmountLimit);
                        vm.settings.fine.noOfFinesMoreThanLimit = parseInt(vm.settings.fine.noOfFinesMoreThanLimit);

                        vm.settings.costCenter.costCenterGroup2ForEquipmentRentalModule = parseInt(vm.settings.costCenter.costCenterGroup2ForEquipmentRentalModule);
                        vm.settings.costCenter.defaultCostCenterIdGroup1 = parseInt(vm.settings.costCenter.defaultCostCenterIdGroup1);


                        vm.settings.documentNos.couponNumericPartLength = parseInt(vm.settings.documentNos.couponNumericPartLength);
                        vm.settings.documentNos.nummericPartLength = parseInt(vm.settings.documentNos.nummericPartLength);
                        vm.settings.documentNos.bookingNummericPartLength = parseInt(vm.settings.documentNos.bookingNummericPartLength);
                        vm.settings.documentNos.supplierAgreementNumericPartLength = parseInt(vm.settings.documentNos.supplierAgreementNumericPartLength);
                        vm.settings.documentNos.externalDriverAgreementNumericPartLength = parseInt(vm.settings.documentNos.externalDriverAgreementNumericPartLength);
                        vm.settings.documentNos.coA_SubAccountLength = parseInt(vm.settings.documentNos.coA_SubAccountLength);
                        vm.settings.documentNos.invoiceNummericPartLength = parseInt(vm.settings.documentNos.invoiceNummericPartLength);
                        vm.settings.documentNos.receiptNummericPartLength = parseInt(vm.settings.documentNos.receiptNummericPartLength);
                        vm.settings.documentNos.masterAgreementNummericPartLength = parseInt(vm.settings.documentNos.masterAgreementNummericPartLength);
                        vm.settings.documentNos.equipmentDeliveryNummericPartLength = parseInt(vm.settings.documentNos.equipmentDeliveryNummericPartLength);
                        vm.settings.documentNos.quotationNummericPartLength = parseInt(vm.settings.documentNos.quotationNummericPartLength);
                        vm.settings.documentNos.debitNoteNummericPartLength = parseInt(vm.settings.documentNos.debitNoteNummericPartLength);
                        vm.settings.documentNos.customerDepositNummericPartLength = parseInt(vm.settings.documentNos.customerDepositNummericPartLength);
                        vm.settings.documentNos.depreciationNummericPartLength = parseInt(vm.settings.documentNos.depreciationNummericPartLength);
                        vm.settings.documentNos.amortizationNummericPartLength = parseInt(vm.settings.documentNos.amortizationNummericPartLength);
                        vm.settings.documentNos.purchaseOrderNummericPartLength = parseInt(vm.settings.documentNos.purchaseOrderNummericPartLength);
                        vm.settings.documentNos.purchaseRequestNummericPartLength = parseInt(vm.settings.documentNos.purchaseRequestNummericPartLength);
                        vm.settings.documentNos.saleOrderNummericPartLength = parseInt(vm.settings.documentNos.saleOrderNummericPartLength);
                        vm.settings.documentNos.provisionNummericPartLength = parseInt(vm.settings.documentNos.provisionNummericPartLength);
                        vm.settings.documentNos.matureChequePayableNummericPartLength = parseInt(vm.settings.documentNos.matureChequePayableNummericPartLength);
                        vm.settings.documentNos.matureChequeReceivableNummericPartLength = parseInt(vm.settings.documentNos.matureChequeReceivableNummericPartLength);
                        vm.settings.documentNos.cashBankDepositNummericPartLength = parseInt(vm.settings.documentNos.cashBankDepositNummericPartLength);
                        vm.settings.documentNos.creditCardTransactionsBankTransferNummericPartLength = parseInt(vm.settings.documentNos.creditCardTransactionsBankTransferNummericPartLength);
                        vm.settings.documentNos.openingBalanceNummericPartLength = parseInt(vm.settings.documentNos.openingBalanceNummericPartLength);
                        vm.settings.documentNos.jvNummericPartLength = parseInt(vm.settings.documentNos.jvNummericPartLength);
                        vm.settings.documentNos.creditNoteNummericPartLength = parseInt(vm.settings.documentNos.creditNoteNummericPartLength);
                        vm.settings.documentNos.paymentNummericPartLength = parseInt(vm.settings.documentNos.paymentNummericPartLength);
                        vm.settings.documentNos.billNummericPartLength = parseInt(vm.settings.documentNos.billNummericPartLength);
                        vm.settings.documentNos.jvNummericPartLength = parseInt(vm.settings.documentNos.jvNummericPartLength);
                        vm.settings.speedCommon.taxPercentage = parseFloat(vm.settings.speedCommon.taxPercentage);
                        vm.settings.speedCommon.updateFuelRate = parseFloat(vm.settings.speedCommon.updateFuelRate);
                        vm.settings.documentNos.rateCardForWebBookingPlugin = parseInt(vm.settings.documentNos.rateCardForWebBookingPlugin);

                        vm.settings.documentNos.customerCodeNumericPart = parseInt(vm.settings.documentNos.customerCodeNumericPart);
                        vm.settings.documentNos.supplierCodeNumericPart = parseInt(vm.settings.documentNos.supplierCodeNumericPart);
                        vm.settings.documentNos.staffCodeNumericPart = parseInt(vm.settings.documentNos.staffCodeNumericPart);

                        vm.settings.documentNos.leaseInquiryCodeNumericPart = parseInt(vm.settings.documentNos.leaseInquiryCodeNumericPart);
                        vm.settings.documentNos.leaseQuotationCodeNumericPart = parseInt(vm.settings.documentNos.leaseQuotationCodeNumericPart);

                        vm.settings.documentNos.cancelChequePayableNummericPartLength = parseInt(vm.settings.documentNos.cancelChequePayableNummericPartLength);
                        vm.settings.documentNos.returnChequeReceivableNummericPartLength = parseInt(vm.settings.documentNos.returnChequeReceivableNummericPartLength);


                        vm.settings.documentNos.jobNummericPartLength = parseInt(vm.settings.documentNos.jobNummericPartLength);
                        vm.settings.documentNos.jobEstimationNummericPartLength = parseInt(vm.settings.documentNos.jobEstimationNummericPartLength);


                        vm.settings.documentNos.jobNummericPartLength = parseInt(vm.settings.documentNos.jobNummericPartLength);
                        vm.settings.documentNos.jobEstimationNummericPartLength = parseInt(vm.settings.documentNos.jobEstimationNummericPartLength);

                        if (vm.settings.agreementDocument.agreementDocuments)
                            vm.settings.agreementDocument.agreementDocuments = JSON.parse(vm.settings.agreementDocument.agreementDocuments);
                        else
                            vm.settings.agreementDocument.agreementDocuments = [];

                        vm.settings.documentNos.rentalQuotationCodeNumericPart = parseInt(vm.settings.documentNos.rentalQuotationCodeNumericPart);

                        //vm.settings.documentNos.daily = parseInt(vm.settings.documentNos.daily);
                        //vm.settings.documentNos.monthly = parseInt(vm.settings.documentNos.monthly);
                        //vm.settings.documentNos.weekly = parseInt(vm.settings.documentNos.weekly);
                        //vm.settings.speedCommon.weekEndDay2.id = vm.settings.speedCommon.weekEndDay2;
                        //vm.settings.speedCommon.weekEndDay1.Id = vm.settings.speedCommon.weekEndDay1;
                        vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = parseInt(vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod);
                        vm.settings.speedCommon.specialBranchwithnoFinancialeffects = parseInt(vm.settings.speedCommon.specialBranchwithnoFinancialeffects);
                        vm.settings.speedCommon.whileDispatchingTripAllowOnlySelect = parseInt(vm.settings.speedCommon.whileDispatchingTripAllowOnlySelect);
                        vm.settings.speedCommon.ddaReceiptsPaymentMethod = parseInt(vm.settings.speedCommon.ddaReceiptsPaymentMethod);
                        vm.settings.paymentGateways.bookingPluginPaymentMethod = parseInt(vm.settings.paymentGateways.bookingPluginPaymentMethod);
                        vm.settings.paymentGateways.stripePrivateKey = vm.settings.paymentGateways.stripePrivateKey;
                        vm.settings.paymentGateways.stripePublicKey = vm.settings.paymentGateways.stripePublicKey;



                        if (vm.settings.requiredFieds.isAgeRequired) {
                            vm.isDateOfBirthRequired = 2;
                        }
                        else if (vm.settings.requiredFieds.isDateOfBirthRequired) {
                            vm.isDateOfBirthRequired = 1;
                        }

                    }).finally(function () {
                        vm.loading = false;
                        vm.getNotificationAdvanceSetting();
                    });



            };

            vm.getNotificationAdvanceSetting = function () {
                tenantSettingsService.getNotificationAdvanceSetting().success(function (data) {
                    vm.settings.speedNotification.emailCustomerExpiringDocuments = utilities.parseBoolean(angular.lowercase(data.filter(e => e.name === "CustomerExpiringDocuments")[0].value));
                    vm.settings.speedNotification.emailStaffExpiringDocuments = utilities.parseBoolean(angular.lowercase(data.filter(e => e.name === "EmployeeExpiringDocuments")[0].value));
                    vm.settings.speedNotification.emailBlackPointFines = utilities.parseBoolean(angular.lowercase(data.filter(e => e.name === "BlackPointsFines")[0].value));
                    vm.settings.speedNotification.emailExpiredSecurityDeposits = utilities.parseBoolean(angular.lowercase(data.filter(e => e.name === "ExpiredSecurityDeposits")[0].value));

                }).finally(function () {
                });
            };

            //function getGroup2CostCenters() {
            //    costCenterService.searchCostCenters({ includeInActive: false, group: 2 }).success(function (data) {
            //        vm.group2CostCenters = data.items;
            //    });
            //};
            //function getGroup1CostCenters() {
            //    costCenterService.searchCostCenters({ includeInActive: false, group: 1 }).success(function (data) {
            //        vm.group1CostCenters = data.items;
            //    });
            //};
            function getCostCenters() {
                costCenterService.searchCostCenters({ IncludeInActive: false }).success(function (response) {
                    vm.costCenters = response.items;

                    vm.costCentersGroup1 = vm.costCenters.filter(e => e.group != 2);
                    vm.costCentersGroup2 = vm.costCenters.filter(e => e.group == 2);
                });
            };
            // Getting All Salik Accounts

            function getAllSalikAccounts() {
                vm.loading = true;
                salikAccountService.getSalikAccounts({ id: 1 }).success(function (data) {

                    vm.salikAccounts = data;
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Getting All Darb Accounts

            function getAllDarbAccounts() {
                vm.loading = true;
                salikAccountService.getSalikAccounts({ id: 2 }).success(function (data) {

                    vm.salikAccounts = data;
                    vm.eDarbGridOptions.totalItems = data.totalCount;
                    vm.eDarbGridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Getting All Fuel Accounts

            function getAllFuelAccounts() {
                vm.loading = true;
                fuelAccountService.getAllForView().success(function (data) {
                    vm.eFuelGridOptions.totalItems = data.length;
                    vm.eFuelGridOptions.data = data;

                }).finally(function () {
                    vm.loading = false;
                });
            }

            //   Getting All Holidays

            function getAllHolidays() {

                vm.loading = true;
                holidayService.getHolidays().success(function (data) {

                    vm.holidays = data;
                    vm.gridOptionsHolidays.totalItems = data.totalCount;
                    vm.gridOptionsHolidays.data = data.items

                }).finally(function () {
                    vm.loading = false;
                });
            }

            //Getting All Trafffic Files

            function getAllTrafficFiles() {
                vm.loading = true;
                trafficFileService.getTrafficFiles().success(function (data) {
                    vm.gridOptionsTrafficFiles.totalItems = data.totalCount;
                    vm.gridOptionsTrafficFiles.data = data.items

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getReceiptsPaymentMethods() {
                vm.loading = true;
                vm.StipReceiptPaymentMethods = [];
                vm.DdaReceiptPaymentMethods = [];
                //1 for receitps
                var input = { Category: 1 }
                billingMethodService.getBillingMethodsWithCategory(input).success(function (data) {
                    var items = data.items;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].type === 2)
                            vm.StipReceiptPaymentMethods.push(items[i]);
                        if (vm.isDdaProcessAutomationEnabled) {
                            if (items[i].type === 5 || items[i].type === 6) {
                                vm.DdaReceiptPaymentMethods.push(items[i]);
                            }
                        }
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            //Adding setting services function

            //function getReceiptsPaymentMethods() {
            //    vm.loading = true;
            //    vm.StipReceiptPaymentMethods = [];
            //    vm.DdaReceiptPaymentMethods = [];
            //    vm.locationService = [];
            //    //1 for receitps
            //    var input = { Category: 1 }
            //    locationService.getlocation().success(function (data) {
            //        var items = data.items;

            //        }

            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}

            //getting Salik Accounts
            vm.getSalikAccounts = function () {
                getAllSalikAccounts();
            };

            vm.getAllDarbAccounts = function () {
                getAllDarbAccounts();
            };

            //get all fuel Account
            vm.getAllFuelAccounts = function () {
                getAllFuelAccounts();
            };

            //Getting All Traffic Files
            vm.getTrafficFiles = function () {
                getAllTrafficFiles();
            };

            // Getting All Holidays
            vm.getHolidays = function () {
                getAllHolidays();
            };

            vm.setActiveTabIndex = function (index) {
                vm.activeTabIndex = index;

                ////charges settings
                //if (index == 5) {
                //    vm.agreementType = {id: 1, name: 'Daily'};
                //}
            };

            vm.getExpenses = function () {
                expenseTypeService.getExpenseTypes().success(function (data) {
                    vm.expenseTypes = data.items;
                });
            };

            vm.getExpenseType = function (data) {

                return expenseTypeService.getExpenseTypeForEdit({ id: data }).then(function (response) {
                    vm.expenseType = response.data;
                });
            };
            vm.saveAll = function () {

                ValidatingSettings(vm.settings);
                if (vm.settings.speedCommon.tollsCutOffDate)
                    vm.settings.speedCommon.tollsCutOffDate = moment(vm.settings.speedCommon.tollsCutOffDate).startOf('day');
                if (!vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect)
                    vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect = 0;
                if (isValid) {
                    tenantSettingsService.updateAllSettings(
                        vm.settings
                    ).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };
            function validatingCommonSettings(settingDetail) {
                var weekEndDayValidate = {};
                errorMessage = '';
                errorMessage = 'Setting Can Not Be Updated Due To Following Issues: \n';

                if (isValid == false) {
                    isValid = true;
                }
                if (settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (settingDetail.speedCommon.weekEndDay2 == 0) {
                            weekEndDayValidate = 7;
                        }
                        else {
                            weekEndDayValidate = settingDetail.speedCommon.weekEndDay2;
                        }


                    }

                }

                if (settingDetail.speedCommon.weekEndDay1 == null || isNaN(settingDetail.speedCommon.weekEndDay1)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n WeekEnd Day1 Can Not Be Empty';

                }


                if (isValid == true && settingDetail.speedCommon.weekEndDay2 != -1 && settingDetail.speedCommon.weekEndDay2 != null) {
                    if (!isNaN(settingDetail.speedCommon.weekEndDay2)) {
                        if (weekEndDayValidate != (settingDetail.speedCommon.weekEndDay1 + 1)) {
                            isValid = false;
                            errorMessage = errorMessage + '\n WeekEnd Days Must Be Consecutive ';
                        }
                    }
                }

            }
            function validatingEmailSettings(settingDetail) {
                errorMessage = '';
                errorMessage = 'Setting Can Not Be Updated Due To Following Issues: \n';
                var errorFieldCount = 0;
                if (!settingDetail.email.defaultFromAddress) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.defaultFromDisplayName) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpHost) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpPort && settingDetail.email.smtpPort <= 0) {
                    errorFieldCount++;
                }
                if (!settingDetail.email.smtpUseDefaultCredentials) {
                    if (!settingDetail.email.smtpUserName) {
                        errorFieldCount++;
                    }
                    if (!settingDetail.email.smtpPassword) {
                        errorFieldCount++;
                    }
                }

                if (errorFieldCount == 0) {
                    //valid for saving
                }
                else if (!settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 6) {
                    //skip email info saving
                }
                else if (settingDetail.email.smtpUseDefaultCredentials && errorFieldCount == 4) {
                    //skip email info saving
                }
                else {
                    isValid = false;
                    errorMessage = errorMessage + '\nEmail information is incomplete';
                }
            }
            vm.saveCommonSettings = function () {
                vm.saving = true;
                console.log(vm.filters.chargesType);
                validatingCommonSettings(vm.settings);
                if (vm.settings.speedCommon.invoicingStartDate)
                    vm.settings.speedCommon.invoicingStartDate = moment(vm.settings.speedCommon.invoicingStartDate).startOf('day');

                if (vm.filters.accountsList)
                    vm.settings.speedCommon.account = angular.toJson(vm.filters.accountsList);
                else
                    vm.settings.speedCommon.account = "";
                if (vm.filters.chargesType)
                    vm.settings.speedCommon.chargesType = angular.toJson(vm.filters.chargesType);
                else
                    vm.settings.speedCommon.chargesType = "";
                if (vm.filters.showSelectedJobTypes)
                    vm.settings.speedCommon.showSelectedJobTypes = angular.toJson(vm.filters.showSelectedJobTypes);
                else
                    vm.settings.speedCommon.showSelectedJobTypes = "";

                if (vm.islinkCrsToWorkShopEnabled && vm.islinkWorkShopToCrsTenantNameHasValue && vm.branchSuppliersLinkings) {
                    var branchSuppliersLinkingsTemp = vm.branchSuppliersLinkings.map(e => {
                        return {
                            branchId: e.branchId,
                            branchName: e.branchName,
                            supplierId: e.supplier ? e.supplier.id : null,
                            supplierName: e.supplier ? e.supplier.name : null
                        };
                    });

                    vm.settings.speedCommon.tenantLinkedSuppliers = JSON.stringify(branchSuppliersLinkingsTemp);
                }


                if (isValid) {
                    vm.loading = true;
                    if (!vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod)
                        vm.settings.speedCommon.prepaidCouponCreditCardReceiptMethod = 0;
                    if (!vm.settings.speedCommon.specialBranchwithnoFinancialeffects)
                        vm.settings.speedCommon.specialBranchwithnoFinancialeffects = 0;
                    tenantSettingsService.updateCommonSettings(
                        vm.settings.speedCommon

                    ).success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };

            vm.saveNotificationSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateNotificationSettings(
                    vm.settings.speedNotification
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                    abp.message.info(app.localize(errorMessage));
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.savePaymentGatewaysSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updatePaymentGatewaysSettings(
                    vm.settings.paymentGateways
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                    abp.message.info(app.localize(errorMessage));
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.saveDocumentNosSettings = function () {
                vm.saving = true;
                vm.loading = true;
                tenantSettingsService.updateDocumentNosSettings(
                    vm.settings.documentNos
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.saveLimousineSettings = function () {
                vm.loading = true;
                vm.saving = true;
                if (!vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect)
                    vm.settings.limousine.trip_WhileDispatchingTripAllowOnlySelect = 0;
                tenantSettingsService.updateLimousineSettings(
                    vm.settings.limousine
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.saveEquipmentSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateEquipmentSettings(
                    vm.settings.equipment
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.saveCostCenterSettings = function () {
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateCostCenterSettings(
                    vm.settings.costCenter
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveRequiredFieldSettings = function () {
                vm.loading = true;
                vm.saving = true;

                tenantSettingsService.updateRequiredFieldsSettings(
                    vm.settings.requiredFieds
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveUserSettings = function () {
                vm.saving = true;
                vm.loading = true;
                tenantSettingsService.updateUserSettings(
                    vm.settings.userManagement
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveSalikSettings = function () {
                if (vm.settings.salik.tollsCutOffDate)
                    vm.settings.salik.tollsCutOffDate = moment(vm.settings.salik.tollsCutOffDate).startOf('day');
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateSalikSettings(
                    vm.settings.salik
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveFuelSettings = function () {
                debugger;
                vm.saving = true;
                vm.loading = true;
                tenantSettingsService.updateFuelSettings(
                    vm.settings.fuel
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveDarbSettings = function () {
                if (vm.settings.darb.tollsCutOffDate)
                    vm.settings.darb.tollsCutOffDate = moment(vm.settings.darb.tollsCutOffDate).startOf('day');
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateDarbSettings(
                    vm.settings.darb
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveFineSettings = function () {
                if (vm.settings.fine.trafficFineCutOffDate)
                    vm.settings.fine.trafficFineCutOffDate = moment(vm.settings.fine.trafficFineCutOffDate).startOf('day');
                vm.loading = true;
                vm.saving = true;
                tenantSettingsService.updateFineSettings(
                    vm.settings.fine
                ).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).error(function (error) {
                    vm.loading = false;
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.saveEmailSettings = function () {
                validatingEmailSettings(vm.settings);

                if (isValid) {
                    vm.loading = true;
                    vm.saving = true;
                    tenantSettingsService.updateEmailSettings(
                        vm.settings.email
                    ).success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };

            // Create AndEdit Model For SalikAccount
            function openCreateOrEditSalikAccountModal(salikAccount, salikOrDarbAccount) {
                debugger;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditSalikAccountModal.cshtml',
                    controller: 'tenant.views.locations.createOrEditSalikAccountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        salikAccount: function () {
                            return salikAccount;
                        },
                        salikOrDarbAccount: salikOrDarbAccount
                    }
                });

                modalInstance.result.then(function (result) {
                    if (salikOrDarbAccount === 1) {
                        vm.getSalikAccounts();
                    }
                    if (salikOrDarbAccount === 2) {
                        vm.getAllDarbAccounts();
                    }
                });
            }

            // Create AndEdit Model For FuelAccount
            function openCreateOrEditFuelAccountModal(fuelAccount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditFuelAccountModal.cshtml',
                    controller: 'tenant.views.locations.createOrEditFuelAccountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        id: function () {
                            return fuelAccount ? fuelAccount.id : null;
                        },
                        viewMode: function () {
                            return fuelAccount ? fuelAccount.showMode : false;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    getAllFuelAccounts();
                });
            }


            // Create And Edit Model For Traffic Files
            function openCreateOrEditTrafficFileModal(trafficFile) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditTrafficFileModal.cshtml',
                    controller: 'tenant.views.common.settings.createOrEditTrafficFileModal as vm',
                    backdrop: 'static',
                    resolve: {
                        trafficFile: function () {
                            return trafficFile;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getTrafficFiles();
                });
            }

            // Create Or Edit Holidays

            function openCreateOrEditHolidayModal(holiday) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/createOrEditHolidayModal.cshtml',
                    controller: 'tenant.views.common.settings.createOrEditHolidayModal as vm',
                    backdrop: 'static',
                    resolve: {
                        holiday: function () {
                            return holiday;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getHolidays();
                });
            }

            // ViewHolidayModal

            function openViewHolidayModal(holiday) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/settings/viewHoliday.cshtml',
                    controller: 'tenant.views.common.settings.createOrEditHolidayModal as vm',
                    backdrop: 'static',
                    resolve: {
                        holiday: function () {
                            return holiday;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getHolidays();
                });
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getServerName = function (serverId) {
                if (serverId == 1) {
                    return 'Dubai';
                }
                if (serverId == 2) {
                    return 'Abu Dhabi';
                }
            };

            vm.getType = function (typeId) {
                if (typeId == 1) {
                    return 'ENOC';
                }
                if (typeId == 2) {
                    return 'ADNOC';
                }
            }

            vm.DOBradioButtonValueChanged = function () {

                if (vm.isDateOfBirthRequired == 1) {
                    vm.settings.requiredFieds.isAgeRequired = false;
                    vm.settings.requiredFieds.isDateOfBirthRequired = true;
                }
                else if (vm.isDateOfBirthRequired == 2) {
                    vm.settings.requiredFieds.isDateOfBirthRequired = false;
                    vm.settings.requiredFieds.isAgeRequired = true;
                }
            };

            vm.eDarbGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewSalikAccount(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSalikAccount(row.entity, 2)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete"    ng-click="grid.appScope.deleteSalikAccount(row.entity, 2)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('ID'),
                    //    field: 'id'
                    //},
                    {
                        name: app.localize('Authority'),
                        field: 'server',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getServerName(row.entity.server)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('UserName'),
                        field: 'userName',

                    },
                    {
                        name: app.localize('lastDownloadDate'),
                        field: 'lastDownloadDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastDownloadDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        maxWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    }
                ],

                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = null;
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getSalikAccounts();
                //    });

                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getSalikAccounts();
                //    });
                //},
                data: []
            };



            // Grid for fuel

            vm.eFuelGridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewFuelAccount(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isFuelEditPermission" ng-click="grid.appScope.editFuelAccount(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //   '      <li><a ng-if="grid.appScope.permissions.delete"    ng-click="grid.appScope.deleteSalikAccount(row.entity, 2)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('ID'),
                    //    field: 'id'
                    //},
                    {
                        name: app.localize('Type'),
                        field: 'type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getType(row.entity.type)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('UserName'),
                        field: 'username',

                    },
                    {
                        name: app.localize('lastDownloadDate'),
                        field: 'lastDownloadDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastDownloadDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        maxWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    }
                ],
                data: []
            };


            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{\'text-muted\': !row.entity.isActive }"  ui-grid-cell></div>',
                columnDefs: [
                    {

                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewSalikAccount(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSalikAccount(row.entity, 1)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete"    ng-click="grid.appScope.deleteSalikAccount(row.entity, 1)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('ID'),
                    //    field: 'id'
                    //},
                    {
                        name: app.localize('Authority'),
                        field: 'server',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getServerName(row.entity.server)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('UserName'),
                        field: 'userName',

                    },
                    {
                        name: app.localize('lastDownloadDate'),
                        field: 'lastDownloadDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.lastDownloadDate)}}</div>' +
                            '</div>'
                    },
                    {
                        headerCellTemplate: '<div class=\"ui-grid-cell\" style="margin-top:3px; margin-left:3px;">' +
                            '<span class\"ui-grid-cell-contents\">Is RTA</span>' +
                            '</div>',
                        field: 'isRtaAccount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span class="label label-success"\"ui-grid-cell-contents\" style="margin-left:4px;" >{{row.entity.isRtaAccount}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Active'),
                        field: 'isActive',
                        maxWidth: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <span ng-show="row.entity.isActive" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '  <span ng-show="!row.entity.isActive" class="label label-default">' + app.localize('No') + '</span>' +
                            '</div>'
                    }
                ],

                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = null;
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getSalikAccounts();
                //    });

                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getSalikAccounts();
                //    });
                //},
                data: []
            };

            //  Grid For Traffic Files 

            vm.gridOptionsTrafficFiles = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {

                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewTrafficFile(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.editTrafficFile(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteTrafficFile(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('ID'),
                    //    field: 'id'
                    //},
                    {
                        name: app.localize('FileId'),
                        type: 'number',
                        field: 'fileId',

                    },
                    {
                        name: app.localize('State'),
                        field: 'state'

                    }
                    ,
                    {
                        name: app.localize('rta Username'),
                        field: 'rtaUsername'

                    },

                ],

                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = null;
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getSalikAccounts();
                //    });

                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getSalikAccounts();
                //    });
                //},
                data: []
            };


            //  Grid For Holidays ...



            vm.gridOptionsHolidays = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {

                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.editHoliday(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteHoliday(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '<li><a ng-click="grid.appScope.viewHoliday(row.entity)">' + app.localize('View') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('ID'),
                    //    field: 'id'
                    //},
                    {
                        name: app.localize('Name'),
                        field: 'name',

                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },




                ],

                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = null;
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getSalikAccounts();
                //    });

                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getSalikAccounts();
                //    });
                //},
                data: []
            };

            //SalikAccount Tab Handling
            vm.createSalikAccount = function (salikOrDarbAccount) {
                var salikAccount = {};
                salikAccount.showMode = false;
                openCreateOrEditSalikAccountModal(salikAccount, salikOrDarbAccount);

            };


            vm.searchAccounts = function ($select) {
                if ($select.search == "") { vm.accounts = null; return null; }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // Updating SalikAccount
            vm.editSalikAccount = function (salikAccount, salikOrDarbAccount) {
                salikAccount.showMode = false;
                openCreateOrEditSalikAccountModal(salikAccount, salikOrDarbAccount);
            };

            //Deleting Salik Account
            vm.deleteSalikAccount = function (salikAccount, salikOrDarbAccount) {
                abp.message.confirm(
                    app.localize('DeleteSalikAccounts', salikAccount.id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            salikAccountService.deleteSalikAccount({
                                id: salikAccount.id
                            }).success(function () {
                                if (salikOrDarbAccount === 1)
                                    vm.getSalikAccounts();
                                if (salikOrDarbAccount === 2)
                                    vm.getAllDarbAccounts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            // Viewing Salik Accounts

            vm.viewSalikAccount = function (salikAccount) {
                salikAccount.showMode = true;
                openCreateOrEditSalikAccountModal(salikAccount);
            };



            // Fuel accounts

            //FuelAccount Tab Handling
            vm.createFuelAccount = function () {
                openCreateOrEditFuelAccountModal();

            };


            vm.searchAccounts = function ($select) {
                if ($select.search == "") { vm.accounts = null; return null; }
                //,isLeaf:true
                return accountService.searchAccountsForSubLookUp({ filter: $select.search, isLeaf: true }).then(function (response) {
                    vm.accounts = response.data.items;
                });
            };

            // Updating FuelAccount
            vm.editFuelAccount = function (fuelAccount) {
                fuelAccount.showMode = false;
                openCreateOrEditFuelAccountModal(fuelAccount);
            };


            vm.viewFuelAccount = function (fuelAccount) {
                fuelAccount.showMode = true;
                openCreateOrEditFuelAccountModal(fuelAccount);
            };



            // Traffic Files Portion

            // Creating Traffic File

            vm.createTrafficFiles = function () {
                var trafficFile = {};
                trafficFile.showModeTraffic = false;
                openCreateOrEditTrafficFileModal(trafficFile);

            };

            // Updating TrafficFile

            vm.editTrafficFile = function (trafficFile) {
                trafficFile.showModeTraffic = false;
                openCreateOrEditTrafficFileModal(trafficFile);
            };

            // Deleting TrafficFile

            vm.deleteTrafficFile = function (trafficFile) {
                abp.message.confirm(
                    app.localize('ReceiptDeleteWarningMessage', trafficFile.id),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            trafficFileService.deleteTrafficFile({
                                id: trafficFile.id
                            }).success(function () {
                                vm.getTrafficFiles();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            }

            // Viewing Traffic File

            vm.viewTrafficFile = function (trafficFile) {
                trafficFile.showModeTraffic = true;
                openCreateOrEditTrafficFileModal(trafficFile);
            };

            // / charges setting tab relevant code....
            //-------------------------------------------------//
            function getChargesSettings() {

                //if (angular.isUndefined(vm.agreementType)) return;
                vm.loading = true;
                chargesSettingService.getChargesSettings({ module: vm.enabledModule }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getAllChargesSettings() {

                //if (angular.isUndefined(vm.agreementType)) return;
                vm.loading = true;
                chargesSettingService.getChargesTypes().success(function (data) {
                    vm.allChargesSettings = data;
                    console.log(vm.allChargesSettings);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //function getAgreementDocuments() {
            //    debugger;
            //    vm.loading = true;
            //    agreementService.getAgreementDocuments().success(function (data) {
            //        vm.agreementDocuments = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            function getChargesTypesUpdated() {
                vm.loading = true;
                chargesSettingService.getChargesTypes().success(function (data) {
                    vm.chargesTypesUpdated = data.filter(e => e.id != 21 && e.id != 22);
                    angular.forEach(vm.chargesTypesUpdated, function (value, key) {
                        value.key = value.name;
                        value.name = app.localize(value.name);
                        if (value.detail != null) value.name = value.name + ' (' + value.detail + ')';
                    });

                }).finally(function () {
                    vm.loading = false;
                });
            }

            function getRateTypesUpdated() {
                vm.loading = true;
                chargesSettingService.getRateTypes().success(function (data) {
                    vm.rateTypesUpdated = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }


            vm.searchRateTypes = function ($select) {
                vm.searchResults = [];
                if ($select.search == "") {
                    return;
                }
                for (var i = 0; i < vm.rateTypes.length; i++) {
                    if (vm.rateTypes[i].name.toUpperCase().startsWith($select.search.toUpperCase()))
                        vm.searchResults.push(vm.rateTypes[i]);
                }
            };


            vm.moduleChanged = function () {
                getChargesSettings();
            };


            vm.addChargesSettingRowUpdated = function () {
                var row = new Object();
                row.id = null;
                row.chargesTypeId = null;
                row.applyOnClosing = false;
                row.isMandatory = false;
                row.isStatic = false;
                row.rateTypeId = null;
                row.taxable = false;
                row.module = vm.enabledModule;
                row.order = vm.chargesSettings.length < 1 ? 1 : vm.chargesSettings[vm.chargesSettings.length - 1].order + 1;
                vm.chargesSettings.push(row);
            };

            vm.removeChargesSettingRowUpdated = function (item) {
                debugger;
                var index = vm.chargesSettings.indexOf(item);
                vm.chargesSettings.splice(index, 1);
            };

            vm.sortOfSettingsChanged = function (event, ui) {
                //  vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var setting = obj.setting;
                //var milestone = project.milestones[obj.milestoneIndex];
                //var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    //setting.priority = (milestone.tasks[0].priority) / 2;
                    setting.order = (vm.chargesSettings[0].order) / 2;
                    var element = setting;
                    vm.chargesSettings.splice(obj.settingIndex, 1);
                    vm.chargesSettings.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (vm.chargesSettings.length - 1)) {
                    setting.order = (vm.chargesSettings[updatedIndex].order + vm.chargesSettings[updatedIndex].order + 1) / 2;
                    var element = setting;
                    vm.chargesSettings.splice(obj.settingIndex, 1);
                    vm.chargesSettings.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.settingIndex)
                        setting.order = (vm.chargesSettings[updatedIndex + 1].order + vm.chargesSettings[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.settingIndex)
                        setting.order = (vm.chargesSettings[updatedIndex - 1].order + vm.chargesSettings[updatedIndex].order) / 2;
                    var element = setting;
                    vm.chargesSettings.splice(obj.settingIndex, 1);
                    vm.chargesSettings.splice(updatedIndex, 0, element);
                }

                //projectTaskService.updateProjectTaskPriority(task).success(function () {

                //}).finally(function () {
                //    vm.loading = false;
                //});

                $scope.$apply();
            };

            vm.addAgreementDcoumentsRowUpdated = function () {
                var row = new Object();
                row.agreementId = null;
                row.agreementName = "";
                row.isRequired = false;
                row.order = vm.settings.agreementDocument.agreementDocuments.length < 1 ? 1 : vm.settings.agreementDocument.agreementDocuments[vm.settings.agreementDocument.agreementDocuments.length - 1].order + 1;
                vm.settings.agreementDocument.agreementDocuments.push(row);
            };

            vm.removeAgreementDocumentsRowUpdated = function (item) {
                var index = vm.settings.agreementDocument.agreementDocuments.indexOf(item);
                vm.settings.agreementDocument.agreementDocuments.splice(index, 1);
            };

            vm.addAdvanceSettingDcoumentsRowUpdated = function () {
                var row = new Object();
                row.id = null;
                row.isRequired = false;
                row.order = vm.settings.formsAndFields.documentType.length < 1 ? 1 : vm.settings.formsAndFields.documentType[vm.settings.formsAndFields.documentType.length - 1].order + 1;
                vm.settings.formsAndFields.documentType.push(row);
                vm.isinvalidFormsAndFieldsTableFunc();
            };

            vm.removeAdvanceSettingDcoumentsRowUpdated = function (item) {
                var index = vm.settings.formsAndFields.documentType.indexOf(item);
                vm.settings.formsAndFields.documentType.splice(index, 1);
                vm.isinvalidFormsAndFieldsTableFunc();
            };

            vm.advanceSettingDcoumentsRowChanged = function (item) {

                var docs = $filter('filter')(vm.settings.formsAndFields.documentType, {
                    identityDocumentType: item.identityDocumentType
                }, true);

                if (docs.length > 1) {
                    //item =
                    //    {
                    //        documentNo: "",
                    //        identityDocumentType: null,
                    //        issuedBy: "",
                    //        issueDate: null,
                    //        expiryDate: null,
                    //        images: []
                    //    };
                    item.identityDocumentType = null;
                    abp.notify.warn(app.localize('AlreadyExist'));
                }
                vm.isinvalidFormsAndFieldsTableFunc();
            };

            vm.isinvalidFormsAndFieldsTableFunc = function () {
                if (!vm.settings.formsAndFields.documentType) return;
                var invalid = false;

                angular.forEach(vm.settings.formsAndFields.documentType, function (value) {
                    if (!value.identityDocumentType) {
                        invalid = true;
                        return;
                    }
                });

                vm.isinvalidFormsAndFieldsTable = invalid;
            };

            vm.sortOfFormsAndFieldsDocuments = function (event, ui) {
                //  vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var setting = obj.setting;
                //var milestone = project.milestones[obj.milestoneIndex];
                //var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    //setting.priority = (milestone.tasks[0].priority) / 2;
                    setting.order = (vm.settings.formsAndFields.documentType[0].order) / 2;
                    var element = setting;
                    vm.settings.formsAndFields.documentType.splice(obj.settingIndex, 1);
                    vm.settings.formsAndFields.documentType.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (vm.settings.formsAndFields.documentType.length - 1)) {
                    setting.order = (vm.settings.formsAndFields.documentType[updatedIndex].order + vm.settings.formsAndFields.documentType[updatedIndex].order + 1) / 2;
                    var element = setting;
                    vm.settings.formsAndFields.documentType.splice(obj.settingIndex, 1);
                    vm.settings.formsAndFields.documentType.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.settingIndex)
                        setting.order = (vm.settings.formsAndFields.documentType[updatedIndex + 1].order + vm.settings.formsAndFields.documentType[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.settingIndex)
                        setting.order = (vm.settings.formsAndFields.documentType[updatedIndex - 1].order + vm.settings.formsAndFields.documentType[updatedIndex].order) / 2;
                    var element = setting;
                    vm.settings.formsAndFields.documentType.splice(obj.settingIndex, 1);
                    vm.settings.formsAndFields.documentType.splice(updatedIndex, 0, element);
                }

                //projectTaskService.updateProjectTaskPriority(task).success(function () {

                //}).finally(function () {
                //    vm.loading = false;
                //});

                $scope.$apply();
                vm.isinvalidFormsAndFieldsTableFunc();

            };

            vm.sortOfAgreementDocuments = function (event, ui) {
                //  vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var setting = obj.setting;
                //var milestone = project.milestones[obj.milestoneIndex];
                //var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex === 0) {
                    //setting.priority = (milestone.tasks[0].priority) / 2;
                    setting.order = (vm.settings.agreementDocument.agreementDocuments[0].order) / 2;
                    let element = setting;
                    vm.settings.agreementDocument.agreementDocuments.splice(obj.settingIndex, 1);
                    vm.settings.agreementDocument.agreementDocuments.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (vm.settings.agreementDocument.agreementDocuments.length - 1)) {
                    setting.order = (vm.settings.agreementDocument.agreementDocuments[updatedIndex].order + vm.settings.agreementDocument.agreementDocuments[updatedIndex].order + 1) / 2;
                    let element = setting;
                    vm.settings.agreementDocument.agreementDocuments.splice(obj.settingIndex, 1);
                    vm.settings.agreementDocument.agreementDocuments.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.settingIndex)
                        setting.order = (vm.settings.agreementDocument.agreementDocuments[updatedIndex + 1].order + vm.settings.agreementDocument.agreementDocuments[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.settingIndex)
                        setting.order = (vm.settings.agreementDocument.agreementDocuments[updatedIndex - 1].order + vm.settings.agreementDocument.agreementDocuments[updatedIndex].order) / 2;
                    let element = setting;
                    vm.settings.agreementDocument.agreementDocuments.splice(obj.settingIndex, 1);
                    vm.settings.agreementDocument.agreementDocuments.splice(updatedIndex, 0, element);
                }

                //projectTaskService.updateProjectTaskPriority(task).success(function () {

                //}).finally(function () {
                //    vm.loading = false;
                //});

                $scope.$apply();
            };

            vm.addDocumentApprovalRow = function () {
                var row = new Object();
                row.fromValue = null;
                row.toValue = null;
                row.levelName = "";
                row.userId = null;
                row.user = null;
                row.order = vm.settings.documentApproval.documentApprovals.length < 1 ? 1 : vm.settings.documentApproval.documentApprovals[vm.settings.documentApproval.documentApprovals.length - 1].order + 1;
                vm.settings.documentApproval.documentApprovals.push(row);
            };

            vm.removeDocumentApprovalsRow = function (item) {
                var index = vm.settings.documentApproval.documentApprovals.indexOf(item);
                vm.settings.documentApproval.documentApprovals.splice(index, 1);

            };

            vm.sortOfDocumentApprovals = function (event, ui) {
                var currentList = null;

                currentList = vm.settings.documentApproval.documentApprovals;


                //  vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var setting = obj.setting;

                //var milestone = project.milestones[obj.milestoneIndex];
                //var task = milestone.tasks[obj.taskIndex];

                if (updatedIndex == 0) {
                    //setting.priority = (milestone.tasks[0].priority) / 2;
                    setting.order = (currentList[0].order) / 2;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (currentList.length - 1)) {
                    setting.order = (currentList[updatedIndex].order + currentList[updatedIndex].order + 1) / 2;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.settingIndex)
                        setting.order = (currentList[updatedIndex + 1].order + currentList[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.settingIndex)
                        setting.order = (currentList[updatedIndex - 1].order + currentList[updatedIndex].order) / 2;
                    var element = setting;
                    currentList.splice(obj.settingIndex, 1);
                    currentList.splice(updatedIndex, 0, element);
                }

                //projectTaskService.updateProjectTaskPriority(task).success(function () {

                //}).finally(function () {
                //    vm.loading = false;
                //});

                $scope.$apply();
            };

            vm.voucherTypeChanged = function () {
                vm.loading = true;
                vm.saving = true;

                vm.settings.documentApproval = { documentApprovals: null };

                tenantSettingsService.getVoucherApprovalSetting({ voucherType: vm.voucherTypeInApproval, VoucherSubTypeId: vm.voucherSubTypeInApproval })
                    .success(function (data) {
                        if (data.documentApprovals)
                            vm.settings.documentApproval.documentApprovals = JSON.parse(data.documentApprovals);

                        else
                            vm.settings.documentApproval.documentApprovals = [];

                    }).finally(function () { vm.loading = false; vm.saving = false });
            };

            function advanceSettingAdditionalFieldsCompanyDesgination() {
                if (vm.documentType !== "AdvanceSettings.FormAndFields.CompanyCustomer") return null;
                var mandatoryDesignations = [];
                designationService.getDesignations()
                    .success(function (data) {
                        mandatoryDesignations = data.items;

                        vm.settings.formsAndFields.mandatoryDesignations = [];
                        //mapping mondatory fields
                        if (vm.mandatoryDesignations && vm.mandatoryDesignations.length > 0) {
                            angular.forEach(mandatoryDesignations, function (value) {
                                let field = vm.mandatoryDesignations.filter(e => e.name === value.name)[0];
                                if (field) {
                                    value.isRequired = field.isRequired;
                                    value.isDisabled = field.isDisabled;
                                }
                                vm.settings.formsAndFields.mandatoryDesignations.push(value);
                            });
                        } else {
                            vm.settings.formsAndFields.mandatoryDesignations = mandatoryDesignations;
                        }

                    }).finally(function () {
                        //vm.loading = false; vm.saving = false
                    });
            };
            vm.formNfieldsAdditionalFieldChanged = function (row) {
                if (vm.settings.formsAndFields.additionalFields && vm.settings.formsAndFields.mondatoryFields) {
                    var mandatoryField = vm.settings.formsAndFields.mondatoryFields.find(e => e.name == row.name);
                    if (mandatoryField) {
                        mandatoryField.isDisabled = !row.isEnabled;
                        mandatoryField.isRequired = mandatoryField.isDisabled ? false : mandatoryField.isRequired;
                    }
                }
            };

            vm.documentTypeChanged = function () {
                vm.loading = true;
                vm.saving = true;
                vm.settings.formsAndFields = {
                    documentType: []
                };
                vm.mondatoryFields = [];
                vm.additionalFields = [];
                vm.otherFields = [];

                var advanceSettingEnums = null;
                var mondatoryFields = null;
                var additionalFields = null;
                var otherFields = null;

                if (vm.documentType === "AdvanceSettings.FormAndFields.IndividualCustomer") {
                    advanceSettingEnums = utilities.advanceSettingEnumsIndCustomer();
                    mondatoryFields = utilities.advanceSettingMondatoryFieldsIndCustomer();
                    additionalFields = utilities.advanceSettingAdditionalFieldsIndCustomer();
                    otherFields = utilities.otherFieldsForIndCustomer();
                }
                else if (vm.documentType === "AdvanceSettings.FormAndFields.CompanyCustomer") {
                    advanceSettingEnums = utilities.advanceSettingEnumscompanyCustomer();
                    mondatoryFields = utilities.advanceSettingMondatoryFieldscompanyCustomer();
                    additionalFields = utilities.advanceSettingAdditionalFieldscompanyCustomer();
                    otherFields = utilities.otherFieldsForCompanyCustomer();
                }
                else if (vm.documentType === "AdvanceSettings.FormAndFields.CompanyDriver") {
                    advanceSettingEnums = utilities.advanceSettingEnumsDriverCustomer();
                    mondatoryFields = utilities.advanceSettingMondatoryFieldscompanyDriver();
                    additionalFields = utilities.advanceSettingAdditionalFieldsCompanyDrivers();
                    otherFields = [];
                }
                else if (vm.documentType === "AdvanceSettings.FormAndFields.Vehicle") {
                    advanceSettingEnums = [];
                    mondatoryFields = utilities.advanceSettingMondatoryFieldsVehicle();
                    additionalFields = utilities.advanceSettingAdditionalFieldsVehicles();
                    otherFields = [];
                }
                else if (vm.documentType === "AdvanceSettings.FormAndFields.Job") {
                    advanceSettingEnums = [];
                    additionalFields = utilities.advanceSettingAdditionalFieldsJob();
                }


                vm.documentTypesName = advanceSettingEnums;

                tenantSettingsService.getDocumentSetting(vm.documentType)
                    .success(function (data) {
                        if (data.name) {
                            if (data.documents)
                                vm.settings.formsAndFields.documentType = data.documents;
                            else
                                vm.settings.formsAndFields.documentType = advanceSettingEnums;

                            vm.mondatoryFields = data.mondatoryFields;
                            vm.additionalFields = data.additionalFields;
                            vm.mandatoryDesignations = data.mandatoryDesignations;
                            vm.otherFields = data.otherFields;
                        }
                        else {
                            vm.settings.formsAndFields.documentType = advanceSettingEnums;
                        }

                        advanceSettingAdditionalFieldsCompanyDesgination();

                        vm.settings.formsAndFields.mondatoryFields = [];
                        //mapping mondatory fields
                        if (vm.mondatoryFields.length > 0) {
                            angular.forEach(mondatoryFields, function (value) {
                                let field = vm.mondatoryFields.filter(e => e.name === value.name)[0];
                                if (field) {
                                    value.isRequired = field.isRequired;
                                    value.isDisabled = field.isDisabled;
                                }
                                vm.settings.formsAndFields.mondatoryFields.push(value);
                            });
                        } else {
                            vm.settings.formsAndFields.mondatoryFields = mondatoryFields;
                        }

                        vm.settings.formsAndFields.additionalFields = [];
                        debugger;
                        //mapping additional Feilds
                        if (vm.additionalFields.length > 0) {
                            angular.forEach(additionalFields, function (value) {
                                let field = vm.additionalFields.filter(e => e.name === value.name)[0];
                                if (field) {
                                    value.isEnabled = field.isEnabled;
                                    value.isSettingDisabled = field.isSettingDisabled;
                                    value.value = field.value;
                                }
                                vm.settings.formsAndFields.additionalFields.push(value);

                                if (vm.mondatoryFields && vm.mondatoryFields.length) {
                                    var mandatoryField = vm.settings.formsAndFields.mondatoryFields.find(e => e.name == value.name);
                                    if (mandatoryField) {
                                        mandatoryField.isDisabled = !value.isEnabled;
                                        mandatoryField.isRequired = mandatoryField.isDisabled ? false : mandatoryField.isRequired;
                                    }
                                }
                            });
                        } else {
                            vm.settings.formsAndFields.additionalFields = additionalFields;
                        }

                        vm.settings.formsAndFields.otherFields = [];
                        //mapping other Feilds
                        if (vm.otherFields && vm.otherFields.length > 0) {
                            angular.forEach(otherFields, function (value) {
                                let field = vm.otherFields.filter(e => e.name === value.name)[0];
                                if (field) {
                                    value.isEnabled = field.isEnabled;
                                }
                                vm.settings.formsAndFields.otherFields.push(value);
                            });
                        } else {
                            vm.settings.formsAndFields.otherFields = otherFields;
                        }

                        vm.isinvalidFormsAndFieldsTableFunc();
                    }).finally(function () {
                        vm.loading = false;
                        vm.saving = false;
                    });
            };

            vm.localize = function (value) {
                return app.localize(value);
            };

            vm.saveAdvanceSettingDocumentsSettings = function () {
                if (isValid) {
                    vm.loading = true;
                    vm.saving = true;

                    let advanceSetting = {
                        name: vm.documentType,
                        documents: vm.settings.formsAndFields.documentType,
                        additionalFields: vm.settings.formsAndFields.additionalFields,
                        mondatoryFields: vm.settings.formsAndFields.mondatoryFields,
                        mandatoryDesignations: vm.settings.formsAndFields.mandatoryDesignations,
                        otherFields: vm.settings.formsAndFields.otherFields
                    };

                    tenantSettingsService.updateAdvanceSettings(advanceSetting)
                        .success(function () {
                            vm.loading = false;
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        }).error(function (error) {
                            vm.loading = false;
                        }).finally(function () {
                            vm.saving = false;
                        });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };

            vm.addChargesSettingRowRental = function () {
                var row = new Object();
                row.id = null;
                row.chargesTypeId = null;
                row.applyOnClosing = false;
                row.isMandatory = false;
                row.isStatic = false;
                row.rateTypes = [];
                row.agreementCategory = 1,
                    vm.chargesSettingsRental.push(row);
            };

            vm.addChargesSettingRowLease = function () {
                var row = new Object();
                row.id = null;
                row.chargesTypeId = null;
                row.applyOnClosing = false;
                row.isMandatory = false;
                row.isStatic = false;
                row.rateTypes = [];
                row.agreementCategory = 2,
                    vm.chargesSettingLease.push(row);
            };

            vm.removeChargesSettingRowRental = function (item) {
                var index = vm.chargesSettingsRental.indexOf(item);
                vm.chargesSettingsRental.splice(index, 1);
            };

            vm.removeChargesSettingRowLease = function (item) {
                var index = vm.chargesSettingLease.indexOf(item);
                vm.chargesSettingLease.splice(index, 1);
            };

            vm.cancelChargesSettings = function () {
                vm.agreementTypeChanged();
            };

            vm.saveChargesSettingsUpdate = function () {
                if (vm.enabledModule == 3) {
                    vm.chargesSettings.forEach(e => {
                        e.rateTypeId = 6;
                    });
                }
                if (vm.chargesSettings.some(e => !e.chargesTypeId || (vm.enabledModule != 3 && !e.rateTypeId))) {
                    abp.message.info("Define settings Properly");
                    return;
                }
                vm.saving = true;
                vm.loading = true;
                chargesSettingService.updateChargesSettings({ chargesSettings: vm.chargesSettings }).success(function () {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getChargesSettings();
                    //$uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                    vm.loading = false;
                });
            };
            //vm.saveAgreementDocumentsUpdate = function () {
            //    debugger;
            //    //if (vm.agreementDocuments.some(e => !e.agreementId)) {
            //    //    abp.message.info("Define agreementDocuments Properly");
            //    //    return;
            //    //}
            //    vm.saving = true;
            //    vm.loading = true;
            //    tenantSettingsService.addAgreementDocument({ agreementDocuments: vm.agreementDocuments }).success(function () {
            //        vm.loading = false;
            //        abp.notify.info(app.localize('SavedSuccessfully'));
            //        getAgreementDocuments();
            //        //$uibModalInstance.close();
            //    }).finally(function () {
            //        vm.saving = false;
            //        vm.loading = false;
            //    });
            //};
            vm.saveAgreementDocumentsSettings = function () {
                debugger;
                if (isValid) {
                    vm.loading = true;
                    vm.saving = true;
                    var JsonString = JSON.stringify(vm.settings.agreementDocument.agreementDocuments);
                    tenantSettingsService.updateAgreementDocumentsSettings(
                        { agreementDocuments: JsonString }
                    ).success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };

            vm.saveDocumentApprovalsSettings = function () {
                if (isValid) {
                    vm.loading = true;
                    vm.saving = true;

                    var voucherApprovalObject = {
                        voucherApprovalSettingString: JSON.stringify(vm.settings.documentApproval.documentApprovals),
                        voucherType: 34,
                        VoucherSubTypeId: vm.voucherSubTypeInApproval
                    };

                    tenantSettingsService.updateDocumentApprovalsSettings(voucherApprovalObject)
                        .success(function () {
                            vm.loading = false;
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        }).error(function (error) {
                            vm.loading = false;
                        }).finally(function () {
                            vm.saving = false;
                        });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                }
            };


            // Holiday Tab 

            vm.createHoliday = function () {
                openCreateOrEditHolidayModal(null);
            }


            // Editing Holiday

            vm.editHoliday = function (holiday) {

                openCreateOrEditHolidayModal(holiday.id);
            }

            // deleting Holiday
            vm.deleteHoliday = function (holiday) {

                abp.message.confirm(
                    app.localize('DeleteWarningMessage', holiday.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            holidayService.deleteHoliday({
                                id: holiday.id
                            }).success(function () {
                                vm.getHolidays();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );


            }

            //  Viewing Holiday

            vm.viewHoliday = function (holiday) {
                openViewHolidayModal(holiday.id);
            }
            //////////////////////////////////////////////////////////////

            // Limousine Settings
            vm.emailTripChanged = function () {
                if (!vm.settings.limousine.emailTripAdded) {
                    vm.settings.limousine.emailTripAdded_Customer = false;
                    vm.settings.limousine.emailTripAdded_Guest = false;
                    vm.settings.limousine.emailTripAdded_Admin = false;
                }
                if (!vm.settings.limousine.emailTripModified) {
                    vm.settings.limousine.emailTripModified_Customer = false;
                    vm.settings.limousine.emailTripModified_Guest = false;
                    vm.settings.limousine.emailTripModified_Admin = false;
                }
                if (!vm.settings.limousine.emailTripAddedByCustomer) {
                    vm.settings.limousine.emailTripAddedByCustomer_Customer = false;
                    vm.settings.limousine.emailTripAddedByCustomer_Guest = false;
                    vm.settings.limousine.emailTripAddedByCustomer_Admin = false;
                }
                if (!vm.settings.limousine.emailTripModifiedByCustomer) {
                    vm.settings.limousine.emailTripModifiedByCustomer_Customer = false;
                    vm.settings.limousine.emailTripModifiedByCustomer_Guest = false;
                    vm.settings.limousine.emailTripModifiedByCustomer_Admin = false;
                }
                if (!vm.settings.limousine.emailTripDispatched) {
                    vm.settings.limousine.emailTripDispatched_Customer = false;
                    vm.settings.limousine.emailTripDispatched_Guest = false;
                    vm.settings.limousine.emailTripDispatched_Admin = false;
                }
                if (!vm.settings.limousine.emailTripAccepted) {
                    vm.settings.limousine.emailTripAccepted_Customer = false;
                    vm.settings.limousine.emailTripAccepted_Guest = false;
                    vm.settings.limousine.emailTripAccepted_Admin = false;
                }
                if (!vm.settings.limousine.emailTripRejected) {
                    vm.settings.limousine.emailTripRejected_Customer = false;
                    vm.settings.limousine.emailTripRejected_Guest = false;
                    vm.settings.limousine.emailTripRejected_Admin = false;
                }
                if (!vm.settings.limousine.emailTripNoShow) {
                    vm.settings.limousine.emailTripNoShow_Customer = false;
                    vm.settings.limousine.emailTripNoShow_Guest = false;
                    vm.settings.limousine.emailTripNoShow_Admin = false;
                }
                if (!vm.settings.limousine.emailTripStarted) {
                    vm.settings.limousine.emailTripStarted_Customer = false;
                    vm.settings.limousine.emailTripStarted_Guest = false;
                    vm.settings.limousine.emailTripStarted_Admin = false;
                }
                if (!vm.settings.limousine.emailTripFinished) {
                    vm.settings.limousine.emailTripFinished_Customer = false;
                    vm.settings.limousine.emailTripFinished_Guest = false;
                    vm.settings.limousine.emailTripFinished_Admin = false;
                }
                if (!vm.settings.limousine.emailTripCanceled) {
                    vm.settings.limousine.emailTripCanceled_Customer = false;
                    vm.settings.limousine.emailTripCanceled_Guest = false;
                    vm.settings.limousine.emailTripCanceled_Admin = false;
                }
            };
            // Notiication Settings
            vm.emailBookingChanged = function () {
                if (!vm.settings.speedNotification.EmailBookingCreatedByAdmin) {
                    vm.settings.speedNotification.EmailBookingCreatedByAdmin_Customer = false;
                    vm.settings.speedNotification.EmailBookingCreatedByAdmin_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingCreatedByCustomer) {
                    vm.settings.speedNotification.emailBookingCreatedByCustomer_Customer = false;
                    vm.settings.speedNotification.emailBookingCreatedByCustomer_Admin = false;
                }
                if (!vm.settings.speedNotification.emailbookingModifiedByAdmin) {
                    vm.settings.speedNotification.emailbookingModifiedByAdmin_Customer = false;
                    vm.settings.speedNotification.emailbookingModifiedByAdmin_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingModifiedByCustomer) {
                    vm.settings.speedNotification.emailBookingModifiedByCustomer_Customer = false;
                    vm.settings.speedNotification.emailBookingModifiedByCustomer_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingCancelledByCustomer) {
                    vm.settings.speedNotification.emailBookingCancelledByCustomer_Customer = false;
                    vm.settings.speedNotification.emailBookingCancelledByCustomer_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingCancelledByAdmin) {
                    vm.settings.speedNotification.emailBookingCancelledByAdmin_Customer = false;
                    vm.settings.speedNotification.emailBookingCancelledByAdmin_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingNoShow) {
                    vm.settings.speedNotification.emailBookingNoShow_Customer = false;
                    vm.settings.speedNotification.emailBookingNoShow_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingClosed) {
                    vm.settings.speedNotification.emailBookingClosed_Customer = false;
                    vm.settings.speedNotification.emailBookingClosed_Admin = false;
                }
                if (!vm.settings.speedNotification.emailBookingConfirmed) {
                    vm.settings.speedNotification.emailBookingConfirmed_Customer = false;
                    vm.settings.speedNotification.emailBookingConfirmed_Admin = false;
                }
            };


            function init() {
                getVoucherSubTypes();
                designationDetails();
                getLocations();
                if (angular.isUndefined(vm.salikAccounts)) {
                    getAllSalikAccounts();
                    getAllDarbAccounts();
                }
                if (angular.isUndefined(vm.holidays)) {
                    getAllHolidays();
                }
                getAllTrafficFiles();
                getChargesSettings();
                getAllFuelAccounts();
                //getAgreementDocuments();
                getChargesTypesUpdated();
                getRateTypesUpdated();
                getReceiptsPaymentMethods();
                if (vm.isExpenseTypeEnabled)
                    vm.getExpenses();
                getCostCenters();
                //getGroup1CostCenters();
                //getGroup2CostCenters();
                if (vm.isAccountsEnabled) {
                    getExpenseAccounts();
                    getExpenseAccountsAdvanceSetting();
                    getPaymentGatewayAdvanceSetting();
                }

                getAllChargesSettings();
                vm.getContactGroups();
            }

            vm.getSettings();
            init();

            // Image Upload Code

            vm.uploader = new fileUploader({

                url: abp.appPath + 'Document/UploadTenantImage/',
                formData: [{ fileName: vm.fileName }],
                queueLimit: 3,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        //if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                        //    abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                        //    return false;
                        //}

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            //vm.getSource = function () {
            //    return "/App/images/tenantImages/" + vm.fileName + '?' + new Date().getTime();
            //};

            vm.uploader.onSuccessItem = function (response) {
                vm.loading = true;

                if (response.isSuccess) {
                    vm.uploader.isUploading = response.isUploading;
                    vm.successFullyUploaded = response.isUploaded;
                    if (vm.successFullyUploaded) {
                        var random = (new Date()).toString();
                        vm.ImageSrc = "/App/images/tenantImages/" + vm.fileName + "?cb=" + random;
                        abp.message.info("SuccessFullyUploaded");

                    }

                }
                else {
                    abp.message.error("Error in File Uploading");
                }

            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };
            vm.generateApiKey = function () {
                tenantSettingsService.generateApiKey().success(function (data) {
                    vm.apiKey = data;
                });
            };
            // Uploading Logo 
            vm.uploaderLogo = new fileUploader({

                url: abp.appPath + 'Document/UploadTenantImage/',
                formData: [{ fileName: vm.logoFileName }],
                queueLimit: 3,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        //var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        //if ('|jpg|jpeg|png|'.indexOf(type) === -1) {
                        //    abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                        //    return false;
                        //}

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });
            vm.uploaderLogo.onSuccessItem = function (response) {
                vm.loading = true;

                if (response.isSuccess) {
                    vm.uploaderLogo.isUploading = response.isUploading;
                    if (response.isUploaded) {
                        var random = (new Date()).toString();
                        vm.ImageSrcLogo = "/App/images/tenantImages/" + vm.logoFileName + "?cb=" + random;
                        abp.message.info("SuccessFullyUploaded");

                    }

                }
                else {
                    abp.message.error("Error in File Uploading");
                }

            };
            vm.uploaderLogo.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };


            function getExpenseAccounts() {
                vm.loading = true;
                var accountCategory = 5; //expenses category
                accountService.getAccountsOnCategory({ id: accountCategory }).success(function (data) {
                    vm.vehicleExpensesAccounts = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.expenseAccountCheckedOrUnchecked = function (account) {
                if (vm.vehicleExpensesAccounts) {
                    vm.vehicleExpensesAccounts.filter(e => e.parentId === account.id)
                        .forEach((row) => row.isChecked = account.isChecked);
                }
            };

            vm.saveExpenseAccountIds = function () {
                var accountIdsToReturn = vm.vehicleExpensesAccounts.filter(e => e.isChecked).map(r => r.id);
                vm.saving = true;
                var settingName = "AdvanceSettings.VehicleExpenseAccounts.ExpenseAccounts";
                let advanceSetting = {
                    name: settingName,
                    expenseAccountIds: accountIdsToReturn
                };

                tenantSettingsService.updateVehicleExpensesAccountsAdvanceSettings(advanceSetting)
                    .success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.savePaymentGatewaySettings = function () {
                vm.saving = true;
                var settingName = "AdvanceSettings.PaymentGateway";
                let advanceSetting = {
                    settingName: settingName,
                    //paymentMethod: vm.paymentGatewaySettings.paymentMethod,
                    paymentMethodId: vm.paymentGatewaySettings.paymentMethodId,
                    merchantId: vm.paymentGatewaySettings.merchantId,
                    privateKey: vm.paymentGatewaySettings.privateKey,
                    publicKey: vm.paymentGatewaySettings.publicKey,
                    encryptionKey: vm.paymentGatewaySettings.encryptionKey,
                    gatewayUrl: vm.paymentGatewaySettings.gatewayUrl,
                };

                tenantSettingsService.updatePaymentGatewaySettings(advanceSetting)
                    .success(function () {
                        vm.loading = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }).error(function (error) {
                        vm.loading = false;
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
            vm.updateFuelRate = function () {
                abp.message.confirm(
                    app.localize('UpdateWarningMessage', 'confirm'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.saving = true;
                            vm.saveCommonSettings();
                            commonAgreementService.updateFuelRate({
                                fuelRate: vm.settings.speedCommon.updateFuelRate
                            }).success(function () {
                                abp.notify.info(app.localize('SavedSuccessfully'));
                            }).finally(function () {
                                vm.saving = false;
                            });
                        }
                    }
                );
                
            };
            function getExpenseAccountsAdvanceSetting() {
                tenantSettingsService.getExpenseAccountsAdvanceSetting()
                    .success(function (result) {
                        var selectedAccountIds = result;
                        if (vm.vehicleExpensesAccounts)
                            vm.vehicleExpensesAccounts.filter(e => selectedAccountIds.includes(e.id)).forEach(e => e.isChecked = true);

                    });
            }

            function getPaymentGatewayAdvanceSetting() {
                tenantSettingsService.getPaymentGatewayAdvanceSetting()
                    .success(function (result) {
                        vm.paymentGatewaySettings = result;
                    });
            }
        }
    ]);
