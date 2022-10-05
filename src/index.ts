import * as http from 'http'
import Condition from './enums/Condition';
import Order from './enums/Order';
import ProductColumn from './enums/ProductColumn';
import Product from './models/Product'
import ProductsRequest from "./types/ProductsRequest";

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  try {
    if (req.url === undefined) throw new Error("url is undefined")
    const url = new URL(req.url, 'http://localhost:8080')
    const corsHeaders = [
      { key: 'Access-Control-Allow-Origin', value: url.origin },
      { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,POST,OPTIONS' },
      { key: 'Access-Control-Max-Age', value: '86400' },
    ]
    if (req.method === 'OPTIONS') {
      corsHeaders.forEach(header => res.setHeader(header.key, header.value))
      res.writeHead(200)
      res.end()
    }
    if (req.method === 'GET' && url.pathname === '/products') {
      const sortColumn = url.searchParams.get('sortColumn')
      const sortOrder = url.searchParams.get('sortOrder')
      const filterColumn = url.searchParams.get('filterColumn')
      const filterCondition = url.searchParams.get('filterCondition')
      const filterSearchText = url.searchParams.get('filterSearchText')
      const itemsPerPage = url.searchParams.get('itemsPerPage')
      const currentPage = url.searchParams.get('currentPage')
      const productRequest: ProductsRequest = {
        sortColumn: sortColumn ? sortColumn as ProductColumn : ProductColumn.Identity,
        sortOrder: sortOrder ? Number(sortOrder) as Order : Order.None,
        filterColumn: filterColumn ? filterColumn as ProductColumn : ProductColumn.Identity,
        filterCondition: filterCondition ? Number(filterCondition) as Condition : Condition.Contain,
        filterSearchText: filterSearchText ? filterSearchText : '',
        itemsPerPage: itemsPerPage ? Number(itemsPerPage) : 15,
        currentPage: currentPage ? Number(currentPage) : 1,
      }
      const product = new Product()
      product.getProductsPage(productRequest).then(productResponse => {
        corsHeaders.forEach(header => res.setHeader(header.key, header.value))
        res.writeHead(200)
        res.write(JSON.stringify({ ok: true, data: productResponse }))
        res.end()
      })
    } else {
      res.writeHead(404)
      res.write(JSON.stringify({ ok: false, message: 'Not found' }))
      res.end()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    res.writeHead(500)
    res.write(JSON.stringify({ ok: false, message: message }))
    res.end()
  }
})

server.listen(3000)