// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:182131-182193
appModule.controller('tenant.views.common.documents.addCreditCardModal', [
        '$scope', '$uibModalInstance', 'contactCreditCard', 'utilities',
        function ($scope, $uibModalInstance, contactCreditCard, utilities)
        {

            var vm = this;
            vm.isCvv = utilities.parseBoolean(abp.setting.get("App.General.IsCvv"));
            vm.isCardLast4DigitsOnly = utilities.parseBoolean(abp.setting.get("App.General.IsCardLast4DigitsOnly"));
            vm.creditCard = contactCreditCard;
            $scope.ccinfo = { type: undefined };

            const currentMonth = moment().format('YYYY-MM');
            vm.dateOptions = { viewMode: 'months', format: 'YYYY-MM', minDate: currentMonth };

            vm.ab = function (val)
            {
                setTimeout(function ()
                {
                    //debugger;
                    let value = vm.creditCard.cardNo;
                    let type = (/^5[1-5]/.test(value)) ? "MasterCard"
                        : (/^4/.test(value)) ? "Visa"
                            : (/^3[47]/.test(value)) ? 'AmericanExpress'
                                : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
                                    : undefined;
                    vm.cardNumberChanged(type);
                }, 1000);
            }


            vm.creditCardTypes = [{ id: 1, name: 'MasterCard' }, { id: 2, name: 'Visa' }, { id: 3, name: 'AmericanExpress' }];

            vm.cardNumberChanged = function (type)
            {
                if (type) {
                    let o = vm.creditCardTypes.find(x => x.name === type);
                    if (o) vm.creditCard.type = o.id;
                    //vm.noValid = vm.creditCard.type !== vm.creditCardTypes.find(x => x.name === type).id;
                    $scope.$apply();
                }
            };

            function setDateIfPreviousMonthSelected()
            {
                console.log('set expiry date');
                if (moment(vm.creditCard.expiry, "YYYY-MM").endOf('month') < moment().endOf('month'))
                    vm.creditCard.expiry = moment().endOf('month').format('YYYY-MM');
            }

            vm.save = function ()
            {
                setDateIfPreviousMonthSelected();
                $uibModalInstance.close(vm.creditCard);
            };

            vm.cancel = function ()
            {
                $uibModalInstance.dismiss();
            };


        }
    ]);
