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
