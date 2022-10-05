import ProductColumn from "../enums/ProductColumn"

type Product = {
  [ProductColumn.Identity]: string,
  [ProductColumn.Date]: string,
  [ProductColumn.Name]: string,
  [ProductColumn.Quantity]: number,
  [ProductColumn.Distance]: number,
}

export default Product
