import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo as BelongsToType } from '@adonisjs/lucid/types/relations'

import User from '#models/user'

export default class VendorProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare user_id: number

  @column()
  declare store_name: string

  @column()
  declare store_slug: string

  @column()
  declare business_email: string

  @column()
  declare business_phone: string

  @column()
  declare tax_id: string | null

  @column()
  declare company_registration: string | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare business_address: object

  @column()
  declare commission_rate: number

  @column()
  declare payout_method: string

  @column()
  declare store_description: string | null

  @column()
  declare store_logo: string | null

  @column()
  declare store_banner: string | null

  @column()
  declare verification_status: string

  @column()
  declare rating: number | null

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsToType<typeof User>

  // Add relationships to products, orders, etc.
  // @hasMany(() => Product)
  // declare products: HasMany<typeof Product>
}
