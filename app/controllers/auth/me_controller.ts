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
        emailVerified: auth.user.email_verified,
        accountStatus: auth.user.account_status,
        createdAt: auth.user.created_at,
        lastLoginAt: auth.user.last_login_at,
      },
    }
  }
}
