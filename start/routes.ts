import router from '@adonisjs/core/services/router'
// import { middleware } from '#start/kernel'

// import ProductController from '#controllers/products_controller'

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

/* router
    .group(() => {
        router.post('register', [AuthController, 'register']).as('auth.register')
        router.post('login', [AuthController, 'login']).as('auth.login')
        router.delete('logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
        router.get('me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
    })
    .prefix('/auth')
    .as('auth') */
