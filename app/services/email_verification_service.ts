import type User from '#models/user'
import { randomBytes, createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import EmailVerificationToken from '#models/system/email_verification_token'
import mail from '@adonisjs/mail/services/main'
import VerificationEmail from '#mails/verification_email'

export default class EmailVerificationService {
  static async generateToken(user: User): Promise<string> {
    const randomToken = randomBytes(16).toString('hex')
    const hashedToken = createHash('sha256').update(randomToken).digest('hex')

    await EmailVerificationToken.updateOrCreate(
      { user_id: user.id },
      {
        token: hashedToken,
        expires_at: DateTime.now().plus({ hours: 24 }),
      }
    )

    return randomToken
  }

  static async verifyToken(token: string): Promise<number> {
    // Hash the provided token
    const hashedToken = createHash('sha256').update(token).digest('hex')
    // Look up token in database
    const verificationToken = await EmailVerificationToken.query()
      .where('token', hashedToken)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()
    if (!verificationToken) {
      throw new Error('Invalid or expired verification token')
    }
    // Delete the token after use
    await verificationToken.delete()
    return verificationToken.user_id
  }

  static async sendVerificationEmail(user: User): Promise<void> {
    const token = await this.generateToken(user)

    await mail.send(new VerificationEmail(user, token))
  }

  // Resend a verification email to a user
  static async resendVerificationEmail(user: User): Promise<void> {
    // Check if user is already verified
    if (user.email_verified) {
      throw new Error('Email is already verified')
    }
    // Send a new verification email
    await this.sendVerificationEmail(user)
  }
}
