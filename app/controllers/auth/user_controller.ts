import type { HttpContext } from '@adonisjs/core/http'
import type { Response } from '@adonisjs/core/http'
import { userUpdateValidator } from '#validators/auth'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { UserRole } from '#types/enums'

export default class UserController {
  async show({ auth, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const user = auth.user

    // Load the appropriate profile based on role
    if (user.role === UserRole.CUSTOMER) {
      await user.load('customerProfile')
    } else if (user.role === UserRole.VENDOR) {
      await user.load('vendorProfile')
    }

    return this.formatUserResponse(user, response)
  }

  async update({ auth, request, response }: HttpContext) {
    if (!auth.user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    // Validate incoming data
    const data = await request.validateUsing(userUpdateValidator)
    const user = auth.user as User

    try {
      // Handle password change
      if (data.password && data.currentPassword) {
        const isValidPassword = await hash.verify(user.password, data.currentPassword)
        if (!isValidPassword) {
          return response.badRequest({
            message: 'Current password is incorrect',
            field: 'currentPassword',
          })
        }
        user.password = await hash.make(data.password)
      } else if (data.password && !data.currentPassword) {
        return response.badRequest({
          message: 'Current password is required to set a new password',
          field: 'currentPassword',
        })
      }

      // Handle base user fields only (email or other auth-related fields if needed)
      if (data.email) {
        user.email = data.email
        user.email_verified = false // Require new verification if email changes
      }

      // Save changes
      await user.save()

      // Reload the appropriate profile
      if (user.role === UserRole.CUSTOMER) {
        await user.load('customerProfile')
      } else if (user.role === UserRole.VENDOR) {
        await user.load('vendorProfile')
      }

      return this.formatUserResponse(user, response, 'User updated successfully')
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update user',
        error: (error as Error).message,
      })
    }
  }

  private formatUserResponse(user: User, response: Response, message?: string) {
    const responseData: {
      user: Record<string, any>
      message?: string
    } = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
      },
    }

    if (message) {
      responseData.message = message
    }

    return response.ok(responseData)
  }
}
