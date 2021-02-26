import { LightningElement, api, track } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Total_Price__c';
import PRODUCT_CODE_FIELD from '@salesforce/schema/Product2.ProductCode';


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

export default class CartSection extends LightningElement {
	purchaseOrderDataItems=[];
	@track cartColumns = CARTCOLUMNS;
	@api cartData =[];
	saveDraftValues; 
	isCheckOutBTNDisabled = false;
    @api cartErrors= [];
	saveDraftValues;

	
	cellChangeHandler(event){
		let index = 0;
		let cellProductId = event.detail.draftValues[index].Id
		let cellProductUnitQuantity = event.detail.draftValues[index].Units;
		this.dispatchEvent
		(
			new CustomEvent
			(
				'cartcellchange',
				{
					detail:
						{
							'cellProductId': cellProductId,
							'cellProductUnitQuantity': cellProductUnitQuantity
						}
				
				}
			)
		);
		
		this.saveDraftValues = [];
	}

	handleRowAction(event){
		let row = event.detail.row;
		this.dispatchEvent
		(
			new CustomEvent
			(
				'cartrowaction',
				{
					detail:
						{
							'row': row
						}
				
				}
			)
		);
	}

	@api
	setCartData(value){
		this.cartData = value;
	}

	cartCheckOutHandler(event){
		this.disabledCartProductDataTable();
		this.dispatchEvent(new CustomEvent('cartcheckoutevent'));
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
		this.cartColumns = CARTCOLUMNSNEW;		
		this.isCheckOutBTNDisabled = true;

		
	}

	
	



}