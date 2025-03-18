import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Check if table exists first
    const hasTable = await this.schema.hasTable(this.tableName)

    if (!hasTable) {
      // Create table only if it doesn't exist
      this.schema.createTable(this.tableName, (table) => {
        // Base fields
        table.increments('id').primary()
        table.string('email', 254).notNullable().unique()
        table.string('password').notNullable()

        // Profile fields
        table.string('first_name').nullable()
        table.string('last_name').nullable()
        table.string('user_name').nullable()
        table.string('phone_number').nullable()
        table.string('avatar_url').nullable()
        table.boolean('is_verified').defaultTo(false)
        table.jsonb('addresses').defaultTo('[]')

        // Role field
        table.string('role').notNullable()

        // E-commerce fields
        table.jsonb('preferences').defaultTo('{"newsletter": true}')

        // System fields
        table.string('locale').defaultTo('en')
        table.string('account_status').defaultTo('active')
        table.boolean('email_verified').defaultTo(false)
        table.timestamp('created_at', { useTz: true }).notNullable()
        table.timestamp('updated_at', { useTz: true }).nullable()
        table.timestamp('last_login_at', { useTz: true }).nullable()
        table.string('last_login_ip').nullable()
      })
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
