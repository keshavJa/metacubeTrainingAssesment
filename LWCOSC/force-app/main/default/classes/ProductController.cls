public with sharing class ProductController {
    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String searchKey, String sortBy, String sortDirection) {
        ProductServiceImpl proSerImpl = new ProductServiceImpl();
        List<Product2> prodList = new List<Product2>();
        try{
            prodList= proSerImpl.getProducts(searchKey, sortBy, sortDirection);
            return prodList;
        }
        catch(Exception ex){
            System.System.debug('Exception in ProductController at method getProducts = '+ex.getMessage());
            return prodList;
        }
        
    }
    
    @AuraEnabled
    public static List<String> updatePurchaseOrderRecords(List<map<String, Object>> objList, Id userId) {
        ProductServiceImpl proSerImpl = new ProductServiceImpl();
        List<String> result = new List<String>();
        try{ 
            result = proSerImpl.updatePurchaseOrderRecords(objList, userId);
            return result;
        }
        catch(Exception ex){
            System.System.debug(ex.getCause());
            System.System.debug(ex.getMessage());
            System.System.debug(ex.getStackTraceString());
            return result;
        }
        
    }
    
}