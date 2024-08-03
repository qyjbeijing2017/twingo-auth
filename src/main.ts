import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({
  envFilePath: [`.env.local`, `.env.${process.env.NODE_ENV}`, '.env'],
  isGlobal: true,
});
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { format, loggers, transports } from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          filename: `./logs/twingo-auth-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.simple(),
        }),
      ],
    }),
  });
  const config = new DocumentBuilder()
    .setTitle('Twingo Auth API')
    .setDescription('The Twingo Auth API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
