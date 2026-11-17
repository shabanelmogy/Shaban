// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:469838-469978
appModule.controller('tenant.views.stock.requisitions.createOrEditModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.item', 'abp.services.app.job', 'requisitionId', 'abp.services.app.itemRequisition','options',
        function ($scope, $uibModalInstance, itemAppService, jobAppService, requisitionId, itemRequisitionService,options) {

            var vm = this;
            vm.loading = false;

            vm.itemRequisition = {
                voucherLines: []
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
                if (id == 10)
                    return "Unit Repair";
                if (id == 11)
                    return "Regular Lubrications";
            };
            vm.itemModelId = null;
            vm.jobSelected = function () {
                vm.itemModelId = vm.itemIssue.job.ModelId;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.filters = {};
            function requisitionItemObject() {
                var item = new Object();
                item.productId = null;
                item.quantity = null;
                return item;
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
                    item = requisitionItemObject();

                vm.itemRequisition.voucherLines.push(item);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.itemRequisition.voucherLines.indexOf(obj);
                vm.itemRequisition.voucherLines.splice(index, 1);

            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search, modelId: vm.itemModelId }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                jobAppService.searchJobDetails({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };

            vm.save = function () {
                vm.loading = true;
                itemRequisitionService.createOrUpdateItemRequisition({ itemRequistion: vm.itemRequisition })
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
                if (requisitionId) {
                    vm.loading = true;
                    itemRequisitionService.getItemRequisitionForEdit({
                        id: requisitionId
                    }).success(function (result) {
                        if (result) {
                            vm.itemRequisition = result;
                            if (requisitionId > 0)
                                vm.itemRequisition.job.jobType = vm.itemRequisition.jobType;

                            angular.forEach(result.voucherLines, function (line) {
                                line.product.unitOfMeasure = line.unitOfMeasure;
                                line.product.unitOfMeasureId = line.unitOfMeasureId;
                            });
                        }
                    });
                    vm.loading = false;
                }
                else {

                    if (options) {//if created from job edit detail page
                        vm.itemRequisition.job = options;
                        vm.itemModelId = options.modelId;
                        vm.itemRequisition.jobDetailId = vm.itemRequisition.job.id;
                        vm.itemRequisition.jobId = vm.itemRequisition.job.jobId;
                        vm.itemRequisition.job.jobType = vm.getJobType(vm.itemRequisition.job.jobType);
                    }
                    vm.itemRequisition.date = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                }
            }
        }

    ]);
