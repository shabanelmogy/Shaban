// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:243007-243186
appModule.controller('tenant.views.crs.lease.smsToLeaseCustomer.index', [
        '$scope', '$uibModal', 'uiGridConstants', '$filter', 'abp.services.app.sMSToLeaseCustomer',
        function ($scope, $uibModal, uiGridConstants, $filter, promotionSMSservice) {

            var vm = this;
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                customersHavingOpenAgreement: true
                //maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.sending = false;

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.allBoxTicked = function () {
                if (vm.allPersons === null) return;
                angular.forEach(vm.allPersons, function (row) {
                    if (row.mobileNo && !row.smsStatus)
                        row.generate = vm.tickAllBox;
                });
            };

            vm.checkCheckeditems = function () {
                if (vm.allPersons === null) return false;
                var foundLines = $filter('filter')(vm.allPersons, {
                    generate: true
                }, true);
                if (foundLines && foundLines.length >= 1)
                    return true;
            };

            vm.getAllPersons = function () {
                vm.loading = true;
                //alert(vm.filters.fromDate);
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                promotionSMSservice.getAllPersons(vm.filters).success(function (data) {
                    vm.allPersons = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getSmsBalance = function () {
                promotionSMSservice.getSmsBalance().success(function (data) {
                    vm.smsBalance = data.marketingSMS;
                    vm.transactionSmsBalance = data.transactionSMS;
                }).finally(function () {
                   // vm.loading = false;
                });
            };

            vm.NoOfSmsInBatch = 10;
            vm.AllPersonForSms = [];

            vm.SelectedPeopleCount = function () {
                if (vm.allPersons)
                    return vm.allPersons.filter(e => e.mobileNo && e.generate && !e.smsStatus).length;
                else
                    return 0;

            };
           
            vm.loadTemplate = function () {
                vm.loading = true;

                promotionSMSservice.getSmsTemplate()
                    .then(function (result) {
                        vm.messageBody = result.data.template; // Adjust this based on your API response
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.sendPromotions = function () {
                vm.sending = true;
                var sendSmsTo = [];

                //get people with mobile numbers
                angular.forEach(vm.allPersons, function (person) {
                    if (person.mobileNo && person.generate === true && person.smsStatus !== true) {
                        vm.AllPersonForSms.push(person);
                    }
                });

                //condition for return
                if (vm.AllPersonForSms.length < 1) {
                    vm.sending = false;
                    vm.AllPersonForSms = [];
                    vm.tickAllBox = false;

                    vm.getSmsBalance();

                    return;
                }

                //people to send message
                if (vm.AllPersonForSms.length > vm.NoOfSmsInBatch) {
                    for (var i = 0; i < vm.NoOfSmsInBatch; i++) {
                        sendSmsTo.push(vm.AllPersonForSms[i]);
                    }
                } else {
                    for (var k = 0; k < vm.AllPersonForSms.length; k++) {
                        sendSmsTo.push(vm.AllPersonForSms[k]);
                    }
                }

                var promotionSms = {};
                promotionSms.messageBody = vm.messageBody;
                promotionSms.to_Numbers = [];
                for (var j = 0; j < sendSmsTo.length; j++) {
                    if (sendSmsTo[j].mobileNo) {
                        promotionSms.to_Numbers.push(sendSmsTo[j].mobileNo);
                    }
                }

                promotionSMSservice.sendPromotions(promotionSms).success(function (result) {

                    if (result) {
                        var smsStatusDic = result.sendStatus;

                        angular.forEach(sendSmsTo, function (notifiedPerson) {
                            var person = vm.allPersons.filter(x => x.id === notifiedPerson.id);

                            if (smsStatusDic[person[0].mobileNo] === true) {
                                person[0].smsStatus = true;
                                person[0].generate = false;
                            }
                            else {
                                person[0].smsStatus = false;
                                person[0].generate = false;
                            }
                        });
                    }
                    else {
                        angular.forEach(sendSmsTo, function (notifiedPerson) {
                            var person = vm.allPersons.filter(x => x.id === notifiedPerson.id);
                            person[0].smsStatus = false;
                            person[0].generate = false;
                        });
                    }

                    vm.AllPersonForSms = [];
                    vm.sendPromotions();

                }).error(function () {
                    abp.message.error(response.error);

                }).finally(function () {
                    vm.sending = false;
                });
            };

            function init() {
                vm.getAllPersons();
                vm.getSmsBalance();
                vm.loadTemplate();
            }
            init();

        }
    ]);
