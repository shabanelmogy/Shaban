// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:246914-247063
appModule.controller('tenant.views.crs.limousine.quotations.viewModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.commonLookup', 'abp.services.app.limoQuotation', 'quotationId', 'appSession', 'abp.services.app.billingMethod',
        function ($uibModal, $uibModalInstance, utilities, lookupService, limoQuotationService, quotationId, appSession, billingMethodService) {
            var vm = this;
            vm.customers = [];
            vm.paymentMethods = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.contactId = appSession.user.contactId;
            vm.revisedQuotationId = quotationId;
            vm.taxCategoryChangeableInTrip = abp.features.isEnabled('CRS.TaxCategoryChangeableInTrip');
            vm.isNoOfTripsInLimoEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.NoOfTripsInLimo"));
            vm.limoQuotation_ContactPersonName = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_ContactPersonName'));
            vm.limoQuotation_PaymentMethod = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PaymentMethod'));
            vm.limoQuotation_PaymentTerms = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PaymentTerms'));
            vm.limoQuotation_PickUpDateTime = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PickUpDateTime'));
            vm.limoQuotation_DropOffDateTime = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_DropOffDateTime'));
            var limoQuotationId = quotationId;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.permissions = {
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
            };

            vm.getTaxCategory = function (id) {
                if (id == 1) {
                    return "Standard";
                }
                else if (id == 2) {
                    return "Tax Exempted";
                }
                else if (id == 3) {
                    return "Zero Rated";
                }
                else {
                    return " ";
                }
            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getPaymentTerms = function (id) {
                if (id == 1) {
                    return "Advance";
                }
                if (id == 2) {
                    return "Credit";
                }
                return "";
            };
            vm.viewCharges = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/quotations/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.quotations.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                quotation: vm.limo,
                                viewMode: true
                            };
                        }
                    }
                });

            };

            var getLocationDetail = function (locationObj) {
                return locationObj.detail ? locationObj.detail : locationObj.title;
            }

            vm.openMapUrl = function () {
                var url = null;

                if (vm.limo.pickupLocation && vm.limo.dropOffLocation)
                    url = "https://www.google.com/maps/dir/?api=1&origin=" + getLocationDetail(vm.limo.pickupLocation) + '&destination=' + getLocationDetail(vm.limo.dropOffLocation);
                else if (vm.limo.pickupLocation || vm.limo.dropOffLocation) {
                    var location = vm.limo.pickupLocation ? vm.limo.pickupLocation : vm.limo.dropOffLocation;
                    url = url = "https://maps.google.com/?q=" + getLocationDetail(location);
                }

                if (url)

                    window.open(url);

            };

            vm.localize = function (input) {
                return app.localize(input);
            };


            function getPaymentMethods() {

                vm.loading = true;
                billingMethodService.getBillingMethods({ category: null }).success(function (data) {
                    vm.paymentMethods = data.items;
                }).finally(function () {
                   vm.loading = false;
                });
            }


            vm.getStatus = function (code) {
                if (code === 1)
                    return "Open";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else
                    return "Open";
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                if (vm.limoQuotation_PaymentMethod)
                {
                    getPaymentMethods();
                }
                limoQuotationService.getQuotationForEdit({ id: limoQuotationId }).success(function (data) {
                    vm.limo = data;
                    vm.paymentTermsText = vm.getPaymentTerms(vm.limo.paymentTerms);
                }).finally(function () {
                    vm.loading = false;
                });

            }

            function initQuotation() {
                init();
            }
            initQuotation();
        }]);
