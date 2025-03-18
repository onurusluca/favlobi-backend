// app/mails/reset_password_email.ts
import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import env from '#start/env'
import i18nManager from '@adonisjs/i18n/services/main'

export default class ResetPasswordEmail extends BaseMail {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  // Set static properties
  from = {
    address: env.get('MAIL_FROM_ADDRESS', 'info@favlobi.com'),
    name: env.get('MAIL_FROM_NAME', 'Favlobi'),
  }

  // Default subject
  subject = 'Şifre Sıfırlama'

  prepare() {
    // Get user's locale or default to 'tr'
    const locale = this.user.locale || 'tr'
    const i18n = i18nManager.locale(locale)

    // Set recipient
    this.message.to(this.user.email)

    // Try to get translated subject or use default
    try {
      const translatedSubject = i18n.t('reset_password.emailSubject')
      if (translatedSubject && !translatedSubject.includes('translation missing')) {
        this.subject = translatedSubject
      }
    } catch (error) {
      console.error('Translation error (using default subject):', error)
    }

    // Create reset URL
    const resetUrl = `${env.get('APP_URL')}/reset-password/${this.token}`

    // Set email content
    this.message.htmlView('emails/reset_password_email', {
      i18n,
      user: this.user,
      resetUrl,
      appLogo: env.get(
        'APP_LOGO_URL',
        'https://favlobi.b-cdn.net/site-assets/favlobi-logo-black.png?class=thumbnail'
      ),
      appName: env.get('APP_NAME', 'Favlobi'),
      supportEmail: env.get('SUPPORT_EMAIL', 'info@favlobi.com'),
      websiteUrl: env.get('APP_URL'),
      websiteDomain: env.get('WEBSITE_DOMAIN', 'favlobi.com'),
    })
  }
}
