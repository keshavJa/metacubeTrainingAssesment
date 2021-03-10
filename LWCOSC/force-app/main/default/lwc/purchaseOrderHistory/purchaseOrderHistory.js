import { LightningElement, wire, api } from 'lwc';

import PO_STATUS_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Status__c';
import PO_AMOUNT_FIELD from '@salesforce/schema/Purchase_Order__c.Order_Amount__c';

import Id from '@salesforce/user/Id';
import getPurchaseOrders from '@salesforce/apex/PurchaseOrderController.getPurchaseOrders';

import PURCHASE_ORDER_HEADER_LABEL from '@salesforce/label/c.Purchase_Order_Header';
import { EventsDispatcher } from './events';


const PURCHASEORDERCOL = [
    { label: 'PO Id', fieldName: 'Id', type: 'text' },
    { label: 'Status', fieldName: PO_STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Order Total', fieldName: PO_AMOUNT_FIELD.fieldApiName, type: 'currency'}
]; 

export default class PurchaseOrderHistory extends LightningElement {
    userId = Id;
	purchaseOrderDataItems;
	purchaseOrderColumns = PURCHASEORDERCOL;

	purchaseOrderLabel=PURCHASE_ORDER_HEADER_LABEL;

	purchaseOrderFlag = false;
	productListFlag = false;

	constructor() {
		super();
		this.eventsDispatcher = new EventsDispatcher(this);
	}

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
			/*this.dispatchEvent
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
			);*/
			let purchaseOrderFlag= this.purchaseOrderFlag;
			let productListFlag= this.productListFlag;
			
			this.eventsDispatcher.historyLoad({
				purchaseOrderFlag,
				productListFlag,
			});
		}
		if(error){
			this.error = error;
			this.data = undefined;
		}
	}
}