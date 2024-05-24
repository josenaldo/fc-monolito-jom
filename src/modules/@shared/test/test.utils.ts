import { Sequelize } from 'sequelize-typescript'

export function CreateSequelize(): Sequelize {
  return new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    sync: {
      force: true,
    },
  })
}

export function CreateMockRepository() {
  return {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  }
}
