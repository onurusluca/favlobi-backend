import type { HttpContext } from '@adonisjs/core/http'
import { customerProfileUpdateValidator } from '#validators/auth'
import CustomerProfile from '#models/profiles/customer_profile'
import { UserRole } from '#types/enums'
import { AddressRecord } from '#types/address'

export default class CustomerProfileController {
  /**
   * Update customer profile information
   */
  async update({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // Ensure user is a customer
    if (auth.user.role !== UserRole.USER) {
      return response.forbidden({ message: 'Access denied' })
    }

    // Find or create customer profile
    let profile = await CustomerProfile.findBy('user_id', auth.user.id)
    if (!profile) {
      profile = new CustomerProfile()
      profile.user_id = auth.user.id
    }

    // Validate incoming data
    const data = await request.validateUsing(customerProfileUpdateValidator)

    // Handle conditional validation for addresses
    if (data.addresses) {
      for (const addr of data.addresses) {
        // Validate corporate billing info
        if (addr.billingType === 'corporate' && (!addr.companyName || !addr.taxNumber)) {
          return response.badRequest({
            message: 'Company name and tax number are required for corporate billing',
          })
        }

        // Validate separate billing address
        if (addr.useSeparateAddress && (!addr.billingStreetAddress || !addr.billingProvinceId)) {
          return response.badRequest({
            message: 'Billing address is required when using separate address',
          })
        }
      }
    }

    try {
      // Handle profile-specific fields
      const fieldMapping = {
        firstName: 'first_name',
        lastName: 'last_name',
        userName: 'user_name',
        phoneNumber: 'phone_number',
        avatarUrl: 'avatar_url',
        locale: 'locale',
        accountStatus: 'account_status',
      }

      // Update regular fields
      for (const [clientField, dbField] of Object.entries(fieldMapping)) {
        if (clientField in data && data[clientField as keyof typeof data] !== undefined) {
          ;(profile as any)[dbField] = data[clientField as keyof typeof data]
        }
      }

      // Handle JSON fields
      if (data.preferences) {
        const currentPreferences = profile.preferences || ({} as { newsletter: boolean })
        profile.preferences = {
          newsletter: data.preferences.hasOwnProperty('newsletter')
            ? Boolean(data.preferences.newsletter)
            : currentPreferences.newsletter || false,
        }
      }

      if (data.addresses) {
        // Convert incoming addresses to match your specific AddressRecord type
        profile.addresses = data.addresses.map((addr) => {
          // Create a properly structured AddressRecord
          return {
            deliveryAddress: {
              province: { label: addr.provinceLabel || '', value: addr.provinceId || 0 },
              district: { label: addr.districtLabel || '', value: addr.districtId || 0 },
              neighborhood: {
                label: addr.neighborhoodLabel || '',
                value: addr.neighborhoodId || 0,
              },
              postalCode: addr.postalCode || '',
              streetAddress: addr.streetAddress || '',
            },
            billingInfo: {
              type: addr.billingType || 'personal',
              ...(addr.billingType === 'corporate'
                ? {
                    companyName: addr.companyName || '',
                    taxNumber: addr.taxNumber || '',
                    taxOffice: addr.taxOffice || '',
                  }
                : {}),
            },
            useSeparateAddress: Boolean(addr.useSeparateAddress),
            ...(addr.useSeparateAddress
              ? {
                  billingAddress: {
                    province: {
                      label: addr.billingProvinceLabel || '',
                      value: addr.billingProvinceId || 0,
                    },
                    district: {
                      label: addr.billingDistrictLabel || '',
                      value: addr.billingDistrictId || 0,
                    },
                    neighborhood: {
                      label: addr.billingNeighborhoodLabel || '',
                      value: addr.billingNeighborhoodId || 0,
                    },
                    postalCode: addr.billingPostalCode || '',
                    streetAddress: addr.billingStreetAddress || '',
                  },
                }
              : {}),
          } as AddressRecord
        })
      }

      // Update cart if provided
      if (data.cart !== undefined) {
        profile.cart = data.cart
      }

      // Update wishlist if provided
      if (data.wishlist !== undefined) {
        profile.wishlist = data.wishlist
      }

      // Save changes
      await profile.save()

      return response.ok({
        profile,
        message: 'Profile updated successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update profile',
        error: (error as Error).message,
      })
    }
  }
}
