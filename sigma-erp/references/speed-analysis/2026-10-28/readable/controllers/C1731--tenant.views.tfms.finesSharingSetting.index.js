// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:474716-474959
appModule.controller('tenant.views.tfms.finesSharingSetting.index', [
        '$scope', 'abp.services.app.dataSharingSetting', 'utilities',
        function ($scope, dataSharingSettingService, utilities)
        {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.fields = [];
            vm.shareFileFormat = abp.features.getValue("TFMS.Fines.ShareFines.FileFormat");
            vm.reDownloadDiscountedAbuDhabiFines = abp.setting.get("App.Speed.Common.ReDownloadDiscountedAbuDhabiFines") == 'True' || 'true' ? true : false;

            $scope.$on('$viewContentLoaded', function ()
            {
                App.initAjax();
            });

            vm.settings = {
                dataToShare: 2,
                isActive: 1
            };

            function getSharingFormat()
            {
                if (vm.shareFileFormat == "CSV") {
                    vm.settings.sharingFormat = 1;
                    vm.shareAs = app.localize('CSV');
                }
                else if (vm.shareFileFormat == "MsSql") {
                    vm.settings.sharingFormat = 2;
                    vm.shareAs = app.localize('MsSql');
                }
                else if (vm.shareFileFormat == "MySql") {
                    vm.settings.sharingFormat = 3;
                    vm.shareAs = app.localize('MySql');
                }
                else if (vm.shareFileFormat == "Oracle") {
                    vm.settings.sharingFormat = 7;
                    vm.shareAs = app.localize('Oracle');
                }
                else if (vm.shareFileFormat == "E-Fines(Desktop)") {
                    vm.settings.sharingFormat = 10;
                    vm.shareAs = app.localize('E-Fines(Desktop)');
                }
                else if (vm.shareFileFormat == "CustomArenco") {
                    vm.settings.sharingFormat = 5;
                    vm.shareAs = app.localize('CustomArenco');
                }
                else if (vm.shareFileFormat == "RESTApi") {
                    vm.settings.sharingFormat = 11;
                    vm.shareAs = app.localize('RESTApi');
                }
            };

            vm.getlocalDate = function (date)
            {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.fieldtypechange = function (row)
            {
                if (row.fieldType != 1)
                    row.maxLength = null;
                if (row.inputField != "N/A")
                    row.defaultValue = null;
                if (row.filedType != 3)
                    row.defaultValue = null;
            };

            vm.sortOfSettingsChanged = function (event, ui)
            {
                vm.loading = true;
                var obj = JSON.parse(ui.item.attr('data-id'));
                var updatedIndex = ui.item.index();

                var row = obj.row;


                if (updatedIndex == 0) {

                    row.order = (vm.settings.configuration.fieldMappings[0].order) / 2;
                    var element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                else if (updatedIndex == (vm.settings.configuration.fieldMappings.length - 1)) {
                    row.order = (vm.settings.configuration.fieldMappings[updatedIndex].order + vm.settings.configuration.fieldMappings[updatedIndex].order + 1) / 2;
                    var element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                else {
                    if (updatedIndex > obj.rowIndex)
                        row.order = (vm.settings.configuration.fieldMappings[updatedIndex + 1].order + vm.settings.configuration.fieldMappings[updatedIndex].order) / 2;
                    else if (updatedIndex < obj.rowIndex)
                        row.order = (vm.settings.configuration.fieldMappings[updatedIndex - 1].order + vm.settings.configuration.fieldMappings[updatedIndex].order) / 2;
                    var element = row;
                    vm.settings.configuration.fieldMappings.splice(obj.rowIndex, 1);
                    vm.settings.configuration.fieldMappings.splice(updatedIndex, 0, element);
                }
                vm.loading = false;
                $scope.$apply();
            };

            vm.addRow = function ()
            {
                if (vm.settings)
                    vm.settings.configuration.fieldMappings.push({
                        order: vm.settings.configuration.fieldMappings.length < 1 ? 1 :
                            vm.settings.configuration.fieldMappings[vm.settings.configuration.fieldMappings.length - 1].order + 1,
                        inputfield: null,
                        outputfield: null,
                        fieldtype: null,
                        format: null,
                        defaultvalue: null,
                        maxlength: null
                    });

            };
            function customsettings()
            {
                var line = new Object();
                line.companyCode = null;
                line.dbServer = null;
                line.dbName = null;
                line.user = null;
                line.password = null;
                return line;
            };

            vm.addcustomRow = function ()
            {
                debugger;
                vm.settings.configuration.sharedDBs.push(customsettings());

            };
            vm.removecustomrow = function (row)
            {
                var index = vm.settings.configuration.sharedDBs.indexOf(row);
                vm.settings.configuration.sharedDBs.splice(index, 1);
            };
            vm.removerow = function (row)
            {
                var index = vm.settings.configuration.fieldMappings.indexOf(row);
                vm.settings.configuration.fieldMappings.splice(index, 1);
            };

            vm.dataSharingfieldtypes = [
                { key: 1, value: "Text" }, { key: 2, value: "Numeric" }, { key: 3, value: "DateTime" }, { key: 4, value: "Decimal" }, { key: 5, value: "Boolean" }, { key: 6, value: "Time" }];


            //To give extra details to Input Mapping Fields to better understand the data nature.
            const inputFieldsNames = [
                { original: 'DownloadDateTime', modified: 'DownloadDateTime_UTC' },
                { original: 'FineDateTime', modified: 'FineDateTime_UTC' },
                { original: 'DiscountRate', modified: 'DiscountRate%' }
            ];

            function getinputfields()
            {
                dataSharingSettingService.getInputFieldsFines().success(function (result)
                {
                    debugger;
                    for (var i = 0; i < result.length; i++) {
                        const findVal = inputFieldsNames.find(x => x.original == result[i]);
                        result[i] = findVal ? findVal.modified : result[i];
                    }

                    if (result.filter(x => x == 'LateCharges').length == 0)
                        result.push('LateCharges');

                    vm.inputfields = result;
                });
            };

            function getallsettings()
            {
                vm.loading = true;
                dataSharingSettingService.getAllSettingsFines(vm.settings).success(function (result)
                {
                    debugger;
                    vm.settings = result;

                    for (var j = 0; j < vm.settings.configuration.fieldMappings.length; j++) {
                        const findVal = inputFieldsNames.find(x => x.original == vm.settings.configuration.fieldMappings[j].inputField);
                        vm.settings.configuration.fieldMappings[j].inputField = findVal ? findVal.modified : vm.settings.configuration.fieldMappings[j].inputField;
                    }

                    getSharingFormat();

                }).finally(function ()
                {
                    if (vm.settings.configuration.fieldMappings.length == 0)
                        vm.addRow();
                    if (vm.settings.configuration.sharedDBs.length === 0 || !vm.settings.configuration.fieldMappings)
                        vm.addcustomRow();
                    vm.loading = false;
                });
            };

            vm.save = function ()
            {
                vm.saving = true;
                vm.loading = true;
                vm.settings.dataToShare = 2;
                vm.settings.isActive = 1;
                getSharingFormat();
                vm.settings.configuration.sharingStartDate = moment(vm.settings.configuration.sharingStartDate).startOf('day');

                //---------------------------
                // Modify InputFields of mapping to remove extra strings i.e Utc, % etc.
                for (var j = 0; j < vm.settings.configuration.fieldMappings.length; j++) {
                    const findVal = inputFieldsNames.find(x => x.modified == vm.settings.configuration.fieldMappings[j].inputField);
                    vm.settings.configuration.fieldMappings[j].inputField = findVal ? findVal.original : vm.settings.configuration.fieldMappings[j].inputField;
                }
                //---------------------------

                dataSharingSettingService.updateAllSettings(vm.settings).success(function (result)
                {
                    vm.loading = false;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    getallsettings();
                }).finally(function ()
                {
                    vm.saving = false;
                })
            }

            function init()
            {
                getinputfields();
                getallsettings();
            }


            init();
        }
    ]);
