public interface IProductSelector extends fflib_ISObjectSelector {
    
    List<Product2> getProducts(String searchKey, String sortBy, String sortDirection);
    
}
