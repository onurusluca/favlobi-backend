import vine from '@vinejs/vine'

export const customerProfileUpdateValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    userName: vine.string().optional(),
    phoneNumber: vine.string().optional(),
    avatarUrl: vine.string().optional(),
    locale: vine.string().optional(),
    accountStatus: vine.string().optional(),
    preferences: vine
      .object({
        newsletter: vine.boolean().optional(),
      })
      .optional(),
    addresses: vine
      .array(
        vine.object({
          // Delivery address fields
          provinceId: vine.number().optional(),
          provinceLabel: vine.string().optional(),
          districtId: vine.number().optional(),
          districtLabel: vine.string().optional(),
          neighborhoodId: vine.number().optional(),
          neighborhoodLabel: vine.string().optional(),
          postalCode: vine.string().optional(),
          streetAddress: vine.string().optional(),

          // Billing info
          billingType: vine.string().in(['personal', 'corporate']).optional(),
          companyName: vine.string().optional(),
          taxNumber: vine.string().optional(),
          taxOffice: vine.string().optional(),

          // Separate billing address flag
          useSeparateAddress: vine.boolean().optional(),

          // Billing address fields
          billingProvinceId: vine.number().optional(),
          billingProvinceLabel: vine.string().optional(),
          billingDistrictId: vine.number().optional(),
          billingDistrictLabel: vine.string().optional(),
          billingNeighborhoodId: vine.number().optional(),
          billingNeighborhoodLabel: vine.string().optional(),
          billingPostalCode: vine.string().optional(),
          billingStreetAddress: vine.string().optional(),
        })
      )
      .optional(),

    // Customer-specific fields
    wishlist: vine.array(vine.number()).optional(),
    cart: vine.array(vine.any()).optional(),
  })
)

export const vendorProfileUpdateValidator = vine.compile(
  vine.object({
    storeName: vine.string().optional(),
    storeSlug: vine.string().optional(),
    businessEmail: vine.string().email().optional(),
    businessPhone: vine.string().optional(),
    taxId: vine.string().optional(),
    companyRegistration: vine.string().optional(),
    businessAddress: vine.object({}).optional(),
    commissionRate: vine.number().optional(),
    payoutMethod: vine.string().optional(),
    storeDescription: vine.string().optional(),
    storeLogo: vine.string().optional(),
    storeBanner: vine.string().optional(),
    verificationStatus: vine.string().optional(),
  })
)

export const businessDetailsValidator = vine.compile(
  vine.object({
    company_name: vine.string().trim().minLength(3).maxLength(255).optional(),
    company_type: vine.string().trim().optional(),
    first_name: vine.string().trim().optional(),
    last_name: vine.string().trim().optional(),
    phone_number: vine.string().trim().optional(),
    bank_iban: vine.string().trim().optional(),
    tax_no: vine.string().trim().optional(),
    tc_identity_no: vine.string().trim().optional(),
    kep_no: vine.string().trim().optional(),
    mersis_no: vine.string().trim().optional(),
    tax_office: vine.string().trim().optional(),
    commission_rate: vine.number().optional(),
    invoice_address: vine.any().optional(),
    shipping_address: vine.any().optional(),
    cargo_address_id: vine.string().trim().optional(),
    tax_plate_url: vine.string().trim().optional(),
    signature_circular_url: vine.string().trim().optional(),
    trade_registry_gazette_url: vine.string().trim().optional(),
    trade_activity_certificate_url: vine.string().trim().optional(),
    vendor_agreement_url: vine.string().trim().optional(),
    merchant_key: vine.string().trim().optional(),
    intended_categories: vine.any().optional(),
  })
)
