// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:313352-313369
appModule.controller('tenant.views.crs.vehicles.selectCheckList', [
         '$uibModalInstance',  'options',
        function ( $uibModalInstance,options) {

            var vm = this;
            vm.checkList = options.checkList;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
       
            vm.save = function ()
            {
                $uibModalInstance.close();
            };
         
        }
    ]);
