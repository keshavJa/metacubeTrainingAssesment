public interface IProductService {
    
    List<Purchase_Order__c> getPurchaseOrders(String userId);

    List<Product2> getProducts(String searchKey, String sortBy, String sortDirection);

    List<String> updatePurchaseOrderRecords(List<map<String, Object>> objList, Id userId);
    
    //List<String> insertInPurchaseOrder(List<map<String, Object>> objList, Id userId);
}
