// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:265727-266258
appModule.controller('tenant.views.dailyLeaseRevenueReport.index', ['abp.services.app.directory', 'abp.services.app.commonAgreement',
        'utilities', 'abp.services.app.commonLookup', 'abp.services.app.saleOrigin', 'abp.services.app.chargesSetting',
        function (directoryService, commonAgreementService, utilities, commonLookupService, saleOriginService, chargesSettingService) {

            var vm = this;
            vm.agreementsData = {};
            vm.statuses = null;

            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.searchSaleOrigin = function ($select) {
                if (!$select.search) return;
                return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
                    vm.saleOrigins = response.data.items;
                });
            };
            vm.clearSaleOrigin = function () {
                vm.filters.saleOrigin = null;
                vm.filters.saleOriginId = null;
            };
            vm.agreementTypes = [
                
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];

            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements')
            };
            var allowedChargeTypes = {
                1: true,
                2: true,
                19: true,
                23: true,
                26: true,
                27: true,
                52: true,
                53: true,
                54: true,
                55: true
            };
            vm.getDiscountedRate = function (rate, discountPercent) {
                return utilities.round(rate - (rate * (discountPercent / 100)), 2);
            };

            vm.agreementCategories = [
                { type: "Rental", id: 1 }
            ];
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Open") },
                    { id: 2, name: app.localize("Closed") }
                ];

            };
            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }
            if (abp.features.isEnabled("CRS.Chauffeur")) {
                vm.agreementCategories.push({ type: "Chauffeur", id: 4 });
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
            if (abp.features.isEnabled("CRS.SalesModule"))
                vm.modules.push({ name: 'Sales', id: 9 });
            //if (abp.features.isEnabled("ERS.Lease"))
            //    vm.modules.push({ name: 'Equipment Lease', id: 8 });
            vm.enabledModule = vm.modules.length > 0 ? vm.modules[0].id : null;

            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            vm.statuses = null;
            vm.disableDate = false;
            vm.customers = [];
            vm.vehicleTypes = [];
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                salesPerson: null,
                agreementCategory: null,
                plateNo: '',
                saleOriginId: null,
                vehicleType: null,
                locationId: ''
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
            function getChargesSettings() {

                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: vm.enabledModule })
                    .success(function (data) {

                        var allowedChargeTypes = [1, 2, 19, 23, 26, 27, 52, 53, 54, 55];

                        var items = [];
                        if (data && data.items && angular.isArray(data.items)) {
                            items = data.items;
                        }

                        vm.chargesSettings = items.filter(function (item) {
                            return item && allowedChargeTypes.indexOf(item.chargesTypeId) !== -1;
                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function PopulateVehicleTypes() {
                isRentalEnabled = abp.features.isEnabled("CRS.Rental");
                isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
                isLimoEnabled = abp.features.isEnabled("CRS.Limo");

                //---------------------------------------------------------------------
                //---------------------------------------------------------------------
                if (isRentalEnabled) vm.vehicleTypes.push({ key: 'Rental', value: 1 });
                if (isLeaseEnabled) vm.vehicleTypes.push({ key: 'Lease', value: 2 });
                if (isRentalEnabled || isLeaseEnabled)
                    vm.vehicleTypes.push({ key: 'Replacement', value: 3 });
                if (isLimoEnabled) vm.vehicleTypes.push({ key: 'Limousine', value: 4 });
                vm.vehicleTypes.push({ key: 'Staff', value: 6 });
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.searchUsers = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.users = response.data.items;
                });
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

            vm.getAgreementsByCategory = function (id) {
                if (id === 1)
                    return "Rental";
                else if (id === 2)
                    return "Lease";
                else if (id === 4)
                    return "Chauffeur";
            };
            vm.getFleetType = function (id) {
                if (id === 1)
                    return "Rental";
                else if (id === 2)
                    return "Lease";
                else if (id === 3)
                    return "Replacement";
                else if (id === 4)
                    return "Limousine";
                else if (id === 5)
                    return "Workshop";
                else if (id === 6)
                    return "Staff";
            };

            vm.statusChanged = function () {
                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                return utilities.round(value, 2);
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.getAgreementTypeName = function (id) {
                if (id === 1) {
                    return "Daily";
                }
                else if (id === 2) {
                    return "Weekly";
                }
                else if (id === 3) {
                    return "Monthly";
                }
                else {
                    return "";
                }
            };
            vm.getChargesRateType = function (id) {
                if (id === 1) {
                    return "/Daily";
                }
                else if (id === 2) {
                    return "/Weekly";
                }
                else if (id === 3) {
                    return "/Monthly";
                }
                else {
                    return "";
                }
            };

            vm.prepareAgreementCharges = function (agreement) {
                if (!agreement.charges || agreement._perDayPrepared) return;

                var divisor = 30; // For lease (per month)
                
                var rent = 0;
                var totalOtherCharges = 0;

                // Sum charges
                for (var i = 0; i < agreement.charges.length; i++) {
                    var c = agreement.charges[i];
                    if (!c.accepted) continue;

                    if (!allowedChargeTypes[c.chargesTypeId]) continue; //Filter charges

                    var chargeAmount = c.rate || 0;

                    if (c.chargesTypeId === 1) rent += chargeAmount;
                    else totalOtherCharges += chargeAmount;
                }

                agreement._rentPerDay = vm.roundingforView(rent / divisor || 0);
                agreement._chargesPerDay = vm.roundingforView(totalOtherCharges / divisor || 0);
                agreement._rpd = vm.roundingforView(
                    (agreement._rentPerDay || 0) + (agreement._chargesPerDay || 0)
                );

                agreement._perDayPrepared = true;
            };

            vm.prepareAllAgreements = function () {
                if (!vm.agreementsData) return;

                angular.forEach(vm.agreementsData, function (agreement) {
                    vm.prepareAgreementCharges(agreement);
                });
            };

            vm.getRentPerDay = function (agreement) {
                return isNaN(agreement._rentPerDay) ? 0 : agreement._rentPerDay;
            };

            vm.getChargesPerDay = function (agreement) {
                return isNaN(agreement._chargesPerDay) ? 0 : agreement._chargesPerDay;
            };

            vm.getRPD = function (agreement) {
                var rent = agreement._rentPerDay || 0;
                var charges = agreement._chargesPerDay || 0;

                rent = parseFloat(rent) || 0;
                charges = parseFloat(charges) || 0;

                return vm.roundingforView(rent + charges);
            };

            vm.getChargeAmount = function (agreement, chargesTypeId) {
                if (!agreement.charges || agreement.charges.length === 0)
                    return 0;

                var charge = agreement.charges.find(function (c) {
                    return c.chargesTypeId === chargesTypeId && c.accepted === true;
                });

                if (!charge)
                    return 0;

                if (charge.chargesTypeId === 1) {
                    return vm.roundingforView(charge.rate);
                }

                // Get divisor based on agreement type
                var divisor = 30;

                var perDayCharge = charge.rate / divisor;

                return vm.roundingforView(perDayCharge);

            };

            vm.exportToExcel = function (tableID) {
                //var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('TotalDebit') + '</b>' + ': ' + vm.formatNumber(vm.rounding(vm.trialBalance.totalDebit)) + "<b>" + '<br/>' + app.localize('TotalCredit') + "</b>" + ': ' + vm.formatNumber(vm.rounding(vm.trialBalance.totalCredit)) + "<b>" + "</div><br/>"
                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0; j < tab.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'dailyLeaseRevenueExport.xls';
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

            vm.getAgreements = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                commonAgreementService.getAllLeaseAgreementsReport(vm.filters).success(function (data) {

                    vm.agreementsData = data.items;
                    vm.prepareAllAgreements();
                    vm.calculateTotals(); 
                    angular.forEach(vm.agreementsData, function (agreement) {
                        agreement.totalDays = vm.totalDaysAndTime(agreement);
                    });
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.totalDaysAndTime = function (agreement) {
                if (!agreement ||
                    !agreement.startDate ||
                    !agreement.endDate) {
                    return;
                }

                var startDate = moment(agreement.startDate);
                var endDate = moment(agreement.endDate); // local time

                if (startDate.isValid() && endDate.isValid()) {

                    var totalHours = endDate.diff(startDate, 'hours', true);

                    var totalDays = Math.floor(totalHours / 24);

                    var remainingHours = totalHours - (totalDays * 24);

                    if (remainingHours >= 23.9067) {
                        totalDays += 1;
                        remainingHours = 0;
                    }

                    vm.remainingHrs = Math.round(remainingHours * 100) / 100;

                    return totalDays;
                }
                else
                {
                    return null;
                }
            };
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            }
            vm.calculateTotals = function () {
                vm.totalRentPerDay = 0;
                vm.totalChargesPerDay = 0;
                vm.totalRPD = 0;
                vm.totalRentCharge = 0;

                if (!vm.agreementsData) return;

                angular.forEach(vm.agreementsData, function (agreement) {

                    vm.totalRentPerDay += vm.getRentPerDay(agreement) || 0;
                    vm.totalChargesPerDay += vm.getChargesPerDay(agreement) || 0;
                    vm.totalRPD += vm.getRPD(agreement) || 0;

                    vm.totalRentCharge += vm.getChargeAmount(agreement, 1) || 0;
                });

                vm.totalRentPerDay = vm.roundingforView(vm.totalRentPerDay);
                vm.totalChargesPerDay = vm.roundingforView(vm.totalChargesPerDay);
                vm.totalRPD = vm.roundingforView(vm.totalRPD);
                vm.totalRentCharge = vm.roundingforView(vm.totalRentCharge);
            };
            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("Open");
                else if (id == 2)
                    return app.localize("Closed");
                else
                    return "";
            };
            
            initializeFilters();

            function initializeFilters() {
                initDate();
                getChargesSettings();

                getStatuses();
                PopulateVehicleTypes();
                getLocations();
            }

        }
    ]);
