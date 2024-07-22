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
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeDTO } from './dto/authorize.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upoload.dto';

const authDesc = `Nakama session token, start with "authType:", total type: device, email, facebook, google, phone, apple,  e.g. 'email:{"email":"your_email","password":"your_password"}', 'phone:custom_id', 'device:device_id', 'apple:apple_id'`;

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
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: authDesc,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'avatar file',
    type: FileUploadDto,
  })
  avatar(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.avatar(token, file);
  }

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: authDesc,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'profile file',
    type: FileUploadDto,
  })
  profile(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.profile(token, file);
  }
}
