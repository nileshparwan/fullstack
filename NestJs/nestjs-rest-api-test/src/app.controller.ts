import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // the controller is where we have the methods 

  constructor(
    private readonly appService: AppService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Header('Content-Type','text/html') // custom header
  getUserName(): { name: string } {
    return {
      name: "Koshal"
    }
  }
}
