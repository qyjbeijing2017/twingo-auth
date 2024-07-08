import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CodeGateway
  implements OnGatewayDisconnect<Socket>, OnGatewayConnection<Socket>
{
  readonly sockets: Socket[] = [];

  handleDisconnect(client: Socket) {
    this.sockets.splice(this.sockets.indexOf(client), 1);
  }
  handleConnection(client: Socket) {
    this.sockets.push(client);
  }

  codeSent(phone: string, code: string) {
    this.sockets.forEach((socket) => {
      socket.emit('codeSent', { phone, code });
    });
  }

  @WebSocketServer()
  server: Server;
}
