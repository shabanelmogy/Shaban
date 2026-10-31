// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170662-170892
appModule.controller('tenant.views.crs.subscriptionAndBilling.index', ['$scope', 'abp.services.app.stripeBilling',
        function ($scope, StripeBillingAppService) {

            var vm = this;

            vm.loading = true;
            vm.cardbusy = true;
            vm.changeCard = false;
            vm.publishKey = "";
            vm.isCardFromInitialized = false;

            init();
            function init() {
                getStripeCustomer();
                getBillingHistory();
                GetPublishKey();
            }

            function getStripeCustomer() {
                vm.loading = true;
                StripeBillingAppService.getStripeCustomer()
                    .success(function (result) {

                        if (result) {
                            vm.customer = result;
                            vm.subscriptions = result.subscriptions.data;
                        }

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getlocalDateTime = function (date) {

                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD hh:mm:ss');
                }
                else {
                    return "";
                }
            };

            vm.changeCardClicked = function () {
                if (vm.isCardFromInitialized === false) {
                    prepareCardElement(vm.publishKey);
                }
            };

            vm.centsToDollers = function (cents) {
                return (cents / 100).toFixed(2);
            };

            //Card and Configuration
            function GetPublishKey() {

                vm.cardbusy = true;
                StripeBillingAppService.getStripePublishKey()
                    .success(function (result) {

                        if (result) {
                            vm.publishKey = result;
                            getCardInformation(vm.publishKey);
                        } else {
                            vm.cardbusy = false;
                            abp.notify.error(app.localize('StripeError'));
                        }

                    }).error(function () {
                        vm.cardbusy = false;
                        abp.notify.error(app.localize('Error'));
                    });
            }

            function getCardInformation(key) {

                StripeBillingAppService.getStripeCard()
                    .success(function (result) {

                        if (result) {
                            vm.viewCard = true;
                            setCardForDisplay(result);

                        } else {
                            vm.viewCard = false;
                            prepareCardElement(key);
                        }

                    }).error(function () {
                        abp.notify.error(app.localize('Error'));
                    }).finally(function () {
                        vm.cardbusy = false;
                    });
            }

            function getBillingHistory() {
                vm.billingHistoryBusy = true;
                StripeBillingAppService.getStripeCharges()
                    .success(function (result) {
                        if (result) {
                            vm.billiHistoryList = result.data;
                        }
                    }).error(function () {
                        abp.notify.error(app.localize('Error'));
                    }).finally(function () {
                        vm.billingHistoryBusy = false;
                    });
            }

            function prepareCardElement(key) {

                var stripe = Stripe(key);
                var elements = stripe.elements();
                var style = {
                    base: {
                        color: '#32325d',
                        lineHeight: '18px',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                };
                var card = elements.create('card', { style: style, hidePostalCode: true });

                // Add an instance of the card Element into the `card-element` <div>.
                card.mount('#card-element');
                vm.isCardFromInitialized = true;

                // Handle real-time validation errors from the card Element.
                card.addEventListener('change', function (event) {

                    var displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }

                });

                // Handle form submission.
                var form = document.getElementById('payment-form');
                form.addEventListener('submit', function () {

                    event.preventDefault();

                    stripe.createToken(card).then(function (result) {

                        if (result.error) {
                            var errorElement = document.getElementById('card-errors');
                            errorElement.textContent = result.error.message;
                        } else {
                            // Send the token to your server.
                            vm.cardbusy = true;

                            // creating 1st card
                            if (vm.changeCard === false) {

                                StripeBillingAppService.createStripeCard(result.token.id)
                                    .success(function (result) {
                                        if (result) {

                                            vm.viewCard = true;
                                            setCardForDisplay(result);
                                            abp.notify.info(app.localize('CardAddedSuccessfully'));
                                            card.clear();

                                        } else {
                                            abp.notify.error(app.localize('FailedToAddCard'));
                                        }
                                    }).error(function () {
                                        abp.notify.error(app.localize('Error'));
                                    }).finally(function () {
                                        vm.cardbusy = false;
                                    });

                            } else { //replacing existing card

                                StripeBillingAppService.changeStripeCard(result.token.id)
                                    .success(function (result) {
                                        if (result && result.id) {

                                            vm.viewCard = true;
                                            vm.changeCard = false;
                                            setCardForDisplay(result);
                                            abp.notify.info(app.localize('CardAddedSuccessfully'));
                                            card.clear();

                                        } else {
                                            abp.notify.error(app.localize('FailedToAddCard'));
                                        }
                                    }).error(function () {
                                        abp.notify.error(app.localize('Error'));
                                    }).finally(function () {
                                        vm.cardbusy = false;
                                    });
                            }

                        }

                    });

                });
            }

            function setCardForDisplay(card) {
                vm.card = card;
                var date = "";

                if (vm.card.exp_month < 10) {
                    date = '0' + vm.card.exp_month + '-' + vm.card.exp_year;
                } else {
                    date = vm.card.exp_month + '-' + vm.card.exp_year;
                }

                vm.card.expiryDate = date;
            }

            vm.adjustAmount = function (perUnitAmount, quantity) {
                return perUnitAmount / 100 * quantity;
            };
        }
    ]);
