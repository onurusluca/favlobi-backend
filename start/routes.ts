import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import * as AuthControllers from '#controllers/auth/index'
import * as AuthProfilesControllers from '#controllers/auth/profiles/index'

// Basic routes
/* router.get('/', async () => {
  return {
    hello: '',
  }
}) */

router.get('/health', async () => {
  return {
    status: 'ok',
  }
})

router
  .group(() => {
    // Public auth routes
    router.post('/register', [AuthControllers.RegisterController, 'handle'])
    router.post('/login', [AuthControllers.LoginController, 'handle'])
    router.get('/verify-email/:token', [AuthControllers.VerifyEmailController, 'handle'])

    // Password reset routes (doesn't require authentication)
    router.post('/forgot-password', [AuthControllers.ForgotPasswordController, 'handle'])
    router.get('/reset-password/:token', [AuthControllers.ResetPasswordController, 'show'])
    router.post('/reset-password', [AuthControllers.ResetPasswordController, 'update'])

    // Protected user routes requiring authentication
    router
      .group(() => {
        router.post('/logout', [AuthControllers.LogoutController, 'handle'])

        // Base user authentication routes
        router.get('/me', [AuthControllers.MeController, 'handle'])
        router.patch('/user', [AuthControllers.UserController, 'update']) // Base user data only

        // Customer-specific routes
        router.patch('/customer-profile', [
          AuthProfilesControllers.CustomerProfileController,
          'update',
        ])

        // Vendor-specific routes
        router.patch('/vendor-profile', [AuthProfilesControllers.VendorProfileController, 'update'])
      })
      .use(middleware.auth())
  })
  .prefix('/auth')
