import type { HttpContext } from '@adonisjs/core/http'
import { addressesValidator } from '#validators/auth'

export default class UpdateAddressesController {
  async handle({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // Validate addresses data
    const addresses = await request.validateUsing(addressesValidator)

    try {
      const user = auth.user
      user.addresses = addresses
      await user.save()

      return response.ok({
        message: 'Addresses updated successfully',
        addresses: user.addresses,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update addresses',
        error: error.message,
      })
    }
  }
}
