// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:153743-156433
appModule.controller('tenant.views.agreementsDashboard2.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.commonAgreement', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.rentalAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', '$state', 'abp.services.app.saleOrigin', 'abp.services.app.agreement', '$filter', 'abp.services.app.leaseAgreement',
        function ($scope, $uibModal, $window, uiGridConstants, chargesCalculator, commonAgreementService, rentalAgreementSearchService, rentalAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService, $state, saleOriginService, agreementService, $filter, leaseAgreementService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.calculateAndShowAgreementChargesTillNow = utilities.parseBoolean(abp.setting.get("App.General.CalculateAndShowAgreementChargesTillNow"));
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.isAddMultipleDepositsOnAgreement = abp.features.isEnabled("CRS.CustomFeatures.AddMultipleDepositsOnAgreement");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.showContactNo = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowContactNoInDashBoard2"));
            vm.showParkingChargesInAgreementDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.AgreementDashboardTwo.ShowParkingChargesInAgreementDashboard"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            var isSalesPersonWithDesignationSetting = parseInt(abp.setting.get("App.General.SalesPersonDesignation"));
            vm.isWhatsAppAgreementDueAmountGreateThan1000ManualEnable = abp.features.isEnabled("Notifications.WhatsAppAgreementDueAmountGreateThan1000SMSManual");
            vm.isEmailAgreementDueAmountGreaterThan1000ManualEnable = abp.features.isEnabled("Notifications.EmailAgreementDueAmountGreaterThan1000Manual");

            if (isSalesPersonWithDesignationSetting > 0) {
                vm.isSalesPersonWithDesignation = true;

            }
            else {
                vm.isSalesPersonWithDesignation = false;
            }
            vm.replacementOfMakeAndModelInGridForVehicles = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ReplacementOfMakeAndModelInGridForVehicles'));
            vm.allowRateTypeChargesWithVehicle = abp.features.isEnabled("CRS.CustomFeatures.AllowRateTypeChargesWithVehicle");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isSalikModuleEnabled = abp.features.isEnabled("CRS.Tolls.Salik");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isFineModuleEnabled = abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.Qatar"); //added by arslan for Qatar fines
            vm.skipCount = 0;
            var batchSize = 500;
            vm.searchSaleOrigin = function ($select) {
                if (!$select.search) return;
                return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
                    vm.saleOrigins = response.data.items;
                });
            };
            vm.localize = function (value) {
                return app.localize(value);
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];
            vm.customerType = [
                { name: "Person", id: 1 },
                { name: "Company", id: 2 }
            ];

            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];
            vm.type = '';
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: 1,
                startDate: null,
                endDate: null,
                customerId: null,
                salesPerson: null,
                insuranceCompany: null,
                agreementCategory: 1,
                permanentVehicle: false,
                plateNo: '',
                insuranceClaimNo: '',
                locationId: '',
                poNo: null,
                saleOrder: null,
                saleOriginId: null,
                skipCount: 0,
                maxResultCount: batchSize,
                vehicleOwnership: null
            };

            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day')
                };

            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                amount = utilities.round(amount, 2);
                return amount.toLocaleString('en');
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.Tenant.Agreements.ReplaceVehicle'),
                replaceDriver: abp.auth.hasPermission('Pages.Tenant.Agreements.ReplaceDriver'),
                print: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                close: abp.auth.hasPermission('Pages.Tenant.Agreements.Close'),
                extend: abp.auth.hasPermission('Pages.Tenant.Agreements.Extend'),
                cutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.CutShort'),
                unclose: abp.auth.hasPermission('Pages.Tenant.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Agreements.Delete'),
                upGrade: abp.auth.hasPermission('Pages.Tenant.Agreements.UpGrade'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalCharges'),
                agreementAdditionalChargesAfterClosing: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementAdditionalChargesAfterClosing'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                extendCutShort: abp.auth.hasPermission('Pages.Tenant.Agreements.ExtendCutShort'),
                delivery: abp.auth.hasPermission('Pages.Tenant.Agreements.DeliveryMovement'),
                canChangeSalesPerson: abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeSalesPerson'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.AgreementsDashboard2.ExportToExcel'),
                canOpenAgreementWithoutSaleOrder: abp.auth.hasPermission('Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental'),
                agreementDiscountsPeriodWise: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDiscountsPeriodWise'),
                billingHistory: abp.auth.hasPermission('Pages.Tenant.Agreements.BillingHistory'),
            };
            vm.leasePermissions = {
                view: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements'),
                create: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ReplaceVehicle'),
                replaceDriver: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ReplaceDriver'),
                print: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements'),
                close: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Close'),
                unClose: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew'),
                agreementAdditionalCharges: abp.auth.hasPermission('Pages.Tenant.Lease.AgreementAdditionalCharges'),
                delivery: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.DeliveryMovement'),
                canOpenAgreementWithoutSaleOrder: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease'),
            };

            vm.invoicesPermissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Edit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Approve'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Delete'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.AllActionsOnOtherBranchInvoices'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.ViewOtherBranchInvoices'),
                emailInvoice: abp.features.isEnabled("Notifications.EmailTrafficFineInvoice"),
                SendFineSMS: abp.features.isEnabled("Notifications.FinesSMS"),
                createReceiptFromInvoice: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.CreateReceiptFromInvoice')
            };
            vm.isAllocationWithChargesTypeEnabled = abp.features.isEnabled("CRS.Vouchers.AllocationWithChargesType");

            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.isSaleOrderEnable = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.locationLeasePermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.leasePermissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            function openCreateOrEditCreditNoteModal(creditNoteId, agreement) {

                commonAgreementService.getAgreement({ id: agreement.id })
                    .success(d => {
                        //$rootScope.headerPrintCheck = false;
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModal.cshtml',
                            controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                            backdrop: 'static',
                            size: 'xl',
                            resolve: {
                                creditNoteId: function () {
                                    return null;
                                },
                                agreement: d
                            }
                        });
                        modalInstance.result.then(function (result) {
                            vm.getCreditNotes();
                        });
                    });
            };
            vm.createCreditNote = function (agreement) {
                openCreateOrEditCreditNoteModal(null, agreement);
            };
            //if delivery pending then don't allow certain actions like Replace Vehicle, Close Agreement, Extent etc.
            vm.isDeliveryNotPending = function (row) {
                if (row.isDeliveryRequired && !row.isVehicleDelivered)
                    return false;

                return true;
            };

            //if delivery pending then don't allow certain actions like Replace Vehicle, Close Agreement, Extent etc.
            vm.isDeliveryNotPendingLease = function (row) {
                if (row.isDeliveryRequired && !row.isVehicleDelivered)
                    return false;

                return true;
            };
            vm.column = null;
            vm.reverse = false;

            vm.sortColumn = function (col) {
                vm.column = col;
                if (vm.reverse) {
                    vm.reverse = false;
                    vm.reverseclass = 'arrow-up';
                } else {
                    vm.reverse = true;
                    vm.reverseclass = 'arrow-down';
                }
            }
            vm.sortClass = function (col) {
                if (vm.column == col) {
                    if (vm.reverse) {
                        return 'arrow-down';
                    } else {
                        return 'arrow-up';
                    }
                } else {
                    return '';
                }
            }



            vm.searchUsers = function ($select) {

                return directoryService.searchSalesPersonWithDesignation({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };
            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };



            vm.searchSupplierContact = function ($select) {
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };



            vm.locationPermissionClose = function (row) {
                if (row.closingLocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.closingLocationId != appSession.user.locationId)
                        return false;
                }
                else if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;
                return true;
            };


            vm.locationLeasePermissionClose = function (row) {
                if (row.closingLocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.closingLocationId != appSession.user.locationId)
                        return false;
                }
                else if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;
                return true;
            };


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.statusChanged = function () {

                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;

            };
            vm.getAgreementType = function (category) {
                if (category === 0)
                    return "NA";
                if (category === 1)
                    return "Daily";
                if (category === 2)
                    return "Weekly";
                if (category === 3)
                    return "Monthly";
                else if (category === 4)
                    return "Lease";
                else if (category === 5)
                    return "LeaseToOwn";
                else if (category === 6)
                    return "Hourly";
                else
                    return category;
            }
            vm.getStatus = function (status) {
                if (status === 1)
                    return "Open";
                else if (status === 2)
                    return "Closed";
                else if (status === 3)
                    return "Cancelled";
                else if (status === 8)
                    return "Voided";

                else if (status === 0)
                    return "NA"
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.features = {
                agreementDocument: abp.features.isEnabled("CRS.Rental.Agreements.AgreementDocuments")
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('DD-MM-YYYY')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('DD-MM-YYYY')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.viewInvoices = function (agreement) {
                var filters = {
                    agreement: agreement
                }
                var url = `/Application#/tenant/crs/invoices`;
                window.open(url, "_blank");
            }

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.disableExportButton = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                else {
                    vm.filters.salesPersonId = null;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day').utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day').utc();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                vm.agreementDue = [];
                commonAgreementService.exportToExcelForDashboard2(vm.filters)
                    .success(function (result) {
                        vm.agreementDue = result;
                        angular.forEach(vm.agreementDue.agreements, function (item, key) {
                            if (item.status == 8) {
                                item.due = 0;
                            }
                        });

                        app.downloadTempFile(vm.agreementDue);
                    }).finally(function () {
                        vm.loading = false;
                        vm.disableExportButton = false;

                    });
            };

            //function getAgreementTypes() {
            //    vm.agreementTypes = [{ id: 1, name: "Daily" }, { id: 2, name: "Weekly" }, { id: 3, name: "Monthly" }];
            //};

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };

            vm.report = function () {

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                else {
                    vm.filters.salesPersonId = null;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day').utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day').utc();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openPrintAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
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


            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };



            function openPrintLeaseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }
            //vm.showTollsDetail = function (agreementId) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/tollsDetailModal.cshtml',
            //        controller: 'tenant.views.crs.agreements.tollsDetailModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            tolls: function () {
            //                return null;
            //            },
            //            dateTimeIn: function () {
            //                return null;
            //            },
            //            agreementId: function () {
            //                return agreementId;
            //            }
            //        }
            //    });
            //};
            vm.showTollsDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/tollsDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };
            vm.showDarbDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/darbsDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };
            vm.showParkingDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/parkingDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };


            vm.showDarbDetail = function (agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/darbsDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.darbsDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tolls: function () {
                            return null;
                        },
                        dateTimeIn: function () {
                            return null;
                        },
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            };





            vm.showFinesDetail = function (agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard2/finesDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreementsDashboard2.finesDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fines: function () {
                            return null;
                        },
                        dateTimeIn: function () {
                            return null;
                        },
                        agreementId: function () {
                            return agreementId;
                        }

                    }
                });
                modalInstance.result.then(function () {
                    //vm.calculate();
                });
            };
            vm.calculate = function (rowagreement) {
                if (rowagreement == null) return 0;

                if (rowagreement && rowagreement.charges) {
                    var foundLines = $filter('filter')(rowagreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                        }
                    }
                }

                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = chargesCalculator.calculate(vm.agreement);
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}

                return chargesCalculator.calculate(rowagreement);
            };

            //vm.openForViewReceivedDetails= function (agreement) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreementsDashboard2/viewReceivedDetails.cshtml',
            //        controller: 'tenant.views.crs.agreementsDashboard2.viewReceivedDetails as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            agreement: function () {
            //                return agreement;
            //            }
            //        }
            //    });
            //}
            vm.openForViewReceivedDetails = function (agreement) {
                vm.filters.agreementForReceviced = agreement;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/viewReceivedDetails.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.showFinesDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/finesDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };
            //vm.showParkinDetail = function (agreementId) {
            //    vm.filters.agreementId = agreementId;


            //    $uibModal.open({
            //        templateUrl: '~/App/common/views/common/reportViewer.cshtml',
            //        controller: 'common.views.common.reportViewer as vmMain',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            templateUrl: function () {
            //                return '~/App/tenant/views/crs/agreementsDashboard2/parkingDetailModal.cshtml';
            //            },
            //            filters: function () {
            //                return vm.filters;
            //            }
            //        }

            //    });
            //};




            vm.printLeaseAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.agreements.viewModal as vm',
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

            function openViewAgreementChargesModal(agreement) {
                commonAgreementService.getAgreement({ id: agreement.id })
                    .success(d => {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/agreementsDashboard2/viewModal.cshtml',
                            controller: 'tenant.views.crs.agreementsDashboard2.viewModal as vm',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {

                                options: function () {
                                    return {
                                        agreement: d,
                                        agreementId: null
                                    };
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {
                            vm.sumInvoiced = vm.sumInvoiced - agreement.invoiced;

                            agreement.invoiced = result.invoiced;
                            agreement.tollInvoice = result.tollInvoice;
                            agreement.parkingInvoice = result.parkingInvoice;
                            agreement.finesInvoice = result.finesInvoice;
                            agreement.darbInvoice = result.darbInvoice;
                            agreement.sumInvoiceTDFCharges = result.sumInvoiceTDFCharges;
                            agreement.invoicedTax = result.invoicedTax;
                            vm.sumInvoiced = vm.sumInvoiced + agreement.invoiced;
                        });
                    });
            };
            openViewModal = function (agreement) {


            };
            function openAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard2/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.agreementsDashboard2.agreementAdditionalCharges as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }
            function openLeaseAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.agreementAdditionalCharges as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            }

            vm.leaseAgreementAdditionalCharges = function (agreement) {
                openLeaseAgreementAdditionalChargesModal(agreement.id);
            };

            vm.agreementAdditionalCharges = function (agreement) {
                openAgreementAdditionalChargesModal(agreement.id);
            };

            vm.createOrViewSaleOrders = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/addOrViewSaleOrder.cshtml',
                    controller: 'tenant.views.crs.agreements.addOrViewSaleOrder as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        },
                        contactId: function () {
                            return agreement.customerId
                        }
                    }
                });
            }

            function openBillingHistoryModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/billingHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.billingHistoryModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            vm.isFirebaseInitalized = false;

            function openCloseAgreementModalForRental(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.closeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                    try {

                        firebase.auth().signOut();
                    } catch (e) { //Not loggedIn or firebase app not initialized...
                        //Do nothing...
                    }

                    vm.searchAgreements();
                });
            }

            function openCloseLeaseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/closeLeaseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.closeLeaseAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            }
            vm.closeLeaseAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseLeaseAgreementModal(agreement.id);
            };

            // Replace Vehicle Modal

            function openReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                isFirebaseInitalized: vm.isFirebaseInitalized
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            function openLeaseReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            function openDeliveryMovementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/deliveryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.deliveryModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            function openReplaceDriverModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceDriverModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceDriverModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            // ExtendCutShortModal
            function openExtendCutShortModal(input) {
                //Actions  1.Extend 2.Cutshort
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/extendCutShortAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.extendCutShortAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: input.agreementId,
                                action: input.action,
                                chargesSettings: vm.chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            // Upgrade Agreement Modal
            function openUpgradeAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/upgradeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.upgradeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }
            function openCreateDepositModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/createDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.createDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            };
            function openCreateOrEditReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },

                        quotationId: function () {
                            return null;
                        },
                        customer: function () {
                            return null;
                        },

                        downPayment: function () {
                            return null;
                        },

                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }
            function openCreateOrEditReceiptModal2(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal2.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal2 as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
                        },
                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }


            function openCreateOrEditRefundModal(refundId, agreement) {
                commonAgreementService.getAgreement({ id: agreement.id })
                    .success(d => {
                        var agr = angular.copy(d);
                        agr.dueAmount = agr.due;

                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/vouchers/payments/createOrEditModal.cshtml',
                            controller: 'tenant.views.crs.vouchers.payments.createOrEditModal as vm',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                paymentId: function () {
                                    return refundId;
                                },
                                agreement: function () {
                                    return agr;
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {
                            vm.searchAgreements();
                        });
                    });

            }
            function openViewLeaseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            //function openCreateOrEditLeaseAgreementModal(agreementId, chargesSettings) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditModal.cshtml',
            //        controller: 'tenant.views.crs.lease.agreements.createOrEditModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    agreementId: agreementId,
            //                    chargesSettings: chargesSettings
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.getLeaseAgreements();
            //    });
            //}

            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };
            vm.viewAgreementCharges = function (agreement) {
                openViewAgreementChargesModal(agreement);
            };


            vm.editLeaseAgreement = function (agreement) {
                openCreateOrEditLeaseAgreementModal(agreement.id, vm.chargesSettings);
            };

            vm.viewLeaseAgreement = function (agreement) {
                openViewLeaseAgreementModal(agreement.id);
            };

            vm.viewBillingHistory = function (agreement) {
                openBillingHistoryModal(agreement.id);
            };

            vm.createAgreement = function () {
                openCreateOrEditAgreementModal(null, vm.chargesSettings);
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };

            //vm.printAgreement = function (agreement) {
            //    $window.open('../Agreement/Print/' + agreement.id, '_blank');
            //};

            vm.closeAgreement = function (agreement) {
                if (agreement.hasCustodyMovement) {
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                }
                else {
                    if (agreement.agreementCategory == 1) openCloseAgreementModalForRental(agreement.id);
                    if (agreement.agreementCategory == 2) openCloseLeaseAgreementModal(agreement.id);
                }
            };

            // UpGrade Agreement Code
            vm.upgradeAgreement = function (agreemnt) {
                openUpgradeAgreementModal(agreemnt.id, vm.chargesSettings);
            }

            vm.unCloseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.uncloseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.searchAgreements();
                                abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
                            });
                        }
                    }
                );
            };


            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
                chargesSettingService.getChargesSettings({ module: 2 }).success(function (data) {
                    vm.chargesSettingsLease = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, contactCategory: vm.filters.contactCategory }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };



            // extended search using search customer popup
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
                        vm.filters.customer = customer;
                    }
                });
            };
            vm.searchAgreements = function () {
                vm.sumTotalCharges = 0.0;
                vm.sumTotalTax = 0.0;
                vm.sumTollsCharges = 0.0;
                vm.sumDarbCharges = 0.0;
                vm.sumParkingCharges = 0.0;
                vm.sumFinesCharges = 0.0;
                vm.sumTotal = 0.0;
                vm.sumReceived = 0.0;
                vm.sumReceivedTax = 0.0;
                vm.sumAdditional = 0.0;
                vm.sumRentRate = 0.0;
                vm.sumAgreementDiscount = 0.0;
                vm.sumDue = 0.0;
                vm.sumInvoiced = 0.0;
                vm.sumCreditNote = 0.0;
                vm.sumDeposit = 0.0;
                vm.sumDueDeposit = 0.0;
                vm.sumreceivedTotal = 0.0;
                vm.outStandingCount = 0.0;
                //vm.getAgreements();

                vm.getAgreementsFromView();
            };

            vm.getAgreementsFromView = () => {
                vm.loading = true;
                vm.disableSaveButton = true;

                if (vm.skipCount == 0)
                    vm.agreements = [];
                vm.filters.skipCount = vm.skipCount;
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                else {
                    vm.filters.salesPersonId = null;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().startOf('day').utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day').utc();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                /* if (!vm.filters.enableDateRange) {
                     vm.filters.startDate = null;
                     vm.filters.endDate = null;
                 }*/

                commonAgreementService.agreementsDashboardTwoView(vm.filters)
                    .success((data) => {
                        vm.totalDataCount = data.totalCount;
                        vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                        vm.data = data;
                        vm.paginate(1);

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.agreements;
                    })
                    .finally(() => {
                        vm.loading = false;
                        vm.disableSaveButton = false;
                    });
            }

            vm.pageSize = 100;
            vm.pageSizes = [10, 20, 50, 100];
            vm.currentPage = 0;
            vm.isNextPage = true;
            vm.isPreviousPage = true;
            vm.isPaging = false;

            vm.onPageSizeChange = () => {
                vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                vm.paginate(1);
            }

            vm.paginate = (currentPage) => {
                vm.currentPage = currentPage;
                vm.isNextPage = vm.currentPage < vm.totalPages;
                vm.isPreviousPage = vm.currentPage > 1;
                vm.isPaging = true;
                vm.paginateAgreements = vm.data.agreements.slice((vm.currentPage - 1) * vm.pageSize, vm.currentPage * vm.pageSize);
                vm.isPaging = false;
            }

            vm.getAgreements = function () {
                vm.loading = true;
                vm.disableSaveButton = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.skipCount == 0)
                    vm.agreements = [];
                vm.filters.skipCount = vm.skipCount;
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                else {
                    vm.filters.salesPersonId = null;
                }


                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('DD-MM-YYYY')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('DD-MM-YYYY')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                commonAgreementService.getOpenAgreementsForAgreementsDashboard2(vm.filters).success(function (data) {
                    vm.totalDataCount = data.totalCount;
                    //vm.amortizationData = data.items;

                    angular.forEach(data.agreementsList, function (value, key) {
                        if (vm.calculateAndShowAgreementChargesTillNow && value.status == 1) {
                            vm.calculate(value);
                        }





                        value.rentalCharges = 0;
                        value.reversedCharges = 0;
                        value.reversedAdditionalCharges = 0;
                        value.reversedChargesWithoutTDF = 0;
                        value.reversedChargesOfTolls = 0;
                        value.reversedChargesOfDarbs = 0;
                        value.reversedChargesOfFines = 0;
                        value.receivedCharges = 0;
                        value.receivedAdditionalCharges = 0;
                        value.receivedChargesWithoutTDF = 0;
                        value.receivedChargesOfTolls = 0;
                        value.receivedChargesOfDarbs = 0;
                        value.receivedChargesOfFines = 0;
                        value.darbInvoice = 0;
                        value.tollInvoice = 0;
                        value.finesInvoice = 0;
                        value.parkingInvoice = 0;
                        value.invoicedTax = 0;
                        value.chargesInvoiceTotal = 0;
                        value.agreementDiscount = 0;
                        value.sumInvoiceTDFCharges = 0;






                        angular.forEach(value.charges, function (item, key) {
                            angular.forEach(value.additionalAgreementChargesList, function (addi, key) {
                                if (addi.chargesTypeId == item.chargesTypeId) {
                                    if (addi.rate) {

                                        if (addi.chargesTypeId == 7 || addi.chargesTypeId == 33) {
                                            value.tollsCharges = value.tollsCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;
                                        }
                                        if (addi.chargesTypeId == 8 || addi.chargesTypeId == 34) {
                                            value.finesCharges = value.finesCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 73 || addi.chargesTypeId == 74) {
                                            value.darbCharges = value.darbCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 39 || addi.chargesTypeId == 77) {
                                            value.parkingCharges = value.parkingCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        else {
                                            item.charges = item.charges + addi.rate;
                                            item.tax = item.tax + addi.tax;
                                        }



                                    }

                                }


                            });

                            if (item.chargesTypeId == 1) {
                                value.rentRate = item.rate - (item.rate * item.discountPercent / 100);
                            }


                            if (
                                !(item.chargesTypeId == 73 ||
                                    item.chargesTypeId == 74 ||
                                    item.chargesTypeId == 7 ||
                                    item.chargesTypeId == 8 ||
                                    item.chargesTypeId == 33 ||
                                    //item.chargesTypeId == 28 ||
                                    item.chargesTypeId == 34
                                )) {
                                value.rentalCharges = value.rentalCharges + item.charges;
                                value.reversedCharges = value.reversedCharges + item.reversed;
                                value.receivedCharges = value.receivedCharges + item.received;
                                if (item.taxable)
                                    value.totalTax = value.totalTax + item.tax;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                value.chargesInvoiceTotal = value.chargesInvoiceTotal + item.invoiced;
                                value.reversedChargesWithoutTDF = value.reversedChargesWithoutTDF + item.reversed;
                                value.receivedChargesWithoutTDF = value.receivedChargesWithoutTDF + item.received;
                            } else {//toll darb salik invoice sum
                                value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + item.invoiced;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                if (item.chargesTypeId == 33 || item.chargesTypeId == 7) {
                                    value.tollInvoice = value.tollInvoice + item.invoiced;
                                    value.reversedChargesOfTolls = value.reversedChargesOfTolls + item.reversed; // credit notes
                                    value.receivedChargesOfTolls = value.receivedChargesOfTolls + item.received; // receipts
                                }
                                if (item.chargesTypeId == 34 || item.chargesTypeId == 8) {
                                    value.finesInvoice = value.finesInvoice + item.invoiced;
                                    value.reversedChargesOfFines = value.reversedChargesOfFines + item.reversed; // credit notes
                                    value.receivedChargesOfFines = value.receivedChargesOfFines + item.received; // receipts
                                }
                                if (item.chargesTypeId == 73 || item.chargesTypeId == 74) {
                                    value.darbInvoice = value.darbInvoice + item.invoiced;
                                    value.reversedChargesOfDarbs = value.reversedChargesOfDarbs + item.reversed; // credit notes
                                    value.receivedChargesOfDarbs = value.receivedChargesOfDarbs + item.received; // receipts
                                }
                                if (item.chargesTypeId == 39 || item.chargesTypeId == 77) {
                                    value.parkingInvoice = value.parkingInvoice + item.invoiced;
                                    value.reversedChargesOfParking = value.reversedChargesOfParking + item.reversed; // credit notes
                                    value.receivedChargesOfParking = value.receivedChargesOfParking + item.received; // receipts
                                }
                                //if (item.chargesTypeId == 28) {
                                //    value.receivedAdditionalCharges = value.receivedAdditionalCharges + item.received; // receipts
                                //    value.reversedAdditionalCharges = value.reversedAdditionalCharges + item.reversed; // credit notes
                                //}

                            }



                        });
                        value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + value.chargesInvoiceTotal;
                        if (value.discount) {
                            value.agreementDiscount = value.discount * -1;
                        }

                        value.totalTax = value.additionalTax + value.totalTax;
                        value.sum = value.additional + value.agreementDiscount + value.rentalCharges + value.tollsCharges + value.parkingcharges + value.finesCharges + value.darbCharges + value.totalTax;
                        value.due = ((value.sum - value.receivedTotal) - (value.reversed + value.reversedTax));
                        value.invoicedTax = utilities.round(value.invoicedTax, 2) - value.reversedTax;
                        value.totalTax = utilities.round(value.totalTax, 2);
                        value.agreementDiscount = utilities.round(value.agreementDiscount, 2);
                        value.rentalCharges = utilities.round(value.rentalCharges, 2);
                        value.tollsCharges = utilities.round(value.tollsCharges, 2);
                        value.parkingCharges = utilities.round(value.parkingCharges, 2);
                        value.finesCharges = utilities.round(value.finesCharges, 2);
                        value.sum = utilities.round(value.sum, 2);
                        value.additional = utilities.round(value.additional, 2);
                        value.received = utilities.round(value.received, 2);
                        value.receivedTotal = utilities.round(value.receivedTotal, 2);

                        value.due = utilities.round(value.due, 2);
                        value.deposit = utilities.round(value.deposit, 2);
                        value.dueDeposit = utilities.round(value.dueDeposit, 2);
                        value.darbCharges = utilities.round(value.darbCharges, 2);

                        vm.sumAgreementDiscount += value.agreementDiscount;
                        vm.sumInvoiced += value.invoiced;
                        vm.sumCreditNote += value.reversed + value.reversedTax;
                        vm.sumAdditional += value.additional;
                        vm.sumRentRate += value.rentRate;
                        vm.sumTotalCharges += value.rentalCharges;
                        vm.sumTotalTax += value.totalTax;
                        vm.sumTollsCharges += value.tollsCharges;
                        vm.sumDarbCharges += value.darbCharges;
                        vm.sumParkingCharges += value.parkingCharges;
                        vm.sumFinesCharges += value.finesCharges;
                        vm.sumTotal += value.sum;
                        vm.sumReceived += value.received;
                        vm.sumreceivedTotal += value.receivedTotal;
                        vm.sumReceivedTax += value.receivedTax;
                        vm.sumDue += value.due;
                        vm.sumDeposit += value.deposit;
                        vm.sumDueDeposit += value.dueDeposit;
                    });
                    vm.sumAgreementDiscount = utilities.round(vm.sumAgreementDiscount, 2);
                    vm.sumAdditional = utilities.round(vm.sumAdditional, 2);
                    vm.sumRentRate = utilities.round(vm.sumRentRate, 2);
                    vm.sumInvoiced = utilities.round(vm.sumInvoiced, 2);
                    vm.sumTotalTax = utilities.round(vm.sumTotalTax, 2);
                    vm.sumTotalCharges = utilities.round(vm.sumTotalCharges, 2);
                    vm.sumTollsCharges = utilities.round(vm.sumTollsCharges, 2);
                    vm.sumFinesCharges = utilities.round(vm.sumFinesCharges, 2);
                    vm.sumTotal = utilities.round(vm.sumTotal, 2);
                    vm.sumReceived = utilities.round(vm.sumReceived, 2);
                    vm.sumreceivedTotal = utilities.round(vm.sumreceivedTotal, 2);
                    vm.sumReceivedTax = utilities.round(vm.sumReceivedTax, 2);
                    vm.sumDue = utilities.round(vm.sumDue, 2);
                    vm.sumDeposit = utilities.round(vm.sumDeposit, 2);
                    vm.sumDueDeposit = utilities.round(vm.sumDueDeposit, 2);
                    data.agreementsList.forEach(function (value) {

                        if (vm.filters.outstandingDueAmount && value.due == 0) {
                            vm.outStandingCount++;
                            vm.sumAgreementDiscount -= value.agreementDiscount;
                            vm.sumInvoiced -= value.invoiced;
                            vm.sumCreditNote -= value.reversed + value.reversedTax;
                            vm.sumAdditional -= value.additional;
                            vm.sumRentRate -= value.rentRate;
                            vm.sumTotalCharges -= value.rentalCharges;
                            vm.sumTotalTax -= value.totalTax;
                            vm.sumTollsCharges -= value.tollsCharges;
                            vm.sumDarbCharges -= value.darbCharges;
                            vm.sumParkingCharges -= value.parkingCharges;
                            vm.sumFinesCharges -= value.finesCharges;
                            vm.sumTotal -= value.sum;
                            vm.sumReceived -= value.received;
                            vm.sumreceivedTotal -= value.receivedTotal;
                            vm.sumReceivedTax -= value.receivedTax;
                            vm.sumDue -= value.due;
                            vm.sumDeposit -= value.deposit;
                            vm.sumDueDeposit -= value.dueDeposit;


                        } else {
                            vm.agreements.push(value);

                        }


                    });
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.skipCount = vm.skipCount + batchSize;
                    if (vm.skipCount < vm.totalDataCount)
                        vm.getAgreements();
                    else {
                        vm.loading = false;
                        vm.disableSaveButton = false;

                        vm.skipCount = 0;
                    }
                }).finally(function () {
                    vm.loading = false;

                });
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

            vm.deleteAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.deleteAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.searchAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.deleteLeaseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            leaseAgreementService.deleteLeaseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getLeaseAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.openAgreementLogsModal = function (agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementLogsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        }
                    }
                });
            };

            vm.openviewCustomerModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/viewModel.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return agreement.customerId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            };

            vm.openCustomerSOAModal = function (agreement) {
                var params = {
                    customer: {
                        name: agreement.customerName,
                        code: agreement.customerCode,
                        id: agreement.customerId
                    }
                }
                var url = $state.href('tenant.crs_customerStatementOfAccountsAgreementsDashboard', { "filters": params });
                window.open(url, '_blank');
            };

            vm.openUpgradeLPOModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard/upgradeLPOModal.cshtml',
                    controller: 'tenant.views.agreements.agreementsDashboard.upgradeLPOModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            vm.openUpdateManualAgreementNoModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreementsDashboard/updateManualAgreementNoModal.cshtml',
                    controller: 'tenant.views.agreements.agreementsDashboard.updateManualAgreementNoModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.searchAgreements();
                });
            }

            vm.openAddRentalInvoiceModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
            }

            vm.openAddLeaseInvoiceModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/generateLeaseModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.generateLeaseModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
            }

            vm.openAddDebiteNoteModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return null;
                        },
                        options: function () {
                            return {
                                agreement: agreement
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDebitNotes();
                });
            }

            vm.openViewDebiteNote = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customerName,
                        code: agreement.customerCode
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_debitNotesAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            vm.openViewReceiptVoucher = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customerName,
                        code: agreement.customerCode
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_receiptsAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            vm.openViewInvoice = function (agreement) {
                var params = {
                    agreementNo: agreement.agreementNo,
                    customer: {
                        name: agreement.customerName,
                        code: agreement.customerCode
                    },
                    customerId: agreement.customerId
                }
                var url = $state.href('tenant.crs_invoicesAgreementDashboard', { "filters": params });
                window.open(url, '_blank');
            }

            // Opening  ViewDepositModal 
            vm.openViewDepositModal = function (agreement) {
                vm.filters.agreementForReceviced = agreement;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/viewDeposits.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            };

            vm.openViewSingleDepositModal = function (depositId, agreement) {
                commonAgreementService.getDepositId(agreement)
                    .success(did => {
                        if (did !== null) {
                            $uibModal.open({
                                templateUrl: '~/App/tenant/views/crs/vouchers/deposits/viewModal.cshtml',
                                controller: 'tenant.views.crs.vouchers.deposits.viewModal as vm',
                                backdrop: 'static',
                                size: 'lg',
                                resolve: {
                                    depositId: function () {
                                        return did;
                                    },
                                    agreement: function () {
                                        return agreement;
                                    }
                                }
                            });
                        }
                    });
            };
            vm.openAgreementDocumentsModal = function (agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDocumentsModalU.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDocumentsModalU as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                ContactCategory: agreement.customer.contactCategory,
                                driverType: agreement.driver.contactType,
                                driverId: agreement.driverId,
                                customerId: agreement.customerId
                            };
                        }

                    }
                });
            };

            vm.openAgreementDiscountsModal = function (agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDiscountsPeriodWiseModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                agreementStatus: agreement.status
                            };
                        }

                    }
                });
            };

            vm.round = (amount) => {
                return utilities.round(amount, 2);
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.editSalesPerson = function (agreement) {
                openEditSalesPersonModal(agreement.id);
            };


            function openEditSalesPersonModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/editSalesPersonModal.cshtml',
                    controller: 'tenant.views.crs.agreements.editSalesPersonModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                });
            }


            function openCreateOrEditLeaseAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                chargesSettings: chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLeaseAgreements();
                });
            }
            vm.createLeaseAgreement = function () {
                openCreateOrEditLeaseAgreementModal(null, vm.chargesSettingsLease);
            };

            vm.clearInsuranceCompany = function () {
                vm.filters.insuranceCompany = null;
                vm.filters.insuranceCompanyId = null;
            };
            vm.clearSaleOrigin = function () {
                vm.filters.saleOrigin = null;
                vm.filters.saleOriginId = null;
            };

            vm.replaceVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openReplaceVehicleModal(agreement.id);
            };

            vm.replaceLeaseVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openLeaseReplaceVehicleModal(agreement.id);
            };

            vm.replaceDriver = function (agreement) {
                openReplaceDriverModal(agreement.id);
            };

            vm.addDeliveryMovement = function (agreement) {
                openDeliveryMovementModal(agreement.id);
            };

            vm.extendAgreement = function (agreementId) {
                openExtendCutShortModal({ agreementId: agreementId, action: 1 });
            }
            vm.cutShortAgreement = function (agreementId) {
                openExtendCutShortModal({
                    agreementId: agreementId, action: 2
                });
            }
            vm.addReceipt = function (agreement) {
                if (vm.isAllocationWithChargesTypeEnabled)
                    openCreateOrEditReceiptModal2(null, agreement);
                else
                    openCreateOrEditReceiptModal(null, agreement);
            };
            vm.createDeposit = function (agreement) {
                openCreateDepositModal(agreement);
            };
            vm.createRefund = function (agreement) {
                openCreateOrEditRefundModal(null, agreement);
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                enablePagination: true,
                enableSorting: true,
                useExternalSorting: true,
                enableColumnResizing: true,
                appScopeProvider: vm,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length === 0) {
                            return;
                        }

                        let sortColumn = sortColumns[0].field;
                        let sortDirection = sortColumns[0].sort.direction;
                        let isNumber = sortColumns[0].colDef.type === 'number';
                        grid.appScope.gridOptions.data.sort(function (a, b) {
                            if (isNumber) {
                                let aNumber = isNaN(a[sortColumn]) ? parseFloat(a[sortColumn].replace(',', '')) : a[sortColumn];
                                let bNumber = isNaN(b[sortColumn]) ? parseFloat(b[sortColumn].replace(',', '')) : b[sortColumn];

                                if (sortDirection === 'desc') {
                                    return bNumber - aNumber;
                                }
                                else {
                                    return aNumber - bNumber;
                                }
                            } else {
                                let v1 = a[sortColumn];
                                let v2 = b[sortColumn];
                                if (sortDirection === 'desc') {
                                    if (v1 > v2) {
                                        return -1;
                                    } else if (v1 < v2) {
                                        return 1;
                                    }
                                    return 0;
                                }
                                else {
                                    if (v1 > v2) {
                                        return 1;
                                    } else if (v1 < v2) {
                                        return -1;
                                    }
                                    return 0;
                                }
                            }
                        });
                    });
                },
                columnDefs: [
                    {
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\" >' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu style="max-height: 240px;overflow-y: auto;">' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreementCharges(row.entity)">View</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.view" ng-click="grid.appScope.viewAgreementCharges(row.entity)"> {{grid.appScope.localize("View")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.edit && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editAgreement(row.entity)"> {{grid.appScope.localize("Edit")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.edit && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity)" ng-click="grid.appScope.editLeaseAgreement(row.entity)"> {{grid.appScope.localize("Edit")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printAgreement(row.entity)"> {{grid.appScope.localize("Print")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.print" ng-click="grid.appScope.printLeaseAgreement(row.entity)"> {{grid.appScope.localize("Print")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)"> {{grid.appScope.localize("AddReceipt")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)"> {{grid.appScope.localize("AddReceipt")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.view && row.entity.deposit == 0 &&!grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.createDeposit(row.entity)"> {{grid.appScope.localize("CreateDeposit")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.view && grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.createDeposit(row.entity)"> {{grid.appScope.localize("CreateDeposit")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.view && row.entity.deposit == 0" ng-click="grid.appScope.createDeposit(row.entity)"> {{grid.appScope.localize("CreateDeposit")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.extend && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)  && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.extendAgreement(row.entity.id)"> {{grid.appScope.localize("Extend")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.close && row.entity.status == 1 && grid.appScope.locationPermissionClose(row.entity) && grid.appScope.isDeliveryNotPending(row.entity) " ng-click="grid.appScope.closeAgreement(row.entity)"> {{grid.appScope.localize("CloseAgreement")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.close && row.entity.status == 1 && grid.appScope.locationLeasePermissionClose(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.closeAgreement(row.entity)"> {{grid.appScope.localize("CloseAgreement")}}</a></li>' +
                            '      <li><a ng-show="grid.appScope.isAllocationWithChargesTypeEnabled" ng-click="grid.appScope.createCreditNote(row.entity)"> {{grid.appScope.localize("AddCreditNote")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openViewReceiptVoucher(row.entity)"> {{grid.appScope.localize("ViewReceipts")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openViewInvoice(row.entity)"> {{grid.appScope.localize("ViewInvoices")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openviewCustomerModal(row.entity)"> {{grid.appScope.localize("ViewCustomer")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openCustomerSOAModal(row.entity)"> {{grid.appScope.localize("StatementOfAccount")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.features.agreementDocument" ng-click="grid.appScope.openAgreementDocumentsModal(row.entity)"> {{grid.appScope.localize("AgreementDocuments")}}</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.agreementDiscountsPeriodWise" ng-click="grid.appScope.openAgreementDiscountsModal(row.entity)">{{"AgreementDiscounts"}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceVehicle(row.entity)"> {{grid.appScope.localize("ReplaceVehicle")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.replace && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.replaceLeaseVehicle(row.entity)"> {{grid.appScope.localize("ReplaceVehicle")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.replaceDriver && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceDriver(row.entity)"> {{grid.appScope.localize("ReplaceDriver")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.replaceDriver && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPendingLease(row.entity)" ng-click="grid.appScope.replaceDriver(row.entity)"> {{grid.appScope.localize("ReplaceDriver")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.agreementAdditionalChargesAfterClosing && row.entity.status == 2" ng-click="grid.appScope.agreementAdditionalCharges(row.entity)"> {{grid.appScope.localize("AdditionalCharges")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.cutShort && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.cutShortAgreement(row.entity.id)"> {{grid.appScope.localize("CutShort")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.upGrade && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.upgradeAgreement(row.entity)"> {{grid.appScope.localize("Upgrade/ Downgrade")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.isSaleOrderEnable " ng-click="grid.appScope.createOrViewSaleOrders(row.entity)"> {{grid.appScope.localize("SaleOrders")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.isSaleOrderEnable" ng-click="grid.appScope.createOrViewSaleOrders(row.entity)"> {{grid.appScope.localize("SaleOrders")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.unclose && row.entity.status == 2 && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.unCloseAgreement(row.entity)"> {{grid.appScope.localize("UnCloseAgreement")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.unClose &&  row.entity.status == 2 && grid.appScope.locationLeasePermissionClose(row.entity)" ng-click="grid.appScope.unCloseAgreement(row.entity)"> {{grid.appScope.localize("UnCloseAgreement")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 1" ng-if="grid.appScope.permissions.delete && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)"> {{grid.appScope.localize("Delete")}}</a></li>' +
                            '      <li><a ng-show="row.entity.agreementCategory === 2" ng-if="grid.appScope.leasePermissions.delete && row.entity.status == 1 && grid.appScope.locationLeasePermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteLeaseAgreement(row.entity)"> {{grid.appScope.localize("Delete")}}</a></li>' +
                            '      <li><a ng-if="grid.appScope.enableManualAgreementNo" ng-click="grid.appScope.openUpdateManualAgreementNoModal(row.entity)"> {{grid.appScope.localize("UpdateManualAgreementNo")}}</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.permissions.billingHistory" ng-click="grid.appScope.viewBillingHistory(row.entity)" ng-hide="row.entity.status == 8"> {{grid.appScope.localize("BillingHistory")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)"> {{grid.appScope.localize("Log")}}</a></li>' +
                            '      <li><hr style="border-top: 0.2px light black; margin: 0px 0;"></li>' +
                            '      <li><a ng-if="grid.appScope.invoicesPermissions.create && grid.appScope.isRentalEnabled" ng-show="row.entity.agreementCategory === 1" ng-click="grid.appScope.openAddRentalInvoiceModal(row.entity)"> {{grid.appScope.localize("AddInvoice")}}</a></li>' +
                            '      <li><a ng-if="grid.appScope.invoicesPermissions.create && grid.appScope.isLeaseEnabled" ng-show="row.entity.agreementCategory === 2" ng-click="grid.appScope.openAddLeaseInvoiceModal(row.entity)"> {{grid.appScope.localize("AddInvoice")}}</a></li>' +
                            '      <li><a ng-show="row.entity.due < 0" ng-click="grid.appScope.createRefund(row.entity)"> {{grid.appScope.localize("Refund")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAddDebiteNoteModal(row.entity)"> {{grid.appScope.localize("AddDebiteNote")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openViewDebiteNote(row.entity)"> {{grid.appScope.localize("ViewDebitNotes")}}</a></li>' +
                            '      <li><a ng-click="grid.appScope.openUpgradeLPOModal(row.entity)"> {{grid.appScope.localize("UpdateLPO")}}</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.canChangeSalesPerson" ng-click="grid.appScope.editSalesPerson(row.entity)">' + app.localize('ChangeSalesPerson') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isWhatsAppAgreementDueAmountGreateThan1000ManualEnable && row.entity.due > 1000"><a ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMSDueGreaterThan1000') + '</a></li>' +
                            '      <li ng-if="grid.appScope.isEmailAgreementDueAmountGreaterThan1000ManualEnable && row.entity.due > 1000"><a ng-click="grid.appScope.emailDueGreaterThan1000(row.entity)">' + app.localize('EmailDueGreaterThan1000') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgNo'),
                        width: 100,
                        field: 'agreementNo',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        width: 170,
                        field: 'customer',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" style="color:{{row.entity.isBlackListed ? \'red\' : \'inherit\'}}">{{row.entity.customer}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo',
                        width: 100,
                        visible: vm.showContactNo,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '<span ng-if="row.entity.customerContactCategory == 1">{{row.entity.customerMobileNo}}</span>' +
                            '<span ng-if="row.entity.customerContactCategory == 2">{{row.entity.companyContactNo}}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VehicleType'),
                        width: 90,
                        field: 'vehicleTypeName',
                        visible: vm.allowRateTypeChargesWithVehicle,
                    },

                    {
                        name: app.localize('Vehicle'),
                        width: 90,
                        field: 'plateNo',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.plateNo}}</div>' +
                            '</div>'
                    },
                    ... !vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('MakeAndModel'),
                        width: 154,
                        field: 'makeAndModel',
                        //visible: !vm.replacementOfMakeAndModelInGridForVehicles,
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.makeAndModel}}</div>' +
                            '</div>'

                    }] : [],
                    {
                        name: app.localize('Type'),
                        width: 70,
                        field: 'agreementType',
                        cellTemplate: '<div style="text-align:left;margin-left:5px;">{{grid.appScope.getAgreementType(row.entity.agreementType)}}</div>',
                    },

                    {
                        name: app.localize('StartDate'),
                        width: 90,
                        field: 'startDate',
                        cellTemplate: '<div style="margin-left:5px;">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>'
                    },
                    {
                        name: app.localize('EndDate'),
                        width: 90,
                        field: 'endDate',
                        cellTemplate: '<div style="margin-left:5px;">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>'
                    },
                    {
                        name: app.localize('TotalDays'),
                        width: 90,
                        field: 'totaldays',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{row.entity.totalDays}}</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 90,
                        field: 'status',
                        cellTemplate: '<div style="text-align:center;">' +
                            '<span  ng-if="row.entity.status === 1" style="color:rgb(60, 179, 113);">{{grid.appScope.getStatus(row.entity.status)}}</span>' +
                            '<span  ng-if="row.entity.status === 2" style="color:rgb(255, 0, 0);">{{grid.appScope.getStatus(row.entity.status)}}</span>' +
                            '<span  ng-if="row.entity.status === 8" style="color:rgb(0, 0, 255);">{{grid.appScope.getStatus(row.entity.status)}}</span>' +
                            '</div>'

                    },
                    {
                        name: app.localize('RentRate'),
                        width: 90,
                        field: 'rentRate',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.rentRate, 2)}}</div>',
                    },
                    {
                        name: app.localize('Charges'),
                        width: 90,
                        field: 'charges',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.charges)}}</div>'
                    },
                    {
                        name: app.localize('Salik'),
                        width: 70,
                        field: 'salik',
                        type: 'number',
                        visible: 'grid.appScope.isSalikModuleEnabled',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right "><a ng-click="grid.appScope.showTollsDetail(row.entity.id)">{{grid.appScope.CurrencyFormate(row.entity.salik)}}</a></div>'
                    },
                    {
                        name: app.localize('Darb'),
                        width: 70,
                        field: 'darb',
                        type: 'number',
                        visible: 'grid.appScope.isDarbModuleEnabled',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right"><a ng-click="grid.appScope.showDarbDetail(row.entity.id)">{{grid.appScope.CurrencyFormate(row.entity.darb)}}</a></div>'
                    },
                    {
                        name: app.localize('Parking'),
                        width: 70,
                        field: 'parking',
                        type: 'number',
                        visible: vm.showParkingChargesInAgreementDashboard,
                        cellTemplate: '<div style="margin-right:5px;" class="text-right"><a ng-click="grid.appScope.showParkingDetail(row.entity.id)">{{grid.appScope.CurrencyFormate(row.entity.parking)}}</a></div>'
                    },
                    {
                        name: app.localize('Fines'),
                        width: 70,
                        field: 'fines',
                        type: 'number',
                        visible: 'grid.appScope.isFineModuleEnabled',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right"><a ng-click="grid.appScope.showFinesDetail(row.entity.id)">{{grid.appScope.CurrencyFormate(row.entity.fines)}}</a></div>'
                    },
                    {
                        name: app.localize('Discount'),
                        width: 90,
                        field: 'discount',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;color:red;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.discount)}}</div>'
                    },
                    {
                        name: app.localize('Tax'),
                        width: 90,
                        field: 'tax',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.tax)}}</div>'
                    },
                    {
                        name: app.localize('CreditNote'),
                        width: 90,
                        field: 'creditNote',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;color:red;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.creditNote)}}</div>'
                    },
                    {
                        name: app.localize('Total'),
                        width: 90,
                        field: 'total',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right"><a ng-click="grid.appScope.viewAgreementCharges(row.entity)">{{grid.appScope.CurrencyFormate(row.entity.total)}}</a></div>'
                    },
                    {
                        name: app.localize('Invoiced'),
                        width: 90,
                        field: 'invoiced',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.invoiced)}}</div>'
                    },
                    {
                        name: app.localize('Received'),
                        width: 90,
                        field: 'received',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right"><a ng-click="grid.appScope.openForViewReceivedDetails(row.entity)"> {{grid.appScope.CurrencyFormate(row.entity.received)}}</a></div>'
                    },
                    {
                        name: app.localize('Refund'),
                        width: 90,
                        field: 'refund',
                        type: 'number',
                        cellTemplate: '<div style="margin-right:5px;" class="text-right">{{grid.appScope.CurrencyFormate(row.entity.refund)}}</div>'
                    },
                    {
                        name: app.localize('Due'),
                        width: 90,
                        field: 'due',
                        type: 'number',
                        cellTemplate:
                            '<div style="margin-right:5px;color:red;" class="text-right">'
                            + '<span ng-if="row.entity.status != 8"> {{ grid.appScope.CurrencyFormate(row.entity.due) }} </span>'
                            + '<span ng-if="row.entity.status == 8"> 0 </span>'
                            + '</div >'
                    },
                    {
                        name: app.localize('Deposit'),
                        width: 90,
                        field: 'deposit',
                        type: 'number',
                        cellTemplate:
                            '<div style="margin-right:5px;" class="text-right">'
                            + '<a ng-if="grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.openViewDepositModal(row.entity)">{{grid.appScope.CurrencyFormate(row.entity.deposit)}}</a>'
                            + '<a ng-if="!grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.openViewSingleDepositModal(row.entity.depositId, row.entity.id)"> {{grid.appScope.CurrencyFormate(row.entity.deposit)}}</a>'
                            + '</div>'

                    },
                    {
                        name: app.localize('DepDue'),
                        width: 90,
                        field: 'depositDue',
                        type: 'number',
                        cellTemplate:
                            '<div style="margin-right:5px;" class="text-right">'
                            + '<a ng-if="row.entity.deposit > 0 && grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.openViewDepositModal(row.entity)"> {{grid.appScope.CurrencyFormate(row.entity.depositDue)}}</a>'
                            + '<a ng-if="row.entity.deposit > 0 && !grid.appScope.isAddMultipleDepositsOnAgreement" ng-click="grid.appScope.openViewSingleDepositModal(row.entity.depositId, row.entity.id)"> {{grid.appScope.CurrencyFormate(row.entity.depositDue)}}</a>'
                            + '<a ng-if="!row.entity.deposit">0</a>'
                            + '</div>'

                    },
                    ...vm.replacementOfMakeAndModelInGridForVehicles ? [{
                        name: app.localize('MakeAndModel'),
                        width: 154,
                        field: 'makeAndModel',
                        //visible: !vm.replacementOfMakeAndModelInGridForVehicles,
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.makeAndModel}}</div>' +
                            '</div>'

                    }] : [],

                    //{
                    //    name: app.localize('PoNo'),
                    //    width: 90,

                    //    field: 'poNo',

                    //},
                    //{
                    //    name: app.localize('Type'),
                    //    width: 70,
                    //    cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.agreementTypeText)}}</div>',
                    //    field: 'agreementType'
                    //},
                    //{
                    //    name: app.localize('VehicleType'),
                    //    field: 'vehicleId',
                    //    width: 90,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.tariffGroup.title}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Vehicle'),
                    //    field: 'vehicleId',
                    //    width: 80,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('MakeAndModel'),
                    //    field: 'vehicleId',
                    //    width: 150,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.makeAndModel}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('PermanentVehicle'),
                    //    field: 'permanentVehicleId',
                    //    width: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.permanentVehicle.plateNo}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Notes'),
                    //    field: 'notes',
                    //    width: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{row.entity.notes}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('CustomerType'),
                    //    field: 'customer.contactType',
                    //    width: 90,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getContactType(row.entity.customer.contactCategory)}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Customer'),
                    //    field: 'customer.name',
                    //    width: 200,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.customer.nameToShow}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Driver'),
                    //    field: 'driver.name',
                    //    width: 90,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver.name}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('StartDate'),
                    //    field: 'startDate',
                    //    width: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                    //        '</div>'

                    //},
                    //{
                    //    name: app.localize('EndDate'),
                    //    field: 'endDate',
                    //    width: 120,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                    //        '</div>'
                    //},
                    //{
                    //    name: app.localize('Status'),
                    //    width: 90,
                    //    cellTemplate: '<div style="text-align:left;margin-left:5px""><span ng-if="row.entity.isPreClosed">Pre-</span>{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                    //    field: 'status'
                    //},
                    //{
                    //    name: app.localize('Location'),
                    //    field: 'locationId',
                    //    width: 80,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                    //        '</div>'
                    //}
                ],
                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = "agreementNo desc";
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }
                //        debugger;
                //    });
                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;
                //        debugger;
                //        $scope.gridOptions.data = vm.data.agreements.slice(vm.filters.skipCount, pageSize);
                //    });
                //},
                data: []
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            commonAgreementService.sendWhatsAppSMSWhenDueGreaterThan1000({ id: whatsapp.id, due: whatsapp.due }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.emailDueGreaterThan1000 = function (email) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            commonAgreementService.sendEmailWhenDueGreaterThan1000({ id: email.id, due: email.due }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            function initializeFilters() {
                initDate();
                //getAgreementTypes();
                getStatuses();

                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                //vm.searchAgreements();
                getLocationsActiveAndInActive();
            }

            //vm.checkingPressedKey = function (keyEvent) {
            //    
            //    if (keyEvent.which == 13) {
            //        keyPress = false;
            //        vm.searchAgreements();
            //    }

            //}

            function init() {
                initializeFilters();
                vm.searchAgreements();
                vm.searchUsersWithDesignation();
            }

            init();
        }
    ]);
