// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66671-66921
appModule.controller('host.views.crm.proposal.createOrEditProposalModal', [
        '$scope', '$uibModalInstance', 'proposalId', 'abp.services.app.proposal', 'abp.services.app.directory', 'abp.services.app.edition',
        function ($scope, $uibModalInstance, proposalId, proposalService, directoryService, editionService) {

            var vm = this;
            vm.saving = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.editionFeaturesvalues = [];
            vm.featureData = null;
            vm.isOldSpeedRadioEnabled = true;
            vm.proposal = {
                customizationbuffer: 1,
                dataMigrationRadio: 1,
                proposalDetail: {
                    customization:
                    {
                        customizationRadio: 1,
                        customizationBufferHours: null,
                        customizationDescriptionList: [],
                    },
                    dataMigration:
                    {
                        dataMigrationRadio: 1,
                        migrationFeatures: [],
                    },
                    featureData: null,
                }
            };

            var featureKeys = [
                'Core.Companies',
                'Core.Contacts',
                'Core.Staff',
                'Core.Suppliers',
                'Core.Vehicles',
                'CRS.Accounts.OpeningBalances',
                'CRS.Rental.Agreements.Open',
                'CRS.Rental.Agreements.Close'
            ];


            vm.searchsupportPlan = function ($select) {
                vm.supports = [
                    { id: 1, name: 'Support Plan A' },
                    { id: 2, name: 'Support Plan B' },
                    { id: 3, name: 'Support Plan C' },
                    { id: 4, name: 'Support Plan D' }
                ];
            };


            vm.searchLicencePlan = function ($select) {
                vm.licence = [
                    { id: 1, name: 'Perpetual' },
                    { id: 2, name: 'Subscription' }
                ];
            };
            vm.searchCompany = function ($select) {
                return directoryService.search({ keyword: $select.search, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };


            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            vm.setActiveTabIndex = function (index) {
                if (index == 4)
                    vm.dataMigrationTabSelected();
            };


            vm.dataMigrationTabSelected = function () {
               
                if (vm.isEditMod == false) {
                    vm.proposal.proposalDetail.dataMigration.migrationFeatures = [];
                    featureKeys.forEach(function (value) {
                        var matchedValues = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.name == value && e.value == 'true');
                        if (matchedValues.length > 0) {
                            var featureDisplyName = '';
                            var matchedName = vm.proposal.proposalDetail.featureData.features.filter(e => e.name == matchedValues[0].name);
                            if (matchedName.length > 0) {
                                featureDisplyName = matchedName[0].displayName;
                            }
                            vm.proposal.proposalDetail.dataMigration.migrationFeatures.push({ featureName: matchedValues[0].name, selected: false, displayName: featureDisplyName });
                        }
                    });
                }
                else {
                    featureKeys.forEach(function (value) {
                        var matchedValues = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.name == value && e.value == 'true');
                        if (matchedValues.length > 0) {
                            var ValueToAdd = vm.proposal.proposalDetail.dataMigration.migrationFeatures.filter(r => r.featureName == value);
                            if (ValueToAdd.length == 0) {
                                var featureDisplyName = '';
                                var matchedName = vm.proposal.proposalDetail.featureData.features.filter(e => e.name == matchedValues[0].name);
                                if (matchedName.length > 0) {
                                    featureDisplyName = matchedName[0].displayName;
                                }
                                vm.proposal.proposalDetail.dataMigration.migrationFeatures.push({ featureName: matchedValues[0].name, selected: false, displayName: featureDisplyName });
                            }
                        }
                        else {
                            var valueToRemove = vm.proposal.proposalDetail.dataMigration.migrationFeatures.filter(r => r.featureName == value);
                            if (valueToRemove.length > 0) {
                                vm.proposal.proposalDetail.dataMigration.migrationFeatures = vm.proposal.proposalDetail.dataMigration.migrationFeatures.filter(r => r.featureName != valueToRemove[0].featureName);
                            }
                        }
                    });
                }

                //Old speed radio check on the basis of CRS=true
                var oldSpeedCheck = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.name == "CRS" && e.value == "true");
                vm.isOldSpeedRadioEnabled = oldSpeedCheck.length == 0 ? false : true;
            };


            vm.getEditions = function (editionId) {
                vm.proposal.proposalDetail.dataMigration.migrationFeatures = [];
                proposalService.getEditionForProposalEdit({
                    id: editionId
                }).success(function (result) {
                    vm.edition = result.edition;
                    vm.proposal.proposalDetail.featureData = {
                        features: result.features,
                        featureValues: result.featureValues
                    };
                    vm.editionFeaturesvalues = result.featureValues;
                });
            }

            vm.save = function () {
                if (!vm.proposal.proposalDetail.featureData.isValid()) {
                    abp.message.warn(app.localize('InvalidFeaturesWarning'));
                    return;
                }
                debugger;
                vm.saving = true;
                if (vm.proposal.proposalDetail.licenceType != null) {
                    vm.proposal.proposalDetail.licenceType = vm.proposal.proposalDetail.licenceType.id;
                }
                if (vm.proposal.edition != null) {
                    vm.proposal.editionId = vm.proposal.edition.id;
                }
                proposalService.createOrUpdateProposal({
                    proposal: vm.proposal,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };



            vm.addRow = function (line) {
                if (line == undefined)
                    line = customizationListLineObject();
                vm.proposal.proposalDetail.customization.customizationDescriptionList.push(line);
            };

            function customizationListLineObject() {
                var line = new Object();
                line.description = '';
                return line;
            }

            vm.removeRow = function (obj) {
                var index = vm.proposal.proposalDetail.customization.customizationDescriptionList.indexOf(obj);
                vm.proposal.proposalDetail.customization.customizationDescriptionList.splice(index, 1);
            };

            vm.featureDataForViewOnly = function () {

                var parentFeatureValues = [];
                var childFeatureValues = [];
                var parentFeature = [];
                var childFeature = [];

                featureKeys.forEach(function (value) {
                    var enabledFeatureValue = vm.proposal.proposalDetail.featureData.featureValues.filter(e => e.name == value && e.value == 'true');
                    if (enabledFeatureValue.length > 0)
                        childFeatureValues.push(enabledFeatureValue[0]);

                });

                featureKeys.forEach(function (value) {
                    var featureToAdd = vm.proposal.proposalDetail.featureData.features.filter(r => r.name == value)[0];
                    var parentNameNull = false;
                    var featureToAddParent = featureToAdd;
                    childFeature.push(featureToAdd);
                    while (!parentNameNull) {
                        featureToAddParent = vm.proposal.proposalDetail.featureData.features.filter(r => r.name == featureToAddParent.parentName)[0];
                        if (featureToAddParent != null) {
                            if (!childFeature.filter(r => r.name == featureToAddParent.name).length > 0)
                                childFeature.push(featureToAddParent);
                        }
                        else {
                            parentNameNull = true;
                        }
                    }
                }

                );
                vm.featureData = {
                    features: childFeature,
                    featureValues: childFeatureValues
                };


            };

            function getEditions() {
                editionService.getEditions().success(function (result) {
                    vm.editions = result.items;
                });
            }

            function init() {
                vm.loading = true;
                proposalService.getProposalForEdit({ id: proposalId }).success(function (result) {
                    getEditions();
                    vm.proposal = result;
                    if (proposalId > 0) {
                        vm.isEditMod = true;
                        vm.searchLicencePlan(null);
                        vm.searchsupportPlan(null);
                        vm.proposal.proposalDetail.licenceType = vm.licence.filter(r => r.id == result.proposalDetail.licenceType)[0];
                        if (vm.proposal.proposalDetail.customization.customizationDescriptionList == null) {
                            vm.proposal.proposalDetail.customization.customizationDescriptionList = [];
                            vm.addRow();
                        }
                    }
                    else {
                        vm.isEditMod = false;
                        vm.addRow();
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
