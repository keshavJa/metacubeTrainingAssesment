public with sharing class PurchaseOrderController {

    @AuraEnabled(cacheable=true)
    public static List<Purchase_Order__c> getPurchaseOrders(String userId) {
        ProductServiceImpl proSerImpl = new ProductServiceImpl();
        List<Purchase_Order__c> poList = new List<Purchase_Order__c>();
        try{
            poList = proSerImpl.getPurchaseOrders(userId);
            return poList;
        }
        catch(Exception ex){
            System.System.debug('Exception in PurchaseOrderController at method getPurchaseOrders = '+ex.getMessage());
            return poList;
        }
    }
}
