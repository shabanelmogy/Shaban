// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:434631-434792
appModule.controller('tenant.views.fuel.downloading.index', [
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

			vm.downloadFuelTransV3 = function () {
				chromeExtDownloader.downloadFuelV3(vm, false);
			};

			vm.getFuelAccountsForDownload = function () {
				vm.loading = true;
				uaeFuelTransactions.getFuelAccountsForDownload()
					.success(function (result) {
						vm.fuelAccounts = result.filter(x => x.type == 2);
					}).finally(function () {
						vm.loading = false;

						if (!$scope.$$phase)
							$scope.$digest();
					});
			};

			vm.downloadByAccount = function (fuelAccount) {
				fuelAccount.isDownloading = true;
				vm.isDownloading = true;

				fuelAccount.smartEnabled = abp.features.isEnabled("FuelDataMangementDownlaod.ADNOCTransactions.Smart");
				fuelAccount.smartPlusEnabled = abp.features.isEnabled("FuelDataMangement.DownlaodADNOCTransactions.SmartPlus");
				fuelAccount.rahalEnabled = abp.features.isEnabled("FuelDataMangement.DownlaodADNOCTransactions.Rahal");
				fuelAccount.downloadAdnocfromInvoiceLink = abp.setting.getBoolean('App.General.Fuel.DownloadAdnocSmartTransactionsfromInvoiceLink');

				if (!fuelAccount.smartEnabled &&
					!fuelAccount.smartPlusEnabled &&
					!fuelAccount.rahalEnabled) {
					abp.message.info('Smart || Plus || Rahal one of the features need to enable.');
					return;
				}

				fuelAccount.error = '';
				fuelAccount.status = '';

				let fuelRequest = {};
				fuelRequest.fromDate = fuelAccount.lastDownloadDate ?
					moment(fuelAccount.lastDownloadDate).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY");
				fuelRequest.toDate = moment().format("DD/MM/YYYY");
				fuelRequest.type = fuelAccount.type;
				fuelRequest.fuelTransAccounts = [];
				fuelRequest.fuelTransAccounts.push(fuelAccount);

				//temporary date adjustment only for 2 months
				fuelRequest.fromDate = moment().add('month', -1).startOf('month').format("DD/MM/YYYY");

				if (chromeExtDownloader.isMv3ExtensionAvailable()) {

					vm.callbackOnComplete = function () {
						console.log('callbackOnComplete run');
						vm.isDownloading = false;
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

				let fnc = `function reportFuelStatus(status) {
					var $scope = angular.element('#appController').scope();
					if (status.isComplated || (status.error && !status.error === {})) {
						debugger;
						$scope.vm.isDownloading = false;

						if (status.isCancled) {
							let acc = $scope.vm.fuelAccounts.find(x => x.isDownloading);
							acc.progress = null;
							acc.status = null;
							acc.error = "Cancled";
							acc.isCompleted = true;
							acc.isDownloading = false;
							acc.cls = 'badge badge-danger';
						}
						else if (status.account) {
							var acc = $scope.vm.fuelAccounts.find(x => x.id == status.account.id);
							acc.progress = status.progress;
							acc.status = status.status;
							acc.status = status.error ? status.error : '';
							acc.isCompleted = true;
							acc.isDownloading = false;
							acc.cls = 'badge badge-success';

							$scope.vm.getFuelAccountsForDownload();
						}
					}
					else {
						$scope.vm.isDownloading = true;

						if (status.account) {
							var acc = $scope.vm.fuelAccounts.find(x => x.id == status.account.id);
							acc.progress = status.progress;
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

			vm.showError = function (acc) {
				abp.message.error(acc.error);
			};

			function init() {
				vm.getFuelAccountsForDownload();
			}

			init();
		}
	]);
