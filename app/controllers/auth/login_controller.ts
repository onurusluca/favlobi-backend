import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginAuthValidator } from '#validators/auth'
import { UserStatus } from '#models/enum'
import { DateTime } from 'luxon'

export default class LoginController {
  async handle({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginAuthValidator)

    try {
      // Verify user credentials
      const user = await User.verifyCredentials(email, password)

      // Check if account is allowed to login
      if (
        user.account_status === UserStatus.SUSPENDED ||
        user.account_status === UserStatus.BANNED
      ) {
        return response.forbidden({
          message: `Your account is ${user.account_status}. Please contact support.`,
        })
      }

      // Update last login information
      user.last_login_at = DateTime.now()
      user.last_login_ip = request.ip()
      await user.save()

      const token = await User.accessTokens.create(user)

      return response.ok({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userName: user.user_name,
          phoneNumber: user.phone_number,
          accountStatus: user.account_status,
          isVerified: user.is_verified,
          emailVerified: user.email_verified,
          preferences: user.preferences,
          lastLogin: user.last_login_at,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Invalid credentials',
        error: error.message,
      })
    }
  }
}
