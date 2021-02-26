public with sharing class PurchaseOrderSelectorImpl extends fflib_SObjectSelector implements IPurchaseOrderSelector {
   
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Purchase_Order__c.Id,
            Purchase_Order__c.Order_Status__c,
            Purchase_Order__c.Order_Amount__c
        };
    }
    public Schema.SObjectType getSObjectType() {
        return Purchase_Order__c.sObjectType;
    }

    public List<Purchase_Order__c> getPurchaseOrdersByUserId(String userId) {
        return (List<Purchase_Order__c>) Database.query(
            
        //Query factory has been pre-initialised by calling getSObjectFieldList()

        newQueryFactory().
        // Now focus on building the remainder of the query needed for this method.
        
        setCondition('Owner.ID =: userId').

        // Finally build the query to execute
        toSOQL());
    }
}
