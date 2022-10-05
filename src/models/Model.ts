import { Pool, PoolClient, Query, QueryResult } from 'pg'

const pool = new Pool()

export default abstract class Model {

  protected async query(text: string) {
    return new Promise<QueryResult<any>>((res, rej) => {
      pool.query(text, [], (err: Error, result: QueryResult<any>) => {
        if (err) {
          rej(err)
        } else {
          res(result)
        }
      })
    })
  }

}
