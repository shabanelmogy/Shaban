// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:434795-434909
appModule.controller('tenant.views.fuel.fuelReport.report', [
		'$scope', '$stateParams', 'abp.services.app.uaeFuelTransactions',
		function ($scope, $stateParams, uaeFuelTransactionsServices) {

			var vm = this;
			vm.filters = null;

			if ($scope.$parent !== null) {
				if ($scope.$parent.vmMain !== null)
					vm.filters = $scope.$parent.vmMain.filters;
			}

			if (vm.filters === null)
				vm.filters = $stateParams.filters;

			$scope.$on('$viewContentLoaded', function () {
				App.initAjax();
			});

			vm.loading = false;
			vm.dateRangeOptions = app.createDateRangePickerOptions();
			vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
			vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
			vm.dateFormat = abp.setting.get("App.General.DateFormat");
			vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
			vm.totalAmount = 0;

			vm.getlocalDateTime = function (date) {
				if (date != null) {
					return moment(date).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			//vm.vm.getDateFormat = function (date) {
			//	if (date !== null) {
			//		var localTime = moment.utc(date).toDate();
			//		return moment(localTime).format(vm.dateTimeFormat);
			//	}
			//	else {
			//		return "";
			//	}
			//};


			vm.getDateFormat = function (date) {
				if (date !== null) {
					return moment.utc(date).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			//vm.getlocalDate = function (date) {
			//	if (date != null) {
			//		return moment(date).utc().format(vm.dateFormat);
			//	}
			//	else {
			//		return "";
			//	}
			//};

			vm.dateRangeModel = {
				startDate: moment(moment().format('YYYY-MM-DD')).utc(),
				endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
			};

			vm.getSource = function (key) {
				if (key.toString() === "1") return "Eppco Enoc";
				else if (key.toString() === "2") return "Eppco Vip";
				else if (key.toString() === "3") return "Adnoc Smart";
				else if (key.toString() === "4") return "Adnoc Plus";
				else if (key.toString() === "5") return "Adnoc Rahal";
			};

			function init() {
				vm.loading = true;

				//vm.filters.fromDate = moment(vm.filters.fromDate);
				//vm.filters.toDate = moment(vm.filters.toDate);
				//vm.filters.fromTime = moment(vm.filters.fromTime);
				//vm.filters.toTime = moment(vm.filters.toTime);

				////vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
				////vm.filters.toDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

				//vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
				//vm.filters.toDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

				//if (vm.filters.fromDate > vm.filters.toDate) return;


				//if (vm.filters.durationType === null) vm.filters.durationType = 1;

				uaeFuelTransactionsServices.getFuelTransactionReport(vm.filters)
					.success(function (data) {
						vm.fuelTransaction = data;

						vm.totalAmount = 0;
						for (var i = 0; i < data.length; i++) {
							vm.totalAmount += data[i].amount;
						}

						vm.totalAmount = Math.round(vm.totalAmount, 2);

					}).finally(function () {
						vm.loading = false;
					});

			}
			init();
		}]);
