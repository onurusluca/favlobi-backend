import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customer_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()

      // Personal information
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('user_name').nullable()
      table.string('phone_number').nullable()
      table.string('avatar_url').nullable()

      // Preferences and settings
      table.string('locale').defaultTo('en')
      table.string('account_status').defaultTo('active')
      table.json('preferences').nullable()
      table.json('addresses').nullable()

      // Shopping data
      table.json('wishlist').nullable()
      table.json('cart').nullable()
      table.timestamp('last_purchase_date', { useTz: true }).nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
