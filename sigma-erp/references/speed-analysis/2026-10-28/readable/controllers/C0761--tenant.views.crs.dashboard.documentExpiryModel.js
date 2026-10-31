// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:198435-198786
appModule.controller('tenant.views.crs.dashboard.documentExpiryModel', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'options', 'abp.services.app.person', 'abp.services.app.documentsEmail',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, options, personService, documentsEmailAppservice) {

            var vm = this;



            //vm.title = app.localize(options.status);


            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.filters = {
                name: options.name,


                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
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
                        name: app.localize('Name'),
                        enableSorting: false,
                        field: 'name'

                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 200,
                        enableSorting: false,
                        field: 'agreementNos',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +

                            '<span ng-bind-html=\"grid.appScope.getAgreementNo(row.entity.agreementNos)\"></span>' +

                            '</div>'

                    },
                    {
                        name: app.localize('Company'),
                        enableSorting: false,
                        field: 'companyName'

                    },{
                        name: app.localize('Type'),
                        enableSorting: false,
                        field: 'type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\" >' +

                            ' {{ grid.appScope.getContactCategory(row.entity) }}' +

                            '</div>'

                    },
                    {
                        name: app.localize('Name'),
                        enableSorting: false,
                        field: 'name'

                    },
                    {
                        name: app.localize('DocumemtType'),
                        enableSorting: false,
                        width: 120,
                        field: 'identityDocumentType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +

                            '<span ng-bind-html=\"grid.appScope.documentTypeIdentityCat(row.entity.identityDocuments)\"></span>' +

                            '</div>'
                    },
                    {
                        name: app.localize('DocumentNo'),
                        enableSorting: false,
                        field: 'documentNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span ng-bind-html=\"grid.appScope.documentNoCat(row.entity.identityDocuments)\"></span>' +

                            '</div>'
                    },
                    {
                        name: app.localize('IssuedBy'),
                        enableSorting: false,
                        field: 'issuedBy',
                        cellTemplate:

                            '<div class=\"ui-grid-cell\">' +
                            '<span ng-bind-html=\"grid.appScope.issuedByCat(row.entity.identityDocuments)\"></span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IssueDate'),
                        enableSorting: false,
                        width: 120,
                        field: 'issueDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span ng-bind-html=\"grid.appScope.issueDateCat(row.entity.identityDocuments)\"></span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ExpiryDate'),
                        width: 120,
                        enableSorting: false,
                        field: 'expiryDate',
                        cellTemplate:


                            '<div class=\"ui-grid-cell\">' +

                            '<span ng-bind-html=\"grid.appScope.expiryDateCat(row.entity.identityDocuments)\"></span>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('ExpectedEndDate'),
                    //    field: 'endDate',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                    //        '</div>'
                    //},

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getcustomerswithexpireddocuments();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getcustomerswithexpireddocuments();
                    });
                },
                data: []
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('alertsTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'ExpiryDocument.xls';
                a.click();

            };
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }



            vm.documentTypeIdentityCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {
                    cat = cat.concat(vm.getIdentificationDocumentType(docIdentity[i].identityDocumentType) + '<br/>');
                }

                return cat;
            }



            vm.getAgreementNo = function (agreementNos) {
                var cat = ''
                for (var i in agreementNos) {
                    cat = cat.concat(agreementNos[i]) + '<br/>';
                }

                return cat;
            }

            vm.documentNoCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {

                    cat = cat.concat(docIdentity[i].documentNo + '<br/>');
                }

                return cat;
            }

            vm.issuedByCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {

                    cat = cat.concat(docIdentity[i].issuedBy + '<br/>');
                }

                return cat;
            }

            vm.issuedByCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {

                    cat = cat.concat(docIdentity[i].issuedBy + '<br/>');
                }

                return cat;
            }


            vm.expiryDateCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {

                    cat = cat.concat(vm.getlocalDateTime(docIdentity[i].expiryDate) + '<br/>');
                }

                return cat;
            }

            vm.issueDateCat = function (docIdentity) {
                var cat = ''
                for (var i in docIdentity) {

                    cat = cat.concat(vm.getlocalDateTime(docIdentity[i].issueDate) + '<br/>');
                }

                return cat;
            }



            vm.getIdentificationDocumentType = function (id) {

                if (id == 1)
                    return app.localize('TradeLicense');
                else if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 6)
                    return app.localize('PersonDocument1');
                else if (id == 7)
                    return app.localize('HealthCard');
                else if (id == 8)
                    return app.localize('Visa');
                else
                    return "";
            };
            vm.getContactCategory = function (row) {
                if (row.contactType == 6) { // corporate driver
                    return app.localize('CorporateDriver');
                }
                if (row.contactCategory == 1)
                    return app.localize('Individual');
                else if (row.contactCategory == 2)
                    return app.localize('Company');
                else
                    return "";
            };

            vm.getcustomerswithexpireddocuments = function () {
                vm.loading = true;
                documentsEmailAppservice.getCustomersByExpiredDocumentsDashboardView(vm.filters).success(function (result) {
                    console.log(result)
                    vm.contacts = result.items;
                    vm.gridOptions.totalItems = result.totalCount;
                    vm.gridOptions.data = result.items;


                    console.log(vm.contacts);

                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getcustomerswithexpireddocuments();
            }

            init();
        }
    ]);
