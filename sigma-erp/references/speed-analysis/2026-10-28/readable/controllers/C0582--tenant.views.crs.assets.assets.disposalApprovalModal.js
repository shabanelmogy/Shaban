// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:159529-159805
appModule.controller('tenant.views.crs.assets.assets.disposalApprovalModal', [
        '$uibModalInstance', 'abp.services.app.asset', 'abp.services.app.profile', 'abp.services.app.user', 'abp.services.app.approval', 'assetId', 'disposeLimited', 'approvalId', 'form', 'options', 'appSession', 'utilities', '$uibModal',
        function ($uibModalInstance, assetService, profileService, userService, approvalAppService, assetId, disposeLimited, approvalId, form, options, appSession, utilities, $uibModal) {

            var vm = this;
            vm.locationName = '';
            vm.documents = [];
            vm.disposeLimited = disposeLimited;
            vm.form = form;
            vm.approvalId = approvalId;
            vm.roles = [];
            vm.currentRoles = [];
            vm.currentUserId = appSession.user.id;
            vm.documentsForAssetsDisposalEnabled = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForAssetsDisposal");
            vm.aseetIdForDepreciation = assetId;
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.salePriceSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) || (parseFloat(abp.setting.get("App.General.ProfitMarginOnBookValue")) > 0);
            vm.canChangeSalePrice = utilities.parseBoolean(abp.setting.get("App.General.EstimateOrSetAssetPrice")) && abp.features.isEnabled("Pages.Tenant.Assets.CanSetAssetSalePrice");
            vm.isDealershipDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetFromDealership");
            vm.isTransactionPasswordEnabled = abp.features.isEnabled("CRS.CustomFeatures.TransactionPassword");
            vm.discountOnAssetForDisposal = abp.features.isEnabled("CRS.CustomFeatures.DiscountOnAssetForDisposal");
            vm.isAssetDisposalApprovalEnabled = abp.features.isEnabled("CRS.Approval.AssetDisposals");

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.deprPercentageSum = 0.0;
            vm.assetDisposalDocs = [];
            vm.assetDisposalImages = [];

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };


            vm.isDocument = function (i) {
                return i && i.name &&
                    (['jpg', 'jpeg', 'png'].indexOf(i.name.split('.')[1].toLowerCase()) == -1);
            };

            vm.getDisposalType = function (id) {
                if (id == 1)
                    return app.localize("Selling");
                else if (id == 2)
                    return app.localize("TotalLoss");

            };
            vm.disposalTypes = [
                {
                    id: 1,
                    name: 'Selling'
                },
                {
                    id: 2,
                    name: 'Total Loss'
                }];

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.depreciationPopUp = function () {
                var obj = {
                    assetId: vm.aseetIdForDepreciation,
                    openingDepreciation: vm.asset.openingDepr,
                };

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/depreciationDetailModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.depreciationDetailModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return obj;
                        }
                    }
                });
            };

            vm.changeSalePriceByUser = function () {
                vm.loading = true;
                assetService.changeSalePriceByUser({
                    id: assetId,
                    salePrice: vm.asset.salePrice
                }).success(function (result) {
                    vm.isSetSalePrice = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    init();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getRoleByUserId = function () {
                return userService.getRoleByUserId({ id: vm.currentUserId })
                    .success(function (data) {
                        vm.currentRoles = data;
                    }).finally(function () {
                        vm.canApproveOrRejectColumnWise();
                    });
            };

            vm.getRoles = function (id) {
                id = id ? id : null;
                return userService.getRole({ id: id }).then(function (response) {
                    vm.roles = response.data;
                });
            };

            vm.getRole = function (id) {
                var result = vm.roles.filter(x => x.id == id);
                return result[0] ? result[0].displayName : '';
            };


            vm.canApproveOrRejectColumnWise = function () {
                vm.approvalLines.forEach(function (e, i) {
                    e.approvable = vm.canApproveOrReject(e, i);
                });
                if (vm.approvalLines.some(e => e.approvable == true))
                    return true;
                else return false;
            };

            vm.canApproveOrReject = function (row, index) {
                var canApproveOrReject = true;
                if ((vm.currentRoles.some(x => x.id == row.roleId) || vm.currentUserId == row.userId) && row.status == 1) {
                    if (index != 0) {
                        for (var i = 0; i < index; i++) {
                            var current = vm.approvalLines[i];
                            if (current.status != 2)
                                canApproveOrReject = false;
                        }
                    }
                }
                else {
                    canApproveOrReject = false;
                }

                return canApproveOrReject;
            };
            vm.approveRow = function (row) {

                abp.message.confirm(
                    'Do you really want to approve?',
                    function (isConfirmed) {

                        if (isConfirmed) {

                            vm.loading = true;
                            approvalAppService.approvalBySpecificUser({ approvalId: row.approvalId, recordId: assetId, form: vm.form, id: row.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('Approved.'));
                                    vm.approvalLines = data && data.length > 0 ? data : vm.approvalLines;
                                    var isAllApprovedLinesApproved = false;
                                    if (data.length > 0) {
                                        isAllApprovedLinesApproved = data.every(function (element) {
                                            return element.status == 2;
                                        });
                                        if (isAllApprovedLinesApproved) {
                                            $uibModalInstance.close(vm.approvalLines);
                                        }
                                    }
                                    //vm.approvalLines.find(x => x.id == row.id).status = 2;
                                    vm.canApproveOrRejectColumnWise();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }

                    }
                );

            };


            vm.save = function () {
                vm.saving = true;
                if (vm.isTransactionPasswordEnabled) {
                    profileService.verifyTransactionPassword({ id: vm.transactionPassword })
                        .success(function () {
                            abp.notify.info(app.localize('PasswordVerifiedSuccessfully'));
                            disposeApprovedAsset();
                            $uibModalInstance.close();
                        }).finally(function () {
                            vm.saving = false;
                        });
                }
                else {
                    disposeApprovedAsset();
                    $uibModalInstance.close();
                }
            };

            function disposeApprovedAsset() {
                vm.loading = true;
                assetService.approveDisposal({ id: vm.asset.id }).success(function (data) {

                }).finally(function () {
                    vm.loading = false;
                    vm.saving = false;
                    abp.notify.info('Asset Disposed Successfully');
                });
            }

            function approvalForm() {

                vm.loading = true;
                vm.approvalLines = [];
                debugger;
                approvalAppService.getApprovals({ id: vm.approvalId })
                    .success(function (data) {
                        if (data)
                            vm.approvalLines = data.approvalLines;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            if (vm.isAssetDisposalApprovalEnabled) {
                vm.getRoles();
                vm.getRoleByUserId();
            }
            
            function init() {
                vm.loading = true;
                if (vm.isAssetDisposalApprovalEnabled)
                    approvalForm();

                assetService.getAssetForView({
                    id: assetId
                }).success(function (result) {
                    vm.asset = result;

                    vm.documents = vm.asset.documents;
                    if (vm.asset.documents) {
                        vm.asset.documents.forEach(doc => {
                            doc.thumb = doc.url;
                            doc.img = doc.url;

                            if (vm.isDocument(doc))
                                vm.assetDisposalDocs.push(doc);
                            else
                                vm.assetDisposalImages.push(doc);

                        });
                    }
                    if (vm.asset.anualDeprRates != null) {
                        vm.asset.anualDeprRates.forEach(e => {
                            vm.deprPercentageSum += e.percentage / 1;
                        });
                    }

                    vm.asset.disposalType = app.localize(vm.asset.disposalType);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
