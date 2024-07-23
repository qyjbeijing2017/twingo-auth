import {
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload';
import { UserService } from './user.service';

const authDesc = `Please Leave empty in Swagger UI,Use lock icon on the top-right to authorize, authorize is Nakama session token, e.g. 'Bearer ' + session.token, but in swagger UI you don't need to add 'Bearer '`;

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    return this.userService.avatar(token, file);
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
    return this.userService.profile(token, file);
  }
}
