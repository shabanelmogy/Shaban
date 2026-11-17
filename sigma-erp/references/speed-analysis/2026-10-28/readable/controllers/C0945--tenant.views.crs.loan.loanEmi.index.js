// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:255692-255954
appModule.controller('tenant.views.crs.loan.loanEmi.index', ['abp.services.app.paymentPlan', 'utilities','$uibModal',
        function (paymentPlanService, utilities, $uibModal) {
            var vm = this;
            vm.filters = {
                enableDateRange: true,
                DealNo: null,
                fromDate: null,
                toDate: null,
                dateType: 1,
                selectToPay: false,
                payAll: false,
            };

            vm.totalAmount = 0;
            vm.totalInterest = 0;
            vm.totalPrincipal = 0;
            vm.multiSelectLoanEMI = utilities.parseBoolean(abp.setting.get('App.Speed.Common.MultiSelectLoanEMI'));

            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.payAllChanged = function () {
                if (vm.filters.selectToPay) {
                    angular.forEach(vm.loanData, function (loan) {
                        loan.isSelected = vm.filters.payAll;
                    });
                }
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.getStatus = function () {
                if (vm.filters.status == 1) {
                    return app.localize("Paid");
                }
                if (vm.filters.status == 2) {
                    return app.localize("Unpaid");
                }
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.openPayInstallmentModel = function (installment, bankAccount) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/payInstallmentModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.payInstallmentModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        paymentPlan: function () {
                            return {
                                installment: installment,
                                bankAccount: bankAccount,
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.getLoadData();
                });
            };
            //vm.saveSelected = async function () {

            //    var selectedLoans = vm.loanData.filter(x => x.isSelected && x.status == 'UnPaid');
            //    vm.disablePayAllButton = true;
            //    if (selectedLoans.length === 0) {
            //        abp.message.info("Please Select at least one Installment.");
            //        return;
            //    }
            //    abp.message.confirm(
            //        "Are You Sure you want to Pay EMI?",
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                vm.saveAllSelectedLoans();
            //            }
            //        }
            //    );
            //};
            vm.saveSelected = function () {
                // Filter only unpaid selected loans
                var selectedLoans = vm.loanData.filter(function (x) {
                    return x.isSelected && x.status !== 'Paid';
                });

                if (selectedLoans.length === 0) {
                    abp.message.info("Please select at least one installment.");
                    return;
                }

                // Open the new bulk-pay modal
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/payAllInstallmentsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.payAllInstallmentsModal as vm',
                    backdrop: 'static',
                    size: 'lg',                    // wide so the table fits
                    resolve: {
                        installments: function () {
                            return selectedLoans;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    // Refresh the main grid after the modal closes successfully
                    vm.getLoadData();
                });
            };
            vm.saveAllSelectedLoans = async function () {
                var selectedLoans = vm.loanData.filter(x => x.isSelected && x.status == 'UnPaid');
                vm.loading = true;

                for (var loan of selectedLoans) {

                    loan.isProcessing = true;

                    await paymentPlanService
                        .payInstallmentAmount({
                            id: loan.id,
                            interest: loan.interest,
                            bankAccountId: loan.recoveryBankAccountId
                        })
                        .success(function () {
                            loan.status = "Paid";
                            loan.isSelected = false;
                            loan.isProcessing = false;
                            abp.message.success("Saved successfully!");
                        }).catch(function (error) {
                            loan.isProcessing = false;
                            vm.loading = false;
                        });
                }

                vm.loading = false;
                vm.disablePayAllButton = false;
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";
                return app.localize(input);
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


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Paid") }, { id: 2, name: app.localize("Unpaid") }];
            };



            vm.getLoadData = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                vm.filters.isPaid = vm.filters.status != null ? vm.filters.status == 1 ? true : false : null;
                paymentPlanService.getLoanData(vm.filters)
                    .success(function (result) {
                        vm.loanData = result;

                        vm.totalAmount = vm.loanData.reduce((acc, curr) => acc += curr.amount, 0);
                        vm.totalInterest = vm.loanData.reduce((acc, curr) => acc += curr.interest, 0);
                        vm.totalPrincipal = vm.loanData.reduce((acc, curr) => acc += curr.principal, 0);

                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('loanTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'LoanReport.xls';
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

            function init() {
                initDate();
                getStatuses();
            }
            init();
        }]);
