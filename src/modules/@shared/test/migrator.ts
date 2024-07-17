import { join } from 'path'
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'
import { SequelizeStorage, Umzug } from 'umzug'

export class Migrator {
  private sequelize: Sequelize

  private migrator: Umzug<any>

  constructor(models: ModelCtor<Model>[]) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    this.sequelize.addModels(models)

    this.migrator = new Umzug({
      migrations: {
        glob: [
          'migrations/*.migration.{js,ts}',
          {
            cwd: join(__dirname, '../../../'),
            ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
          },
        ],
      },
      context: this.sequelize,
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      logger: console,
    })
  }

  public async up(): Promise<void> {
    await this.migrator.up()
  }

  public async down(): Promise<void> {
    await this.migrator.down()
  }
}
