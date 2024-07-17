import { DataTypes, Sequelize } from 'sequelize'
import { MigrationFn } from 'umzug'

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await createTableClients(sequelize)
  await createTableProducts(sequelize)
  await createTableInvoices(sequelize)
  await createTableInvoiceItems(sequelize)
  await createTableTransactions(sequelize)
  await createTableOrders(sequelize)
  await createTableOrderItems(sequelize)
}

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('order_items')
  await sequelize.getQueryInterface().dropTable('orders')
  await sequelize.getQueryInterface().dropTable('transactions')
  await sequelize.getQueryInterface().dropTable('invoice_items')
  await sequelize.getQueryInterface().dropTable('invoices')
  await sequelize.getQueryInterface().dropTable('products')
  await sequelize.getQueryInterface().dropTable('clients')
}

async function createTableClients(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('clients', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  })
}

async function createTableProducts(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('products', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    sales_price: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  })
}

async function createTableInvoices(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('invoices', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  })
}

async function createTableInvoiceItems(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('invoice_items', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  })
}

async function createTableTransactions(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('transactions', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  })
}

async function createTableOrders(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('orders', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  })
}

async function createTableOrderItems(sequelize: Sequelize) {
  await sequelize.getQueryInterface().createTable('order_items', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  })
}
