import Condition from '../enums/Condition'
import Order from '../enums/Order'
import ProductColumn from '../enums/ProductColumn'

type ProductsRequest = {
  sortColumn: ProductColumn,
  sortOrder: Order,
  filterColumn: ProductColumn,
  filterCondition: Condition,
  filterSearchText: string,
  itemsPerPage: number,
  currentPage: number,
}

export default ProductsRequest
