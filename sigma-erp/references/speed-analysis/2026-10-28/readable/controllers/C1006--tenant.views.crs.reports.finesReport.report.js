// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:272110-272271
appModule.controller('tenant.views.crs.reports.finesReport.report', [
        '$scope', '$stateParams', 'abp.services.app.uaeFine', 'utilities',
        function ($scope, $stateParams, finesService, utilities) {

            var vm = this;
            vm.filters = null;

            vm.culture = abp.localization.currentCulture.name;
            vm.isEnableOmanFines = abp.features.isEnabled("TFMS.Fines.Oman");
            vm.isEnableTFMS = abp.features.isEnabled("TFMS");
            vm.isEnableShowCustomPlateNo = abp.features.isEnabled("TFMS.Fines.ShowCustomPlateNo");

            vm.hasPermissionTFMSFineReceipts = abp.auth.hasPermission('Pages.TFMS.Fines.FineReceipts');
            vm.downloadConfiscationChargesAuthPermission = abp.auth.hasPermission('Pages.TFMS.DownloadConfiscationCharges');
            vm.isFineCompanyCodeEnabled = abp.setting.getBoolean("App.General.Fine.EnableCompanyCode");


            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isTripNoInFine = abp.features.isEnabled("Notifications.SendEmailToDriverOnFineProcessingOfTrip");

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.customers = [];
            vm.selectedVehicle = null;
            vm.vehicleNo = [];
            vm.trafficFileId = [];
            vm.confiscationCharges = 0;
            vm.server = [];
            vm.plateNos = null;
            vm.amount = 0;
            vm.totalAmount = 0;
            vm.totalAcknowledgement = 0;
            vm.totalAmountWithSurcharge = 0;
            vm.totalSurcharge = 0;
            vm.confiscationCharges = 0;

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    return moment(date).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    return moment(date).utc().format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.isIgnored = function (data) {
                if (data === true)
                    return "Yes";
                else
                    return "No";
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };


            function init() {
                vm.loading = true;

                //vm.filters.fromDate = moment(vm.filters.fromDate).utc();
                //vm.filters.toDate = moment(vm.filters.toDate).utc();
                //vm.filters.fromTime = moment(vm.filters.fromTime).utc();
                //vm.filters.toTime = moment(vm.filters.toTime).utc();

                vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

                if (vm.filters.fromDate > vm.filters.toDate) return;

                vm.filters.trafficFileIdArr = [];
                vm.filters.serverArr = [];

                vm.filters.vehicleNo = vm.filters.plateNo;

                if (vm.filters.trafficFileIdEN.length > 0) {
                    angular.forEach(vm.filters.trafficFileIdEN, function (value) {
                        vm.filters.trafficFileIdArr.push(value.name);
                    });
                }

                const enablePagging = false;

                if (enablePagging) {
                    const skipCount = 500;
                    vm.fines = [];

                    const reportAPI = (parems, callback) => {
                        finesService.getFinesReportForReportView(vm.filters).success(function (data) {
                            vm.fines = [...vm.fines, ...data];
                            vm.fines.totalItems = data.length;

                            vm.filters.skipCount += skipCount;

                            angular.forEach(vm.fines, function (value) {
                                vm.totalAmount += value.amount;
                                //    value.amountWithSurcharge += value.confiscationCharges;
                                vm.totalAcknowledgement += value.acknowledgment;
                                vm.totalAmountWithSurcharge += value.amountWithSurcharge;
                                vm.totalSurcharge += value.surcharge;
                            });

                            //when page size is reduced from 500:pageSize then means there is no data left
                            if (!data.length || data.length < skipCount)
                                vm.loading = false;
                            else reportAPI(parems, callback);
                        });
                    };

                    vm.filters.skipCount = 0;
                    vm.filters.MaxResultCount = skipCount;
                    reportAPI(vm.filters);
                }
                else {
                    vm.filters.skipCount = -1;
                    finesService.getFinesReportForReportView(vm.filters).success(function (data) {
                        vm.fines = data;
                        vm.fines.totalItems = data.length;
                        angular.forEach(vm.fines, function (value) {
                            vm.totalAmount += value.amount;
                            //    value.amountWithSurcharge += value.confiscationCharges;
                            vm.totalAcknowledgement += value.acknowledgment;
                            vm.totalAmountWithSurcharge += value.amountWithSurcharge;
                            vm.totalSurcharge += value.surcharge;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
            init();
        }]);
