// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:62657-62868
appModule.controller('host.views.bulkEmail.index', [
        '$scope', '$http', '$uibModal', 'uiGridConstants', 'abp.services.app.company', 'abp.services.app.user', 'abp.services.app.country', 'abp.services.app.industry', 'FileUploader', 'abp.services.app.bulkEmail',
        function ($scope, $http, $uibModal, uiGridConstants, companyService, userService, countryService, industryService, fileUploader,bulkEmailService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.disableDate = false;
            vm.showFilter = false;
            var todayAsString = moment(moment().format('YYYY-MM-DD')).utc()
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.companySegment = [{ id: 1, name: 'Small' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Large' }];
            vm.verifiedList = [{ id: true, name: 'Verified' }, { id: false, name: 'Not Verified' }];
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };
            vm.searchUsers = function ($select) {
                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };
            vm.searchCountries = function (filter) {
                vm.filters.name = filter;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return countryService.searchCountries(vm.filters).then(function (response) {
                    vm.countries = response.data.items;
                });

            };



            vm.allBoxTicked = function () {
                if (vm.allCompanies === null) return;
                angular.forEach(vm.allCompanies, function (row) {
                    if (row.email)
                        row.generate = vm.tickAllBox;
                });
            };


            vm.toggleInput = function () {
                vm.showFilter = vm.showFilter == false ? true : false;
            }

            vm.sendEmail = function () {
                debugger;
                var value = $("#htmlText").code();
                var emailToSend = [];
                angular.forEach(vm.allCompanies, function (row) {
                    if (row.email && row.generate === true) {
                        emailToSend.push(row);
                    }
                });
                if (emailToSend.length == 0) {
                    vm.saving = false;
                    return;
                }
                vm.saving = true;
                bulkEmailService.sendEmailToCompanies({ companies: emailToSend, emailText: value}).success(function (result) {
                    abp.notify.info(app.localize('SuccessfullyEmailTransfered'));
                    $('#htmlText').code('');
                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;
                    }).finally(function () {
                })
            }

            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.CreatedBy = null;
            }

            vm.clearCountry = function () {
                vm.filters.nationality = null;
                vm.filters.country = null;
            }

            vm.getCompanies = function () {
                debugger;
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                companyService.getCompaniesHostForTable(vm.filters).success(function (data) {

                    ////vm.gridOptions.totalItems = data.totalCount;
                    ////vm.gridOptions.data = data.items;
                    vm.allCompanies = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getIndustries = function () {
                industryService.getIndustries().success(function (result) {
                    vm.industries = result.items;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.user != null)
                    vm.filters.CreatedBy = vm.filters.user.id;
                if (vm.filters.nationality != null)
                    vm.filters.country = vm.filters.nationality.name;
                if (!vm.disableDate) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                companyService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });
            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    //abp.message.warn(app.localize('ImportingFile'));
                    companyService.importFromExcel(fileName)
                        .success(function (result) {
                            abp.message.success(app.localize('ImportedSuccessfully'));
                            init();
                        })
                        .error(function (response) {
                            abp.message.error(response.error);
                        })
                        .finally(function () {
                            vm.importing = false;
                        });
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.importToExcel = function () {
                companyService.importFromExcel().success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getCompanies();
                vm.getIndustries();
            }
            init();
        }
    ]);
