public interface IPurchaseOrderSelector extends fflib_ISObjectSelector {
    
    List<Purchase_Order__c> getPurchaseOrdersByUserId(String userId);
}
