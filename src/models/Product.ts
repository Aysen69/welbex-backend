import Order from "../enums/Order";
import Model from "./Model";
import Condition from "../enums/Condition";
import ProductType from "../types/Product";
import { QueryResult } from "pg";
import ProductsRequest from "../types/ProductsRequest";
import ProductsResponse from "../types/ProductsResponse";
import ProductColumn from "../enums/ProductColumn";

export default class Product extends Model {

  public async getProductsPage(productsRequest: ProductsRequest): Promise<ProductsResponse> {
    // TODO: перевести все это дело на процедурный язык pl/pgsql
    const [products, totalCount] = await Promise.all([this._getProducts(productsRequest), this._getTotalCount(productsRequest)])
    return {
      products: products.rows,
      pagination: {
        itemsPerPage: productsRequest.itemsPerPage,
        currentPage: productsRequest.currentPage,
        totalItems: totalCount,
      }
    }
  }

  private async _getProducts(productsRequest: ProductsRequest): Promise<QueryResult<ProductType>> {
    let sql = 'select * from product where 1=1 '
    sql += this._where(productsRequest)
    sql += ' order by ' + productsRequest.sortColumn + ' '
    switch (productsRequest.sortOrder) {
      case Order.Ascendant:
        sql += 'asc'
        break
      case Order.Descendant:
        sql += 'desc'
        break
    }
    sql += ' limit ' + productsRequest.itemsPerPage
    sql += ' offset ' + productsRequest.itemsPerPage * (productsRequest.currentPage >= 1 ? productsRequest.currentPage - 1 : 1)
    const queryResult: QueryResult<ProductType> = await this.query(sql)
    return queryResult
  }

  private async _getTotalCount(productsRequest: ProductsRequest): Promise<number> {
    const sql = 'select count(id)::integer as cnt from product where 1=1 ' + this._where(productsRequest)
    const queryResult: QueryResult<{ cnt: number }> = await this.query(sql)
    return queryResult.rows[0].cnt
  }

  private _where(productsRequest: ProductsRequest) {
    let sql = ''
    switch (productsRequest.filterCondition) {
      case Condition.Contain:
        if (!Product._isTextColumn(productsRequest.filterColumn)) break
        sql += ' and ' + productsRequest.filterColumn + '::text like \'%' + productsRequest.filterSearchText + '%\''
        break
      case Condition.Equal:
        if (!Product._isComparableColumn(productsRequest.filterColumn)) break
        sql += ' and ' + productsRequest.filterColumn + '::text = \'' + productsRequest.filterSearchText + '\''
        break
      case Condition.Less:
        if (!Product._isNumericColumn(productsRequest.filterColumn)) break
        sql += ' and ' + productsRequest.filterColumn + '::integer < ' + Product._parseNumber(productsRequest.filterSearchText)
        break
      case Condition.More:
        if (!Product._isNumericColumn(productsRequest.filterColumn)) break
        sql += ' and ' + productsRequest.filterColumn + '::integer > ' + Product._parseNumber(productsRequest.filterSearchText)
        break
    }
    return sql
  }

  private static _isNumericColumn(productColumn: ProductColumn) {
    return [ProductColumn.Identity, ProductColumn.Quantity, ProductColumn.Distance].includes(productColumn)
  }

  private static _isTextColumn(productColumn: ProductColumn) {
    return [ProductColumn.Date, ProductColumn.Name].includes(productColumn)
  }

  private static _isComparableColumn(productColumn: ProductColumn) {
    return [ProductColumn.Identity, ProductColumn.Date, ProductColumn.Name, ProductColumn.Quantity, ProductColumn.Distance].includes(productColumn)
  }

  private static _parseNumber(input: any) {
    if (typeof input !== 'string') return 0
    if (input === '') return 0
    const regExpNumMatch = input.match(/\d+/g)
    const num = regExpNumMatch === null ? 0 : Number(regExpNumMatch[0])
    return num
  }

}
