// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:474597-474711
appModule.controller('tenant.views.tfms.updateFineTimeAUH', [
		'$scope', 'abp.services.app.uaeFine', 'chromeExtDownloader',
		function ($scope, fineService, chromeExtDownloader) {

			var vm = this;
			vm.fines = [];
			vm.allSelected = false;
			vm.downloading = false;

			var isAbuDhabiFinesEnabled = abp.features.isEnabled("TFMS.Fines.AbuDhabiPolice");
			var isDubaiFinesEnabled = abp.features.isEnabled("TFMS.Fines.DubaiPolice");

			vm.isDownloading = false;

			function init() {
				vm.loading = true;
				fineService.getFineNosForUpdateFineTimeAUH()
					.success(function (r) {
						vm.fines = r.items;
						vm.loading = false;
					});
			}


			vm.dateFormat = abp.setting.get("App.General.DateFormat");
			vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';

			vm.getlocalDateTime = function (date) {
				if (date !== null) {
					var localTime = moment.utc(date).toDate();
					return moment(localTime).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			vm.selectedFines = [];
			vm.finesCount = 0;

			vm.updateFineTime = function () {

				vm.downloading = true;

				vm.selectedFines = vm.fines.filter(x => x.selected);
				vm.finesCount = vm.selectedFines.length;

				if (vm.selectedFines) {
					chromeExtDownloader.downlaodFinesDescription(
						vm.selectedFines,
						`function reportFineStatus(msg) {
							var $scope = angular.element(document.querySelector('#appController')).scope();
							if (!msg.fineDetail) return;

							var fineDetail = $scope.vm.selectedFines.find(x => x.fineNo === msg.fineDetail.fineNo);
							fineDetail.progress = msg.progress;
							fineDetail.error = msg.error;
							fineDetail.status = msg.status;

							if (fineDetail.error) {
								fineDetail.isComplete = true;
								fineDetail.downloadClass = "badge-danger";
								$scope.vm.selectedFines.splice(fineDetail, 1);
							}
							else if (msg.isComplated) {
								fineDetail.isComplete = msg.isComplated;

								fineDetail.downloadClass = "badge-success";

								$scope.vm.fines.splice($scope.vm.fines.find(x => x.fineNo == msg.fineDetail.fineNo), 1);
								$scope.vm.selectedFines.splice(fineDetail, 1);
								console.log("remaining items",$scope.vm.selectedFines.length);
								$scope.vm.finesCount && $scope.vm.finesCount--;
							}

							if ($scope.vm.selectedFines.length == 0) {
								$scope.vm.downloading = false;
							}

							if (!$scope.$$phase) {
								$scope.$digest();
							}
						}`,
						function error(e) {
							abp.message.error(e.error);
						}
					);

				}
				else { vm.loading = false; vm.downloading = false; }

			};

			vm.selectedCount = function () { return vm.fines.filter(x => x.selected).length; };

			vm.selectAll = function () {
				if (vm.allSelected) {
					if (vm.fines)
						for (let i in vm.fines) {
							vm.fines[i].selected = true;
							vm.fines[i].updateOnlyTime = true;
						}
				}
				else {
					if (vm.fines)
						for (let i in vm.fines) {
							vm.fines[i].selected = false;
							vm.fines[i].updateOnlyTime = true;
						}
				}
			};

			init();
		}
	]);
