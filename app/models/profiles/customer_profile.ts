import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo as BelongsToType } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { AddressRecord } from '#types/address'

export default class CustomerProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  // User fields
  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

  @column()
  declare user_name: string | null

  @column()
  declare phone_number: string | null

  @column()
  declare avatar_url: string | null

  @column()
  declare locale: string

  @column()
  declare account_status: string

  // E-commerce fields
  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare addresses: AddressRecord[] | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare preferences: {
    newsletter: boolean
  } | null

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare wishlist: number[] // Array of product IDs

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare cart: object[] // Shopping cart items

  // System fields
  @column.dateTime()
  declare last_purchase_date: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsToType<typeof User>
}
