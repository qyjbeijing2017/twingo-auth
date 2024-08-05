import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class ServiceService {
  constructor(private readonly mailerService: MailerService) {}

  async verifyEmail(to: string, username: string) {
    const code = randomInt(0, parseInt(process.env.EMAIL_CODE_MAX));
    try {
      await this.mailerService.sendMail({
        to,
        subject: process.env.EMAIL_SUBJECT.replace('{code}', code.toString()),
        template: __dirname + '/templates/email',
        context: {
          to,
          code,
          username,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return { code };
  }
}
