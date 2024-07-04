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
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  readonly authExpiryTime = parseInt(process.env.AUTH_EXPIRY_TIME ?? '60');
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async verifyCode(phone: string): Promise<void> {
    let auth = await this.authRepository.findOne({ where: { phone } });
    const now = new Date();
    if (
      auth &&
      now.getTime() - auth.updatedAt.getTime() < this.authExpiryTime * 1000
    ) {
      throw new ForbiddenException('Code is already sent');
    }

    if (!auth) {
      auth = new Auth();
      auth.phone = phone;
      auth.uuid = v4();
    }
    auth.code = Math.floor(Math.random() * 10000).toString();
    auth.updatedAt = new Date();
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
