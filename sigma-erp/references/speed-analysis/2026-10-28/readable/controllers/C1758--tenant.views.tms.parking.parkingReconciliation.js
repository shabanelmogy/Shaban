// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:480640-480885
appModule.controller('tenant.views.tms.parking.parkingReconciliation', [
        '$scope', 'abp.services.app.salikAccount', 'chromeExtDownloader', 'abp.services.app.parkingTicket',
        function ($scope, salikAccountService, chromeExtDownloader, parkingTicketService) {
            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().format(abp.setting.get("App.General.DateFormat"));
            let downloadUnchargedSalikTolls = abp.setting.get("App.General.Salik.DownloadUnchargedSalikTolls") == 'True' ? true : false;

            vm.dateRangeCountBreakup = [];

            vm.salikTolls = [];
            vm.salikTolls.TotalCount = null;
            vm.salikAccounts = [];
            vm.selectedSalikAccounts = [];
            vm.daysToReconcile = [];
            vm.filters = {};
            vm.totalCount = 0;
            vm.totalLiveCount = 0;

            vm.tollStatus = {
                abuDhabi: {},
                dubai: {
                    isDownloading: false,
                    progress: 0,
                    status: '',
                    error: null
                }
            };

            vm.tollCountError = '';

            var salikFeatureEnabled = abp.features.isEnabled('TMS.Salik.Dubai');

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');
            };

            vm.enableDebugging = true;
            const getParkingTicketsBreakup = function (preserveOnlineCount, callback) {
                parkingTicketService.getParkingCountBreakupDateWise(vm.filters)
                    .success(function (data) {
                        debugger;
                        vm.totalCount = 0;
                        vm.totalLiveCount = 0;
                        if (!preserveOnlineCount) {
                            vm.tollsCountBreakup = data.items;
                            data.items.forEach(x => {
                                vm.totalCount += x.count;
                                vm.totalLiveCount += (x.liveCount ? x.liveCount : 0);
                            });
                        }
                        else {
                            vm.tollsCountBreakup.forEach(x => {
                                x.processing = false;
                                const o = data.items.find(d => d.day == x.day);
                                x.count = o.count;
                                vm.totalCount += o.count;
                                vm.totalLiveCount += (x.liveCount ? x.liveCount : 0);
                            });
                        }

                    }).finally(() => callback && callback());
            };

            vm.isLoading = false;
            vm.downloadTollsV3 = function () {
                vm.downloadingResponse = [];
                vm.totalCount = 0;
                vm.totalLiveCount = 0;

                //function defination
                function getReconciliationSummary(preserveOnlineCount, callback) {
                    vm.filters.fromDate = moment(vm.dateRangeModel.startDate).startOf('day');
                    vm.filters.toDate = moment(vm.dateRangeModel.endDate).endOf('day');
                    vm.filters.salikAccountId = vm.singleSeletedAccount;

                    if (!preserveOnlineCount)
                        vm.tollsCountBreakup = [];

                    var diffDays = Math.ceil(Math.abs((new Date(vm.filters.toDate)) - (new Date(vm.filters.fromDate))) / (1000 * 60 * 60 * 24));
                    if (diffDays > 61) {
                        vm.loading = false;
                        abp.message.error("Date Range's difference cannot be more than 61 days.");
                        return;
                    }

                    getParkingTicketsBreakup(preserveOnlineCount, callback);
                }

                vm.callbackOnComplete = function () {
                    console.info('callbackOnComplete code run.');
                    if (!vm.isLoading)
                        getParkingTicketsBreakup(true, () => {
                            vm.tollStatus.dubai.isCheckingCount = false;
                            vm.isLoading = false;
                        });
                };

                //vm.reponseCallback = function (res) { //reponse received from extension to show progress
                //    console.info('reponseCallback code run.');
                //};


                //calling the function
                if (vm.tollStatus.dubai.isCheckingCount)
                    getReconciliationSummary(false, function () {
                        const accounts = vm.tollAccounts.filter(x => x.id == vm.filters.salikAccountId);
                        vm.tollAccountsDownloadingRes = {
                            request: { downloadOnlyParkingTickets: true },
                            getOnlyCount: true,
                            fromDate: null,
                            toDate: null,
                            tollAccounts: accounts,
                            dateSlabs: []
                        };

                        for (var i in vm.tollsCountBreakup) {
                            const val = vm.tollsCountBreakup[i];
                            vm.tollAccountsDownloadingRes.dateSlabs.push({ fromDate: val.day.split('T')[0], downloadedCount: val.count, tollsCountOnSite: 0 });
                        }

                        chromeExtDownloader.downloadTollsV3(vm, false);
                    });
                else {
                    vm.tollAccountsDownloadingRes.dateSlabs = undefined;
                    vm.tollStatus.dubai.isDownloading = true;
                    chromeExtDownloader.downloadTollsV3(vm, false);
                }
            };

            vm.search = function () {
                vm.tollStatus.dubai.isCheckingCount = true;
                vm.tollStatus.dubai.error = null;

                vm.filters.salikAccountId = vm.singleSeletedAccount;
                vm.tollsCountBreakup = [];
                var diffDays = Math.ceil(Math.abs((new Date(vm.filters.toDate)) - (new Date(vm.filters.fromDate))) / (1000 * 60 * 60 * 24));
                if (diffDays > 61) {
                    vm.loading = false;
                    abp.message.error("Date Range's difference cannot be more than 61 days.");
                    return;
                }

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    chromeExtDownloader.initV3(vm, vm.downloadTollsV3);
                    return;
                } else abp.message.info('Version 3.???.25 extension is not installed, Download from URL: https://chromewebstore.google.com/detail/mhlnadnpndiedccjohhninkjiibomece');

            };

            vm.exportToExcel = function () {
                var tableId = 'tblTripsOvertime';
                var tab_text = "";

                var dateRange = document.querySelector('input[date-range-picker]').value;
                var account = document.querySelector('select').selectedOptions[0].innerText;

                var tr = "<tr><td style='font-size:18px;font-weight:bold' colspan='2'>" + 'Date Range : ' + dateRange + "</td><td style='font-size:18px;font-weight:bold' colspan='2'>" + 'Account     : ' + account + "</td></tr>"
                tab_text = tab_text + "<br/>" + "<table border='1px'>" + tr + "<tr>";

                var j = 0;
                var tab2 = document.getElementById(tableId); // id of table
                for (j = 0; j < tab2.rows.length; j++) {
                    tab_text = tab_text + tab2.rows[j].cells[0].outerHTML.toUpperCase() + tab2.rows[j].cells[1].outerHTML.toUpperCase();

                    // Only include the content from the first two cells, excluding the last one
                    for (var i = 2; i < tab2.rows[j].cells.length - 1; i++) {
                        tab_text = tab_text + tab2.rows[j].cells[i].outerHTML.toUpperCase();
                    }

                    tab_text = tab_text + "</tr>";
                }

                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'SalikRecoReport_' + moment().format('DDMMMYY') + '.xls';
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
            vm.cancelAll = function () {
                chromeExtDownloader.closeAllTollsTabs();
                chromeExtDownloader.downloadTollsV3 && chromeExtDownloader.downloadTollsV3(vm, true);
            };

            vm.showError = function (error) {
                if (error)
                    abp.message.error(error);
            };

            function init() {

                if (!salikFeatureEnabled) {
                    abp.message.error('', 'One of the Features Salik should be Enabled.');
                }
                else {
                    salikAccountService.getSalikAccountsForExtension({ id: 1 })
                        .success(function (data) {
                            vm.tollAccounts = data.items;
                        });
                }
            }

            init();
        }
    ]);
