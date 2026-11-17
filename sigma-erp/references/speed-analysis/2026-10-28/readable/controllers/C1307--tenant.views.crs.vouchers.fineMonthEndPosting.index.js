// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:342108-342250
appModule.controller('tenant.views.crs.vouchers.fineMonthEndPosting.index', [
        '$scope', 'utilities', '$uibModal', 'abp.services.app.uaeFine', 'abp.services.app.fineMonthEndPosting', '$filter',
        function ($scope, utilities, $uibModal, fineService, fineMonthEndPostingService, $filter) {
            var vm = this;

            vm.allPostingGroupsOptional = abp.setting.get("App.FineMonthEndPosting.MakeAllPostingGroupsOptional");
            vm.dateRangeModel = { startDate: null, endDate: null };
            vm.isJvGenerated = false;
            vm.showDateRange = false;
            vm.filters = {};
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            //vm.changeFilter = function () {
            //    initDate();
            //    vm.dateRangeModelChange();
            //    //vm.filters.enableDateRange = !vm.filters.enableDateRange;
            //}

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            };
            vm.showUnIdentifiedFines = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/fineMonthEndPosting/showUnIdentifiedFinesModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.fineMonthEndPosting.showUnIdentifiedFines as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        unIdentifiedFines: function () {
                            return vm.fineMonthEndPosting.unIdentifiedFines;
                        },

                    }
                }).result.then(function (customer) {
                });
            };

            vm.rowId = 1;

            vm.postFinesMonthEnd = function () {
                vm.posting = true;
                vm.rowId = 1;

                //post first row and continue posting till last
                postRow();
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            //id: 1 to 7 (New: invoiced, un-invoiced are separated. Old-2 will be skipped as it will be done with 1)
            function postRow() {
                if (!vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].generate) {
                    vm.rowId += 1;
                    postRow();
                } else {
                    vm.filters.postingFor = vm.rowId;

                    if (!vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].count)
                        vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].count = 0;

                    fineMonthEndPostingService.postFinesMonthEnd(vm.filters).success(function (data) {
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                        if (data == 0)
                            vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].isJvGenerated = true;
                        else
                            vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].count = vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].count + data;

                        if (vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].isJvGenerated)
                            vm.rowId += 1;

                        //if (vm.rowId == 2) { //skop row id 2 as it is done with 1
                        //    vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].isJvGenerated = true;
                        //    vm.rowId += 1;
                        //}

                        if (vm.rowId < 7 || (vm.rowId == 7 && vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].generate))
                            postRow(); //keep on posting next row
                        else
                            vm.posting = false;

                    }).finally(function () {
                        //if (vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].isJvGenerated)
                        //    vm.rowId += 1;

                        //if (vm.rowId == 2) { //skop row id 2 as it is done with 1
                        //    vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].isJvGenerated = true;
                        //    vm.rowId += 1;
                        //}

                        //if (vm.rowId < 7 || (vm.rowId == 7 && vm.fineMonthEndPosting.processFinesMonthEndPostings[vm.rowId - 1].generate))
                        //    postRow(); //keep on posting next row
                        //else
                        //    vm.posting = false;
                    });
                }
            }



            vm.processFinesMonthEndPosting = function () {

                vm.loading = true;
                vm.filters.fromDate = vm.showDateRange ? vm.filters.fromDate : moment(vm.filters.monthYear).startOf('month');
                vm.filters.toDate = vm.showDateRange ? vm.filters.toDate : moment(vm.filters.monthYear).endOf('month').endOf('day');
                fineService.processFinesMonthEndPosting(vm.filters).success(function (data) {
                    vm.fineMonthEndPosting = data;
                    console.log(vm.fineMonthEndPosting.processFinesMonthEndPostings);
                }).finally(function () {
                    vm.loading = false;
                });
            };

        }
    ]);
