// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:465090-465274
appModule.controller('tenant.views.stock.itemReturns.createOrEditModal', [
        '$scope', 'utilities','$uibModalInstance', 'abp.services.app.item', 'abp.services.app.job', 'returnId', 'abp.services.app.itemReturn', 'options',
        function ($scope, utilities, $uibModalInstance, itemAppService, jobAppService, returnId, itemReturnService, options) {

            var vm = this;
            vm.loading = false;

            vm.ReturnReasonMandatoryForItemReturn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ReturnReasonMandatoryForItemReturn"));

            vm.itemModelId = null;
            vm.itemReturn = {
                voucherLines: []
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.filters = {};
            function returnItemObject() {
                var line = new Object();
                line.productId = null;
                line.quantity = null;
                line.debit = null;
                line.credit = null;

                return line;
            }

            vm.jobSelected = function () {
                
                // pass vm.itemReturn.jobDetailIdquantity           
                jobAppService.getItemReturnRows({ id: vm.itemReturn.jobDetailId }).then(function (result) {

                    if (result.data && result.data.length > 0) {
                        vm.itemReturn.voucherLines = result.data;
                        if (!vm.items)
                            vm.items = [];
                        vm.itemReturn.voucherLines.forEach(line => {
                            vm.items.push(line.product);
                            vm.productSelected(line);
                        });
                    }

                });
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
                    item = returnItemObject();

                vm.itemReturn.voucherLines.push(item);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.itemReturn.voucherLines.indexOf(obj);
                vm.itemReturn.voucherLines.splice(index, 1);

            };

            vm.searchItems = function ($select) {
                if ($select.search == "") { vm.items = null; return null; }
                return itemAppService.searchItems({ name: $select.search,modelId: vm.itemModelId}).then(function (response) {
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
                angular.forEach(vm.itemReturn.voucherLines, function (value) {
                    if (value.debit > 0)
                        totalAmount = totalAmount + parseFloat(value.debit);
                });

                vm.itemReturn.amount = totalAmount;

                if (vm.itemReturn.amount > 0) {
                    if (vm.autoCalculateAmountInWords === "true")
                        vm.itemReturn.amountInWords = utilities.toWords(vm.itemReturn.amount);
                }
            };

            vm.save = function () {
                vm.loading = true;
                angular.forEach(vm.itemReturn.voucherLines, function (line) {

                    line.debit = line.product.cost * line.quantity;
                    line.credit = 0;

                });
                vm.sumAmount();

                itemReturnService.createOrUpdateItemReturn({ itemReturn: vm.itemReturn })
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
                if (returnId) {
                    vm.loading = true;
                    itemReturnService.getItemReturnForEdit({
                        id: returnId
                    }).success(function (result) {
                        if (result) {
                            vm.itemReturn = result;
                            if (returnId > 0)
                                vm.itemReturn.job.jobType = vm.itemReturn.jobType;

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
                        vm.itemReturn.job = options;
                        vm.itemModelId = options.modelId;
                        vm.itemReturn.jobDetailId = vm.itemReturn.job.id;
                        vm.itemReturn.jobId = vm.itemReturn.job.jobId;
                        vm.itemReturn.job.jobType = vm.getJobType(vm.itemReturn.job.jobType);
                        vm.jobSelected();
                    }
                    vm.itemReturn.date = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                }
            }
        }

    ]);
