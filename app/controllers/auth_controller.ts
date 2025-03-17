import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginAuthValidator, registerAuthValidator } from '#validators/auth'
import { UserStatus } from '#models/enum'

export default class AuthController {
  // Register a new user
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerAuthValidator)

    const user = await User.findBy('email', data.email)

    if (user) {
      return response.conflict({ message: 'Email already in use' })
    }

    try {
      const newUser = await User.create(data)

      const token = await User.accessTokens.create(newUser)

      return response.created({
        user: {
          firstName: newUser.firstName,
          lastname: newUser.lastName,
          username: newUser.userName,
          status: UserStatus.ACTIVE, // Default status
        },
        token: token.value!.release(),
      })
    } catch (error) {
      return response.badRequest({ message: 'Registration failed', error: error.message })
    }
  }

  // Log in an existing user
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginAuthValidator)

    try {
      // Verify user credentials
      const user = await User.verifyCredentials(email, password)

      user.save()

      const token = await User.accessTokens.create(user)

      return response.ok({
        user: {
          firstName: user.firstName,
          lastname: user.lastName,
          username: user.userName,
          status: user.status,
        },
        token: token.value!.release(),
      })
    } catch (error) {
      return response.unauthorized({ message: 'Invalid credentials', error: error.message })
    }
  }

  // Log out the authenticated user
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: 'Logout successful' })
  }

  // Get user data
  async me({ auth }: HttpContext) {
    return {
      user: {
        firstName: auth.user?.firstName,
        lastname: auth.user?.lastName,
        username: auth.user?.userName,
        status: auth.user?.status,
      },
    }
  }
}
