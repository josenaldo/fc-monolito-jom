import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'

export class TestUtils {
  static CreateSequelize(): Sequelize {
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: {
        force: true,
      },
    })
  }

  static async CreateSequelizeWithModels(
    models: ModelCtor<Model>[]
  ): Promise<Sequelize> {
    const sequelize = TestUtils.CreateSequelize()

    sequelize.addModels(models)

    await sequelize.sync()
    return sequelize
  }
}
