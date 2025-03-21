// app/mails/verification_email.ts
import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import env from '#start/env'
import i18nManager from '@adonisjs/i18n/services/main'

export default class VerificationEmail extends BaseMail {
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

  // Default subject (will be overridden in prepare method)
  subject = 'Hesabınızı doğrulayın'

  prepare() {
    // Get user's locale or default to 'tr'
    const locale = this.user.locale || 'tr'
    const i18n = i18nManager.locale(locale)

    // Set recipient
    this.message.to(this.user.email)

    // Try to get translated subject or use default
    try {
      // Use fallback directly instead of using t() with a second parameter
      const translatedSubject = i18n.t('verification_email.emailSubject')
      if (translatedSubject && !translatedSubject.includes('translation missing')) {
        this.subject = translatedSubject
      }
    } catch (error) {
      console.error('Translation error (using default subject):', error)
    }

    // Create verification URL
    const verificationUrl = `${env.get('APP_URL')}/verify-email/${this.token}`

    // Set email content
    this.message.htmlView('emails/verification_email', {
      i18n,
      user: this.user,
      verificationUrl,
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
