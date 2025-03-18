import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .unique()

      // Store information
      table.string('store_name').notNullable()
      table.text('store_description').nullable()
      table.string('operational_status').defaultTo('pending')
      table.text('rejection_reason').nullable()
      table.boolean('onboarding_completed').defaultTo(false)
      table.boolean('show_onboarding').defaultTo(true)

      // Visual assets
      table.string('logo_url').nullable()
      table.string('cover_image_url').nullable()

      // Performance metrics
      table.decimal('rating_average', 3, 1).defaultTo(0)
      table.integer('products_sold').defaultTo(0)
      table.string('special').nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index('operational_status')
      table.index('rating_average')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
