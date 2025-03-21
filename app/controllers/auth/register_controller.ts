import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerAuthValidator } from '#validators/auth'
import { UserStatus } from '#types/enums'
import EmailVerificationService from '#services/email_verification_service'

export default class RegisterController {
  async handle({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerAuthValidator)
    const user = await User.findBy('email', data.email)

    if (user) {
      return response.conflict({ message: 'Email already in use' })
    }

    try {
      // Set default values for new user
      const userData = {
        ...data,
        is_verified: false,
        email_verified: false,
        account_status: UserStatus.ACTIVE,
        addresses: [],
        preferences: {
          newsletter: true,
        },
        locale: 'tr', // NOTE: Default locale for now
      }

      const newUser = await User.create(userData)
      const token = await User.accessTokens.create(newUser)

      // Send verification email
      await EmailVerificationService.sendVerificationEmail(newUser)

      return response.created({
        user: {
          id: newUser.id,
          email: newUser.email,
          emailVerified: newUser.email_verified,
          createdAt: newUser.created_at,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      return response.badRequest({
        message: 'Registration failed',
        error: error.message,
      })
    }
  }
}
