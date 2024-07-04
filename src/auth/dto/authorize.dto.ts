import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeDTO {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  code: string;
}
