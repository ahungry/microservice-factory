# microservice-factory - A factory for generating microservices

(in a language of your choice)

I find all the CRUD boilerplate super tedious when working on
microservices (or any API really), so this aims to alleviate some of
that pain.

With this tool, this becomes:
```yml
  - name: Person
    sql: |
      SELECT
        'Jon' as first_name
      , 'Smith' as last_name
    props:
      - { name: first_name, type: string }
      - { name: last_name, type: string }
```

```typescript
export class MyIntModel {
  constructor (
    public x: number = undefined,
    public y: number = undefined,

  ) { }

  public static fromSql (o: {}) {
    return new this(
      Number(o['x'])
      Number(o['y'])

    )
  }
}

export class MyIntRepository {
  constructor (private db) { }

  public async select (): Promise<MyIntModel[]> {
    const rows = await this.db.getConnection().any(
      `
SELECT
  3 as x
, 4 as y
`
    )

    return rows.map(r => MyIntModel.fromSql)
  }
}
```

## CLI
Build with `cat build.sh | sh` in the project root.

Then you can use a simple `make test` in the future to test changes.

To run tests in the REPL: `(ql:quickload :microservice-factory) (microservice-factory.run.tests:main)`

## License
GPLv3
