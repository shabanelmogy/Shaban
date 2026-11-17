// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:464559-464750
appModule.controller('tenant.views.stock.itemIssues.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.item', 'abp.services.app.job', 'options', 'abp.services.app.itemIssue', 'abp.services.app.itemRequisition', 'utilities',
        function ($scope, $uibModalInstance, itemAppService, jobAppService, options, itemIssueService, itemReqService, utilities) {

            var vm = this;
            vm.loading = false;

            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.itemModelId = null;

            vm.itemIssue = {
                voucherLines: []
            };

            vm.jobSelected = function () {
                vm.itemModelId = vm.itemIssue.job.ModelId;
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getJobType = function (id) {
                if (id == 1)
                    return "Routine Service";
                if (id == 2)
                    return "Mechnical Service";
                if (id == 3)
                    return "Electrical Service";
                if (id == 4)
                    return "Denting And Painting";
                if (id == 5)
                    return "Accident Service";
                if (id == 6)
                    return "AC Service";
                if (id == 7)
                    return "Breakdown Service";
                if (id == 8)
                    return "Tyre Service";
                if (id == 9)
                    return "Unit Maintenance";
                if (id ==10)
                    return "Unit Repair";
                if (id == 11)
                    return "Regular Lubrications";
            };

            vm.filters = {};
            function issueItemObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = null;
                line.debit = null;
                line.credit = null;

                return line;
            }

            vm.clearModelData = function () {
                vm.models = null;
                vm.item.model = null;
                vm.modelId = null;
            };

            vm.productSelected = function (line) {
                line.productId = line.product.id;
                line.unitOfMeasureId = line.product.unitOfMeasureId;
            };

            //Add row
            vm.addRow = function (line) {
                if (line == undefined)
                    item = issueItemObject();

                vm.itemIssue.voucherLines.push(item);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.itemIssue.voucherLines.indexOf(obj);
                vm.itemIssue.voucherLines.splice(index, 1);

            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search, modelId:vm.itemModelId }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobDetails({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.sumAmount = function () {

                var totalAmount = 0.0;
                angular.forEach(vm.itemIssue.voucherLines, function (value) {
                    if (value.credit > 0)
                        totalAmount = totalAmount + parseFloat(value.credit);
                });

                vm.itemIssue.amount = totalAmount;

                if (vm.itemIssue.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.itemIssue.amountInWords = utilities.toWords(vm.itemIssue.amount);
                }
            };

            vm.save = function () {
                vm.loading = true;
                angular.forEach(vm.itemIssue.voucherLines, function (line) {

                    line.credit = line.product.cost * line.quantity;
                    line.debit = 0;

                });
                vm.sumAmount();

                itemIssueService.createOrUpdateItemIssue({ itemIssue: vm.itemIssue })
                    .success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).error(function (result) {
                        abp.notify.error(app.localize('RecordNotSaved.'));
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            init();

            function init() {
                if (options.itemReqId) {
                    vm.loading = true;
                    itemReqService.getItemRequisitionForEdit({
                        id: options.itemReqId
                    }).success(function (result) {
                        if (result) {
                            vm.itemIssue = result;
                            vm.itemIssue.id = 0;
                            vm.itemIssue.parentVoucherId = options.itemReqId;
                            vm.itemIssue.date = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                            vm.itemIssue.job.jobType = vm.itemIssue.jobType;
                            angular.forEach(result.voucherLines, function (line) {
                                line.id = 0;
                                line.voucherId = 0;
                                line.product.unitOfMeasure = line.unitOfMeasure;
                                line.product.unitOfMeasureId = line.unitOfMeasureId;
                            });

                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
                } else if (options.jobDetail) {//if created from job edit detail page
                    vm.itemModelId = options.jobDetail.modelId;
                    vm.itemIssue.date = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                    vm.itemIssue.job = options.jobDetail;
                    vm.itemIssue.jobDetailId = vm.itemIssue.job.id;
                    vm.itemIssue.jobId = vm.itemIssue.job.jobId;
                    vm.itemIssue.job.jobType = vm.getJobType(vm.itemIssue.job.jobType);
                }
                else {
                    vm.loading = true;
                    itemIssueService.getItemIssueForEdit({
                        id: options.id
                    }).success(function (result) {
                        if (result) {
                            vm.itemIssue = result;
                            if (vm.itemIssue.id > 0) {
                                vm.itemIssue.job.jobType = vm.itemIssue.jobType;

                                angular.forEach(result.voucherLines, function (line) {
                                    line.product.unitOfMeasure = line.unitOfMeasure;
                                    line.product.unitOfMeasureId = line.unitOfMeasureId;
                                });
                            }
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }
        }

    ]);
