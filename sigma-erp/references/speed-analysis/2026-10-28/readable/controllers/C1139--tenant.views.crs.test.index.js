// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:298853-298980
appModule.controller('tenant.views.crs.test.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.tariffCard', 'abp.services.app.emailNotification', 'abp.services.app.fineEmail','abp.services.app.debtCollectionEmail',
        function ($scope, $uibModal, uiGridConstants, tariffCardService, emailNotificationService, fineEmailService, debtCollectionEmailService) {
            var vm = this;
            vm.filter = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
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
            vm.customerExpiryDocumentsEmail1 = function () {
                vm.loading = true;
                emailNotificationService.emailCustomerExpiringDocuments({}).success(function (data) {
                    abp.notify.info('Email Sent To Customer');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail2 = function () {
                vm.loading = true;
                emailNotificationService.emailStaffExpiringDocuments({}).success(function (data) {
                    abp.notify.info('Email Sent To Staff');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail3 = function () {
                vm.loading = true;
                emailNotificationService.emailExpiredSecurityDeposits({}).success(function (data) {
                                        
                    abp.notify.info('Email Sent To Deposit');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail4 = function () {
                vm.loading = true;
                emailNotificationService.emailBlackpointFines({}).success(function (data) {
                    abp.notify.info('Email Sent To Black Point Fine');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail5 = function () {
                vm.loading = true;
                emailNotificationService.higherGroupReplacementAlerts({}).success(function (data) {
                    abp.notify.info('Email Sent To Replacement');
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.customerExpiryDocumentsEmail6 = function () {
                vm.loading = true;
                fineEmailService.emailBlackPointsFine({}).success(function (data) {
                    abp.notify.info('Black Points Fine Email Sent To Customer');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            
            vm.customerExpiryDocumentsEmail7 = function () {
                vm.loading = true;
                emailNotificationService.damageEstimation({}).success(function (data) {
                    abp.notify.info('Email Sent Job Estimation');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            
            vm.customerExpiryDocumentsEmail8 = function () {
                vm.loading = true;
                emailNotificationService.unInvoicedExcessDamage({}).success(function (data) {
                    abp.notify.info('Email Sent Accidents');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail9 = function () {
                vm.loading = true;
                emailNotificationService.agreementsWithoutFullAdvance({}).success(function (data) {
                    abp.notify.info('Email Sent Agreements Without Full Advance');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail10 = function () {
                vm.loading = true;
                fineEmailService.idBlockFineReportAlert2({}).success(function (data) {
                    abp.notify.info('Email Sent for Id Block Alert 2nd Day');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.customerExpiryDocumentsEmail11 = function () {
                vm.loading = true;
                fineEmailService.idBlockFineReportAlert3({}).success(function (data) {
                    abp.notify.info('Email Sent for Id Block Alert 4th Day');
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.promisedPaymentReminderEmail = function () {
                vm.loading = true;
                debtCollectionEmailService.emailPaymentPromisedReminder().success(function (data) {
                    abp.notify.info('Email Sent for Promised Payment Reminder');
                }).finally(function () {
                    vm.loading = false;
                });
            };

        }
    ]);
