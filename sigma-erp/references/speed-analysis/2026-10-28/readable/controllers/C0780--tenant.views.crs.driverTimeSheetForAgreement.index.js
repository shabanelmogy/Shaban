// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:202335-202562
appModule.controller('tenant.views.crs.driverTimeSheetForAgreement.index', [
        '$scope', 'abp.services.app.driverTimeSheetForAgreement', '$stateParams', '$uibModal', 'abp.services.app.directory',
        function ($scope, driverTimeSheetForAgreement, $stateParams, $uibModal, directoryService) {
            var vm = this;
            vm.invalidForm = false;
            vm.totalWorkingHours = 0;
            vm.totalDriverOTHours = 0;
            vm.totalInvoiceOTHours = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            // search from dropdown


            // extended search using search customer popup

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.boxTicked = function (row)
            {
                if (row.isHoliday)
                    row.isHoliday = true;
                else
                    row.isHoliday = false;

            }
            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            $scope.onFocusChange = function ($event) {
                setTimeout(function () {
                    $event.target.select();
                }, 200);
            }

            vm.changeTime = function () {
                vm.invalidForm = false;
                angular.forEach(vm.employDutySchedule.schedules, function(elem, index) {
                    if (!(elem.in1 == null || elem.in1 == '') && (elem.out1 == null || elem.out1 == '')) {
                        vm.invalidForm = true;
                    }
                    if (!(elem.in2 == null || elem.in2 == '') && (elem.out2 == null || elem.out2 == '')) {
                        vm.invalidForm = true;
                    }
                    //if (!(elem.in1 == null || elem.in1 == '') && !(elem.out1 == null || elem.out1 == '')) {
                    //    if (elem.out1 > elem.in1) {
                    //        elem.editableSecondInOut = false;
                    //    }
                    //    else {
                    //        elem.editableSecondInOut = true;
                    //    }
                    //} else {
                    //    elem.editableSecondInOut = true;
                    //}
                });
            };

            vm.changeEmptyToNull = function() {
                angular.forEach(vm.employDutySchedule.schedules, function(elem, index) {
                    if (elem.in1 == '') {
                        elem.in1 = null;
                    }
                    if (elem.out1 == '') {
                        elem.out1 = null;
                    }
                    if (elem.out2 == '') {
                        elem.out2 = null;
                    }
                    if (elem.in2 == '') {
                        elem.in2 = null;
                    }
                });
            };

            vm.save = function () {
                vm.loading = true;
                vm.saving = true;
                driverTimeSheetForAgreement.createOrUpdateDriverTimeSheet({ driverTimeSheet: vm.driverTimeSheetForAgreement }).success(function (data) {
                    abp.notify.info(app.localize('SavedSuccessfully'));

                }).finally(function () {
                    vm.loading = false;
                    vm.saving = false;
                    vm.getAgreementTimeSheet();
                    vm.calculateTotalHours();
                });
            };
            //vm.isvalidForTimesheet = function ()
            //{
            //    vm.filters.agreementId = vm.filters.agreement.id;
            //    if (vm.filters.agreement.driver.contactType != 1) {
            //        vm.filters.agreementId = null;
            //        vm.driverTimeSheetForAgreement = null;
            //        abp.message.info(app.localize("Agreement have no Staff Driver"));
            //    }
            //    vm.filters.agreement.charges.forEach(function (value) {
            //        if (value.chargesTypeId == 23)
            //            if (!value.accepted) {
            //                vm.filters.agreementId = null;
            //                vm.driverTimeSheetForAgreement = null;
            //                abp.message.info(app.localize("Agreement is Without Driver Charges"));
            //            }
            //    });

            //};

            vm.onChangeAgreement = () => {
                vm.filters.agreementId = vm.filters.agreement.id;
            }

            vm.getAgreementTimeSheet = function () {

                vm.loading = true;
                vm.customer = null;

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');

                driverTimeSheetForAgreement.getAgreementTimeSheet(vm.filters).success(function (data) {
                    vm.driverTimeSheetForAgreement = data;
                    if (vm.driverTimeSheetForAgreement.length > 0)
                        vm.customer = vm.driverTimeSheetForAgreement[0].agreement.customer;
                    vm.calculateTotalHours();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.setHours = function (row)
            {
                if (row.isHoliday) {
                    row.invoiceOTHours = row.workingHours;
                    row.driverOTHours = row.workingHours;
                } else
                {
                    angular.forEach(row.agreement.charges, function (value, key) {
                        if (value.chargesTypeId == 40) {
                            row.invoiceOTHours = row.workingHours - value.limit;
                            row.driverOTHours = row.workingHours - value.limit;

                        }

                    });

                    //    row.driverOTHours = row.workingHours - row.driver.standardHours;

                }
                if (row.driverOTHours < 0)
                    row.driverOTHours = 0;
                if (row.invoiceOTHours < 0)
                    row.invoiceOTHours = 0;

                vm.calculateTotalHours();
            }

            vm.calculateTotalHours = function () {

                vm.totalWorkingHours = 0;
                vm.totalDriverOTHours = 0;
                vm.totalInvoiceOTHours = 0;
                vm.driverTimeSheetForAgreement.map(x => {
                    vm.totalWorkingHours += x.workingHours;
                    vm.totalDriverOTHours += x.driverOTHours;
                    vm.totalInvoiceOTHours += x.invoiceOTHours;
                });
            };
            


            vm.searchDriverPopoup = function (row) {
                var type = null;
                if (row.agreement.driverType == 2) type = 1;
                if (row.agreement.driverType == 3) type = 6;
                var modalInstance = openSearchContactModel(1, 1, (row.agreement.customer.contactCategory == 2 && row.agreement.driverType == 3),row);
                //var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        row.driver = result;
                    row.driverId = result.id;
                    vm.setHours(row);

                });
            };
            vm.searchAgreement = function ($select) {
                if ($select.search == '') return;
                driverTimeSheetForAgreement.searchOpenAgreement({ agreementNo: $select.search}).then(function (response) {
                    vm.agreements = response.data.items;
                });
            };
            function openSearchContactModel(category, type, isOnlyCorporate,row) {
                if (vm.isSagX3Enabled) {
                    category = 1;
                }

                var companyIdToForward = row.agreement.customer ? row.agreement.customer.id : null;

                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward
                            }
                        }
                    }
                });
            }
        }
    ]);
