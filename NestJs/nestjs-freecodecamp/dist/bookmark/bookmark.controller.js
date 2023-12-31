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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkController = void 0;
const common_1 = require("@nestjs/common");
const bookmark_service_1 = require("./bookmark.service");
const guard_1 = require("../auth/guard");
const decorator_1 = require("../auth/decorator");
const dto_1 = require("./dto");
let BookMarkController = exports.BookMarkController = class BookMarkController {
    constructor(bookmarkservice) {
        this.bookmarkservice = bookmarkservice;
    }
    getBookmarks(userId) {
        return this.bookmarkservice.getBookmarks(userId);
    }
    createBookmark(userId, dto) {
        return this.bookmarkservice.createBookmark(userId, dto);
    }
    getBookmarkById(userId, bookmarkId) {
        return this.bookmarkservice.getBookmarkById(userId, bookmarkId);
    }
    editBookmarkById(userId, bookmarkId, dto) {
        return this.bookmarkservice.editBookmarkById(userId, bookmarkId, dto);
    }
    deleteBookmarkById(userId, bookmarkId) {
        return this.bookmarkservice.deleteBookmarkById(userId, bookmarkId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorator_1.GetUser)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookMarkController.prototype, "getBookmarks", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, decorator_1.GetUser)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateBookmarkDto]),
    __metadata("design:returntype", void 0)
], BookMarkController.prototype, "createBookmark", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, decorator_1.GetUser)("id")),
    __param(1, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], BookMarkController.prototype, "getBookmarkById", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, decorator_1.GetUser)("id")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.EditBookmarkDto]),
    __metadata("design:returntype", void 0)
], BookMarkController.prototype, "editBookmarkById", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, decorator_1.GetUser)("id")),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], BookMarkController.prototype, "deleteBookmarkById", null);
exports.BookMarkController = BookMarkController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)("bookmarks"),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService])
], BookMarkController);
//# sourceMappingURL=bookmark.controller.js.map