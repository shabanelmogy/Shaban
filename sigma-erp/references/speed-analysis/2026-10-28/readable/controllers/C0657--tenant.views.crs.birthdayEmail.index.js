// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170896-171024
appModule.controller('tenant.views.crs.birthdayEmail.index', [
        '$scope', '$uibModal', 'uiGridConstants', '$filter', 'abp.services.app.birthdayEmail', 'appSession',
        function ($scope, $uibModal, uiGridConstants, $filter, birthdayEmailService, appSession) {

            var vm = this;
            vm.filters = {
                fromDate: moment().utc().startOf('day'),
                toDate: moment().utc().endOf('day')
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tenancyName = appSession.tenant.tenancyName;
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
                    if (row.email && !row.smsStatus)
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

            vm.getBirthdayPersons = function () {
                vm.loading = true;
                birthdayEmailService.getBirthdayPersons(vm.filters).success(function (data) {
                    vm.allPersons = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.NoOfSmsInBatch = 10;
            vm.AllPersonForSms = [];

            vm.SelectedPeopleCount = function () {
                if (vm.allPersons)
                    return vm.allPersons.filter(e => e.email && e.generate && !e.smsStatus).length;
                else
                    return 0;

            };

            vm.sendBirthdayEmail = function () {
                vm.sending = true;
                var sendSmsTo = [];

                //get people with mobile numbers
                angular.forEach(vm.allPersons, function (person) {
                    if (person.email && person.generate === true && person.smsStatus !== true) {
                        vm.AllPersonForSms.push(person);
                    }
                });

                //condition for return
                if (vm.AllPersonForSms.length < 1) {
                    vm.sending = false;
                    vm.AllPersonForSms = [];
                    vm.tickAllBox = false;

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

                birthdayEmailService.sendBirthdayEmails(sendSmsTo).success(function (result) {
                    if (result) {
                        angular.forEach(result, function (resultPerson) {
                            var person = vm.allPersons.filter(x => x.id === resultPerson.id);
                            if (resultPerson.smsStatus === 'true') {
                                person[0].smsStatus = true;
                                person[0].generate = false;
                            } else {
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
                    vm.sendBirthdayEmail();

                }).error(function () {
                    abp.message.error(response.error);

                }).finally(function () {
                    vm.sending = false;
                });
            };

            function init() {
                vm.getBirthdayPersons();
            }
            init();

        }
    ]);
