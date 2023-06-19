import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppJanpanService {

    constructor(
        @Inject("APP_NAME")
        private readonly name: string,
        @Inject("MESSAGE")
        private readonly message: string
      ) {
    
      }

    getHello():string {
        console.log(process.env.DB_HOST);
        return `Japanese now from ${this.name}, ${this.message}`
    }
}