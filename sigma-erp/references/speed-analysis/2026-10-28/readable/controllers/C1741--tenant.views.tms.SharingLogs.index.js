// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:477353-477542
appModule.controller('tenant.views.tms.SharingLogs.index', [
		'$scope', '$stateParams', 'uiGridConstants', 'abp.services.app.dataSharingLog',
		function ($scope, $stateParams, uiGridConstants, dataSharingLogService) {

			$scope.$on('$viewContentLoaded', function () {
				App.initAjax();
			});

			var vm = this;
			vm.loading = false;
			vm.saving = false;

			vm.dateRangeOptions = app.createDateRangePickerOptions();
			vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
			vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

			$scope.$on('$viewContentLoaded', function () {
				App.initAjax();
			});

			vm.filters = {
				dataToShare: null,
				skipCount: 0,
				enableDateRange: true,
				fromDate: null,
				toDate: null,
				maxResultCount: app.consts.grid.defaultPageSize,
				sorting: "date asc"
			};

			vm.getDataToShare = function () {
				vm.filters.dataToShare = $stateParams.dataToShare;
				if ($stateParams.dataToShare == 1)
					return app.localize('E-Salik') + app.localize('Tolls');
				if ($stateParams.dataToShare == 2)
					return app.localize('Fines');
				if ($stateParams.dataType == 3)
					return app.localize('E-Darb') + app.localize('Tolls');
				if ($stateParams.dataType == 8)
					return app.localize('E-Parking') + app.localize('Tolls');
			};

			vm.dateRangeModel = {
				startDate: moment(moment().format('YYYY-MM-DD')).utc(),
				endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
			};

			vm.dateFormat = abp.setting.get("App.General.DateFormat");
			vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


			vm.getlocalDateTime = function (date) {
				if (date != null) {
					var localTime = moment.utc(date).toDate();
					return moment(localTime).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			vm.dateRangeModelChanged = function () {
				vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
				vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
			};

			vm.gridOptions = {
				enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
				enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
				paginationPageSizes: app.consts.grid.defaultPageSizes,
				paginationPageSize: app.consts.grid.defaultPageSize,
				useExternalPagination: true,
				appScopeProvider: vm,
				enableSorting: true,
				columnDefs: [
					//{
					//    name: app.localize('Actions'),
					//    enableSorting: false,
					//    width: '8%',
					//    cellTemplate:
					//        '<div class=\"ui-grid-cell-contents\">' +
					//        '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
					//        '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
					//        //'    <ul uib-dropdown-menu>' +
					//        //'      <li><a  ng-click="grid.appScope.viewServiceLog(row.entity.id)">' + app.localize('View') + '</a></li>' +
					//        //'    </ul>' +
					//        '  </div>' +
					//        '</div>'
					//},
					{
						name: app.localize('Date'),
						field: 'date',
						cellTemplate:
							'<div class=\"ui-grid-cell\">' +
							'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
							'</div>',
						width: '20%',
					},
					{
						name: app.localize('Log'),
						field: 'log',
						width: '80%',
					}

				],
				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
					$scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
						if (!sortColumns.length || !sortColumns[0].field) {
							vm.filters.sorting = "date desc";
						} else {
							vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
						}

						vm.getDataSharingLogs();
					});
					gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
						vm.filters.skipCount = (pageNumber - 1) * pageSize;
						vm.filters.maxResultCount = pageSize;

						vm.getDataSharingLogs();
					});
				},
				data: []
			};

			vm.exportToExcel = function () {
				vm.loading = true;

				if (vm.filters.enableDateRange) {
					vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
					vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
				}
				else {
					vm.filters.fromDate = null;
					vm.filters.toDate = null;
				}

				vm.filters.sorting = '';
				dataSharingLogService.exportToExcel(vm.filters).success(function (result) {
					app.downloadTempFile(result);
				}).finally(function () {
					vm.loading = false;
					vm.filters.sorting = "date desc";
				});
			};

			vm.clearSharingLog = function () {
				abp.message.confirm(
					app.localize('DeleteWarningMessage', ''),
					function (isConfirmed) {
						if (isConfirmed) {
							vm.loading = true;
							vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
							vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
							dataSharingLogService.clearSharingLog(vm.filters).success(function () {
								vm.getDataSharingLogs();
								vm.loading = false;
								abp.notify.success(app.localize('SuccessfullyDeleted'));
							});
						}
					}
				);
			}

			vm.getDataSharingLogs = function () {
				vm.loading = true;
				if (vm.filters.enableDateRange) {
					vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
					vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
				}
				else {
					vm.filters.fromDate = null;
					vm.filters.toDate = null;
				}
				dataSharingLogService.getDataSharingLog(vm.filters).success(function (data) {
					vm.gridOptions.totalItems = data.totalCount;
					vm.gridOptions.data = data.items;
				}).finally(function () {
					vm.loading = false;
				});
			};

			function init() {
				vm.getDataToShare();
				vm.getDataSharingLogs();
			}
			init();
		}
	]);
