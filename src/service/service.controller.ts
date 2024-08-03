import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ServiceService } from './service.service';


@ApiTags('auth')
@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get('email-verify-code')
    @ApiQuery({ name: 'to', required: true })
    @ApiQuery({ name: 'username', required: true })
    async varifyEmail(@Query('to')to: string, @Query('username')username: string) {
        return this.serviceService.varifyEmail(to, username);
    }
}
