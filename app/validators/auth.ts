import vine from '@vinejs/vine'

const password = vine.string().minLength(8)

export const registerAuthValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim(),
    last_name: vine.string().trim(),
    user_name: vine.string().trim(),
    email: vine.string().trim().email(),
    password,
    role: vine.enum(['user', 'vendor', 'admin', 'partner']),
    phone_number: vine.string().trim().optional(),
  })
)

export const loginAuthValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password,
  })
)

/**
 * Validator for updating base user authentication information
 */
export const userUpdateValidator = vine.compile(
  vine.object({
    // Only email and password fields remain in the base User model
    email: vine.string().email().optional(),
    currentPassword: vine.string().optional(),
    password: vine.string().minLength(8).optional(),
  })
)

/**
 * Validator for updating customer profile information
 */
export const customerProfileUpdateValidator = vine.compile(
  vine.object({
    // Basic profile fields
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    userName: vine.string().optional(),
    phoneNumber: vine.string().optional(),
    avatarUrl: vine.string().optional(),
    locale: vine.string().optional(),
    accountStatus: vine.string().optional(),

    // Complex objects
    preferences: vine
      .object({
        newsletter: vine.boolean().optional(),
      })
      .optional(),

    // Addresses
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

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(8),
    passwordConfirmation: vine.string().confirmed({ confirmationField: 'password' }),
  })
)

/**
 * Validator for updating vendor profile information
 */
export const vendorProfileUpdateValidator = vine.compile(
  vine.object({
    // Vendor-specific fields
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

/**
 * Validator for updating admin profile information
 */
export const adminProfileUpdateValidator = vine.compile(
  vine.object({
    // Admin-specific fields
    department: vine.string().optional(),
    position: vine.string().optional(),
    accessLevel: vine.string().optional(),
    permissions: vine.array(vine.string()).optional(),
  })
)
