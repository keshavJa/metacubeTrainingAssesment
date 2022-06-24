import { LightningElement, api, wire, track } from 'lwc';


import getProducts from '@salesforce/apex/ProductController.getProducts';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Total_Price__c';
import PRODUCT_CODE_FIELD from '@salesforce/schema/Product2.ProductCode';
import AVAILABLE_UNITS_FIELD from '@salesforce/schema/Product2.Available_Quantity__c';

import PURCHASE_ORDER_HEADER_LABEL from '@salesforce/label/c.Product_Header';


const PRODLISTCOLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency', sortable: true },
    { label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text', sortable: true },
    { label: 'Available Units', fieldName: AVAILABLE_UNITS_FIELD.fieldApiName, type: 'number', sortable: true }
];

export default class ProductListNew extends LightningElement {
    
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
	@track page = 1; //this will initialize 1st page
    @track data = []; //data to be displayed in the table
    purchaseOrderHeaderLabel=PURCHASE_ORDER_HEADER_LABEL
    priorData;
    isSearchInputDisable = false;
    productListFlag = true;
    hideCheckProductListTable = false;
	errors=[];
	selectedProductList = [];
	selectedRows = [];
	isGoToCartBTNDisabled = false;
	searchKey = '';
    setSelectedRows;
    items = []; //it contains all the records.
    columns; //holds column info.
    startingRecord = 1; //start record position per page
    endingRecord = 0; //end record position per page
    pageSize = 10; //default value we are assigning
    totalRecountCount = 0; //total record count received from all retrieved records
    totalPage = 0; //total number of page is needed to display all records
    

    @wire(getProducts, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
	getPaginationProduct({error, data}){
		if(data){
			this.items = data;
			this.priorData = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = PRODLISTCOLUMNS;
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

    
	goToCartHandler(event){  //productListTable
		let selectedProductList = this.template.querySelector('.productListTableClass').getSelectedRows();
		let selectedProductListIds = [];
		 if(selectedProductList.length>0){
			for(let i=0; i<selectedProductList.length;i++){
				selectedProductListIds.push(selectedProductList[i].Id);
			}

            this.dispatchEvent
			(
				new CustomEvent
				(
					'gotocartclick',
					{
						detail:
							{
								'selectedProductList': selectedProductList,
								'selectedProductListIds': selectedProductListIds,
                                'priorData':this.priorData,
                                'cartDataFlag':true
							}
					
					}
				)
			);
            this.setSelectedRows = [];
		}
	}

    @api
    setPageData(value){
        this.priorData = value;
        this.displayRecordPerPage(this.page);
    }  

    @api
    updateCartCheckOutAction(){
        
		this.disableCartProductDataTable = true;
        this.hideCheckProductListTable = true;
		this.isGoToCartBTNDisabled = true;
        this.isSearchInputDisable=true;
		this.template.querySelector('c-do-pagination').disableEnableActionAll();
		this.displayRecordPerPage(this.page);
    } 

}