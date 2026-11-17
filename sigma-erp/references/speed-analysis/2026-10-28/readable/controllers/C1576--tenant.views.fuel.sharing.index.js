// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:435169-435331
appModule.controller('tenant.views.fuel.sharing.index', [
        '$scope', 'abp.services.app.dataSharingSetting',
        function ($scope, dataSharingSettingService) {
            var vm = this;
            vm.saving = false;
            vm.loading = false;
            vm.fields = [];
            vm.shareFileFormat = abp.features.getValue("FuelDataMangement.ShareFuel_FileFormat");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.setting = {
                dataToShare: 5,
                sharingFormat: 0,
                configuration: {
                    sftpConfiguration: {},
                    fieldMappings: []
                }
            }

            function getSharingFormat() {
                if (vm.shareFileFormat === "CSV") {
                    vm.sharingFormat = 1;
                    vm.shareAs = app.localize('CSV');
                }
                else if (vm.shareFileFormat === "MsSql") {
                    vm.sharingFormat = 2;
                    vm.shareAs = app.localize('MsSql');
                }
                else if (vm.shareFileFormat === "Oracle") {
                    vm.sharingFormat = 7;
                    vm.shareAs = app.localize('Oracle');
                }
            }


            vm.addcustomRow = function () {
                if (vm.dataToShare == 5)
                    vm.fuelTransaction.configuration.sharedDBs.push(customsettings());

            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.fieldtypechange = function (row) {
                if (row.fieldType !== 1)
                    row.maxLength = null;
                if (row.inputField !== "N/A")
                    row.defaultValue = null;
                if (row.filedType !== 3)
                    row.defaultValue = null;
            };

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                vm.setting.dataToShare = vm.dataToShare;
                debugger;
                vm.setting.sharingFormat = vm.sharingFormat;
                vm.setting.isActive = 1;
                vm.setting.configuration.sharingStartDate = moment(vm.setting.configuration.sharingStartDate).startOf('day');
                dataSharingSettingService.updateAllSettings(vm.setting).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getAllSettings();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.sortOfSettingsChanged = function (event, ui) {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var row = obj.row;


                if (updatedIndex === 0) {

                    row.order = (vm.settings.configuration.fieldMappings[0].order) / 2;
                    var element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex === (vm.settings.configuration.fieldMappings.length - 1)) {
                    row.order = (vm.settings.configuration.fieldMappings[updatedIndex].order + vm.settings.configuration.fieldMappings[updatedIndex].order + 1) / 2;
                    element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.rowIndex)
                        row.order = (vm.settings.configuration.fieldMappings[updatedIndex + 1].order + vm.settings.configuration.fieldMappings[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.rowIndex)
                        row.order = (vm.settings.configuration.fieldMappings[updatedIndex - 1].order + vm.settings.configuration.fieldMappings[updatedIndex].order) / 2;
                    element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                vm.loading = false;
                $scope.$apply();
            };

            vm.removerow = function (row) {
                if (vm.dataToShare == 5) {
                    let index = vm.setting.configuration.fieldMappings.indexOf(row);
                    vm.setting.configuration.fieldMappings.splice(index, 1);
                }
            };

            vm.dataSharingfieldtypes = [
                { key: 1, value: "Text" }, { key: 2, value: "Numeric" }, { key: 3, value: "DateTime" }, { key: 4, value: "Decimal" }, { key: 5, value: "Boolean" }];

            function getinputfields() {
                dataSharingSettingService.getInputFieldsFuelTransactions().success(function (result) {
                    vm.inputfields = result;
                });
            }

            vm.addRow = function () {
                debugger;

                vm.setting.configuration.fieldMappings.push({
                    order: vm.setting.configuration.fieldMappings.length < 1 ? 1 :
                        vm.setting.configuration.fieldMappings[vm.setting.configuration.fieldMappings.length - 1].order + 1,
                    inputfield: null,
                    outputfield: null,
                    fieldtype: null,
                    format: null,
                    defaultvalue: null,
                    maxlength: null
                });
            };

            function getAllSettings() {
                vm.loading = true;
                dataSharingSettingService.getAllSettingsFuel().success(function (result) {
                    vm.setting = result.find(x => x.dataToShare == 5);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                getAllSettings();
                getSharingFormat();
                getinputfields();
                vm.dataToShare = 5;
            }
            init();
        }
    ]);
