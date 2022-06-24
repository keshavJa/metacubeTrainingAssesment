public class ProductServiceImpl implements IProductService {
    
    public List<Purchase_Order__c> getPurchaseOrders(String userId){
        List<Purchase_Order__c> poList = new List<Purchase_Order__c>();
        PurchaseOrderSelectorImpl poSelectorImpl = new PurchaseOrderSelectorImpl();
        try{ 
            poList = poSelectorImpl.getPurchaseOrdersByUserId(userId);
            return  poList;
        }
        catch(Exception ex){
            System.System.debug('Exception in ProductServiceImpl in method getPurchaseOrders= '+ ex.getMessage());
            return poList;
        }
    }

    public List<Product2> getProducts(String searchKey, String sortBy, String sortDirection){
        List<Product2> prodList = new List<Product2>();
        ProductSelectorImpl prodSelImpl = new ProductSelectorImpl();
        try{
             prodList = prodSelImpl.getProducts(searchKey, sortBy,  sortDirection);
             return prodList;
        }
        catch(Exception ex){
            System.System.debug('Exception in ProductServiceImpl at Method getProducts ' + ex.getMessage());
            return prodList;
        }
       
    }

    public List<String> updatePurchaseOrderRecords(List<map<String, Object>> objList, Id userId){
        List<String> result = new List<String>();
        ProductSelectorImpl prodSelImpl = new ProductSelectorImpl();
        fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
            new Schema.SObjectType[] {
                Product2.SObjectType,
                Purchase_Order__c.SObjectType,
                Purchase_Order_Line_Item__c.SObjectType
            }
        );
        Map<Id, Decimal> prodMap = new  Map<Id, Decimal>();

        for(Integer i=0; i<objList.size();i++){
            ID id = (Id)objList[i].get('Id');
            Decimal unit = (Decimal)objList[i].get('Units');
            prodMap.put(id, unit);
        }
        
        //List<Product2> prodIdList = prodSelImpl.selectById(prodMap.keySet());
        List<Product2> prodIdList = [SELECT Id, Available_Quantity__c 
                                     FROM Product2
                                     where Id IN : prodMap.keySet()];
        
        for(Product2 p: prodIdList){
            Decimal unit = prodMap.get(p.Id);
            p.Available_Quantity__c = p.Available_Quantity__c - unit;
        } 
        uow.registerDirty(prodIdList);
        result = insertInPurchaseOrder(objList, userId, uow);
        return result; 
    }

    private List<String> insertInPurchaseOrder(List<map<String, Object>> objList, Id userId, fflib_SObjectUnitOfWork uow){
        List<String> result = new List<String>();
        List<Purchase_Order__c> purchOrderList = new List<Purchase_Order__c>();
        Purchase_Order__c po = new Purchase_Order__c();
        Decimal orderTotal =0;
        for(Integer i=0; i<objList.size();i++){
            orderTotal = (Decimal)objList[i].get('Total') + orderTotal;
        }
        Date dt =  Date.today();
        po.Order_Amount__c = orderTotal;
        po.Order_Status__c = 'Placed';
        po.OwnerId = userId;
        po.Order_Date__c = dt;
        uow.registerNew(po);
        for(Integer i=0; i<objList.size();i++){
            Purchase_Order_Line_Item__c poli = new Purchase_Order_Line_Item__c();
            poli.Product__c =(String)objList[i].get('Id');
            poli.Product_Item_Quantity__c = (Decimal)objList[i].get('Units');
            poli.Product_Price__c = (Decimal)objList[i].get('Total_Price__c');
            uow.registerRelationship(poli, Purchase_Order_Line_Item__c.Purchase_Order__c, po);
            uow.registerNew(poli, Purchase_Order_Line_Item__c.Purchase_Order__c, po);
        }
        try{ 
            uow.commitWork();
            result.add(String.valueOf(dt));
            result.add(po.Id);
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
