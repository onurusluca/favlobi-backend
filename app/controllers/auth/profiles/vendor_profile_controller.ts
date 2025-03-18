import type { HttpContext } from '@adonisjs/core/http'
import VendorProfile from '#models/profiles/vendor_profile'
import { vendorProfileUpdateValidator } from '#validators/profiles'

export default class VendorProfileController {
  async get({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    try {
      // Fetch only specific fields
      const vendorProfile = await VendorProfile.query()
        .select(
          'id',
          'store_name',
          'store_slug',
          'business_email',
          'business_phone',
          'store_logo',
          'store_banner',
          'store_description',
          'verification_status',
          'rating'
        )
        .where('user_id', auth.user.id)
        .first()

      if (!vendorProfile) {
        return response.notFound({ message: 'Vendor profile not found' })
      }
      return response.ok(vendorProfile)
    } catch (error) {
      console.error(error) // Log the error on the server-side
      return response.internalServerError({ message: 'Failed to get profile' })
    }
  }
  /**
   * Update profile (Customer or Vendor)
   */
  async update({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    try {
      // Vendor Profile Update
      let profile = await VendorProfile.findBy('user_id', auth.user.id)

      if (!profile) {
        profile = new VendorProfile()
        profile.user_id = auth.user.id
      }
      const data = await request.validateUsing(vendorProfileUpdateValidator)

      profile.merge(data as Partial<VendorProfile>)

      await profile.save()

      return response.ok({ profile, message: 'Vendor profile updated successfully' })
    } catch (error) {
      console.error(error)
      return response.badRequest({
        message: 'Failed to update profile',
        error: (error as Error).message,
      })
    }
  }
}
