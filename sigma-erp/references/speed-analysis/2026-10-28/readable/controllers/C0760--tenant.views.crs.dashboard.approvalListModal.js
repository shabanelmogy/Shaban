// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:196481-198432
appModule.controller('tenant.views.crs.dashboard.approvalListModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'appSession', 'abp.services.app.debitNote', 'abp.services.app.creditNote', 'options', 'abp.services.app.leaseQuotation', 'abp.services.app.rentalQuotation', 'abp.services.app.approval', 'abp.services.app.purchaseOrder', 'abp.services.app.bill', 'abp.services.app.jV', 'abp.services.app.receipt', 'abp.services.app.payment', 'abp.services.app.company', 'abp.services.app.purchaseReturn', 'abp.services.app.invoice', 'abp.services.app.rentalMasterAgreement', 'abp.services.app.leaseMasterAgreement', 'abp.services.app.jobEstimation', 'abp.services.app.profile',
        function ($scope, $uibModal, $uibModalInstance, appSession, debitNoteService, creditNoteService, options, leaseQuotationService, rentalQuotationService, approvalAppService, purchaseOrdersService, billService, jvService, receiptService, paymentService, companyService , invoiceService, masterAgreementService, leaseMasterAgreementService, jobEstimationAppService, profileService) {

            var vm = this;
            vm.allSelected = false;
            vm.isAssetDisposalApprovalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.AssetDisposal");
            vm.isMultiLevelApprovalEnabled = abp.features.isEnabled("CRS_Approval_PurchaseRequests");

            vm.dataList = [];
            vm.title = app.localize(options.status);
            vm.dataList = options.list;
            vm.statusId = options.statusId;
            vm.quotaionApprovalData = { internal: null, customer: null };
            vm.localize = function (text) {
                return app.localize(text);
            };

            vm.cancel = function () {
                $uibModalInstance.close(vm.dataList);
            };
            angular.element(window).bind("keyup", keyup);
            function keyup(e) {
                if (e.keyCode == 27) {
                    vm.cancel();
                }
            }
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
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.currentUserId = abp.session.userId;

            vm.applyChangeToAll = function () {
                vm.dataList.forEach(function (value) {
                    value.selected = vm.allSelected;
                });

                if (vm.statusId == 6) //internal & customer approval quotation counts
                    vm.getSelectedRowsCountForQuotation();
                else if (vm.statusId == 16)
                    vm.getSelectedRowsCountForRentalQuotation();
            };

            vm.getSelectedRowsCount = function () {
                return vm.dataList.filter(x => x.selected).length;
            }

            vm.getSelectedRowsCountForQuotation = function () {

                vm.quotaionApprovalData.internal = vm.dataList.filter(x => x.selected && x.leaseQuotation.status == 1);
                vm.quotaionApprovalData.customer = vm.dataList.filter(x => x.selected && x.leaseQuotation.status == 2 && x.leaseQuotation.customerStatus == 1);
            }
            vm.getSelectedRowsCountForRentalQuotation = function () {

                vm.quotaionApprovalData.internal = vm.dataList.filter(x => x.selected && x.rentalQuotation.status == 1);
                vm.quotaionApprovalData.customer = vm.dataList.filter(x => x.selected && x.rentalQuotation.status == 2 && x.rentalQuotation.customerStatus == 1);
            }


            vm.approveRows = function (type = null) // in case of quotation internal/customer approval
            {

                abp.message.confirm(
                    'Do you really want to approve?',
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;

                            if (vm.statusId == 6) {
                                var ids = [];
                                if (type == 1)
                                    ids.push(...vm.quotaionApprovalData.internal.map(x => x.leaseQuotation.id));
                                else if (type == 2)
                                    ids.push(...vm.quotaionApprovalData.customer.map(x => x.leaseQuotation.id));
                                leaseQuotationService.bulkLeaseQuotationApprovals({ ids: ids, type: type })
                                    .success(function (data) {
                                        abp.notify.info(app.localize('Successfully Approved.'));
                                        vm.cancel();
                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                            }
                            else if (vm.statusId == 16) {
                                var ids = [];
                                if (type == 1)
                                    ids.push(...vm.quotaionApprovalData.internal.map(x => x.rentalQuotation.id));
                                else if (type == 2)
                                    ids.push(...vm.quotaionApprovalData.customer.map(x => x.rentalQuotation.id));
                                rentalQuotationService.bulkRentalQuotationApprovals({ ids: ids, type: type })
                                    .success(function (data) {
                                        abp.notify.info(app.localize('Successfully Approved.'));
                                        vm.cancel();
                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                            }
                            else {
                                if (vm.statusId == 14) {
                                    var ids = [];
                                    vm.dataList.filter(x => x.selected).forEach(x => ids.push(x.voucher.id));
                                    creditNoteService.approveCreditNotes(ids).success(function (data) {
                                        abp.notify.info(app.localize('Successfully Approved.'));
                                        vm.cancel();
                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                                } else if (vm.statusId == 15) {
                                    var ids = [];
                                    vm.dataList.filter(x => x.selected).forEach(x => ids.push(x.voucher.id));
                                    debitNoteService.approveDebitNotes(ids).success(function (data) {
                                        abp.notify.info(app.localize('Successfully Approved.'));
                                        vm.cancel();
                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                                } else {
                                    var data = vm.getFormAndRecordIds();
                                    approvalAppService.bulkApproval({ approvalLinesWithRecords: data.approvalLinesWithRecords, form: data.form })
                                        .success(function (data) {
                                            abp.notify.info(app.localize('Successfully Approved.'));
                                            vm.cancel();
                                        }).finally(function () {
                                            vm.loading = false;
                                        });
                                }
                            }
                        }
                    }
                );
            };


            vm.approveAssetRows = function (type = null) // in case of quotation internal/customer approval
            {
                var isAllMultiApproval = true;
                vm.dataList.filter(x => x.selected).forEach(x => {
                    if (x.assetDispose.approvalLines.length <= 0)
                        isAllMultiApproval = false;
                });

                if (vm.statusId == 23) {
                    vm.isTransactionPasswordEnabled = abp.features.isEnabled("CRS.CustomFeatures.TransactionPassword");

                    if (vm.isTransactionPasswordEnabled && !isAllMultiApproval) {

                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/crs/dashboard/transactionPassword.cshtml',
                            controller: 'tenant.views.crs.dashboard.transactionPassword as vm',
                            backdrop: 'static',
                            size: 'md',
                            resolve: {
                                title: function () {
                                    return app.localize('ConfirmTransactionPassword');
                                }

                            }
                        });
                        modalInstance.result.then(function (result) {
                            /*purchaseOrder.rejectionReason = result;
                            rejectpurchaseOrdersRequest(purchaseOrder);*/

                            profileService.verifyTransactionPassword({ id: result })
                                .success(function () {
                                    abp.notify.info(app.localize('PasswordVerifiedSuccessfully'));
                                    var data = vm.getFormAndRecordIds();
                                    approvalAppService.bulkApproval({ approvalLinesWithRecords: data.approvalLinesWithRecords, form: data.form })
                                        .success(function (data) {
                                            abp.notify.info(app.localize('Successfully Approved All Disposal'));
                                            vm.cancel();
                                        }).finally(function () {
                                            vm.loading = false;
                                        });
                                }).finally(function () {
                                    vm.saving = false;
                                });
                        });


                    } else {
                        abp.message.confirm(
                            'Do you really want to approve?',
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    vm.loading = true;
                                    var data = vm.getFormAndRecordIds();
                                    approvalAppService.bulkApproval({ approvalLinesWithRecords: data.approvalLinesWithRecords, form: data.form })
                                        .success(function (data) {
                                            abp.notify.info(app.localize('Successfully Approved.'));
                                            vm.cancel();
                                        }).finally(function () {
                                            vm.loading = false;
                                        });
                                }
                            }
                        );

                    }
                }
            };


            vm.getFormAndRecordIds = function () {
                var data = { form: 0, approvalLinesWithRecords: [] };
                if (vm.statusId == 1) //Companies
                {
                    data.form = 4;
                    vm.dataList.filter(x => x.selected).forEach(x =>
                        data.approvalLinesWithRecords.push({ recordId: x.contact.id }));
                }
                if (vm.statusId == 9 || vm.statusId == 10 || vm.statusId == 11 || vm.statusId == 12 || vm.statusId == 13 || vm.statusId == 18 || vm.statusId == 19 || vm.statusId == 50 || vm.statusId == 60) {
                    data.form = 3;
                    if (vm.statusId == 12 || vm.statusId == 19 || vm.statusId == 11 || vm.statusId == 9 || vm.statusId == 50 || vm.statusId == 60) {
                        vm.dataList.filter(x => x.selected).forEach(x =>
                            data.approvalLinesWithRecords.push({ recordId: x.voucher.id }));
                    }
                    else {
                        vm.dataList.filter(x => x.selected).forEach(x =>
                            data.approvalLinesWithRecords.push({ approvalLineId: x.voucherApproval.id, recordId: x.voucher.id }));
                    }

                }
                if (vm.statusId == 20 || vm.statusId == 21) {
                    data.form = 5;
                    vm.dataList.filter(x => x.selected).forEach(x =>
                        data.approvalLinesWithRecords.push({ recordId: x.masterAgreement.id }));
                }
                if (vm.statusId == 22) {
                    data.form = 6;
                    vm.dataList.filter(x => x.selected).forEach(x =>
                        data.approvalLinesWithRecords.push({ recordId: x.jobEstimation.id }));
                }
                if (vm.statusId == 23) {
                    data.form = 7;
                    vm.dataList.filter(x => x.selected).forEach(x => {
                        if (x.assetDispose.approvalLines.length)
                            data.approvalLinesWithRecords.push({ approvalLineId: x.assetDispose.approvalLines[0].id, recordId: x.assetDispose.id });
                        else
                            data.approvalLinesWithRecords.push({ recordId: x.assetDispose.id });
                    });
                }

                if (vm.statusId == 8) {
                    data.form = 3;
                    vm.dataList.filter(x => x.selected).forEach(x => {
                        if (x.voucher.approvalLines.length) {
                            const voucherApprovalLine = x.voucher.approvalLines.filter(function (approvalLine) {
                                return approvalLine.userId === vm.currentUserId
                            });
                            data.approvalLinesWithRecords.push({ approvalLineId: voucherApprovalLine[0].id, recordId: x.voucher.id });
                        }
                        else
                            data.approvalLinesWithRecords.push({ recordId: x.voucher.id });
                    });
                }
                return data;
            }

            vm.getPaymentType = function (type) {
                if (type == 6) {
                    if (vm.isAccountFeatureEnabled)
                        return app.localize('PettyCashExpensePayment')
                    else
                        return app.localize('ExpensePayment')
                }
                if (type == 3)
                    return app.localize('CustomerPayment');
                if (type == 4)
                    return app.localize('SupplierPayment');
                if (type == 5)
                    return app.localize('EmployeePayment')
                if (type == 15)
                    return app.localize('DepositRefund')
                if (type == 21)
                    return app.localize('GeneralPayment')
                if (type == 59)
                    return app.localize('StockPurchasePayment');

                return '';
            }
            vm.getStatus = function (code) {
                if (code === 1)
                    return "Pending";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else if (code === 4)
                    return "Revised";
                else
                    return "Pending";
            };
            vm.permissions = {
                companyView: abp.auth.hasPermission('Pages.Tenant.Companies'),
                companyEdit: abp.auth.hasPermission('Pages.Tenant.Companies.Edit'),
                companyLimitedEdit: abp.auth.hasPermission('Pages.Tenant.Companies.LimitedEdit'),
                companyIsApprovedEnabled: abp.auth.hasPermission('Pages.Tenant.Companies.CustomerApproval'),

                leaseQuotationsView: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations'),
                leaseQuotationsEdit: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Edit'),
                leaseQuotationsApproval: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.Approval'),
                leaseQuotationsCustomerApproval: abp.auth.hasPermission('Pages.Tenant.Lease.Quotations.CustomerApproval'),

                rentalQuotationsView: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations'),
                rentalQuotationsEdit: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Edit'),
                rentalQuotationsApproval: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.Approval'),
                rentalQuotationsCustomerApproval: abp.auth.hasPermission('Pages.Tenant.Rental.Quotations.CustomerApproval'),

                creditNotesEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Edit'),
                creditNotesApprove: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Approve'),
                creditNotesView: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.View'),
                creditNotesReject: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.Reject'),
                creditNotesAllActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.CreditNotes.AllActionsOnOtherBranchCreditNotes'),

                debitNotesView: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.View'),
                debitNotesEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Edit'),
                debitNotesApprove: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Approve'),
                debitNotesReject: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.Reject'),
                debitNotesAllActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.DebitNotes.AllActionsOnOtherBranchDebitNotes'),

                purchaseRequestEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Edit'),
                purchaseRequestView: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.View'),
                purchaseRequestApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Approve'),

                purchaseOrdersEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Edit'),
                purchaseOrdersView: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.View'),
                purchaseOrdersApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Approve'),
                purchaseOrdersReject: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Reject'),

                billsEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Edit'),
                billsApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Approve'),
                billsReject: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.Reject'),
                billsView: abp.auth.hasPermission('Pages.Tenant.Vouchers.Bills.View'),

                paymentsView: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.View'),
                paymentsEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Edit'),
                paymentsApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Payments.Approve'),

                jvView: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.View'),
                jvEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Edit'),
                jvApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Approve'),

                receiptView: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.View'),
                receiptEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Edit'),
                receiptApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Approve'),

                purchaseReturnView: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.View'),
                purchaseReturnEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Edit'),
                purchaseReturnApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Approve'),

                invoiceView: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices'),
                invoiceEdit: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Edit'),
                invoiceApproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Approve'),

                rentalMasterAgreementEdit: abp.auth.hasPermission('Pages.Tenant.masterAgreements.Edit'),
                rentalMasterAgreementDetail: abp.auth.hasPermission('Pages.Tenant.Rental.MasterAgreement.Detail'),
                rentalMasterAgreementApproved: abp.auth.hasPermission('Pages.Tenant.Rental.MasterAgreement.Approve'),

                jobEstimationApprove: abp.auth.hasPermission('Pages.WORKSHOP.JobEstimations.Approve'),
                jobEstimationReject: abp.auth.hasPermission('Pages.WORKSHOP.JobEstimations.RejectEstimation'),

                assetDisposeApproval: abp.auth.hasPermission('Pages.Tenant.Assets.DisposalApproval'),
                assetView: abp.auth.hasPermission('Pages.Tenant.Assets.Assets'),
            };

            vm.debitNoteLocationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.debitNotesAllActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.creditNoteLocationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.creditNotesAllActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            vm.onAccountSupEditDelDisable = function (row) {
                if ((row.voucherSubTypeId == 32 || row.voucherSubTypeId == 45) && row.voucherLines.some(vl => vl.assetId != null))
                    return true;
                else
                    return false;
            };
            vm.viewCompany = function (company) {
                openCompanyViewModal(company.id);
            };

            function openCompanyViewModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/viewModel.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        fromApproval: function () {
                            return false;
                        }
                    }
                });
            }

            vm.editCompany = function (company) {
                openCreateOrEditCompanyModal(company.id);
            };
            function openCreateOrEditCompanyModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        },
                        fromApproval: function () {
                            return false;
                        }
                    }
                });
            }
            vm.approveCompanies = function (company) {

                abp.message.confirm(
                    app.localize(''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            companyService.approveCompany({
                                id: company.id
                            }).success(function () {
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.companies;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };

            vm.viewPurchaseRequest = function (purchaseRequest) {
                openViewPurchaseRequestModal(purchaseRequest.id);
            };
            openViewPurchaseRequestModal = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });

            }
            vm.editPurchaseRequest = function (purchaseRequest) {
                openCreateOrEditPurchaseRequestModal(purchaseRequest.id);
            };
            openCreateOrEditPurchaseRequestModal = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });
            }
            function PurchaseRequestApprovalCalculation(purchaseRequest, multiLevelPurchaseRequest) {
                multiLevelPurchaseRequest.forEach(function (item) {
                    purchaseRequest.push(item);
                });
                vm.dataList = purchaseRequest;
            }
            vm.approvePurchaseRequest = function (purchaseRequest) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/approvalModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        purchaseRequest: function () {
                            return purchaseRequest;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.purchaseRequests;
                        PurchaseRequestApprovalCalculation(result.purchaseRequests, result.multiLevelPurchaseRequests);
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            }
            vm.multiLevelApprovePurchaseRequest = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/approval/approvalModal.cshtml',
                    controller: 'tenant.views.common.approval.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        approvalId: function () {
                            return row.approvalId;
                        },
                        form: function () {
                            return 3;
                        },
                        recordId: function () {
                            return row.id;
                        },
                        formValue: function () {
                            return row;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.purchaseRequests;
                        PurchaseRequestApprovalCalculation(result.purchaseRequests, result.multiLevelPurchaseRequests);
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };

            vm.approvePayments = function (payment) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToApprovePayment'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            paymentService.approvePayment({
                                id: payment.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizedPayment'));
                            }).finally(function () {
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.payments;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });
                        }
                    }
                );
            }

            vm.viewPurchaseOrder = function (purchaseOrder) {
                openViewPurchaseOrderModal(purchaseOrder.id);
            };
            openViewPurchaseOrderModal = function (purchaseOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: purchaseOrderId,
                            }
                        }
                    }
                });

            }
            vm.editPurchaseOrder = function (purchaseOrder) {
                openCreateOrEditPurchaseOrderModal(purchaseOrder.id);
            };
            openCreateOrEditPurchaseOrderModal = function (purchaseOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: purchaseOrderId,
                            }
                        }
                    }
                });
            }
            vm.approvePurchaseOrder = function (purchaseOrder) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('Press Ok To Approve Purchase Order'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseOrdersService.approvePurchaseOrder({
                                id: purchaseOrder.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizePurchaseOrder'));
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.purchaseOrders;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });
                        }
                    }
                );
            };
            vm.rejectPurchaseOrder = function (purchaseOrder) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Purchase Order?");
                        },
                        title: function () {
                            return app.localize('PurchaseOrder');
                        }

                    }
                });
                modalInstance.result.then(function (result) {
                    purchaseOrder.rejectionReason = result;
                    rejectpurchaseOrdersRequest(purchaseOrder);
                });
            };

            function rejectpurchaseOrdersRequest(purchaseOrder) {
                var input = {};
                input.id = purchaseOrder.id;
                input.rejectionReason = purchaseOrder.rejectionReason;
                vm.loading = true;
                purchaseOrdersService.rejectPurchaseOrder({ id: input.id, RejectionReason: input.rejectionReason })
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejectPurchaseOrder'));
                    }).finally(function () {
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.purchaseOrders;
                        }).finally(function () {
                            vm.loading = false;
                        });
                    });


            };
            vm.viewJV = function (jv) {
                openviewJVModal(jv.id);
            };
            function openviewJVModal(JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                        IsClone: function () {
                            return false;
                        },
                    }

                });
            }


            vm.viewReceipt = function (receipt) {
                openviewReceiptModal(receipt.id);
            };
            function openviewReceiptModal(receiptId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },
                        agreement: function () {
                            return null;
                        }
                    }
                });
            }

            vm.viewBill = function (bill) {
                openViewbillModal(bill.id);
            }
            openViewbillModal = function (billId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId
                            };
                        }
                    }
                });

            };





            vm.editJV = function (jv) {
                openCreateOrEditJVModal(jv.id);
            };
            openCreateOrEditJVModal = function (JVId)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                        IsClone: function () {
                            return false;
                        },
                    }
                });
            };

            vm.editReceipt = function (receipt) {
                openCreateOrEditReceiptModal(receipt.id);
            };
            openCreateOrEditReceiptModal = function (receiptId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return null;
                        },

                        quotationId: function () {
                            return null;
                        },
                        customer: function () {
                            return null;
                        },

                        downPayment: function () {
                            return null;
                        },

                        invoice: null
                    }
                });
            };
            vm.editBill = function (bill) {
                openCreateOrEditBillModal(bill.id);
            };
            openCreateOrEditBillModal = function (billId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        //billId: function () {
                        //    return billId;
                        //}
                        options: function () {
                            return {
                                purchaseOrder: null,
                                billId: billId
                            };
                        }
                    }
                });
            };

            vm.approveBills = function (bill) {

                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToApproveBill'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            billService.approveBill({
                                id: bill.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizedBill'));
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.bills;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });
                        }
                    }
                );
            };
            vm.approveJV = function (jv) {

                abp.message.confirm(
                    app.localize(''), app.localize('PressOkToApproveJVs'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            jvService.approveJV({
                                id: jv.id
                            }).success(function () {
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.jv;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };
            vm.approveReceipt = function (receipt) {
                debugger;
                abp.message.confirm(
                    app.localize(''), app.localize('PressOkToApproveReceipt'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            receiptService.approveReceipt({
                                id: receipt.id
                            }).success(function () {
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.receipt;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };

            vm.rejectBills = function (bill) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Bill?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    bill.rejectionReason = result;
                    rejectBillRequest(bill);
                });
            };

            function rejectBillRequest(bill) {
                var input = {};
                input.id = bill.id;
                input.rejectionReason = bill.rejectionReason;
                billService.rejectBill({ id: input.id, rejectionReason: input.rejectionReason })
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejectBill'));
                    }).finally(function () {
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.bills;
                        }).finally(function () {
                            vm.loading = false;
                        });
                    });
            }

            vm.viewPayment = function (payment) {
                openViewPaymentModal(payment.id, null);

            };
            openViewPaymentModal = function (paymentId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });

            };
            vm.editPayment = function (payment) {
                openCreateOrEditPaymentModal(payment.id, null);
            };
            openCreateOrEditPaymentModal = function (paymentId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/payments/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.payments.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        paymentId: function () {
                            return paymentId;
                        },
                        agreement: function () {
                            return agreement;
                        }
                    }
                });
            };

            vm.approveLeaseQuotation = function (leaseQuotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', leaseQuotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaseQuotationService.approveLeaseQuotation({
                                id: leaseQuotation.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.leaseQuotations;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };



            vm.rejectLeaseQuotation = function (quotation) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Lease Quotation?");
                        },
                        title: function () {
                            return app.localize('LeaseQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    vm.rejectLeaseQuotationRequest(quotation);
                });

            };

            vm.rejectLeaseQuotationRequest = function (leaseQuotation) {
                leaseQuotationService.rejectLeaseQuotation({
                    id: leaseQuotation.id,
                    rejectionReason: leaseQuotation.rejectionReason
                }).success(function () {
                    abp.notify.success(app.localize('SuccessfullyRejected'));
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.leaseQuotations;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });

            };

            vm.rejectLeaseQuotationByCustomer = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Lease Quotation?");
                        },
                        title: function () {
                            return app.localize('LeaseQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    rejectLeaseQuotationByCustomer(quotation);
                });
            };


            rejectLeaseQuotationByCustomer = function (quotation) {
                leaseQuotationService.rejectQuotationByCustomer({
                    id: quotation.id,
                    rejectionReason: quotation.rejectionReason
                }).success(function () {
                    abp.notify.success(app.localize('SuccessfullyRejected'));
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.leaseQuotations;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };


            vm.approveLeaseQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaseQuotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.leaseQuotations;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.viewLeaseQuotation = function (LeaseQuotation) {
                openViewLeaseQuotationModal(LeaseQuotation.id);
            };
            openViewLeaseQuotationModal = function (leaseQuotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/viewQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        },
                        isRevised: function () {
                            return false;
                        },
                        inquiryId: null
                    }

                });
            };
            vm.editNewLeaseQuotation = function (LeaseQuotation) {
                openCreateOrEditQuotationModal(LeaseQuotation.id);
            };
            openCreateOrEditQuotationModal = function (leaseQuotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/createOrEditQuotationModal.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        leaseQuotationId: function () {
                            return leaseQuotationId;
                        },
                        isRevised: false,
                        inquiryId: null
                    }

                });
            };


            vm.approveCreditNote = function (creditNote) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('Press Ok To Approve CreditNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            creditNoteService.approveCreditNote({
                                id: creditNote.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizeCreditNote'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.creditNotes;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.rejectCreditNote = function (creditNote) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Credit Note?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    creditNote.rejectionReason = result;
                    rejectCreditNotesRequest(creditNote);
                });
            };
            vm.viewCreditNote = function (creditNote) {
                if (creditNote.voucherSubTypeId == 22)
                    openViewCreditNoteModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 23)
                    openViewCreditNoteOnAccountModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 56)
                    openViewCreditNoteModalDeliveryNote(creditNote.id)
            };
            vm.editCreditNote = function (creditNote) {
                if (creditNote.voucherSubTypeId == 22)
                    openCreateOrEditCreditNoteModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 23)
                    openCreateOrEditCreditNoteOnAccountModal(creditNote.id, null);
                else if (creditNote.voucherSubTypeId == 56)
                    openCreateOrEditCreditNoteOnDeliveryNoteModal(creditNote.id, null);

            };

            function rejectCreditNotesRequest(creditNote) {
                vm.loading = true;
                var input = {};
                input.id = creditNote.id;
                input.rejectionReason = creditNote.rejectionReason;
                creditNoteService.rejectCreditNote(input)
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejectCreditNote'));
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.creditNotes;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            function openViewCreditNoteModalDeliveryNote(creditNoteId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/viewModalOnDeliveryNote.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.viewModalOnDeliveryNote as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });

            };
            function openViewCreditNoteModal(creditNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: agreement
                    }
                });

            };
            function openViewCreditNoteOnAccountModal(creditNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/OnAccountviewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: agreement
                    }
                });

            }

            function openCreateOrEditCreditNoteModal(creditNoteId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        },
                        agreement: agreement
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.creditNotes;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };
            function openCreateOrEditCreditNoteOnAccountModal(creditNoteId, agreement) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModalOnAccount.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnAccount as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.creditNotes;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };
            function openCreateOrEditCreditNoteOnDeliveryNoteModal(creditNoteId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/creditNotes/createOrEditModalOnDeliveryNote.cshtml',
                    controller: 'tenant.views.crs.vouchers.creditNotes.createOrEditModalOnDeliveryNote as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        creditNoteId: function () {
                            return creditNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.creditNotes;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };

            vm.approveDebitNote = function (debitNote) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('Press Ok To Approve DebitNote'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            debitNoteService.approveDebitNote({
                                id: debitNote.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizeDebitNote'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.debitNotes;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.rejectDebitNote = function (debitNote) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Debit Note?");
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    debitNote.rejectionReason = result;
                    rejectDebitNotesRequest(debitNote);
                });
            };
            vm.viewDebitNote = function (debitNote) {
                if (debitNote.voucherSubTypeId == 31) {
                    openViewDebitNoteModal(debitNote.id, null);
                }
                else if (debitNote.voucherSubTypeId == 32 || debitNote.voucherSubTypeId == 45) {
                    openViewDebitNoteOnAccountModal(debitNote.id, null);
                }
            };
            vm.editDebitNote = function (debitNote) {
                if (debitNote.voucherSubTypeId == 31) {
                    openCreateOrEditDebitNoteModal(debitNote.id, null);
                }
                else if (debitNote.voucherSubTypeId == 32) {
                    openCreateOrEditDebitNoteOnAccountModal(debitNote.id, null);
                }
            };

            function rejectDebitNotesRequest(debitNote) {
                vm.loading = true;
                var input = {};
                input.id = debitNote.id;
                input.rejectionReason = debitNote.rejectionReason;
                debitNoteService.rejectDebitNote(input)
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejectDebitNote'));
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.debitNotes;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            function openViewDebitNoteModal(debitNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });

            }
            function openViewDebitNoteOnAccountModal(debitNoteId, agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/viewOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });

            }

            function openCreateOrEditDebitNoteModal(debitNoteId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.debitNotes;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            }
            function openCreateOrEditDebitNoteOnAccountModal(debitNoteId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/debitNotes/createOrEditOnAccountModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.debitNotes.createOrEditOnAccountModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        debitNoteId: function () {
                            return debitNoteId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.debitNotes;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            }

            vm.viewRentalQuotation = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/viewModal.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.viewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: function () {
                            return false;
                        },
                    }

                });
            };
            vm.editNewRentalQuotation = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/createOrEditQuotationModal.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.createOrEditQuotationModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: false,
                        inquiryId: null
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.rentalQuotations;
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            }


            vm.approveRentalQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            rentalQuotationService.approveQuotation({
                                id: quotation.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.rentalQuotations;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.rejectRentalQuotation = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Rental Quotation?");
                        },
                        title: function () {
                            return app.localize('RentalQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    rejectRentalQuotationRequest(quotation);
                });

            };

            vm.approveRentalQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            rentalQuotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.rentalQuotations;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };
            vm.rejectRentalQuotationByCustomer = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Rental Quotation?");
                        },
                        title: function () {
                            return app.localize('RentalQuotation');
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    quotation.rejectionReason = result;
                    rejectRentalQuotationByCustomer(quotation);
                });

            };

            function rejectRentalQuotationRequest(quotation) {
                vm.loading = true;
                var input = {};
                input.id = quotation.id
                input.rejectionReason = quotation.rejectionReason;
                rentalQuotationService.rejectQuotation(input)
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejected'));
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.rentalQuotations;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            function rejectRentalQuotationByCustomer(quotation) {
                vm.loading = true;
                var input = {};
                input.id = quotation.id

                input.rejectionReason = quotation.rejectionReason;
                rentalQuotationService.rejectQuotationByCustomer(input)
                    .success(function () {
                        abp.notify.success(app.localize('SuccessfullyRejected'));
                        approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                            vm.dataList = result.rentalQuotations;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });


            }

            vm.getInvoiceTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 1) return app.localize("RentalInvoice");
                else if (voucherSubTypeId == 8) return app.localize("SalikInvoice");
                else if (voucherSubTypeId == 7) return app.localize("FineInvoice");
                else if (voucherSubTypeId == 2) return app.localize("LimousineInvoice");
                else if (voucherSubTypeId == 14) return app.localize("LeaseInvoice");
                else if (voucherSubTypeId == 16) return app.localize('TransportationInvoice');
                else if (voucherSubTypeId == 17) return app.localize("AssetSaleInvoice");
                else if (voucherSubTypeId == 9) return app.localize("MiscellaneousInvoice");
                else if (voucherSubTypeId == 24) return app.localize("AdditionalChargesInvoice");
                else if (voucherSubTypeId == 29) return app.localize("FuelInvoice");
                else if (voucherSubTypeId == 30) return app.localize("DamageInvoice");
                else if (voucherSubTypeId == 33) return app.localize("FleetAssignmentInvoice");
                else if (voucherSubTypeId == 34) return app.localize("ChauffeurInvoice");
                else if (voucherSubTypeId == 37) return app.localize("WorkshopInvoice");
                else if (voucherSubTypeId == 46) return app.localize("EquipmentInvoice");
                else if (voucherSubTypeId == 55) return app.localize("AccessoriesInvoice");
                else if (voucherSubTypeId == 57) return app.localize("ExcessChargesInvoice");
                else if (voucherSubTypeId == 60) return app.localize("ExcessKMsInvoice");
                else if (voucherSubTypeId == 63) return app.localize('DarbTollInvoice');
                else if (voucherSubTypeId == 65) return app.localize('AdvanceTaxInvoice');
                else if (voucherSubTypeId == 67) return app.localize('StockSaleInvoice');
                // else if (voucherSubTypeId == 47) return app.localize("EquipmentLeaseInvoice");
                else return "";
            };

            vm.viewInvoice = function (invoice) {
                openViewInvoiceModal(invoice.id, null);
            };
            function openViewInvoiceModal(invoiceId, agreement) {
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoiceviewModel.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoiceviewModal as vm';
                } else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.viewModal as vm';

                }

                $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,

                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            }

            vm.editInvoice = function (invoice) {
                openCreateOrEditInvoiceModal(invoice.id, null);
            };

            function openCreateOrEditInvoiceModal(invoiceId, agreement) {
                var templateUrl = "";
                var controller = "";
                if (abp.features.isEnabled("POS") === true) {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/posInvoicecreateOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.posInvoicecreateOrEditModal as vm';
                } else {
                    templateUrl = '~/App/tenant/views/crs/vouchers/invoices/createOrEditModal.cshtml';
                    controller = 'tenant.views.crs.vouchers.invoices.createOrEditModal as vm';

                }
                var modalInstance = $uibModal.open({
                    templateUrl: templateUrl,
                    controller: controller,
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                });
            }

            vm.approveInvoices = function (invoice) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToApproveInvoice'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            invoiceService.approveInvoice({
                                id: invoice.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyAuthorizedInvoice'));
                                vm.loading = true;
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.invoice;
                                });
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };


            vm.masterAgreementModal = function (agreement) {
                openMasterAgreementModal(agreement);
            };
            openMasterAgreementModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/masterAgreements/masterAgreementModal.cshtml',
                    controller: 'tenant.views.crs.rental.masterAgreements.masterAgreementModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                    }
                });
            };

            vm.approveMasterAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Master Agreement', agreement.agreementNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            masterAgreementService.approveMasterAgreement({
                                id: agreement.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.rentalMasterAgreements;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });


                        }
                    }
                );
            };


            vm.leaseMasterAgreementModal = function (agreement) {
                openLeaseMasterAgreementModal(agreement);
            };
            openLeaseMasterAgreementModal = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/masterAgreements/masterAgreementModal.cshtml',
                    controller: 'tenant.views.crs.lease.masterAgreements.masterAgreementModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                    }
                });
            };

            vm.approveLeaseMasterAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Master Agreement', agreement.agreementNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            leaseMasterAgreementService.approveMasterAgreement({
                                id: agreement.id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.leaseMasterAgreements;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });
                        }
                    }
                );
            };

            vm.openJobEstimationsViewModel = function (jobEstimation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobEstimationId: function () {
                            return jobEstimation.id;
                        }
                    }
                });
            };

            vm.createJobEstimation = function (jobEstimation) {
                openCreateOrEditJobEstimationModal(jobEstimation.id);
            };
            function openCreateOrEditJobEstimationModal(jobEstimationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobEstimationId: function () {
                            return jobEstimationId;
                        }
                    }
                });

                /*modalInstance.result.then(function (result) {
                });*/
            }

            vm.approveJobEstimation = function (jobEstimation) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('Press Ok To Approve This Job Estimation'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            jobEstimationAppService.approveJobEstimation({
                                id: jobEstimation.id,
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyApprovedJobEstimation'));
                                approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                    vm.dataList = result.jobEstimations;
                                }).finally(function () {
                                    vm.loading = false;
                                });
                            });
                        }
                    }
                );
            };

            vm.rejectJobEstimation = function (jobestimation) {
                abp.message.confirm(
                    app.localize('RejectEstimationMessages'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            jobEstimationAppService.rejectJobEstimation({ id: jobestimation.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('RecordRejected'));
                                }).finally(function () {
                                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                                        vm.dataList = result.jobEstimations;
                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                                });
                        }
                    }
                );
            };

            vm.viewAsset = function (asset) {
                openViewAssetModal(asset.id);
            };

            function openViewAssetModal(assetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/viewModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }

                    }
                });
            }

            function disposalApprovalCalculation(Disposal1, Disposal2) {
                debugger;
                Disposal2.forEach(function (item) {
                    Disposal1.push(item);
                });
                vm.dataList = Disposal1;
            }
            vm.approveDisposal = function (asset) {
                debugger
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/disposalApprovalModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.disposalApprovalModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return asset.id;
                        },
                        approvalId: function () {
                            return asset.approvalId;
                        },
                        form: function () {
                            return 8;
                        },
                        disposeLimited: function () {
                            return false;
                        },
                        options: {}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.loading = true;
                    approvalAppService.getDueApprovalsSummary({}).success(function (result) {
                        vm.dataList = result.assetsDisposals;
                        disposalApprovalCalculation(result.assetsDisposals, result.assetsDisposals2);
                    }).finally(function () {
                        vm.loading = false;
                    });
                });
            };
            function init() {
                if (vm.dataList.length > 0) {
                    vm.dataList.forEach(function (value) {
                        value.selected = false;
                    });
                }
            }

            init()
        }
    ]);
