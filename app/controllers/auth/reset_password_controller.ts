import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { resetPasswordValidator } from '#validators/auth'
import PasswordResetService from '#services/password_reset_service'
import hash from '@adonisjs/core/services/hash'

export default class ResetPasswordController {
  async show({ request, view }: HttpContext) {
    const token = request.param('token')

    // Render reset password form
    return view.render('auth/reset_password', { token })
  }

  async update({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)

    try {
      // Verify the token and get the associated user
      const userId = await PasswordResetService.verifyToken(token)
      const user = await User.findOrFail(userId)

      // Update password
      user.password = await hash.make(password)
      await user.save()

      return response.ok({
        message: 'Password has been reset successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Password reset failed',
        error: error.message,
      })
    }
  }
}
