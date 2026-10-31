// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:470339-470516
appModule.controller('tenant.views.stock.requisitions.printModal',
        ['abp.services.app.commonLookup', 'utilities', 'appSession', 'abp.services.app.grn', '$scope', '$stateParams', 'abp.services.app.purchaseOrder', 'abp.services.app.itemRequisition',
           
            function (commonLookupService,
                utilities, appSession, grnService, $scope, $stateParams, purchaseOrdersService, itemRequisitionService) {
                var vm = this;
                vm.tenantName = appSession.tenant.name;
                vm.tenancyName = appSession.tenant.tenancyName;
                var requisitionId = 0;
                vm.currency = abp.setting.get("App.General.CurrencyCode");
                vm.currencyName = abp.setting.get("App.General.CurrencyName");

                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                //vm.userName = appSession.user.name;
                vm.userName = '';
                vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
                vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
                vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                var recordsPerPage = 10;
                //if pop-up print
                if ($scope.$parent != null) {
                    if (!isNaN($scope.$parent.vmMain.requisitionId))
                        requisitionId = $scope.$parent.vmMain.requisitionId;
                }


                vm.currencyAndRounding = function (value) {
                    if (value == null) return null;

                    return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };


                //if through url print
                if (requisitionId == 0 && !isNaN($stateParams.query)) {
                    requisitionId = $stateParams.query;
                }

                $scope.$on('$viewContentLoaded', function () {
                    App.initAjax();
                });
                vm.rounding = function (value) {
                    return utilities.round(value, 2);
                };
                vm.getlocalDateTime = function (date, format) {
                    if (date != null) {
                        if (format == null) format = vm.dateFormat;

                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(format);
                    }
                    else {
                        return "";
                    }
                };

                vm.getUserName = function (userId) {
                    commonLookupService.getUser({
                        id: userId
                    }).success(function (result) {
                        vm.userName = result.name + ' ' + result.surname;
                    });
                };
                vm.getAllTotalAmount = function () {
                    var amount = 0;
                    angular.forEach(vm.itemRequisition.voucherLines, function (line) {
                        line.product.unitOfMeasure = line.unitOfMeasure;
                        line.product.unitOfMeasureId = line.unitOfMeasureId;
                        if (line.product.price)
                            amount += line.product.price;
                    });
                    return amount;
                };

                vm.getlocalDateTimeForEngAr = function (date, format) {
                    if (date != null) {
                        if (format == null) format = vm.dateFormat;

                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(format);
                    }
                    else {
                        return "";
                    }
                };
           

                function customizePagesData() {
                    var customArray = [];
                    customArray = vm.grn.voucherLines.filter(v => !v.hidden);
                    var arrayLength = customArray.length;
                    var noOfPages = arrayLength / recordsPerPage;
                    vm.pagesData = [];
                    for (var i = 0; i < noOfPages; i++) {
                        var subArray = [];
                        var start = i * recordsPerPage;
                        var end = start + recordsPerPage;
                        subArray = customArray.slice(start, end);
                        vm.pagesData.push({
                            pageNo: i + 1,
                            voucherLinesdataToIterate: subArray
                        })
                    }
                }



                vm.calculateQtyAlreadyReceived = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyAlreadyReceived = [];
                    grnService.getGrnByParentVoucherId({ id: vm.grn.parentVoucherId }).success(function (result) {
                        vm.qtyAlreadyReceived = result;
                        vm.qtyAlreadyReceived.forEach(function (voucher) {
                            voucher.voucherLines.forEach(function (voucherline) {
                                if (voucherline.productId === VoucherLine.productId) {
                                    if (!VoucherLine.quantityAlreadyReceived)
                                        VoucherLine.quantityAlreadyReceived = 0;
                                    VoucherLine.quantityAlreadyReceived += voucherline.quantity;
                                };
                            });
                        });

                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.calculateQtyOrdered = function (VoucherLine, value = 0) {
                    vm.loading = true;
                    vm.qtyOrdered = [];
                    purchaseOrdersService.getPOById(vm.grn.parentVoucherId).success(function (result) {
                        vm.parentVoucher = result;
                    }).finally(function () {
                        VoucherLine.quantityOrdered = 0;
                        vm.parentVoucher.voucherLines.forEach(function (voucherline) {
                            if (voucherline.productId === VoucherLine.productId) {
                                VoucherLine.quantityOrdered += voucherline.quantity;
                            };
                        });
                        if (value === 0)
                            vm.loading = false;
                    });

                }
                vm.totalAmount = 0;
                function init() {
                    {
                        vm.loading = true;
                        itemRequisitionService.getItemRequisitionForEdit({
                            id: requisitionId
                        }).success(function (result) {
                            if (result) {
                                vm.itemRequisition = result;
                               
                                if (vm.itemRequisition)
                                vm.getUserName(vm.itemRequisition.creatorUserId);
                                if (requisitionId > 0)
                                    vm.itemRequisition.job.jobType = vm.itemRequisition.jobType;

                                angular.forEach(result.voucherLines, function (line) {
                                    line.product.unitOfMeasure = line.unitOfMeasure;
                                    line.product.unitOfMeasureId = line.unitOfMeasureId;
                                    if(line.product.price)
                                       vm.totalAmount += line.product.price;
                                });
                            }
                        });
                        vm.loading = false;
                       
                    }
                }

                init();

                
            }
        ]);
