import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rate_limits'

  async up() {
    const hasTable = await this.schema.hasTable(this.tableName)

    if (!hasTable) {
      // Create table only if it doesn't exist
      this.schema.createTable(this.tableName, (table) => {
        table.string('key', 255).notNullable().primary()
        table.integer('points', 9).notNullable().defaultTo(0)
        table.bigint('expire').unsigned()
      })
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
