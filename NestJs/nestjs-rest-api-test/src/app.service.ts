import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // here we can have all the logic and we call the logic inside the controller

  getHello(): string {
    return 'Hello World!';
  }

}
