import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NakamaService } from './nakama.service';
import { MinIOService } from './minio.service';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, NakamaService, MinIOService],
})
export class UserModule {}
