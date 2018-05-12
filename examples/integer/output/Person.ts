import * as p from 'process'
import * as pgp from 'pg-promise'

export class PersonModel {
  constructor (
    public id: number = undefined,
    public first_name: string = undefined,
    public last_name: string = undefined,

  ) { }

  public static fromSql (o: {}) {
    return new this(
      Number(o['id']),
      String(o['first_name']),
      String(o['last_name']),

    )
  }
}

export class PersonRepository {
  constructor (private db) { }

  public async select (): Promise<PersonModel[]> {
    const rows = await this.db.any(
      `
SELECT
  first_name
, last_name
, id
FROM blueprint.users
`
    )

    return rows.map(r => PersonModel.fromSql(r))
  }

  public async update (m: PersonModel): Promise<PersonModel[]> {
    const rows = await this.db.any(
      `
UPDATE blueprint.users
SET
  first_name = $(first_name)
, last_name  = $(last_name)
WHERE id = $(id) RETURNING *
`,
      m,
    )

    return rows.map(r => PersonModel.fromSql(r))
  }
}

export class PersonService {
  constructor (
    protected repo: PersonRepository,
  ) { }
  public getAll = this.repo.select.bind(this.repo)
  public update = this.repo.update.bind(this.repo)
}

const db = pgp()
const dbh = db({
  host: 'localhost',
  port: Number('5432'),
  database: 'mcarter',
  user: 'mcarter',
  password: '',
})

const repo = new PersonRepository(dbh)
const service = new PersonService(repo)

void async function main () {
  const rec = await repo.select()
  console.log(rec)

  const records = await service.getAll()
  console.log(records)

  p.exit(0)
}()
