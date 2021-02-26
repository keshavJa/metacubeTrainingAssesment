import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Total_Price__c';
import PRODUCT_CODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import AVAILABLE_UNITS_FIELD from '@salesforce/schema/Product2.Available_Quantity__c';

import PO_STATUS_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Status__c';
import PO_AMOUNT_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Amount__c';

import Id from '@salesforce/user/Id';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import getPurchaseOrders from '@salesforce/apex/PurchaseOrderController.getPurchaseOrders';
import updatePurchaseOrderRecords from '@salesforce/apex/ProductController.updatePurchaseOrderRecords';


const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency', sortable: true },
    { label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Available Units', fieldName: AVAILABLE_UNITS_FIELD.fieldApiName, type: 'number', sortable: true }
];

const CARTCOLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency', sortable: true },
    { label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Units', fieldName: 'Units', type: 'number', sortable: true, editable: true },
	{
		type: 'button-icon', 
		typeAttributes:  {
			iconName: 'utility:delete',
			name: 'delete',
			iconClass: 'slds-icon-text-error'
		}
	}
];

const INVOICECARTCOLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text'},
    { label: 'Units', fieldName: 'Units', type: 'number'},
	{ label: 'Total', fieldName: 'Total', type: 'currency'}
];

const PURCHASEORDERCOL = [
    { label: 'PO Id', fieldName: 'Id', type: 'text' },
    { label: 'Status', fieldName: PO_STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Order Total', fieldName: PO_AMOUNT_FIELD.fieldApiName, type: 'currency'}
]; 

export default class ProductList extends LightningElement {
	hideCheckProductListTable = false;
	userId = Id;
	purchaseOrderDataItems=[];
	invoiceDate;
	invoice;
	errors=[];
	TitleCart = '';
	selectedProductList = [];
	purchaseOrderColumns = PURCHASEORDERCOL;
	invoiceCartColumns = INVOICECARTCOLUMNS;
	cartColumns = CARTCOLUMNS;
	purchaseOrderGrid = true;
	productListGrid = false;
	cartDataGrid = false;
	invoiceDataGrid = false;
	cartData =[];
	selectedRows = [];
	invoiceCartData = [];
	saveDraftValues; 
	isGoToCartBTNDisabled = false;
	isCheckOutBTNDisabled = false;
	isPlaceOrderBTNDisabled = false;
	searchKey = '';
	header = 'Product';
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
	priorData;
	priorCartProductData;
	result;
	page = 1; //this will initialize 1st page
    items = []; //it contains all the records.
    data = []; //data to be displayed in the table
    columns; //holds column info.
    startingRecord = 1; //start record position per page
    endingRecord = 0; //end record position per page
    pageSize = 10; //default value we are assigning
    totalRecountCount = 0; //total record count received from all retrieved records
    totalPage = 0; //total number of page is needed to display all records

	@wire(getPurchaseOrders, {userId: '$userId'})
	purchaseOrderData({error, data}){
		if(data){
			this.purchaseOrderDataItems = data;
			if(this.purchaseOrderDataItems.length === 0){
				this.purchaseOrderGrid = false;
				this.productListGrid = true;
			} 
			this.error = undefined;
		}
		if(error){
			this.error = error;
			this.data = undefined;
		}
	}

	newPurchaseBtnHandler(event){
		this.productListGrid = true;
	} 

	@wire(getProducts, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
	getPaginationProduct({error, data}){
		if(data){
			this.items = data;
			this.priorData = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
            
            //initial data to be displayed ----------->
            //slice will take 0th element and ends with 5, but it doesn't include 5th element
            //so 0 to 4th rows will be displayed in the table
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = COLUMNS;
            this.error = undefined;
		}
		if(error){
			this.error = error;
			this.data = undefined;
		}
	}

	disableEnableAction(currPage, lastPage){
		this.template.querySelector('c-do-pagination').disableEnableAction(currPage, lastPage);
	}

    handleSearchTermChange(event) {
		// Debouncing this method: do not update the reactive property as
		// long as this function is being called within a delay of 300 ms.
		// This is to avoid a very large number of Apex method calls.
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchKey = searchTerm;
		}, 300);
	}

	sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
       	return refreshApex(this.result);
        
    }

	firstHandler() {
        if (this.page != 1) {
			this.page = 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
			this.disableEnableAction(this.page, this.totalPage);
        }
    }
	

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
			this.disableEnableAction(this.page, this.totalPage);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);  
			this.disableEnableAction(this.page, this.totalPage);          
        }             
    }

	
	lastHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.totalPage; //decrease page by 1
            this.displayRecordPerPage(this.page);
			this.disableEnableAction(this.page, this.totalPage);
        }
    }

	  //this method displays records page by page
	  displayRecordPerPage(page){

        /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
        page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
        so, slice(5,10) will give 5th to 9th records.
        */
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.priorData.slice(this.startingRecord, this.endingRecord);

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    }

	/*****Start Testing  */
	goToCartHandler(event){  //productListTable
		//let selectedProductList = this.template.querySelector("lightning-datatable").getSelectedRows();
		//let selectedProductList = this.template.querySelector("#productListTable").getSelectedRows();
		//let selectedProductList = this.template.querySelector("[id=productListTable]").getSelectedRows();
		//let selectedProductList = this.template.getElementById('productListTable');
		let selectedProductList = this.template.querySelector('.productListTableClass').getSelectedRows();;
		let selectedProductListIds = [];
		if(selectedProductList.length>0){
			for(let i=0; i<selectedProductList.length;i++){
				selectedProductListIds.push(selectedProductList[i].Id);
			}
			this.updateCartProductData(selectedProductListIds, selectedProductList);
			this.updateProductData(selectedProductListIds, selectedProductList);
			this.cartDataGrid = true;			
            this.setSelectedRows = []; /// empty selection.
			this.displayRecordPerPage(this.page);
			
		}
		
	}

	updateCartProductData(selectedProductListIds, selectedProductList){
		let newCartData = [];
		let existingCartProductIdList =[]
		if(this.cartData.length > 0){
			for(let i=0; i<this.cartData.length;i++){
				existingCartProductIdList.push(this.cartData[i].Id);
				if(selectedProductListIds.includes(this.cartData[i].Id)){
					let cartProduct = new Object(); 
					cartProduct.Id = this.cartData[i].Id;
					cartProduct.Name = this.cartData[i].Name;
					cartProduct.Units = this.cartData[i].Units+1;
					cartProduct.ProductCode = this.cartData[i].ProductCode;
					cartProduct.Total_Price__c = this.cartData[i].Total_Price__c;
					newCartData.push(cartProduct);
				}
				else{
					newCartData.push(this.cartData[i]);
				}
			}
			for(let i=0; i<selectedProductList.length;i++){
				if(existingCartProductIdList.includes(selectedProductList[i].Id)){
				}
				else{
					let cartProduct = new Object(); 
					cartProduct.Id = selectedProductList[i].Id;
					cartProduct.Name = selectedProductList[i].Name;
					cartProduct.Units = 1;
					cartProduct.ProductCode = selectedProductList[i].ProductCode;
					cartProduct.Total_Price__c = selectedProductList[i].Total_Price__c;
					newCartData.push(cartProduct);
				}
			}
		}
		else
		{
			for(let i=0; i<selectedProductList.length;i++)
			{	
				let cartProduct = new Object(); 
				cartProduct.Id = selectedProductList[i].Id;
				cartProduct.Name = selectedProductList[i].Name;
				cartProduct.Units = 1;
				cartProduct.ProductCode = selectedProductList[i].ProductCode;
				cartProduct.Total_Price__c = selectedProductList[i].Total_Price__c;
				newCartData.push(cartProduct);
			}
		}
		this.cartData = newCartData;
		
	}
	updateProductData(selectedProductListIds, selectedProductList){
		let newPriorData = [];
		for(let i=0; i<this.priorData.length;i++){
			if(selectedProductListIds.includes(this.priorData[i].Id)){
				let product = new Object();
				product.Id = this.priorData[i].Id;
				product.Name = this.priorData[i].Name;
				product.Available_Quantity__c = Number(this.priorData[i].Available_Quantity__c) -Number(1);
				product.ProductCode = this.priorData[i].ProductCode;
				product.Total_Price__c = this.priorData[i].Total_Price__c;
				newPriorData.push(product);
			}
			else{
				newPriorData.push(this.priorData[i]);
			}
		}
		this.priorData = newPriorData;
	}

	cellChangeHandler(event){
		let index = 0;
		let cellProductId = event.detail.draftValues[index].Id
		let cellProductUnitQuantity = event.detail.draftValues[index].Units;
		let actualUnit = this.getActualUnit(cellProductId, cellProductUnitQuantity);
		if(this.cartInlineEditValidation(cellProductId, cellProductUnitQuantity, actualUnit  )){ 
			if(this.errors.rows !== undefined && this.errors.rows[cellProductId] !== undefined ){ 
				delete this.errors.rows[cellProductId];
			}
			this.updateProductDataFromCartSection(cellProductId, actualUnit);
			this.updateCartProductDataFromCartSection(cellProductId, actualUnit);
		}
		else{
			this.showErrorForInlineEditing(cellProductId);
		}
		this.saveDraftValues = [];
		this.displayRecordPerPage(this.page);
	}

	getActualUnit(cellProductId, cellProductUnitQuantity){ 
		for(let i=0;i<this.cartData.length; i++){
			if(cellProductId === this.cartData[i].Id){
				let oldUnit = Number(this.cartData[i].Units);
				return cellProductUnitQuantity - oldUnit;
			}
		}

		return 0;
	}
	
	cartInlineEditValidation(cellProductId, cellProductUnitQuantity, actualUnit){ 
		
		for(let i=0;i<this.priorData.length;i++){
			if(cellProductId === this.priorData[i].Id){
				return (cellProductUnitQuantity <= 0 || actualUnit > this.priorData[i].Available_Quantity__c )?false:true;
			}
		} 

	} 

	
	updateProductDataFromCartSection(productId, Units){
		let newPriorData = [];
		for(let i=0; i<this.priorData.length;i++){
			if(productId === this.priorData[i].Id){
				let product = new Object();
				product.Id = this.priorData[i].Id;
				product.Name = this.priorData[i].Name;
				product.Available_Quantity__c = Number(this.priorData[i].Available_Quantity__c) - Number(Units);
				product.ProductCode = this.priorData[i].ProductCode;
				product.Total_Price__c = this.priorData[i].Total_Price__c;
				if(product.Available_Quantity__c != 0)
				newPriorData.push(product);
			}
			else{
				newPriorData.push(this.priorData[i]);
			}
		}
		this.priorData = newPriorData;
	}

	updateCartProductDataFromCartSection(productId, Units){
		let newCartData = [];
		for(let i=0; i<this.cartData.length;i++){
			if(productId === this.cartData[i].Id){
				let cartProduct = new Object(); 
				cartProduct.Id = this.cartData[i].Id;
				cartProduct.Name = this.cartData[i].Name;
				cartProduct.Units = Number(this.cartData[i].Units) + Number(Units);
				cartProduct.ProductCode = this.cartData[i].ProductCode;
				cartProduct.Total_Price__c = this.cartData[i].Total_Price__c;
				newCartData.push(cartProduct);
			}
			else{
				newCartData.push(this.cartData[i]);
			}
		}
		this.cartData = newCartData;
	}
	showErrorForInlineEditing(rowId){
		this.errors = {
			rows: {
				[rowId]: {
					title: 'We found errors.',
					messages: [
						'Enter a valid Number.'
					],
					fieldNames: ['Units']
				}
			}/*,
			table: {
				title: 'Your entry cannot be saved. Fix the errors and try again.',
				messages: [
					'Row 2 amount must be number',
					'Row 2 email is invalid'
				]
			} */
		};
	}

	handleRowAction(event){
		let row = event.detail.row;
		this.deletingRowFromCartProduct(row);
		this.updatingAvailableQuantityInProduct(row);
		this.hideCheckProductListTable = true;
		this.template.querySelector('c-do-pagination').disableEnableActionAll();
		this.displayRecordPerPage(this.page);
	}


	deletingRowFromCartProduct(row){
		let rowId = row.Id;
		let newCartData = [];
		for(let i=0; i<this.cartData.length;i++){
			if(rowId !== this.cartData[i].Id){
				newCartData.push(this.cartData[i]);
			}
		}
		if(newCartData.length == 0){
			this.cartDataGrid = undefined;
		}
		
		this.cartData = newCartData;
	}

	updatingAvailableQuantityInProduct(row ){
		let rowId = row.Id;
		let Units = row.Units;
		let flag = true;
		let newPriorData = [];
		for(let i=0; i<this.priorData.length;i++){
			if(rowId === this.priorData[i].Id){
				flag = false;
				let product = new Object();
				product.Id = this.priorData[i].Id;
				product.Name = this.priorData[i].Name;
				product.Available_Quantity__c = Number(this.priorData[i].Available_Quantity__c) + Number(Units);
				product.ProductCode = this.priorData[i].ProductCode;
				product.Total_Price__c = this.priorData[i].Total_Price__c;
				newPriorData.push(product);
			}
			else{
				newPriorData.push(this.priorData[i]);
			}
		}
		if(flag){
			let product = new Object();
				product.Id = rowId;
				product.Name = row.Name;
				product.Available_Quantity__c = Units;
				product.ProductCode = row.ProductCode;
				product.Total_Price__c = row.Total_Price__c;
				newPriorData.push(product);
		}
		this.priorData = newPriorData;
	}

	/* Start :- Invoice Section Details */
	cartCheckOutHandler(event){
		this.disabledCartProductDataTable();
		this.setInvoiceCartData();
		this.invoiceDataGrid = true;
	} 

	disabledCartProductDataTable(){
		let CARTCOLUMNSNEW = [
			{ label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', sortable: true },
			{ label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency', sortable: true },
			{ label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text', sortable: true },
			{ label: 'Units', fieldName: "Units", type: 'number', sortable: true, editable: false },
			{
				type: 'button-icon', 
				disabled : "true",
				typeAttributes:  {
					iconName: 'utility:delete',
					name: 'delete',
					iconClass: 'slds-icon-text-error',
					disabled: true
				}
			}
		];
		this.disableCartProductDataTable = true;
		this.isGoToCartBTNDisabled = true;
		this.cartColumns = CARTCOLUMNSNEW;		
		this.isCheckOutBTNDisabled = true;
	}

	setInvoiceCartData(){
		let invoiceCartDataTemp = [];
		for(let i=0; i<this.cartData.length;i++){
			let invoiceCartProduct = new Object(); 
			invoiceCartProduct.Id = this.cartData[i].Id;
			invoiceCartProduct.Name = this.cartData[i].Name;
			invoiceCartProduct.Total_Price__c = this.cartData[i].Total_Price__c;
			invoiceCartProduct.ProductCode = this.cartData[i].ProductCode;
			invoiceCartProduct.Units = this.cartData[i].Units;
			invoiceCartProduct.Total = this.calculateTotalPriceForSingleProduct(this.cartData[i].Units, this.cartData[i].Total_Price__c);
			invoiceCartDataTemp.push(invoiceCartProduct);
		} 
		this.invoiceCartData = invoiceCartDataTemp;
	}

	calculateTotalPriceForSingleProduct(unit, price){
		return Number(unit) * Number(price);

	}

	placeOrderHandler(event){
		this.UpdateRecordInDB();
		this.isPlaceOrderBTNDisabled = true;
	}

	UpdateRecordInDB(){
		updatePurchaseOrderRecords({ objList: this.invoiceCartData, userId:this.userId })
            .then((result) => {
				this.invoice = result[1];
				this.invoiceDate = result[0];
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
				this.testLength= undefined;
            });
    }

	/* End :- Invoice Section Details */
}
