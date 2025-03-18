import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import * as AuthControllers from '#controllers/auth/index'

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

    // Protected auth routes requiring authentication
    router
      .group(() => {
        router.post('/logout', [AuthControllers.LogoutController, 'handle'])
        router.get('/me', [AuthControllers.MeController, 'handle'])
        router.put('/preferences', [AuthControllers.UpdatePreferencesController, 'handle'])
        router.put('/addresses', [AuthControllers.UpdateAddressesController, 'handle'])
      })
      .use(middleware.auth())
  })
  .prefix('/auth')
