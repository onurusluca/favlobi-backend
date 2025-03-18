import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_business_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('vendor_profile_id')
        .references('id')
        .inTable('vendor_profiles')
        .onDelete('CASCADE')
      table.string('company_name').notNullable()
      table.string('company_type').defaultTo('personal')
      table.string('first_name')
      table.string('last_name')
      table.string('phone_number')
      table.string('bank_iban')
      table.string('tax_no').nullable()
      table.string('tc_identity_no').nullable()
      table.string('kep_no').nullable()
      table.string('mersis_no').nullable()
      table.string('tax_office')
      table.decimal('commission_rate', 5, 2).defaultTo(0)
      table.json('invoice_address')
      table.json('shipping_address')
      table.uuid('cargo_address_id').nullable()

      // Document URLs
      table.string('tax_plate_url').nullable()
      table.string('signature_circular_url').nullable()
      table.string('trade_registry_gazette_url').nullable()
      table.string('trade_activity_certificate_url').nullable()
      table.string('vendor_agreement_url').nullable()

      // Integration details
      table.string('merchant_key').nullable()
      table.json('intended_categories').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Indexes
      table.index('company_type')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
