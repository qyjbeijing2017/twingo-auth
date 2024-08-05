import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.EMAIL}:${process.env.EMAIL_PASSWORD}@${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`,
      defaults: {
        from: `"Twingo Verify" <${process.env.EMAIL}>`,
      },
      template: {
        dir: process.env.TEMPLATE_PATH,
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
