import type { HttpContext } from '@adonisjs/core/http'

export default class MeController {
  async handle({ auth, response }: HttpContext) {
    // Check if user is authenticated
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    return {
      user: {
        id: auth.user.id,
        email: auth.user.email,
        firstName: auth.user.first_name,
        lastName: auth.user.last_name,
        userName: auth.user.user_name,
        phoneNumber: auth.user.phone_number,
        avatarUrl: auth.user.avatar_url,
        isVerified: auth.user.is_verified,
        emailVerified: auth.user.email_verified,
        accountStatus: auth.user.account_status,
        addresses: auth.user.addresses,
        preferences: auth.user.preferences,
        createdAt: auth.user.created_at,
        lastLoginAt: auth.user.last_login_at,
      },
    }
  }
}
