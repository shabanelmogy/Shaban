// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:470976-471309
appModule.controller('tenant.views.tfms.attachDetails.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.uaeFine', 'abp.services.app.vehicle', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, finesService, vehicleService, directoryService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.isEnableFMS = abp.features.isEnabled("TFMS");
            vm.isEnableCRS = abp.features.isEnabled("CRS");
            vm.isEnableUpdateFines = abp.auth.hasPermission('Pages.TFMS.Update.Fines');
            vm.isEnableEmail = abp.auth.hasPermission('Pages.TFMS.Email.Fines');
            vm.finesUpdateEmailDetail = abp.features.isEnabled("TFMS.Fines.Update.And.Email.Detail");

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
            vm.server = [];
            vm.plateNos = null;
            vm.selectedFinesCount = 0;
            vm.isDisableEmailbtn = true;

            vm.filters = {
                enableDateRange: true,
                name: "",
                agreementNo: null,
                vehicleId: null,
                plateTagNo: null,
                customerId: null,
                fromDate: null,
                fromTime: null,
                toDate: null,
                toTime: null,
                amount: null,
                trafficFileId: null,
                vehicleNo: null,
                enableWithAgreement: false,
                enableWithOutAgreement: false,
                enableInvoiced: false,
                enableIgnored: false,
                enableUnIgnored: false,
                enableUnInvoiced: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                finesWithFailedVehicleMappings: false,

                plateNo: [],
                durationType: 1,
                trafficFileIdEN: [],
                vehicleNoEN: [],
                server: null,
                vehicleNoArr: [],
                movementType: null,
                emailStatus: null
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
                    vm.filters.fromTime = moment(new Date()).startOf('day').utc();
                    vm.filters.toTime = moment(new Date()).endOf('day').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                    vm.filters.fromTime = null;
                    vm.filters.toTime = null;
                }
            };

            vm.movementType = [
                { type: "Agreement (Customer)", id: 1 },
                { type: "NRM (Staff)", id: 2 },
                { type: "Un-Identified", id: 3 }

            ];

            vm.emailStatus = [
                { name: "Yes", id: 1 },
                { name: "No", id: 0 }

            ];

            function getFiltersData() {
                finesService.getFiltersData().success(function (data) {
                    angular.forEach(data.trafficFileId, function (value, key) {
                        vm.trafficFileId.push({ name: value.name, id: value.id });
                    });
                    angular.forEach(data.server, function (value, key) {
                        vm.server.push({ name: value.name, id: value.name });
                    });
                });
            };


            vm.searchPlateNo = function ($select) {
                if ($select.search) {
                    vm.filters.name = $select.search;
                    return finesService.getSearchPlateNo(vm.filters).then(function (response) {
                        vm.plateNos = response.data.items;
                    });
                }
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                if (!$select.search) return null;
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getFinesReport = function () {
                vm.loading = true;
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
                finesService.getFinesReportForReport(vm.filters).success(function (data) {
                    vm.fines = data;
                }).finally(function () {
                    vm.allfineReports = false;
                    vm.fineReportChecked();
                    vm.loading = false;
                    vm.isDisableEmailbtn = true;
                });
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: 'With Agreement' }, { id: 2, name: 'Without Agreement' }];
            }

            vm.statusChanged = function () {

                if (vm.filters.status == 1) {
                    vm.filters.enableWithAgreement = true;
                    vm.filters.enableWithOutAgreement = false;

                }
                else if (vm.filters.status == 2) {
                    vm.filters.enableWithOutAgreement = true;
                    vm.filters.enableWithAgreement = false;
                }
                else {
                    vm.filters.enableWithAgreement = false;
                    vm.filters.enableWithOutAgreement = false;
                }
            };
            function getInvoiceStatuses() {
                vm.invoiceStatuses = [{ id: 1, name: 'Invoiced' }, { id: 2, name: 'Un-Invoiced' }];
            }

            function getFineStatuses() {
                vm.fineStatuses = [{ id: 1, name: 'Ignored' }, { id: 2, name: 'Un-Ignored' }];
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.allFineReportsChecked = function () {
                angular.forEach(vm.fines, function (value, key) {
                    if (vm.allfineReports) {
                        value.selected = true;
                    } else {
                        value.selected = false;
                    }
                });
                vm.fineReportChecked();
            };

            vm.fineReportChecked = function () {
                vm.selectedFinesCount = 0;
                angular.forEach(vm.fines, function (value, key) {
                    if (value.selected) {
                        vm.selectedFinesCount++;
                    }
                });
            }

            function openAttachDetailModal(selectedFinesDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tfms/attachDetails/updateModal.cshtml',
                    controller: 'tenant.views.tfms.attachDetails.updateModal as vm',
                    backdrop: 'static',
                    size: 'xs',
                    resolve: {
                        SelectedFinesDetail: function () {
                            return selectedFinesDetail;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getFinesReport();
                });
            }
            vm.isEmailSent = function (value) {
                if (value) {
                    return "Yes";
                } else {
                    return "No";
                }

            };
            vm.attachDetail = function () {
                var selectedFinesDetail = new Object();
                selectedFinesDetail.finesId = [];
                selectedFinesDetail.selectedCount = vm.selectedFinesCount;
                angular.forEach(vm.fines, function (value) {
                    if (value.selected) {
                        selectedFinesDetail.finesId.push(value.id);
                    }
                });
                openAttachDetailModal(selectedFinesDetail);
            };

            vm.emailFines = function () {
                if (!vm.isDisableEmailbtn && vm.isEnableEmail) {
                    vm.loading = true;
                    vm.filters.finesId = [];
                    angular.forEach(vm.fines, function (value) {
                        if (value.selected) {
                            vm.filters.finesId.push(value.id);
                        }
                    });

                    vm.filters.customerEmail = vm.fines.filter(f => f.selected)[0].movementContact.email;
                    vm.filters.customerType = vm.fines.filter(f => f.selected)[0].movementContact.contactType;

                    finesService.emailFines(vm.filters).success(function (data) {
                        abp.notify.success("Email Sent");
                    }).finally(function () {
                        vm.allfineReports = false;
                        vm.fineReportChecked();
                        vm.loading = false;
                        vm.getFinesReport();
                    });
                }
                
            };

            vm.isDisableEmailbtnChange = function () {
                if (vm.selectedFinesCount > 0 && vm.isEnableEmail && !(vm.fines === null || vm.fines === undefined)) {

                    angular.forEach(vm.fines, function (value) {
                        if (value.selected) {
                            if ((value.movementContact !== null && value.movementContact.email !== null)) {

                                vm.isDisableEmailbtn = false;
                                //check if different emails are selected
                                var duplicationEmail = vm.fines.filter(f => f.movementContact !== null && f.movementContact.email !== value.movementContact.email && f.selected);
                                if (duplicationEmail.length > 0) {
                                    vm.isDisableEmailbtn = true;
                                }
                            } else {
                                vm.isDisableEmailbtn = true;
                            }
                        }
                    });

                    //check if empty contact
                    var emptyContact = vm.fines.filter(f => (f.movementContact === null || f.movementContact.email === null || f.movementContact === undefined || f.movementContact.email === undefined) && f.selected);
                    if (emptyContact.length > 0) {
                        vm.isDisableEmailbtn = true;
                    }

                    //check if empty contactType are employee and staff
                    var customerContact = vm.fines.filter(f => (f.movementContact === null || f.movementContact.contactType === 2) && f.selected);
                    var staffContact = vm.fines.filter(f => (f.movementContact === null || f.movementContact.contactType === 1) && f.selected);
                    if (customerContact.length > 0 && staffContact.length > 0) {
                        vm.isDisableEmailbtn = true;
                    }

                } else {
                    vm.isDisableEmailbtn = true;
                }
            };

            vm.dateRangeCheck();
            vm.getFinesReport();
            getStatuses();
            getInvoiceStatuses();
            getFineStatuses();
            getFiltersData();

        }
    ]);
