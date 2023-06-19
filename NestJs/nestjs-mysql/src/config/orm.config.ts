import { Event } from "src/events/event.entity";
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from "@nestjs/config";
import { Attendee } from "src/events/attendee.entity";

export default registerAs('orm.config', ():TypeOrmModuleOptions =>({
    type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_POST),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Event, Attendee],
      synchronize: true
}))