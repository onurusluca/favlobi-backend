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

export const preferencesValidator = vine.compile(
  vine.object({
    newsletter: vine.boolean(),
    // Add other preference fields as needed
  })
)

export const addressesValidator = vine.compile(
  vine.array(
    vine.object({
      deliveryAddress: vine.object({
        province: vine.object({
          label: vine.string(),
          value: vine.number(),
        }),
        district: vine.object({
          label: vine.string(),
          value: vine.number(),
        }),
        neighborhood: vine.object({
          label: vine.string(),
          value: vine.number(),
        }),
        postalCode: vine.string(),
        streetAddress: vine.string(),
      }),
      billingInfo: vine.object({
        type: vine.string(),
        companyName: vine.string().optional(),
        taxNumber: vine.string().optional(),
        taxOffice: vine.string().optional(),
      }),
      useSeparateAddress: vine.boolean(),
      billingAddress: vine
        .object({
          province: vine.object({
            label: vine.string(),
            value: vine.number(),
          }),
          district: vine.object({
            label: vine.string(),
            value: vine.number(),
          }),
          neighborhood: vine.object({
            label: vine.string(),
            value: vine.number(),
          }),
          postalCode: vine.string(),
          streetAddress: vine.string(),
        })
        .optional(),
    })
  )
)
