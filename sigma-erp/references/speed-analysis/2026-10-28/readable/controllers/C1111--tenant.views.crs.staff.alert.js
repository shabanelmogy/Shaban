// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:292755-292815
appModule.controller('tenant.views.crs.staff.alert', [
        '$scope', 'abp.services.app.staff',
        function ($scope, staffService) {

            var vm = this;
          
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getIdentificationDocumentType = function (id) {

                if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 6)
                    return app.localize('StaffDocument1');
                else if (id == 7)
                    return app.localize('HealthCard');
                else
                    return "";
            };

            vm.getStaffwithexpireddocumets = function () {
                staffService.getStaffByExpiredDocuments().success(function(result) {
                    vm.staff = result.items;
                    console.log(result); 

                }).finally(function () {

                });;
            };

            function init() {
                vm.getStaffwithexpireddocumets();
            }
    
            init();         
        }
    ]);
