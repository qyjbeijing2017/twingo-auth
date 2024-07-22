import { Client } from '@heroiclabs/nakama-js';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class NakamaService {
  readonly client: Client = new Client(
    process.env.NAKAMA_SERVER_KEY ?? 'defaultkey',
    process.env.NAKAMA_SERVER_HOST ?? 'localhost',
    process.env.NAKAMA_SERVER_PORT ?? '7350',
    process.env.NAKAMA_SERVER_SSL &&
      process.env.NAKAMA_SERVER_SSL.toLowerCase() === 'true',
  );

  session(token: string) {
    try {
      if (token.startsWith('device:')) {
        return this.client.authenticateDevice(
          token.replace('device:', ''),
          false,
        );
      } else if (token.startsWith('email:')) {
        const { email, password } = JSON.parse(token.replace('email:', ''));
        return this.client.authenticateEmail(email, password, false);
      } else if (token.startsWith('facebook:')) {
        return this.client.authenticateFacebook(
          token.replace('facebook:', ''),
          false,
        );
      } else if (token.startsWith('google:')) {
        return this.client.authenticateGoogle(
          token.replace('google:', ''),
          false,
        );
      } else if (token.startsWith('phone:')) {
        return this.client.authenticateCustom(
          token.replace('phone:', ''),
          false,
        );
      } else if (token.startsWith('apple:')) {
        return this.client.authenticateApple(
          token.replace('apple:', ''),
          false,
        );
      } else {
        throw new BadRequestException('Invalid auth type');
      }
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
