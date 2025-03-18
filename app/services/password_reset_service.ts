import type User from '#models/user'
import { randomBytes, createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import PasswordResetToken from '#models/system/password_reset_token'
import mail from '@adonisjs/mail/services/main'
import ResetPasswordEmail from '#mails/reset_password_email'

export default class PasswordResetService {
  static async generateToken(user: User): Promise<string> {
    const randomToken = randomBytes(16).toString('hex')
    const hashedToken = createHash('sha256').update(randomToken).digest('hex')

    // Use a single query with upsert instead of delete+create
    await PasswordResetToken.updateOrCreate(
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
    const resetToken = await PasswordResetToken.query()
      .where('token', hashedToken)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!resetToken) {
      throw new Error('Invalid or expired reset token')
    }

    // Delete the token after use
    await resetToken.delete()

    return resetToken.user_id
  }

  static async sendResetEmail(user: User): Promise<void> {
    const token = await this.generateToken(user)

    try {
      await mail.send(new ResetPasswordEmail(user, token))
    } catch (error) {
      console.error('Email sending error:', error)
      throw new Error('Failed to send password reset email')
    }
  }
}
