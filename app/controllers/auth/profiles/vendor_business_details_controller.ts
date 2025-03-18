import type { HttpContext } from '@adonisjs/core/http'
import VendorBusinessDetail from '#models/profiles/vendor_business_details'
import VendorProfile from '#models/profiles/vendor_profile'
import { businessDetailsValidator } from '#validators/profiles'
export default class BusinessDetailsController {
  /**
   * Get business details for a vendor
   */
  async get({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    try {
      // Find the vendor profile first to ensure they exist and are authorized
      const vendorProfile = await VendorProfile.findBy('user_id', auth.user.id)

      if (!vendorProfile) {
        return response.notFound({ message: 'Vendor profile not found' })
      }

      const businessDetails = await VendorBusinessDetail.findBy(
        'vendor_profile_id',
        vendorProfile.id
      )

      if (!businessDetails) {
        return response.notFound({ message: 'Business details not found' })
      }

      return response.ok(businessDetails)
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        message: 'Failed to get business details',
        error: (error as Error).message,
      })
    }
  }

  /**
   * Create or update business details for a vendor
   */
  async updateOrCreate({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    try {
      // Find the vendor profile first
      const vendorProfile = await VendorProfile.findBy('user_id', auth.user.id)

      if (!vendorProfile) {
        return response.notFound({ message: 'Vendor profile not found' })
      }

      const data = await request.validateUsing(businessDetailsValidator)
      let businessDetails = await VendorBusinessDetail.findBy('vendor_profile_id', vendorProfile.id)

      if (!businessDetails) {
        // Create new business details
        businessDetails = new VendorBusinessDetail()
        businessDetails.vendor_profile_id = vendorProfile.id
      }

      // Update business details properties
      businessDetails.merge(data as Partial<VendorBusinessDetail>)
      await businessDetails.save()

      return response.ok({ businessDetails, message: 'Business details updated successfully' })
    } catch (error) {
      console.error(error)
      return response.badRequest({
        message: 'Failed to update business details',
        error: (error as Error).message,
      })
    }
  }
}
