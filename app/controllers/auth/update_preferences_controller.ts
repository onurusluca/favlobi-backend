import type { HttpContext } from '@adonisjs/core/http'
import { preferencesValidator } from '#validators/auth'

export default class UpdatePreferencesController {
  async handle({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // Validate preferences data
    const preferences = await request.validateUsing(preferencesValidator)

    try {
      const user = auth.user
      user.preferences = preferences
      await user.save()

      return response.ok({
        message: 'Preferences updated successfully',
        preferences: user.preferences,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update preferences',
        error: error.message,
      })
    }
  }
}
