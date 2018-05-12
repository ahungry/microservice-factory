import * as pgp from 'pg-promise'

export class StubModel {
  constructor (
    //props
  ) { }

  public static fromSql (o: {}) {
    return new this(
      //propsFromSql
    )
  }
}

export class StubRepository {
  constructor (private db) { }

  public async select (): Promise<StubModel[]> {
    const rows = await this.db.getConnection().any(
      `
__SQL__`
    )

    return rows.map(r => StubModel.fromSql)
  }
}
