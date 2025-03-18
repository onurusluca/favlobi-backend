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

  // The from address used to send emails
  from = {
    address: env.get('MAIL_FROM_ADDRESS', 'info@favlobi.com'),
    name: env.get('MAIL_FROM_NAME', 'Favlobi'),
  }

  // Configure email subject
  subject = 'Hesabınızı doğrulayın'

  // Configure email and prepare it for sending
  prepare() {
    // Get user's locale or default to 'tr'
    const locale = this.user.locale || 'tr'

    // Create an i18n instance for the user's locale
    const i18n = i18nManager.locale(locale)

    // Set recipient
    this.message.to(this.user.email)

    // Set subject based on locale
    this.subject = i18n.t('verification.emailSubject')

    // Create verification URL
    const verificationUrl = `${env.get('APP_URL')}/verify-email/${this.token}`

    // Set email content
    this.message.htmlView('emails/verification_email', {
      i18n, // Pass the i18n instance to the template
      user: this.user,
      verificationUrl,
    })
  }
}
