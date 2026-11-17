// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:26935-27012
appModule.controller('common.views.layout.sidebar', [
        '$scope', '$state',
        function ($scope, $state) {
            var vm = this;
            
            if (abp.features.isEnabled("POS")) {
                vm.menu = abp.nav.menus.POS;
            }
            else if (abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("CRS.Limo")
                || abp.features.isEnabled("CRS.Transportation") || abp.features.isEnabled("CRS.Lease") ||
                abp.features.isEnabled("FMS.VehicleAssignment") || abp.features.isEnabled("WORKSHOP")) {
                vm.menu = abp.nav.menus.CRS;

                ////Jogar :) Fix later.
                //if (!(abp.auth.hasPermission('Pages.Tenant.Reports'))) {
                //    if (vm.menu.items.length > 0) {
                //        var lastIndex = vm.menu.items.length - 1;
                //        if (vm.menu.items[lastIndex].displayName == 'Reports')
                //            vm.menu.items.splice(lastIndex, 1);
                //    }

                //}

                ////Jogar 2:) Fix later.
                //if ((abp.features.isEnabled('ERS'))) {
                //    if (vm.menu.items.length > 0) {

                //        if (vm.menu.items.some(e => e.name == 'CRS.TariffGroups.Tenant')) {
                //            var menuItem = vm.menu.items.filter(e => e.name == 'CRS.TariffGroups.Tenant')[0];
                //            var lastIndex = vm.menu.items.indexOf(menuItem);
                //            vm.menu.items.splice(lastIndex, 1);
                //        }

                //    }

                //}

                ////Jogar 3:) Fix later.
                //if ((!abp.features.isEnabled('WORKSHOP'))) {
                //    if (vm.menu.items.length > 0) {

                //        if (vm.menu.items.some(e => e.name == 'CRS.WorkShop.Tenant')) {
                //            var menuItem = vm.menu.items.filter(e => e.name == 'CRS.WorkShop.Tenant')[0];
                //            var lastIndex = vm.menu.items.indexOf(menuItem);
                //            vm.menu.items.splice(lastIndex, 1);
                //        }

                //    }

                //}

                

            } else if (abp.features.isEnabled("MCC") || abp.features.isEnabled("VMIWorkshop")) {
                vm.menu = abp.nav.menus.MCC;
            } else if (abp.features.isEnabled("TMS") || abp.features.isEnabled("TFMS")) {
                vm.menu = abp.nav.menus.TollsFines;
            } else if (abp.features.isEnabled("VMIGeneric")) {
                vm.menu = abp.nav.menus.VMIGeneric;
            } else if (abp.features.isEnabled("Core.Support")) {
                vm.menu = abp.nav.menus.Support;
            } 
            else {
                vm.menu = abp.nav.menus.MainMenu;
            }

            //External customer login menu
            if (abp.features.isEnabled('ExternalLogin') && abp.auth.hasPermission('Page.ExternaLogin') && !abp.auth.hasPermission('Pages')) {
                vm.menu = abp.nav.menus.ExternalLogin;
            }

            $scope.$on('$includeContentLoaded', function () {
                setTimeout(function () {
                    Layout.initSidebar($state); // init sidebar
                }, 0);
            });
        }
    ]);
