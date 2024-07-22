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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  readonly authExpiryTime = parseInt(process.env.AUTH_EXPIRY_TIME ?? '60');
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly codeGateway: CodeGateway,
  ) {}

  async verifyCode(phone: string): Promise<void> {
    let auth = await this.authRepository.findOne({ where: { phone } });
    const now = new Date();
    if (
      auth &&
      now.getTime() - auth.updatedAt.getTime() < this.authExpiryTime * 1000
    ) {
      throw new ForbiddenException(
        `Code is already sent, please wait ${((now.getTime() - auth.updatedAt.getTime()) / 1000).toFixed(0)} seconds`,
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
}
