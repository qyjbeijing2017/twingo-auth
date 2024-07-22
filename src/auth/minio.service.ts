import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinIOService {
  readonly minio: Client = new Client({
    endPoint: process.env.MINIO_SERVER_HOST ?? 'localhost',
    port: parseInt(process.env.MINIO_SERVER_PORT ?? '9000'),
    useSSL:
      process.env.MINIO_SERVER_SSL &&
      process.env.MINIO_SERVER_SSL.toLowerCase() === 'true',
    accessKey: process.env.MINIO_SERVER_ACCESS_KEY ?? 'defaultkey',
    secretKey: process.env.MINIO_SERVER_SECRET_KEY ?? 'defaultsecret',
  });
}
