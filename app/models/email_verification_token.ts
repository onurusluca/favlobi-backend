import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo as BelongsToType } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class EmailVerificationToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare token: string

  @column.dateTime()
  declare expires_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @belongsTo(() => User)
  declare user: BelongsToType<typeof User>
}
