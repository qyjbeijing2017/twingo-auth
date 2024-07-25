import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { NakamaService } from './nakama.service';
import { MinIOService } from './minio.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  readonly authExpiryTime = parseInt(process.env.AUTH_EXPIRY_TIME ?? '60');
  constructor(
    private readonly nakama: NakamaService,
    private readonly minio: MinIOService,
  ) {}

  async avatar(token: string, file: Express.Multer.File) {
    if (!token.startsWith('Bearer ')) throw new UnauthorizedException();
    if (!file) throw new BadRequestException('file is required');
    const session = await this.nakama.session(token);
    const type = file.originalname.split('.').pop();
    const name = session.user_id + '.' + type;
    await this.minio.minio.putObject('avatars', name, file.buffer);
    this.nakama.client.updateAccount(session, {
      avatar_url: this.minio.entryPoint + '/avatars/' + name,
    });
  }

  async profile(token: string, file: Express.Multer.File) {
    if (!token.startsWith('Bearer ')) throw new UnauthorizedException();
    if (!file) throw new BadRequestException('file is required');
    const session = await this.nakama.session(token);
    const type = file.originalname.split('.').pop();
    const name = session.user_id + '.' + type;
    await this.minio.minio.putObject('profiles', name, file.buffer);
    try {
      await this.nakama.client.rpc(session, 'rpcUpdateProfile', {
        profile_url: this.minio.entryPoint + '/profiles/' + name,
      });
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(`nakamaError: ${e}`);
    }
  }
}
