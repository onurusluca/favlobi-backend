import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import VendorProfile from '#models/profiles/vendor_profile'

export default class VendorBusinessDetail extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare vendor_profile_id: string

  @column()
  declare company_name: string

  @column()
  declare company_type: string

  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

  @column()
  declare phone_number: string | null

  @column()
  declare bank_iban: string | null

  @column()
  declare tax_no: string | null

  @column()
  declare tc_identity_no: string | null

  @column()
  declare kep_no: string | null

  @column()
  declare mersis_no: string | null

  @column()
  declare tax_office: string | null

  @column()
  declare commission_rate: number

  @column()
  declare invoice_address: any

  @column()
  declare shipping_address: any

  @column()
  declare cargo_address_id: string | null

  @column()
  declare tax_plate_url: string | null

  @column()
  declare signature_circular_url: string | null

  @column()
  declare trade_registry_gazette_url: string | null

  @column()
  declare trade_activity_certificate_url: string | null

  @column()
  declare vendor_agreement_url: string | null

  @column()
  declare merchant_key: string | null

  @column()
  declare intended_categories: any

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @belongsTo(() => VendorProfile)
  declare vendorProfile: BelongsTo<typeof VendorProfile>
}
