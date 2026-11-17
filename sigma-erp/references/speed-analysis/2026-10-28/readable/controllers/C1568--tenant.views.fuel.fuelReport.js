// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:433646-433992
appModule.controller('tenant.views.fuel.fuelReport', [
		'$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.uaeFuelTransactions', 'abp.services.app.fuelAccount',
		function ($scope, $uibModal, uiGridConstants, uaeFuelTransactionsServices, fuelAccountServices) {
			var vm = this;

			$scope.$on('$viewContentLoaded', function () {
				App.initAjax();
			});

			vm.isFuelModuleEnabled = abp.features.isEnabled("FuelDataMangement");
			vm.isFuelAdnocSmartEnabled = abp.features.isEnabled("FuelDataMangementDownlaod.ADNOCTransactions.Smart");
			vm.isFuelAdnocPlusEnabled = abp.features.isEnabled("FuelDataMangement.DownlaodADNOCTransactions.SmartPlus");
            vm.isFuelAdnocRahalEnabled = abp.features.isEnabled("FuelDataMangement.DownlaodADNOCTransactions.Rahal");
            vm.isFuelEnocEnabled = abp.features.isEnabled("FuelDataMangement.DownloadENOCTransactions.Enoc");
            vm.isFuelVipEnabled = abp.features.isEnabled("FuelDataMangement.DownloadENOCTransactions.Vip");
			vm.isSharingEnable = abp.auth.hasPermission("Pages.Tenant.FuelDataMangement.SharingSetting");
			vm.loading = false;
			vm.dateRangeOptions = app.createDateRangePickerOptions();
			vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
			vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
			vm.dateFormat = abp.setting.get("App.General.DateFormat");
			vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
			var now = new Date();

			vm.filters = {
				enableDateRange: true,
				name: "",
				fromDate: null,
				fromTime: null,
				toDate: null,
				toTime: null,
				amount: null,
				skipCount: 0,
				maxResultCount: app.consts.grid.defaultPageSize,
				fuelAccount: null,
				durationType: 1,
				fuelShareStatus: null,
				source: 0,
				vehicleInfo: []
			};

			vm.type = [
				{
					id: 1,
					name: 'ENOC'
				},
				{
					id: 2,
					name: 'ADNOC'
				}];

			function getFiltersDateForSAF() {
				vm.filters.fromDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
				vm.filters.toDate = moment(moment().format('YYYY-MM-DD HH:mm')).add(1, 'days').add(-1, 'milliseconds').utc();
				vm.filters.fromTime = moment(new Date()).startOf('day').utc();
				vm.filters.toTime = moment(new Date()).endOf('day').utc();
			};

			vm.dateRangeModelChanged = function () {
				vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
				vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
			};

			vm.dateRangeModel = {
				startDate: moment(moment().format('YYYY-MM-DD')).utc(),
				endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
			};

			vm.dateRangeCheck = function () {
				if (vm.filters.enableDateRange) {
					vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
					vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
				}
				if (!vm.filters.enableDateRange) {
					vm.filters.fromDate = null;
					vm.filters.toDate = null;
				}
			};

			vm.report = function () {
				$uibModal.open({
					templateUrl: '~/App/common/views/common/reportViewer.cshtml',
					controller: 'common.views.common.reportViewer as vmMain',
					backdrop: 'static',
					size: 'full',
					resolve: {
						templateUrl: function () {
							return '~/App/tenant/views/fuel/fuelTransactionReport/report.cshtml';
						},
						filters: function () {
							let input = angular.copy(vm.filters);
							input.fromDate = input.fromDate.add('hour', -4);
							input.toDate = input.toDate.add('hour', -4);
							return input;
						}
					}
				});
			};

			vm.exportToExcel = function () {
				vm.loading = true;
				let input = angular.copy(vm.filters);
				input.fromDate = input.fromDate.add('hour', -4);
				input.toDate = input.toDate.add('hour', -4);
				uaeFuelTransactionsServices.exportToExcelFuelReport(input)
					.success(function (result) {
						app.downloadTempFile(result);
					}).finally(function () {
						vm.loading = false;
					});
			};

			vm.getSource = function (key) {
				if (key.toString() === "1") return "Eppco Enoc";
				else if (key.toString() === "2") return "Eppco Vip";
				else if (key.toString() === "3") return "Adnoc Smart";
				else if (key.toString() === "4") return "Adnoc Plus";
				else if (key.toString() === "5") return "Adnoc Rahal";
			};

			vm.fuelTransactionReport = function () {
				vm.loading = true;

				vm.filters.fromDate = moment(vm.filters.fromDate) !== null ? moment(new Date(vm.filters.fromDate._d.getFullYear(), vm.filters.fromDate._d.getMonth(), vm.filters.fromDate._d.getDate(), vm.filters.fromTime._d.getHours(), vm.filters.fromTime._d.getMinutes(), '00', '000')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();
				vm.filters.toDate = moment(vm.filters.toDate) !== null ? moment(new Date(vm.filters.toDate._d.getFullYear(), vm.filters.toDate._d.getMonth(), vm.filters.toDate._d.getDate(), vm.filters.toTime._d.getHours(), vm.filters.toTime._d.getMinutes(), '59', '999')).utc() : moment(moment().format('YYYY-MM-DD HH:mm')).utc();

				if (vm.filters.fromDate > vm.filters.toDate) return;

				if (vm.filters.durationType === null) vm.filters.durationType = 1;


				let input = angular.copy(vm.filters);
				input.fromDate = input.fromDate.add('hour', -4);
				input.toDate = input.toDate.add('hour', -4);

				debugger;
				uaeFuelTransactionsServices.getFuelTransaction(input).success(function (data) {
					vm.gridOptions.totalItems = data.totalCount;
					vm.gridOptions.data = data.items;

				}).finally(function () {
					vm.loading = false;
				});

			};

			vm.getlocalDateTime = function (date) {
				if (date !== null) {
					return moment(date).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			vm.getDateFormat = function (date) {
				if (date !== null) {
					return moment(date).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			//vm.getlocalDateTime = function (date) {
			//	if (date !== null) {
			//		var localTime = moment.utc(date).toDate();
			//		return moment(localTime).format(vm.dateTimeFormat);
			//	}
			//	else {
			//		return "";
			//	}
			//};

			vm.searchPlateNo = function ($select) {
				if ($select.search && $select.search.length > 2) {
					debugger;
					vm.filters.name = $select.search;
					return uaeFuelTransactionsServices.getAllVehicleInfo({ source: vm.filters.source, keyword: $select.search })
						.then(function (response) {
							vm.plateInfos = response.data; //string list of plate numbers
						});
				}
			};

			vm.gridOptions = {
				enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
				enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
				paginationPageSizes: app.consts.grid.defaultPageSizes,
				paginationPageSize: app.consts.grid.defaultPageSize,
				useExternalPagination: true,
				appScopeProvider: vm,
				columnDefs: [
					{
						name: app.localize('CardNo'),
						minWidth: 150,
						cellTemplate:
							'<div class=\"ui-grid-cell\">' +
							'<div class=\"ui-grid-cell-contents\">{{row.entity.cardNo}}</div>' +
							'</div>'
					},

					{
						name: app.localize('TransactionDateTime'),
						field: 'date',
						minWidth: 150,
						cellTemplate:
							'<div class=\"ui-grid-cell\">' +
							'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.transactionDateTime)}}</div>' +
							'</div>'
					},
					{
						name: app.localize('DownloadDateTime'),
						field: 'date',
						minWidth: 150,
						cellTemplate:
							'<div class=\"ui-grid-cell\">' +
							'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.downloadDate)}}</div>' +
							'</div>'
					},					
					{
						name: app.localize('Source'),
						minWidth: 100,
						field: 'source',
						cellTemplate:
							'<div class=\"ui-grid-cell\">' +
							'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getSource(row.entity.source)}}</div>' +
							'</div>'
					},
					{
						name: app.localize('FuelAccount'),
						minWidth: 110,
						field: 'fuelAccount'
					},
					{
						name: app.localize('Site'),
						minWidth: 150,
						field: 'site'
					},
					{
						name: app.localize('VehicleInfo'),
						minWidth: 160,
						field: 'vehicleInfo'
					},
					{
						name: app.localize('OdoMeter'),
						minWidth: 100,
						field: 'odoMeter'
					},
					{
						name: app.localize('RFID'),
						minWidth: 100,
						field: 'refNo'
					},

					{
						name: app.localize('Product'),
						minWidth: 130,
						field: 'product'
					},
					{
						name: app.localize('Quantity'),
						minWidth: 90,
						field: 'quantity'
                    },
                    {
                        name: app.localize('UnitPrice'),
						minWidth: 90,
                        field: 'unitPrice'
					},
					{
						name: 'AmountWithoutVat',
						minWidth: 150,
						field: 'amountWithoutVat'
					},
					{
						name: app.localize('VatAmount'),
						minWidth: 150,
						field: 'vatAmount'
					},
					{
						name: app.localize('Amount'),
						minWidth: 100,
						field: 'amount'
					}
				],

				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
					$scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
						if (!sortColumns.length || !sortColumns[0].field) {
							vm.filters.sorting = "transactionDateTime";
						} else {
							vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
						}

						vm.fuelTransactionReport();
					});
					gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
						vm.filters.skipCount = (pageNumber - 1) * pageSize;
						vm.filters.maxResultCount = pageSize;

						vm.fuelTransactionReport();
					});
				},
				data: []
			};

			//vm.exportToExcel = function () {
			//	vm.loading = true;
			//	uaeFuelTransactionsServices.exportToExcelFuelReport(vm.filters)
			//		.success(function (result) {
			//			app.downloadTempFile(result);
			//		}).finally(function () {
			//			vm.loading = false;
			//		});
			//};


			vm.accountsByAuthority = [];
			function getFuelAccounts() {
				fuelAccountServices
					.getAllForView()
					.success(function (data) {
						vm.allAccounts = data;
						vm.accountsByAuthority = data;
					});
			}

			vm.sourceChanged = function () {
				if (!vm.filters.source)
					vm.accountsByAuthority = vm.allAccounts;
				else if (vm.filters.source >= 3)
					vm.accountsByAuthority = vm.allAccounts.filter(x => x.type === 2);
				else
					vm.accountsByAuthority = vm.allAccounts.filter(x => x.type !== 2);
			};

			function init() {
				getFiltersDateForSAF();
				vm.fuelTransactionReport();
				getFuelAccounts();
			}

			init();
		}
	]);
