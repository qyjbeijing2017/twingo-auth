import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeGateway } from './code.gateway';
import { randomString } from 'src/utils/random';
import { NakamaService } from './nakama.service';
import { MinIOService } from './minio.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  readonly authExpiryTime = parseInt(process.env.AUTH_EXPIRY_TIME ?? '60');
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly codeGateway: CodeGateway,
    private readonly nakama: NakamaService,
    private readonly minio: MinIOService,
  ) {}

  async verifyCode(phone: string): Promise<void> {
    let auth = await this.authRepository.findOne({ where: { phone } });
    const now = new Date();

    const waitTime =
      this.authExpiryTime - (now.getTime() - auth.updatedAt.getTime()) / 1000;
    if (auth && waitTime > 0) {
      throw new ForbiddenException(
        `Code is already sent, please wait ${waitTime.toFixed(0)} seconds`,
      );
    }

    if (!auth) {
      auth = new Auth();
      auth.phone = phone;
      auth.uuid = phone + `-` + randomString(27);
    } else {
      if (!auth.uuid.startsWith(phone)) {
        auth.uuid = phone + `-` + randomString(27);
      }
    }
    auth.code = Math.floor(Math.random() * 10000).toString();
    auth.updatedAt = new Date();
    this.codeGateway.codeSent(auth.phone, auth.code);
    this.logger.log(`Code sent to ${auth.phone}: ${auth.code}`);
    await this.authRepository.save(auth);
  }

  async authorize(phone: string, code: string): Promise<{ id: string }> {
    const auth = await this.authRepository.findOne({ where: { phone, code } });
    if (!auth) {
      throw new NotFoundException('phone number is not found');
    }
    const now = new Date();
    if (
      !auth ||
      now.getTime() - auth.updatedAt.getTime() > this.authExpiryTime * 1000
    ) {
      throw new UnauthorizedException('Code is expired');
    }
    if (auth.code !== code) {
      throw new UnauthorizedException('Code is incorrect');
    }
    auth.code = null;
    await this.authRepository.save(auth);
    return { id: auth.uuid };
  }

  async avatar(token: string, file: Express.Multer.File) {
    if (!token.startsWith('Bearer ')) throw new UnauthorizedException();
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
    const session = await this.nakama.session(token);
    const type = file.filename.split('.').pop();
    const name = session.user_id + '.' + type;
    await this.minio.minio.putObject('profiles', name, file.buffer);
    this.nakama.client.rpc(session, 'rpcUpdateProfile', {
      profile_url: this.minio.entryPoint + '/profiles/' + name,
    });
  }
}
