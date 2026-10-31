// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174491-174692
appModule.controller('tenant.views.crs.broadcastEmails.index', [
        '$scope', '$uibModal', 'uiGridConstants', '$filter', 'abp.services.app.broadcastEmails', 'abp.services.app.emailTemplate',
        function ($scope, $uibModal, uiGridConstants, $filter, broadcastEmailsService, emailTemplateService) {


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            var vm = this;
            vm.allPersons = [];
            vm.person = { generate: false };
            vm.allCheckedPersons = [];
            vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];
            vm.contactStatuses = [{ value: 'false', name: app.localize('Active') }, { value: 'true', name: app.localize('InActive') }];
            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                //maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.sending = false;

            vm.selectedPersons = function () {
                addOrUpdateTickedArray();
            }

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function addOrUpdateTickedArray() {

                if (!vm.allPersons) return;

                var selectedPersons = vm.allPersons.filter(e => e.generate);

                var alreadySelectedIds = vm.allCheckedPersons.map(e => e.id);

                var newPersonsToPush = selectedPersons.filter(e => !alreadySelectedIds.includes(e.id));

                vm.allCheckedPersons.push(...newPersonsToPush);

                var allPushedIds = vm.allCheckedPersons.map(e => e.id);

                vm.allPersons = vm.allPersons.filter(e => !allPushedIds.includes(e.id));
            }

            vm.allBoxTicked = function () {
                if (vm.allPersons === null) return;
                vm.allPersons.forEach(e => e.generate = vm.tickAllBox);
                addOrUpdateTickedArray();
                vm.tickAllBox = false;
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.allCheckedPersons.indexOf(obj);
                vm.allCheckedPersons.splice(index, 1);
            };
            //Remove all rows
            vm.removeAllRows = function () {
                vm.allCheckedPersons = [];
            };

            vm.getAllContacts = function () {
                vm.loading = true;
                vm.tickAllBox = false;
                broadcastEmailsService.getAllContacts(vm.filters).success(function (data) {
                    vm.allPersons = data;
                    for (var i = 0; i < data.length; i++) {
                        vm.allPersons[i].generate = false;
                    }
                    console.log(vm.allPersons);

                }).finally(function () {
                    vm.loading = false;
                });
            };



            vm.AllPersonForEmailBroadcast = [];

            vm.SelectedPeopleCount = function () {
                if (vm.allCheckedPersons) {
                    var filteredPersons = vm.allCheckedPersons.length;
                    return filteredPersons;
                }
                else
                    return 0;
            };

            vm.broadcastEmails = function () {
                vm.sending = true;
                var broadcastEmailsTo = [];

                var value = $("#htmlText").code();
                var replaced1 = value.replace(/(<p)/g, '<div');
                var replaced2 = replaced1.replace(/(<\/p)/g, '</div');
                vm.messageBody = replaced2;
                //get people with mobile numbers
                angular.forEach(vm.allCheckedPersons, function (person) {
                    if (vm.AllPersonForEmailBroadcast.indexOf(person) === -1 && person.email && person.generate === true && person.emailStatus !== true) {
                        vm.AllPersonForEmailBroadcast.push(person);
                    }
                });

                //condition for return
                if (vm.AllPersonForEmailBroadcast.length < 1) {
                    vm.sending = false;
                    vm.AllPersonForEmailBroadcast = [];
                    vm.tickAllBox = false;

                    return;
                }

                //people to send message
                //if (vm.AllPersonForEmailBroadcast.length > vm.NoOfSmsInBatch) {
                //    for (var i = 0; i < vm.NoOfSmsInBatch; i++) {
                //        sendSmsTo.push(vm.AllPersonForSms[i]);
                //    }
                //} else {
                for (var k = 0; k < vm.AllPersonForEmailBroadcast.length; k++) {
                    broadcastEmailsTo.push(vm.AllPersonForEmailBroadcast[k]);
                }
                //}

                var broadcastEmails = {};
                broadcastEmails.subject = vm.subject;
                broadcastEmails.messageBody = vm.messageBody;
                broadcastEmails.cc = vm.cc;
                broadcastEmails.bcc = vm.bcc;
                broadcastEmails.broadcastEmailsList = [];
                for (var j = 0; j < broadcastEmailsTo.length; j++) {
                    var bEmails = {};

                    if (broadcastEmailsTo[j].email) {
                        bEmails.email = broadcastEmailsTo[j].email;
                    }
                    if (broadcastEmailsTo[j].name) {
                        bEmails.name = broadcastEmailsTo[j].name;
                    }
                    else if (broadcastEmailsTo[j].firstName || broadcastEmailsTo[j].lastName) {
                        bEmails.name = broadcastEmailsTo[j].firstName + " " + broadcastEmailsTo[j].lastName;
                    }
                    broadcastEmails.broadcastEmailsList.push(bEmails);
                }

                broadcastEmailsService.broadcastEmails(broadcastEmails).success(function (result) {

                    if (result) {
                        console.log(result);
                        var emailStatusDic = result.sendStatus;

                        angular.forEach(broadcastEmailsTo, function (notifiedPerson) {
                            var person = vm.allCheckedPersons.filter(x => x.id === notifiedPerson.id);

                            if (emailStatusDic[person[0].email] === true) {
                                var index = vm.allCheckedPersons.indexOf(person[0]);
                                if (index !== -1)
                                    vm.allCheckedPersons.splice(index, 1);
                            }

                        });
                    }
                    else {
                        angular.forEach(broadcastEmailsTo, function (notifiedPerson) {
                            var person = vm.allCheckedPersons.filter(x => x.id === notifiedPerson.id);
                            person[0].emailStatus = false;
                            person[0].generate = false;
                        });
                    }

                    vm.AllPersonForEmailBroadcast = [];
                    //vm.broadcastEmails();

                }).error(function () {
                    abp.message.error(response.error);

                }).finally(function () {
                    vm.sending = false;
                });
            };

            function init() {
                vm.getAllContacts();
            }
            init();

        }
    ]);
