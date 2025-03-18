import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'resend',

  from: {
    address: env.get('EMAIL_FROM_ADDRESS') as string,
    name: env.get('EMAIL_FROM_NAME') as string,
  },

  replyTo: {
    address: '',
    name: '',
  },

  mailers: {
    resend: transports.resend({
      key: env.get('RESEND_API_KEY'),
      baseUrl: 'https://api.resend.com',
    }),
  },
})

export default mailConfig
