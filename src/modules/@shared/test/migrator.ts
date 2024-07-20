import { join } from 'path'
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'
import { SequelizeStorage, Umzug } from 'umzug'

export interface MigratorProps {
  models: ModelCtor<Model>[]
  sequelize?: Sequelize | null
  migrationsParentFolder?: string | null
}

export class Migrator {
  private sequelize: Sequelize

  private migrator: Umzug<any>

  constructor(props: MigratorProps) {
    if (props.sequelize) {
      this.sequelize = props.sequelize
    } else {
      this.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
      })
    }

    this.sequelize.addModels(props.models)

    const migrationsParentFolder = props.migrationsParentFolder
      ? props.migrationsParentFolder
      : join(__dirname, '../../../')

    this.migrator = new Umzug({
      migrations: {
        glob: [
          'migrations/*.migration.{js,ts}',
          {
            cwd: migrationsParentFolder,
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
    await this.sequelize.close()
  }
}
