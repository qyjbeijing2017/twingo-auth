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
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizeDTO } from './dto/authorize.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upoload.dto';

const authDesc = `Please Leave empty in Swagger UI,Use lock icon on the top-right to authorize, authorize is Nakama session token, e.g. 'Bearer ' + session.token, but in swagger UI you don't need to add 'Bearer '`;

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

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'avatar file',
    type: FileUploadDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: authDesc,
    required: false,
  })
  @Post('avatar')
  avatar(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.avatar(token, file);
  }

  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'profile file',
    type: FileUploadDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: authDesc,
    required: false,
  })
  @Post('profile')
  profile(
    @Headers('Authorization') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.profile(token, file);
  }
}
