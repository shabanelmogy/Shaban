// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:473368-473509
appModule.controller('tenant.views.tfms.fineReceipts.report2', [
		'$scope', '$stateParams', '$uibModalInstance', 'abp.services.app.fineReceipts', 'filters',
		function ($scope, $stateParams, $uibModalInstance, fineReceiptsService, filters) {
			var vm = this;
			vm.filters = filters;
			vm.loading = false;
			vm.dateFormat = abp.setting.get("App.General.DateFormat");
			vm.dateTimeFormat = vm.dateFormat + ' HH:mm';
			vm.totalAmount = 0;
			vm.nextBatchNo = 0;


			vm.getlocalDateTime = function (date) {
				if (date !== null) {
					return moment(date).format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			vm.getlocalDate = function (date) {
				if (date != null) {
					return moment(date).utc().format(vm.dateTimeFormat);
				}
				else {
					return "";
				}
			};

			vm.getlocalDate = function (date) {
				if (date !== null) {
					return moment(date).format(vm.dateFormat);
				}
				else {
					return "";
				}
			};

			vm.getlocalTime = function (date) {
				if (date !== null) {
					return moment(date).format("HH:mm");
				}
				else {
					return "";
				}
			};


			vm.exportToExcel = function () {
				var tab_text = "<table border='1px'><tr>";
				var j = 0;
				var tab1 = document.getElementById('ReportTable'); // id of table
				for (j = 0; j < tab1.rows.length; j++) {

					tab_text = tab_text;
					tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
				}
				tab_text = tab_text + "</table>";

				var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
				var blobUrl = URL.createObjectURL(blob);

				var a = document.createElement('a');
				a.href = blobUrl;
				a.download = 'FineReceiptsReport2.xls';

				let inputs = [];
				let receiptIds = [];
				vm.fineReceiptsDetail.forEach(x => {
					if (receiptIds.indexOf(x.fineReceiptId) == -1)
						receiptIds.push(x.fineReceiptId);
				});

				receiptIds.forEach(x => {
					let input = {
						id: x,
						exportedBatchNo: vm.nextBatchNo,
						exportedDate: null
					};
					inputs.push(input);
				});


				fineReceiptsService.updateReceiptsWithExportDetails(inputs)
					.success(r => {
						a.click();
						vm.isExported = true;
					})
					.catch(e => abp.notify.error(e));

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

			vm.cancel = function () {
				$uibModalInstance.dismiss();
			};

			function init() {
				vm.loading = true;
				fineReceiptsService.getNextExportBatchNo().success(r => vm.nextBatchNo = r).catch(e => abp.notify.error(e));

				fineReceiptsService.getFinesReport2({ receiptNo: vm.filters.receiptNo, receiptFromDate: vm.filters.fromDate, receiptToDate: vm.filters.toDate, exportedBatchNo: vm.filters.exportedBatchNo, status: vm.filters.status})
					.success(function (data) {
						vm.fineReceiptsDetail = data;
						debugger;
						vm.shouldExportData = vm.fineReceiptsDetail.filter(x => x.isExported).length == 0;

						angular.forEach(vm.fineReceiptsDetail, function (value) {
							vm.totalAmount += value.amount;
						})
					}).finally(function () {
						vm.loading = false;
					});
			};

			init();
		}
	]);
