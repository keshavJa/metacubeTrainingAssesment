import { LightningElement, wire, api } from 'lwc';

import PO_STATUS_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Status__c';
import PO_AMOUNT_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Amount__c';

import Id from '@salesforce/user/Id';
import getPurchaseOrders from '@salesforce/apex/PurchaseOrderController.getPurchaseOrders';


const PURCHASEORDERCOL = [
    { label: 'PO Id', fieldName: 'Id', type: 'text' },
    { label: 'Status', fieldName: PO_STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Order Total', fieldName: PO_AMOUNT_FIELD.fieldApiName, type: 'currency'}
]; 

export default class PurchaseOrderHistory extends LightningElement {
    userId = Id;
	@api
    purchaseOrderDataItems;
	@api
	purchaseOrderColumns = PURCHASEORDERCOL;

	purchaseOrderFlag = false;
	productListFlag = false;

    @wire(getPurchaseOrders, {userId: '$userId'})
	purchaseOrderData({error, data}){
		if(data){
			this.purchaseOrderDataItems = data;
			this.error = undefined;
			if(this.purchaseOrderDataItems.length === 0){
				this.purchaseOrderFlag = false;
				this.productListFlag = true;
				
			} 
			else{
				this.purchaseOrderFlag = true;
				this.productListFlag = false;
			}
			this.dispatchEvent
			(
				new CustomEvent
				(
					'historyload',
					{
						detail:
							{
								'purchaseOrderFlag': this.purchaseOrderFlag,
								'productListFlag':this.productListFlag
							}
					
					}
				)
			);
		}
		if(error){
			this.error = error;
			this.data = undefined;
		}
	}
}