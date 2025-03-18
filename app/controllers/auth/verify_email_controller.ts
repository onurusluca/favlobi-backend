import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailVerificationService from '#services/email_verification_service'

export default class VerifyEmailController {
  async handle({ request, response }: HttpContext) {
    const token = request.param('token')

    try {
      // Verify the token and get the associated user
      const userId = await EmailVerificationService.verifyToken(token)
      const user = await User.findOrFail(userId)

      // Update verification status
      user.email_verified = true
      user.is_verified = true
      await user.save()

      return response.ok({
        message: 'Email verified successfully',
        emailVerified: true,
        isVerified: true,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Email verification failed',
        error: error.message,
      })
    }
  }
}
