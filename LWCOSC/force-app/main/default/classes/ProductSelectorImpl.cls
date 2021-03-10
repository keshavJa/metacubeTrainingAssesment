public inherited sharing class ProductSelectorImpl extends fflib_SObjectSelector implements IProductSelector  {
    
    String sortBy;
    String sortDirection;

    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Product2.Id,
            Product2.Name,
            Product2.Total_Price__c,
            Product2.ProductCode,
            Product2.Available_Quantity__c
         };
    }
    public Schema.SObjectType getSObjectType() {
        return Product2.sObjectType;
    }

    public List<Product2> selectById(Set<ID> idSet) {
        return (List<Product2>) selectSObjectsById(idSet);
    }

    public override String getOrderBy() {
        String order = this.sortBy + '  '+ this.sortDirection;
        return order;
    } 

    public List<Product2> getProducts(String searchKey, String sortBy, String sortDirection){
        this.sortBy = sortBy; this.sortDirection = sortDirection;
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            return (List<Product2>) Database.query(
                
                newQueryFactory().
                setCondition('Name LIKE :key').
                toSOQL());
        }
        else{
            return (List<Product2>) Database.query(
                
                newQueryFactory().
                toSOQL());
        }
    }
}
