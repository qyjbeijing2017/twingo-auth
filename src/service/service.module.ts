import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `stmps://${process.env.EMAIL}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}`,
      defaults: {
        from: `"Twingo Verify" <${process.env.EMAIL}>`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {
}
