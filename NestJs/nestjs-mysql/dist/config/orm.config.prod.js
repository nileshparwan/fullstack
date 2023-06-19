"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_entity_1 = require("../events/event.entity");
const config_1 = require("@nestjs/config");
const attendee_entity_1 = require("../events/attendee.entity");
exports.default = (0, config_1.registerAs)('orm.config', () => ({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_POST),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [event_entity_1.Event, attendee_entity_1.Attendee],
    synchronize: false
}));
//# sourceMappingURL=orm.config.prod.js.map