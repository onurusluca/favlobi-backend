import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne as HasOneType } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { UserRole } from '#types/enums'
import CustomerProfile from '#models/profiles/customer_profile'
import VendorProfile from '#models/profiles/vendor_profile'

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

  // System fields
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

  @hasOne(() => CustomerProfile)
  declare customerProfile: HasOneType<typeof CustomerProfile>

  @hasOne(() => VendorProfile, { foreignKey: 'user_id' })
  declare vendorProfile: HasOne<typeof VendorProfile>
}
