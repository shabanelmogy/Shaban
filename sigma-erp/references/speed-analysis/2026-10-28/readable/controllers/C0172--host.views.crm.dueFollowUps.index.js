// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:64370-64604
appModule.controller('host.views.crm.dueFollowUps.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.user', 'appSession', 'abp.services.app.deal',
        function ($scope, $uibModal, uiGridConstants, userService, appSession, dealService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;
            //Date Filter
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            //Data Filter
            vm.filters = {
                salesPersonUser: appSession.user,
                salesPersonUserId: appSession.user.id,
                stage: 3,
                fromDate : '2022-01-01'
            };

            vm.stages = [{ id: 1, name: 'Prospect' },
            { id: 2, name: 'Lead' },
            { id: 3, name: 'Deal' }];
            vm.getStageName = function (stage) {


                if (stage === 1) {
                    return 'Prospect';
                }
                else if (stage === 2) {
                    return 'Lead';
                }
                else if (stage === 3) {
                    return 'Deal';
                }
                else {
                    return '';
                }
            };

            vm.statuses = [];
            function getStatuses() {
                var stage = vm.filters.stage;

                if (stage === 0 || stage === null || stage === undefined) {
                    vm.statuses = null;
                }
                else if (stage === 1) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                }
                else if (stage === 2) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                }
                else if (stage === 3) {
                    vm.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                }
            }
            vm.stageChange = function () {
                getStatuses();
            };


            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.clearSalesPersonUser = function () {
                vm.filters.salesPersonUserId = null;
                vm.filters.salesPersonUser = null;
            };
            vm.viewDealLog = function (lead) {
                //var modalInstance = $uibModal.open({
                //    templateUrl: '~/App/host/views/crm/deals/dealLog.cshtml',
                //    controller: 'host.views.crm.deals.dealLog as vm',
                //    backdrop: 'static',
                //    size: 'lg',
                //    resolve: {
                //        deal: function () {
                //            return deal;
                //        }

                //    }
                //});
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/marketing/leads/leadLog.cshtml',
                    controller: 'host.views.marketing.leads.leadLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        lead: function () {
                            return lead;
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDueFollowUps();
                });
            };
            vm.getDueFollowUps = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.toDate = vm.dateRangeModel.endDate;
                //vm.filters.fromDate = vm.dateRangeModel.startDate;
                dealService.getDueFollowUps(vm.filters).success(function (data) {
                    vm.dueFollowUps = data;

                    debugger;

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.getStatusName = function (id) {
                if (id === 1) {
                    return "Due";
                }
                else if (id === 2) {
                    return "Processed";
                }
                else if (id === 3) {
                    return "Converted";
                }
                else if (id === 4) {
                    return "Not Suitable";
                }
                else if (id === 10) {
                    return "New";
                }
                else if (id === 11) {
                    return "Suitable";
                }
                else if (id === 12) {
                    return "Not Suitable";
                }
                else if (id === 20) {
                    return "New";
                }
                else if (id === 21) {
                    return "Dull Deal";
                }
                else if (id === 22) {
                    return "Rejected Sale";
                }
                else if (id === 23) {
                    return "Not Suitable";
                }
                else if (id === 30) {
                    return "New";
                }
                else if (id === 31) {
                    return "Active";
                }
                else if (id === 32) {
                    return "Hot";
                }
                else if (id === 33) {
                    return "Final";
                }
                else if (id === 34) {
                    return "Closed";
                }

            };
            vm.getStageName = function (stage) {


                if (stage === 1) {
                    return 'Prospect';
                }
                else if (stage === 2) {
                    return 'Lead';
                }
                else if (stage === 3) {
                    return 'Deal';
                }
                else {
                    return '';
                }
            };

            const getCellValue = (tr, idx) =>
            {
                let text = tr.children[idx].innerText || tr.children[idx].textContent;
                if (text.indexOf('-') > -1) {
                   text = moment(text, 'DD-MMM-YY').format('YYMMDD');
                }

                return text;
            }

            const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
            )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

            // do the work...
            document.querySelectorAll('th').forEach(th => th.addEventListener('click', () =>
            {
                document.querySelectorAll('th i').forEach(i => i.attributes['class'].value = '');
                const table = th.closest('table');
                const tbody = table.querySelector('tbody');
                Array.from(tbody.querySelectorAll('tr'))
                    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                    .forEach(tr => tbody.appendChild(tr));
                th.children[0].attributes['class'].value = this.asc ? 'fa fa-caret-up' : 'fa fa-caret-down';
            }))

            function init() {
                vm.getDueFollowUps();
            }

            init();
        }
    ]);
