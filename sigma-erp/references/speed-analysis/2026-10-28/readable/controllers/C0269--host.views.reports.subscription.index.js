// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:79585-80019
appModule.controller('host.views.reports.subscription.index', [
        '$scope', 'abp.services.app.subscription', 'abp.services.app.commonLookup', 'abp.services.app.currency', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, subscriptionService, commonLookupService, currencyService, utilities, businessDivisionService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.report = [];
            vm.allowDateRange = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.filters = {
                name: "",
                tenancyName: null,
                editionId: null,
                tenantType: 3,
                CreationTime: null,
                isActive: 1,
                restrictedTenants: abp.auth.hasPermission('Pages.Tenants.CanLoginRestrictedTenants'),
                business: null,
                paymentMethodName: null,
                subscriptionValueTypesName: null,
                proposalLicenceType: null,
                invoiced: false
            };
            vm.filters.selectedStatuses = [];
            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 5 },
            //    { id: 3, name: "D1 (UAE)", currency: "AED", tax: 5 },
            //    { id: 4, name: "D2 (UK)", currency: "GBP", tax: 0 },
            //    { id: 2, name: "D3 (USA)", currency: "USD", tax: 0 }
            //];
            vm.businessName = utilities.divisionName();
            vm.billingStatuses = [
                { id: 1, name: "On" },
                { id: 2, name: "Off" },
                { id: 3, name: "Paused" },
                { id: 4, name: "Canceled" }
            ];

            vm.getBillingStatus = function (id) {
                if (id == 1) {
                    return "On";
                }
                else if (id == 2) {
                    return "Off";
                }
                else if (id == 3) {
                    return "Paused";
                }
                else if (id == 4) {
                    return "Canceled";
                }
            }

            vm.currencyName = [
                { id: 1, name: "Dirham", currency: "AED", tax: 5 },
                { id: 2, name: "Dollar", currency: "USD", tax: 0 },
                //{ id: 3, name: "Speed Auto Systems (UAE)", currency: "AED", tax: 5 },
                { id: 4, name: "Pound", currency: "GBP", tax: 0 },
            ];

            vm.getBusinessName = function (id) {
                return utilities.getDivisionName(id);
            }

            //vm.getBusinessName = function (id) {
            //    if (id == 1) {
            //        return "Karzan Soft (UAE)";
            //    }
            //    else if (id == 2) {
            //        return "Speed Auto System D3 (USA)";
            //    }
            //    else if (id == 3) {
            //        return "Speed Auto Systems D1 (UAE)";
            //    }
            //    else if (id == 4) {
            //        return "Speed Auto Systems D2 (UK)";
            //    }
            //}

            vm.getBusinessCurrency = function (id) {
                if (id == 1) {
                    return "AED";
                }
                else if (id == 2) {
                    return "USD";
                }
                else if (id == 3) {
                    return "AED";
                }
                else if (id == 4) {
                    return "GBP";
                }
            }
            vm.subscriptionValueTypesName = [
                { id: 1, name: "Fixed" },
                { id: 2, name: "Variable" },

            ];

            vm.getsubscriptionValueTypesName = function (id) {
                if (id == 1) {
                    return "Fixed";
                }
                else if (id == 2) {
                    return "Variable";
                }

            }
            vm.paymentMethodName = [
                { id: 1, name: "Cash" },
                { id: 2, name: "DirectDebit" },
                { id: 3, name: "Cheque" },
                { id: 4, name: "CreditCard" },
                { id: 5, name: "GoCardless" },
                { id: 6, name: "Stripe" },
                { id: 7, name: "PayPal" },

            ];

            vm.getpaymentMethodName = function (id) {
                if (id == 1) {
                    return "Cash";
                }
                else if (id == 2) {
                    return "DirectDebit";
                }
                else if (id == 3) {
                    return "Cheque";
                }
                else if (id == 4) {
                    return "CreditCard";
                }
                else if (id == 5) {
                    return "GoCardless";
                }
                else if (id == 6) {
                    return "Stripe";
                }
                else if (id == 7) {
                    return "PayPal";
                }

            }

            vm.tenantTypes = [

                { type: "Trial", id: 1 },
                { type: "Test", id: 2 },
                { type: "Production", id: 3 },
                { type: "Crn", id: 4 },
                { type: "Support", id: 5 }

            ];

            vm.tenantIsActive = [
                { type: "No", id: 0 },
                { type: "Yes", id: 1 }
            ];

            vm.tenantSignupSources = [
                { type: "Unknown", id: 0 },
                { type: "Web App", id: 1 },
                { type: "Mobile App", id: 2 },
                { type: "Manual", id: 3 }
            ];

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            vm.getTentantType = function (tenantType) {

                var type = "";
                if (tenantType == 1) {
                    type = "Trial";

                }
                else if (tenantType == 2) {
                    type = "Test";

                }
                else if (tenantType == 3) {
                    type = "Production";

                }
                else if (tenantType == 4) {
                    type = "Crn";
                }
                else if (tenantType == 5) {
                    type = "Support";
                }

                return app.localize(type);
            };

            vm.getSignupSource = function (signupSource) {
                if (signupSource === 0)
                    return "Unknown";
                else if (signupSource === 1)
                    return "WebApp";
                else if (signupSource === 2)
                    return "MobileApp";
                else if (signupSource === 3)
                    return "Manual";
            };

            vm.subscriptionTypes = [
                { id: 1, name: "Yearly" },
                { id: 2, name: "Monthly" },
                { id: 3, name: "Quarterly" },
                { id: 4, name: "6 Monthly" }
            ];

            vm.getSubscriptionTypeName = function (type) {
                if (type == 1) {
                    return "Yearly";
                }
                else if (type == 2) {
                    return "Monthly";
                }
                else if (type == 3) {
                    return "Quarterly";
                }
                else if (type == 4) {
                    return "6 Monthly";
                }
            }

            vm.getEditionsForCombobox = function () {
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                subscriptionService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.exportSubscriptionReport = function () {
                var tab_text = "<table border='1px'><tr>";
                var j = 0;
                var tab1 = angular.copy(document.getElementById("tblSubsReport")); // id of table
                for (j = 0; j < tab1.rows.length; j++) {
                    if (tab1.rows[j].cells[11])
                        tab1.rows[j].cells[11].remove();
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);


                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'SubscriptionReport.xls';
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

            vm.unCheckInvoicedSub = function (id, invoiced) {
                if (id) {
                    vm.loading = true;
                    subscriptionService.invoicedSubcription({ key: id, value: invoiced })
                        .success(function () {

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }
            }
            vm.unCheckAllInvoiced = function () {
                abp.message.confirm(
                    app.localize('Do you want to Clear Invoiced Flag',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            subscriptionService.clearAllSubscriptionsInvoicedFlag()
                                .success(function () {
                                    abp.notify.success(app.localize('SuccessfullySaved'));
                                    vm.report.forEach(x => {
                                        x.invoiced = false;

                                    })
                                });
                        }
                    }
                );
            };
            vm.getSubscriptionReport = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                subscriptionService.getSubscriptionReport(vm.filters)
                    .success(function (result) {
                        vm.report = result;
                        vm.totalAmount = 0.0;
                        angular.forEach(vm.report, function (row, ind) {
                            if (row.amount > 0) {
                                vm.totalAmount += row.amount;
                            }
                        });
                        
                        var groupedData = vm.report.reduce(function (acc, report) {
                            if (report.subscriptionCurrency != null) {

                                var currencyCode = report.subscriptionCurrency.code;
                                if (!acc[currencyCode]) {
                                    acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0 };
                                }
                                acc[currencyCode].totalAmount += report.totalAmount;
                                return acc;
                            }
                            return acc;
                        }, {});

                        vm.groupAmount = Object.values(groupedData);

                        var groupedMonthlyData = vm.report.reduce(function (acc, report) {
                            if (report.subscriptionCurrency != null) {

                                var currencyCode = report.subscriptionCurrency.code;
                                if (!acc[currencyCode]) {
                                    acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0 };
                                }

                                if (report.subscriptionType == 1) {

                                    acc[currencyCode].totalAmount += report.amount/12;
                                }
                                else if (report.subscriptionType == 2) {

                                    acc[currencyCode].totalAmount += report.amount;
                                }
                                else if (report.subscriptionType == 3) {

                                    acc[currencyCode].totalAmount += report.amount/3;
                                }
                                else if (report.subscriptionType == 4) {

                                    acc[currencyCode].totalAmount += report.amount/6;
                                }
                                return acc;
                            }
                            return acc;
                        }, {});
                        vm.groupMonthlyRR = Object.values(groupedMonthlyData);

                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getbusinessDivisions();
            vm.getEditionsForCombobox();
            //vm.getSubscriptionReport();
        }
    ]);
