import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import { AddressRecord } from '#types/address'
import { UserRole } from '#models/enum'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  // Base fields
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  // Role field
  @column()
  declare role: string // Use values from UserRole enum

  // Common profile fields
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
  declare is_verified: boolean

  // Customer-specific fields (null for other roles)
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

  // System fields
  @column()
  declare locale: string

  @column()
  declare account_status: string

  @column()
  declare email_verified: boolean

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @column.dateTime()
  declare last_login_at: DateTime | null

  @column()
  declare last_login_ip: string | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Helper methods to check roles
  isCustomer() {
    return this.role === UserRole.USER
  }

  isVendor() {
    return this.role === UserRole.VENDOR
  }

  isAdmin() {
    return this.role === UserRole.ADMIN
  }
}
