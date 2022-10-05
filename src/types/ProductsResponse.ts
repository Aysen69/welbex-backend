import Pagination from "./Pagination"
import Product from "./Product"

type ProductsResponse = {
  products: Product[],
  pagination: Pagination
}

export default ProductsResponse
