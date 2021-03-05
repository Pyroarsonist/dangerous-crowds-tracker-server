import { Controller, Get } from '@nestjs/common';
import { version } from 'package.json';

@Controller()
export class HealthzController {
  @Get()
  healthz(): { version: string } {
    return { version };
  }
}
