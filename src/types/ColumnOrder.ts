import Order from "../enums/Order"
import ProductColumn from "../enums/ProductColumn"

type ColumnOrder = {
  column: ProductColumn,
  order: Order
}

export default ColumnOrder
