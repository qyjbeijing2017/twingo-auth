import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class ServiceService {
  logger = new Logger(ServiceService.name);
  constructor(private readonly mailerService: MailerService) {}

  async verifyEmail(to: string, username: string) {
    const code = randomInt(0, parseInt(process.env.EMAIL_CODE_MAX));
    try {
      await this.mailerService.sendMail({
        to,
        subject: process.env.EMAIL_SUBJECT.replace('{code}', code.toString()),
        template: 'email',
        context: {
          to,
          code,
          username,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
    return { code };
  }
}
