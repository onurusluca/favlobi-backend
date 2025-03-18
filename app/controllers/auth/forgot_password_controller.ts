import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { forgotPasswordValidator } from '#validators/auth'
import PasswordResetService from '#services/password_reset_service'

export default class ForgotPasswordController {
  async handle({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)

    try {
      // Find the user by email
      const user = await User.findBy('email', email)

      // If user exists, send reset password email
      if (user) {
        await PasswordResetService.sendResetEmail(user)
      }

      // Always return success to prevent email enumeration attacks
      return response.ok({
        message: 'Password reset instructions have been sent if the email exists',
      })
    } catch (error) {
      console.error(error)
      // Still return success to prevent enumeration
      return response.ok({
        message: 'Password reset instructions have been sent if the email exists',
      })
    }
  }
}
