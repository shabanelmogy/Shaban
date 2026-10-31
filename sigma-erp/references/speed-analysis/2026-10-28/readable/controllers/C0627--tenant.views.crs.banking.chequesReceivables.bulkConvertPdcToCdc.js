// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:167090-167184
appModule.controller('tenant.views.crs.banking.chequesReceivables.bulkConvertPdcToCdc', [
        '$uibModalInstance', '$q', 'chequeService', 'isReceivable',
        function ($uibModalInstance, $q, chequeService, isReceivable) {
            var vm = this;
            vm.data = [];
            vm.loading = true;
            vm.saving = false;
            vm.all = false;
            vm.completed = false;
            vm.dateFormat = abp.setting.get('App.General.DateFormat');
            vm.type = isReceivable ? 23 : 33;

            vm.getCheque = function (row) {
                return row.cheque || (row.billingDetail && row.billingDetail.cheque) || {};
            };
            vm.getlocalDateTime = function (date) {
                return date ? moment.utc(date).local().format(vm.dateFormat) : '';
            };
            function parseDate(value) {
                if (!value) return moment.invalid();
                if (moment.isMoment(value) || value instanceof Date) return moment(value).startOf('day');
                return moment(value, vm.dateFormat, true).startOf('day');
            }
            vm.hasSelection = function () {
                return vm.data.some(function (row) { return row.generate && !row.converted; });
            };
            vm.toggleAll = function () {
                angular.forEach(vm.data, function (row) {
                    if (!row.converted) row.generate = vm.all;
                });
            };
            vm.cancel = function () { $uibModalInstance.dismiss(); };

            function load() {
                var input = { status: 1, skipCount: 0, maxResultCount: 1000, dateTimeType: 4 };
                if (isReceivable) input.type = 23;
                var query = isReceivable ? chequeService.getChequesReceivables(input) : chequeService.getChequesPayables(input);
                query.success(function (result) {
                    vm.data = result.items.filter(function (row) {
                        return row.type === vm.type && vm.getCheque(row).status === 1;
                    });
                }).finally(function () { vm.loading = false; });
            }

            vm.save = function () {
                if (!vm.cdcDate || vm.saving) return;
                vm.saving = true;
                vm.completed = false;
                vm.convertedCount = 0;
                vm.failedCount = 0;
                var selected = vm.data.filter(function (row) { return row.generate && !row.converted; });
                var parsedConversionDate = parseDate(vm.cdcDate);
                if (!parsedConversionDate.isValid()) {
                    vm.saving = false;
                    return;
                }
                var conversionDate = parsedConversionDate.format('YYYY-MM-DD');

                selected.forEach(function (row) {
                    row.errorMessage = null;
                    var chequeDate = moment.utc(vm.getCheque(row).chequeDate).local().startOf('day');
                    if (parsedConversionDate.isBefore(chequeDate, 'day')) {
                        row.errorMessage = app.localize('CdcDateMustBeOnOrAfterChequeDate');
                        vm.failedCount++;
                    }
                });

                var eligible = selected.filter(function (row) { return !row.errorMessage; });
                var chain = $q.when();
                eligible.forEach(function (row) {
                    chain = chain.then(function () {
                        return chequeService.convertToCdc({ id: row.id, date: conversionDate }).then(function () {
                            row.converted = true;
                            row.generate = false;
                            vm.convertedCount++;
                        }, function (response) {
                            row.errorMessage = response && response.data && response.data.error && response.data.error.message
                                ? response.data.error.message
                                : app.localize('ErrorOccurred');
                            vm.failedCount++;
                        });
                    });
                });
                chain.finally(function () {
                    vm.completed = true;
                    vm.summary = app.localize('BulkCdcConversionSummary')
                        .replace('{0}', vm.convertedCount)
                        .replace('{1}', vm.failedCount);
                    vm.saving = false;
                });
            };

            load();
        }
    ]);
