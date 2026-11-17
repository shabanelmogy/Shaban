// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:428952-429272
appModule.controller('tenant.views.externalVehiclesControlPanel.reports.agreementsReport.index', ['abp.services.app.directory', 'abp.services.app.externalCommonAgreement',
        'utilities', 'abp.services.app.commonLookup', 'abp.services.app.saleOrigin', 'utilities',
        function (directoryService, externalCommonAgreementService, utilities, commonLookupService, saleOriginService, utilities) {

            var vm = this;
            vm.agreementsData = {};

            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            //vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            //vm.searchSaleOrigin = function ($select) {
            //    if (!$select.search) return;
            //    return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
            //        vm.saleOrigins = response.data.items;
            //    });
            //};
            vm.clearSaleOrigin = function () {
                vm.filters.saleOrigin = null;
                vm.filters.saleOriginId = null;
            };
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];

            vm.permissions = {
            //    viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements')
            };

            vm.getDiscountedRate = function (rate, discountPercent) {
                return utilities.round(rate - (rate * (discountPercent / 100)), 2);
            };

            vm.agreementCategories = [
                { type: "Rental", id: 1 }
            ];

            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }
            if (abp.features.isEnabled("CRS.Chauffeur")) {
                vm.agreementCategories.push({ type: "Chauffeur", id: 4 });
            }

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
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

            vm.getAgreements = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }

                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                externalCommonAgreementService.getAllAgreementsReport(vm.filters).success(function (data) {

                    vm.agreementsData = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
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

            vm.exportToExcel = function () {
                externalCommonAgreementService.exportToExcelAgreementsReport(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    });
            };
            //vm.exportToExcel = function () {
            //    var tab_text = "<table border='1px'><tr>";
            //    var textRange;
            //    var j = 0;
            //    var tab1 = document.getElementById('agreementsTable'); // id of table
            //    for (j = 0; j < tab1.rows.length; j++) {

            //        tab_text = tab_text;
            //        tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            //    }
            //    tab_text = tab_text + "</table>";

            //    var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            //    var blobUrl = URL.createObjectURL(blob);

            //    var a = document.createElement('a');
            //    a.href = blobUrl;
            //    a.download = 'AgreementsReport.xls';
            //    a.click();

            //};

            //function b64toBlob(b64Data, contentType, sliceSize) {
            //    contentType = contentType || '';
            //    sliceSize = sliceSize || 512;

            //    var byteCharacters = atob(b64Data);
            //    var byteArrays = [];

            //    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            //        var slice = byteCharacters.slice(offset, offset + sliceSize);

            //        var byteNumbers = new Array(slice.length);
            //        for (var i = 0; i < slice.length; i++) {
            //            byteNumbers[i] = slice.charCodeAt(i);
            //        }

            //        var byteArray = new Uint8Array(byteNumbers);

            //        byteArrays.push(byteArray);
            //    }

            //    var blob = new Blob(byteArrays, { type: contentType });
            //    return blob;
            //}

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            }

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
                getStatuses();
                PopulateVehicleTypes();
                getLocations();
            }

        }
    ]);
