global with sharing  class ProductService {
    global static List<Purchase_Order__c> getPurchaseOrders(String userId)
    {
        return service().getPurchaseOrders(userId);
    }

    global static List<Product2> getProducts(String searchKey, String sortBy, String sortDirection)
    {
        return service().getProducts(searchKey, sortBy, sortDirection);
    }

    global static List<String> updatePurchaseOrderRecords(List<map<String, Object>> objList, Id userId)
    {
        return service().updatePurchaseOrderRecords(objList, userId);
    }
    private static IProductService service()
    {
        return (IProductService) Application.Service.newInstance(IProductService.class);
    }
}
