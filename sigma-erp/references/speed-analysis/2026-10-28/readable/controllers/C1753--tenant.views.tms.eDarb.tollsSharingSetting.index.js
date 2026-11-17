// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:479552-479779
appModule.controller('tenant.views.tms.eDarb.tollsSharingSetting.index', [
        '$scope', 'abp.services.app.dataSharingSetting',
        function ($scope, dataSharingSettingService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.fields = [];
            vm.shareFileFormat = abp.features.getValue("TMS.ShareTolls_FileFormat");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            function customsettings() {
                var line = new Object();
                line.companyCode = null;
                line.dbServer = null;
                line.dbName = null;
                line.user = null;
                line.password = null;
                return line;
            };

            vm.addcustomRow = function () {
                if (vm.dataToShare == 3)
                    vm.tollsabudhabai.configuration.sharedDBs.push(customsettings());

            };

            vm.removecustomrow = function (row) {

                if (vm.dataToShare == 3) {
                    let index = vm.tollsabudhabai.configuration.sharedDBs.indexOf(row);
                    vm.tollsabudhabai.configuration.sharedDBs.splice(index, 1);
                }
            };

            function getSharingFormat() {
                if (vm.shareFileFormat === "CSV") {
                    vm.sharingFormat = 1;
                    vm.shareAs = app.localize('CSV');
                }
                else if (vm.shareFileFormat === "MsSql") {
                    vm.sharingFormat = 2;
                    vm.shareAs = app.localize('MsSql');
                }
                else if (vm.shareFileFormat === "MySql") {
                    vm.sharingFormat = 3;
                    vm.shareAs = app.localize('MySql');
                }
                else if (vm.shareFileFormat === "CustomShift") {
                    vm.sharingFormat = 4;
                    vm.shareAs = app.localize('CustomShift');
                }
                else if (vm.shareFileFormat === "CustomArenco") {
                    vm.sharingFormat = 5;
                    vm.shareAs = app.localize('CustomArenco');
                }
                else if (vm.shareFileFormat === "Excel") {
                    vm.sharingFormat = 6;
                    vm.shareAs = app.localize('Excel');
                }
                else if (vm.shareFileFormat === "Oracle") {
                    vm.sharingFormat = 7;
                    vm.shareAs = app.localize('Oracle');
                }
                else if (vm.shareFileFormat === "CustomMassar") {
                    vm.sharingFormat = 8;
                    vm.shareAs = app.localize('CustomMassar');
                }
                else if (vm.shareFileFormat === "RESTApi") {
                    vm.sharingFormat = 9;
                    vm.shareAs = app.localize('RESTApi');
                }
            }

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

            vm.addRow = function () {

                if (vm.dataToShare == 3) {
                    vm.tollsabudhabai.configuration.fieldMappings.push({
                        order: vm.tollsabudhabai.configuration.fieldMappings.length < 1 ? 1 :
                            vm.tollsabudhabai.configuration.fieldMappings[vm.tollsabudhabai.configuration.fieldMappings.length - 1].order + 1,
                        inputfield: null,
                        outputfield: null,
                        fieldtype: null,
                        format: null,
                        defaultvalue: null,
                        maxlength: null
                    });
                }
            };

            vm.removerow = function (row) {
                if (vm.dataToShare == 3) {
                    let index = vm.tollsabudhabai.configuration.fieldMappings.indexOf(row);
                    vm.tollsabudhabai.configuration.fieldMappings.splice(index, 1);
                }
            };

            vm.dataSharingfieldtypes = [
                { key: 1, value: "Text" }, { key: 2, value: "Numeric" }, { key: 3, value: "DateTime" }, { key: 4, value: "Decimal" }, { key: 5, value: "Boolean" }, { key: 6, value: "Time" }];

            const inputFieldsNames = [
                { original: 'DownloadDateTime', modified: 'DownloadDateTime_UTC' }
            ];

            function getinputfields() {
                dataSharingSettingService.getInputFieldsTolls().success(function (result) {

                    debugger;
                    for (var i = 0; i < result.length; i++) {
                        const findVal = inputFieldsNames.find(x => x.original == result[i]);
                        result[i] = findVal ? findVal.modified : result[i];
                    }
                    vm.inputfields = result;
                });
            }

            function getallsettings() {
                vm.loading = true;
                dataSharingSettingService.getAllSettingsTolls().success(function (result) {
                    vm.settings = result;
                    getSharingFormat();
                }).finally(function () {
                    vm.tollsabudhabai = vm.settings.find(x => x.dataToShare == 3);
                    for (var j = 0; j < vm.tollsabudhabai.configuration.fieldMappings.length; j++) {
                        const findVal = inputFieldsNames.find(x => x.original == vm.tollsabudhabai.configuration.fieldMappings[j].inputField);
                        vm.tollsabudhabai.configuration.fieldMappings[j].inputField = findVal ? findVal.modified : vm.tollsabudhabai.configuration.fieldMappings[j].inputField;
                    }

                    if (vm.sharingFormat != 4 && vm.sharingFormat != 5 && (vm.tollsabudhabai.configuration.fieldMappings.length === 0 || !vm.tollsabudhabai.configuration.fieldMappings))
                        vm.addRow();
                    if (vm.sharingFormat == 4 || vm.sharingFormat == 5 && (vm.tollsabudhabai.configuration.sharedDBs.length === 0 || !vm.tollsabudhabai.configuration.fieldMappings))
                        vm.addcustomRow();
                    vm.loading = false;
                });
            }

            vm.save = function () {
                vm.saving = true;
                vm.loading = true;
                if (vm.dataToShare == 3)
                    vm.setting = vm.tollsabudhabai;
                vm.setting.dataToShare = vm.dataToShare;
                vm.setting.sharingFormat = vm.sharingFormat;
                vm.setting.isActive = 1;
                vm.setting.configuration.sharingStartDate = moment(vm.setting.configuration.sharingStartDate).startOf('day');


                for (var j = 0; j < vm.tollsabudhabai.configuration.fieldMappings.length; j++) {
                    const findVal = inputFieldsNames.find(x => x.modified == vm.tollsabudhabai.configuration.fieldMappings[j].inputField);
                    vm.tollsabudhabai.configuration.fieldMappings[j].inputField = findVal ? findVal.original : vm.tollsabudhabai.configuration.fieldMappings[j].inputField;
                }


                dataSharingSettingService.updateAllSettings(vm.setting).success(function (result) {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function init() {
                vm.dataToShare = 3;
                getSharingFormat();
                getinputfields();
                getallsettings();
            }


            init();
        }
    ]);
