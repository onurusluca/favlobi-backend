import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class VendorProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare store_name: string

  @column()
  declare store_description: string

  // More vendor-specific fields

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
