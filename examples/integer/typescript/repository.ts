import * as p from 'process'
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
    const rows = await this.db.any(
      `
__SQL__`
    )

    return rows.map(r => StubModel.fromSql(r))
  }

  public async update (m: StubModel): Promise<StubModel[]> {
    const rows = await this.db.any(
      `
__UPDATE-SQL__`,
      m,
    )

    return rows.map(r => StubModel.fromSql(r))
  }
}

export class StubService {
  constructor (
    protected repo: StubRepository,
  ) { }
  public getAll = this.repo.select.bind(this.repo)
  public update = this.repo.update.bind(this.repo)
}

const db = pgp()
const dbh = db({
  host: '__HOST__',
  port: Number('__PORT__'),
  database: '__NAME__',
  user: '__USER__',
  password: '__PASS__',
})

const repo = new StubRepository(dbh)
const service = new StubService(repo)

void async function main () {
  const rec = await repo.select()
  console.log(rec)

  const records = await service.getAll()
  console.log(records)

  p.exit(0)
}()
