"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const create_event_dto_1 = require("./create-event.dto");
const update_event_dto_1 = require("./update-event.dto");
const event_entity_1 = require("./event.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let EventsController = exports.EventsController = EventsController_1 = class EventsController {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(EventsController_1.name);
    }
    async findAll() {
        this.logger.log(`Hit the findAll route`);
        const events = await this.repository.find();
        this.logger.debug(`Found ${events.length} events`);
        return events;
    }
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{
                    id: (0, typeorm_1.MoreThan)(3),
                }, {
                    description: (0, typeorm_1.Like)("%meet%")
                }],
            take: 2,
            order: {
                id: 'DESC'
            }
        });
    }
    async findOne(id) {
        const event = await this.repository.findOneBy({ id });
        if (!event) {
            throw new common_1.NotFoundException();
        }
        return event;
    }
    async create(input) {
        return await this.repository.save(Object.assign(Object.assign({}, input), { when: `${new Date(input.when)}` }));
    }
    async update(id, input) {
        const event = await this.repository.findOne(id);
        return this.repository.save(Object.assign(Object.assign(Object.assign({}, event), input), { when: input.when ? `${new Date(input.when)}` : `${event.when}` }));
    }
    async remove(id) {
        const event = await this.repository.findOne(id);
        if (!event) {
            throw new common_1.NotFoundException();
        }
        await this.repository.remove(event);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/practice"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "practice", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "remove", null);
exports.EventsController = EventsController = EventsController_1 = __decorate([
    (0, common_1.Controller)('/api/events'),
    __param(0, (0, typeorm_2.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], EventsController);
//# sourceMappingURL=event.controller.js.map