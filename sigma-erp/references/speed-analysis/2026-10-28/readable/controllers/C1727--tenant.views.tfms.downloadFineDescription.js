// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:473819-474025
appModule.controller('tenant.views.tfms.downloadFineDescription', [
        '$scope', 'abp.services.app.uaeFine', 'chromeExtDownloader',
        function ($scope, fineService, chromeExtDownloader) {

            var vm = this;
            vm.fines = [];
            vm.allSelected = false;
            vm.downloading = false;

            var isAbuDhabiFinesEnabled = abp.features.isEnabled("TFMS.Fines.AbuDhabiPolice");
            var isDubaiFinesEnabled = abp.features.isEnabled("TFMS.Fines.DubaiPolice");

            vm.isDownloading = false;
            vm.finesCount = 0;

            vm.init = function () {
                vm.loading = true;
                vm.processedFines = 0;
                vm.fines = [];
                vm.finesCount = 0;

                const newobj = { id: true }

                fineService.getFineNosForUpdateFineDescription(newobj)
                    .success(function (r) {
                        var filteredFines = r.items; //.filter(x => !x.authority.startsWith('INTEGRATED TRANSPORT CENTER'));
                        //filteredFines = filteredFines.filter(x => !x.authority.startsWith('Department of Transportation Abu Dhabi'));
                        vm.fines = filteredFines;

                        //vm.dubaiAuthorityFineAvailable = vm.fines.filter(x => x.authority.toUpperCase().indexOf("DUBAI") > -1).length > 0;
                        vm.loading = false;
                        vm.downloading = false;
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
            vm.downloadFineDescription = function () {

                vm.downloading = true;

                vm.selectedFines = vm.fines.filter(x => x.selected);
                vm.finesCount = vm.selectedFines.length;

                if (vm.selectedFines) {
                    if (chromeExtDownloader.isMv3ExtensionAvailable()) {
                        //fineDetails array will be filled and sent to MV3 extension
                        //extension will render the fines one by one and give status msgs to enable disbale the processing
                        //once all done downloading will send the succes status to stop processing and refresh the fines list

                        vm.downloadFineDescriptionOnly = true;
                        vm.fineDetails = vm.selectedFines;
                        chromeExtDownloader.initV3(vm, () => chromeExtDownloader.downloadFinesV3(vm));

                    }
                    else
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

                        }
                }
                else {
                    if (vm.fines)
                        for (let i in vm.fines) {
                            vm.fines[i].selected = false;
                        }
                }
            };


            var fineIds = [];
            vm.updateDuabiFinesDescription = function () {
                fineIds = [];
                vm.downloading = true;
                vm.processedFines = 0;

                let dubaiFines = vm.fines.filter(x => x.selected && x.authority.toUpperCase().indexOf("DUBAI") > -1);
                for (var i in dubaiFines) {
                    fineIds.push(dubaiFines[i].id);
                }

                console.log(dubaiFines.length);
                vm.finesCount = dubaiFines.length;

                vm.processedFines = 0;
                errorStr = "";
                totalBatch = Math.ceil(vm.finesCount / batchSize);
                var nextBatch = iterator(dubaiFines, batchSize);
                processBatchDP(1, nextBatch);
            };

            var batchSize = 5;
            var totalBatch = 0;
            var errorStr = "";
            vm.processedFines = 0;

            var iterator = function (list, n) {
                var current = 0,
                    l = list.length;
                return function () {
                    end = current + n;
                    var part = list.slice(current, end);
                    current = end < l ? end : 0;
                    let ids = [];
                    for (var i in part) {
                        ids.push(part[i].id);
                    }
                    return ids;
                };
            };

            function processBatchDP(currentBatch, nb) {
                let ids = nb();
                fineService.updateDuabiFinesDescription(ids)
                    .success(function (r) {
                        let e = r.items;

                        for (let i in e) {
                            errorStr += e[i] + '\n';
                        }

                        for (let i in ids) {
                            let ind = vm.fines.indexOf(vm.fines.find(x => x.id === ids[i]));
                            vm.fines.splice(ind, 1);
                        }

                        currentBatch++;
                        vm.processedFines += 5;

                        if (currentBatch > totalBatch) {
                            vm.downloading = false;

                            if (errorStr)
                                abp.message.error(errorStr);

                            init();
                            return;
                        }
                        else
                            processBatchDP(currentBatch, nb);
                    });
            }

            vm.init();
        }
    ]);
