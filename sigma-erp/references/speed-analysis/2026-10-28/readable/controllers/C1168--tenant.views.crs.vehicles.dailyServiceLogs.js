// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:308324-308568
appModule.controller('tenant.views.crs.vehicles.dailyServiceLogs', [
        '$scope', '$uibModal', 'abp.services.app.vehicleServiceLog', 'abp.services.app.directory', 'appSession', 'utilities',
        function ($scope, $uibModal,vehicleServicelogService, directoryService, appSession, utilities) {

            var vm = this;
            vm.allInsurance = false;
            vm.allRegistration = false;
            vm.isRealEstatePropertyEnabled = abp.features.isEnabled('CRS.FleetManagement_ServiceLog');
            vm.vehicleAlertsService = [];
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.tenantName = appSession.tenant.tenancyName;
            vm.filters = {
                
                //date: moment().toDate()
            };

            $scope.$watch('vm.filters.date', function (newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    // Preserve the selected date and update the time part to the current time
                    var currentTime = new Date();
                    newVal.setHours(currentTime.getHours());
                    newVal.setMinutes(currentTime.getMinutes());
                    newVal.setSeconds(currentTime.getSeconds());
                }
            });

            vm.getTime = function (date) {
                const dateObj = new Date(date);

                return dateObj.toLocaleTimeString();
            }
            vm.getDateAndTime = function (date) {

                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.roundingforView = function (value) {
                if (isNaN(value) || value == null)
                    return "";
                else {
                    //var roundedValue = utilities.roundforView(value, 0);
                    var roundedValue = Math.round(value);
                    return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            };

            vm.getJobType = function (id) {
                if (id == 1)
                    return app.localize('RoutineService');
                else if (id == 2)
                    return app.localize('MechanicalService');
                else if (id == 3)
                    return app.localize('ElectricalService');
                else if (id == 4)
                    return app.localize('DentingAndPainting');
                else if (id == 5)
                    return app.localize('AccidentService');
                else if (id == 6)
                    return app.localize('ACService');
                else if (id == 7)
                    return app.localize('BreakdownService');
                else if (id == 8)
                    return app.localize('TyreService');
                else if (id == 9)
                    return app.localize('UnitMaintenance');
                else if (id == 10)
                    return app.localize('UnitRepair');
                else if (id == 11)
                    return app.localize('RegularLubrications');
                else if (id == 12)
                    return app.localize('BodyShop');
                else if (id == 13)
                    return app.localize('InspectionJob');
                else if (id == 14)
                    return app.localize('MakeReadyForSaleOrRent');
                else if (id == 15)
                    return app.localize('Polishing');
                else if (id == 16)
                    return app.localize('CarWash');
                else if (id == 17)
                    return app.localize('Others');
            }

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };
            vm.exportToExcel = function (tableId) {

                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'CashFlowStatement.xls';
                a.click();
            };
            vm.exportPageToExcel = function (containerId) {
                var container = document.getElementById(containerId);

                if (!container) {
                    alert("Export content not found!");
                    return;
                }

                // Clone the content
                var clone = container.cloneNode(true);

                // Remove buttons, inputs, form controls, and no-export elements
                var elementsToRemove = clone.querySelectorAll('button, input, select, textarea, .no-export');
                elementsToRemove.forEach(function (el) {
                    el.parentNode.removeChild(el);
                });

                // Clean up Angular bindings like {{...}}
                var allElements = clone.querySelectorAll('*');
                allElements.forEach(function (el) {
                    el.innerHTML = el.innerHTML.replace(/{{[^}]+}}/g, '');
                });

                // Extract rendered date and tenant name
                var dateElement = document.querySelector(".date-title");
                var dateText = dateElement ? dateElement.innerText.trim() : '';

                // Build the Excel HTML
                var html = "<html><head><meta charset='utf-8'></head><body>";
                html += "<h2 style='text-align:center;'>ONE STOP AUTO CARE</h2>";

                if (dateText) {
                    html += "<h3 style='text-align:center;'>" + dateText + "</h3>";
                }

                html += "<table border='1' style='border-collapse:collapse;width:100%'>" + clone.innerHTML + "</table></body></html>";

                // Convert to Blob and trigger download
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(html))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'FullReport_' + (new Date()).toISOString().split('T')[0] + '.xls';
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
            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/serviceLogReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getDailyServiceLog = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                debugger
                vehicleServicelogService.getDailyServiceLogs(vm.filters).success(function (data) {
                    
                    vm.result = data
                    vm.dailyServiceLogs = vm.result.servicesList;
                }).finally(function () {
                    vm.loading = false;
                });

            };
            function init() {
                //vm.getDailyServiceLog();
                //getServiceItems();
            }
            init();
        }
    ]);
