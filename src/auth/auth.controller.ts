import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthorizeDTO } from './dto/authorize.dto';
import { FileInterceptor } from '@nestjs/platform-express';

const authDesc = `Nakama session token, start with authType, with format:
device:<deviceId>
email:{"email": "<email>","password": "<password>"}
facebook:<facebookToken>
google:<googleToken>
phone:<customToken>
apple:<appleToken>`;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get('verify-code')
  @ApiQuery({ name: 'phone', required: true })
  verifyCode(@Query('phone') phone) {
    return this.appService.verifyCode(phone);
  }

  @Post('authorize')
  authorize(@Body() { phone, code }: AuthorizeDTO) {
    return this.appService.authorize(phone, code);
  }

  @Post('avatar')
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: authDesc,
  })
  @UseInterceptors(FileInterceptor('file'))
  avatar(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.avatar(token, file);
  }

  @Post('profile')
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: authDesc,
  })
  @UseInterceptors(FileInterceptor('file'))
  profile(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.profile(token, file);
  }
}
