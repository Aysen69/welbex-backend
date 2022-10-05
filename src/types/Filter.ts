import Condition from "../enums/Condition"
import ProductColumn from "../enums/ProductColumn"

type Filter = {
  column: ProductColumn,
  condition: Condition,
  searchText: string
}

export default Filter
