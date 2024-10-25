import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check if the API is online' })
  @ApiResponse({ status: 200, description: 'API is online' })
  checkHealth() {
    return { status: 'API is online' };
  }
}
