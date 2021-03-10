public with sharing class Application {
   // Configure and create the UnitOfWorkFactory for this Application
   public static final fflib_Application.UnitOfWorkFactory UnitOfWork =
   new fflib_Application.UnitOfWorkFactory(
           new List<SObjectType> {
            Product2.SObjectType,
            Purchase_Order__c.SObjectType,
            Purchase_Order_Line_Item__c.SObjectType }); 

// Configure and create the ServiceFactory for this Application
public static final fflib_Application.ServiceFactory Service =
   new fflib_Application.ServiceFactory(
       new Map<Type, Type> {
                IProductService.class => ProductServiceImpl.class });

}
