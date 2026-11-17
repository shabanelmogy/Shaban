// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:434436-434627
appModule.controller('tenant.views.fuel.downloading.downloadEnoc', [
        '$scope', 'abp.services.app.uaeFuelTransactions', 'chromeExtDownloader',
        function ($scope, uaeFuelTransactions, chromeExtDownloader) {
            var vm = this;
            vm.fuelAccounts = [];
            var dateFormat = abp.setting.get("App.General.DateFormat");
            if (!dateFormat) dateFormat = 'dd/MM/yyyy';


            vm.getDate = function (date) {
                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(dateFormat);
                } else {
                    return '';
                }
            };

            vm.getFuelAccountsForDownload = function () {
                vm.loading = true;
                uaeFuelTransactions.getFuelAccountsForDownload()
                    .success(function (result) {
                        vm.fuelAccounts = result.filter(x => x.type == 1);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function sendCaptcha(d) {
                const o = {
                    captchaText: d.captchaTxt, fuelAccount: d.fuelAccount, type: 'processCaptcha'
                };

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                    o.captchaTxt = d.captchaTxt;
                    o.capthaTabId = d.capthaTabId; //apply script on this tab
                    chromeExtDownloader.sendCaptchaMv3(o)
                }
                else {
                    var event = new CustomEvent('startFuelDownloadingENOC', {
                        detail: JSON.stringify(o)
                    });

                    event.initEvent('startFuelDownloadingENOC');
                    document.dispatchEvent(event);
                }
            }

            vm.captchaKeyPress = function (keyEvent, acc) {
                if (keyEvent.which === 13) {
                    sendCaptcha({ type: "applyCaptcha", captchaTxt: acc.captchaTxt, account: acc, capthaTabId: acc.capthaTabId });
                }
            };

            vm.downloadFuelTransV3 = function () {
                chromeExtDownloader.downloadFuelV3(vm, false);
            };

            vm.downloadByAccount = function (fuelAccount) {

                debugger;
                //abp.message.info('Temporary disabled, please contact Sales for new module');

                fuelAccount.isDownloading = true;
                vm.isDownloading = true;

                fuelAccount.enocVIPEnabled = abp.features.isEnabled("FuelDataMangement.DownloadENOCTransactions.Vip");
                fuelAccount.enocMainEnabled = false; // abp.features.isEnabled("FuelDataMangement.DownloadENOCTransactions.Enoc");

                if (!fuelAccount.enocVIPEnabled &&
                    !fuelAccount.enocMainEnabled) {
                    abp.message.info('VIP || MAIN one of the features need to enable.');
                    return;
                }

                fuelAccount.error = '';
                fuelAccount.status = '';

                let fuelRequest = {};
                fuelRequest.fromDate = moment().add('month', -1).startOf('month').format("DD/MM/YYYY");
                fuelRequest.toDate = moment().add('month', -1).endOf('month').format("DD/MM/YYYY");
                fuelRequest.type = fuelAccount.type;
                fuelRequest.fuelTransAccounts = [];
                fuelRequest.fuelTransAccounts.push(fuelAccount);

                if (chromeExtDownloader.isMv3ExtensionAvailable()) {

                    vm.callbackOnComplete = function () {
                        vm.getFuelAccountsForDownload();
                    };

                    vm.fuelRequest = {
                        request: fuelRequest,
                        fuelAccounts: fuelRequest.fuelTransAccounts
                    };

                    chromeExtDownloader.initV3(vm, vm.downloadFuelTransV3);

                    return;
                }

                var funcNode = document.getElementById('speedExtReporting');
                if (funcNode) {
                    funcNode.parentElement.removeChild(funcNode);
                }

                let fnc = `function processCaptcha(msg) {
					let $scope = angular.element(document.querySelectorAll('[ng-controller]')[1]).scope();
					let fuelAccount = $scope.vm.fuelAccounts.find(x => x.id === msg.fuelAccount.id);
					fuelAccount.captchaSrc = msg.captcha;
					fuelAccount.captchaTxt = '';

					if (!$scope.$$phase) {
						$scope.$digest();
					}
				}

				function reportFuelStatus(status) {
					var $scope = angular.element('#appController').scope();
                    debugger;
					if (status.isComplated || (status.error && !status.error === {})) {
						
						$scope.vm.isDownloading = false;

						if (status.isCancled) {
							let acc = $scope.vm.fuelAccounts.find(x => x.isDownloading);
							acc.progress = null;
							acc.status = null;
							acc.error = "Cancled";
							acc.isCompleted = true;
							acc.isDownloading = false;
							acc.captcha = '';
							acc.cls = 'badge badge-danger';
						}
						else if (status.fuelAccount) {
							var acc = $scope.vm.fuelAccounts.find(x => x.id == status.fuelAccount.id);
							acc.progress = status.progress;
							acc.status = status.status;
							acc.status = status.error ? status.error : '';
							acc.isCompleted = true;
							acc.captcha = '';
							acc.isDownloading = false;
							acc.cls = 'badge badge-success';

							$scope.vm.getFuelAccountsForDownload();
						}
					}
					else {
						$scope.vm.isDownloading = true;

						if (status.fuelAccount) {
							var acc = $scope.vm.fuelAccounts.find(x => x.id == status.fuelAccount.id);
							acc.progress = status.progress;
							acc.captcha = status.captcha;
							acc.status = status.status;
							acc.isComplated = status.isComplated;
							acc.error = status.error;
							acc.cls = 'badge badge-info';
						}
					}

					if (!$scope.$$phase) {
						$scope.$digest();
					}
				} `;


                chromeExtDownloader.downloadFuelTrans(
                    fuelRequest,
                    fnc,
                    function error(e) {

                        vm.isDownloading = false;

                        if (!$scope.$$phase)
                            $scope.$digest();

                        abp.message.error(e.error);
                    });
            };

            vm.round = function (value) {
                return Math.round(value, 2);
            };

            function init() {
                vm.getFuelAccountsForDownload();
            }

            init();
        }
    ]);
