// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:34981-35475
appModule.controller('host.views.cbs.dueTasks.searchOrganizationUnitContactModal', [
        '$scope', 'appSession', '$uibModalInstance', '$q', 'uiGridConstants', 'abp.services.app.organizationUnit', 'abp.services.app.commonLookup', 'lookupModal', 'abp.services.app.directory',
        function ($scope, appSession, $uibModalInstance, $q, uiGridConstants, organizationUnitService, commonLookupService, lookupModal, directoryService) {
            var vm = this;
            //abp.services.app.organizationUnit
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.organizationContact = {};
            vm.unitHasNoChildUnit = false;

            vm.organizationSelected = function () {
                $uibModalInstance.close({ id: vm.organizationContact.id, name: vm.organizationContact.original.displayName });
            }

            vm.permissions = {
                manageOrganizationTree: true,
                manageMembers: true
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.organizationTree = {
                
                $tree: null,
                unitCount: 0,

                setUnitCount: function (unitCount) {
                    $scope.safeApply(function () {
                        vm.organizationTree.unitCount = unitCount;
                    });
                },

                refreshUnitCount: function () {
                    vm.organizationTree.setUnitCount(vm.organizationTree.$tree.jstree('get_json').length);
                },

                selectedOu: {
                    id: null,
                    displayName: null,
                    code: null,

                    set: function (ouInTree) {
                        vm.organizationContact = ouInTree;
                        if (!ouInTree) {
                            vm.organizationTree.selectedOu.id = null;
                            vm.organizationTree.selectedOu.displayName = null;
                            vm.organizationTree.selectedOu.code = null;
                        } else {
                            vm.organizationTree.selectedOu.id = ouInTree.id;
                            vm.organizationTree.selectedOu.displayName = ouInTree.original.displayName;
                            vm.organizationTree.selectedOu.code = ouInTree.original.code;
                        }

                        vm.members.load();
                    }
                },

                contextMenu: function (node) {
                    var items = {
                        editUnit: {
                            label: app.localize('Edit'),
                            _disabled: !vm.permissions.manageOrganizationTree,
                            action: function (data) {
                                var instance = $.jstree.reference(data.reference);

                                vm.organizationTree.openCreateOrEditUnitModal({
                                    id: node.id,
                                    displayName: node.original.displayName,
                                    code: node.original.code
                                }, function (updatedOu) {
                                    node.original.displayName = updatedOu.displayName;
                                    instance.rename_node(node, vm.organizationTree.generateTextOnTree(updatedOu));
                                });
                            }
                        },
                        // conidition if node has no staff memeber then we can add child unit
                        addSubUnit: (node.original.memberCount <= 0) ? {
                            label: app.localize('AddChildUnit'),
                            _disabled: !vm.permissions.manageOrganizationTree,
                            action: function () {
                                vm.organizationTree.addUnit(node.id);
                            }
                        } : undefined,

                        //addMember: {
                        //    label: app.localize('AddStaff'),
                        //    _disabled: !vm.permissions.manageMembers,
                        //    action: function () {
                        //        vm.members.openAddModal();
                        //    }
                        //},

                        //'delete': {
                        //    label: app.localize("Delete"),
                        //    _disabled: !vm.permissions.manageOrganizationTree,
                        //    action: function (data) {
                        //        var instance = $.jstree.reference(data.reference);

                        //        abp.message.confirm(
                        //            app.localize('OrganizationUnitDeleteWarningMessage', node.original.displayName),
                        //            function (isConfirmed) {
                        //                if (isConfirmed) {
                        //                    organizationUnitService.deleteOrganizationUnit({
                        //                        id: node.id
                        //                    }).success(function () {
                        //                        abp.notify.success(app.localize('SuccessfullyDeleted'));
                        //                        instance.delete_node(node);
                        //                        vm.organizationTree.refreshUnitCount();
                        //                    });
                        //                }
                        //            }
                        //        );
                        //    }
                        //}
                    }

                    return items;
                },

                addUnit: function (parentId) {
                    var instance = $.jstree.reference(vm.organizationTree.$tree);
                    vm.organizationTree.openCreateOrEditUnitModal({
                        parentId: parentId
                    }, function (newOu) {
                        instance.create_node(
                            parentId ? instance.get_node(parentId) : '#',
                            {
                                id: newOu.id,
                                parent: newOu.parentId ? newOu.parentId : '#',
                                code: newOu.code,
                                displayName: newOu.displayName,
                                memberCount: 0,
                                text: vm.organizationTree.generateTextOnTree(newOu),
                                state: {
                                    opened: true
                                }
                            });

                        vm.organizationTree.refreshUnitCount();
                    });
                },

                openCreateOrEditUnitModal: function (organizationUnit, closeCallback) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/fms/organizationChart/createOrEditUnitModal.cshtml',
                        controller: 'tenant.views.fms.organizationChart.createOrEditUnitModal as vm',
                        backdrop: 'static',
                        resolve: {
                            organizationUnit: function () {
                                return organizationUnit;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        //vm.members.init();
                        //vm.organizationTree.init();
                        closeCallback && closeCallback(result);
                        vm.unitHasNoChildUnit = false;
                    });
                },

                generateTextOnTree: function (ou) {
                    var itemClass = ou.memberCount > 0 ? ' ou-text-has-members' : ' ou-text-no-members';
                    return '<span title="' + ou.code + '" class="ou-text' + itemClass + '" data-ou-id="' + ou.id + '">' + ou.displayName; //' (<span class="ou-text-member-count">' + ou.memberCount + '</span>)
                },

                incrementMemberCount: function (ouId, incrementAmount) {
                    var treeNode = vm.organizationTree.$tree.jstree('get_node', ouId);
                    treeNode.original.memberCount = treeNode.original.memberCount + incrementAmount;
                    vm.organizationTree.$tree.jstree('rename_node', treeNode, vm.organizationTree.generateTextOnTree(treeNode.original));
                },

                getTreeDataFromServer: function (callback) {
                    vm.loading = true;
                    organizationUnitService.getOrganizationUnitsCurrent({}).success(function (result) {
                        
                        var treeData = _.map(result.items, function (item) {
                            return {
                                id: item.id,
                                parent: item.parentId ? item.parentId : '#',
                                code: item.code,
                                displayName: item.displayName,
                                memberCount: item.memberCount,
                                text: vm.organizationTree.generateTextOnTree(item),
                                state: {
                                    opened: true
                                }
                            };
                        });
                        vm.loading = false;
                        callback(treeData);
                    });
                },

                init: function () {
                    vm.organizationTree.getTreeDataFromServer(function (treeData) {
                        vm.organizationTree.setUnitCount(treeData.length);
                        vm.organizationTree.$tree = $('#OrganizationUnitEditTree');

                        var jsTreePlugins = [
                            'types',
                            'contextmenu',
                            'wholerow',
                            'sort'
                        ];

                        if (vm.permissions.manageOrganizationTree) {
                            jsTreePlugins.push('dnd');
                        }

                        vm.organizationTree.$tree
                            .on('changed.jstree', function (e, data) {
                                $scope.safeApply(function () {
                                    if (data.selected.length != 1) {
                                        vm.organizationTree.selectedOu.set(null);
                                    } else {
                                        var selectedNode = data.instance.get_node(data.selected[0]);
                                        vm.organizationTree.selectedOu.set(selectedNode);
                                    }
                                });

                            })
                            .on('move_node.jstree', function (e, data) {

                                if (!vm.permissions.manageOrganizationTree) {
                                    vm.organizationTree.$tree.jstree('refresh'); //rollback
                                    return;
                                }

                                var parentNodeName = (!data.parent || data.parent == '#')
                                    ? app.localize('Root')
                                    : vm.organizationTree.$tree.jstree('get_node', data.parent).original.displayName;

                                abp.message.confirm(
                                    app.localize('OrganizationUnitMoveConfirmMessage', data.node.original.displayName, parentNodeName),
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            organizationUnitService.moveOrganizationUnit({
                                                id: data.node.id,
                                                newParentId: data.parent
                                            }).success(function () {
                                                abp.notify.success(app.localize('SuccessfullyMoved'));
                                                vm.organizationTree.reload();
                                            }).catch(function (err) {
                                                vm.organizationTree.$tree.jstree('refresh'); //rollback
                                                setTimeout(function () { abp.message.error(err.data.message); }, 500);
                                            });
                                        } else {
                                            vm.organizationTree.$tree.jstree('refresh'); //rollback
                                        }
                                    }
                                );
                            })
                            .jstree({
                                'core': {
                                    data: treeData,
                                    multiple: false,
                                    check_callback: function (operation, node, node_parent, node_position, more) {
                                        return true;
                                    }
                                },
                                types: {
                                    "default": {
                                        "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                    },
                                    "file": {
                                        "icon": "fa fa-file tree-item-icon-color icon-lg"
                                    }
                                },
                                contextmenu: {
                                    items: vm.organizationTree.contextMenu
                                },
                                sort: function (node1, node2) {
                                    if (this.get_node(node2).original.displayName < this.get_node(node1).original.displayName) {
                                        return 1;
                                    }

                                    return -1;
                                },
                                plugins: jsTreePlugins
                            });

                        vm.organizationTree.$tree.on('mouseover', '.ou-text', function (e) {
                            var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                            $("#icon_" + ouId).show();
                        });

                        vm.organizationTree.$tree.on('mouseleave', '.ou-text', function (e) {
                            var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                            $("#icon_" + ouId).hide();
                        });

                        vm.organizationTree.$tree.on('click', '.ou-text .fa-cog', function (e) {
                            e.preventDefault();

                            var ouId = $(this).closest('.ou-text').attr('data-ou-id');
                            setTimeout(function () {
                                vm.organizationTree.$tree.jstree('show_contextmenu', ouId);
                            }, 100);
                        });
                    });
                },

                reload: function () {
                    vm.organizationTree.getTreeDataFromServer(function (treeData) {
                        vm.organizationTree.setUnitCount(treeData.length);
                        vm.organizationTree.$tree.jstree(true).settings.core.data = treeData;
                        vm.organizationTree.$tree.jstree('refresh');
                    });
                }
            };
            vm.members = {

                //gridOptions: {
                //    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                //    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                //    paginationPageSizes: app.consts.grid.defaultPageSizes,
                //    paginationPageSize: app.consts.grid.defaultPageSize,
                //    useExternalPagination: true,
                //    useExternalSorting: true,
                //    appScopeProvider: vm,
                //    columnDefs: [
                //        {
                //            name: app.localize('Actions'),
                //            enableSorting: false,
                //            width: 100,
                //            cellTemplate:
                //            '<div class=\"ui-grid-cell-contents\">' +
                //            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                //            '    <button class="btn btn-xs btn-primary blue"  aria-haspopup="true" ng-click="grid.appScope.contactSelected(row.entity)" ><i class="fa fa-check"></i></button>' +
                //            '  </div>' +
                //            '</div>'
                //        },
                //        {
                //            name: app.localize('name'),
                //            field: 'name',
                //            minWidth: 140
                //        }
                //        //{
                //        //    name: app.localize('AddedTime'),
                //        //    field: 'addedTime',
                //        //    cellFilter: 'momentFormat: \'L\'',
                //        //    minWidth: 100
                //        //}
                //    ],
                //    onRegisterApi: function (gridApi) {
                //        $scope.gridApi = gridApi;
                //        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //            if (!sortColumns.length || !sortColumns[0].field) {
                //                requestParams.sorting = null;
                //            } else {
                //                requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //            }

                //            vm.members.load();
                //        });
                //        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //            requestParams.skipCount = (pageNumber - 1) * pageSize;
                //            requestParams.maxResultCount = pageSize;

                //            vm.members.load();
                //        });
                //    },
                //    data: []
                //},

                load: function () {
                    //if (!vm.organizationTree.selectedOu.id) {
                    //    vm.members.gridOptions.totalItems = 0;
                    //    vm.members.gridOptions.data = [];
                    //    return;
                    //}

                    organizationUnitService.getOrganizationUnitUsersUnder({
                        id: vm.organizationTree.selectedOu.id
                    }).success(function (result) {
                        vm.members.gridOptions = result.items;
                        //vm.members.gridOptions.totalItems = result.totalCount;
                        //vm.members.gridOptions.data = result.items;
                    });
                },

                add: function (userId) {
                    var ouId = vm.organizationTree.selectedOu.id;
                    if (!ouId) {
                        return;
                    }

                    organizationUnitService.addUserToOrganizationUnit({
                        organizationUnitId: ouId,
                        userId: userId
                    }).success(function () {
                        abp.notify.success(app.localize('SuccessfullyAdded'));
                        vm.organizationTree.incrementMemberCount(ouId, 1);
                        vm.members.load();
                    });
                },

                remove: function (user) {
                    var ouId = vm.organizationTree.selectedOu.id;
                    if (!ouId) {
                        return;
                    }

                    abp.message.confirm(
                        app.localize('RemoveUserFromOuWarningMessage', user.userName, vm.organizationTree.selectedOu.displayName),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                organizationUnitService.removeUserFromOrganizationUnit({
                                    organizationUnitId: ouId,
                                    userId: user.id
                                }).success(function () {
                                    abp.notify.success(app.localize('SuccessfullyRemoved'));
                                    vm.organizationTree.incrementMemberCount(ouId, -1);
                                    vm.members.load();
                                });
                            }
                        }
                    );
                },

                openAddModal: function () {
                    var ouId = vm.organizationTree.selectedOu.id;
                    if (!ouId) {
                        return;
                    }

                    lookupModal.open({

                        title: app.localize('SelectAStaff'),
                        serviceMethod: organizationUnitService.searchDirectoryStaffPaged,

                        canSelect: function (item) {
                            return $q(function (resolve, reject) {
                                organizationUnitService.isInOrganizationUnit({
                                    userId: item.id,
                                    organizationUnitId: ouId
                                }).success(function (result) {
                                    //alert(result);
                                    if (result) {
                                        abp.message.warn(app.localize('UserIsAlreadyInTheOrganizationUnit'));
                                    }
                                    else {
                                        vm.organizationTree.incrementMemberCount(ouId, +1);
                                        vm.members.load();
                                    }
                                    //resolve(!result);
                                }).catch(function () {
                                    reject();
                                });
                            });
                        },

                        callback: function (selectedItem) {
                            vm.members.add(selectedItem.value);
                        }
                    });
                },

                init: function () {
                    if (!vm.permissions.manageMembers) {
                        vm.members.gridOptions.columnDefs.shift();
                    }
                }
            }

            var refreshSelectedStaff = function (id) {
                vm.loading = true;
                organizationUnitService.getOrganizationUnitUsersUnder({
                    id: id
                }).success(function (result) {
                    vm.members.gridOptions = result;
                    //vm.members.gridOptions.totalItems = result.totalCount;
                    //vm.members.gridOptions.data = result.items;
                    vm.loading = false;
                });
            }

            vm.contactSelected = function (row) {

                $uibModalInstance.close({ id: row.id, name: row.name, isOrganization: false });
            }

            vm.organizationSelected = function () {
                $uibModalInstance.close({ id: vm.organizationContact.id, name: vm.organizationContact.original.displayName, isOrganization: true });
            }

            vm.members.init();
           
            vm.organizationTree.init();
        }
    ]);
