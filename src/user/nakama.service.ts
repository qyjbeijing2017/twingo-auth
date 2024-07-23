import { Client, Session } from '@heroiclabs/nakama-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NakamaService {
  readonly client: Client = new Client(
    process.env.NAKAMA_SERVER_KEY ?? 'defaultkey',
    process.env.NAKAMA_SERVER_HOST ?? 'localhost',
    process.env.NAKAMA_SERVER_PORT ?? '7350',
    process.env.NAKAMA_SERVER_SSL &&
      process.env.NAKAMA_SERVER_SSL.toLowerCase() === 'true',
  );

  session(author: string) {
    const [, token] = author.split(' ');
    return new Session(token, '', false);
  }
}
