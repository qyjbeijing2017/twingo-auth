import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthorizeDTO } from './dto/authorize.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get('verify-code')
  @ApiQuery({ name: 'phone', required: true })
  verifyCode(@Query('phone') phone) {
    console.log(phone);
    return this.appService.verifyCode(phone);
  }

  @Post('authorize')
  authorize(@Body() { phone, code }: AuthorizeDTO) {
    return this.appService.authorize(phone, code);
  }
}
