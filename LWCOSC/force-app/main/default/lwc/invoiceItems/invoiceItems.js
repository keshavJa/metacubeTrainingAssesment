import { LightningElement, api,track } from 'lwc';

import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Total_Price__c';
import PRODUCT_CODE_FIELD from '@salesforce/schema/Product2.ProductCode';

const INVOICECARTCOLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Product Code', fieldName: PRODUCT_CODE_FIELD.fieldApiName, type: 'text'},
    { label: 'Units', fieldName: 'Units', type: 'number'},
	{ label: 'Total', fieldName: 'Total', type: 'currency'}
];

export default class InvoiceItems extends LightningElement {
    @api invoiceCartData = [];
    invoiceCartColumns = INVOICECARTCOLUMNS;
	isPlaceOrderBTNDisabled = false;
    @api invoice;
    @api invoiceDate;

    placeOrderHandler(){
        this.isPlaceOrderBTNDisabled = true;
        this.dispatchEvent(new CustomEvent('placeorderbtnclick'));
    }
}