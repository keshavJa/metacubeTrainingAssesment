import { LightningElement,track } from 'lwc';

import updatePurchaseOrderRecords from '@salesforce/apex/ProductController.updatePurchaseOrderRecords';
import Id from '@salesforce/user/Id';


export default class OnlineShopIndexPage extends LightningElement {
    purchaseOrderFlag=true;
	ispurchaseOrderBtnDisabled = false;
    productListFlag;
    isNewPurchaseBtnDisable;
    cartDataFlag;
    priorData=[];
    cartData=[];
	cartErrors = [];
	invoiceDataFlag;
	@track invoiceCartData = [];
	invoiceDate;
	invoice;
	userId = Id;

    historyHandler(event){
       this.purchaseOrderFlag = event.detail.purchaseOrderFlag;
       this.productListFlag = event.detail.productListFlag;
        
    }

    newPurchaseBtnHandler(){
		this.ispurchaseOrderBtnDisabled = true;
        this.productListFlag = true;
    }


    // Start:-  Updation in ProdctListData
    goToCartClickHandler(event){
        let selectedProductList = event.detail.selectedProductList;
        let selectedProductListIds = event.detail.selectedProductListIds;
        this.priorData = event.detail.priorData;
        this.cartDataFlag = event.detail.cartDataFlag;
        this.updateProductData(selectedProductListIds);
        this.updateCartProductData(selectedProductListIds, selectedProductList);
		this.template.querySelector('c-product-list-new').setPageData(this.priorData);
		
         
     }

     updateProductData(selectedProductListIds){
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

    // End:-  Updation in ProdctListData

	// Start: Cell Change Event Handler
	cartCellChangeHandler(event){
		let cellProductId = event.detail.cellProductId;
		let cellProductUnitQuantity = event.detail.cellProductUnitQuantity;
		let actualUnit = this.getActualUnit(cellProductId, cellProductUnitQuantity);
		if(this.cartInlineEditValidation(cellProductId, cellProductUnitQuantity, actualUnit  )){ 
			if(this.cartErrors.rows !== undefined && this.cartErrors.rows[cellProductId] !== undefined ){ 
				delete this.cartErrors.rows[cellProductId];
			}
			this.updateProductDataFromCartSection(cellProductId, actualUnit);
			this.updateCartProductDataFromCartSection(cellProductId, actualUnit);
			this.template.querySelector('c-product-list-new').setPageData(this.priorData);
			//this.template.querySelector('c-product-list-new').setPriorData(this.priorData);
			//this.template.querySelector('c-cart-section').setCartData(this.cartData);
			
		}
		else{
			this.showErrorForInlineEditing(cellProductId);
		}
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
		this.cartErrors = {
			rows: {
				[rowId]: {
					title: 'We found errors.',
					messages: [
						'Enter a valid Number.'
					],
					fieldNames: ['Units']
				}
			}
		};
	}

	// End: Cell Change Event Handler

	//Start:  cartRowActionhandler
	cartRowActionhandler(event){
		let row = event.detail.row;
		this.deletingRowFromCartProduct(row);
		this.updatingAvailableQuantityInProduct(row);
		this.template.querySelector('c-product-list-new').setPageData(this.priorData);
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
			this.cartDataFlag = undefined;
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

	//End:  cartRowActionhandler

	// Start:- Cart Check Out Button Handler
	cartCheckOutEventHandler(){
		
		this.template.querySelector('c-product-list-new').updateCartCheckOutAction();
		this.setInvoiceCartData();
		this.invoiceDataFlag = true;
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

	// End:- Cart Check Out Button Handler

	// Start: Place Card Btn Click Handler
	placeOrderHandler(event){
		this.UpdateRecordInDB();
	}

	UpdateRecordInDB(){
		let str = 'Order Date ';
		let ins = 'Invoice No#';
		updatePurchaseOrderRecords({ objList: this.invoiceCartData, userId:this.userId })
            .then((result) => {
				this.invoice = ins+result[1];
				this.invoiceDate = str + result[0];
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
				this.testLength= undefined;
            });
    }

	

	// End: Place Card Btn Click Handler



















}