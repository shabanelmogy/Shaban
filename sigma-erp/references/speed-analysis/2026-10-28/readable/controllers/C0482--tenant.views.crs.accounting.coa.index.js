// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122630-122935
appModule.controller('tenant.views.crs.accounting.coa.index', [
        '$scope', '$filter', '$uibModal', 'uiGridConstants', 'abp.services.app.account', 'utilities',
        function ($scope, $filter, $uibModal, uiGridConstants, accountService, utilities) {

            var vm = this;
            vm.accounts = [];
            var subCodeLength = parseInt(abp.setting.get("App.DocumentNos.COA_SubAccountLength"));

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

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Accounts.ChartofAccounts.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Accounts.ChartofAccounts.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Accounts.ChartofAccounts.Delete')
            };
            vm.isInActiveAccountFeatureEnabled = abp.features.isEnabled('CRS.Accounts.InActiveAccount');

            vm.toggleActiveStatus = function (account) {
                var actionText = account.inActive
                    ? app.localize('Activate')
                    : app.localize('Deactivate');

                var confirmationMessage = account.inActive
                    ? app.localize('AreYouSureToActivateAccount')
                    : app.localize('AreYouSureToDeactivateAccount');

                abp.message.confirm(
                    confirmationMessage,
                    function (isConfirmed) {
                        if (isConfirmed) {
                            accountService.toggleAccountActiveStatus({
                                id: account.id
                            }).success(function () {
                                vm.getAccounts();
                                abp.notify.success(app.localize('SuccessfullyUpdated'));
                            });
                        }
                    }
                );
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.exportToExcel = function (tableID) {
                //var summaryText = "<div class='row' style='margin-left:20px'>" + '<b>' + app.localize('TotalDebit') + '</b>' + ': ' + vm.rounding(vm.trialBalance.totalDebit) + "<b>" + '<br/>' + app.localize('TotalCredit') + "</b>" + ': ' + vm.rounding(vm.trialBalance.totalCredit) + "<b>" + "</div><br/>"
                var tab_text =   "<table border='1px'><tr><p>";
                var textRange; var j = 0;
                tab = document.getElementById(tableID); // id of table

                for (j = 0 ; j < tab.rows.length ; j++) {
                    
                    tab_text = tab_text;

                    tab_text = tab_text + tab.rows[j].cells[1].innerHTML.toUpperCase() + "</p></tr>";
                    //tab_text=tab_text+"</tr>";
                }

                tab_text = tab_text + "</table>";
                //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
                // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
                // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "chartOfAccount.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }
            //vm.gridOptions = {
            //    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            //    paginationPageSizes: app.consts.grid.defaultPageSizes,
            //    paginationPageSize: app.consts.grid.defaultPageSize,
            //    useExternalPagination: true,
            //    appScopeProvider: vm,
            //    columnDefs: [
            //        {
            //            name: app.localize('Actions'),
            //            enableSorting: false,
            //            width: 120,
            //            cellTemplate:
            //                '<div class=\"ui-grid-cell-contents\">' +
            //                '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
            //                '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
            //                '    <ul uib-dropdown-menu>' +
            //                '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editAccount(row.entity)">' + app.localize('Edit') + '</a></li>' +
            //                '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteAccount(row.entity)">' + app.localize('Delete') + '</a></li>' +
            //                '    </ul>' +
            //                '  </div>' +
            //                '</div>'
            //        },
            //        {
            //            name: app.localize('AccountName'),
            //            field: 'accountName'
            //        },
            //        {
            //            name: app.localize('ContactNo'),
            //            field: 'contactNo'
            //        },
            //        {
            //            name: app.localize('Website'),
            //            field: 'domain'
            //        },
            //        {
            //            name: app.localize('Email'),
            //            field: 'email'
            //        }
            //    ],
            //    onRegisterApi: function (gridApi) {
            //        $scope.gridApi = gridApi;
            //        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            //            if (!sortColumns.length || !sortColumns[0].field) {
            //                vm.filters.sorting = null;
            //            } else {
            //                vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
            //            }

            //            vm.getCompanies();
            //        });
            //        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
            //            vm.filters.skipCount = (pageNumber - 1) * pageSize;
            //            vm.filters.maxResultCount = pageSize;

            //            vm.getCompanies();
            //        });
            //    },
            //    data: []
            //};
            vm.hasInactiveParent = function (account) {

                // Hierarchy restriction only applies when the feature is enabled
                if (!vm.isInActiveAccountFeatureEnabled || !account.parentId) {
                    return false;
                }

                var parent = $filter('filter')(vm.accounts, {
                    id: account.parentId
                }, true)[0];

                while (parent) {

                    if (parent.inActive) {
                        return true;
                    }

                    if (!parent.parentId) {
                        break;
                    }

                    parent = $filter('filter')(vm.accounts, {
                        id: parent.parentId
                    }, true)[0];
                }

                return false;
            };
            vm.getAccounts = function () {
                vm.loading = true;
                accountService.getAccounts({}).success(function (data) {
                    //vm.gridOptions.totalItems = data.totalCount;
                    vm.accounts = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditAccountModal(accountId, parentId, newAccountCode) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/coa/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.accounting.coa.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        accountId: function () {
                            return accountId;
                        },
                        parentId: function () {
                            return parentId;
                        },
                        newAccountCode: function () {
                            return newAccountCode;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAccounts();
                });
            }

            vm.createAccount = function (parent) {
                var newAccountCode = generateAccountCode(parent);
                openCreateOrEditAccountModal(null, parent.id, newAccountCode);
            };

            vm.editAccount = function (account) {
                openCreateOrEditAccountModal(account.id, account.parentId, null);
            };

            vm.deleteAccount = function (account) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            accountService.deleteAccount({
                                id: account.id
                            }).success(function () {
                                vm.getAccounts();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function generateAccountCode(parent) {
                var children = $filter('filter')(vm.accounts, {
                    parentId: parent.id
                }, true);

                var max = 0;
                var id = 0;
                for (var i = 0; i < children.length; i++) {
                    var arrCode = children[i].accountCode.split('-');
                    id = parseInt(arrCode[arrCode.length - 1]);

                    if (id > max)
                        max = id;
                }

                var parentCodeNumericPart = parent.accountCode.split('-')[1] + ""; //keep it as string
                var parentCodeMasterPart = parent.accountCode.split('-')[0];
                var newAccountCodeNumericPart = 0;
                var n = 0;

                if (max == 0) {
                    n = getNoOfRightZeros(parentCodeNumericPart) - 1;

                    if (n < 0)
                        n = 0;

                    newAccountCodeNumericPart = parseInt(parentCodeNumericPart) + Math.pow(10, n);

                } else {
                    n = getNoOfRightZeros(max + ""); //pass as string
                    newAccountCodeNumericPart = max + Math.pow(10, n);
                }

                var code = parentCodeMasterPart + '-' + padTrailingZeros(newAccountCodeNumericPart, subCodeLength);

                return code;
            }

            function getNoOfRightZeros(accountCodeNumericPartString) {
                var count = 0;
                var i = subCodeLength - 1;
                while (i >= 0) {
                    if (accountCodeNumericPartString.charAt(i) != '0') {
                        break;
                    }

                    i -= 1;
                    count += 1;
                }

                return count;
            }

            function padTrailingZeros(number, size) {
                var s = number + "";
                while (s.length < size) s = s + "0";
                return s;
            }
            vm.getAccounts();

            vm.initializeChartOfAccounts = function () {
                vm.loading = true;
                accountService.initializeChartOfAccounts().success(function () {
                    vm.getAccounts();
                });
            };

        }
    ]);
