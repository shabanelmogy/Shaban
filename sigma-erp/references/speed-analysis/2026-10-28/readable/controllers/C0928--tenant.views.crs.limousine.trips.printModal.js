// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:253029-253380
appModule.controller('tenant.views.crs.limousine.trips.printModal', ['$scope', '$stateParams', 'appSession', '$filter', 'utilities', 'abp.services.app.limoTripPrint', 'abp.services.app.limoTripSearch', 'abp.services.app.company', 'abp.services.app.currency',
        function ($scope, $stateParams, appSession, $filter, utilities, limoTripPrintService, limoTripSearchService, companyService, currencyService) {
            var vm = this;

            vm.tenantName = appSession.tenant.name;
            vm.userName = appSession.user.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm A - ddd';
            vm.checklist = null;
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isShowTripSafetyCheckList = abp.features.isEnabled("CRS.LimoSafetyChecks");
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.filter = {
                filter: '',
            };
            vm.customerCurrencyId = null;
            vm.customerCurrency = null;
            vm.permissions = {
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
            };
            vm.trn = '';
            vm.rounding = function (value) {
                if (value == null) return null;
                value = utilities.round(value, 2); // Round the value to 2 decimal places
                return Number(value).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };

            var tripId = 0;
            //if pop-up print
            //if ($scope.$parent) {
            //    if ($scope.$parent.vmMain && $scope.$parent.vmMain.tripId)
            //        tripId = $scope.$parent.vmMain.tripId;
            //}

            ////if through url print
            //if (tripId == 0 && !isNaN($stateParams.query)) {
            //    tripId = $stateParams.query;
            //}

            if ($scope.$parent !== null) {
                if ($scope.$parent.tripId) {
                    tripId = $scope.$parent.tripId.id;
                    //  vm.printHeader = !($scope.$parent.invoiceId.printHeader);
                }
            }
            if (tripId <= 0) {
                if (!isNaN($stateParams.query)) {
                    tripId = $stateParams.query;
                }
            }

            vm.getUserName = function (userId) {
                userService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getTripStatus = function (status) {
                if (status == '')
                    return '';
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                if (status == 7)
                    return app.localize("DriverAccepted");
                if (status == 8)
                    return app.localize("DriverRejected");
                if (status == 9)
                    return app.localize("Assigned");
                if (status == 10)
                    return app.localize("Tentative");
            };

            vm.getAmountInWords = function (charges) {
                if (charges != null && charges > 0) {
                    // Convert charges to words
                    let amountInWords = utilities.toWords(charges);

                    // Capitalize the first letter of each word
                    amountInWords = amountInWords.replace(/\b\w/g, function (char) {
                        return char.toUpperCase();
                    });
                    return amountInWords;
                }
                return '';
            };

            vm.onImageError = function () { vm.imgError = true; };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.getOnlyTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm A');
                } else {
                    return "";
                }
            };
            vm.getOnlyDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD/MM/YYYY -ddd');
                } else {
                    return "";
                }
            };

            vm.getDateDifference = function (pickupDateTime, dropOffDateTime) {
                var pickupDate = new Date(pickupDateTime);
                var dropOffDate = new Date(dropOffDateTime);

                var timeDiff = dropOffDate - pickupDate;
                var hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

                var days = Math.floor(hoursDiff / 24);

                return (days + 1);
            };

            vm.getTimeDifference = function (pickupDateTime, dropOffDateTime) {
                var pickupDate = new Date(pickupDateTime);
                var dropOffDate = new Date(dropOffDateTime);

                // Get the total difference in milliseconds
                var timeDiff = dropOffDate - pickupDate;

                // Convert milliseconds to minutes
                var minutesDiff = Math.floor(timeDiff / (1000 * 60));

                // Calculate hours and minutes
                var hours = Math.floor(minutesDiff / 60);
                var minutes = minutesDiff % 60;

                // Round up to the nearest hour if minutes are 59 or greater
                if (minutes >= 59) {
                    hours += 1;
                    minutes = 0;
                }

                // Convert to AM/PM format
                var pickupHours = pickupDate.getHours();
                var dropOffHours = dropOffDate.getHours();
                var pickupMinutes = pickupDate.getMinutes();
                var dropOffMinutes = dropOffDate.getMinutes();

                var pickupAMPM = pickupHours >= 12 ? 'PM' : 'AM';
                var dropOffAMPM = dropOffHours >= 12 ? 'PM' : 'AM';

                pickupHours = pickupHours % 12 || 12; // Convert to 12-hour format
                dropOffHours = dropOffHours % 12 || 12;

                // Format pickup and drop-off times
                var formattedPickup = pickupHours + ':' + (pickupMinutes < 10 ? '0' : '') + pickupMinutes + ' ' + pickupAMPM;
                var formattedDropOff = dropOffHours + ':' + (dropOffMinutes < 10 ? '0' : '') + dropOffMinutes + ' ' + dropOffAMPM;

                // Return the rounded difference along with formatted times
                return hours + " hrs, " + (minutes < 10 ? '0' : '') + minutes + " mins";
            };





            //vm.CurrencyFormate = function (amount) {
            //    if (amount == null) return null;
            //    return amount.toLocaleString('en');
            //};

            vm.getTimeDiffFromDate = function (startDate, endDate) {
                var pickUptime = moment(startDate).startOf('minute');
                var dropOfftime = moment(endDate).startOf('minute');
                var result = utilities.round((dropOfftime.diff(pickUptime, 'hours', true)), 2);
                if (result < 0) {
                    result = 0;
                }
                return result;
            };



            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    format = vm.dateTimeFormat;
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.sumChargesTax = function () {
                if (vm.trip.tripCharges == null) return;
                vm.totalCharges = 0;
                vm.totalTax = 0;
                vm.totalWithTax = 0;
                vm.trip.tripCharges.forEach(function (value) {
                    if (value.charges > 0 || value.charges < 0)
                        vm.totalCharges = vm.totalCharges + parseFloat(value.charges);
                    vm.trip.amountInWords = utilities.toWords(vm.trip.charges);
                    if (value.tax > 0 || value.tax < 0) {
                        vm.totalTax += utilities.round(value.tax, 2);
                    }

                });

                vm.totalCharges = utilities.round(vm.totalCharges, 2);
                vm.totalTax = utilities.round(vm.totalTax, 2);
                vm.totalWithTax = utilities.round((vm.totalCharges + vm.totalTax) / 1, 2);

            };

            // Assuming vm.mainList and vm.trueList are already populated
            vm.checkListData = [];

            // Function to compare mainList and trueList
            vm.compareLists = function () {
                // Check if vm.trip and vm.trip.safetyCheck exist, and if safetyCheckList is an array
                if (vm.trip && vm.trip.safetyCheck && Array.isArray(vm.trip.safetyCheck.safetyCheckList) && vm.trip.safetyCheck.safetyCheckList.length > 0) {
                    vm.checkListData = vm.checklist.map(mainItem => {
                        // Check if the item exists in safetyCheckList
                        const isTicked = vm.trip.safetyCheck.safetyCheckList.some(trueItem => trueItem.name === mainItem.name);
                        return {
                            name: mainItem.name,
                            tickedOnCheckList: isTicked // true if found, false otherwise
                        };
                    });
                } else {
                    // If safetyCheckList is null or empty, show all checklist items
                    vm.checkListData = vm.checklist.map(mainItem => ({
                        name: mainItem.name,
                        tickedOnCheckList: false // Default to false
                    }));
                }
            };

            // Function to check if an item is ticked
            function isTickedOnCheckListItem(checklistItem) {
                if (vm.trip && vm.trip.safetyCheck && Array.isArray(vm.trip.safetyCheck.safetyCheckList)) {
                    var found = $filter("filter")(vm.trip.safetyCheck.safetyCheckList, function (item) {
                        return item.name.toLowerCase().trim() === checklistItem.name.toLowerCase().trim();
                    }, true);
                    return found.length > 0; // Return true if found
                }
                return false;
            }

            // Function to fetch checklist data
            function getChecklist() {
                if (vm.isShowTripSafetyCheckList) {
                    limoTripPrintService.getCheckList({}).success(function (data) {
                        vm.checklist = data.items;
                        vm.compareLists(); // Ensure checklist is processed correctly
                    });
                }
            }

            vm.init = function () {
                vm.loading = true;
                limoTripPrintService.getTripForPrint({ id: tripId }).success(function (data) {
                    var autoIncrementNo = 1;
                    vm.trip = data;

                    angular.forEach(vm.trip.tripCharges, function (item) {
                        if (item.charges > 0) {
                            item.srNo = autoIncrementNo;
                            autoIncrementNo++;
                        }
                    });
                    vm.trn = vm.trip.location.taxId;
                    if (vm.trip.signature) {
                        vm.urlWithToken = vm.trip.signature.url;
                    }

                    if (vm.trip.customerSignature) {
                        vm.urlWithToken = vm.trip.customerSignature.url;
                    }
                    vm.sumChargesTax();
                    if (appSession.tenant.tenancyName.toLowerCase() == 'sixtpakistan') {
                        vm.limoFare = vm.trip.tripCharges.filter(e => e.chargesTypeId == 24)[0];
                        vm.limoFare.summedCharges = 0.0;
                        angular.forEach(vm.limoFare.calcDetail, function (item) {
                            vm.limoFare.summedCharges += item.charges;
                        });
                        if (vm.limoFare.summedCharges > 0) {
                            vm.trip.tripCharges = vm.trip.tripCharges.filter(e => e.chargesTypeId != 24);
                            vm.trip.amountInWords = utilities.toWords(vm.trip.charges);
                        };
                    }
                    if (vm.isMultiCurrencyEnabled) {
                        vm.filter = {
                            filter: vm.trip.customer.name
                        };

                        companyService.getCompanies(vm.filter)
                            .success(function (data) {
                                vm.customer = data.items;

                                if (vm.customer && vm.customer.length > 0) {
                                    companyService.getCompanyForEdit({ id: vm.customer[0].id })
                                        .success(function (result) {
                                            vm.customerCurrencyId = result.currencyId;
                                            currencyService.getCurrencyForEdit({ id: vm.customerCurrencyId })
                                                .success(function (item) {
                                                    vm.customerCurrency = item;
                                                    if (vm.trip.charges > 0) {
                                                        var currencyName = vm.customerCurrency ? vm.customerCurrency.name : null;
                                                        var decimalName = vm.customerCurrency ? vm.customerCurrency.decimalName : null;
                                                        vm.trip.amountInWords = utilities.toWords(vm.trip.charges, currencyName, decimalName);
                                                    }
                                                })

                                        })
                                }
                            })
                    }

                    if (vm.isShowTripSafetyCheckList) {
                        getChecklist();
                    }
                }).finally(function () {
                    vm.loading = false;

                });
            };

        }
    ]);
